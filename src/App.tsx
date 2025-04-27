
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";

// Pages
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Courses from "./pages/Courses";
import CourseCreate from "./pages/CourseCreate";
import CourseEdit from "./pages/CourseEdit";
import CourseView from "./pages/CourseView";
import LessonCreate from "./pages/LessonCreate";
import LessonEdit from "./pages/LessonEdit";
import NotFound from "./pages/NotFound";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { currentUser, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }
  
  return (
    <Routes>
      <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <Index />} />
      <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={currentUser ? <Navigate to="/dashboard" /> : <Register />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute requireInstructor={false}>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/courses" element={<ProtectedRoute><Layout><Courses /></Layout></ProtectedRoute>} />
      <Route path="/courses/create" element={<ProtectedRoute requireInstructor={true}><Layout><CourseCreate /></Layout></ProtectedRoute>} />
      <Route path="/courses/:courseId/edit" element={<ProtectedRoute requireInstructor={true}><Layout><CourseEdit /></Layout></ProtectedRoute>} />
      <Route path="/courses/:courseId" element={<Layout><CourseView /></Layout>} />
      <Route path="/courses/:courseId/lessons/create" element={<ProtectedRoute requireInstructor={true}><Layout><LessonCreate /></Layout></ProtectedRoute>} />
      <Route path="/courses/:courseId/lessons/:lessonId/edit" element={<ProtectedRoute requireInstructor={true}><Layout><LessonEdit /></Layout></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
