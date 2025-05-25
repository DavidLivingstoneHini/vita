import json
from pathlib import Path
from django.core.management.base import BaseCommand
from django.db.models import Q
from symptom_checker.models import Disease, DO_Term, Symptom


class Command(BaseCommand):
    help = 'Populates the database with comprehensive disease data including symptoms relationships'

    def handle(self, *args, **options):
        # Path to disease data JSON file
        data_path = Path(__file__).parent.parent.parent / 'data' / 'diseases.json'

        try:
            with open(data_path, 'r', encoding='utf-8') as f:
                diseases_data = json.load(f)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR(f"Disease data file not found at {data_path}"))
            return
        except json.JSONDecodeError:
            self.stdout.write(self.style.ERROR("Invalid JSON format in diseases.json"))
            return

        created_count = 0
        updated_count = 0
        symptom_not_found = set()

        for disease_data in diseases_data:
            try:
                # Get DO term if available
                do_term = None
                if disease_data.get('do_id'):
                    do_term = DO_Term.objects.filter(do_id=disease_data['do_id']).first()

                # Prepare disease data
                defaults = {
                    'description': disease_data.get('description', ''),
                    'treatment': disease_data.get('treatment', ''),
                    'prevalence': disease_data.get('prevalence', 'common'),
                    'risk_factors': disease_data.get('risk_factors', ''),
                    'severity': disease_data.get('severity', 'moderate'),
                    'typical_duration': disease_data.get('typical_duration', ''),
                    'contagious': disease_data.get('contagious', False),
                    'icd11_code': disease_data.get('icd11_code', ''),
                    'synonyms': ', '.join(disease_data.get('synonyms', [])),
                    'do_term': do_term
                }

                # Create or update disease
                disease, created = Disease.objects.update_or_create(
                    name=disease_data['name'],
                    defaults=defaults
                )

                # Process symptoms
                if disease_data.get('common_symptoms'):
                    symptom_objects = []
                    for symptom_name in disease_data['common_symptoms']:
                        try:
                            # Try exact match first
                            symptom = Symptom.objects.filter(
                                Q(name__iexact=symptom_name) |
                                Q(common_names__contains=[symptom_name])
                            ).first()

                            if symptom:
                                symptom_objects.append(symptom)
                            else:
                                symptom_not_found.add(symptom_name)
                        except Exception as e:
                            self.stdout.write(self.style.WARNING(
                                f"Error processing symptom {symptom_name} for disease {disease.name}: {str(e)}"
                            ))

                    # Set the many-to-many relationship
                    disease.common_symptoms.set(symptom_objects)

                if created:
                    created_count += 1
                else:
                    updated_count += 1

            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f"Error processing disease {disease_data.get('name')}: {str(e)}"
                ))
                continue

        # Output results
        self.stdout.write(self.style.SUCCESS(
            f"Successfully processed {len(diseases_data)} diseases: "
            f"{created_count} created, {updated_count} updated"
        ))

        if symptom_not_found:
            self.stdout.write(self.style.WARNING(
                f"The following symptoms were not found in the database: {', '.join(symptom_not_found)}"
            ))