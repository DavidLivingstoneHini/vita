from django.db import models

class Symptom(models.Model):
    name = models.CharField(max_length=255)

class Disease(models.Model):
    name = models.CharField(max_length=255)
    symptoms = models.ManyToManyField(Symptom, blank=True)

class Diagnosis(models.Model):
    user = models.ForeignKey('user_auth.User', on_delete=models.CASCADE)
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE)
    symptoms = models.ManyToManyField(Symptom, blank=True)
