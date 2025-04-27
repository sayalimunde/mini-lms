
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="lms-container py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold text-lms-primary">Learn Hub</span>
        </Link>
        
        <nav className="hidden md:flex items-center space-x-4">
          {currentUser ? (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-lms-primary transition">
                Dashboard
              </Link>
              <Link to="/courses" className="text-gray-600 hover:text-lms-primary transition">
                Courses
              </Link>
              <div className="flex items-center ml-6">
                <span className="mr-4 text-sm text-gray-600">
                  {currentUser.displayName || currentUser.email}
                </span>
                <Button onClick={handleLogout} variant="outline">
                  Logout
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" className="mr-2">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
