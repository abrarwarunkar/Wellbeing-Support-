import { db } from "../server/db";
import { resources } from "../shared/schema";

async function seedRealResources() {
  console.log("Clearing existing resources...");
  await db.delete(resources);

  console.log("Seeding real resources...");

  const realResources = [
    {
      title: "Guided Breathing Meditation",
      description: "A simple 10-minute meditation to help reduce stress and anxiety.",
      content: "https://www.youtube.com/watch?v=ZToicYcHIOU",
      type: "video",
      category: "Stress",
      language: "English"
    },
    {
      title: "Understanding Anxiety Disorders",
      description: "In-depth information on the signs, symptoms, and treatments for various anxiety disorders from the NIMH.",
      content: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
      type: "article",
      category: "Anxiety",
      language: "English"
    },
    {
      title: "UCLA Mindful Awareness Practices",
      description: "A collection of guided mindfulness meditations provided by UCLA Health.",
      content: "https://www.uclahealth.org/programs/marc/free-guided-meditations/guided-meditations",
      type: "audio",
      category: "Mindfulness",
      language: "English"
    },
    {
      title: "Student Mental Health Guide",
      description: "Advice and support for managing mental health challenges during university or college life.",
      content: "https://www.mind.org.uk/information-support/tips-for-everyday-living/student-life/about-student-mental-health/",
      type: "guide",
      category: "Academic Stress",
      language: "English"
    },
    {
      title: "What is Depression? - TED-Ed",
      description: "An educational video explaining the biological and psychological aspects of depression.",
      content: "https://www.youtube.com/watch?v=z-IR48Mb3W0",
      type: "video",
      category: "Depression",
      language: "English"
    },
    {
      title: "Grounding Techniques for Panic Attacks",
      description: "Quick mental and physical exercises to help you ground yourself during moments of severe panic.",
      content: "https://www.healthline.com/health/grounding-techniques",
      type: "article",
      category: "Anxiety",
      language: "English"
    }
  ];

  for (const res of realResources) {
    await db.insert(resources).values(res);
  }

  console.log("Successfully seeded real resources!");
  process.exit(0);
}

seedRealResources().catch((err) => {
  console.error("Error seeding resources:", err);
  process.exit(1);
});
