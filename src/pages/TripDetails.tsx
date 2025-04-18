
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getDestinations, Destination } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Loader2, MapPin, Calendar, Users, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);

  // Use destinations from the mock data if the API fails
  const fallbackDestinations = [
    {
      id: 1,
      name: 'Paris',
      location: 'France',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
      description: 'Experience the romance of the City of Light with iconic landmarks like the Eiffel Tower and charming cafés.',
      price: 1299,
      duration: 7
    },
    {
      id: 2,
      name: 'Tokyo',
      location: 'Japan',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
      description: 'Discover the perfect blend of tradition and innovation in Japan\'s vibrant capital city.',
      price: 1599,
      duration: 10
    },
    {
      id: 3,
      name: 'Rome',
      location: 'Italy',
      image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=600&q=80', 
      description: 'Explore ancient history and enjoy delicious Italian cuisine in the Eternal City.',
      price: 1199,
      duration: 6
    }
  ];

  const { data: destinationsResponse, isLoading, isError } = useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations
  });

  useEffect(() => {
    if (id) {
      // Try to find the destination in the API response first
      if (destinationsResponse?.data) {
        const found = destinationsResponse.data.find(d => d.id === parseInt(id));
        if (found) {
          setDestination(found);
          console.log("Found destination from API:", found);
          return;
        }
      }
      
      // If not found or API failed, check fallback data
      const fallbackFound = fallbackDestinations.find(d => d.id === parseInt(id));
      if (fallbackFound) {
        setDestination(fallbackFound);
        console.log("Using fallback destination:", fallbackFound);
      } else {
        console.log("Destination not found for id:", id);
        console.log("Available API destinations:", destinationsResponse?.data || []);
        console.log("Available fallback destinations:", fallbackDestinations);
      }
    }
  }, [id, destinationsResponse]);

  const handleBookNow = () => {
    if (destination) {
      navigate(`/plan?destination=${destination.id}`);
    } else {
      toast.error('Destination not found');
    }
  };

  const renderTravelType = (groupType: string | undefined) => {
    if (!groupType) return "Standard trip";
    
    const groupTypes: Record<string, string> = {
      'family': 'Family trip',
      'friends': 'Trip with friends',
      'coworkers': 'Business trip',
      'couple': 'Romantic getaway',
      'solo': 'Solo adventure',
      'school_group': 'School excursion',
      'other': 'Custom trip'
    };
    
    return groupTypes[groupType] || "Standard trip";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Destination Not Found</h2>
            <p className="mb-6">The destination you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/destinations')}>Browse Destinations</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-travel-gradient py-12 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-card rounded-lg overflow-hidden shadow-xl">
            <div className="relative h-80">
              <img
                src={destination.image}
                alt={destination.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-end">
                <div className="p-6 w-full">
                  <h1 className="text-white text-3xl font-bold">{destination.name}</h1>
                  <div className="flex items-center mt-2 text-white/90">
                    <MapPin className="h-5 w-5 mr-1" />
                    <span>{destination.location}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-primary" />
                    <span>{destination.duration} days</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 mr-1 text-primary" />
                    <span className="font-bold text-lg">${destination.price}</span>
                    <span className="text-xs text-muted-foreground ml-1">per person</span>
                  </div>
                </div>
                
                <Button onClick={handleBookNow} className="w-full md:w-auto" size="lg">
                  Book Now
                </Button>
              </div>
              
              <div className="prose max-w-none">
                <h2 className="text-xl font-bold mb-4">About this Destination</h2>
                <p className="text-muted-foreground">{destination.description}</p>
              </div>
              
              {destination.group_type && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <h3 className="font-medium">Recommended Trip Type</h3>
                  <p>{renderTravelType(destination.group_type)}</p>
                  {destination.nb_people && (
                    <p className="mt-2 flex items-center">
                      <Users className="h-4 w-4 mr-1" /> 
                      Ideal for groups of {destination.nb_people} {destination.nb_people === 1 ? 'person' : 'people'}
                    </p>
                  )}
                </div>
              )}
              
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">What's Included</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <li className="flex items-center">
                    <span className="bg-primary/20 text-primary p-1 rounded-full mr-2">✓</span>
                    Accommodation
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/20 text-primary p-1 rounded-full mr-2">✓</span>
                    Daily breakfast
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/20 text-primary p-1 rounded-full mr-2">✓</span>
                    City tours
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/20 text-primary p-1 rounded-full mr-2">✓</span>
                    Local guide
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/20 text-primary p-1 rounded-full mr-2">✓</span>
                    Airport transfers
                  </li>
                  <li className="flex items-center">
                    <span className="bg-primary/20 text-primary p-1 rounded-full mr-2">✓</span>
                    24/7 support
                  </li>
                </ul>
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button onClick={handleBookNow} className="w-full md:w-auto" size="lg">
                  Plan Your Trip Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TripDetails;
