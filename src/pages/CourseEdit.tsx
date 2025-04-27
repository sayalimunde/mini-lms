
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getCourse, updateCourse } from "../lib/courseService";
import { Course } from "../types";

const CATEGORIES = [
  "Programming",
  "Design",
  "Business",
  "Marketing",
  "Personal Development",
  "Health & Fitness",
  "Music",
  "Photography",
  "Other",
];

const CourseEdit = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      try {
        const fetchedCourse = await getCourse(courseId);
        
        if (fetchedCourse) {
          setCourse(fetchedCourse);
          setTitle(fetchedCourse.title);
          setDescription(fetchedCourse.description);
          setCategory(fetchedCourse.category);
          
          // Check if current user is the owner
          if (currentUser && fetchedCourse.createdBy !== currentUser.id) {
            toast({
              title: "Unauthorized",
              description: "You don't have permission to edit this course",
              variant: "destructive",
            });
            navigate('/courses');
          }
        } else {
          toast({
            title: "Not Found",
            description: "The course you're trying to edit was not found",
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
    
    fetchCourse();
  }, [courseId, currentUser, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseId || !currentUser) return;
    
    if (!title || !category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await updateCourse(courseId, {
        title,
        description,
        category,
      });
      
      toast({
        title: "Success",
        description: "Course updated successfully",
      });
      
      navigate(`/courses/${courseId}`);
    } catch (error) {
      console.error("Error updating course:", error);
      toast({
        title: "Error",
        description: "Failed to update course. Please try again.",
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
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Course</h1>
        <p className="text-gray-600 mt-1">
          Update your course details
        </p>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Course Information</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Introduction to Web Development"
                maxLength={100}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what your course is about..."
                rows={5}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={category}
                onValueChange={setCategory}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(-1)}
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

export default CourseEdit;
