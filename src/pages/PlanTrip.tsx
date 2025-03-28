import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getDestinations, createReservation, Destination } from '@/services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import TripDetails from '@/components/trip/TripDetails';
import TripItinerary from '@/components/trip/TripItinerary';
import TripReservation from '@/components/trip/TripReservation';
import TripConfirmation from '@/components/trip/TripConfirmation';
import { format } from 'date-fns';

type ActivityType = "sightseeing" | "culture" | "food" | "outdoor" | "relaxation";

const destinationActivities: Record<string, Record<ActivityType, string[]>> = {
  "Paris": {
    sightseeing: ["Visit the Eiffel Tower", "Explore the Louvre Museum", "See Notre Dame Cathedral", "Walk along the Champs-Élysées", "Visit Arc de Triomphe"],
    culture: ["Attend an opera at Palais Garnier", "Visit Musée d'Orsay", "Explore Montmartre", "Visit Centre Pompidou"],
    food: ["Enjoy a pastry at a local café", "Wine tasting experience", "Dine at a traditional French bistro", "Visit a local farmers market"],
    outdoor: ["Picnic in Luxembourg Gardens", "Take a boat tour on the Seine River", "Stroll through Tuileries Garden", "Bike tour of the city"],
    relaxation: ["Relax at a Parisian spa", "People-watch at a sidewalk café", "Shop at Galeries Lafayette", "Unwind at Parc des Buttes-Chaumont"]
  },
  "Tokyo": {
    sightseeing: ["Visit Tokyo Skytree", "Explore Senso-ji Temple", "See Imperial Palace", "Visit Tokyo Tower", "Explore Shibuya Crossing"],
    culture: ["Watch a sumo wrestling match", "Visit Edo-Tokyo Museum", "Experience a traditional tea ceremony", "Visit Ghibli Museum"],
    food: ["Eat at a conveyor belt sushi restaurant", "Explore Tsukiji Outer Market", "Try ramen at a local shop", "Visit a Japanese izakaya"],
    outdoor: ["Stroll through Ueno Park", "Visit Meiji Shrine gardens", "Explore Hamarikyu Gardens", "Day trip to Mount Fuji"],
    relaxation: ["Experience an onsen bath", "Shop in Ginza district", "Relax in a manga café", "Visit an animal café"]
  }
};

const genericActivities: Record<ActivityType, string[]> = {
  sightseeing: ["Visit the main tourist attractions", "Explore historic landmarks", "Tour the city center", "Visit local museums", "See famous architecture"],
  culture: ["Attend a local performance", "Visit art galleries", "Explore cultural districts", "Learn about local traditions", "Visit heritage sites"],
  food: ["Try authentic local cuisine", "Visit food markets", "Dine at popular restaurants", "Take a cooking class", "Enjoy street food tour"],
  outdoor: ["Explore local parks", "Take a guided city tour", "Visit nearby natural attractions", "Enjoy outdoor recreational activities", "Take photographs of scenic views"],
  relaxation: ["Relax at a local spa", "Shopping at local boutiques", "Enjoy café culture", "Free time for personal exploration", "Visit local entertainment venues"]
};

const PlanTrip = () => {
  const location = useLocation();
  const { user } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const destinationId = searchParams.get('destination');

  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [travelers, setTravelers] = useState('2');
  const [itinerary, setItinerary] = useState<string[][]>([]);
  const [showReservation, setShowReservation] = useState(false);
  const [reservationComplete, setReservationComplete] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentTab, setCurrentTab] = useState('details');
  const [bookingReference, setBookingReference] = useState('');

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

  const destinations = destinationsResponse?.data || fallbackDestinations;

  useEffect(() => {
    if (destinationId) {
      if (destinationsResponse?.data) {
        const found = destinationsResponse.data.find(d => d.id === parseInt(destinationId));
        if (found) {
          setSelectedDestination(found);
          console.log("Selected destination from API:", found);
          return;
        }
      }
      
      const fallbackFound = fallbackDestinations.find(d => d.id === parseInt(destinationId));
      if (fallbackFound) {
        setSelectedDestination(fallbackFound);
        console.log("Using fallback destination:", fallbackFound);
      } else {
        console.log("Destination not found for id:", destinationId);
        console.log("Available API destinations:", destinationsResponse?.data || []);
        console.log("Available fallback destinations:", fallbackDestinations);
      }
    }
  }, [destinationId, destinationsResponse]);

  useEffect(() => {
    if (selectedDestination) {
      setTotalPrice(selectedDestination.price * parseInt(travelers || '1'));
    }
  }, [selectedDestination, travelers]);

  const handleDestinationChange = (value: string) => {
    const destId = parseInt(value);
    if (destinationsResponse?.data) {
      const found = destinationsResponse.data.find(d => d.id === destId);
      if (found) {
        setSelectedDestination(found);
        setItinerary([]);
        console.log("Destination changed to:", found);
        return;
      }
    }
    
    const fallbackFound = fallbackDestinations.find(d => d.id === destId);
    if (fallbackFound) {
      setSelectedDestination(fallbackFound);
      setItinerary([]);
      console.log("Using fallback destination:", fallbackFound);
    }
  };

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleTravelersChange = (value: string) => {
    setTravelers(value);
  };

  const generateItinerary = () => {
    if (!selectedDestination || !date) {
      toast.error('Please select a destination and date first');
      return;
    }

    const days = selectedDestination.duration;
    const newItinerary: string[][] = [];
    
    const destActivities = destinationActivities[selectedDestination.name] || genericActivities;
    
    for (let i = 0; i < days; i++) {
      const dayActivities: string[] = [];
      
      const morningType = Math.random() > 0.5 ? 'sightseeing' : 'culture';
      const morningActivities = destActivities[morningType];
      dayActivities.push(morningActivities[Math.floor(Math.random() * morningActivities.length)]);
      
      const afternoonType = Math.random() > 0.5 ? 'food' : 'outdoor';
      const afternoonActivities = destActivities[afternoonType];
      dayActivities.push(afternoonActivities[Math.floor(Math.random() * afternoonActivities.length)]);
      
      const eveningType = Math.random() > 0.5 ? 'food' : 'relaxation';
      const eveningActivities = destActivities[eveningType];
      dayActivities.push(eveningActivities[Math.floor(Math.random() * eveningActivities.length)]);
      
      newItinerary.push(dayActivities);
    }
    
    setItinerary(newItinerary);
    setCurrentTab('itinerary');
  };

  const handleContinue = () => {
    if (!selectedDestination || !date || !travelers) {
      toast.error('Please complete all required fields');
      return;
    }
    
    if (itinerary.length === 0) {
      generateItinerary();
    }
    
    setShowReservation(true);
    setCurrentTab('reservation');
  };

  const handleReservation = async () => {
    if (!user) {
      toast.error('Please log in to book a trip');
      return;
    }
    
    if (!selectedDestination || !date) {
      toast.error('Missing trip details');
      return;
    }
    
    setIsBooking(true);
    
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const response = await createReservation(
        user.id,
        selectedDestination.id,
        formattedDate,
        parseInt(travelers),
        totalPrice,
        itinerary
      );
      
      if (response.success) {
        setBookingReference(response.data?.bookingReference || '');
        setReservationComplete(true);
        toast.success('Your trip has been successfully booked!');
      } else {
        toast.error(response.message || 'Failed to book your trip');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('An error occurred while booking your trip');
    } finally {
      setIsBooking(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-travel-gradient py-12 flex-grow">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Plan Your Trip</h1>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-10 w-10 animate-spin text-travel-blue-bright" />
            </div>
          ) : (
            !reservationComplete ? (
              <div className="max-w-4xl mx-auto">
                <Tabs value={currentTab} onValueChange={setCurrentTab}>
                  <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="details">Trip Details</TabsTrigger>
                    <TabsTrigger value="itinerary" disabled={!selectedDestination}>Itinerary</TabsTrigger>
                    <TabsTrigger value="reservation" disabled={!showReservation}>Reservation</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="details">
                    <TripDetails 
                      destinations={destinations}
                      selectedDestination={selectedDestination}
                      date={date}
                      travelers={travelers}
                      onDestinationChange={handleDestinationChange}
                      onDateChange={handleDateChange}
                      onTravelersChange={handleTravelersChange}
                      onGenerateItinerary={generateItinerary}
                    />
                  </TabsContent>
                  
                  <TabsContent value="itinerary">
                    <TripItinerary 
                      selectedDestination={selectedDestination}
                      itinerary={itinerary}
                      onGenerateItinerary={generateItinerary}
                      onContinue={handleContinue}
                    />
                  </TabsContent>
                  
                  <TabsContent value="reservation">
                    <TripReservation 
                      user={user}
                      selectedDestination={selectedDestination}
                      date={date}
                      travelers={travelers}
                      totalPrice={totalPrice}
                      isBooking={isBooking}
                      onReservation={handleReservation}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <TripConfirmation 
                  selectedDestination={selectedDestination}
                  date={date}
                  travelers={travelers}
                  bookingReference={bookingReference}
                  onPrint={handlePrint}
                />
              </div>
            )
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PlanTrip;
