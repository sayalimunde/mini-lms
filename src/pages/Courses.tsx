import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink, Plus as PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { useAuth } from "../context/AuthContext";
import { deleteCourse, getAllCourses, getCoursesByInstructor } from "../lib/courseService"; // ✅ updated import
import { Course } from "../types";

const Courses = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [indexError, setIndexError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const fetchCourses = async () => {
    if (currentUser) {
      try {
        let fetchedCourses: Course[] = [];

        if (currentUser.role === "instructor") {
          fetchedCourses = await getCoursesByInstructor(currentUser.id);
        } else {
          fetchedCourses = await getAllCourses(); // ✅ student/user gets all courses
        }

        setCourses(fetchedCourses);
        setIndexError(null);
      } catch (error: any) {
        console.error("Error fetching courses:", error);

        if (error.code === "failed-precondition" && error.message.includes("index")) {
          const urlMatch = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s"]+/);
          const indexUrl = urlMatch ? urlMatch[0] : null;
          setIndexError(indexUrl);
        } else {
          toast({
            title: "Error",
            description: "Failed to load courses. Please try again.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  useEffect(() => {
    fetchCourses();
  }, [currentUser]);
  
  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
  };
  
  const handleDeleteConfirm = async () => {
    if (!courseToDelete) return;
    
    try {
      await deleteCourse(courseToDelete);
      setCourses(courses.filter(course => course.id !== courseToDelete));
      toast({
        title: "Success",
        description: "Course deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting course:", error);
      toast({
        title: "Error",
        description: "Failed to delete course. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCourseToDelete(null);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading courses...</p>
      </div>
    );
  }
  
  if (indexError) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Database Setup Required</h1>
        
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Firestore Index Needed</AlertTitle>
          <AlertDescription className="space-y-4">
            <p>
              Your Firebase database requires an additional index to be created before courses can be loaded.
              This is a one-time setup required for queries that filter and sort data.
            </p>
            
            <div className="mt-4">
              <p className="font-semibold mb-2">How to fix:</p>
              <ol className="list-decimal list-inside pl-4 space-y-2">
                <li>Click the "Create Index" button below</li>
                <li>Sign in to your Firebase console (if not already signed in)</li>
                <li>Click the "Create Index" button on the Firebase page</li>
                <li>Return to this app and refresh the page</li>
              </ol>
            </div>
            
            <div className="mt-4">
              <a 
                href={indexError} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Create Index <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </div>
          </AlertDescription>
        </Alert>
        
        <Button onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    );
  }
  
  const isInstructor = currentUser?.role === "instructor";
  
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {isInstructor ? "My Courses" : "Available Courses"}
          </h1>
          <p className="text-gray-600 mt-1">
            {isInstructor 
              ? "Manage and organize your created courses" 
              : "Browse and enroll in available courses"}
          </p>
        </div>
        
        {isInstructor && (
          <Link to="/courses/create">
            <Button className="flex items-center">
              <PlusIcon className="w-4 h-4 mr-2" />
              New Course
            </Button>
          </Link>
        )}
      </div>
      
      {courses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map(course => (
            <CourseCard 
              key={course.id} 
              course={course}
              isOwner={isInstructor}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h3 className="text-lg font-medium mb-2">
            {isInstructor 
              ? "You haven't created any courses yet" 
              : "No courses available"}
          </h3>
          <p className="text-gray-600 mb-4">
            {isInstructor 
              ? "Get started by creating your first course" 
              : "Check back later for new courses"}
          </p>
          
          {isInstructor && (
            <Link to="/courses/create">
              <Button>Create Course</Button>
            </Link>
          )}
        </div>
      )}
      
      <AlertDialog open={!!courseToDelete} onOpenChange={(open) => !open && setCourseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the course and all associated lessons.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Courses;



// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Button } from "@/components/ui/button";
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
// import { useToast } from "@/components/ui/use-toast";
// import { getCoursesByInstructor, deleteCourse } from "../lib/courseService";
// import { Course } from "../types";
// import CourseCard from "../components/CourseCard";
// import { Plus as PlusIcon, ExternalLink } from "lucide-react";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// const Courses = () => {
//   const { currentUser } = useAuth();
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
//   const [indexError, setIndexError] = useState<string | null>(null);
//   const { toast } = useToast();
  
//   const fetchCourses = async () => {
//     if (currentUser) {
//       try {
//         const fetchedCourses = await getCoursesByInstructor(currentUser.id);
//         setCourses(fetchedCourses);
//         setIndexError(null);
//       } catch (error: any) {
//         console.error("Error fetching courses:", error);
        
//         // Check if it's an indexing error
//         if (error.code === "failed-precondition" && error.message.includes("index")) {
//           // Extract the index creation URL
//           const urlMatch = error.message.match(/https:\/\/console\.firebase\.google\.com[^\s"]+/);
//           const indexUrl = urlMatch ? urlMatch[0] : null;
//           setIndexError(indexUrl);
//         } else {
//           toast({
//             title: "Error",
//             description: "Failed to load courses. Please try again.",
//             variant: "destructive",
//           });
//         }
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };
  
//   useEffect(() => {
//     fetchCourses();
//   }, [currentUser]);
  
//   const handleDeleteClick = (courseId: string) => {
//     setCourseToDelete(courseId);
//   };
  
//   const handleDeleteConfirm = async () => {
//     if (!courseToDelete) return;
    
//     try {
//       await deleteCourse(courseToDelete);
//       setCourses(courses.filter(course => course.id !== courseToDelete));
//       toast({
//         title: "Success",
//         description: "Course deleted successfully",
//       });
//     } catch (error) {
//       console.error("Error deleting course:", error);
//       toast({
//         title: "Error",
//         description: "Failed to delete course. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setCourseToDelete(null);
//     }
//   };
  
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p>Loading courses...</p>
//       </div>
//     );
//   }
  
//   if (indexError) {
//     return (
//       <div className="space-y-6">
//         <h1 className="text-3xl font-bold">Database Setup Required</h1>
        
//         <Alert variant="destructive" className="mb-6">
//           <AlertTitle>Firestore Index Needed</AlertTitle>
//           <AlertDescription className="space-y-4">
//             <p>
//               Your Firebase database requires an additional index to be created before courses can be loaded.
//               This is a one-time setup required for queries that filter and sort data.
//             </p>
            
//             <div className="mt-4">
//               <p className="font-semibold mb-2">How to fix:</p>
//               <ol className="list-decimal list-inside pl-4 space-y-2">
//                 <li>Click the "Create Index" button below</li>
//                 <li>Sign in to your Firebase console (if not already signed in)</li>
//                 <li>Click the "Create Index" button on the Firebase page</li>
//                 <li>Return to this app and refresh the page</li>
//               </ol>
//             </div>
            
//             <div className="mt-4">
//               <a 
//                 href={indexError} 
//                 target="_blank" 
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
//               >
//                 Create Index <ExternalLink className="h-4 w-4 ml-1" />
//               </a>
//             </div>
//           </AlertDescription>
//         </Alert>
        
//         <Button onClick={() => window.location.reload()}>
//           Refresh Page
//         </Button>
//       </div>
//     );
//   }
  
//   const isInstructor = currentUser?.role === "instructor";
  
//   return (
//     <div>
//       <div className="mb-8 flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">
//             {isInstructor ? "My Courses" : "Available Courses"}
//           </h1>
//           <p className="text-gray-600 mt-1">
//             {isInstructor 
//               ? "Manage and organize your created courses" 
//               : "Browse and enroll in available courses"}
//           </p>
//         </div>
        
//         {isInstructor && (
//           <Link to="/courses/create">
//             <Button className="flex items-center">
//               <PlusIcon className="w-4 h-4 mr-2" />
//               New Course
//             </Button>
//           </Link>
//         )}
//       </div>
      
//       {courses.length > 0 ? (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {courses.map(course => (
//             <CourseCard 
//               key={course.id} 
//               course={course}
//               isOwner={isInstructor}
//               onDelete={handleDeleteClick}
//             />
//           ))}
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow p-8 text-center">
//           <h3 className="text-lg font-medium mb-2">
//             {isInstructor 
//               ? "You haven't created any courses yet" 
//               : "No courses available"}
//           </h3>
//           <p className="text-gray-600 mb-4">
//             {isInstructor 
//               ? "Get started by creating your first course" 
//               : "Check back later for new courses"}
//           </p>
          
//           {isInstructor && (
//             <Link to="/courses/create">
//               <Button>Create Course</Button>
//             </Link>
//           )}
//         </div>
//       )}
      
//       <AlertDialog open={!!courseToDelete} onOpenChange={(open) => !open && setCourseToDelete(null)}>
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This will permanently delete the course and all associated lessons.
//               This action cannot be undone.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
//               Delete
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </div>
//   );
// };

// export default Courses;
