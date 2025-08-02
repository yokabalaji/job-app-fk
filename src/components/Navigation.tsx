
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, User, LogOut } from 'lucide-react';

const Navigation = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2 text-purple-600 font-bold text-xl">
            <Briefcase className="h-6 w-6" />
            <span>JobBoard</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') 
                  ? 'text-purple-600' 
                  : 'text-gray-600 hover:text-purple-600'
              }`}
            >
              Jobs
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/add-job"
                className={`text-sm font-medium transition-colors ${
                  isActive('/add-job') 
                    ? 'text-purple-600' 
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                Post Job
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600 hidden sm:block">
                  Welcome, {user?.username}
                </span>
                <Link to="/add-job" className="md:hidden">
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </Link>
                <Button onClick={logout} size="sm" variant="outline">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:ml-2 sm:block">Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    <User className="h-4 w-4" />
                    <span className="hidden sm:ml-2 sm:block">Login</span>
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
