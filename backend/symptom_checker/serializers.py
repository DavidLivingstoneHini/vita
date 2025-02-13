from rest_framework import serializers
from .models import Symptom, Disease, Diagnosis, DiseaseSymptom, DO_Term


class SymptomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptom
        fields = ['id', 'name', 'weight']


class DiseaseSerializer(serializers.ModelSerializer):
    symptoms = serializers.SerializerMethodField()

    class Meta:
        model = Disease
        fields = ['id', 'name', 'symptoms', 'description', 'do_term']

    def get_symptoms(self, obj):
        return SymptomSerializer(obj.symptoms.all(), many=True).data


class DiagnosisSerializer(serializers.ModelSerializer):
    diseases = serializers.SerializerMethodField()

    class Meta:
        model = Diagnosis
        fields = ['id', 'user', 'diseases', 'symptoms']

    def get_diseases(self, obj):
        if isinstance(obj, dict):  # Check if obj is a dict
            return []
        diseases = []
        for dd in obj.diseases.through.objects.filter(diagnosis=obj):
            diseases.append({
                'disease': DiseaseSerializer(dd.disease).data,
                'confidence_score': dd.confidence_score
            })
        return diseases

    def validate(self, data):
        if 'symptoms' not in data:
            raise serializers.ValidationError("Symptoms are required")
        return data

class DO_TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = DO_Term
        fields = ['id', 'do_id', 'name', 'definition']

class ConditionDetailSerializer(serializers.ModelSerializer):
    symptoms = SymptomSerializer(many=True, read_only=True)
    class Meta:
        model = Disease
        fields = ['id', 'name', 'description', 'symptoms', 'treatment']
