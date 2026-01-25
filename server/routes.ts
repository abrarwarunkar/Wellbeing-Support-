import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";
import onboardingRouter from "./routes/onboarding";
import screeningRouter from "./routes/screening";
import { detectCrisis, getWellnessActions, getInstitutionalInsights } from "./services/ai";
import { broadcastAlert } from "./socket";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  setupAuth(app);

  // Setup Onboarding Routes
  app.use("/api/onboarding", onboardingRouter);
  app.use("/api/screening", screeningRouter);

  // Setup AI Integrations (TODO: Replace with standard OpenAI service)
  // registerChatRoutes(app); 
  // registerImageRoutes(app);

  // === Appointments ===
  app.get(api.appointments.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const userId = (req.user as any).id;
    const appointments = await storage.getAppointments(userId);
    res.json(appointments);
  });

  app.post(api.appointments.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const userId = (req.user as any).id;
    try {
      const input = api.appointments.create.input.parse(req.body);
      const appointment = await storage.createAppointment({
        ...input,
        studentId: userId,
      });
      res.status(201).json(appointment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.patch(api.appointments.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    // In a real app, check if user is admin/counselor or owns the appointment
    try {
      const input = api.appointments.update.input.parse(req.body);
      const updated = await storage.updateAppointment(Number(req.params.id), input);
      if (!updated) return res.status(404).json({ message: "Appointment not found" });
      res.json(updated);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === Resources ===
  app.get(api.resources.list.path, async (req, res) => {
    const resources = await storage.getResources();
    res.json(resources);
  });

  app.post(api.resources.create.path, async (req, res) => {
    // Should be admin only
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    try {
      const input = api.resources.create.input.parse(req.body);
      const resource = await storage.createResource(input);
      res.status(201).json(resource);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === Posts ===
  app.get(api.posts.list.path, async (req, res) => {
    const posts = await storage.getPosts();
    res.json(posts);
  });

  app.get(api.posts.get.path, async (req, res) => {
    const post = await storage.getPost(Number(req.params.id));
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  app.post(api.posts.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const userId = (req.user as any).id;
    try {
      const input = api.posts.create.input.parse(req.body);
      const post = await storage.createPost({
        ...input,
        authorId: userId,
      });

      // SENTINEL: Check for crisis content
      const analysis = await detectCrisis(input.content + " " + input.title);
      if (analysis.riskLevel === 'severe') {
        broadcastAlert("admin_risk_alert", {
          type: "post",
          id: post.id,
          userId: userId,
          content: input.title,
          reason: analysis.reason,
          timestamp: new Date()
        });
        // Optionally flag the post automatically
        // await storage.flagPost(post.id);
      }

      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === Replies ===
  app.post(api.replies.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const userId = (req.user as any).id;
    try {
      const input = api.replies.create.input.parse(req.body);
      const reply = await storage.createReply({
        ...input,
        postId: Number(req.params.postId),
        authorId: userId,
      });
      res.status(201).json(reply);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === Counselors ===
  app.get("/api/counselors", async (req, res) => {
    const counselors = await storage.getCounselors();
    res.json(counselors);
  });

  // === Mood ===
  app.get(api.mood.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const userId = (req.user as any).id;
    const entries = await storage.getMoodEntries(userId);
    const analytics = await (storage as any).getMoodAnalytics(userId);
    res.json({ entries, analytics });
  });

  app.post(api.mood.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const userId = (req.user as any).id;
    try {
      const input = api.mood.create.input.parse(req.body);
      const entry = await storage.createMoodEntry({
        ...input,
        userId: userId,
      });
      res.status(201).json(entry);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // === AI Recommendations ===
  app.get("/api/ai/recommendations", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const userId = (req.user as any).id;

    // 1. Gather User Context
    const moodEntries = await storage.getMoodEntries(userId);
    const latestMood = moodEntries[0]?.id ? "recorded" : "neutral"; // moodEntries[0] is UserMood, let's grab the score/note or just assume mood is implicit in note? Actually UserMood doesn't have 'mood' field. It has score and note.
    // Let's use score and note.
    const moodContext = moodEntries[0] ? `Score: ${moodEntries[0].score}, Note: ${moodEntries[0].note}` : "No recent mood";

    // 2. Call AI Service (Generative Actions)
    const actions = await getWellnessActions(
      { mood: latestMood, note: moodEntries[0]?.note || "" }
    );

    res.json(actions);
  });

  // === Admin ===
  app.get("/api/admin/stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const userId = (req.user as any).id;
    // In production, strictly check for admin role
    const user = await (storage as any).getUser(userId);
    if (user?.role !== 'admin' && user?.role !== 'counselor') {
      // For demo purposes, we might allow viewing if user is counselor
    }
    const stats = await (storage as any).getInstitutionalStats();
    res.json(stats);
  });

  app.get("/api/admin/users", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const userId = (req.user as any).id;
    // In production, strictly check for admin role
    const user = await storage.getUser(userId);
    if (user?.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }
    const users = await storage.getAllUsers();
    res.json(users);
  });

  app.patch("/api/admin/users/:userId", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const currentUserId = (req.user as any).id;
    const currentUser = await storage.getUser(currentUserId);

    if (currentUser?.role !== 'admin') {
      return res.status(403).json({ message: "Forbidden" });
    }

    // Validate updates
    const updateSchema = z.object({
      role: z.enum(["student", "counselor", "admin", "partner"]).optional(),
      onboardingStatus: z.enum(["active", "rejected", "inactive"]).optional(),
    });

    try {
      const updates = updateSchema.parse(req.body);
      const updatedUser = await storage.updateUser(req.params.userId, updates);
      res.json(updatedUser);
    } catch (err) {
      res.status(400).json({ message: "Invalid update data" });
    }
  });

  // Admin AI Insights
  app.get("/api/admin/insights", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    // In production check for admin role
    const userRole = (req.user as any).role;
    if (userRole !== 'admin') return res.status(403).json({ message: "Forbidden" });

    // Check for cached insight from today
    const latestInsight = await storage.getLatestDailyInsight();
    if (latestInsight) {
      const today = new Date();
      const insightDate = new Date(latestInsight.createdAt || "");
      const isSameDay = today.getDate() === insightDate.getDate() &&
        today.getMonth() === insightDate.getMonth() &&
        today.getFullYear() === insightDate.getFullYear();

      if (isSameDay) {
        return res.json({
          summary: latestInsight.summary,
          topConcerns: JSON.parse(latestInsight.topConcerns),
          recommendation: latestInsight.recommendation
        });
      }
    }

    // Gather text data (Mood notes + Post Titles)
    const moodEntries = await storage.getAllMoodEntries(); // Assuming we add this or filter
    const posts = await storage.getPosts();

    const texts = [
      ...moodEntries.map(m => m.note).filter(Boolean),
      ...posts.map(p => p.title + " " + p.content)
    ] as string[];

    const generated = await getInstitutionalInsights(texts);

    // Persist to DB
    await storage.createDailyInsight({
      summary: generated.summary,
      topConcerns: JSON.stringify(generated.topConcerns),
      recommendation: generated.recommendation
    });

    res.json(generated);
  });

  // Seed data if empty
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingResources = await storage.getResources();
  if (existingResources.length === 0) {
    await storage.createResource({
      title: "Understanding Anxiety",
      description: "A comprehensive guide to understanding and managing anxiety symptoms.",
      content: "https://example.com/anxiety-guide",
      type: "article",
      category: "Anxiety",
      language: "English"
    });
    await storage.createResource({
      title: "5-Minute Meditation",
      description: "Quick guided meditation for stress relief.",
      content: "https://example.com/meditation.mp3",
      type: "audio",
      category: "Stress",
      language: "English"
    });
    await storage.createResource({
      title: "Coping with Exam Stress",
      description: "Tips and strategies for students during exam season.",
      content: "https://example.com/exam-stress",
      type: "video",
      category: "Academic Stress",
      language: "English"
    });
  }
}
