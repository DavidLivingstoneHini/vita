import numpy as np
import spacy
from django.core.management.base import BaseCommand
from tqdm import tqdm
from symptom_checker.models import Symptom, Disease, DO_Term, SymptomDOTermMapping, SymptomDiseaseMapping
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Generate symptom-DO term and symptom-disease mappings using NLP similarity'

    def add_arguments(self, parser):
        parser.add_argument(
            '--batch-size',
            type=int,
            default=50,
            help='Number of symptoms to process at once'
        )
        parser.add_argument(
            '--threshold',
            type=float,
            default=0.5,
            help='Minimum similarity score to create mapping'
        )
        parser.add_argument(
            '--max-workers',
            type=int,
            default=4,
            help='Number of parallel workers for processing'
        )
        parser.add_argument(
            '--skip-do',
            action='store_true',
            help='Skip DO term mappings'
        )
        parser.add_argument(
            '--skip-diseases',
            action='store_true',
            help='Skip disease mappings'
        )

    def handle(self, *args, **options):
        batch_size = options['batch_size']
        threshold = options['threshold']
        max_workers = options['max_workers']

        self.stdout.write("Loading NLP model...")
        try:
            nlp = spacy.load("en_core_web_md")
        except OSError:
            self.stdout.write(self.style.ERROR("Spacy model 'en_core_web_md' not found. Please install it first."))
            return

        # Process DO term mappings if not skipped
        if not options['skip_do']:
            self.stdout.write(self.style.SUCCESS("\nProcessing DO Term Mappings"))
            self.process_do_mappings(nlp, threshold, max_workers)

        # Process disease mappings if not skipped
        if not options['skip_diseases']:
            self.stdout.write(self.style.SUCCESS("\nProcessing Disease Mappings"))
            self.process_disease_mappings(nlp, threshold, max_workers)

    def process_do_mappings(self, nlp, threshold, max_workers):
        self.stdout.write("Loading DO terms...")
        do_terms = DO_Term.objects.filter(is_obsolete=False)

        # Pre-process DO terms
        self.stdout.write("Pre-processing DO terms...")
        do_term_vectors = []
        for term in tqdm(do_terms, desc="Processing DO terms"):
            try:
                doc = nlp(term.name.lower())
                if doc.vector_norm:
                    do_term_vectors.append({
                        'term': term,
                        'vector': doc.vector,
                        'norm': doc.vector_norm
                    })
            except Exception as e:
                logger.warning(f"Error processing DO term {term.id}: {str(e)}")
                continue

        if not do_term_vectors:
            self.stdout.write(self.style.ERROR("No valid DO terms processed"))
            return

        # Process symptoms
        symptoms = Symptom.objects.all()
        total_created = 0

        self.stdout.write(f"Processing {symptoms.count()} symptoms against {len(do_term_vectors)} DO terms...")

        for symptom in tqdm(symptoms, desc="Processing symptoms"):
            try:
                doc = nlp(symptom.name.lower())
                if not doc.vector_norm:
                    continue

                # Calculate similarities
                similarities = []
                for term_data in do_term_vectors:
                    similarity = np.dot(doc.vector, term_data['vector']) / (doc.vector_norm * term_data['norm'])
                    if similarity >= threshold:
                        similarities.append((term_data['term'], similarity))

                # Sort and get top matches
                similarities.sort(key=lambda x: x[1], reverse=True)
                top_matches = similarities[:3]  # Top 3 matches

                # Create mappings
                for term, similarity in top_matches:
                    _, created = SymptomDOTermMapping.objects.get_or_create(
                        symptom=symptom,
                        do_term=term,
                        defaults={'confidence': float(similarity)}
                    )
                    if created:
                        total_created += 1
                        if self.verbosity >= 2:
                            self.stdout.write(f"Mapped: {symptom.name} -> {term.name} (score: {similarity:.2f})")

            except Exception as e:
                logger.error(f"Error processing symptom {symptom.id}: {str(e)}")
                continue

        self.stdout.write(self.style.SUCCESS(
            f"Created {total_created} new symptom-DO term mappings"
        ))

    def process_disease_mappings(self, nlp, threshold, max_workers):
        self.stdout.write("Loading diseases...")
        diseases = Disease.objects.all()

        # Pre-process diseases
        self.stdout.write("Pre-processing diseases...")
        disease_vectors = []
        for disease in tqdm(diseases, desc="Processing diseases"):
            try:
                # Combine disease name and description for better vector
                text = f"{disease.name.lower()}"
                if disease.description:
                    text += f" {disease.description.lower()}"

                doc = nlp(text)
                if doc.vector_norm:
                    disease_vectors.append({
                        'disease': disease,
                        'vector': doc.vector,
                        'norm': doc.vector_norm
                    })
            except Exception as e:
                logger.warning(f"Error processing disease {disease.id}: {str(e)}")
                continue

        if not disease_vectors:
            self.stdout.write(self.style.ERROR("No valid diseases processed"))
            return

        # Process symptoms
        symptoms = Symptom.objects.all()
        total_created = 0

        self.stdout.write(f"Processing {symptoms.count()} symptoms against {len(disease_vectors)} diseases...")

        for symptom in tqdm(symptoms, desc="Processing symptoms"):
            try:
                doc = nlp(symptom.name.lower())
                if not doc.vector_norm:
                    continue

                # Calculate similarities
                similarities = []
                for disease_data in disease_vectors:
                    similarity = np.dot(doc.vector, disease_data['vector']) / (doc.vector_norm * disease_data['norm'])
                    if similarity >= threshold:
                        similarities.append((disease_data['disease'], similarity))

                # Sort and get top matches
                similarities.sort(key=lambda x: x[1], reverse=True)
                top_matches = similarities[:3]  # Top 3 matches

                # Create mappings
                for disease, similarity in top_matches:
                    _, created = SymptomDiseaseMapping.objects.get_or_create(
                        symptom=symptom,
                        disease=disease,
                        defaults={'confidence': float(similarity)}
                    )
                    if created:
                        total_created += 1
                        if self.verbosity >= 2:
                            self.stdout.write(f"Mapped: {symptom.name} -> {disease.name} (score: {similarity:.2f})")

            except Exception as e:
                logger.error(f"Error processing symptom {symptom.id}: {str(e)}")
                continue

        self.stdout.write(self.style.SUCCESS(
            f"Created {total_created} new symptom-disease mappings"
        ))