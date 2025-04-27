
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getCourse, getLessonsByCourse, createLesson } from "../lib/courseService";
import { Course } from "../types";

const LessonCreate = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId || !currentUser) return;
      
      try {
        const fetchedCourse = await getCourse(courseId);
        
        if (fetchedCourse) {
          // Check if current user is the owner
          if (fetchedCourse.createdBy !== currentUser.id) {
            toast({
              title: "Unauthorized",
              description: "You don't have permission to add lessons to this course",
              variant: "destructive",
            });
            navigate(`/courses/${courseId}`);
            return;
          }
          
          setCourse(fetchedCourse);
        } else {
          toast({
            title: "Not Found",
            description: "The course was not found",
            variant: "destructive",
          });
          navigate('/courses');
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({
          title: "Error",
          description: "Failed to load course data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourseData();
  }, [courseId, currentUser, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseId || !currentUser) return;
    
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
      // Get existing lessons to determine order
      const lessons = await getLessonsByCourse(courseId);
      const nextOrder = lessons.length > 0 
        ? Math.max(...lessons.map(lesson => lesson.order)) + 1 
        : 1;
      
      await createLesson({
        title,
        videoUrl,
        content,
        courseId,
        order: nextOrder,
      });
      
      toast({
        title: "Success",
        description: "Lesson created successfully",
      });
      
      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error("Error creating lesson:", error);
      toast({
        title: "Error",
        description: "Failed to create lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading course data...</p>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Course not found</p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Lesson</h1>
        <p className="text-gray-600 mt-1">
          Adding lesson to: {course.title}
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
              {isSubmitting ? "Creating..." : "Create Lesson"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default LessonCreate;
