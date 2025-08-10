import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Clock, Target, BarChart3 } from "lucide-react";

export default function StatsOverview() {
  const { data: userStats, isLoading } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const stats = [
    {
      title: "Study Streak",
      value: userStats?.studyStreak || 0,
      unit: "days",
      change: "+2 days",
      changeType: "positive",
      icon: TrendingUp,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
    },
    {
      title: "Hours Studied",
      value: userStats?.totalHoursStudied?.toFixed(1) || "0.0",
      unit: "h",
      change: "+5.2h",
      changeType: "positive",
      icon: Clock,
      iconBg: "bg-medical-blue bg-opacity-10",
      iconColor: "text-medical-blue",
    },
    {
      title: "Topics Mastered",
      value: userStats?.totalTopicsMastered || 0,
      unit: "",
      change: "+8",
      changeType: "positive",
      icon: Target,
      iconBg: "bg-medical-green bg-opacity-10",
      iconColor: "text-medical-green",
    },
    {
      title: "Overall Progress",
      value: userStats?.overallProgress?.toFixed(0) || 0,
      unit: "%",
      change: "",
      changeType: "neutral",
      icon: BarChart3,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      showProgress: true,
      progressValue: userStats?.overallProgress || 0,
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="bg-white rounded-xl shadow-sm border border-gray-100">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-text-gray text-sm font-medium">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}{stat.unit}
                  </p>
                </div>
                <div className={`w-12 h-12 ${stat.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${stat.iconColor} text-xl w-6 h-6`} />
                </div>
              </div>
              <div className="mt-4">
                {stat.showProgress ? (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${stat.progressValue}%` }}
                    ></div>
                  </div>
                ) : stat.change && (
                  <div className="flex items-center text-sm">
                    <TrendingUp className="text-green-500 mr-1 w-4 h-4" />
                    <span className="text-green-500 font-medium">{stat.change}</span>
                    <span className="text-text-gray ml-1">
                      {index === 0 ? "from last week" : index === 1 ? "this week" : "this month"}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
