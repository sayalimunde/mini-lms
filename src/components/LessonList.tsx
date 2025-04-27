
import React, { useState } from "react";
import { Lesson } from "../types";
import LessonItem from "./LessonItem";
import { Button } from "@/components/ui/button";
import { 
  Plus as PlusIcon,
  Save as SaveIcon
} from "lucide-react";
import { Link } from "react-router-dom";
import { reorderLessons } from "../lib/courseService";

interface LessonListProps {
  lessons: Lesson[];
  courseId: string;
  isOwner: boolean;
  onDelete?: (lessonId: string) => void;
}

const LessonList: React.FC<LessonListProps> = ({ 
  lessons, 
  courseId,
  isOwner,
  onDelete
}) => {
  const [isReordering, setIsReordering] = useState(false);
  const [orderedLessons, setOrderedLessons] = useState<Lesson[]>(lessons);
  
  const handleReorderStart = () => {
    setIsReordering(true);
  };
  
  const handleReorderSave = async () => {
    try {
      // Update lesson orders
      const lessonUpdates = orderedLessons.map((lesson, index) => ({
        id: lesson.id,
        order: index + 1,
      }));
      
      await reorderLessons(lessonUpdates);
      setIsReordering(false);
    } catch (error) {
      console.error("Failed to reorder lessons:", error);
    }
  };
  
  const handleReorderCancel = () => {
    // Reset to original order
    setOrderedLessons([...lessons]);
    setIsReordering(false);
  };
  
  // Simple drag and drop handling
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    
    if (dragIndex === dropIndex) return;
    
    const newOrderedLessons = [...orderedLessons];
    const draggedLesson = newOrderedLessons[dragIndex];
    
    // Remove dragged item
    newOrderedLessons.splice(dragIndex, 1);
    // Insert at new position
    newOrderedLessons.splice(dropIndex, 0, draggedLesson);
    
    setOrderedLessons(newOrderedLessons);
  };
  
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="border-b border-gray-200 p-4 flex justify-between items-center">
        <h3 className="text-lg font-medium">Lessons</h3>
        
        {isOwner && (
          <div className="flex space-x-2">
            {isReordering ? (
              <>
                <Button 
                  onClick={handleReorderSave} 
                  className="flex items-center"
                >
                  <SaveIcon className="w-4 h-4 mr-1" />
                  Save Order
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleReorderCancel}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={handleReorderStart}
                >
                  Reorder
                </Button>
                <Link to={`/courses/${courseId}/lessons/create`}>
                  <Button className="flex items-center">
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add Lesson
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
      
      <div>
        {orderedLessons.length > 0 ? (
          orderedLessons.map((lesson, index) => (
            <div 
              key={lesson.id}
              draggable={isReordering}
              onDragStart={(e) => isReordering && handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => isReordering && handleDrop(e, index)}
            >
              <LessonItem 
                lesson={lesson} 
                isOwner={isOwner && !isReordering} 
                onDelete={onDelete} 
                isDraggable={isReordering}
              />
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No lessons available for this course yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonList;
