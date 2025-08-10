import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { aiService } from "./services/aiService";
import { 
  insertStudySessionSchema, 
  insertNoteSchema, 
  insertChatMessageSchema,
  insertSubjectSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Subjects routes
  app.get('/api/subjects', isAuthenticated, async (req, res) => {
    try {
      const subjects = await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  app.post('/api/subjects', isAuthenticated, async (req, res) => {
    try {
      const validatedData = insertSubjectSchema.parse(req.body);
      const subject = await storage.createSubject(validatedData);
      res.json(subject);
    } catch (error) {
      console.error("Error creating subject:", error);
      res.status(500).json({ message: "Failed to create subject" });
    }
  });

  // User progress routes
  app.get('/api/user/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.getUserSubjectProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ message: "Failed to fetch progress" });
    }
  });

  app.post('/api/user/progress', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const progress = await storage.updateUserSubjectProgress({
        ...req.body,
        userId
      });
      res.json(progress);
    } catch (error) {
      console.error("Error updating progress:", error);
      res.status(500).json({ message: "Failed to update progress" });
    }
  });

  // Study sessions routes
  app.get('/api/study-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const sessions = await storage.getUserStudySessions(userId, limit);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching study sessions:", error);
      res.status(500).json({ message: "Failed to fetch study sessions" });
    }
  });

  app.get('/api/study-sessions/weekly', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getWeeklyStudySessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching weekly sessions:", error);
      res.status(500).json({ message: "Failed to fetch weekly sessions" });
    }
  });

  app.post('/api/study-sessions', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertStudySessionSchema.parse({
        ...req.body,
        userId
      });
      const session = await storage.createStudySession(validatedData);
      res.json(session);
    } catch (error) {
      console.error("Error creating study session:", error);
      res.status(500).json({ message: "Failed to create study session" });
    }
  });

  // Notes routes
  app.get('/api/notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const notes = await storage.getUserNotes(userId);
      res.json(notes);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post('/api/notes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertNoteSchema.parse({
        ...req.body,
        userId
      });
      const note = await storage.createNote(validatedData);
      res.json(note);
    } catch (error) {
      console.error("Error creating note:", error);
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  app.patch('/api/notes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const note = await storage.updateNote(id, req.body);
      res.json(note);
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  app.delete('/api/notes/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      await storage.deleteNote(id);
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      console.error("Error deleting note:", error);
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // AI Assistant routes
  app.post('/api/ai/ask', isAuthenticated, async (req: any, res) => {
    try {
      const { question, context } = req.body;
      const userId = req.user.claims.sub;
      
      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }

      const response = await aiService.askMedicalQuestion(question, context);
      
      // Save chat message
      await storage.createChatMessage({
        userId,
        message: question,
        response: response.answer
      });

      res.json(response);
    } catch (error) {
      console.error("Error processing AI question:", error);
      res.status(500).json({ message: "Failed to process question" });
    }
  });

  app.get('/api/ai/chat-history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const messages = await storage.getUserChatMessages(userId, limit);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  app.post('/api/ai/enhance-notes', isAuthenticated, async (req, res) => {
    try {
      const { notes, subject } = req.body;
      
      if (!notes) {
        return res.status(400).json({ message: "Notes content is required" });
      }

      const enhancedNotes = await aiService.enhanceNotes(notes, subject);
      res.json({ enhancedNotes });
    } catch (error) {
      console.error("Error enhancing notes:", error);
      res.status(500).json({ message: "Failed to enhance notes" });
    }
  });

  app.post('/api/ai/generate-mcqs', isAuthenticated, async (req, res) => {
    try {
      const { subject, topic, difficulty = "medium" } = req.body;
      
      if (!subject || !topic) {
        return res.status(400).json({ message: "Subject and topic are required" });
      }

      const mcqs = await aiService.generateMCQs(subject, topic, difficulty);
      res.json({ questions: mcqs });
    } catch (error) {
      console.error("Error generating MCQs:", error);
      res.status(500).json({ message: "Failed to generate MCQs" });
    }
  });

  // User stats routes
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  app.patch('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await storage.updateUserStats(userId, req.body);
      res.json(stats);
    } catch (error) {
      console.error("Error updating user stats:", error);
      res.status(500).json({ message: "Failed to update stats" });
    }
  });

  // Initialize default subjects
  app.post('/api/initialize', isAuthenticated, async (req, res) => {
    try {
      const defaultSubjects = [
        { name: "Cardiology", description: "Study of heart and cardiovascular system", icon: "fas fa-heart", color: "medical-blue" },
        { name: "Neurology", description: "Study of nervous system", icon: "fas fa-brain", color: "medical-green" },
        { name: "Pharmacology", description: "Study of drugs and their effects", icon: "fas fa-pills", color: "purple-600" },
        { name: "Anatomy", description: "Study of body structure", icon: "fas fa-user-md", color: "orange-600" },
        { name: "Physiology", description: "Study of body functions", icon: "fas fa-heartbeat", color: "red-600" },
      ];

      const subjects = await Promise.all(
        defaultSubjects.map(subject => storage.createSubject(subject))
      );

      res.json({ message: "Default subjects initialized", subjects });
    } catch (error) {
      console.error("Error initializing subjects:", error);
      res.status(500).json({ message: "Failed to initialize subjects" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
