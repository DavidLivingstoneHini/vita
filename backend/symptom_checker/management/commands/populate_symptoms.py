# management/commands/populate_symptoms.py
from django.core.management.base import BaseCommand
from symptom_checker.models import Symptom


class Command(BaseCommand):
    help = 'Populate standard symptoms'

    def handle(self, *args, **options):
        symptoms = [
            # General Symptoms
            "Fever", "Chills", "Fatigue", "Weakness", "Weight loss",
            "Weight gain", "Night sweats", "Loss of appetite",
            "Malaise", "Dehydration", "Swelling", "Fainting",

            # Head/Neurological
            "Headache", "Dizziness", "Lightheadedness", "Vertigo",
            "Confusion", "Memory loss", "Seizures", "Tremors",
            "Numbness", "Tingling", "Muscle weakness", "Poor coordination",
            "Speech difficulty", "Vision changes", "Blurred vision",
            "Double vision", "Eye pain", "Hearing loss", "Ringing in ears",
            "Loss of smell", "Loss of taste",

            # Respiratory
            "Cough", "Shortness of breath", "Wheezing", "Chest tightness",
            "Chest pain", "Sputum production", "Blood in sputum",
            "Nasal congestion", "Runny nose", "Sneezing", "Sore throat",
            "Hoarseness", "Snoring",

            # Cardiovascular
            "Palpitations", "Irregular heartbeat", "Fast heartbeat",
            "Slow heartbeat", "Chest pressure", "Leg swelling",
            "Cold extremities", "Varicose veins",

            # Gastrointestinal
            "Abdominal pain", "Nausea", "Vomiting", "Diarrhea",
            "Constipation", "Bloating", "Gas", "Heartburn",
            "Difficulty swallowing", "Black stools", "Blood in stool",
            "Rectal bleeding", "Jaundice", "Loss of appetite",
            "Early satiety", "Food intolerance",

            # Urinary/Reproductive
            "Frequent urination", "Painful urination", "Blood in urine",
            "Urinary incontinence", "Urinary retention", "Back pain",
            "Pelvic pain", "Vaginal discharge", "Vaginal bleeding",
            "Pain during intercourse", "Erectile dysfunction",
            "Testicular pain", "Groin pain",

            # Musculoskeletal
            "Joint pain", "Joint swelling", "Joint stiffness",
            "Muscle pain", "Muscle cramps", "Back stiffness",
            "Neck pain", "Limited range of motion", "Bone pain",

            # Skin/Hair/Nails
            "Rash", "Itching", "Hives", "Skin redness", "Skin peeling",
            "Dry skin", "Oily skin", "Skin discoloration", "Hair loss",
            "Brittle nails", "Nail discoloration", "Skin ulcers",
            "Skin growths", "Excessive sweating", "Cold sores",

            # Psychological
            "Anxiety", "Depression", "Mood swings", "Irritability",
            "Insomnia", "Excessive sleepiness", "Panic attacks",
            "Hallucinations", "Paranoia", "Suicidal thoughts",

            # Endocrine/Metabolic
            "Heat intolerance", "Cold intolerance", "Excessive thirst",
            "Excessive hunger", "Frequent urination", "Neck swelling",
            "Hand tremor", "Hair thinning", "Moon face", "Buffalo hump",

            # Blood/Lymphatic
            "Easy bruising", "Prolonged bleeding", "Pale skin",
            "Yellow skin", "Swollen lymph nodes", "Recurrent infections",

            # Pediatric Specific
            "Failure to thrive", "Developmental delay", "Poor feeding",
            "Excessive crying", "Teething pain", "Bedwetting",

            # Elderly Specific
            "Memory problems", "Balance problems", "Frequent falls",
            "Urinary urgency", "Hearing impairment", "Visual impairment",

            # COVID-19 Related
            "Loss of taste", "Loss of smell", "Difficulty breathing",
            "Persistent cough", "Body aches", "Sore throat",
            "Congestion", "Nausea/vomiting", "Diarrhea"
        ]

        # Create symptoms with weights (1-3 scale where 3 is most severe)
        symptom_weights = {
            # High severity symptoms
            "Chest pain": 3,
            "Shortness of breath": 3,
            "Severe headache": 3,
            "Loss of consciousness": 3,
            "Seizures": 3,
            "Severe bleeding": 3,
            "Paralysis": 3,
            "Sudden vision loss": 3,

            # Medium severity symptoms
            "Fever": 2,
            "Persistent cough": 2,
            "Abdominal pain": 2,
            "Blood in urine": 2,
            "Blood in stool": 2,
            "Unexplained weight loss": 2,
            "Severe dizziness": 2,

            # Default weight for others
        }

        created_count = 0
        for name in symptoms:
            weight = symptom_weights.get(name, 1)  # Default weight is 1
            _, created = Symptom.objects.get_or_create(
                name=name,
                defaults={'weight': weight}
            )
            if created:
                created_count += 1

        self.stdout.write(self.style.SUCCESS(
            f"Created {created_count} symptoms ({len(symptoms)} total in list)"
        ))