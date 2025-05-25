from collections import defaultdict

from rest_framework import generics, status
from rest_framework.response import Response
from django.db.models import Q
from .models import (Symptom, Disease, Diagnosis, DO_Term,
                     DiagnosisDisease, DiagnosisSymptom, SymptomDOTermMapping, DO_Relationship)
from .serializers import (SymptomSerializer, DiseaseSerializer,
                          DiagnosisSerializer, DO_TermSerializer,
                          DiseaseDetailSerializer)
import logging
from sklearn.metrics.pairwise import cosine_similarity
import spacy

logger = logging.getLogger(__name__)
nlp = spacy.load("en_core_web_md")


class SymptomListView(generics.ListAPIView):
    queryset = Symptom.objects.all()
    serializer_class = SymptomSerializer

    def get_queryset(self):
        try:
            return super().get_queryset()
        except Exception as e:
            logger.error(f"Error fetching symptoms: {str(e)}")
            return Symptom.objects.none()


class DiseaseListView(generics.ListAPIView):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer

    def get_queryset(self):
        try:
            return super().get_queryset()
        except Exception as e:
            logger.error(f"Error fetching diseases: {str(e)}")
            return Disease.objects.none()


class DiseaseDetailView(generics.RetrieveAPIView):
    queryset = Disease.objects.all()
    serializer_class = DiseaseDetailSerializer

    def get_object(self):
        try:
            return super().get_object()
        except Exception as e:
            logger.error(f"Error fetching disease details: {str(e)}")
            raise


class DO_TermListView(generics.ListAPIView):
    serializer_class = DO_TermSerializer

    def get_queryset(self):
        try:
            return DO_Term.objects.filter(is_obsolete=False)
        except Exception as e:
            logger.error(f"Error fetching DO terms: {str(e)}")
            return DO_Term.objects.none()


class SymptomCheckerView(generics.CreateAPIView):
    serializer_class = DiagnosisSerializer

    def post(self, request, *args, **kwargs):
        try:
            symptom_ids = request.data.get('symptoms', [])

            if not symptom_ids:
                return Response(
                    {"error": "At least one symptom is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            symptoms = Symptom.objects.filter(id__in=symptom_ids)
            if not symptoms.exists():
                return Response(
                    {"error": "None of the provided symptoms exist"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            diagnosis = Diagnosis.objects.create(user=request.user)

            # Add symptoms to diagnosis
            for symptom in symptoms:
                DiagnosisSymptom.objects.create(
                    diagnosis=diagnosis,
                    symptom=symptom
                )

            # Enhanced disease matching
            potential_diseases = self.find_potential_diseases(diagnosis)

            # Format response
            formatted_diseases = []
            for disease_info in potential_diseases:
                disease = disease_info['disease']
                confidence = disease_info['confidence']
                matches = disease_info['matches']

                serializer = DiseaseSerializer(disease)
                formatted_diseases.append({
                    "disease": serializer.data,
                    "confidence_score": confidence,
                    "matches": matches
                })

            return Response({
                "diagnosis_id": diagnosis.id,
                "potential_diseases": formatted_diseases,
                "count": len(formatted_diseases)
            })

        except Exception as e:
            logger.error(f"Error in symptom check: {str(e)}", exc_info=True)
            return Response(
                {"error": "An error occurred while processing your request"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def find_potential_diseases(self, diagnosis):
        # Get all symptoms for this diagnosis
        diagnosis_symptoms = DiagnosisSymptom.objects.filter(diagnosis=diagnosis)

        # Step 1: Direct mappings
        direct_mappings = SymptomDOTermMapping.objects.filter(
            symptom__in=[ds.symptom for ds in diagnosis_symptoms]
        ).select_related('do_term')

        # Step 2: Find diseases with these DO terms
        disease_scores = defaultdict(lambda: {
            'disease': None,
            'score': 0,
            'matches': []
        })

        # Score diseases based on direct mappings
        for mapping in direct_mappings:
            diseases = Disease.objects.filter(do_term=mapping.do_term)
            for disease in diseases:
                disease_info = disease_scores[disease.id]
                disease_info['disease'] = disease

                # Calculate score contribution
                symptom = mapping.symptom
                diagnosis_symptom = next(
                    (ds for ds in diagnosis_symptoms if ds.symptom_id == symptom.id),
                    None
                )

                intensity = diagnosis_symptom.intensity if diagnosis_symptom else 1
                score = intensity * mapping.confidence * symptom.weight

                disease_info['score'] += score
                disease_info['matches'].append({
                    'symptom': symptom.name,
                    'do_term': mapping.do_term.name,
                    'contribution': score,
                    'type': 'direct'
                })

        # Step 3: Consider related DO terms (disease relationships)
        for mapping in direct_mappings:
            relationships = DO_Relationship.objects.filter(
                Q(do_term=mapping.do_term) | Q(related_do_term=mapping.do_term)
            ).select_related('do_term', 'related_do_term')

            for rel in relationships:
                related_do = rel.related_do_term if rel.do_term == mapping.do_term else rel.do_term
                diseases = Disease.objects.filter(do_term=related_do)

                for disease in diseases:
                    disease_info = disease_scores[disease.id]
                    disease_info['disease'] = disease

                    # Calculate relationship weight
                    rel_weight = {
                        'is_a': 0.7,
                        'part_of': 0.6,
                        'subclass_of': 0.5,
                        'related_to': 0.4
                    }.get(rel.relationship_type, 0.3)

                    symptom = mapping.symptom
                    diagnosis_symptom = next(
                        (ds for ds in diagnosis_symptoms if ds.symptom_id == symptom.id),
                        None
                    )

                    intensity = diagnosis_symptom.intensity if diagnosis_symptom else 1
                    score = intensity * mapping.confidence * symptom.weight * rel_weight

                    disease_info['score'] += score
                    disease_info['matches'].append({
                        'symptom': symptom.name,
                        'do_term': mapping.do_term.name,
                        'relationship': rel.get_relationship_type_display(),
                        'related_do_term': related_do.name,
                        'contribution': score,
                        'type': 'related'
                    })

        # Step 4: Normalize and sort results
        max_score = max([d['score'] for d in disease_scores.values()]) if disease_scores else 1
        potential_diseases = []

        for disease_id, disease_info in disease_scores.items():
            confidence = (disease_info['score'] / max_score) * 100
            if confidence < 10:  # Threshold to filter out very low confidence matches
                continue

            potential_diseases.append({
                'disease': disease_info['disease'],
                'confidence': min(confidence, 100),
                'matches': disease_info['matches']
            })

        # Sort by confidence descending
        return sorted(potential_diseases, key=lambda x: -x['confidence'])[:15]  # Return top 15 matches


class SymptomSearchView(generics.ListAPIView):
    serializer_class = SymptomSerializer

    def get_queryset(self):
        try:
            query = self.request.query_params.get('q', '').strip().lower()
            if not query:
                return Symptom.objects.none()

            logger.info(f"Searching symptoms for query: {query}")

            # First try exact match (case insensitive)
            exact_match = Symptom.objects.filter(name__iexact=query).first()
            if exact_match:
                return Symptom.objects.filter(id=exact_match.id)

            # If no exact match, try contains search with higher weight for beginning matches
            starts_with = Symptom.objects.filter(name__istartswith=query)
            contains = Symptom.objects.filter(name__icontains=query).exclude(id__in=starts_with.values('id'))

            # Combine results with starts_with first
            results = list(starts_with) + list(contains)

            # If still no results, try fuzzy matching with simple similarity
            if not results and len(query) > 3:
                all_symptoms = Symptom.objects.all()
                for symptom in all_symptoms:
                    if self.simple_similarity(query, symptom.name.lower()) > 0.8:
                        results.append(symptom)
                        break  # Just get the first fuzzy match

            return results[:20]  # Limit to 20 results

        except Exception as e:
            logger.error(f"Error in symptom search: {str(e)}")
            return Symptom.objects.none()

    def simple_similarity(self, query, symptom_name):
        """Basic similarity check without NLP"""
        query_words = set(query.split())
        symptom_words = set(symptom_name.split())
        intersection = query_words & symptom_words
        return len(intersection) / max(len(query_words), 1)