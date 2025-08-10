import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Search, Edit, Trash2, BookOpen, Tag } from "lucide-react";

export default function Notes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteTags, setNoteTags] = useState("");
  const { toast } = useToast();

  const { data: notes = [] } = useQuery({
    queryKey: ["/api/notes"],
  });

  const createNoteMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; tags?: string[] }) => {
      return await apiRequest("POST", "/api/notes", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      setIsCreateDialogOpen(false);
      setNoteTitle("");
      setNoteContent("");
      setNoteTags("");
      toast({
        title: "Note created!",
        description: "Your note has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      return await apiRequest("DELETE", `/api/notes/${noteId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Note deleted!",
        description: "Your note has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateNote = () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;
    
    const tags = noteTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    createNoteMutation.mutate({
      title: noteTitle,
      content: noteContent,
      tags: tags.length > 0 ? tags : undefined
    });
  };

  const handleDeleteNote = (noteId: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      deleteNoteMutation.mutate(noteId);
    }
  };

  const filteredNotes = notes.filter((note: any) =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (note.tags && note.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-soft-gray">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Notes</h1>
            <p className="text-text-gray">
              Organize your study notes and enhance them with AI
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-medical-blue hover:bg-blue-700 mt-4 sm:mt-0">
                <Plus className="w-4 h-4 mr-2" />
                New Note
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Note title..."
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                />
                <Textarea
                  placeholder="Write your note content here..."
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  rows={8}
                />
                <Input
                  placeholder="Tags (comma separated)"
                  value={noteTags}
                  onChange={(e) => setNoteTags(e.target.value)}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateNote}
                    disabled={createNoteMutation.isPending || !noteTitle.trim() || !noteContent.trim()}
                  >
                    Create Note
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-gray w-4 h-4" />
            <Input
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note: any) => (
              <Card key={note.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{note.title}</CardTitle>
                      <p className="text-xs text-text-gray mt-1">
                        {new Date(note.createdAt).toLocaleDateString()}
                        {note.isAiGenerated && (
                          <Badge variant="secondary" className="ml-2">AI Enhanced</Badge>
                        )}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button size="sm" variant="ghost">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-700 line-clamp-4 mb-4">
                    {note.content}
                  </p>
                  
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {note.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center text-xs text-text-gray">
                    <span>{note.content.length} characters</span>
                    <Button size="sm" variant="outline">
                      <BookOpen className="w-4 h-4 mr-1" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No notes found" : "No notes yet"}
            </h3>
            <p className="text-text-gray mb-6">
              {searchQuery 
                ? "Try adjusting your search terms"
                : "Create your first note to start organizing your study materials"
              }
            </p>
            {!searchQuery && (
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-medical-blue hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Note
              </Button>
            )}
          </div>
        )}

        {/* Quick Tips */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                Organize
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-800">
                Use tags to categorize your notes by subject, topic, or difficulty level for easy searching.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Edit className="w-5 h-5 mr-2 text-green-600" />
                Enhance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-green-800">
                Use the AI Assistant to enhance your notes with additional details and better organization.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Search className="w-5 h-5 mr-2 text-purple-600" />
                Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-purple-800">
                Quickly find notes by searching through titles, content, or tags across all your notes.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
