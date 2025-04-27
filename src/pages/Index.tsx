
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Book as CourseIcon } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-lms-primary to-lms-secondary py-24">
        <div className="lms-container text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Welcome to Learn Hub
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            A simple and effective learning management system for creating
            and managing online courses.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-lms-primary hover:bg-lms-light">
                Get Started
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="py-16 lms-container">
        <h2 className="text-3xl font-bold text-center mb-12">
          Why Choose Learn Hub?
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="mx-auto bg-lms-light text-lms-primary p-4 rounded-full inline-block mb-4">
              <CourseIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Easy Course Creation</h3>
            <p className="text-gray-600">
              Create structured courses with multiple lessons in just minutes.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="mx-auto bg-lms-light text-lms-primary p-4 rounded-full inline-block mb-4">
              <CourseIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Video Integration</h3>
            <p className="text-gray-600">
              Easily integrate video content from YouTube or direct sources.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <div className="mx-auto bg-lms-light text-lms-primary p-4 rounded-full inline-block mb-4">
              <CourseIcon className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Lesson Management</h3>
            <p className="text-gray-600">
              Organize and reorder lessons to create the perfect learning path.
            </p>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white py-10">
        <div className="lms-container text-center">
          <p>© 2025 Learn Hub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
