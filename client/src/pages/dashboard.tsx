import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import StatsOverview from "@/components/dashboard/StatsOverview";
import StudyPlan from "@/components/dashboard/StudyPlan";
import ProgressChart from "@/components/dashboard/ProgressChart";
import RecentActivity from "@/components/dashboard/RecentActivity";
import ChatInterface from "@/components/ai/ChatInterface";
import StudyTimer from "@/components/study/StudyTimer";
import QuickActions from "@/components/study/QuickActions";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-soft-gray">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-medical-blue"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-soft-gray">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Good morning, {user?.firstName || 'Student'}! 👋
              </h1>
              <p className="text-text-gray mt-1">
                Ready to continue your medical studies? You're making great progress.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <button className="bg-medical-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                <i className="fas fa-play mr-2"></i>Start Study Session
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <StudyPlan />
            <ProgressChart />
            <RecentActivity />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ChatInterface />
            <StudyTimer />
            <QuickActions />
          </div>
        </div>
      </div>

      {/* Floating Chat Button for Mobile */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-medical-blue to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 lg:hidden">
        <i className="fas fa-comments text-xl"></i>
      </button>
    </div>
  );
}
