
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getDestinations, createReservation } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { CalendarIcon, Users, TicketCheck, Clock, Map, MapPin, Plane, Hotel, Coffee, Camera, BadgeDollarSign, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Destination {
  id: number;
  name: string;
  location: string;
  image: string;
  description: string;
  price: number;
  duration: number;
}

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
  const navigate = useNavigate();
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

  // Fetch destinations data
  const { data: destinationsResponse, isLoading, isError } = useQuery({
    queryKey: ['destinations'],
    queryFn: getDestinations
  });

  // Set a destination if one was passed in the URL
  useEffect(() => {
    if (destinationId && destinationsResponse?.data) {
      const found = destinationsResponse.data.find(d => d.id === parseInt(destinationId));
      if (found) {
        setSelectedDestination(found);
      }
    }
  }, [destinationId, destinationsResponse]);

  // Calculate total price when destination or travelers change
  useEffect(() => {
    if (selectedDestination) {
      setTotalPrice(selectedDestination.price * parseInt(travelers || '1'));
    }
  }, [selectedDestination, travelers]);

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
      navigate('/login');
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

  const activityIcons = {
    morning: <Coffee className="h-4 w-4 mr-2 text-travel-orange" />,
    afternoon: <Camera className="h-4 w-4 mr-2 text-travel-blue-bright" />,
    evening: <Hotel className="h-4 w-4 mr-2 text-travel-teal" />
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
          ) : isError ? (
            <div className="text-center py-12">
              <p className="text-destructive">Error loading destinations. Please try again later.</p>
              <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                Retry
              </Button>
            </div>
          ) : !reservationComplete ? (
            <div className="max-w-4xl mx-auto">
              <Tabs value={currentTab} onValueChange={setCurrentTab}>
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger value="details">Trip Details</TabsTrigger>
                  <TabsTrigger value="itinerary" disabled={!selectedDestination}>Itinerary</TabsTrigger>
                  <TabsTrigger value="reservation" disabled={!showReservation}>Reservation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <Card>
                    <CardHeader>
                      <CardTitle>Select Trip Details</CardTitle>
                      <CardDescription>Choose your destination, travel dates, and number of travelers.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <Label htmlFor="destination">Destination</Label>
                        <Select 
                          value={selectedDestination?.id.toString() || ''} 
                          onValueChange={(value) => {
                            const dest = destinationsResponse?.data?.find(d => d.id === parseInt(value));
                            setSelectedDestination(dest || null);
                            setItinerary([]);
                          }}
                        >
                          <SelectTrigger id="destination">
                            <SelectValue placeholder="Select a destination" />
                          </SelectTrigger>
                          <SelectContent>
                            {destinationsResponse?.data?.map(destination => (
                              <SelectItem key={destination.id} value={destination.id.toString()}>
                                {destination.name}, {destination.location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedDestination && (
                        <div className="bg-white dark:bg-muted p-4 rounded-lg shadow-sm">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/3">
                              <img 
                                src={selectedDestination.image} 
                                alt={selectedDestination.name}
                                className="w-full h-40 object-cover rounded-lg"
                              />
                            </div>
                            <div className="w-full md:w-2/3">
                              <h3 className="text-xl font-semibold mb-2">{selectedDestination.name}</h3>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {selectedDestination.location}
                              </div>
                              <p className="text-gray-600 dark:text-gray-300 mb-4">{selectedDestination.description}</p>
                              <div className="flex flex-wrap gap-4">
                                <div className="flex items-center text-sm">
                                  <Clock className="h-4 w-4 mr-1 text-travel-orange" />
                                  <span>{selectedDestination.duration} days</span>
                                </div>
                                <div className="flex items-center text-sm">
                                  <BadgeDollarSign className="h-4 w-4 mr-1 text-travel-blue-bright" />
                                  <span>${selectedDestination.price} per person</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <Label htmlFor="date">Travel Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal h-10"
                              id="date"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? format(date, 'PPP') : <span>Select a date</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                              disabled={(date) => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      
                      <div>
                        <Label htmlFor="travelers">Number of Travelers</Label>
                        <Select value={travelers} onValueChange={setTravelers}>
                          <SelectTrigger id="travelers">
                            <SelectValue placeholder="Select number of travelers" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'traveler' : 'travelers'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={generateItinerary} 
                        disabled={!selectedDestination || !date}
                        className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90"
                      >
                        <Map className="mr-2 h-4 w-4" />
                        Generate Itinerary
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="itinerary">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Personalized Itinerary</CardTitle>
                      <CardDescription>
                        {selectedDestination?.name}, {selectedDestination?.location} - {selectedDestination?.duration} days
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {itinerary.length > 0 ? (
                        <div className="space-y-6">
                          {itinerary.map((dayActivities, dayIndex) => (
                            <div key={dayIndex} className="bg-white dark:bg-muted p-4 rounded-lg border">
                              <h3 className="text-lg font-semibold mb-3">Day {dayIndex + 1}</h3>
                              <ul className="space-y-3">
                                <li className="flex items-start">
                                  <div className="flex-shrink-0 mt-1">{activityIcons.morning}</div>
                                  <div>
                                    <span className="font-medium">Morning:</span> {dayActivities[0]}
                                  </div>
                                </li>
                                <li className="flex items-start">
                                  <div className="flex-shrink-0 mt-1">{activityIcons.afternoon}</div>
                                  <div>
                                    <span className="font-medium">Afternoon:</span> {dayActivities[1]}
                                  </div>
                                </li>
                                <li className="flex items-start">
                                  <div className="flex-shrink-0 mt-1">{activityIcons.evening}</div>
                                  <div>
                                    <span className="font-medium">Evening:</span> {dayActivities[2]}
                                  </div>
                                </li>
                              </ul>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <p className="text-gray-500 dark:text-gray-400 mb-4">No itinerary has been generated yet.</p>
                          <Button onClick={generateItinerary}>Generate Itinerary</Button>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleContinue} 
                        disabled={itinerary.length === 0}
                        className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90"
                      >
                        <Plane className="mr-2 h-4 w-4" />
                        Continue to Reservation
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
                
                <TabsContent value="reservation">
                  <Card>
                    <CardHeader>
                      <CardTitle>Confirm Your Reservation</CardTitle>
                      <CardDescription>
                        Review the details of your trip before confirming.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-white dark:bg-muted p-4 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Trip Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Destination:</span>
                            <span className="font-medium">{selectedDestination?.name}, {selectedDestination?.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Travel Date:</span>
                            <span className="font-medium">{date ? format(date, 'PPP') : '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                            <span className="font-medium">{selectedDestination?.duration} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Travelers:</span>
                            <span className="font-medium">{travelers}</span>
                          </div>
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Price per person:</span>
                              <span className="font-medium">${selectedDestination?.price}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg mt-2">
                              <span>Total Price:</span>
                              <span className="text-travel-blue-bright">${totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {!user && (
                        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-900 text-amber-800 dark:text-amber-300 p-4 rounded-lg">
                          <h3 className="font-medium mb-2">Login Required</h3>
                          <p className="text-sm mb-3">You need to be logged in to complete your reservation.</p>
                          <Button 
                            onClick={() => navigate('/login')} 
                            variant="outline" 
                            className="text-sm border-amber-300 dark:border-amber-700 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-800"
                          >
                            Log in to continue
                          </Button>
                        </div>
                      )}
                      
                      {user && (
                        <div className="bg-white dark:bg-muted p-4 rounded-lg border">
                          <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Name:</span>
                              <span className="font-medium">{user.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Email:</span>
                              <span className="font-medium">{user.email}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleReservation}
                        disabled={isBooking || !user}
                        className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90"
                      >
                        {isBooking ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <TicketCheck className="mr-2 h-4 w-4" />
                            Confirm Reservation
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto bg-green-100 dark:bg-green-900 p-3 rounded-full mb-4">
                    <TicketCheck className="h-8 w-8 text-green-600 dark:text-green-300" />
                  </div>
                  <CardTitle className="text-2xl">Reservation Confirmed!</CardTitle>
                  <CardDescription>
                    Your trip to {selectedDestination?.name} has been successfully booked.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white dark:bg-muted p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Trip Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Destination:</span>
                        <span className="font-medium">{selectedDestination?.name}, {selectedDestination?.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Travel Date:</span>
                        <span className="font-medium">{date ? format(date, 'PPP') : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="font-medium">{selectedDestination?.duration} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Travelers:</span>
                        <span className="font-medium">{travelers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Booking Reference:</span>
                        <span className="font-medium">{bookingReference}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <p>An email confirmation has been sent with all the details.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Button onClick={handlePrint} variant="outline">
                        Print Ticket
                      </Button>
                      <Button onClick={() => navigate('/dashboard')} className="bg-travel-blue-bright hover:bg-travel-blue-bright/90">
                        View Dashboard
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PlanTrip;
