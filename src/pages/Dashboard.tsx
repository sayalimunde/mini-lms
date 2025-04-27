import { Button } from "@/components/ui/button";
import { Plus as PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { useAuth } from "../context/AuthContext";
import { getAllCourses, getCoursesByInstructor } from "../lib/courseService";
import { Course } from "../types";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      if (currentUser) {
        try {
          if (currentUser.role === "instructor") {
            const fetchedCourses = await getCoursesByInstructor(currentUser.id);
            setCourses(fetchedCourses);
          } else if (currentUser.role === "student") {
            const fetchedCourses = await getAllCourses();
            setCourses(fetchedCourses);
          }
        } catch (error) {
          console.error("Error fetching courses:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCourses();
  }, [currentUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const isInstructor = currentUser?.role === "instructor";

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {isInstructor
              ? "Manage your courses and lessons"
              : "Explore and learn from available courses"}
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

      {isInstructor ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Recent Courses</h2>

          {courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <CourseCard key={course.id} course={course} isOwner={true} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-lg font-medium mb-2">You haven't created any courses yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first course</p>

              <Link to="/courses/create">
                <Button variant="outline">Create Course</Button>
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Available Courses</h2>

          {courses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course.id} course={course} isOwner={false} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <h3 className="text-lg font-medium mb-2">No courses available</h3>
              <p className="text-gray-600 mb-4">Please check back later!</p>
            </div>
          )}
        </div>
      )}

      {isInstructor && courses.length > 0 && (
        <div className="text-center">
          <Link to="/courses">
            <Button variant="outline">View All Courses</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { Button } from "@/components/ui/button";
// import { getCoursesByInstructor } from "../lib/courseService";
// import { Course } from "../types";
// import CourseCard from "../components/CourseCard";
// import { Plus as PlusIcon } from "lucide-react";

// const Dashboard = () => {
//   const { currentUser } = useAuth();
//   const [courses, setCourses] = useState<Course[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
  
//   useEffect(() => {
//     const fetchCourses = async () => {
//       if (currentUser && currentUser.role === "instructor") {
//         try {
//           const fetchedCourses = await getCoursesByInstructor(currentUser.id);
//           setCourses(fetchedCourses);
//         } catch (error) {
//           console.error("Error fetching courses:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       } else {
//         // For students, we don't have any courses to load yet
//         setIsLoading(false);
//       }
//     };
    
//     fetchCourses();
//   }, [currentUser]);
  
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <p>Loading dashboard...</p>
//       </div>
//     );
//   }
  
//   const isInstructor = currentUser?.role === "instructor";
  
//   return (
//     <div>
//       <div className="mb-8 flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold">Dashboard</h1>
//           <p className="text-gray-600 mt-1">
//             {isInstructor 
//               ? "Manage your courses and lessons" 
//               : "Explore and learn from available courses"}
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
      
//       {isInstructor ? (
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold mb-4">Your Recent Courses</h2>
          
//           {courses.length > 0 ? (
//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {courses.slice(0, 3).map(course => (
//                 <CourseCard 
//                   key={course.id} 
//                   course={course}
//                   isOwner={true}
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="bg-white rounded-lg shadow p-8 text-center">
//               <h3 className="text-lg font-medium mb-2">You haven't created any courses yet</h3>
//               <p className="text-gray-600 mb-4">Get started by creating your first course</p>
              
//               <Link to="/courses/create">
//                 <Button variant="outline">Create Course</Button>
//               </Link>
//             </div>
//           )}
//         </div>
//       ) : (
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold mb-4">Welcome, Student!</h2>
//           <div className="bg-white rounded-lg shadow p-8">
//             <p className="text-gray-600 mb-6">As a student, you can browse courses and enroll in them to start learning.</p>
            
//             <Link to="/courses">
//               <Button>Browse Courses</Button>
//             </Link>
//           </div>
//         </div>
//       )}
      
//       {isInstructor && courses.length > 0 && (
//         <div className="text-center">
//           <Link to="/courses">
//             <Button variant="outline">View All Courses</Button>
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
