
// User types
export interface User {
  id: string;
  email: string;
  displayName?: string;
  role: 'instructor' | 'student';
}

// Course types
export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  createdBy: string; // Instructor ID
  createdAt: number;
  updatedAt: number;
}

// Lesson types
export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  content: string;
  courseId: string;
  order: number;
  createdAt: number;
  updatedAt: number;
}
