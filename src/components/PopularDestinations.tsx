
import { useState, useEffect } from 'react';
import DestinationCard, { Destination } from './DestinationCard';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const destinations: Destination[] = [
  {
    id: 1,
    name: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    description: 'Experience the romance of the City of Light with iconic landmarks like the Eiffel Tower and charming cafés.',
    price: 1299,
    duration: 7,
    location: 'France'
  },
  {
    id: 2,
    name: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    description: 'Discover the perfect blend of tradition and innovation in Japan\'s vibrant capital city.',
    price: 1599,
    duration: 10,
    location: 'Japan'
  },
  {
    id: 3,
    name: 'Rome',
    image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=600&q=80',
    description: 'Explore ancient history and enjoy delicious Italian cuisine in the Eternal City.',
    price: 1199,
    duration: 6,
    location: 'Italy'
  },
  {
    id: 4,
    name: 'Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    description: 'Relax on pristine beaches and immerse yourself in the rich cultural heritage of this Indonesian paradise.',
    price: 1099,
    duration: 8,
    location: 'Indonesia'
  }
];

const PopularDestinations = () => {
  const [animatedItems, setAnimatedItems] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.id.split('-')[1]);
            setAnimatedItems(prev => [...prev, id]);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.destination-card').forEach(item => {
      observer.observe(item);
    });

    return () => {
      document.querySelectorAll('.destination-card').forEach(item => {
        observer.unobserve(item);
      });
    };
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular destinations and start planning your dream vacation today.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((destination, index) => (
            <div 
              key={destination.id}
              id={`destination-${destination.id}`}
              className={`destination-card ${animatedItems.includes(destination.id) ? 'animate-fade-in' : 'opacity-0'}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <DestinationCard destination={destination} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/destinations">
            <Button variant="outline" className="text-travel-blue-bright border-travel-blue-bright hover:bg-travel-blue-bright hover:text-white">
              View All Destinations
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PopularDestinations;
