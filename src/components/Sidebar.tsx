
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Book as CourseIcon, 
  Video as LessonIcon, 
  Plus as AddIcon 
} from "lucide-react";

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };
  
  return (
    <aside className="fixed left-0 top-0 pt-16 w-64 h-full bg-white border-r border-gray-200 z-10">
      <div className="p-6">
        <Link to="/courses/create">
          <Button className="w-full flex items-center justify-center">
            <AddIcon className="w-4 h-4 mr-2" />
            New Course
          </Button>
        </Link>
      </div>
      
      <nav className="mt-4">
        <ul>
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center px-6 py-3 transition ${
                isActive("/dashboard")
                  ? "bg-lms-light text-lms-primary border-r-4 border-lms-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <CourseIcon className="w-5 h-5 mr-3" />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/courses"
              className={`flex items-center px-6 py-3 transition ${
                isActive("/courses")
                  ? "bg-lms-light text-lms-primary border-r-4 border-lms-primary"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <CourseIcon className="w-5 h-5 mr-3" />
              My Courses
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
