
import { Button } from '@/components/ui/button';
import { Airplane, Map, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-world-map bg-cover bg-center">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative px-4 py-32 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl animate-fade-in">
          <span className="block">Discover Your Next</span>
          <span className="block text-travel-orange font-bold">Adventure</span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-white animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Plan your perfect trip with our easy-to-use travel planning tool. Choose from hundreds of destinations worldwide.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <Link to="/destinations">
            <Button className="w-full sm:w-auto text-base font-medium px-8 py-6 bg-travel-blue-bright hover:bg-travel-blue-bright/90 text-white">
              <Map className="mr-2 h-5 w-5" />
              Explore Destinations
            </Button>
          </Link>
          <Link to="/plan">
            <Button className="w-full sm:w-auto text-base font-medium px-8 py-6 bg-travel-orange hover:bg-travel-orange/90 text-white">
              <Calendar className="mr-2 h-5 w-5" />
              Plan Your Trip
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
