import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Send, Brain, Lightbulb, BookOpen, HelpCircle } from "lucide-react";

export default function AIAssistant() {
  const [question, setQuestion] = useState("");
  const [notesToEnhance, setNotesToEnhance] = useState("");
  const [mcqSubject, setMcqSubject] = useState("");
  const [mcqTopic, setMcqTopic] = useState("");
  const { toast } = useToast();

  const { data: chatHistory = [] } = useQuery({
    queryKey: ["/api/ai/chat-history"],
  });

  const askQuestionMutation = useMutation({
    mutationFn: async (data: { question: string; context?: string }) => {
      return await apiRequest("POST", "/api/ai/ask", data);
    },
    onSuccess: () => {
      setQuestion("");
      toast({
        title: "Question answered!",
        description: "The AI has provided a response to your question.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const enhanceNotesMutation = useMutation({
    mutationFn: async (data: { notes: string; subject?: string }) => {
      return await apiRequest("POST", "/api/ai/enhance-notes", data);
    },
    onSuccess: (response) => {
      toast({
        title: "Notes enhanced!",
        description: "Your notes have been improved by AI.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const generateMcqsMutation = useMutation({
    mutationFn: async (data: { subject: string; topic: string; difficulty?: string }) => {
      return await apiRequest("POST", "/api/ai/generate-mcqs", data);
    },
    onSuccess: () => {
      toast({
        title: "MCQs generated!",
        description: "Practice questions have been created for you.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleAskQuestion = () => {
    if (!question.trim()) return;
    askQuestionMutation.mutate({ question });
  };

  const handleEnhanceNotes = () => {
    if (!notesToEnhance.trim()) return;
    enhanceNotesMutation.mutate({ notes: notesToEnhance });
  };

  const handleGenerateMcqs = () => {
    if (!mcqSubject.trim() || !mcqTopic.trim()) return;
    generateMcqsMutation.mutate({ subject: mcqSubject, topic: mcqTopic });
  };

  return (
    <div className="min-h-screen bg-soft-gray">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Medical Assistant</h1>
          <p className="text-text-gray">
            Your intelligent study companion for medical education
          </p>
        </div>

        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="chat">
              <Brain className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="enhance">
              <Lightbulb className="w-4 h-4 mr-2" />
              Enhance Notes
            </TabsTrigger>
            <TabsTrigger value="mcq">
              <HelpCircle className="w-4 h-4 mr-2" />
              Generate MCQs
            </TabsTrigger>
            <TabsTrigger value="resources">
              <BookOpen className="w-4 h-4 mr-2" />
              Resources
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Interface */}
              <div className="lg:col-span-2">
                <Card className="h-96 flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-medical-blue to-purple-600 rounded-lg flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <span>Medical AI Assistant</span>
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    {/* Chat Messages */}
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                      {chatHistory.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-text-gray">
                            Hi! I'm your AI medical assistant. Ask me anything about medicine!
                          </p>
                        </div>
                      ) : (
                        chatHistory.map((chat: any) => (
                          <div key={chat.id} className="space-y-4">
                            <div className="flex justify-end">
                              <div className="bg-medical-blue text-white rounded-lg rounded-tr-none p-3 max-w-xs">
                                <p className="text-sm">{chat.message}</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-3">
                              <div className="w-6 h-6 bg-gradient-to-r from-medical-blue to-purple-600 rounded-full flex items-center justify-center">
                                <Brain className="w-4 h-4 text-white" />
                              </div>
                              <div className="bg-gray-100 rounded-lg rounded-tl-none p-3 max-w-xs">
                                <p className="text-sm text-gray-900">{chat.response}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {/* Chat Input */}
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Ask a medical question..."
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                        disabled={askQuestionMutation.isPending}
                      />
                      <Button 
                        onClick={handleAskQuestion}
                        disabled={askQuestionMutation.isPending || !question.trim()}
                        className="bg-medical-blue hover:bg-blue-700"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Questions */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        "Explain heart failure types",
                        "What is diabetes mellitus?",
                        "Describe stroke symptoms",
                        "How do antibiotics work?",
                        "What is hypertension?"
                      ].map((quickQuestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full text-left justify-start"
                          onClick={() => setQuestion(quickQuestion)}
                        >
                          {quickQuestion}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="enhance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Enhance Your Notes</CardTitle>
                <p className="text-text-gray">
                  Let AI improve your study notes with additional details and better organization
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste your notes here to enhance them..."
                  value={notesToEnhance}
                  onChange={(e) => setNotesToEnhance(e.target.value)}
                  rows={8}
                />
                <Button 
                  onClick={handleEnhanceNotes}
                  disabled={enhanceNotesMutation.isPending || !notesToEnhance.trim()}
                  className="bg-medical-green hover:bg-green-700"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Enhance Notes
                </Button>
                
                {enhanceNotesMutation.data && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h3 className="font-medium text-green-900 mb-2">Enhanced Notes:</h3>
                    <div className="text-sm text-green-800 whitespace-pre-wrap">
                      {enhanceNotesMutation.data.enhancedNotes}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mcq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Practice MCQs</CardTitle>
                <p className="text-text-gray">
                  Create custom multiple choice questions for any medical topic
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    placeholder="Subject (e.g., Cardiology)"
                    value={mcqSubject}
                    onChange={(e) => setMcqSubject(e.target.value)}
                  />
                  <Input
                    placeholder="Topic (e.g., Heart Failure)"
                    value={mcqTopic}
                    onChange={(e) => setMcqTopic(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleGenerateMcqs}
                  disabled={generateMcqsMutation.isPending || !mcqSubject.trim() || !mcqTopic.trim()}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  Generate MCQs
                </Button>

                {generateMcqsMutation.data && (
                  <div className="mt-6 space-y-4">
                    <h3 className="font-medium text-gray-900">Generated Questions:</h3>
                    {generateMcqsMutation.data.questions.map((mcq: any, index: number) => (
                      <Card key={index} className="border-purple-200">
                        <CardHeader>
                          <CardTitle className="text-lg">Question {index + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="font-medium mb-3">{mcq.question}</p>
                          <div className="space-y-2">
                            {mcq.options.map((option: string, optIndex: number) => (
                              <div 
                                key={optIndex} 
                                className={`p-2 rounded ${optIndex === mcq.correctAnswer ? 'bg-green-100 border border-green-300' : 'bg-gray-50'}`}
                              >
                                {String.fromCharCode(65 + optIndex)}. {option}
                                {optIndex === mcq.correctAnswer && (
                                  <Badge className="ml-2 bg-green-600">Correct</Badge>
                                )}
                              </div>
                            ))}
                          </div>
                          {mcq.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded">
                              <p className="text-sm text-blue-800">
                                <strong>Explanation:</strong> {mcq.explanation}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { 
                  title: "Medical Terminology",
                  description: "Learn essential medical terms and their meanings",
                  icon: "📚",
                  type: "Dictionary"
                },
                {
                  title: "Drug Interactions",
                  description: "Check for potential drug interactions and contraindications",
                  icon: "💊",
                  type: "Database"
                },
                {
                  title: "Clinical Guidelines",
                  description: "Access latest clinical practice guidelines",
                  icon: "📋",
                  type: "Guidelines"
                },
                {
                  title: "Diagnostic Tools",
                  description: "Interactive diagnostic decision trees and algorithms",
                  icon: "🔍",
                  type: "Tools"
                },
                {
                  title: "Anatomy Atlas",
                  description: "3D anatomical models and interactive diagrams",
                  icon: "🦴",
                  type: "Visual"
                },
                {
                  title: "Case Studies",
                  description: "Real clinical cases for practice and learning",
                  icon: "📊",
                  type: "Practice"
                }
              ].map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{resource.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <Badge variant="secondary">{resource.type}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-gray text-sm">{resource.description}</p>
                    <Button variant="outline" className="w-full mt-4">
                      Access Resource
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
