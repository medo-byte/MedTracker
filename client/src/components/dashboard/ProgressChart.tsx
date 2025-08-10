import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProgressChart() {
  const { data: weeklySessions = [], isLoading } = useQuery({
    queryKey: ["/api/study-sessions/weekly"],
  });

  // Process weekly data for chart
  const processWeeklyData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const today = new Date();
    const weekData = days.map((day, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - today.getDay() + index + 1); // Start from Monday
      
      // Find sessions for this day
      const daySessions = weeklySessions.filter((session: any) => {
        const sessionDate = new Date(session.startedAt);
        return sessionDate.toDateString() === date.toDateString();
      });

      const totalMinutes = daySessions.reduce((sum: number, session: any) => sum + (session.duration || 0), 0);
      const hours = totalMinutes / 60;
      
      return {
        day,
        hours,
        height: Math.min(Math.max((hours / 4) * 80, 20), 90) // Scale to chart height (20-90%)
      };
    });

    return weekData;
  };

  const weekData = processWeeklyData();
  const totalHours = weekData.reduce((sum, day) => sum + day.hours, 0);
  const totalQuestions = weeklySessions.reduce((sum: number, session: any) => sum + (session.questionsAnswered || 0), 0);
  const totalCorrect = weeklySessions.reduce((sum: number, session: any) => sum + (session.correctAnswers || 0), 0);
  const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;
  const avgDaily = totalHours / 7;

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="h-6 bg-gray-200 rounded w-48"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-center space-y-2">
                <div className="h-6 bg-gray-200 rounded w-12 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div>
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
          <CardTitle className="text-lg font-semibold text-gray-900">Weekly Study Progress</CardTitle>
          <Select defaultValue="this-week">
            <SelectTrigger className="w-32 text-sm border border-gray-300 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="last-week">Last Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="h-64 bg-gradient-to-t from-medical-blue from-0% via-blue-400 via-70% to-blue-200 to-100% rounded-lg relative overflow-hidden mb-6">
          <div className="absolute inset-0 flex items-end justify-around p-4">
            {weekData.map((data, index) => (
              <div key={index} className="flex flex-col items-center group cursor-pointer">
                <div 
                  className="w-8 bg-white bg-opacity-80 rounded-t transition-all duration-500 hover:bg-opacity-100 relative"
                  style={{ height: `${data.height}%` }}
                >
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {data.hours.toFixed(1)}h
                  </div>
                </div>
                <span className="text-white text-xs mt-2 font-medium">{data.day}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">{avgDaily.toFixed(1)}h</div>
            <div className="text-sm text-text-gray">Avg. Daily</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-medical-green">{totalQuestions}</div>
            <div className="text-sm text-text-gray">Questions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{Math.round(accuracy)}%</div>
            <div className="text-sm text-text-gray">Accuracy</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
