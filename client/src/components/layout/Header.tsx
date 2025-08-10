import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Bell, Stethoscope } from "lucide-react";

export default function Header() {
  const [location] = useLocation();
  const { user } = useAuth();

  const navItems = [
    { path: "/", label: "Dashboard" },
    { path: "/study-materials", label: "Study Materials" },
    { path: "/progress", label: "Progress" },
    { path: "/ai-assistant", label: "AI Assistant" },
    { path: "/notes", label: "Notes" },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">MedTracker</span>
            </Link>
            <nav className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link key={item.path} href={item.path}>
                  <a
                    className={`${
                      location === item.path
                        ? "text-medical-blue font-medium border-b-2 border-medical-blue pb-1"
                        : "text-text-gray hover:text-gray-900 transition-colors"
                    }`}
                  >
                    {item.label}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5 text-text-gray" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="flex items-center space-x-3">
              {user?.profileImageUrl ? (
                <img
                  src={user.profileImageUrl}
                  alt="User profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-medical-blue rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                  </span>
                </div>
              )}
              <span className="hidden sm:block text-sm font-medium text-gray-900">
                {user?.firstName || user?.email?.split('@')[0] || 'User'}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = "/api/logout"}
                className="text-text-gray hover:text-gray-900"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
