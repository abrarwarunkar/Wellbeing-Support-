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
  users
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Appointments
  getAppointments(userId: string): Promise<Appointment[]>;
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
}

export class DatabaseStorage implements IStorage {
  // Appointments
  async getAppointments(userId: string): Promise<Appointment[]> {
    return await db.select().from(appointments).where(eq(appointments.studentId, userId)).orderBy(desc(appointments.date));
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

  async createMoodEntry(entry: InsertMoodEntry): Promise<MoodEntry> {
    const [newEntry] = await db.insert(moodEntries).values(entry).returning();
    return newEntry;
  }
}

export const storage = new DatabaseStorage();
