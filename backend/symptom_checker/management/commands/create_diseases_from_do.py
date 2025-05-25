import logging

from django.core.management.base import BaseCommand
from tqdm import tqdm

from symptom_checker.models import Disease, DO_Term, Symptom

logger = logging.getLogger(__name__)

# Disease details for common DO terms
DO_DISEASE_DETAILS = {
    "DOID:8469": {  # Influenza
        "description": "A highly contagious viral infection of the respiratory tract caused by influenza viruses.",
        "treatment": "Antiviral medications, rest, hydration, and symptom management.",
        "common_symptoms": ["Fever", "Cough", "Sore throat", "Runny nose", "Body aches"],
        "prevalence": "very_common",
        "severity": "moderate",
        "risk_factors": "Seasonal exposure, age extremes, chronic illnesses",
        "typical_duration": "1-2 weeks",
        "contagious": True,
        "icd11_code": "1E32"
    },
    "DOID:9352": {  # Type 2 Diabetes
        "description": "A chronic metabolic disorder characterized by insulin resistance and relative insulin deficiency.",
        "treatment": "Lifestyle modifications, metformin, insulin therapy, and regular glucose monitoring.",
        "common_symptoms": ["Increased thirst", "Frequent urination", "Fatigue", "Blurred vision"],
        "prevalence": "common",
        "severity": "moderate",
        "risk_factors": "Obesity, family history, physical inactivity",
        "typical_duration": "chronic",
        "contagious": False,
        "icd11_code": "5A11"
    },
    "DOID:2841": {  # Asthma
        "description": "A chronic inflammatory disease of the airways causing variable airflow obstruction.",
        "treatment": "Inhaled corticosteroids, bronchodilators, and allergy medications.",
        "common_symptoms": ["Wheezing", "Shortness of breath", "Chest tightness", "Coughing"],
        "prevalence": "common",
        "severity": "moderate",
        "risk_factors": "Family history, allergies, smoking",
        "typical_duration": "chronic",
        "contagious": False,
        "icd11_code": "CA23"
    },
    "DOID:1470": {  # Depression
        "description": "A mood disorder causing persistent sadness and loss of interest in activities.",
        "treatment": "SSRIs, psychotherapy, SNRIs, and lifestyle changes.",
        "common_symptoms": ["Persistent sadness", "Loss of interest", "Fatigue", "Sleep disturbances"],
        "prevalence": "common",
        "severity": "moderate",
        "risk_factors": "Family history, trauma, stress",
        "typical_duration": "months to years",
        "contagious": False,
        "icd11_code": "6A70"
    },
    "DOID:3083": {  # COPD
        "description": "Chronic obstructive pulmonary disease causing obstructed airflow from the lungs.",
        "treatment": "Bronchodilators, inhaled steroids, oxygen therapy, and pulmonary rehabilitation.",
        "common_symptoms": ["Shortness of breath", "Chronic cough", "Wheezing", "Sputum production"],
        "prevalence": "common",
        "severity": "moderate",
        "risk_factors": "Smoking, air pollution, occupational exposures",
        "typical_duration": "chronic",
        "contagious": False,
        "icd11_code": "CA22"
    },
    "DOID:10652": {  # Alzheimer's
        "description": "A progressive neurodegenerative disease causing memory loss and cognitive decline.",
        "treatment": "Cholinesterase inhibitors, memantine, cognitive therapy, and supportive care.",
        "common_symptoms": ["Memory loss", "Confusion", "Disorientation", "Mood changes"],
        "prevalence": "uncommon",
        "severity": "severe",
        "risk_factors": "Age, family history, genetics",
        "typical_duration": "progressive (years)",
        "contagious": False,
        "icd11_code": "8A20"
    },
    "DOID:552": {  # Pneumonia
        "description": "An infection that inflames the air sacs in one or both lungs.",
        "treatment": "Antibiotics, antivirals, fever reducers, and hospitalization for severe cases.",
        "common_symptoms": ["Cough with phlegm", "Fever", "Difficulty breathing", "Chest pain"],
        "prevalence": "common",
        "severity": "moderate",
        "risk_factors": "Age extremes, chronic illness, smoking",
        "typical_duration": "1-3 weeks",
        "contagious": True,
        "icd11_code": "CA40"
    },
    "DOID:399": {  # Tuberculosis
        "description": "A serious infectious bacterial disease that mainly affects the lungs.",
        "treatment": "Antibiotics (isoniazid, rifampin) for 6-9 months with directly observed therapy.",
        "common_symptoms": ["Chronic cough", "Fever", "Night sweats", "Weight loss"],
        "prevalence": "uncommon",
        "severity": "severe",
        "risk_factors": "HIV infection, immunosuppression, close contact",
        "typical_duration": "months of treatment",
        "contagious": True,
        "icd11_code": "1B10"
    },
    "DOID:1324": {  # Lung Cancer
        "description": "A malignant tumor that originates in the lungs, typically in cells lining air passages.",
        "treatment": "Surgery, chemotherapy, radiation therapy, targeted therapy, and immunotherapy.",
        "common_symptoms": ["Persistent cough", "Chest pain", "Weight loss", "Shortness of breath"],
        "prevalence": "uncommon",
        "severity": "critical",
        "risk_factors": "Smoking, radon exposure, asbestos",
        "typical_duration": "progressive without treatment",
        "contagious": False,
        "icd11_code": "2C25"
    },
    "DOID:1612": {  # Breast Cancer
        "description": "A malignant tumor that develops from breast cells, typically in milk ducts or lobules.",
        "treatment": "Surgery, radiation therapy, chemotherapy, hormone therapy, and targeted therapy.",
        "common_symptoms": ["Breast lump", "Nipple discharge", "Skin changes", "Breast pain"],
        "prevalence": "common",
        "severity": "critical",
        "risk_factors": "Female sex, age, family history",
        "typical_duration": "progressive without treatment",
        "contagious": False,
        "icd11_code": "2C60"
    }
}


class Command(BaseCommand):
    help = 'Create diseases from DO terms with comprehensive details'

    def add_arguments(self, parser):
        parser.add_argument(
            '--skip-existing',
            action='store_true',
            help='Skip DO terms that already have associated diseases'
        )
        parser.add_argument(
            '--batch-size',
            type=int,
            default=100,
            help='Number of DO terms to process at once'
        )

    def handle(self, *args, **options):
        skip_existing = options['skip_existing']
        batch_size = options['batch_size']

        # Get all non-obsolete DO terms
        do_terms = DO_Term.objects.filter(is_obsolete=False)
        total_terms = do_terms.count()

        created_count = 0
        skipped_count = 0

        self.stdout.write(f"Processing {total_terms} DO terms in batches of {batch_size}...")

        for i in tqdm(range(0, total_terms, batch_size), desc="Overall progress"):
            batch = do_terms[i:i + batch_size]

            for do_term in batch:
                try:
                    # Skip if disease already exists for this DO term
                    if skip_existing and Disease.objects.filter(do_term=do_term).exists():
                        skipped_count += 1
                        continue

                    # Get details from our dataset or use defaults
                    details = DO_DISEASE_DETAILS.get(do_term.do_id, {})

                    # Create the disease
                    disease = Disease.objects.create(
                        name=do_term.name,
                        do_term=do_term,
                        description=details.get('description', self.generate_description(do_term)),
                        treatment=details.get('treatment',
                                              'Consult a healthcare professional for diagnosis and treatment.'),
                        prevalence=details.get('prevalence', 'uncommon'),
                        risk_factors=details.get('risk_factors',
                                                 'Various genetic and environmental factors may contribute.'),
                        severity=details.get('severity', 'moderate'),
                        typical_duration=details.get('typical_duration', 'Varies by case'),
                        contagious=details.get('contagious', False),
                        icd11_code=details.get('icd11_code', ''),
                        synonyms=', '.join(details.get('synonyms', []))
                    )

                    # Add common symptoms if specified
                    if 'common_symptoms' in details:
                        symptoms = []
                        for symptom_name in details['common_symptoms']:
                            symptom = Symptom.objects.filter(name__iexact=symptom_name).first()
                            if symptom:
                                symptoms.append(symptom)
                        disease.common_symptoms.set(symptoms)

                    created_count += 1
                    if self.verbosity >= 2:
                        self.stdout.write(f"Created disease: {disease.name} (DOID: {do_term.do_id})")

                except Exception as e:
                    logger.error(f"Error processing DO term {do_term.do_id}: {str(e)}")
                    continue

        self.stdout.write(self.style.SUCCESS(
            f"Created {created_count} new diseases from DO terms\n"
            f"Skipped {skipped_count} existing diseases\n"
            f"Processed {total_terms} DO terms total"
        ))

    def generate_description(self, do_term):
        """Generate a basic description if none provided"""
        base_desc = f"{do_term.name} is a medical condition classified in the Disease Ontology."
        if do_term.definition:
            return f"{base_desc} {do_term.definition}"
        return f"{base_desc} More specific information about this condition would be available from medical sources."