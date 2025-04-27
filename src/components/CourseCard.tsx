
import React from "react";
import { Link } from "react-router-dom";
import { Course } from "../types";
import { Button } from "@/components/ui/button";
import { 
  Edit as EditIcon,
  Trash2 as DeleteIcon
} from "lucide-react";

interface CourseCardProps {
  course: Course;
  isOwner: boolean;
  onDelete?: (courseId: string) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isOwner, onDelete }) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(course.id);
    }
  };

  return (
    <div className="course-card animate-fade-in">
      <div className="h-48 bg-gradient-to-r from-lms-primary to-lms-secondary flex items-center justify-center">
        <span className="text-white text-2xl font-bold">{course.title.charAt(0)}</span>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{course.title}</h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2">
          {course.description || "No description available."}
        </p>
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm bg-lms-light text-lms-primary px-3 py-1 rounded-full">
            {course.category}
          </span>
          
          {isOwner ? (
            <div className="flex space-x-2">
              <Link to={`/courses/${course.id}/edit`}>
                <Button variant="outline" size="sm" className="flex items-center">
                  <EditIcon className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              </Link>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center"
                onClick={handleDelete}
              >
                <DeleteIcon className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          ) : (
            <Link to={`/courses/${course.id}`}>
              <Button>View Course</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
