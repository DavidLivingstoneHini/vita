from rest_framework import generics, status
from rest_framework.response import Response
from.models import Symptom, Disease, Diagnosis, DiagnosisDisease, DiseaseSymptom
from .serializers import SymptomSerializer, DiseaseSerializer, DiagnosisSerializer, DiseaseDetailSerializer, \
    SymptomDetailSerializer, ConditionDetailSerializer
from django.db.models import Sum, Q

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
        try:
            symptoms = serializer.validated_data['symptoms']
            potential_diseases = self.get_potential_diseases(symptoms)
            diagnosis = serializer.save()
            for disease, confidence_score in potential_diseases:
                DiagnosisDisease.objects.create(diagnosis=diagnosis, disease=disease, confidence_score=confidence_score)
        except KeyError:
            return Response({"error": "Symptoms not provided"}, status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Log the error and return a response
            print(e)  # Replace with logging
            return Response({"error": "Internal Server Error"}, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get_potential_diseases(self, symptoms):
        diseases = Disease.objects.annotate(
            total_weight=Sum('diseasesymptom__weight', filter=Q(diseasesymptom__symptom__in=symptoms))
        ).filter(total_weight__gt=0)

        potential_diseases = []
        for disease in diseases:
            confidence_score = disease.total_weight / disease.diseasesymptom_set.aggregate(Sum('weight'))['weight__sum']
            potential_diseases.append((disease, confidence_score))

        return sorted(potential_diseases, key=lambda x: x[1], reverse=True)

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
