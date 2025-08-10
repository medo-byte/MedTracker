import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Book, Lightbulb } from "lucide-react";

export default function RecentActivity() {
  const { data: studySessions = [], isLoading } = useQuery({
    queryKey: ["/api/study-sessions"],
    retry: false,
  });

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const sessionDate = new Date(date);
    const diffMs = now.getTime() - sessionDate.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return CheckCircle;
      case 'study':
        return Book;
      case 'insight':
        return Lightbulb;
      default:
        return Book;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'quiz':
        return {
          bg: 'bg-medical-green bg-opacity-10',
          text: 'text-medical-green'
        };
      case 'study':
        return {
          bg: 'bg-medical-blue bg-opacity-10',
          text: 'text-medical-blue'
        };
      case 'insight':
        return {
          bg: 'bg-orange-100',
          text: 'text-orange-600'
        };
      default:
        return {
          bg: 'bg-gray-100',
          text: 'text-gray-600'
        };
    }
  };

  // Transform study sessions into activity format
  const activities = studySessions.slice(0, 3).map((session: any) => {
    const hasQuestions = session.questionsAnswered > 0;
    return {
      id: session.id,
      type: hasQuestions ? 'quiz' : 'study',
      title: hasQuestions 
        ? `Completed Practice Session`
        : `Studied ${session.topic || 'General Topics'}`,
      description: hasQuestions
        ? `Scored ${session.correctAnswers}/${session.questionsAnswered} questions correctly`
        : `Studied for ${session.duration} minutes`,
      time: formatTimeAgo(session.startedAt),
    };
  });

  // Add some default activities if we don't have enough data
  if (activities.length === 0) {
    activities.push(
      {
        id: 'welcome',
        type: 'insight',
        title: 'Welcome to MedTracker!',
        description: 'Start your first study session to see your activity here',
        time: 'Just now',
      }
    );
  }

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-32"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
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
        <CardTitle className="text-lg font-semibold text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = getActivityIcon(activity.type);
            const colors = getActivityColor(activity.type);
            
            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center mt-1`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 font-medium">{activity.title}</p>
                  <p className="text-text-gray text-sm">{activity.description}</p>
                  <p className="text-text-gray text-xs mt-1">{activity.time}</p>
                </div>
              </div>
            );
          })}
          
          {activities.length === 1 && activities[0].id === 'welcome' && (
            <div className="text-center py-4">
              <p className="text-text-gray text-sm">
                Complete study sessions to build your activity timeline
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
