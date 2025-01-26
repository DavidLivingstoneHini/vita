from rest_framework import generics, status
from rest_framework.response import Response
from.models import Symptom, Disease, Diagnosis, DiagnosisDisease, DiseaseSymptom
from.serializers import SymptomSerializer, DiseaseSerializer, DiagnosisSerializer, DiseaseDetailSerializer, SymptomDetailSerializer

class SymptomListView(generics.ListAPIView):
    queryset = Symptom.objects.all()
    serializer_class = SymptomSerializer

class DiseaseListView(generics.ListAPIView):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer

class DiseaseDetailView(generics.RetrieveAPIView):
    queryset = Disease.objects.all()
    serializer_class = DiseaseDetailSerializer

class SymptomDetailView(generics.RetrieveAPIView):
    queryset = Symptom.objects.all()
    serializer_class = SymptomDetailSerializer

class SymptomCheckerView(generics.CreateAPIView):
    serializer_class = DiagnosisSerializer

    def perform_create(self, serializer):
        symptoms = serializer.validated_data['symptoms']
        potential_diseases = self.get_potential_diseases(symptoms)
        diagnosis = serializer.save()
        for disease, confidence_score in potential_diseases:
            DiagnosisDisease.objects.create(diagnosis=diagnosis, disease=disease, confidence_score=confidence_score)

    def get_potential_diseases(self, symptoms):
        potential_diseases = []
        for disease in Disease.objects.all():
            total_weight = 0
            for symptom in symptoms:
                try:
                    # Directly access DiseaseSymptom to get the weight
                    disease_symptom = DiseaseSymptom.objects.get(disease=disease, symptom=symptom)
                    total_weight += disease_symptom.weight
                except DiseaseSymptom.DoesNotExist:
                    pass
            if total_weight > 0:
                # Calculate confidence score
                disease_symptoms = DiseaseSymptom.objects.filter(disease=disease)
                total_disease_weight = sum([ds.weight for ds in disease_symptoms])
                confidence_score = total_weight / total_disease_weight
                potential_diseases.append((disease, confidence_score))
        return sorted(potential_diseases, key=lambda x: x[1], reverse=True)

class SymptomCheckerDisclaimerView(generics.GenericAPIView):
    def get(self, request):
        disclaimer = "This symptom checker is for informational purposes only. Consult a doctor for accurate diagnosis and treatment."
        return Response({'disclaimer': disclaimer})
