import { sql, relations } from "drizzle-orm";
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  real,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical subjects
export const subjects = pgTable("subjects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  icon: varchar("icon", { length: 50 }).notNull(),
  color: varchar("color", { length: 20 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User progress per subject
export const userSubjectProgress = pgTable("user_subject_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subjectId: varchar("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  progressPercentage: real("progress_percentage").notNull().default(0),
  topicsMastered: integer("topics_mastered").notNull().default(0),
  currentTopic: varchar("current_topic"),
  lastStudiedAt: timestamp("last_studied_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Study sessions
export const studySessions = pgTable("study_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subjectId: varchar("subject_id").references(() => subjects.id, { onDelete: "set null" }),
  topic: varchar("topic"),
  duration: integer("duration").notNull(), // in minutes
  questionsAnswered: integer("questions_answered").default(0),
  correctAnswers: integer("correct_answers").default(0),
  notes: text("notes"),
  startedAt: timestamp("started_at").notNull(),
  endedAt: timestamp("ended_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// User notes
export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  subjectId: varchar("subject_id").references(() => subjects.id, { onDelete: "set null" }),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  tags: text("tags").array(),
  isAiGenerated: boolean("is_ai_generated").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// AI chat messages
export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  message: text("message").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// User statistics
export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(),
  studyStreak: integer("study_streak").notNull().default(0),
  totalHoursStudied: real("total_hours_studied").notNull().default(0),
  totalTopicsMastered: integer("total_topics_mastered").notNull().default(0),
  overallProgress: real("overall_progress").notNull().default(0),
  lastActiveDate: timestamp("last_active_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  subjectProgress: many(userSubjectProgress),
  studySessions: many(studySessions),
  notes: many(notes),
  chatMessages: many(chatMessages),
  stats: one(userStats),
}));

export const subjectsRelations = relations(subjects, ({ many }) => ({
  userProgress: many(userSubjectProgress),
  studySessions: many(studySessions),
  notes: many(notes),
}));

export const userSubjectProgressRelations = relations(userSubjectProgress, ({ one }) => ({
  user: one(users, {
    fields: [userSubjectProgress.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [userSubjectProgress.subjectId],
    references: [subjects.id],
  }),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, {
    fields: [studySessions.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [studySessions.subjectId],
    references: [subjects.id],
  }),
}));

export const notesRelations = relations(notes, ({ one }) => ({
  user: one(users, {
    fields: [notes.userId],
    references: [users.id],
  }),
  subject: one(subjects, {
    fields: [notes.subjectId],
    references: [subjects.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
  user: one(users, {
    fields: [userStats.userId],
    references: [users.id],
  }),
}));

// Export types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Subject = typeof subjects.$inferSelect;
export type InsertSubject = typeof subjects.$inferInsert;
export type UserSubjectProgress = typeof userSubjectProgress.$inferSelect;
export type InsertUserSubjectProgress = typeof userSubjectProgress.$inferInsert;
export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = typeof studySessions.$inferInsert;
export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = typeof userStats.$inferInsert;

// Zod schemas
export const insertSubjectSchema = createInsertSchema(subjects).omit({
  id: true,
  createdAt: true,
});

export const insertUserSubjectProgressSchema = createInsertSchema(userSubjectProgress).omit({
  id: true,
  updatedAt: true,
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
  createdAt: true,
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
