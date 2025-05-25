import json
from pathlib import Path

from django.core.management.base import BaseCommand

from symptom_checker.models import Disease, DO_Term


class Command(BaseCommand):
    help = 'Populates the database with common diseases and their details'

    def handle(self, *args, **options):
        # Path to your disease data JSON file
        data_path = Path(__file__).parent.parent.parent / 'data' / 'diseases.json'

        with open(data_path, 'r') as f:
            diseases_data = json.load(f)

        created_count = 0
        for disease_data in diseases_data:
            do_term = None
            if disease_data.get('do_id'):
                do_term = DO_Term.objects.filter(do_id=disease_data['do_id']).first()

            defaults = {
                'description': disease_data.get('description', ''),
                'treatment': disease_data.get('treatment', ''),
                'common_symptoms': ', '.join(disease_data.get('common_symptoms', [])),
                'prevalence': disease_data.get('prevalence', ''),
                'risk_factors': disease_data.get('risk_factors', ''),
                'severity': disease_data.get('severity', ''),
                'typical_duration': disease_data.get('typical_duration', ''),
                'contagious': disease_data.get('contagious'),
                'icd11_code': disease_data.get('icd11_code', ''),
                'synonyms': ', '.join(disease_data.get('synonyms', []))
            }

            disease, created = Disease.objects.update_or_create(
                name=disease_data['name'],
                defaults=defaults
            )

            if do_term and not disease.do_term:
                disease.do_term = do_term
                disease.save()

            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"Successfully populated {created_count} diseases"
        ))