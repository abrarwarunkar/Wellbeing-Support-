import { db } from "./db";
import {
  appointments,
  type Appointment,
  type InsertAppointment,
  resources,
  type Resource,
  type InsertResource,
  posts,
  type Post,
  type InsertPost,
  replies,
  type Reply,
  type InsertReply,
  moodEntries,
  type MoodEntry,
  type InsertMoodEntry,
  users,
  type User,
  type InsertUser,
  documents,
  type Document,
  type InsertDocument,
  screeningAssessments,
  type ScreeningAssessment,
  type InsertScreening,
  dailyInsights,
  type DailyInsight,
  type InsertDailyInsight
} from "@shared/schema";
import { eq, desc, sql, or } from "drizzle-orm";

export interface IStorage {
  // Auth
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User>;

  // Onboarding
  createDocument(doc: InsertDocument): Promise<Document>;

  // Appointments
  getAppointments(userId: string): Promise<(Appointment & { student: User | null, counselor: User | null })[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: number, updates: Partial<InsertAppointment>): Promise<Appointment | undefined>;

  // Resources
  getResources(): Promise<Resource[]>;
  createResource(resource: InsertResource): Promise<Resource>;

  // Posts
  getPosts(): Promise<(Post & { author: { username: string | null } | null })[]>;
  getPost(id: number): Promise<(Post & { replies: (Reply & { author: { username: string | null } | null })[], author: { username: string | null } | null }) | undefined>;
  createPost(post: InsertPost): Promise<Post>;

  // Replies
  createReply(reply: InsertReply): Promise<Reply>;

  // Mood
  getMoodEntries(userId: string): Promise<MoodEntry[]>;
  createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry>;
  // Admin
  getAllUsers(): Promise<User[]>;
  // Screening
  createScreeningAssessment(assessment: InsertScreening): Promise<ScreeningAssessment>;
  getScreeningHistory(userId: string): Promise<ScreeningAssessment[]>;
  getAllMoodEntries(): Promise<MoodEntry[]>;
  getCounselors(): Promise<User[]>;
  createDailyInsight(insight: InsertDailyInsight): Promise<DailyInsight>;
  getLatestDailyInsight(): Promise<DailyInsight | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async getCounselors(): Promise<User[]> {
    return await db.select().from(users).where(eq(users.role, 'counselor'));
  }

  // Screening
  async createScreeningAssessment(assessment: InsertScreening): Promise<ScreeningAssessment> {
    const [newAssessment] = await db.insert(screeningAssessments).values(assessment).returning();
    return newAssessment;
  }

  async getScreeningHistory(userId: string): Promise<ScreeningAssessment[]> {
    return await db.select().from(screeningAssessments)
      .where(eq(screeningAssessments.userId, userId))
      .orderBy(desc(screeningAssessments.createdAt));
  }

  // Appointments
  async getAppointments(userId: string): Promise<(Appointment & { student: User | null, counselor: User | null })[]> {
    const { or, eq } = await import("drizzle-orm");
    return await db.query.appointments.findMany({
      where: or(eq(appointments.studentId, userId), eq(appointments.counselorId, userId)),
      orderBy: desc(appointments.date),
      with: {
        student: true,
        counselor: true
      }
    });
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db.insert(appointments).values(appointment).returning();
    return newAppointment;
  }

  async updateAppointment(id: number, updates: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments).set(updates).where(eq(appointments.id, id)).returning();
    return updated;
  }

  // Resources
  async getResources(): Promise<Resource[]> {
    return await db.select().from(resources);
  }

  async createResource(resource: InsertResource): Promise<Resource> {
    const [newResource] = await db.insert(resources).values(resource).returning();
    return newResource;
  }

  // Posts
  async getPosts(): Promise<(Post & { author: { username: string | null } | null })[]> {
    const result = await db.query.posts.findMany({
      orderBy: desc(posts.createdAt),
      with: {
        author: {
          columns: {
            username: true
          }
        }
      }
    });
    return result;
  }

  async getPost(id: number): Promise<(Post & { replies: (Reply & { author: { username: string | null } | null })[], author: { username: string | null } | null }) | undefined> {
    const result = await db.query.posts.findFirst({
      where: eq(posts.id, id),
      with: {
        author: {
          columns: {
            username: true
          }
        },
        replies: {
          with: {
            author: {
              columns: {
                username: true
              }
            }
          },
          orderBy: desc(replies.createdAt)
        }
      }
    });
    return result;
  }

  async createPost(post: InsertPost): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  // Replies
  async createReply(reply: InsertReply): Promise<Reply> {
    const [newReply] = await db.insert(replies).values(reply).returning();
    return newReply;
  }

  // Mood
  async getMoodEntries(userId: string): Promise<MoodEntry[]> {
    return await db.select().from(moodEntries).where(eq(moodEntries.userId, userId)).orderBy(desc(moodEntries.createdAt));
  }

  async getAllMoodEntries(): Promise<MoodEntry[]> {
    return await db.select().from(moodEntries).orderBy(desc(moodEntries.createdAt));
  }

  async getMoodAnalytics(userId: string): Promise<{ averageScore: number; trend: 'improving' | 'declining' | 'stable' }> {
    const entries = await db.select().from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.createdAt))
      .limit(10);

    if (entries.length < 2) return { averageScore: entries[0]?.score || 0, trend: 'stable' };

    const recent = entries.slice(0, Math.ceil(entries.length / 2));
    const older = entries.slice(Math.ceil(entries.length / 2));

    const avgRecent = recent.reduce((sum, e) => sum + e.score, 0) / recent.length;
    const avgOlder = older.reduce((sum, e) => sum + e.score, 0) / older.length;

    let trend: 'improving' | 'declining' | 'stable' = 'stable';
    if (avgRecent > avgOlder + 0.1) trend = 'improving';
    else if (avgRecent < avgOlder - 0.1) trend = 'declining';

    return { averageScore: (avgRecent + avgOlder) / 2, trend };
  }

  // Admin Analytics
  async getInstitutionalStats() {
    const totalStudents = await db.select({ count: sql<number>`count(*)` }).from(users);
    const totalAppointments = await db.select({ count: sql<number>`count(*)` }).from(appointments);

    // Mood Distribution (Pie Chart Data)
    const moodDistribution = await db.select({
      name: moodEntries.score, // Use score as name for chart
      value: sql<number>`count(*)`
    }).from(moodEntries).groupBy(moodEntries.score);

    // Risk Distribution (Bar Chart Data)
    const riskDistribution = await db.select({
      name: users.latestRiskLevel,
      value: sql<number>`count(*)`
    }).from(users).groupBy(users.latestRiskLevel);

    return {
      totalStudents: totalStudents[0].count,
      totalAppointments: totalAppointments[0].count,
      moodDistribution,
      riskDistribution
    };
  }

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const [newEntry] = await db.insert(moodEntries).values(entry).returning();
    return newEntry;
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }
  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    if (!updatedUser) throw new Error("User not found");
    return updatedUser;
  }

  async createDocument(doc: InsertDocument): Promise<Document> {
    const [newDoc] = await db.insert(documents).values(doc).returning();
    return newDoc;
  }

  // Insights
  async createDailyInsight(insight: InsertDailyInsight): Promise<DailyInsight> {
    const [newInsight] = await db.insert(dailyInsights).values(insight).returning();
    return newInsight;
  }

  async getLatestDailyInsight(): Promise<DailyInsight | undefined> {
    const [insight] = await db.select().from(dailyInsights).orderBy(desc(dailyInsights.createdAt)).limit(1);
    return insight;
  }
}

export const storage = new DatabaseStorage();
export const authStorage = storage;
