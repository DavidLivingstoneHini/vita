import numpy as np
import spacy
from django.core.management.base import BaseCommand
from tqdm import tqdm

from symptom_checker.models import Symptom, DO_Term, SymptomDOTermMapping


class Command(BaseCommand):
    help = 'Generate symptom-DO term mappings using NLP similarity'

    def handle(self, *args, **options):
        self.stdout.write("Loading NLP model...")
        nlp = spacy.load("en_core_web_md")

        self.stdout.write("Loading data...")
        symptoms = Symptom.objects.all()
        do_terms = DO_Term.objects.filter(is_obsolete=False)

        # Pre-process DO terms with their synonyms and definitions
        do_term_data = []
        for term in do_terms:
            text = f"{term.name.lower()}"
            if term.definition:
                text += f" {term.definition.lower()}"
            do_term_data.append({
                'term': term,
                'text': text
            })

        # Process symptoms in batches
        batch_size = 50
        total_created = 0

        for i in tqdm(range(0, symptoms.count(), batch_size), desc="Processing symptoms"):
            symptom_batch = symptoms[i:i + batch_size]

            for symptom in symptom_batch:
                symptom_doc = nlp(symptom.name.lower())
                if not symptom_doc.vector_norm:
                    continue

                # Calculate similarities with all DO terms
                similarities = []
                for term_data in do_term_data:
                    term_doc = nlp(term_data['text'])
                    if not term_doc.vector_norm:
                        continue

                    similarity = np.dot(symptom_doc.vector, term_doc.vector) / (
                            symptom_doc.vector_norm * term_doc.vector_norm
                    )
                    similarities.append((term_data['term'], similarity))

                # Get top matches and create mappings
                similarities.sort(key=lambda x: -x[1])
                top_matches = similarities[:5]  # Top 5 matches

                for term, similarity in top_matches:
                    if similarity > 0.5:  # Threshold
                        _, created = SymptomDOTermMapping.objects.get_or_create(
                            symptom=symptom,
                            do_term=term,
                            defaults={'confidence': float(similarity)}
                        )
                        if created:
                            total_created += 1

        self.stdout.write(self.style.SUCCESS(
            f"Created {total_created} new symptom-DO term mappings"
        ))