
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-background border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Globe className="h-8 w-8 text-travel-blue-bright" />
              <span className="ml-2 text-xl font-bold text-foreground">Travel Planner</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-foreground hover:text-travel-blue-bright">
              Home
            </Link>
            <Link to="/destinations" className="px-3 py-2 text-sm font-medium text-foreground hover:text-travel-blue-bright">
              Destinations
            </Link>
            <Link to="/plan" className="px-3 py-2 text-sm font-medium text-foreground hover:text-travel-blue-bright">
              Plan Trip
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-foreground hover:text-travel-blue-bright">
                  My Trips
                </Link>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="border-travel-blue-bright text-travel-blue-bright hover:bg-travel-blue hover:bg-opacity-10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="border-travel-blue-bright text-travel-blue-bright hover:bg-travel-blue hover:bg-opacity-10">
                    <User className="mr-2 h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-travel-blue-bright hover:bg-travel-blue-bright/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-foreground hover:text-foreground hover:bg-muted focus:outline-none"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-travel-blue-bright hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/destinations"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-travel-blue-bright hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Destinations
            </Link>
            <Link
              to="/plan"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-travel-blue-bright hover:bg-muted"
              onClick={() => setIsMenuOpen(false)}
            >
              Plan Trip
            </Link>
            
            {user && (
              <Link
                to="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-travel-blue-bright hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                My Trips
              </Link>
            )}
            
            {user ? (
              <div className="pt-4 pb-3 border-t border-border">
                <div className="flex items-center px-3 py-2">
                  <div className="text-base font-medium text-foreground">
                    {user.name}
                  </div>
                </div>
                <div className="flex items-center px-3">
                  <Button 
                    onClick={handleLogout} 
                    className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-border">
                <div className="flex items-center px-3">
                  <Link to="/login" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full mb-2 border-travel-blue-bright text-travel-blue-bright">
                      <User className="mr-2 h-4 w-4" />
                      Sign In
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center px-3">
                  <Link to="/signup" className="w-full" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
