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
                return Response(
                    {"error": f"Some symptoms not found: {missing_ids}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            diagnosis = Diagnosis.objects.create(user=request.user)

            # Add symptoms to diagnosis
            for symptom in symptoms:
                DiagnosisSymptom.objects.create(
                    diagnosis=diagnosis,
                    symptom=symptom
                )

            # Find potential diseases
            potential_diseases = self.find_potential_diseases(diagnosis)

            # Format the response to match frontend expectations
            response_data = {
                "data": {
                    "diagnosis_id": diagnosis.id,
                    "potential_diseases": [
                        {
                            "disease": DiseaseSerializer(disease_info['disease']).data,
                            "confidence_score": disease_info['confidence'],
                            "matches": disease_info.get('matches', [])
                        }
                        for disease_info in potential_diseases
                    ],
                    "count": len(potential_diseases)
                }
            }

            return Response(response_data, status=status.HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error in symptom check: {str(e)}", exc_info=True)
            return Response(
                {"error": "An error occurred while processing your request"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


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