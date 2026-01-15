import { pgTable, text, serial, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Export everything from auth and chat models
export * from "./models/auth";
export * from "./models/chat";

import { users } from "./models/auth";

// === APPOINTMENTS ===
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id").notNull(), // Linked to users.id
  counselorId: varchar("counselor_id"), // Linked to users.id (can be null if not assigned yet)
  date: timestamp("date").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled, completed
  type: text("type").notNull().default("online"), // online, in-person
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  student: one(users, {
    fields: [appointments.studentId],
    references: [users.id],
    relationName: "studentAppointments",
  }),
  counselor: one(users, {
    fields: [appointments.counselorId],
    references: [users.id],
    relationName: "counselorAppointments",
  }),
}));

export const insertAppointmentSchema = createInsertSchema(appointments).omit({ 
  id: true, 
  createdAt: true,
  status: true // Status is managed by backend usually, but we might want to allow setting it
});

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;

// === RESOURCES ===
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(), // URL or text content
  type: text("type").notNull(), // video, audio, article, guide
  category: text("category").notNull(), // anxiety, depression, stress, etc.
  language: text("language").default("English"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertResourceSchema = createInsertSchema(resources).omit({ id: true, createdAt: true });
export type Resource = typeof resources.$inferSelect;
export type InsertResource = z.infer<typeof insertResourceSchema>;

// === FORUM POSTS (PEER SUPPORT) ===
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  authorId: varchar("author_id").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
  isFlagged: boolean("is_flagged").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  replies: many(replies),
}));

export const insertPostSchema = createInsertSchema(posts).omit({ 
  id: true, 
  createdAt: true, 
  isFlagged: true 
});
export type Post = typeof posts.$inferSelect;
export type InsertPost = z.infer<typeof insertPostSchema>;

// === FORUM REPLIES ===
export const replies = pgTable("replies", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  authorId: varchar("author_id").notNull(),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const repliesRelations = relations(replies, ({ one }) => ({
  post: one(posts, {
    fields: [replies.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [replies.authorId],
    references: [users.id],
  }),
}));

export const insertReplySchema = createInsertSchema(replies).omit({ id: true, createdAt: true });
export type Reply = typeof replies.$inferSelect;
export type InsertReply = z.infer<typeof insertReplySchema>;

// === MOOD TRACKING ===
export const moodEntries = pgTable("mood_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  score: integer("score").notNull(), // 1-5 or 1-10
  note: text("note"),
  createdAt: timestamp("created_at").defaultNow(),
});

// === ADMIN ANALYTICS CACHE (Optional for production) ===
export const institutionalTrends = pgTable("institutional_trends", {
  id: serial("id").primaryKey(),
  category: text("category").notNull(),
  value: integer("value").notNull(),
  period: text("period").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).omit({ id: true, createdAt: true });
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
