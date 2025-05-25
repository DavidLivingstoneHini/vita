import numpy as np
import spacy
from django.core.management.base import BaseCommand
from tqdm import tqdm
from symptom_checker.models import Symptom, Disease, DO_Term, SymptomDOTermMapping
import logging
from concurrent.futures import ThreadPoolExecutor, as_completed

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
            help='Skip DO term mappings and only process diseases'
        )
        parser.add_argument(
            '--skip-diseases',
            action='store_true',
            help='Skip disease mappings and only process DO terms'
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
        self.process_mappings(
            nlp=nlp,
            target_vectors=do_term_vectors,
            target_type='do_term',
            threshold=threshold,
            max_workers=max_workers,
            mapping_model=SymptomDOTermMapping,
            mapping_fields={'symptom': 'symptom', 'do_term': 'term'}
        )

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
        self.process_mappings(
            nlp=nlp,
            target_vectors=disease_vectors,
            target_type='disease',
            threshold=threshold,
            max_workers=max_workers,
            mapping_model=SymptomDOTermMapping,
            mapping_fields={'symptom': 'symptom', 'disease': 'disease'}
        )

    def process_mappings(self, nlp, target_vectors, target_type, threshold, max_workers, mapping_model, mapping_fields):
        symptoms = Symptom.objects.all()
        total_created = 0

        def process_symptom(symptom):
            try:
                doc = nlp(symptom.name.lower())
                if not doc.vector_norm:
                    return 0

                # Calculate similarities
                similarities = []
                for target_data in target_vectors:
                    similarity = np.dot(doc.vector, target_data['vector']) / (doc.vector_norm * target_data['norm'])
                    if similarity >= threshold:
                        similarities.append((target_data, similarity))

                # Sort and get top matches
                similarities.sort(key=lambda x: x[1], reverse=True)
                top_matches = similarities[:3]  # Top 3 matches

                # Create mappings
                created_count = 0
                for target_data, similarity in top_matches:
                    mapping_data = {
                        'symptom': symptom,
                        mapping_fields[target_type]: target_data[target_type],
                        'confidence': float(similarity)
                    }

                    # Skip if mapping already exists
                    filter_kwargs = {
                        'symptom': symptom,
                        mapping_fields[target_type]: target_data[target_type]
                    }

                    if not mapping_model.objects.filter(**filter_kwargs).exists():
                        mapping_model.objects.create(**mapping_data)
                        created_count += 1

                return created_count
            except Exception as e:
                logger.error(f"Error processing symptom {symptom.id}: {str(e)}")
                return 0

        # Process in parallel
        self.stdout.write(f"Processing {symptoms.count()} symptoms against {len(target_vectors)} {target_type}s...")

        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            futures = []
            for symptom in symptoms:
                futures.append(executor.submit(process_symptom, symptom))

            for future in tqdm(as_completed(futures), total=len(futures), desc="Processing symptoms"):
                total_created += future.result()

        self.stdout.write(self.style.SUCCESS(
            f"Created {total_created} new symptom-{target_type} mappings"
        ))