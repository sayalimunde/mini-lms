
import React from "react";
import { Link } from "react-router-dom";
import { Lesson } from "../types";
import { Button } from "@/components/ui/button";
import { 
  Edit as EditIcon,
  Trash2 as DeleteIcon,
  Move as MoveIcon,
  Video as VideoIcon
} from "lucide-react";

interface LessonItemProps {
  lesson: Lesson;
  isOwner: boolean;
  onDelete?: (lessonId: string) => void;
  isDraggable?: boolean;
}

const LessonItem: React.FC<LessonItemProps> = ({ 
  lesson, 
  isOwner, 
  onDelete,
  isDraggable = false
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) {
      onDelete(lesson.id);
    }
  };

  return (
    <div className="lesson-item">
      <div className="flex items-center">
        {isDraggable && (
          <div className="cursor-move mr-3 text-gray-400">
            <MoveIcon className="w-5 h-5" />
          </div>
        )}
        
        <div className="mr-4 bg-lms-light text-lms-primary p-2 rounded-full">
          <VideoIcon className="w-5 h-5" />
        </div>
        
        <div>
          <h4 className="font-medium text-gray-800">{lesson.title}</h4>
        </div>
      </div>
      
      {isOwner ? (
        <div className="flex space-x-2">
          <Link to={`/courses/${lesson.courseId}/lessons/${lesson.id}/edit`}>
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
        <Button variant="outline" size="sm">
          Play
        </Button>
      )}
    </div>
  );
};

export default LessonItem;
