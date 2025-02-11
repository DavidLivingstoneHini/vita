from rest_framework import serializers
from.models import Symptom, Disease, Diagnosis, DiseaseSymptom, DiagnosisDisease

class SymptomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptom
        fields = ['id', 'name', 'weight']

class DiseaseSerializer(serializers.ModelSerializer):
    symptoms = serializers.SerializerMethodField()

    class Meta:
        model = Disease
        fields = ['id', 'name', 'symptoms', 'description']

    def get_symptoms(self, obj):
        return SymptomSerializer(obj.symptoms.all(), many=True).data

class DiagnosisSerializer(serializers.ModelSerializer):
    diseases = serializers.SerializerMethodField()

    class Meta:
        model = Diagnosis
        fields = ['id', 'user', 'diseases', 'symptoms']

    def get_diseases(self, obj):
        diseases = []
        for dd in obj.diseases.through.objects.filter(diagnosis=obj):
            diseases.append({
                'disease': DiseaseSerializer(dd.disease).data,
                'confidence_score': dd.confidence_score
            })
        return diseases

class DiseaseDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disease
        fields = ['id', 'name', 'description', 'symptoms']

class SymptomDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptom
        fields = ['id', 'name', 'weight']

class ConditionDetailSerializer(serializers.ModelSerializer):
    symptoms = SymptomSerializer(many=True, read_only=True)
    class Meta:
        model = Disease
        fields = ['id', 'name', 'description', 'symptoms', 'treatment']

