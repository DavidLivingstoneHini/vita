from django.core.management.base import BaseCommand
from tqdm import tqdm

from symptom_checker.models import Disease, Symptom, DO_Term

COMMON_DISEASES = [
    {
        "name": "Influenza (Flu)",
        "do_id": "DOID:8469",
        "description": "A highly contagious viral infection of the respiratory tract caused by influenza viruses that infect the nose, throat, and sometimes the lungs. It can cause mild to severe illness and at times can lead to death.",
        "treatment": "1. Antiviral medications (oseltamivir, zanamivir)\n2. Rest and hydration\n3. Over-the-counter fever reducers\n4. Hospitalization for severe cases",
        "common_symptoms": ["Fever", "Cough", "Sore throat", "Runny nose", "Body aches", "Headache", "Fatigue",
                            "Chills"],
        "prevalence": "very_common",
        "severity": "moderate",
        "risk_factors": "Seasonal exposure, age extremes, chronic illnesses, pregnancy, immunosuppression",
        "complications": "Pneumonia, bronchitis, sinus infections, worsening of chronic conditions",
        "prevention": "Annual flu vaccination, hand hygiene, avoiding sick individuals",
        "diagnostic_procedures": "Rapid influenza diagnostic tests, PCR testing",
        "typical_duration": "3-7 days (up to 2 weeks recovery)",
        "contagious": True,
        "icd11_codes": ["1E32"],
        "synonyms": ["Flu", "Seasonal influenza"]
    },
    {
        "name": "Type 2 Diabetes Mellitus",
        "do_id": "DOID:9352",
        "description": "A chronic metabolic disorder characterized by insulin resistance and relative insulin deficiency, leading to hyperglycemia.",
        "treatment": "1. Lifestyle modifications (diet, exercise)\n2. Metformin\n3. Insulin therapy\n4. SGLT2 inhibitors\n5. Regular glucose monitoring",
        "common_symptoms": ["Increased thirst", "Frequent urination", "Hunger", "Fatigue", "Blurred vision",
                            "Slow-healing sores"],
        "prevalence": "common",
        "severity": "moderate",
        "risk_factors": "Obesity, family history, physical inactivity, age >45, hypertension",
        "complications": "Neuropathy, nephropathy, retinopathy, cardiovascular disease",
        "prevention": "Weight management, regular exercise, healthy diet",
        "diagnostic_procedures": "Fasting plasma glucose, HbA1c, oral glucose tolerance test",
        "typical_duration": "chronic",
        "contagious": False,
        "icd11_codes": ["5A11"],
        "synonyms": ["Diabetes mellitus type 2", "Non-insulin dependent diabetes"]
    },
    {
        "name": "Hypertension",
        "do_id": "DOID:10763",
        "description": "A condition of abnormally high blood pressure in the arteries, increasing risk of heart disease and stroke.",
        "treatment": "1. ACE inhibitors\n2. Calcium channel blockers\n3. Diuretics\n4. Lifestyle changes (diet, exercise)",
        "common_symptoms": ["Headaches", "Shortness of breath", "Nosebleeds", "Dizziness"],
        "prevalence": "very_common",
        "severity": "moderate",
        "risk_factors": "Age, family history, obesity, high salt intake, alcohol",
        "complications": "Heart attack, stroke, aneurysm, kidney damage",
        "prevention": "Reduced salt intake, regular exercise, weight management",
        "diagnostic_procedures": "Blood pressure measurement, lab tests",
        "typical_duration": "chronic",
        "contagious": False,
        "icd11_codes": ["BA00"],
        "synonyms": ["High blood pressure"]
    },
    {
        "name": "Migraine",
        "do_id": "DOID:6364",
        "description": "A neurological condition characterized by recurrent moderate to severe headaches with autonomic nervous system symptoms.",
        "treatment": "1. Triptans\n2. NSAIDs\n3. Anti-nausea medications\n4. Preventive medications (topiramate, propranolol)",
        "common_symptoms": ["Throbbing headache", "Nausea", "Vomiting", "Light sensitivity", "Sound sensitivity",
                            "Aura"],
        "prevalence": "common",
        "severity": "moderate",
        "risk_factors": "Family history, female sex, hormonal changes, stress",
        "complications": "Status migrainosus, chronic migraine",
        "prevention": "Trigger avoidance, stress management, preventive medications",
        "diagnostic_procedures": "Clinical diagnosis based on history",
        "typical_duration": "4-72 hours",
        "contagious": False,
        "icd11_codes": ["8A80"],
        "synonyms": ["Migraine headache"]
    },
    {
        "name": "Asthma",
        "do_id": "DOID:2841",
        "description": "A chronic inflammatory disease of the airways characterized by variable and recurring symptoms, reversible airflow obstruction, and bronchospasm.",
        "treatment": "1. Inhaled corticosteroids\n2. Bronchodilators\n3. Leukotriene modifiers\n4. Allergy medications",
        "common_symptoms": ["Shortness of breath", "Wheezing", "Chest tightness", "Coughing"],
        "prevalence": "common",
        "severity": "moderate",
        "risk_factors": "Family history, allergies, smoking, air pollution",
        "complications": "Status asthmaticus, respiratory failure",
        "prevention": "Trigger avoidance, allergy control, vaccinations",
        "diagnostic_procedures": "Spirometry, peak flow measurement",
        "typical_duration": "chronic",
        "contagious": False,
        "icd11_codes": ["CA23"],
        "synonyms": ["Bronchial asthma"]
    },
    {
        "name": "Coronary Artery Disease",
        "do_id": "DOID:3393",
        "description": "The buildup of plaque in the coronary arteries that supply oxygen-rich blood to the heart muscle.",
        "treatment": "1. Statins\n2. Beta-blockers\n3. ACE inhibitors\n4. Angioplasty/stenting\n5. Coronary artery bypass surgery",
        "common_symptoms": ["Chest pain (angina)", "Shortness of breath", "Fatigue", "Heart attack"],
        "prevalence": "common",
        "severity": "severe",
        "risk_factors": "High cholesterol, hypertension, smoking, diabetes, obesity",
        "complications": "Heart attack, heart failure, arrhythmias",
        "prevention": "Healthy diet, regular exercise, smoking cessation",
        "diagnostic_procedures": "Angiogram, stress test, CT coronary angiogram",
        "typical_duration": "chronic",
        "contagious": False,
        "icd11_codes": ["BA80"],
        "synonyms": ["CAD", "Ischemic heart disease"]
    },
    {
        "name": "Depression",
        "do_id": "DOID:1470",
        "description": "A mood disorder characterized by persistent sadness and loss of interest in activities, causing significant impairment in daily life.",
        "treatment": "1. SSRIs (fluoxetine, sertraline)\n2. Psychotherapy\n3. SNRIs\n4. Lifestyle changes",
        "common_symptoms": ["Persistent sadness", "Loss of interest", "Fatigue", "Sleep disturbances",
                            "Appetite changes", "Concentration difficulties"],
        "prevalence": "common",
        "severity": "moderate",
        "risk_factors": "Family history, trauma, stress, chronic illness",
        "complications": "Suicide, self-harm, substance abuse",
        "prevention": "Stress management, social support, early intervention",
        "diagnostic_procedures": "Clinical evaluation using DSM-5 criteria",
        "typical_duration": "months to years",
        "contagious": False,
        "icd11_codes": ["6A70"],
        "synonyms": ["Major depressive disorder", "Clinical depression"]
    },
    {
        "name": "Osteoarthritis",
        "do_id": "DOID:8398",
        "description": "A degenerative joint disease characterized by breakdown of joint cartilage and underlying bone.",
        "treatment": "1. NSAIDs\n2. Physical therapy\n3. Joint injections\n4. Weight management\n5. Joint replacement surgery",
        "common_symptoms": ["Joint pain", "Stiffness", "Swelling", "Reduced range of motion"],
        "prevalence": "very_common",
        "severity": "moderate",
        "risk_factors": "Age, obesity, joint injury, genetics",
        "complications": "Chronic pain, disability, joint deformity",
        "prevention": "Weight management, joint protection, regular exercise",
        "diagnostic_procedures": "X-rays, MRI, joint fluid analysis",
        "typical_duration": "chronic",
        "contagious": False,
        "icd11_codes": ["FA00"],
        "synonyms": ["Degenerative joint disease", "OA"]
    },
    {
        "name": "Chronic Obstructive Pulmonary Disease",
        "do_id": "DOID:3083",
        "description": "A chronic inflammatory lung disease that causes obstructed airflow from the lungs, typically including emphysema and chronic bronchitis.",
        "treatment": "1. Bronchodilators\n2. Inhaled steroids\n3. Oxygen therapy\n4. Pulmonary rehabilitation",
        "common_symptoms": ["Shortness of breath", "Wheezing", "Chronic cough", "Sputum production"],
        "prevalence": "common",
        "severity": "moderate",
        "risk_factors": "Smoking, air pollution, occupational exposures",
        "complications": "Respiratory infections, heart problems, lung cancer",
        "prevention": "Smoking cessation, air quality improvement",
        "diagnostic_procedures": "Spirometry, chest X-ray, CT scan",
        "typical_duration": "chronic",
        "contagious": False,
        "icd11_codes": ["CA22"],
        "synonyms": ["COPD"]
    },
    {
        "name": "Alzheimer's Disease",
        "do_id": "DOID:10652",
        "description": "A progressive neurodegenerative disease that causes memory loss and cognitive decline, the most common cause of dementia.",
        "treatment": "1. Cholinesterase inhibitors\n2. Memantine\n3. Cognitive therapy\n4. Supportive care",
        "common_symptoms": ["Memory loss", "Confusion", "Disorientation", "Mood changes", "Behavioral issues"],
        "prevalence": "uncommon",
        "severity": "severe",
        "risk_factors": "Age, family history, genetics, head trauma",
        "complications": "Pneumonia, infections, malnutrition",
        "prevention": "Healthy lifestyle, cognitive stimulation",
        "diagnostic_procedures": "Cognitive testing, MRI, PET scans",
        "typical_duration": "progressive (years)",
        "contagious": False,
        "icd11_codes": ["8A20"],
        "synonyms": ["AD", "Senile dementia"]
    },
    {
        "name": "Rheumatoid Arthritis",
        "do_id": "DOID:7148",
        "description": "A chronic autoimmune disorder that primarily affects joints, causing painful swelling and potential joint deformity.",
        "treatment": "1. DMARDs (methotrexate)\n2. Biologics\n3. NSAIDs\n4. Steroids\n5. Physical therapy",
        "common_symptoms": ["Joint pain", "Swelling", "Stiffness", "Fatigue", "Fever"],
        "prevalence": "uncommon",
        "severity": "moderate",
        "risk_factors": "Female sex, age 40-60, smoking, genetics",
        "complications": "Joint deformity, osteoporosis, cardiovascular disease",
        "prevention": "No known prevention, early treatment helps",
        "diagnostic_procedures": "Blood tests (RF, anti-CCP), imaging",
        "typical_duration": "chronic",
        "contagious": False,
        "icd11_codes": ["FA20"],
        "synonyms": ["RA"]
    },
    {
        "name": "Pneumonia",
        "do_id": "DOID:552",
        "description": "An infection that inflames the air sacs in one or both lungs, which may fill with fluid or pus.",
        "treatment": "1. Antibiotics (bacterial)\n2. Antivirals (viral)\n3. Fever reducers\n4. Oxygen therapy\n5. Hospitalization for severe cases",
        "common_symptoms": ["Cough with phlegm", "Fever", "Chills", "Difficulty breathing", "Chest pain"],
        "prevalence": "common",
        "severity": "moderate",
        "risk_factors": "Age extremes, chronic illness, smoking, immunosuppression",
        "complications": "Sepsis, respiratory failure, lung abscess",
        "prevention": "Vaccinations (pneumococcal, influenza), hand hygiene",
        "diagnostic_procedures": "Chest X-ray, sputum test, blood tests",
        "typical_duration": "1-3 weeks",
        "contagious": True,
        "icd11_codes": ["CA40"],
        "synonyms": []
    },
    {
        "name": "Hepatitis B",
        "do_id": "DOID:2043",
        "description": "A serious liver infection caused by the hepatitis B virus (HBV) that can become chronic and lead to liver failure, cancer, or cirrhosis.",
        "treatment": "1. Antiviral medications (tenofovir, entecavir)\n2. Interferon injections\n3. Liver transplant in severe cases",
        "common_symptoms": ["Fatigue", "Jaundice", "Abdominal pain", "Nausea", "Dark urine"],
        "prevalence": "uncommon",
        "severity": "severe",
        "risk_factors": "Unprotected sex, needle sharing, birth to infected mother",
        "complications": "Chronic infection, cirrhosis, liver cancer",
        "prevention": "Vaccination, safe sex practices, needle safety",
        "diagnostic_procedures": "Blood tests (HBsAg, anti-HBc), liver function tests",
        "typical_duration": "acute (weeks) or chronic (years)",
        "contagious": True,
        "icd11_codes": ["1E50"],
        "synonyms": ["HBV"]
    },
    {
        "name": "Malaria",
        "do_id": "DOID:12365",
        "description": "A mosquito-borne infectious disease caused by Plasmodium parasites that affects red blood cells.",
        "treatment": "1. Artemisinin-based combination therapy\n2. Chloroquine (in sensitive areas)\n3. Primaquine (for liver stage)\n4. Supportive care",
        "common_symptoms": ["High fever", "Chills", "Headache", "Nausea", "Fatigue"],
        "prevalence": "rare",
        "severity": "severe",
        "risk_factors": "Travel to endemic areas, lack of prophylaxis",
        "complications": "Cerebral malaria, organ failure, anemia",
        "prevention": "Mosquito nets, repellents, prophylactic medications",
        "diagnostic_procedures": "Blood smear microscopy, rapid diagnostic tests",
        "typical_duration": "weeks (can recur)",
        "contagious": False,
        "icd11_codes": ["1F40"],
        "synonyms": []
    },
    {
        "name": "Tuberculosis",
        "do_id": "DOID:399",
        "description": "A potentially serious infectious bacterial disease that mainly affects the lungs, caused by Mycobacterium tuberculosis.",
        "treatment": "1. Antibiotics (isoniazid, rifampin, ethambutol, pyrazinamide)\n2. DOT (Directly Observed Therapy)\n3. Treatment for 6-9 months",
        "common_symptoms": ["Chronic cough", "Fever", "Night sweats", "Weight loss", "Hemoptysis"],
        "prevalence": "uncommon",
        "severity": "severe",
        "risk_factors": "HIV infection, immunosuppression, close contact, malnutrition",
        "complications": "Miliary TB, drug resistance, organ damage",
        "prevention": "BCG vaccine, infection control, latent TB treatment",
        "diagnostic_procedures": "Tuberculin skin test, IGRA, sputum culture",
        "typical_duration": "months of treatment",
        "contagious": True,
        "icd11_codes": ["1B10"],
        "synonyms": ["TB"]
    },
    {
        "name": "Lung Cancer",
        "do_id": "DOID:1324",
        "description": "A malignant tumor that originates in the lungs, typically in the cells lining the air passages.",
        "treatment": "1. Surgery\n2. Chemotherapy\n3. Radiation therapy\n4. Targeted therapy\n5. Immunotherapy",
        "common_symptoms": ["Persistent cough", "Hemoptysis", "Chest pain", "Weight loss", "Shortness of breath"],
        "prevalence": "uncommon",
        "severity": "critical",
        "risk_factors": "Smoking, radon exposure, asbestos, family history",
        "complications": "Metastasis, pleural effusion, paraneoplastic syndromes",
        "prevention": "Smoking cessation, radon testing, occupational safety",
        "diagnostic_procedures": "CT scan, biopsy, bronchoscopy",
        "typical_duration": "progressive without treatment",
        "contagious": False,
        "icd11_codes": ["2C25"],
        "synonyms": ["Bronchogenic carcinoma"]
    },
    {
        "name": "Breast Cancer",
        "do_id": "DOID:1612",
        "description": "A malignant tumor that develops from breast cells, typically starting in the milk ducts or lobules.",
        "treatment": "1. Surgery (lumpectomy, mastectomy)\n2. Radiation therapy\n3. Chemotherapy\n4. Hormone therapy\n5. Targeted therapy",
        "common_symptoms": ["Breast lump", "Nipple discharge", "Skin changes", "Breast pain", "Lymph node swelling"],
        "prevalence": "common",
        "severity": "critical",
        "risk_factors": "Female sex, age, family history, BRCA mutations",
        "complications": "Metastasis, lymphedema, recurrence",
        "prevention": "Regular screening, prophylactic surgery in high risk",
        "diagnostic_procedures": "Mammography, biopsy, ultrasound",
        "typical_duration": "progressive without treatment",
        "contagious": False,
        "icd11_codes": ["2C60"],
        "synonyms": []
    },
    {
        "name": "Colorectal Cancer",
        "do_id": "DOID:9256",
        "description": "A cancer that starts in the colon or rectum, often developing from polyps.",
        "treatment": "1. Surgery\n2. Chemotherapy\n3. Radiation therapy\n4. Targeted therapy\n5. Immunotherapy",
        "common_symptoms": ["Change in bowel habits", "Rectal bleeding", "Abdominal discomfort",
                            "Unexplained weight loss", "Fatigue"],
        "prevalence": "common",
        "severity": "critical",
        "risk_factors": "Age >50, family history, IBD, diet low in fiber",
        "complications": "Bowel obstruction, metastasis, recurrence",
        "prevention": "Colonoscopy screening, healthy diet, exercise",
        "diagnostic_procedures": "Colonoscopy, biopsy, imaging",
        "typical_duration": "progressive without treatment",
        "contagious": False,
        "icd11_codes": ["2B90"],
        "synonyms": ["Colon cancer", "Rectal cancer"]
    },
    {
        "name": "Prostate Cancer",
        "do_id": "DOID:10283",
        "description": "A cancer that occurs in the prostate gland in males, typically growing slowly and initially confined to the prostate.",
        "treatment": "1. Active surveillance\n2. Surgery (prostatectomy)\n3. Radiation therapy\n4. Hormone therapy\n5. Chemotherapy",
        "common_symptoms": ["Urinary difficulties", "Blood in semen", "Erectile dysfunction", "Bone pain (advanced)"],
        "prevalence": "common",
        "severity": "critical",
        "risk_factors": "Age >50, African ancestry, family history",
        "complications": "Metastasis (especially to bones), urinary incontinence",
        "prevention": "Regular screening in high-risk individuals",
        "diagnostic_procedures": "PSA test, digital rectal exam, biopsy",
        "typical_duration": "years (often slow-growing)",
        "contagious": False,
        "icd11_codes": ["2C82"],
        "synonyms": []
    },
    {
        "name": "Leukemia",
        "do_id": "DOID:1240",
        "description": "A group of cancers that usually begin in the bone marrow and result in high numbers of abnormal white blood cells.",
        "treatment": "1. Chemotherapy\n2. Radiation therapy\n3. Stem cell transplant\n4. Targeted therapy\n5. Immunotherapy",
        "common_symptoms": ["Fatigue", "Fever", "Frequent infections", "Easy bruising", "Weight loss"],
        "prevalence": "rare",
        "severity": "critical",
        "risk_factors": "Genetic predisposition, radiation exposure, certain chemicals",
        "complications": "Infections, bleeding, organ infiltration",
        "prevention": "Avoid known risk factors when possible",
        "diagnostic_procedures": "Blood tests, bone marrow biopsy",
        "typical_duration": "acute (rapid) or chronic (years)",
        "contagious": False,
        "icd11_codes": ["2A60"],
        "synonyms": []
    },
    {
        "name": "Lymphoma",
        "do_id": "DOID:0060058",
        "description": "A group of blood cancers that develop from lymphocytes, including Hodgkin's and non-Hodgkin's types.",
        "treatment": "1. Chemotherapy\n2. Radiation therapy\n3. Immunotherapy\n4. Stem cell transplant\n5. Targeted therapy",
        "common_symptoms": ["Swollen lymph nodes", "Fever", "Night sweats", "Weight loss", "Fatigue"],
        "prevalence": "rare",
        "severity": "critical",
        "risk_factors": "Immunosuppression, certain infections (EBV, HIV), family history",
        "complications": "Organ involvement, secondary cancers",
        "prevention": "No known prevention for most cases",
        "diagnostic_procedures": "Lymph node biopsy, imaging, blood tests",
        "typical_duration": "progressive without treatment",
        "contagious": False,
        "icd11_codes": ["2A90"],
        "synonyms": ["Hodgkin's lymphoma", "Non-Hodgkin's lymphoma"]
    }
]


class Command(BaseCommand):
    help = 'Populate database with common diseases and their details'

    def handle(self, *args, **options):
        created_count = 0
        updated_count = 0
        symptom_not_found = set()

        for disease_data in tqdm(COMMON_DISEASES, desc="Processing diseases"):
            try:
                # Get DO term if available
                do_term = None
                if disease_data.get('do_id'):
                    do_term = DO_Term.objects.filter(do_id=disease_data['do_id']).first()

                # Prepare disease data
                defaults = {
                    'description': disease_data.get('description', ''),
                    'treatment': disease_data.get('treatment',
                                                  'Consult a healthcare professional for proper diagnosis and treatment.'),
                    'prevalence': disease_data.get('prevalence', 'common'),
                    'risk_factors': disease_data.get('risk_factors',
                                                     'Various factors may contribute including genetics, environment, and lifestyle.'),
                    'severity': disease_data.get('severity', 'moderate'),
                    'typical_duration': disease_data.get('typical_duration', 'Varies by case'),
                    'contagious': disease_data.get('contagious', None),
                    'icd11_code': disease_data.get('icd11_codes', [''])[0] if disease_data.get('icd11_codes') else '',
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
                        symptom = Symptom.objects.filter(name__iexact=symptom_name).first()
                        if symptom:
                            symptom_objects.append(symptom)
                        else:
                            symptom_not_found.add(symptom_name)

                    disease.common_symptoms.set(symptom_objects)

                if created:
                    created_count += 1
                    if self.verbosity >= 2:
                        self.stdout.write(f"Created: {disease.name}")
                else:
                    updated_count += 1
                    if self.verbosity >= 2:
                        self.stdout.write(f"Updated: {disease.name}")

            except Exception as e:
                self.stdout.write(self.style.WARNING(
                    f"Error processing disease {disease_data.get('name')}: {str(e)}"
                ))
                continue

        self.stdout.write(self.style.SUCCESS(
            f"Processed {len(COMMON_DISEASES)} diseases: "
            f"{created_count} created, {updated_count} updated"
        ))

        if symptom_not_found:
            self.stdout.write(self.style.WARNING(
                f"The following symptoms were not found: {', '.join(symptom_not_found)}"
            ))