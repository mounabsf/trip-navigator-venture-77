
import { Globe, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center mb-4">
              <Globe className="h-6 w-6 text-travel-blue-bright" />
              <span className="ml-2 text-xl font-bold">Travel Planner</span>
            </div>
            <p className="text-gray-400 mb-4">
              Your one-stop solution for planning and booking amazing travel experiences around the world.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-travel-blue-bright">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-travel-blue-bright">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-travel-blue-bright">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-travel-blue-bright">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-travel-blue-bright">Home</Link>
              </li>
              <li>
                <Link to="/destinations" className="text-gray-400 hover:text-travel-blue-bright">Destinations</Link>
              </li>
              <li>
                <Link to="/plan" className="text-gray-400 hover:text-travel-blue-bright">Plan Trip</Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-travel-blue-bright">About Us</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-travel-blue-bright">Contact</a>
              </li>
            </ul>
          </div>

          {/* Popular Destinations */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Destinations</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-travel-blue-bright">Paris, France</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-travel-blue-bright">Tokyo, Japan</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-travel-blue-bright">Rome, Italy</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-travel-blue-bright">Bali, Indonesia</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-travel-blue-bright">New York, USA</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-travel-blue-bright mr-2 mt-0.5" />
                <span className="text-gray-400">123 Travel Street, World City</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-travel-blue-bright mr-2" />
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-travel-blue-bright mr-2" />
                <span className="text-gray-400">info@travelplanner.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} Travel Planner. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
