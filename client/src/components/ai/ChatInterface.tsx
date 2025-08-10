import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { Send, Brain } from "lucide-react";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function ChatInterface() {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: chatHistory = [], isLoading } = useQuery({
    queryKey: ["/api/ai/chat-history"],
    retry: false,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (question: string) => {
      return await apiRequest("POST", "/api/ai/ask", { question });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/ai/chat-history"] });
      setMessage("");
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate(message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
      <CardHeader className="pb-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-medical-blue to-purple-600 rounded-lg flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-gray-900">AI Medical Assistant</CardTitle>
            <p className="text-xs text-text-gray">Ask anything about medicine</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {!isLoading && chatHistory.length === 0 && (
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-medical-blue to-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg rounded-tl-none p-3 max-w-xs">
                  <p className="text-sm text-gray-900">
                    Hi {user?.firstName || 'there'}! I'm here to help with your medical studies. What would you like to know about today?
                  </p>
                </div>
              </div>
            )}
            
            {chatHistory.map((chat: any) => (
              <div key={chat.id} className="space-y-4">
                {/* User message */}
                <div className="flex items-start space-x-3 justify-end">
                  <div className="bg-medical-blue rounded-lg rounded-tr-none p-3 max-w-xs">
                    <p className="text-sm text-white">{chat.message}</p>
                  </div>
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt="User" 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-medical-blue rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">
                        {user?.firstName?.charAt(0) || 'U'}
                      </span>
                    </div>
                  )}
                </div>
                
                {/* AI response */}
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-medical-blue to-purple-600 rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg rounded-tl-none p-3 max-w-xs">
                    <p className="text-sm text-gray-900">{chat.response}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {sendMessageMutation.isPending && (
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-gradient-to-r from-medical-blue to-purple-600 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg rounded-tl-none p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-medical-blue"></div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask a medical question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sendMessageMutation.isPending}
              className="flex-1 text-sm focus:ring-2 focus:ring-medical-blue focus:border-transparent"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending || !message.trim()}
              className="bg-medical-blue hover:bg-blue-700 transition-colors"
              size="sm"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
