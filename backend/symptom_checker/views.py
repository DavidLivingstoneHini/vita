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
            logger.info(f"Received symptom IDs: {symptom_ids}")

            if not symptom_ids:
                return Response(
                    {"error": "At least one symptom is required"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Convert all IDs to integers
            try:
                symptom_ids = [int(id) for id in symptom_ids]
            except (ValueError, TypeError):
                return Response(
                    {"error": "All symptom IDs must be integers"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Verify all symptoms exist
            symptoms = Symptom.objects.filter(id__in=symptom_ids)
            found_ids = set(symptoms.values_list('id', flat=True))
            missing_ids = set(symptom_ids) - found_ids

            if missing_ids:
                logger.warning(f"Missing symptom IDs: {missing_ids}")
                # Only proceed with found symptoms
                symptom_ids = list(found_ids)
                if not symptom_ids:
                    return Response(
                        {"error": "None of the provided symptoms exist"},
                        status=status.HTTP_400_BAD_REQUEST
                    )

            diagnosis = Diagnosis.objects.create(user=request.user)
            logger.info(f"Created diagnosis with ID: {diagnosis.id}")

            # Add symptoms to diagnosis
            for symptom in symptoms:
                DiagnosisSymptom.objects.create(
                    diagnosis=diagnosis,
                    symptom=symptom
                )

            # Find potential diseases
            potential_diseases = self.find_potential_diseases(diagnosis)
            logger.info(f"Found {len(potential_diseases)} potential diseases")

            # Format the response properly
            formatted_diseases = []
            for disease_info in potential_diseases:
                try:
                    disease = disease_info.get('disease')
                    confidence = disease_info.get('confidence', 0)

                    if not disease:
                        continue

                    serializer = DiseaseSerializer(disease)
                    formatted_diseases.append({
                        "disease": serializer.data,
                        "confidence_score": confidence,
                        "matches": disease_info.get('matches', [])
                    })
                except Exception as e:
                    logger.error(f"Error serializing disease {disease.id if disease else 'unknown'}: {str(e)}")
                    continue

            return Response(
                {
                    "data": {
                        "diagnosis_id": diagnosis.id,
                        "potential_diseases": formatted_diseases,
                        "count": len(formatted_diseases)
                    }
                },
                status=status.HTTP_200_OK
            )

        except Exception as e:
            logger.error(f"Error in symptom check: {str(e)}", exc_info=True)
            return Response(
                {"error": "An error occurred while processing your request"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def find_potential_diseases(self, diagnosis):
        try:
            symptoms = DiagnosisSymptom.objects.filter(diagnosis=diagnosis)
            logger.debug(f"Found {len(symptoms)} diagnosis symptoms")

            # Get symptom weights and mappings
            symptom_data = []
            for ds in symptoms:
                try:
                    mappings = SymptomDOTermMapping.objects.filter(symptom=ds.symptom)
                    symptom_data.append({
                        'symptom': ds.symptom,
                        'intensity': ds.intensity,
                        'do_terms': [m.do_term for m in mappings]
                    })
                except Exception as e:
                    logger.error(f"Error processing symptom {ds.symptom.id}: {str(e)}")
                    continue

            # Score diseases
            disease_scores = {}
            for data in symptom_data:
                for do_term in data['do_terms']:
                    try:
                        # Direct disease matches
                        diseases = Disease.objects.filter(do_term=do_term)
                        for disease in diseases:
                            if disease.id not in disease_scores:
                                disease_scores[disease.id] = {
                                    'disease': disease,
                                    'score': 0,
                                    'matches': []
                                }
                            # Weight by symptom intensity and mapping confidence
                            mapping = SymptomDOTermMapping.objects.get(
                                symptom=data['symptom'],
                                do_term=do_term
                            )
                            score = data['intensity'] * mapping.confidence
                            disease_scores[disease.id]['score'] += score
                            disease_scores[disease.id]['matches'].append({
                                'symptom': data['symptom'].name,
                                'do_term': do_term.name,
                                'contribution': score
                            })

                        # Related disease matches
                        relationships = DO_Relationship.objects.filter(
                            Q(do_term=do_term) | Q(related_do_term=do_term)
                        )
                        for rel in relationships:
                            related_do = rel.related_do_term if rel.do_term == do_term else rel.do_term
                            diseases = Disease.objects.filter(do_term=related_do)

                            for disease in diseases:
                                if disease.id not in disease_scores:
                                    disease_scores[disease.id] = {
                                        'disease': disease,
                                        'score': 0,
                                        'matches': []
                                    }

                                # Apply relationship weight
                                rel_weight = {
                                    'is_a': 0.7,
                                    'part_of': 0.6,
                                    'subclass_of': 0.5,
                                    'related_to': 0.4
                                }.get(rel.relationship_type, 0.3)

                                score = data['intensity'] * mapping.confidence * rel_weight
                                disease_scores[disease.id]['score'] += score
                                disease_scores[disease.id]['matches'].append({
                                    'symptom': data['symptom'].name,
                                    'do_term': do_term.name,
                                    'relationship': rel.get_relationship_type_display(),
                                    'related_do_term': related_do.name,
                                    'contribution': score
                                })
                    except Exception as e:
                        logger.error(f"Error processing DO term {do_term.id}: {str(e)}")
                        continue

            # Normalize and sort results
            max_score = max([d['score'] for d in disease_scores.values()]) if disease_scores else 1
            potential_diseases = []

            for disease_info in disease_scores.values():
                confidence = (disease_info['score'] / max_score) * 100
                potential_diseases.append({
                    'disease': disease_info['disease'],
                    'confidence': min(confidence, 100),
                    'matches': disease_info['matches']
                })

            return sorted(potential_diseases, key=lambda x: -x['confidence'])[:10]

        except Exception as e:
            logger.error(f"Error in find_potential_diseases: {str(e)}", exc_info=True)
            return []


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