import {
  users,
  subjects,
  userSubjectProgress,
  studySessions,
  notes,
  chatMessages,
  userStats,
  type User,
  type UpsertUser,
  type Subject,
  type InsertSubject,
  type UserSubjectProgress,
  type InsertUserSubjectProgress,
  type StudySession,
  type InsertStudySession,
  type Note,
  type InsertNote,
  type ChatMessage,
  type InsertChatMessage,
  type UserStats,
  type InsertUserStats,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Subject operations
  getSubjects(): Promise<Subject[]>;
  createSubject(subject: InsertSubject): Promise<Subject>;
  
  // User progress operations
  getUserSubjectProgress(userId: string): Promise<UserSubjectProgress[]>;
  updateUserSubjectProgress(progress: InsertUserSubjectProgress): Promise<UserSubjectProgress>;
  
  // Study session operations
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  getUserStudySessions(userId: string, limit?: number): Promise<StudySession[]>;
  getWeeklyStudySessions(userId: string): Promise<StudySession[]>;
  
  // Notes operations
  getUserNotes(userId: string): Promise<Note[]>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, updates: Partial<InsertNote>): Promise<Note>;
  deleteNote(id: string): Promise<void>;
  
  // Chat operations
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getUserChatMessages(userId: string, limit?: number): Promise<ChatMessage[]>;
  
  // User stats operations
  getUserStats(userId: string): Promise<UserStats | undefined>;
  updateUserStats(userId: string, stats: Partial<InsertUserStats>): Promise<UserStats>;
  initializeUserStats(userId: string): Promise<UserStats>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    
    // Initialize user stats if new user
    await this.initializeUserStats(user.id);
    
    return user;
  }

  // Subject operations
  async getSubjects(): Promise<Subject[]> {
    return await db.select().from(subjects);
  }

  async createSubject(subject: InsertSubject): Promise<Subject> {
    const [newSubject] = await db.insert(subjects).values(subject).returning();
    return newSubject;
  }

  // User progress operations
  async getUserSubjectProgress(userId: string): Promise<UserSubjectProgress[]> {
    return await db
      .select()
      .from(userSubjectProgress)
      .where(eq(userSubjectProgress.userId, userId));
  }

  async updateUserSubjectProgress(progress: InsertUserSubjectProgress): Promise<UserSubjectProgress> {
    const [updated] = await db
      .insert(userSubjectProgress)
      .values({
        ...progress,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: [userSubjectProgress.userId, userSubjectProgress.subjectId],
        set: {
          ...progress,
          updatedAt: new Date(),
        },
      })
      .returning();
    return updated;
  }

  // Study session operations
  async createStudySession(session: InsertStudySession): Promise<StudySession> {
    const [newSession] = await db.insert(studySessions).values(session).returning();
    return newSession;
  }

  async getUserStudySessions(userId: string, limit = 10): Promise<StudySession[]> {
    return await db
      .select()
      .from(studySessions)
      .where(eq(studySessions.userId, userId))
      .orderBy(desc(studySessions.createdAt))
      .limit(limit);
  }

  async getWeeklyStudySessions(userId: string): Promise<StudySession[]> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return await db
      .select()
      .from(studySessions)
      .where(and(
        eq(studySessions.userId, userId),
        gte(studySessions.startedAt, oneWeekAgo)
      ))
      .orderBy(desc(studySessions.startedAt));
  }

  // Notes operations
  async getUserNotes(userId: string): Promise<Note[]> {
    return await db
      .select()
      .from(notes)
      .where(eq(notes.userId, userId))
      .orderBy(desc(notes.updatedAt));
  }

  async createNote(note: InsertNote): Promise<Note> {
    const [newNote] = await db.insert(notes).values(note).returning();
    return newNote;
  }

  async updateNote(id: string, updates: Partial<InsertNote>): Promise<Note> {
    const [updated] = await db
      .update(notes)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(notes.id, id))
      .returning();
    return updated;
  }

  async deleteNote(id: string): Promise<void> {
    await db.delete(notes).where(eq(notes.id, id));
  }

  // Chat operations
  async createChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async getUserChatMessages(userId: string, limit = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  // User stats operations
  async getUserStats(userId: string): Promise<UserStats | undefined> {
    const [stats] = await db
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId));
    return stats;
  }

  async updateUserStats(userId: string, stats: Partial<InsertUserStats>): Promise<UserStats> {
    const [updated] = await db
      .update(userStats)
      .set({ ...stats, updatedAt: new Date() })
      .where(eq(userStats.userId, userId))
      .returning();
    return updated;
  }

  async initializeUserStats(userId: string): Promise<UserStats> {
    const [stats] = await db
      .insert(userStats)
      .values({ userId })
      .onConflictDoNothing()
      .returning();
    
    if (!stats) {
      return (await this.getUserStats(userId))!;
    }
    
    return stats;
  }
}

export const storage = new DatabaseStorage();
