from rest_framework import generics, status
from rest_framework.response import Response
from .models import Symptom, Disease, Diagnosis, DO_Term, DiagnosisDisease
from .serializers import SymptomSerializer, DiseaseSerializer, DiagnosisSerializer, DO_TermSerializer, ConditionDetailSerializer
from django.db.models import Sum, Q
import spacy
from sklearn.metrics.pairwise import cosine_similarity

# Load pre-trained Spacy English Medical Model
# nlp = spacy.load("en_core_medlg")
nlp = spacy.load("en_core_web_lg")

class SymptomListView(generics.ListAPIView):
    queryset = Symptom.objects.all()
    serializer_class = SymptomSerializer

class DiseaseListView(generics.ListAPIView):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer

class DiseaseDetailView(generics.RetrieveAPIView):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer

class SymptomDetailView(generics.RetrieveAPIView):
    queryset = Symptom.objects.all()
    serializer_class = SymptomSerializer

class SymptomCheckerView(generics.CreateAPIView):
    serializer_class = DiagnosisSerializer

    def perform_create(self, serializer):
        try:
            diagnosis_obj = serializer.save()  # Create a Diagnosis instance
            symptoms = serializer.validated_data['symptoms']
            potential_diseases = self.get_potential_diseases(symptoms)
            for disease, confidence_score in potential_diseases:
                DiagnosisDisease.objects.create(diagnosis=diagnosis_obj, disease=disease, confidence_score=confidence_score)
        except Exception as e:
            # Log the error and return a response
            print(e)  # Replace with logging
            return Response({"error": str(e)}, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_potential_diseases(self, symptoms):
        symptom_to_do_id_mapping = self.symptom_to_do_id(symptoms)

        do_terms = DO_Term.objects.filter(do_id__in=symptom_to_do_id_mapping.values())

        diseases = Disease.objects.filter(do_term__in=do_terms)

        potential_diseases = []
        for disease in diseases:
            confidence_score = self.calculate_confidence_score(disease, symptom_to_do_id_mapping)
            potential_diseases.append((disease, confidence_score))

        return sorted(potential_diseases, key=lambda x: x[1], reverse=True)

    def symptom_to_do_id(self, symptoms):
        symptom_to_do_id_mapping = {}

        for symptom in symptoms:
            symptom_text = nlp(symptom)
            symptom_embedding = symptom_text.vector

            similarities = []
            for do_term in DO_Term.objects.all():
                do_term_text = nlp(do_term.name)
                do_term_embedding = do_term_text.vector
                similarity = cosine_similarity([symptom_embedding], [do_term_embedding])
                similarities.append((do_term.do_id, similarity))

            top_matches = sorted(similarities, key=lambda x: x[1], reverse=True)[:3]
            symptom_to_do_id_mapping[symptom] = [match[0] for match in top_matches]

        return symptom_to_do_id_mapping

    def calculate_confidence_score(self, disease, symptom_to_do_id_mapping):
        matching_symptoms = 0
        total_weight = 0

        for symptom, do_ids in symptom_to_do_id_mapping.items():
            if disease.do_term.do_id in do_ids:
                matching_symptoms += 1
                total_weight += disease.do_term.weight

        confidence_score = (matching_symptoms / len(symptom_to_do_id_mapping)) * (total_weight / disease.do_term.related_do_term.aggregate(Sum('weight'))['weight__sum'])
        return confidence_score

class DO_TermListView(generics.ListAPIView):
    queryset = DO_Term.objects.all()
    serializer_class = DO_TermSerializer

class DO_TermDetailView(generics.RetrieveAPIView):
    queryset = DO_Term.objects.all()
    serializer_class = DO_TermSerializer

class SymptomCheckerDisclaimerView(generics.GenericAPIView):
    def get(self, request):
        disclaimer = "This symptom checker is for informational purposes only. Consult a doctor for accurate diagnosis and treatment."
        return Response({'disclaimer': disclaimer})

class ConditionDetailView(generics.RetrieveAPIView):
    queryset = Disease.objects.all()
    serializer_class = ConditionDetailSerializer
    lookup_field = 'pk'
    lookup_url_kwarg = 'condition_id'

class SymptomSearchView(generics.ListAPIView):
    serializer_class = SymptomSerializer

    def get_queryset(self):
        query = self.request.query_params.get('q')
        if query:
            return Symptom.objects.filter(name__icontains=query)
        return Symptom.objects.none()
