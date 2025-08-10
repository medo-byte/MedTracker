import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface MedicalQuestionResponse {
  answer: string;
  confidence: number;
  sources?: string[];
  relatedTopics?: string[];
}

export interface StudyRecommendation {
  subject: string;
  topic: string;
  reason: string;
  priority: "high" | "medium" | "low";
  estimatedTime: number; // in minutes
}

export class AIService {
  async askMedicalQuestion(question: string, context?: string): Promise<MedicalQuestionResponse> {
    try {
      const systemPrompt = `You are an advanced medical AI assistant helping medical students learn. 
      Provide accurate, educational medical information with appropriate disclaimers.
      Always include confidence level and suggest related topics for further study.
      Format your response as JSON with: answer, confidence (0-1), sources (optional), relatedTopics (optional).
      Remember this is for educational purposes only and not for actual medical diagnosis.`;

      const userPrompt = context 
        ? `Context: ${context}\n\nQuestion: ${question}`
        : `Question: ${question}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return {
        answer: result.answer || "I apologize, but I couldn't process your question properly.",
        confidence: Math.max(0, Math.min(1, result.confidence || 0.7)),
        sources: result.sources || [],
        relatedTopics: result.relatedTopics || [],
      };
    } catch (error) {
      console.error("AI Service Error:", error);
      throw new Error("Failed to get AI response. Please try again.");
    }
  }

  async generateStudyRecommendations(
    userProgress: Array<{ subject: string; progress: number; lastStudied?: Date }>,
    studyHistory: Array<{ subject: string; duration: number; accuracy: number }>
  ): Promise<StudyRecommendation[]> {
    try {
      const systemPrompt = `You are an AI study advisor for medical students. 
      Analyze the user's progress and study history to recommend optimal study topics.
      Consider: progress gaps, time since last study, accuracy rates, and medical curriculum importance.
      Return JSON array of recommendations with: subject, topic, reason, priority (high/medium/low), estimatedTime (minutes).`;

      const userPrompt = `User Progress: ${JSON.stringify(userProgress)}
      Study History: ${JSON.stringify(studyHistory)}
      
      Provide 3-5 personalized study recommendations.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.recommendations || [];
    } catch (error) {
      console.error("AI Recommendations Error:", error);
      return [];
    }
  }

  async enhanceNotes(originalNotes: string, subject?: string): Promise<string> {
    try {
      const systemPrompt = `You are an AI assistant that enhances medical study notes.
      Improve clarity, add relevant details, correct any inaccuracies, and maintain educational value.
      Keep the original structure but make it more comprehensive and easier to study from.`;

      const userPrompt = subject 
        ? `Subject: ${subject}\n\nOriginal Notes: ${originalNotes}`
        : `Original Notes: ${originalNotes}`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
      });

      return response.choices[0].message.content || originalNotes;
    } catch (error) {
      console.error("Note Enhancement Error:", error);
      return originalNotes;
    }
  }

  async generateMCQs(subject: string, topic: string, difficulty: "easy" | "medium" | "hard" = "medium"): Promise<any[]> {
    try {
      const systemPrompt = `You are a medical education AI that creates high-quality multiple choice questions.
      Generate clinically relevant MCQs with explanations for each answer option.
      Format as JSON array with: question, options (array of 4-5 choices), correctAnswer (index), explanation, difficulty.`;

      const userPrompt = `Subject: ${subject}
      Topic: ${topic}
      Difficulty: ${difficulty}
      
      Generate 5 multiple choice questions.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.5,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      return result.questions || [];
    } catch (error) {
      console.error("MCQ Generation Error:", error);
      return [];
    }
  }
}

export const aiService = new AIService();
