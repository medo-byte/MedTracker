import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Brain, Pill } from "lucide-react";

export default function StudyPlan() {
  const { data: subjects = [], isLoading } = useQuery({
    queryKey: ["/api/subjects"],
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["/api/user/progress"],
  });

  // Create a map of subject progress for quick lookup
  const progressMap = userProgress.reduce((acc: any, progress: any) => {
    acc[progress.subjectId] = progress;
    return acc;
  }, {});

  const getIconComponent = (iconString: string) => {
    switch (iconString) {
      case "fas fa-heart":
        return Heart;
      case "fas fa-brain":
        return Brain;
      case "fas fa-pills":
        return Pill;
      default:
        return Heart;
    }
  };

  const getColorClasses = (color: string, isHighlighted: boolean = false) => {
    const colorMap: { [key: string]: { bg: string; text: string; bgOpacity: string } } = {
      "medical-blue": {
        bg: isHighlighted ? "bg-gradient-to-r from-medical-blue to-blue-600" : "bg-medical-blue bg-opacity-10",
        text: isHighlighted ? "text-white" : "text-medical-blue",
        bgOpacity: "bg-white bg-opacity-20"
      },
      "medical-green": {
        bg: isHighlighted ? "bg-gradient-to-r from-medical-green to-green-600" : "bg-medical-green bg-opacity-10",
        text: isHighlighted ? "text-white" : "text-medical-green",
        bgOpacity: "bg-white bg-opacity-20"
      },
      "purple-600": {
        bg: isHighlighted ? "bg-gradient-to-r from-purple-600 to-purple-700" : "bg-purple-100",
        text: isHighlighted ? "text-white" : "text-purple-600",
        bgOpacity: "bg-white bg-opacity-20"
      }
    };
    return colorMap[color] || colorMap["medical-blue"];
  };

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center p-4 border border-gray-200 rounded-lg">
                <div className="w-12 h-12 bg-gray-200 rounded-lg mr-4"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="text-right space-y-1">
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-12"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Current Study Plan</CardTitle>
          <Button variant="ghost" className="text-medical-blue hover:text-blue-700 text-sm font-medium">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subjects.length > 0 ? (
            subjects.slice(0, 3).map((subject: any, index: number) => {
              const progress = progressMap[subject.id];
              const isHighlighted = index === 0; // Highlight first subject
              const progressPercentage = progress?.progressPercentage || 0;
              const Icon = getIconComponent(subject.icon);
              const colorClasses = getColorClasses(subject.color, isHighlighted);

              return (
                <div
                  key={subject.id}
                  className={`flex items-center p-4 rounded-lg transition-colors ${
                    isHighlighted 
                      ? colorClasses.bg + " text-white"
                      : "border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-4 ${
                    isHighlighted ? colorClasses.bgOpacity : colorClasses.bg
                  }`}>
                    <Icon className={`text-xl w-6 h-6 ${
                      isHighlighted ? "text-white" : colorClasses.text
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold ${
                      isHighlighted ? "text-white" : "text-gray-900"
                    }`}>
                      {subject.name}
                    </h3>
                    <p className={`text-sm ${
                      isHighlighted ? "text-blue-100" : "text-text-gray"
                    }`}>
                      Next: {progress?.currentTopic || "Start studying"}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm ${
                      isHighlighted ? "text-blue-100" : "text-text-gray"
                    }`}>
                      Progress
                    </div>
                    <div className={`text-lg font-bold ${
                      isHighlighted ? "text-white" : "text-gray-900"
                    }`}>
                      {Math.round(progressPercentage)}%
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-text-gray">No subjects available.</p>
              <p className="text-sm text-text-gray mt-1">
                Initialize default subjects to get started.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
