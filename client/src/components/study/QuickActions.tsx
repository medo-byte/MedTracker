import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HelpCircle, StickyNote, Search, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";

export default function QuickActions() {
  const [, setLocation] = useLocation();

  const actions = [
    {
      icon: HelpCircle,
      label: "Practice MCQs",
      description: "Test your knowledge",
      color: "medical-blue",
      onClick: () => setLocation("/ai-assistant"),
    },
    {
      icon: StickyNote,
      label: "Create Note",
      description: "Save important points",
      color: "medical-green",
      onClick: () => setLocation("/notes"),
    },
    {
      icon: Search,
      label: "Search Database",
      description: "Find medical information",
      color: "purple-600",
      onClick: () => setLocation("/study-materials"),
    },
    {
      icon: BarChart3,
      label: "View Analytics",
      description: "Check your progress",
      color: "orange-600",
      onClick: () => setLocation("/progress"),
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { bg: string; text: string } } = {
      "medical-blue": {
        bg: "bg-medical-blue bg-opacity-10",
        text: "text-medical-blue"
      },
      "medical-green": {
        bg: "bg-medical-green bg-opacity-10",
        text: "text-medical-green"
      },
      "purple-600": {
        bg: "bg-purple-100",
        text: "text-purple-600"
      },
      "orange-600": {
        bg: "bg-orange-100",
        text: "text-orange-600"
      }
    };
    return colorMap[color] || colorMap["medical-blue"];
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            const colors = getColorClasses(action.color);
            
            return (
              <Button
                key={index}
                variant="ghost"
                onClick={action.onClick}
                className="w-full flex items-center justify-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left h-auto"
              >
                <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${colors.text}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-900 font-medium text-sm">{action.label}</div>
                  <div className="text-text-gray text-xs">{action.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
