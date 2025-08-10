import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, BookOpen, Video, FileText, Download } from "lucide-react";

export default function StudyMaterials() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: subjects = [] } = useQuery({
    queryKey: ["/api/subjects"],
  });

  const filteredSubjects = subjects.filter((subject: any) =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-soft-gray">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Study Materials</h1>
          <p className="text-text-gray">
            Access comprehensive medical resources, textbooks, and practice materials
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray w-4 h-4" />
            <Input
              placeholder="Search subjects, topics, or materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Material Categories */}
        <Tabs defaultValue="subjects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="textbooks">Textbooks</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="practice">Practice Tests</TabsTrigger>
          </TabsList>

          <TabsContent value="subjects" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSubjects.map((subject: any) => (
                <Card key={subject.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-medical-blue bg-opacity-10 rounded-lg flex items-center justify-center`}>
                        <i className={`${subject.icon} text-medical-blue text-xl`}></i>
                      </div>
                      <div>
                        <CardTitle className="text-lg">{subject.name}</CardTitle>
                        <p className="text-sm text-text-gray">{subject.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-gray">Materials</span>
                        <span className="font-medium">24 resources</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-gray">Last updated</span>
                        <span className="font-medium">2 days ago</span>
                      </div>
                      <Button className="w-full mt-4" variant="outline">
                        View Materials
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="textbooks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Harrison's Principles of Internal Medicine", author: "Kasper et al.", edition: "21st Edition", pages: 4736 },
                { title: "Gray's Anatomy for Students", author: "Drake et al.", edition: "4th Edition", pages: 1168 },
                { title: "Robbins Basic Pathology", author: "Kumar et al.", edition: "10th Edition", pages: 928 },
                { title: "Lange's Medical Pharmacology", author: "Katzung", edition: "14th Edition", pages: 1248 },
                { title: "Clinical Cardiology Made Easy", author: "Gabriel Khan", edition: "6th Edition", pages: 512 },
                { title: "Neurology and Neurosurgery Illustrated", author: "Lindsay et al.", edition: "5th Edition", pages: 624 }
              ].map((book, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                        <p className="text-sm text-text-gray mt-1">{book.author}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-gray">Edition</span>
                        <span className="font-medium">{book.edition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-gray">Pages</span>
                        <span className="font-medium">{book.pages}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button size="sm" className="flex-1">
                        <FileText className="w-4 h-4 mr-1" />
                        Read
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Cardiac Catheterization Procedure", duration: "15:32", views: "12.5K", category: "Cardiology" },
                { title: "Neurological Examination Techniques", duration: "22:15", views: "8.3K", category: "Neurology" },
                { title: "Pharmacokinetics and Pharmacodynamics", duration: "18:45", views: "15.7K", category: "Pharmacology" },
                { title: "Respiratory System Physiology", duration: "25:18", views: "11.2K", category: "Physiology" },
                { title: "Surgical Suturing Techniques", duration: "12:30", views: "9.8K", category: "Surgery" },
                { title: "ECG Interpretation Basics", duration: "20:05", views: "18.4K", category: "Cardiology" }
              ].map((video, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <Video className="w-6 h-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{video.title}</CardTitle>
                        <p className="text-sm text-text-gray mt-1">{video.category}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-gray">Duration</span>
                        <span className="font-medium">{video.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-gray">Views</span>
                        <span className="font-medium">{video.views}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">
                      <Video className="w-4 h-4 mr-2" />
                      Watch Video
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="practice" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "Cardiology MCQ Bank", questions: 150, difficulty: "Intermediate", time: "3 hours" },
                { title: "Neurology Case Studies", questions: 75, difficulty: "Advanced", time: "2 hours" },
                { title: "Pharmacology Quiz", questions: 100, difficulty: "Beginner", time: "90 minutes" },
                { title: "Anatomy Practical Exam", questions: 120, difficulty: "Intermediate", time: "2.5 hours" },
                { title: "Physiology Mock Test", questions: 80, difficulty: "Advanced", time: "2 hours" },
                { title: "General Medicine MCQs", questions: 200, difficulty: "Mixed", time: "4 hours" }
              ].map((test, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{test.title}</CardTitle>
                        <p className="text-sm text-text-gray mt-1">{test.difficulty} Level</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-gray">Questions</span>
                        <span className="font-medium">{test.questions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-gray">Time</span>
                        <span className="font-medium">{test.time}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">
                      Start Practice Test
                    </Button>
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
