import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { Course, Lesson } from "../types";
import { db } from "./firebase";

// Course functions
export const getCoursesByInstructor = async (instructorId: string): Promise<Course[]> => {
  const q = query(
    collection(db, "courses"), 
    where("createdBy", "==", instructorId),
    orderBy("createdAt", "desc")
  );
  
  const querySnapshot = await getDocs(q);
  const courses: Course[] = [];
  
  querySnapshot.forEach((doc) => {
    courses.push({ id: doc.id, ...doc.data() } as Course);
  });
  
  return courses;
};

// NEW FUNCTION: Fetch all courses (for students)
export const getAllCourses = async (): Promise<Course[]> => {
  const querySnapshot = await getDocs(collection(db, "courses"));
  const courses: Course[] = [];

  querySnapshot.forEach((doc) => {
    courses.push({ id: doc.id, ...doc.data() } as Course);
  });

  return courses;
};

export const getCourse = async (courseId: string): Promise<Course | null> => {
  const docRef = doc(db, "courses", courseId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Course;
  }
  
  return null;
};

export const createCourse = async (courseData: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const timestamp = Date.now();
  const docRef = await addDoc(collection(db, "courses"), {
    ...courseData,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  
  return docRef.id;
};

export const updateCourse = async (courseId: string, courseData: Partial<Omit<Course, "id" | "createdBy" | "createdAt">>): Promise<void> => {
  const docRef = doc(db, "courses", courseId);
  await updateDoc(docRef, {
    ...courseData,
    updatedAt: Date.now(),
  });
};

export const deleteCourse = async (courseId: string): Promise<void> => {
  // First get all lessons in this course
  const lessonsQuery = query(collection(db, "lessons"), where("courseId", "==", courseId));
  const lessonsSnapshot = await getDocs(lessonsQuery);
  
  // Delete all lessons
  const deleteLessonsPromises = lessonsSnapshot.docs.map(lessonDoc => 
    deleteDoc(doc(db, "lessons", lessonDoc.id))
  );
  
  await Promise.all(deleteLessonsPromises);
  
  // Then delete the course
  await deleteDoc(doc(db, "courses", courseId));
};

// Lesson functions
export const getLessonsByCourse = async (courseId: string): Promise<Lesson[]> => {
  try {
    const q = query(
      collection(db, "lessons"), 
      where("courseId", "==", courseId),
      orderBy("order", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    const lessons: Lesson[] = [];
    
    querySnapshot.forEach((doc) => {
      lessons.push({ id: doc.id, ...doc.data() } as Lesson);
    });
    
    return lessons;
  } catch (error: any) {
    console.error("Error fetching lessons:", error);
    
    // If it's an indexing error, we'll pass it up to be handled by the UI
    if (error.code === "failed-precondition" && error.message.includes("index")) {
      throw error;
    }
    
    // For other errors, we'll return an empty array
    return [];
  }
};

export const getLesson = async (lessonId: string): Promise<Lesson | null> => {
  const docRef = doc(db, "lessons", lessonId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Lesson;
  }
  
  return null;
};

export const createLesson = async (lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt">): Promise<string> => {
  const timestamp = Date.now();
  const docRef = await addDoc(collection(db, "lessons"), {
    ...lessonData,
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  
  return docRef.id;
};

export const updateLesson = async (lessonId: string, lessonData: Partial<Omit<Lesson, "id" | "courseId" | "createdAt">>): Promise<void> => {
  const docRef = doc(db, "lessons", lessonId);
  await updateDoc(docRef, {
    ...lessonData,
    updatedAt: Date.now(),
  });
};

export const deleteLesson = async (lessonId: string): Promise<void> => {
  await deleteDoc(doc(db, "lessons", lessonId));
};

export const reorderLessons = async (lessons: { id: string; order: number }[]): Promise<void> => {
  const updatePromises = lessons.map(lesson => 
    updateDoc(doc(db, "lessons", lesson.id), { order: lesson.order, updatedAt: Date.now() })
  );
  
  await Promise.all(updatePromises);
};


// import { 
//   collection, 
//   doc, 
//   getDocs, 
//   getDoc, 
//   addDoc, 
//   updateDoc, 
//   deleteDoc, 
//   query, 
//   where,
//   orderBy 
// } from "firebase/firestore";
// import { db } from "./firebase";
// import { Course, Lesson } from "../types";

// // Course functions
// export const getCoursesByInstructor = async (instructorId: string): Promise<Course[]> => {
//   const q = query(
//     collection(db, "courses"), 
//     where("createdBy", "==", instructorId),
//     orderBy("createdAt", "desc")
//   );
  
//   const querySnapshot = await getDocs(q);
//   const courses: Course[] = [];
  
//   querySnapshot.forEach((doc) => {
//     courses.push({ id: doc.id, ...doc.data() } as Course);
//   });
  
//   return courses;
// };

// export const getCourse = async (courseId: string): Promise<Course | null> => {
//   const docRef = doc(db, "courses", courseId);
//   const docSnap = await getDoc(docRef);
  
//   if (docSnap.exists()) {
//     return { id: docSnap.id, ...docSnap.data() } as Course;
//   }
  
//   return null;
// };

// export const createCourse = async (courseData: Omit<Course, "id" | "createdAt" | "updatedAt">): Promise<string> => {
//   const timestamp = Date.now();
//   const docRef = await addDoc(collection(db, "courses"), {
//     ...courseData,
//     createdAt: timestamp,
//     updatedAt: timestamp,
//   });
  
//   return docRef.id;
// };

// export const updateCourse = async (courseId: string, courseData: Partial<Omit<Course, "id" | "createdBy" | "createdAt">>): Promise<void> => {
//   const docRef = doc(db, "courses", courseId);
//   await updateDoc(docRef, {
//     ...courseData,
//     updatedAt: Date.now(),
//   });
// };

// export const deleteCourse = async (courseId: string): Promise<void> => {
//   // First get all lessons in this course
//   const lessonsQuery = query(collection(db, "lessons"), where("courseId", "==", courseId));
//   const lessonsSnapshot = await getDocs(lessonsQuery);
  
//   // Delete all lessons
//   const deleteLessonsPromises = lessonsSnapshot.docs.map(lessonDoc => 
//     deleteDoc(doc(db, "lessons", lessonDoc.id))
//   );
  
//   await Promise.all(deleteLessonsPromises);
  
//   // Then delete the course
//   await deleteDoc(doc(db, "courses", courseId));
// };

// // Lesson functions
// export const getLessonsByCourse = async (courseId: string): Promise<Lesson[]> => {
//   try {
//     const q = query(
//       collection(db, "lessons"), 
//       where("courseId", "==", courseId),
//       orderBy("order", "asc")
//     );
    
//     const querySnapshot = await getDocs(q);
//     const lessons: Lesson[] = [];
    
//     querySnapshot.forEach((doc) => {
//       lessons.push({ id: doc.id, ...doc.data() } as Lesson);
//     });
    
//     return lessons;
//   } catch (error: any) {
//     console.error("Error fetching lessons:", error);
    
//     // If it's an indexing error, we'll pass it up to be handled by the UI
//     if (error.code === "failed-precondition" && error.message.includes("index")) {
//       throw error;
//     }
    
//     // For other errors, we'll return an empty array
//     return [];
//   }
// };

// export const getLesson = async (lessonId: string): Promise<Lesson | null> => {
//   const docRef = doc(db, "lessons", lessonId);
//   const docSnap = await getDoc(docRef);
  
//   if (docSnap.exists()) {
//     return { id: docSnap.id, ...docSnap.data() } as Lesson;
//   }
  
//   return null;
// };

// export const createLesson = async (lessonData: Omit<Lesson, "id" | "createdAt" | "updatedAt">): Promise<string> => {
//   const timestamp = Date.now();
//   const docRef = await addDoc(collection(db, "lessons"), {
//     ...lessonData,
//     createdAt: timestamp,
//     updatedAt: timestamp,
//   });
  
//   return docRef.id;
// };

// export const updateLesson = async (lessonId: string, lessonData: Partial<Omit<Lesson, "id" | "courseId" | "createdAt">>): Promise<void> => {
//   const docRef = doc(db, "lessons", lessonId);
//   await updateDoc(docRef, {
//     ...lessonData,
//     updatedAt: Date.now(),
//   });
// };

// export const deleteLesson = async (lessonId: string): Promise<void> => {
//   await deleteDoc(doc(db, "lessons", lessonId));
// };

// export const reorderLessons = async (lessons: { id: string; order: number }[]): Promise<void> => {
//   const updatePromises = lessons.map(lesson => 
//     updateDoc(doc(db, "lessons", lesson.id), { order: lesson.order, updatedAt: Date.now() })
//   );
  
//   await Promise.all(updatePromises);
// };
