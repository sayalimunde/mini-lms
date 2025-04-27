
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getCourse, getLesson, updateLesson } from "../lib/courseService";
import { Course, Lesson } from "../types";

const LessonEdit = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !lessonId || !currentUser) return;
      
      try {
        const [fetchedCourse, fetchedLesson] = await Promise.all([
          getCourse(courseId),
          getLesson(lessonId),
        ]);
        
        if (!fetchedCourse || !fetchedLesson) {
          toast({
            title: "Not Found",
            description: "The lesson or course was not found",
            variant: "destructive",
          });
          navigate(`/courses/${courseId}`);
          return;
        }
        
        // Check if current user is the owner
        if (fetchedCourse.createdBy !== currentUser.id) {
          toast({
            title: "Unauthorized",
            description: "You don't have permission to edit lessons for this course",
            variant: "destructive",
          });
          navigate(`/courses/${courseId}`);
          return;
        }
        
        // Check if lesson belongs to the course
        if (fetchedLesson.courseId !== courseId) {
          toast({
            title: "Error",
            description: "This lesson doesn't belong to this course",
            variant: "destructive",
          });
          navigate(`/courses/${courseId}`);
          return;
        }
        
        setCourse(fetchedCourse);
        setLesson(fetchedLesson);
        setTitle(fetchedLesson.title);
        setVideoUrl(fetchedLesson.videoUrl);
        setContent(fetchedLesson.content);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, lessonId, currentUser, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lessonId || !currentUser) return;
    
    if (!title || !videoUrl) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateLesson(lessonId, {
        title,
        videoUrl,
        content,
      });
      
      toast({
        title: "Success",
        description: "Lesson updated successfully",
      });
      
      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error("Error updating lesson:", error);
      toast({
        title: "Error",
        description: "Failed to update lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading lesson data...</p>
      </div>
    );
  }
  
  if (!course || !lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Lesson not found</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Lesson</h1>
        <p className="text-gray-600 mt-1">
          Editing lesson in: {course.title}
        </p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Lesson Information</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Lesson Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Introduction to HTML"
                maxLength={100}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="videoUrl">Video URL *</Label>
              <Input
                id="videoUrl"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="e.g., https://www.youtube.com/watch?v=..."
                required
              />
              <p className="text-xs text-gray-500">
                YouTube links or direct video URLs are supported
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Lesson Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add any additional content or notes for this lesson..."
                rows={8}
              />
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/courses/${courseId}`)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LessonEdit;
