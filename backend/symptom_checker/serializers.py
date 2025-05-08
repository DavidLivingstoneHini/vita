from rest_framework import serializers
from django.db.models import Q
from .models import (Symptom, Disease, Diagnosis, DO_Term,
                     DiagnosisDisease, SymptomDOTermMapping, DiagnosisSymptom, DO_Relationship)


class DO_TermSerializer(serializers.ModelSerializer):
    class Meta:
        model = DO_Term
        fields = ['do_id', 'name', 'definition']


class SymptomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Symptom
        fields = ['id', 'name', 'weight']


class SymptomDOTermMappingSerializer(serializers.ModelSerializer):
    symptom = SymptomSerializer()
    do_term = DO_TermSerializer()

    class Meta:
        model = SymptomDOTermMapping
        fields = ['symptom', 'do_term', 'confidence']


class DiseaseSerializer(serializers.ModelSerializer):
    do_term = DO_TermSerializer()

    class Meta:
        model = Disease
        fields = ['id', 'name', 'do_term', 'description', 'treatment']


class DiagnosisSymptomSerializer(serializers.ModelSerializer):
    symptom = SymptomSerializer()

    class Meta:
        model = DiagnosisSymptom
        fields = ['symptom', 'intensity']


class DiagnosisDiseaseSerializer(serializers.ModelSerializer):
    disease = DiseaseSerializer()

    class Meta:
        model = DiagnosisDisease
        fields = ['disease', 'confidence_score']


class DiagnosisSerializer(serializers.ModelSerializer):
    symptoms = DiagnosisSymptomSerializer(many=True, read_only=True)
    potential_diseases = DiagnosisDiseaseSerializer(many=True, read_only=True)

    class Meta:
        model = Diagnosis
        fields = ['id', 'user', 'created_at', 'symptoms', 'potential_diseases']


class DiseaseDetailSerializer(serializers.ModelSerializer):
    do_term = DO_TermSerializer()
    related_diseases = serializers.SerializerMethodField()

    class Meta:
        model = Disease
        fields = ['id', 'name', 'do_term', 'description', 'treatment', 'related_diseases']

    def get_related_diseases(self, obj):
        if not obj.do_term:
            return []

        related_do_terms = DO_Relationship.objects.filter(
            Q(do_term=obj.do_term) | Q(related_do_term=obj.do_term)
        ).values_list('do_term_id', 'related_do_term_id')

        related_do_ids = set()
        for do1, do2 in related_do_terms:
            if do1 != obj.do_term.id:
                related_do_ids.add(do1)
            if do2 != obj.do_term.id:
                related_do_ids.add(do2)

        related_diseases = Disease.objects.filter(do_term_id__in=related_do_ids)
        return DiseaseSerializer(related_diseases, many=True).data