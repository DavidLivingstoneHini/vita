from rest_framework import generics
from.models import Symptom, Disease
from .serializers import SymptomSerializer, DiseaseSerializer, DiagnosisSerializer


class SymptomListView(generics.ListAPIView):
    queryset = Symptom.objects.all()
    serializer_class = SymptomSerializer

class DiseaseListView(generics.ListAPIView):
    queryset = Disease.objects.all()
    serializer_class = DiseaseSerializer

class SymptomCheckerView(generics.CreateAPIView):
    serializer_class = DiagnosisSerializer

    def perform_create(self, serializer):
        # Simple symptom checking logic (replace with your own)
        symptoms = serializer.validated_data['symptoms']
        disease = Disease.objects.filter(symptoms__in=symptoms).first()
        if disease:
            serializer.save(disease=disease)
        else:
            # Handle unknown disease case
            pass
