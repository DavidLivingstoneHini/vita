from django.db import models


class Symptom(models.Model):
    name = models.CharField(max_length=255)
    weight = models.IntegerField(default=1)

    def __str__(self):
        return self.name


class DO_Term(models.Model):
    do_id = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    definition = models.TextField(blank=True)
    is_obsolete = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.do_id}: {self.name}"


class DO_Relationship(models.Model):
    RELATIONSHIP_TYPES = [
        ('is_a', 'Is a'),
        ('part_of', 'Part of'),
        ('related_to', 'Related to'),
        ('subclass_of', 'Subclass of'),
    ]

    do_term = models.ForeignKey(DO_Term, on_delete=models.CASCADE, related_name='outgoing_relationships')
    relationship_type = models.CharField(max_length=50, choices=RELATIONSHIP_TYPES)
    related_do_term = models.ForeignKey(DO_Term, on_delete=models.CASCADE, related_name='incoming_relationships')

    class Meta:
        unique_together = ('do_term', 'relationship_type', 'related_do_term')

    def __str__(self):
        return f"{self.do_term.do_id} {self.get_relationship_type_display()} {self.related_do_term.do_id}"


class SymptomDOTermMapping(models.Model):
    symptom = models.ForeignKey(Symptom, on_delete=models.CASCADE)
    do_term = models.ForeignKey(DO_Term, on_delete=models.CASCADE)
    confidence = models.FloatField(default=0.8)

    class Meta:
        unique_together = ('symptom', 'do_term')

    def __str__(self):
        return f"{self.symptom.name} → {self.do_term.do_id} (confidence: {self.confidence})"


class Disease(models.Model):
    name = models.CharField(max_length=255)
    do_term = models.ForeignKey(DO_Term, on_delete=models.SET_NULL, null=True, blank=True)
    description = models.TextField(blank=True)
    treatment = models.TextField(blank=True)

    def __str__(self):
        return self.name


class Diagnosis(models.Model):
    user = models.ForeignKey('user_auth.User', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Diagnosis for {self.user.username} on {self.created_at}"


class DiagnosisSymptom(models.Model):
    diagnosis = models.ForeignKey(Diagnosis, on_delete=models.CASCADE)
    symptom = models.ForeignKey(Symptom, on_delete=models.CASCADE)
    intensity = models.IntegerField(default=1)

    def __str__(self):
        return f"{self.diagnosis.id} - {self.symptom.name} (intensity: {self.intensity})"


class DiagnosisDisease(models.Model):
    diagnosis = models.ForeignKey(Diagnosis, on_delete=models.CASCADE)
    disease = models.ForeignKey(Disease, on_delete=models.CASCADE)
    confidence_score = models.FloatField(default=0.0)

    def __str__(self):
        return f"{self.diagnosis.id} - {self.disease.name} (confidence: {self.confidence_score}%)"

class PatientMedicalHistory(models.Model):
    user = models.ForeignKey('user_auth.User', on_delete=models.CASCADE)
    condition = models.CharField(max_length=255)
    diagnosed = models.DateField()
    notes = models.TextField(blank=True)

class PatientSymptomHistory(models.Model):
    user = models.ForeignKey('user_auth.User', on_delete=models.CASCADE)
    symptom = models.ForeignKey(Symptom, on_delete=models.CASCADE)
    first_noticed = models.DateField()
    frequency = models.CharField(max_length=100)  # e.g., "daily", "weekly"