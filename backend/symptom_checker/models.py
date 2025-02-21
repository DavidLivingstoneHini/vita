from django.db import models


class Symptom(models.Model):
    name = models.CharField(max_length=255)
    weight = models.IntegerField(default=1)  # Weight for symptom matching

    def __str__(self):
        return self.name


class Disease(models.Model):
    name = models.CharField(max_length=255)
    symptoms = models.ManyToManyField(Symptom, through='DiseaseSymptom', blank=True)
    description = models.TextField(blank=True)
    treatment = models.TextField(blank=True)
    do_term = models.ForeignKey('DO_Term', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return self.name


class DiseaseSymptom(models.Model):
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE)
    symptom = models.ForeignKey(Symptom, on_delete=models.CASCADE)
    weight = models.IntegerField(default=1)  # Weight for disease-symptom relation

    def __str__(self):
        return f"{self.disease.name} - {self.symptom.name}"


class Diagnosis(models.Model):
    user = models.ForeignKey('user_auth.User', on_delete=models.CASCADE)
    diseases = models.ManyToManyField(Disease, through='DiagnosisDisease', blank=True)
    symptoms = models.ManyToManyField(Symptom, blank=True)

    def __str__(self):
        return f"Diagnosis for {self.user.username}"


class DiagnosisDisease(models.Model):
    diagnosis = models.ForeignKey(Diagnosis, on_delete=models.CASCADE)
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE)
    confidence_score = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.diagnosis.user.username} - {self.disease.name}"


class DO_Term(models.Model):
    do_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    definition = models.TextField(blank=True)

    def __str__(self):
        return self.name


class DO_Relationship(models.Model):
    do_term = models.ForeignKey(DO_Term, on_delete=models.CASCADE)
    relationship_type = models.CharField(max_length=255)
    related_do_term = models.ForeignKey(DO_Term, on_delete=models.CASCADE, related_name='related_do_term')

    def __str__(self):
        return f"{self.do_term.name} - {self.relationship_type} - {self.related_do_term.name}"
