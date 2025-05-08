from django.core.management.base import BaseCommand
from content_recommender.models import Article, ArticleSection, ArticleCategory
from django.core.files import File
import os
from django.conf import settings
import shutil


class Command(BaseCommand):
    help = 'Loads initial article data into the database'

    def handle(self, *args, **options):
        # Create categories
        dermatology = ArticleCategory.objects.get_or_create(name="Dermatology")[0]
        nutrition = ArticleCategory.objects.get_or_create(name="Nutrition")[0]
        chronic = ArticleCategory.objects.get_or_create(name="Chronic Conditions")[0]
        mental_health = ArticleCategory.objects.get_or_create(name="Mental Health")[0]
        pediatrics = ArticleCategory.objects.get_or_create(name="Pediatrics")[0]
        general = ArticleCategory.objects.get_or_create(name="General Health")[0]

        articles_data = [
            {
                "id": 1,
                "title": "Acne",
                "summary": "Comprehensive guide to acne causes, myths, and effective treatments",
                "content": """
<h2>What is acne?</h2>
<p>Acne is a common skin condition that occurs when hair follicles become clogged with oil and dead skin cells.</p>

<h2>Common Myths About Acne</h2>
<ul>
  <li>Only teenagers get acne</li>
  <li>Eating chocolate causes breakouts</li>
  <li>Sun exposure clears acne</li>
</ul>

<blockquote>
"While acne is most common in adolescents, it can affect people of all ages."
</blockquote>

<h3>Effective Treatments</h3>
<p>Medical professionals recommend:</p>
<ul>
  <li><strong>Benzoyl peroxide:</strong> Reduces bacteria and inflammation</li>
  <li><strong>Salicylic acid:</strong> Helps unclog pores</li>
  <li><strong>Retinoids:</strong> Promote cell turnover</li>
</ul>

<h2>When to See a Doctor</h2>
<p>Consult a dermatologist if:</p>
<ul>
  <li>Over-the-counter treatments fail after 2 months</li>
  <li>You develop painful cysts</li>
  <li>Acne is affecting your self-esteem</li>
</ul>
""",
                "category_ids": [dermatology.id, general.id],
                "image": "acne.jpg",
                "header_image": "acne_header.jpg"
            },
            {
                "id": 2,
                "title": "Diabetes",
                "summary": "Essential information about diabetes management and prevention",
                "content": """
<h2>Understanding Diabetes</h2>
<p>Diabetes is a chronic condition that affects how your body processes blood sugar.</p>

<h2>Key Symptoms</h2>
<ul>
  <li>Increased thirst and urination</li>
  <li>Fatigue</li>
  <li>Blurred vision</li>
</ul>

<blockquote>
"Early detection and treatment can prevent serious complications."
</blockquote>

<h3>Management Strategies</h3>
<ul>
  <li><strong>Diet:</strong> Focus on whole grains, lean proteins</li>
  <li><strong>Exercise:</strong> 150 minutes weekly</li>
  <li><strong>Monitoring:</strong> Regular blood sugar checks</li>
</ul>

<h2>Prevention Tips</h2>
<p>Reduce your risk by:</p>
<ul>
  <li>Maintaining healthy weight</li>
  <li>Eating balanced meals</li>
  <li>Staying active</li>
</ul>
""",
                "category_ids": [chronic.id, nutrition.id],
                "image": "diabetes.jpg",
                "header_image": "diabetes_header.jpg"
            },
            {
                "id": 3,
                "title": "Childhood Vaccination Guide",
                "summary": "Complete information about recommended vaccinations for children",
                "content": """
<h2>Why Vaccinate?</h2>
<p>Vaccines protect children from serious, preventable diseases.</p>

<h2>Common Concerns</h2>
<ul>
  <li>Vaccine safety</li>
  <li>Side effects</li>
  <li>Alternative schedules</li>
</ul>

<blockquote>
"Vaccines undergo rigorous testing before approval."
</blockquote>

<h3>Recommended Schedule</h3>
<ul>
  <li><strong>Birth:</strong> Hepatitis B</li>
  <li><strong>2 months:</strong> DTaP, Hib, PCV13</li>
  <li><strong>12 months:</strong> MMR, Varicella</li>
</ul>

<h2>Addressing Myths</h2>
<p>Scientific evidence shows:</p>
<ul>
  <li>No link to autism</li>
  <li>Benefits outweigh risks</li>
  <li>Herd immunity protects vulnerable populations</li>
</ul>
""",
                "category_ids": [pediatrics.id],
                "image": "vaccines.jpg",
                "header_image": "vaccines_header.jpg"
            },
            {
                "id": 4,
                "title": "Anxiety",
                "summary": "Strategies for managing anxiety and improving mental health",
                "content": """
<h2>Recognizing Anxiety</h2>
<p>Anxiety disorders involve more than temporary worry or fear.</p>

<h2>Common Symptoms</h2>
<ul>
  <li>Excessive worry</li>
  <li>Restlessness</li>
  <li>Sleep disturbances</li>
</ul>

<blockquote>
"Anxiety is treatable with the right approach."
</blockquote>

<h3>Effective Treatments</h3>
<ul>
  <li><strong>Cognitive Behavioral Therapy (CBT):</strong> Changes thought patterns</li>
  <li><strong>Mindfulness:</strong> Reduces stress responses</li>
  <li><strong>Medication:</strong> When appropriate</li>
</ul>

<h2>Self-Help Strategies</h2>
<p>Daily practices that help:</p>
<ul>
  <li>Regular exercise</li>
  <li>Healthy sleep habits</li>
  <li>Limiting caffeine</li>
</ul>
""",
                "category_ids": [mental_health.id],
                "image": "anxiety.jpg",
                "header_image": "anxiety_header.jpg"
            },
            {
                "id": 5,
                "title": "Heart-Healthy Nutrition",
                "summary": "Dietary guidelines for cardiovascular health",
                "content": """
<h2>Heart Disease Risk Factors</h2>
<p>Diet plays a major role in cardiovascular health.</p>

<h2>Foods to Emphasize</h2>
<ul>
  <li>Leafy greens</li>
  <li>Fatty fish</li>
  <li>Whole grains</li>
</ul>

<blockquote>
"Small dietary changes can have big impacts over time."
</blockquote>

<h3>Nutrients for Heart Health</h3>
<ul>
  <li><strong>Omega-3s:</strong> Reduce inflammation</li>
  <li><strong>Fiber:</strong> Lowers cholesterol</li>
  <li><strong>Antioxidants:</strong> Protect blood vessels</li>
</ul>

<h2>Practical Tips</h2>
<p>Simple changes:</p>
<ul>
  <li>Use herbs instead of salt</li>
  <li>Choose healthy cooking oils</li>
  <li>Read nutrition labels</li>
</ul>
""",
                "category_ids": [nutrition.id, chronic.id],
                "image": "heart_health.jpg",
                "header_image": "heart_header.jpg"
            },
            {
                "id": 6,
                "title": "Asthma",
                "summary": "Comprehensive guide for parents of children with asthma",
                "content": """
<h2>Understanding Asthma</h2>
<p>Chronic inflammation of the airways causes breathing difficulties.</p>

<h2>Common Triggers</h2>
<ul>
  <li>Allergens</li>
  <li>Exercise</li>
  <li>Respiratory infections</li>
</ul>

<blockquote>
"With proper management, most children can participate in normal activities."
</blockquote>

<h3>Treatment Options</h3>
<ul>
  <li><strong>Controller medications:</strong> Daily prevention</li>
  <li><strong>Rescue inhalers:</strong> For symptoms</li>
  <li><strong>Allergy management:</strong> Reduce triggers</li>
</ul>

<h2>Creating an Action Plan</h2>
<p>Work with your doctor to:</p>
<ul>
  <li>Identify symptoms</li>
  <li>Set medication schedules</li>
  <li>Know when to seek emergency care</li>
</ul>
""",
                "category_ids": [pediatrics.id, chronic.id],
                "image": "asthma.jpg",
                "header_image": "asthma_header.jpg"
            },
            {
                "id": 7,
                "title": "Headaches",
                "summary": "Understanding different types of headaches and their treatments",
                "content": """
<h2>What is a headache?</h2>
<p>Headache is a common health problem that most people experience at some time.</p>

<h2>Factors That Lead to Headaches</h2>
<ul>
  <li>Emotional, such as stress, depression, or anxiety</li>
  <li>Medical, such as migraine or high blood pressure</li>
  <li>Physical, such as an injury</li>
  <li>Environmental, such as the weather</li>
</ul>

<blockquote>
"Frequent or severe headaches can affect a person's quality of life."
</blockquote>

<h3>Types of Headaches</h3>
<ul>
  <li><strong>Primary headaches:</strong> Not caused by underlying illness (migraine, tension, cluster)</li>
  <li><strong>Secondary headaches:</strong> Symptoms of underlying conditions (pregnancy, hypertension, infections)</li>
</ul>

<h2>When to Seek Medical Attention</h2>
<p>Consult a doctor if your headache:</p>
<ul>
  <li>Is severe or disruptive</li>
  <li>Is persistent or occurs regularly</li>
  <li>Does not improve with medication</li>
  <li>Occurs with neurological symptoms, fever, or neck stiffness</li>
</ul>
""",
                "category_ids": [general.id, chronic.id],
                "image": "headache.jpg",
                "header_image": "headache_header.jpg"
            },
            {
                "id": 8,
                "title": "Eczema",
                "summary": "Comprehensive guide to eczema causes, symptoms, and treatments",
                "content": """
<h2>What is eczema?</h2>
<p>Eczema is a common skin condition that causes itchy, red, dry, and irritated skin.</p>

<h2>Common Triggers</h2>
<ul>
  <li>Chemicals in cleansers and detergents</li>
  <li>Scented products</li>
  <li>Cigarette smoke</li>
  <li>Allergens like pollens and dust mites</li>
</ul>

<blockquote>
"Eczema typically starts during infancy but can occur at any age."
</blockquote>

<h3>Types of Eczema</h3>
<ul>
  <li><strong>Atopic dermatitis:</strong> Most common type with itchy, red rashes</li>
  <li><strong>Contact dermatitis:</strong> Caused by irritants or allergens</li>
  <li><strong>Dyshidrotic dermatitis:</strong> Affects hands and feet</li>
</ul>

<h2>Treatment Options</h2>
<p>Medical professionals recommend:</p>
<ul>
  <li><strong>Moisturizers:</strong> To prevent dryness</li>
  <li><strong>Topical steroids:</strong> To reduce inflammation</li>
  <li><strong>Antihistamines:</strong> To relieve itching</li>
  <li><strong>Immunosuppressants:</strong> For severe cases</li>
</ul>
""",
                "category_ids": [dermatology.id],
                "image": "eczema.jpg",
                "header_image": "eczema_header.jpg"
            },
            {
                "id": 9,
                "title": "Hypertension",
                "summary": "Understanding high blood pressure and its management",
                "content": """
<h2>What is hypertension?</h2>
<p>Hypertension is the medical term for high blood pressure, often called the silent killer.</p>

<h2>Common Myths</h2>
<ul>
  <li>Eating too much salt directly causes hypertension</li>
  <li>Hypertension can be completely cured</li>
  <li>Only older people get high blood pressure</li>
</ul>

<blockquote>
"30% of people with hypertension are unaware of their condition."
</blockquote>

<h3>Types of Hypertension</h3>
<ul>
  <li><strong>Primary hypertension:</strong> No identifiable cause (most common)</li>
  <li><strong>Secondary hypertension:</strong> Caused by underlying conditions</li>
  <li><strong>Resistant hypertension:</strong> Difficult to control with medication</li>
</ul>

<h2>Management Strategies</h2>
<p>To control blood pressure:</p>
<ul>
  <li>Reduce sodium intake</li>
  <li>Exercise regularly</li>
  <li>Maintain healthy weight</li>
  <li>Limit alcohol consumption</li>
  <li>Take prescribed medications consistently</li>
</ul>
""",
                "category_ids": [chronic.id, general.id],
                "image": "hypertension.jpg",
                "header_image": "hypertension_header.jpg"
            },
            {
                "id": 10,
                "title": "Skin Bleaching",
                "summary": "Understanding the dangers and myths of skin bleaching",
                "content": """
<h2>What is skin bleaching?</h2>
<p>Skin bleaching refers to using products to lighten dark areas of skin or achieve an overall lighter complexion.</p>

<h2>Common Myths</h2>
<ul>
  <li>Skin bleaching merely removes sun tan</li>
  <li>Expensive products are safer</li>
  <li>Darker skin is dirty skin that needs brightening</li>
</ul>

<blockquote>
"Many countries have banned skin bleaching products due to health risks."
</blockquote>

<h3>Dangers of Skin Bleaching</h3>
<ul>
  <li><strong>Mercury poisoning:</strong> Can cause numbness and kidney failure</li>
  <li><strong>Dermatitis:</strong> Skin inflammation and ulcers</li>
  <li><strong>Exogenous onochronosis:</strong> Blue-black skin discoloration</li>
  <li><strong>Nephrotic syndrome:</strong> Kidney damage from mercury</li>
</ul>

<h2>Healthier Alternatives</h2>
<p>Instead of bleaching, consider:</p>
<ul>
  <li>Embracing your natural skin tone</li>
  <li>Using sunscreen to prevent dark spots</li>
  <li>Treating hyperpigmentation with dermatologist-approved products</li>
</ul>
""",
                "category_ids": [dermatology.id, general.id],
                "image": "skin_bleaching.jpg",
                "header_image": "skin_bleaching_header.jpg"
            },
            {
                "id": 11,
                "title": "Phobias",
                "summary": "Understanding intense and irrational fear reactions",
                "content": """
<h2>What is a phobia?</h2>
<p>A phobia is an intense and irrational fear reaction to a specific place, situation, or object.</p>

<h2>Common Types</h2>
<ul>
  <li>Agoraphobia: Fear of open spaces</li>
  <li>Social phobia: Fear of social situations</li>
  <li>Glossophobia: Fear of public speaking</li>
  <li>Acrophobia: Fear of heights</li>
</ul>

<blockquote>
"People with phobias often recognize their fear is irrational but can't control it."
</blockquote>

<h3>Symptoms</h3>
<ul>
  <li>Pounding or racing heart</li>
  <li>Shortness of breath</li>
  <li>Trembling or shaking</li>
  <li>Dry mouth and upset stomach</li>
  <li>Sense of impending doom</li>
</ul>

<h2>Treatment Options</h2>
<p>Effective treatments include:</p>
<ul>
  <li><strong>Cognitive Behavioral Therapy (CBT):</strong> Changes thought patterns</li>
  <li><strong>Exposure therapy:</strong> Gradual exposure to fear source</li>
  <li><strong>Medication:</strong> Anti-anxiety drugs for severe cases</li>
</ul>
""",
                "category_ids": [mental_health.id],
                "image": "phobias.jpg",
                "header_image": "phobias_header.jpg"
            },
            {
                "id": 12,
                "title": "Weight Loss",
                "summary": "Understanding healthy weight loss and unexplained weight changes",
                "content": """
<h2>Healthy Weight Loss</h2>
<p>Intentional weight loss should focus on overall health improvement through balanced methods.</p>

<h2>Causes of Unexplained Weight Loss</h2>
<ul>
  <li>Hyperthyroidism: Overactive thyroid</li>
  <li>Type 1 diabetes: Inability to use glucose</li>
  <li>Inflammatory bowel disease (IBD)</li>
  <li>Depression and chronic stress</li>
</ul>

<blockquote>
"A 5% weight loss in 6-12 months without trying warrants medical attention."
</blockquote>

<h3>Healthy Weight Loss Strategies</h3>
<ul>
  <li><strong>Balanced diet:</strong> Protein, fats, and vegetables</li>
  <li><strong>Regular exercise:</strong> Cardio and strength training</li>
  <li><strong>High fiber intake:</strong> Promotes fullness</li>
  <li><strong>Mindful eating:</strong> Recognizing hunger cues</li>
</ul>

<h2>When to See a Doctor</h2>
<p>Consult a healthcare provider if you experience:</p>
<ul>
  <li>Rapid unintentional weight loss</li>
  <li>Weight loss with other symptoms like fatigue</li>
  <li>Difficulty maintaining healthy weight</li>
</ul>
""",
                "category_ids": [nutrition.id, general.id],
                "image": "weight_management.jpg",
                "header_image": "weight_management_header.jpg"
            },
            {
                "id": 13,
                "title": "Healthy Sleep",
                "summary": "Understanding the importance of quality sleep for overall health",
                "content": """
<h2>What is healthy sleep?</h2>
<p>Sleep is crucial to physical and mental well-being, akin to the importance of food and water.</p>

<h2>Sleep Requirements by Age</h2>
<ul>
  <li>Adults (18-64): 7-9 hours</li>
  <li>Teenagers (14-17): 8-10 hours</li>
  <li>Children (6-13): 9-11 hours</li>
  <li>Infants (0-3 months): 14-17 hours</li>
</ul>

<blockquote>
"Long-term sleep deprivation is linked to diabetes, heart disease, and depression."
</blockquote>

<h3>Sleep Disorders</h3>
<ul>
  <li><strong>Insomnia:</strong> Difficulty falling/staying asleep</li>
  <li><strong>Sleep apnea:</strong> Breathing interruptions</li>
  <li><strong>Restless leg syndrome:</strong> Urge to move legs</li>
  <li><strong>Narcolepsy:</strong> Sudden sleep attacks</li>
</ul>

<h2>Tips for Better Sleep</h2>
<p>To improve sleep quality:</p>
<ul>
  <li>Maintain consistent sleep schedule</li>
  <li>Create relaxing bedtime routine</li>
  <li>Limit caffeine and alcohol</li>
  <li>Make bedroom comfortable and dark</li>
  <li>Avoid screens before bedtime</li>
</ul>
""",
                "category_ids": [general.id, mental_health.id],
                "image": "healthy_sleep.jpg",
                "header_image": "healthy_sleep_header.jpg"
            },
            {
                "id": 14,
                "title": "Eye Health",
                "summary": "Essential tips for maintaining good vision and eye health",
                "content": """
<h2>What is eye health?</h2>
<p>Your eyesight is probably the most important of your five senses and requires proper care.</p>

<h2>Common Eye Conditions</h2>
<ul>
  <li>Cataracts: Clouding of the lens</li>
  <li>Macular degeneration: Central vision loss</li>
  <li>Glaucoma: Optic nerve damage</li>
  <li>Diabetic retinopathy: Diabetes complication</li>
</ul>

<blockquote>
"Good eye health starts with the food on your plate."
</blockquote>

<h3>Eye Health Tips</h3>
<ul>
  <li><strong>Eat well:</strong> Leafy greens, oily fish, eggs</li>
  <li><strong>Wear sunglasses:</strong> Protect from UV rays</li>
  <li><strong>Use safety eyewear:</strong> For hazardous activities</li>
  <li><strong>Take screen breaks:</strong> Follow 20-20-20 rule</li>
  <li><strong>Get regular checkups:</strong> Especially after age 40</li>
</ul>

<h2>When to See an Eye Doctor</h2>
<p>Schedule an appointment if you experience:</p>
<ul>
  <li>Sudden vision changes</li>
  <li>Persistent eye pain</li>
  <li>Flashes of light or floaters</li>
  <li>Double vision or halos</li>
</ul>
""",
                "category_ids": [general.id],
                "image": "eye_health.jpg",
                "header_image": "eye_health_header.jpg"
            },
            {
                "id": 15,
                "title": "Physical Exercise",
                "summary": "Understanding the benefits of regular physical activity",
                "content": """
<h2>What is physical exercise?</h2>
<p>Regular exercise offers numerous benefits beyond physical health, including improved mood and energy levels.</p>

<h2>Common Misconceptions</h2>
<ul>
  <li>Exercise requires gym membership</li>
  <li>More exercise is always better</li>
  <li>Exercise must be intense to be effective</li>
</ul>

<blockquote>
"Exercise is linked to reduced risk of chronic diseases and longevity."
</blockquote>

<h3>Top Benefits of Exercise</h3>
<ul>
  <li><strong>Improves mood:</strong> Stimulates endorphins</li>
  <li><strong>Aids weight loss:</strong> Burns calories</li>
  <li><strong>Strengthens muscles/bones:</strong> Prevents osteoporosis</li>
  <li><strong>Boosts energy:</strong> Improves cardiovascular efficiency</li>
  <li><strong>Reduces chronic disease risk:</strong> Like type 2 diabetes</li>
</ul>

<h2>Getting Started</h2>
<p>To incorporate more activity:</p>
<ul>
  <li>Start with short walks and gradually increase</li>
  <li>Find activities you enjoy</li>
  <li>Include strength training 2-3 times weekly</li>
  <li>Listen to your body and rest when needed</li>
</ul>
""",
                "category_ids": [general.id, nutrition.id],
                "image": "physical_exercise.jpg",
                "header_image": "physical_exercise_header.jpg"
            }
        ]

        # Create media directories
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'articles'), exist_ok=True)
        os.makedirs(os.path.join(settings.MEDIA_ROOT, 'article_headers'), exist_ok=True)

        for article_data in articles_data:
            article, created = Article.objects.update_or_create(
                id=article_data['id'],
                defaults={
                    'title': article_data['title'],
                    'summary': article_data['summary'],
                    'content': article_data['content'],
                }
            )

            # Set categories
            article.categories.set(article_data['category_ids'])

            # Handle images
            for image_type in ['image', 'header_image']:
                if article_data.get(image_type):
                    source_path = os.path.join(
                        settings.BASE_DIR,
                        'content_recommender',
                        'static',
                        'images',
                        article_data[image_type]
                    )

                    if os.path.exists(source_path):
                        try:
                            dest_path = os.path.join(
                                settings.MEDIA_ROOT,
                                'article_headers' if image_type == 'header_image' else 'articles',
                                article_data[image_type]
                            )
                            shutil.copy2(source_path, dest_path)

                            with open(dest_path, 'rb') as f:
                                getattr(article, image_type).save(
                                    article_data[image_type],
                                    File(f),
                                    save=True
                                )
                        except Exception as e:
                            self.stdout.write(self.style.ERROR(
                                f"Error processing {image_type} for article {article_data['id']}: {str(e)}"
                            ))

            self.stdout.write(self.style.SUCCESS(f'Loaded: {article.title}'))

        self.stdout.write(self.style.SUCCESS('Successfully loaded all articles'))