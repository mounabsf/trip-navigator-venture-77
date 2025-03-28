
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Destination, getDestinations } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, MapPin, Calendar, Users, Clock, BadgeDollarSign, Plane } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);

  const { data: destinationsResponse, isLoading, isError } = useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations
  });

  useEffect(() => {
    if (id && destinationsResponse?.data) {
      const found = destinationsResponse.data.find(d => d.id === parseInt(id));
      if (found) {
        setDestination(found);
      }
    }
  }, [id, destinationsResponse]);

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please log in to book this trip");
      navigate('/login');
      return;
    }
    navigate(`/plan?destination=${id}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-travel-blue-bright" />
        </div>
        <Footer />
      </div>
    );
  }

  if (isError || !destination) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Destination Not Found</h2>
            <p className="mb-4">We couldn't find the destination you're looking for.</p>
            <Button onClick={() => navigate('/destinations')}>
              Browse All Destinations
            </Button>
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
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{destination.name}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{destination.location}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <img 
                  src={destination.image} 
                  alt={destination.name}
                  className="w-full h-[400px] object-cover rounded-lg"
                />
              </div>
              
              <div className="bg-white dark:bg-muted p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">${destination.price}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">per person</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-travel-blue-bright" />
                    <div>
                      <p className="font-medium">{destination.duration} days</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={handleBookNow} 
                  className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90"
                >
                  <Plane className="mr-2 h-4 w-4" />
                  Book This Trip
                </Button>
              </div>
            </div>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Sample Itinerary</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="bg-white dark:bg-muted p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Destination Overview</h3>
                <p className="mb-4">{destination.description}</p>
                <p className="mb-4">Experience the beauty and culture of {destination.name} with our carefully crafted {destination.duration}-day tour package. This trip offers the perfect balance of guided experiences and free time to explore on your own.</p>
                <p>Our package includes accommodation, local transportation, and guided tours to the most significant attractions in {destination.name}.</p>
              </TabsContent>
              
              <TabsContent value="itinerary" className="bg-white dark:bg-muted p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Sample Itinerary</h3>
                <div className="space-y-6">
                  {Array.from({ length: destination.duration }, (_, i) => (
                    <div key={i} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h4 className="font-bold mb-2">Day {i + 1}</h4>
                      <p>Sample activities for day {i + 1} of your trip to {destination.name}. Your actual itinerary will be customized based on your preferences when you book.</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="bg-white dark:bg-muted p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Traveler Reviews</h3>
                <p className="text-gray-600 dark:text-gray-400">No reviews yet for this destination.</p>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TripDetails;
