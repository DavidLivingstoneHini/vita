export const dataStore = {
  articles: [
    {
      id: 1,
      title: "Diabetes 101",
      summary: "Learn about diabetes, its symptoms, and management.",
      content: "Diabetes is a chronic health condition that affects how your body turns food into energy. Most of the food you eat is broken down into sugar (glucose) and released into your bloodstream. When your blood sugar goes up, it signals your pancreas to release insulin. Insulin acts like a key to let the blood sugar into your body's cells for use as energy.",
      image: require("../assets/images/acne.png"), // Replace with actual image URL
      sections: [
        {
          title: "Symptoms",
          content: "Common symptoms include increased thirst, frequent urination, extreme hunger, fatigue, and blurred vision. These symptoms may develop slowly over time."
        },
        {
          title: "Causes",
          content: "The exact cause depends on the type of diabetes. For Type 1 diabetes, the immune system attacks and destroys insulin-producing cells. For Type 2 diabetes, cells become resistant to insulin's action and the pancreas cannot produce enough insulin to overcome this resistance."
        },
        {
          title: "Risk Factors",
          content: "Risk factors vary by type. For Type 2 diabetes, they include being overweight, family history, age, ethnicity, and lack of physical activity."
        },
        {
          title: "Prevention",
          content: "Type 1 diabetes cannot be prevented. Type 2 diabetes can often be delayed or prevented through lifestyle changes including healthy eating, regular physical activity, and maintaining a healthy weight."
        },
        {
          title: "Treatment",
          content: "Treatment focuses on managing blood sugar levels through insulin therapy, medications, diet, exercise, and regular monitoring."
        }
      ]
    },
    {
      id: 2,
      title: "Healthy Eating",
      summary: "Discover the principles of healthy eating.",
      content: "Healthy eating involves consuming a variety of foods that give you the nutrients you need to maintain your health, feel good, and have energy. These nutrients include protein, carbohydrates, fat, water, vitamins, and minerals.",
      image: require("../assets/images/acne.png"), // Replace with actual image URL
      sections: [
        {
          title: "Key Principles",
          content: "Focus on whole foods, include plenty of fruits and vegetables, choose whole grains, limit processed foods, and stay hydrated with water instead of sugary drinks."
        },
        {
          title: "Balanced Diet",
          content: "A balanced diet includes appropriate portions of proteins, carbohydrates, and fats. The exact proportions depend on individual needs based on age, sex, weight, activity level, and overall health."
        },
        {
          title: "Portion Control",
          content: "Even healthy foods can contribute to weight gain when consumed in large amounts. Learning proper portion sizes is essential for maintaining a healthy weight."
        },
        {
          title: "Meal Planning",
          content: "Planning meals ahead of time can help ensure nutritional needs are met and reduce the likelihood of choosing less healthy options out of convenience."
        },
        {
          title: "Common Myths",
          content: "There are many misconceptions about nutrition. It's important to get information from reliable sources and consult healthcare professionals for personalized advice."
        }
      ]
    },
    {
      id: 3,
      title: "Hypertension Management",
      summary: "Understanding high blood pressure and how to control it.",
      content: "Hypertension, or high blood pressure, is a common condition in which the long-term force of the blood against your artery walls is high enough that it may eventually cause health problems, such as heart disease.",
      image: require("../assets/images/acne.png"), // Replace with actual image URL
      sections: [
        {
          title: "Understanding Blood Pressure Readings",
          content: "Blood pressure is measured using two numbers: systolic pressure (the pressure when your heart beats) and diastolic pressure (the pressure when your heart rests between beats). Normal blood pressure is less than 120/80 mm Hg."
        },
        {
          title: "Symptoms",
          content: "Most people with high blood pressure have no symptoms, which is why it's often called the 'silent killer.' Some may experience headaches, shortness of breath, or nosebleeds, but these usually occur only when blood pressure has reached dangerously high levels."
        },
        {
          title: "Risk Factors",
          content: "Risk factors include age, family history, obesity, lack of physical activity, tobacco use, high sodium diet, excessive alcohol consumption, stress, and certain chronic conditions."
        },
        {
          title: "Lifestyle Changes",
          content: "Managing hypertension often begins with lifestyle modifications such as maintaining a healthy weight, exercising regularly, adopting a heart-healthy diet, reducing sodium intake, limiting alcohol, and managing stress."
        },
        {
          title: "Medications",
          content: "When lifestyle changes aren't enough, various medications can help control blood pressure. The type of medication prescribed depends on blood pressure readings and overall health."
        }
      ]
    }
  ],
  healthConditions: [
    {
      id: 1,
      title: "Skin Bleaching",
      description: "Skin bleaching refers to the use of products to reduce melanin concentration in the skin to make it appear lighter. While common in some cultures, it can have serious health implications including skin damage, increased risk of skin cancer, and mercury poisoning from certain products.",
      symptoms: ["Skin irritation", "Thinning of skin", "Acne breakouts", "Uneven skin tone", "Increased sensitivity to sun"],
      risks: ["Mercury toxicity", "Hydroquinone side effects", "Increased cancer risk", "Dermatitis", "Permanent skin damage"],
      screen: "symptom1", // Replace with appropriate screen name
      params: { conditionId: 1 }
    },
    {
      id: 2,
      title: "Hypertension",
      description: "Hypertension, or high blood pressure, is a common condition where the force of blood against artery walls is consistently too high. It can lead to serious health problems including heart disease and stroke if not properly managed.",
      symptoms: ["Usually asymptomatic", "Headaches (in severe cases)", "Shortness of breath", "Nosebleeds", "Visual changes"],
      risks: ["Heart attack", "Stroke", "Heart failure", "Kidney disease", "Vision loss"],
      screen: "symptom2", // Replace with appropriate screen name
      params: { conditionId: 2 }
    },
    {
      id: 3,
      title: "Type 2 Diabetes",
      description: "Type 2 diabetes is a chronic condition that affects how your body metabolizes sugar. With type 2 diabetes, your body either resists the effects of insulin or doesn't produce enough insulin to maintain normal glucose levels.",
      symptoms: ["Increased thirst", "Frequent urination", "Increased hunger", "Fatigue", "Blurred vision", "Slow-healing sores"],
      risks: ["Heart disease", "Nerve damage", "Kidney damage", "Eye damage", "Foot damage", "Hearing impairment"],
      screen: "symptom3", // Replace with appropriate screen name
      params: { conditionId: 3 }
    },
    {
      id: 4,
      title: "Common Cold",
      description: "The common cold is a viral infection of your nose and throat (upper respiratory tract). It's usually harmless, although it might not feel that way. Many types of viruses can cause a common cold.",
      symptoms: ["Runny or stuffy nose", "Sore throat", "Cough", "Congestion", "Slight body aches", "Mild headache", "Low-grade fever"],
      risks: ["Secondary infections", "Worsening of asthma", "Acute sinusitis", "Middle ear infection"],
      screen: "symptom5", // Match this to your symptom checker screen
      params: {
        conditionId: 4,
        condition: JSON.stringify({
          id: 4,
          name: "Common Cold"
        })
      }
    }
  ],
};