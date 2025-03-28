import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { CalendarIcon, Users, TicketCheck, Clock, Map, MapPin, Plane, Hotel, Coffee, Camera, BadgeDollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  duration: number;
  location: string;
}

const allDestinations: Destination[] = [
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
  },
  {
    id: 5,
    name: 'New York',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    description: 'Experience the energy of the city that never sleeps with world-class shopping, dining, and entertainment.',
    price: 1499,
    duration: 5,
    location: 'USA'
  },
  {
    id: 6,
    name: 'Santorini',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    description: 'Enjoy breathtaking sunsets and stunning views on this iconic Greek island with white-washed buildings.',
    price: 1399,
    duration: 6,
    location: 'Greece'
  },
  {
    id: 7,
    name: 'Sydney',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
    description: 'Explore the beautiful harbor city with the iconic Opera House and vibrant cultural scene.',
    price: 1799,
    duration: 12,
    location: 'Australia'
  },
  {
    id: 8,
    name: 'London',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    description: 'Discover the rich history and modern attractions of England\'s vibrant capital city.',
    price: 1349,
    duration: 7,
    location: 'UK'
  },
  {
    id: 9,
    name: 'Bangkok',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0c5?auto=format&fit=crop&w=600&q=80',
    description: 'Experience the vibrant street life, ornate temples, and amazing cuisine of Thailand\'s capital.',
    price: 999,
    duration: 9,
    location: 'Thailand'
  },
  {
    id: 10,
    name: 'Barcelona',
    image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=600&q=80',
    description: 'Enjoy the unique architecture, beautiful beaches, and vibrant culture of this Spanish city.',
    price: 1199,
    duration: 6,
    location: 'Spain'
  },
  {
    id: 11,
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80',
    description: 'Experience the luxury and innovation of this futuristic desert city with stunning architecture.',
    price: 1699,
    duration: 7,
    location: 'UAE'
  },
  {
    id: 12,
    name: 'Cairo',
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=600&q=80',
    description: 'Explore ancient pyramids and experience the rich history of Egypt\'s bustling capital city.',
    price: 1099,
    duration: 8,
    location: 'Egypt'
  }
];

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
  const searchParams = new URLSearchParams(location.search);
  const destinationId = searchParams.get('destination');

  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [travelers, setTravelers] = useState('2');
  const [itinerary, setItinerary] = useState<string[][]>([]);
  const [showReservation, setShowReservation] = useState(false);
  const [reservationComplete, setReservationComplete] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [currentTab, setCurrentTab] = useState('details');

  useEffect(() => {
    if (destinationId) {
      const found = allDestinations.find(d => d.id === parseInt(destinationId));
      if (found) {
        setSelectedDestination(found);
      }
    }
  }, [destinationId]);

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
    
    const activities = destinationActivities[selectedDestination.name] || genericActivities;
    
    for (let i = 0; i < days; i++) {
      const dayActivities: string[] = [];
      
      const morningType = Math.random() > 0.5 ? 'sightseeing' : 'culture';
      const morningActivities = activities[morningType];
      dayActivities.push(morningActivities[Math.floor(Math.random() * morningActivities.length)]);
      
      const afternoonType = Math.random() > 0.5 ? 'food' : 'outdoor';
      const afternoonActivities = activities[afternoonType];
      dayActivities.push(afternoonActivities[Math.floor(Math.random() * afternoonActivities.length)]);
      
      const eveningType = Math.random() > 0.5 ? 'food' : 'relaxation';
      const eveningActivities = activities[eveningType];
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
  };

  const handleReservation = () => {
    setTimeout(() => {
      setReservationComplete(true);
      toast.success('Your trip has been successfully booked!');
    }, 1000);
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
          
          {!reservationComplete ? (
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
                            const dest = allDestinations.find(d => d.id === parseInt(value));
                            setSelectedDestination(dest || null);
                            setItinerary([]);
                          }}
                        >
                          <SelectTrigger id="destination">
                            <SelectValue placeholder="Select a destination" />
                          </SelectTrigger>
                          <SelectContent>
                            {allDestinations.map(destination => (
                              <SelectItem key={destination.id} value={destination.id.toString()}>
                                {destination.name}, {destination.location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedDestination && (
                        <div className="bg-white p-4 rounded-lg shadow-sm">
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
                              <div className="flex items-center text-sm text-gray-500 mb-2">
                                <MapPin className="h-4 w-4 mr-1" />
                                {selectedDestination.location}
                              </div>
                              <p className="text-gray-600 mb-4">{selectedDestination.description}</p>
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
                            <div key={dayIndex} className="bg-white p-4 rounded-lg border">
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
                          <p className="text-gray-500 mb-4">No itinerary has been generated yet.</p>
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
                      <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Trip Summary</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Destination:</span>
                            <span className="font-medium">{selectedDestination?.name}, {selectedDestination?.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Travel Date:</span>
                            <span className="font-medium">{date ? format(date, 'PPP') : '-'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Duration:</span>
                            <span className="font-medium">{selectedDestination?.duration} days</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Travelers:</span>
                            <span className="font-medium">{travelers}</span>
                          </div>
                          <div className="border-t pt-3 mt-3">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Price per person:</span>
                              <span className="font-medium">${selectedDestination?.price}</span>
                            </div>
                            <div className="flex justify-between font-semibold text-lg mt-2">
                              <span>Total Price:</span>
                              <span className="text-travel-blue-bright">${totalPrice}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="firstName">First Name</Label>
                              <Input id="firstName" placeholder="Enter your first name" />
                            </div>
                            <div>
                              <Label htmlFor="lastName">Last Name</Label>
                              <Input id="lastName" placeholder="Enter your last name" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" placeholder="Enter your email" />
                          </div>
                          <div>
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" placeholder="Enter your phone number" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white p-4 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                        <p className="text-gray-500 text-sm mb-4">
                          For the purposes of this demo, no actual payment processing will occur.
                        </p>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            <div>
                              <Label htmlFor="cvc">CVC</Label>
                              <Input id="cvc" placeholder="123" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        onClick={handleReservation}
                        className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90"
                      >
                        <TicketCheck className="mr-2 h-4 w-4" />
                        Confirm Reservation
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
                  <div className="mx-auto bg-green-100 p-3 rounded-full mb-4">
                    <TicketCheck className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Reservation Confirmed!</CardTitle>
                  <CardDescription>
                    Your trip to {selectedDestination?.name} has been successfully booked.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="bg-white p-4 rounded-lg border">
                    <h3 className="text-lg font-semibold mb-4">Trip Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Destination:</span>
                        <span className="font-medium">{selectedDestination?.name}, {selectedDestination?.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Travel Date:</span>
                        <span className="font-medium">{date ? format(date, 'PPP') : '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Duration:</span>
                        <span className="font-medium">{selectedDestination?.duration} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Travelers:</span>
                        <span className="font-medium">{travelers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Booking Reference:</span>
                        <span className="font-medium">TP-{Math.floor(Math.random() * 1000000)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <p>An email confirmation has been sent with all the details.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Button onClick={handlePrint} variant="outline">
                        Print Ticket
                      </Button>
                      <Button onClick={() => window.location.href = '/'}>
                        Return to Home
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
