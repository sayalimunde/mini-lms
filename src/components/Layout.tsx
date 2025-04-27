
import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const isInstructor = currentUser?.role === "instructor";

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        {currentUser && isInstructor && <Sidebar />}
        
        <main className={`flex-1 p-6 ${currentUser && isInstructor ? 'ml-64' : ''}`}>
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
