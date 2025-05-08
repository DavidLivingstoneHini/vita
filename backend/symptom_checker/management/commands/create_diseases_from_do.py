# management/commands/generate_symptom_mappings.py
from django.core.management.base import BaseCommand
from symptom_checker.models import Symptom, DO_Term, SymptomDOTermMapping
import spacy
from sklearn.metrics.pairwise import cosine_similarity
import sys
from tqdm import tqdm
import numpy as np


class Command(BaseCommand):
    help = 'Generate symptom-DO term mappings using NLP similarity'

    def add_arguments(self, parser):
        parser.add_argument(
            '--batch-size',
            type=int,
            default=10,  # Reduced default batch size
            help='Number of symptoms to process at once'
        )
        parser.add_argument(
            '--threshold',
            type=float,
            default=0.6,
            help='Minimum similarity score to create mapping'
        )
        parser.add_argument(
            '--max-terms',
            type=int,
            default=100,  # Default limit for initial testing
            help='Maximum number of DO terms to compare against'
        )

    def handle(self, *args, **options):
        verbosity = options['verbosity']
        batch_size = options['batch_size']
        threshold = options['threshold']
        max_terms = options['max_terms']

        self.stdout.write("Initializing NLP model...")
        try:
            # Use the small model for better performance
            nlp = spacy.load("en_core_web_sm")

            # Disable unnecessary pipeline components
            with nlp.disable_pipes("tagger", "parser", "ner"):
                self.process_mappings(nlp, verbosity, batch_size, threshold, max_terms)
        except Exception as e:
            self.stdout.write(self.style.ERROR(f"Error: {str(e)}"))
            sys.exit(1)

    def process_mappings(self, nlp, verbosity, batch_size, threshold, max_terms):
        self.stdout.write("Loading data...")
        symptoms = Symptom.objects.all()
        do_terms = DO_Term.objects.filter(is_obsolete=False)[:max_terms]

        # Pre-process DO terms
        do_term_vectors = {}
        for term in tqdm(do_terms, desc="Processing DO terms", disable=verbosity < 1):
            try:
                doc = nlp(term.name.lower())
                if doc.vector_norm:  # Only use terms with valid vectors
                    do_term_vectors[term.id] = {
                        'term': term,
                        'vector': doc.vector,
                        'norm': doc.vector_norm
                    }
            except Exception as e:
                self.stdout.write(self.style.WARNING(
                    f"Could not process DO term '{term.name}': {str(e)}"
                ))

        if not do_term_vectors:
            self.stdout.write(self.style.ERROR("No valid DO terms processed"))
            return

        total_created = 0
        symptom_count = symptoms.count()

        for i in tqdm(range(0, symptom_count, batch_size), desc="Processing symptoms"):
            batch = symptoms[i:i + batch_size]

            for symptom in batch:
                try:
                    doc = nlp(symptom.name.lower())
                    if not doc.vector_norm:
                        continue

                    # Calculate similarities
                    similarities = []
                    for term_data in do_term_vectors.values():
                        similarity = np.dot(doc.vector, term_data['vector']) / (doc.vector_norm * term_data['norm'])
                        similarities.append((term_data['term'], similarity))

                    # Get top matches
                    similarities.sort(key=lambda x: x[1], reverse=True)
                    top_matches = [x for x in similarities[:3] if x[1] >= threshold]

                    # Create mappings
                    for term, similarity in top_matches:
                        _, created = SymptomDOTermMapping.objects.get_or_create(
                            symptom=symptom,
                            do_term=term,
                            defaults={'confidence': float(similarity)}
                        )
                        if created:
                            total_created += 1
                            if verbosity >= 2:
                                self.stdout.write(
                                    f"Mapped: {symptom.name} -> {term.name} "
                                    f"(score: {similarity:.2f})"
                                )
                except Exception as e:
                    self.stdout.write(self.style.WARNING(
                        f"Error processing symptom '{symptom.name}': {str(e)}"
                    ))

        self.stdout.write(self.style.SUCCESS(
            f"Created {total_created} new mappings "
            f"(processed {len(do_term_vectors)} DO terms and {symptom_count} symptoms)"
        ))