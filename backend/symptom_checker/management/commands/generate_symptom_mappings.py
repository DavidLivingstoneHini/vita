from django.core.management.base import BaseCommand
from symptom_checker.models import Symptom, DO_Term, SymptomDOTermMapping
from sklearn.metrics.pairwise import cosine_similarity
import spacy

nlp = spacy.load("en_core_web_md")  # Medium model for better accuracy


class Command(BaseCommand):
    help = 'Generate symptom-DO term mappings using NLP'

    def handle(self, *args, **options):
        symptoms = Symptom.objects.all()
        do_terms = DO_Term.objects.filter(is_obsolete=False)

        for symptom in symptoms:
            symptom_doc = nlp(symptom.name.lower())

            # Find top 3 most similar DO terms
            similarities = []
            for do_term in do_terms:
                term_doc = nlp(do_term.name.lower())
                similarity = cosine_similarity(
                    [symptom_doc.vector],
                    [term_doc.vector]
                )[0][0]
                similarities.append((do_term, similarity))

            # Sort by similarity and take top 3
            top_matches = sorted(similarities, key=lambda x: -x[1])[:3]

            # Create mappings with confidence scores
            for do_term, similarity in top_matches:
                if similarity > 0.6:  # Only create if similarity is above threshold
                    SymptomDOTermMapping.objects.get_or_create(
                        symptom=symptom,
                        do_term=do_term,
                        defaults={'confidence': similarity}
                    )