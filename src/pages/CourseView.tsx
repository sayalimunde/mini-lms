
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { getCourse, getLessonsByCourse, deleteLesson } from "../lib/courseService";
import { Course, Lesson } from "../types";
import LessonList from "../components/LessonList";
import VideoPlayer from "../components/VideoPlayer";
import { Edit as EditIcon, Plus as PlusIcon, AlertCircle as AlertCircleIcon } from "lucide-react";

const CourseView = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lessonToDelete, setLessonToDelete] = useState<string | null>(null);
  const [indexError, setIndexError] = useState<string | null>(null);
  
  const fetchCourseData = async () => {
    if (!courseId) return;
    
    try {
      // First get the course info
      const fetchedCourse = await getCourse(courseId);
      
      if (fetchedCourse) {
        setCourse(fetchedCourse);
        
        // Then try to get the lessons
        try {
          const fetchedLessons = await getLessonsByCourse(courseId);
          setLessons(fetchedLessons);
          
          if (fetchedLessons.length > 0) {
            setSelectedLesson(fetchedLessons[0]);
          }
        } catch (lessonError: any) {
          console.error("Error fetching lessons:", lessonError);
          
          // Check if it's an indexing error
          if (lessonError.code === "failed-precondition" && 
              lessonError.message && 
              lessonError.message.includes("index")) {
            const indexUrl = lessonError.message.match(/https:\/\/console\.firebase\.google\.com[^\s]*/)?.[0];
            setIndexError(indexUrl || null);
          } else {
            toast({
              title: "Error",
              description: "Failed to load lessons. Please try again.",
              variant: "destructive",
            });
          }
        }
      } else {
        toast({
          title: "Not Found",
          description: "The course you're looking for was not found",
          variant: "destructive",
        });
        navigate('/courses');
      }
    } catch (error) {
      console.error("Error fetching course data:", error);
      toast({
        title: "Error",
        description: "Failed to load course data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchCourseData();
  }, [courseId]);
  
  const isOwner = currentUser && course && currentUser.id === course.createdBy;
  
  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };
  
  const handleLessonDelete = async (lessonId: string) => {
    setLessonToDelete(lessonId);
  };
  
  const confirmLessonDelete = async () => {
    if (!lessonToDelete) return;
    
    try {
      await deleteLesson(lessonToDelete);
      
      // Update lessons list
      setLessons(lessons.filter(lesson => lesson.id !== lessonToDelete));
      
      // If deleted lesson was selected, select first available lesson
      if (selectedLesson && selectedLesson.id === lessonToDelete) {
        const remainingLessons = lessons.filter(lesson => lesson.id !== lessonToDelete);
        setSelectedLesson(remainingLessons.length > 0 ? remainingLessons[0] : null);
      }
      
      toast({
        title: "Success",
        description: "Lesson deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting lesson:", error);
      toast({
        title: "Error",
        description: "Failed to delete lesson. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLessonToDelete(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading course...</p>
      </div>
    );
  }
  
  if (indexError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] max-w-2xl mx-auto text-center">
        <AlertCircleIcon className="h-12 w-12 text-amber-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Firebase Index Required</h2>
        <p className="mb-4 text-gray-600">
          This application requires a Firestore index to be created for sorting lessons by course and order.
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 text-left">
          <p className="font-medium mb-2">To fix this issue:</p>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click the "Create Index" button below to open Firebase console</li>
            <li>Sign in to your Firebase account if prompted</li>
            <li>Click the "Create index" button on the Firebase page</li>
            <li>Wait a few minutes for the index to be created</li>
            <li>Return to this page and refresh</li>
          </ol>
        </div>
        <div className="flex gap-4">
          <a href={indexError} target="_blank" rel="noopener noreferrer">
            <Button variant="default">
              Create Index
            </Button>
          </a>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-semibold mb-4">Course not found</p>
        <Link to="/courses">
          <Button>Go to Courses</Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <div className="flex items-center mt-1">
            <span className="text-sm bg-lms-light text-lms-primary px-3 py-1 rounded-full">
              {course.category}
            </span>
          </div>
        </div>
        
        {isOwner && (
          <div className="flex space-x-3">
            <Link to={`/courses/${courseId}/lessons/create`}>
              <Button variant="outline" className="flex items-center">
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Lesson
              </Button>
            </Link>
            <Link to={`/courses/${courseId}/edit`}>
              <Button className="flex items-center">
                <EditIcon className="w-4 h-4 mr-1" />
                Edit Course
              </Button>
            </Link>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {selectedLesson ? (
            <Card className="overflow-hidden">
              <div className="bg-black">
                <VideoPlayer 
                  videoUrl={selectedLesson.videoUrl} 
                  title={selectedLesson.title}
                />
              </div>
              
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">{selectedLesson.title}</h2>
                
                <Tabs defaultValue="content">
                  <TabsList>
                    <TabsTrigger value="content">Lesson Content</TabsTrigger>
                    <TabsTrigger value="about">About This Course</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="content" className="mt-4">
                    <div className="prose max-w-none">
                      {selectedLesson.content ? (
                        <p>{selectedLesson.content}</p>
                      ) : (
                        <p className="text-gray-500">No content available for this lesson.</p>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="about" className="mt-4">
                    <div className="prose max-w-none">
                      {course.description ? (
                        <p>{course.description}</p>
                      ) : (
                        <p className="text-gray-500">No description available for this course.</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </Card>
          ) : (
            <Card className="flex flex-col items-center justify-center p-12 text-center">
              <h2 className="text-xl font-semibold mb-2">No lessons available</h2>
              <p className="text-gray-600 mb-6">
                {isOwner 
                  ? "Get started by adding your first lesson to this course."
                  : "This course doesn't have any lessons yet."}
              </p>
              
              {isOwner && (
                <Link to={`/courses/${courseId}/lessons/create`}>
                  <Button>
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Add First Lesson
                  </Button>
                </Link>
              )}
            </Card>
          )}
        </div>
        
        <div>
          <LessonList 
            lessons={lessons} 
            courseId={courseId || ""} 
            isOwner={!!isOwner}
            onDelete={handleLessonDelete}
          />
        </div>
      </div>
      
      <AlertDialog open={!!lessonToDelete} onOpenChange={(open) => !open && setLessonToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this lesson.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLessonDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CourseView;
