import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Clock, Target, Award } from "lucide-react";

export default function ProgressPage() {
  const { data: userStats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["/api/user/progress"],
  });

  const { data: weeklySessions = [] } = useQuery({
    queryKey: ["/api/study-sessions/weekly"],
  });

  return (
    <div className="min-h-screen bg-soft-gray">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress & Analytics</h1>
          <p className="text-text-gray">
            Track your learning journey and analyze your study patterns
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-text-gray">Study Streak</CardTitle>
                <TrendingUp className="w-4 h-4 text-orange-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {userStats?.studyStreak || 0} days
              </div>
              <p className="text-xs text-text-gray mt-1">Keep it up!</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-text-gray">Total Hours</CardTitle>
                <Clock className="w-4 h-4 text-medical-blue" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {userStats?.totalHoursStudied?.toFixed(1) || '0.0'}h
              </div>
              <p className="text-xs text-text-gray mt-1">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-text-gray">Topics Mastered</CardTitle>
                <Target className="w-4 h-4 text-medical-green" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {userStats?.totalTopicsMastered || 0}
              </div>
              <p className="text-xs text-text-gray mt-1">Across all subjects</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-text-gray">Overall Progress</CardTitle>
                <Award className="w-4 h-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {userStats?.overallProgress?.toFixed(0) || 0}%
              </div>
              <Progress value={userStats?.overallProgress || 0} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="subjects" className="space-y-6">
          <TabsList>
            <TabsTrigger value="subjects">Subject Progress</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Analytics</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subject Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userProgress.length > 0 ? (
                    userProgress.map((progress: any) => (
                      <div key={progress.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-medical-blue bg-opacity-10 rounded-lg flex items-center justify-center">
                              <i className="fas fa-book text-medical-blue text-sm"></i>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{progress.subject?.name || 'Unknown Subject'}</h3>
                              <p className="text-sm text-text-gray">
                                {progress.topicsMastered} topics mastered
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-gray-900">
                              {progress.progressPercentage?.toFixed(0) || 0}%
                            </div>
                            <div className="text-xs text-text-gray">
                              {progress.currentTopic || 'No current topic'}
                            </div>
                          </div>
                        </div>
                        <Progress value={progress.progressPercentage || 0} className="h-2" />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-text-gray">No progress data available yet.</p>
                      <p className="text-sm text-text-gray mt-1">Start studying to see your progress!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="weekly" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Study Hours</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-t from-medical-blue from-0% via-blue-400 via-70% to-blue-200 to-100% rounded-lg relative overflow-hidden">
                    <div className="absolute inset-0 flex items-end justify-around p-4">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                        <div key={day} className="flex flex-col items-center">
                          <div 
                            className="w-8 bg-white bg-opacity-80 rounded-t" 
                            style={{ height: `${Math.random() * 80 + 20}%` }}
                          ></div>
                          <span className="text-white text-xs mt-2">{day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Study Sessions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklySessions.slice(0, 5).map((session: any, index: number) => (
                      <div key={session.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {session.topic || 'General Study'}
                          </p>
                          <p className="text-sm text-text-gray">
                            {new Date(session.startedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            {session.duration} min
                          </p>
                          <p className="text-sm text-text-gray">
                            {session.questionsAnswered || 0} questions
                          </p>
                        </div>
                      </div>
                    )) || (
                      <div className="text-center py-8">
                        <p className="text-text-gray">No recent study sessions</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "First Step", description: "Complete your first study session", earned: true, icon: "🎯" },
                { title: "Week Warrior", description: "Study for 7 consecutive days", earned: true, icon: "🔥" },
                { title: "Knowledge Seeker", description: "Answer 100 questions correctly", earned: true, icon: "🧠" },
                { title: "Time Master", description: "Study for 50 hours total", earned: false, icon: "⏰" },
                { title: "Subject Expert", description: "Master 10 topics in one subject", earned: false, icon: "🏆" },
                { title: "Consistency King", description: "Study for 30 consecutive days", earned: false, icon: "👑" }
              ].map((achievement, index) => (
                <Card key={index} className={`${achievement.earned ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200' : 'bg-gray-50'}`}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`text-2xl ${achievement.earned ? 'opacity-100' : 'opacity-50'}`}>
                        {achievement.icon}
                      </div>
                      <div>
                        <CardTitle className={`text-lg ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                          {achievement.title}
                        </CardTitle>
                        {achievement.earned && (
                          <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full">
                            Earned
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-sm ${achievement.earned ? 'text-gray-700' : 'text-gray-500'}`}>
                      {achievement.description}
                    </p>
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
