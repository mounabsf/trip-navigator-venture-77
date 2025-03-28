
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X, User, Search } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Globe className="h-8 w-8 text-travel-blue-bright" />
              <span className="ml-2 text-xl font-bold text-gray-900">Travel Planner</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-travel-blue-bright">
              Home
            </Link>
            <Link to="/destinations" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-travel-blue-bright">
              Destinations
            </Link>
            <Link to="/plan" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-travel-blue-bright">
              Plan Trip
            </Link>
            <Button variant="outline" className="border-travel-blue-bright text-travel-blue-bright hover:bg-travel-blue hover:bg-opacity-10">
              <User className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            <Button className="bg-travel-blue-bright hover:bg-travel-blue-bright/90">
              Sign Up
            </Button>
          </div>
          
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
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
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-travel-blue-bright hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/destinations"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-travel-blue-bright hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Destinations
            </Link>
            <Link
              to="/plan"
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-travel-blue-bright hover:bg-gray-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Plan Trip
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-3">
                <Button variant="outline" className="w-full mb-2 border-travel-blue-bright text-travel-blue-bright">
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </div>
              <div className="flex items-center px-3">
                <Button className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90">
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
