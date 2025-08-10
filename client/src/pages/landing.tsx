import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Stethoscope, Brain, BookOpen, TrendingUp, Users, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-soft-gray via-white to-blue-50">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-medical-blue rounded-lg flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">MedTracker</span>
          </div>
          <Button 
            onClick={() => window.location.href = "/api/login"}
            className="bg-medical-blue hover:bg-blue-700 text-white"
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Revolutionize Your
            <span className="text-medical-blue"> Medical Education</span>
          </h1>
          <p className="text-xl text-text-gray mb-8 leading-relaxed">
            AI-powered learning platform designed specifically for medical students. 
            Track progress, get personalized recommendations, and master medical knowledge faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg"
              onClick={() => window.location.href = "/api/login"}
              className="bg-medical-blue hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Start Learning Today
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="border-medical-blue text-medical-blue hover:bg-blue-50 px-8 py-3 text-lg"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Excel in Medical School
          </h2>
          <p className="text-lg text-text-gray max-w-2xl mx-auto">
            Our comprehensive platform combines AI technology with proven learning methodologies 
            to accelerate your medical education journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-medical-blue bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-medical-blue" />
              </div>
              <CardTitle>AI Medical Assistant</CardTitle>
              <CardDescription>
                Get instant answers to medical questions with our advanced AI powered by the latest medical knowledge.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-medical-green bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-medical-green" />
              </div>
              <CardTitle>Progress Tracking</CardTitle>
              <CardDescription>
                Monitor your learning journey with detailed analytics, study streaks, and personalized insights.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Comprehensive Database</CardTitle>
              <CardDescription>
                Access a vast library of medical knowledge, study materials, and practice questions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Personalized Learning</CardTitle>
              <CardDescription>
                Adaptive study recommendations based on your progress, strengths, and areas for improvement.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Study Timer & Tools</CardTitle>
              <CardDescription>
                Built-in Pomodoro timer, note-taking system, and productivity tools to optimize your study sessions.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Stethoscope className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Practice MCQs</CardTitle>
              <CardDescription>
                AI-generated multiple choice questions tailored to your study subjects and difficulty level.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-medical-blue mb-2">10,000+</div>
              <div className="text-text-gray">Medical Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-medical-green mb-2">95%</div>
              <div className="text-text-gray">Pass Rate Improvement</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-text-gray">Medical Subjects</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-text-gray">AI Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Medical Education?
          </h2>
          <p className="text-lg text-text-gray mb-8">
            Join thousands of medical students who are already accelerating their learning with MedTracker.
          </p>
          <Button 
            size="lg"
            onClick={() => window.location.href = "/api/login"}
            className="bg-medical-blue hover:bg-blue-700 text-white px-12 py-4 text-lg"
          >
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">MedTracker</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2024 MedTracker. Empowering medical education worldwide.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
