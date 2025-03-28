import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Destination, getDestinations, createReservation } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, MapPin, Calendar as CalendarIcon, Users, Clock, BadgeDollarSign, Plane, CreditCard, TicketCheck } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [showReservation, setShowReservation] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [travelers, setTravelers] = useState('2');
  const [totalPrice, setTotalPrice] = useState(0);
  const [isBooking, setIsBooking] = useState(false);
  
  // Payment form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [formErrors, setFormErrors] = useState({
    cardNumber: false,
    cardName: false,
    expiryDate: false,
    cvv: false
  });

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

  useEffect(() => {
    if (destination) {
      setTotalPrice(destination.price * parseInt(travelers || '1'));
    }
  }, [destination, travelers]);

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleTravelersChange = (value: string) => {
    setTravelers(value);
  };

  const handleBookNow = () => {
    if (!user) {
      toast.error("Please log in to book this trip");
      navigate('/login');
      return;
    }
    
    setShowReservation(true);
    window.scrollTo({ top: document.getElementById('reservation-section')?.offsetTop, behavior: 'smooth' });
  };
  
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 16) {
      // Format with spaces every 4 digits
      const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      setCardNumber(formatted);
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      // Format as MM/YY
      if (value.length > 2) {
        setExpiryDate(`${value.slice(0, 2)}/${value.slice(2)}`);
      } else {
        setExpiryDate(value);
      }
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setCvv(value);
    }
  };

  const validateForm = () => {
    const errors = {
      cardNumber: cardNumber.replace(/\s/g, '').length !== 16,
      cardName: cardName.trim() === '',
      expiryDate: !expiryDate.match(/^\d{2}\/\d{2}$/),
      cvv: cvv.length !== 3 && cvv.length !== 4
    };
    
    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };

  const handleReservation = async () => {
    if (!user) {
      toast.error('Please log in to book a trip');
      navigate('/login');
      return;
    }
    
    if (!destination || !date) {
      toast.error('Please select a travel date');
      return;
    }
    
    if (!validateForm()) {
      toast.error('Please fill in all payment details correctly');
      return;
    }
    
    setIsBooking(true);
    
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      // Generate mock itinerary for the reservation
      const mockItinerary = Array.from({ length: destination.duration }, () => {
        return [
          "Morning: City sightseeing tour",
          "Afternoon: Local cuisine experience",
          "Evening: Cultural entertainment"
        ];
      });
      
      const response = await createReservation(
        user.id,
        destination.id,
        formattedDate,
        parseInt(travelers),
        totalPrice,
        mockItinerary
      );
      
      if (response.success) {
        toast.success('Your trip has been successfully booked!');
        navigate('/dashboard');
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

  // Enhanced images for popular destinations
  const getEnhancedImage = (name: string) => {
    const destinationImages: Record<string, string> = {
      'Paris': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
      'Tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
      'Rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
      'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
      'London': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
      'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
      'Barcelona': 'https://images.unsplash.com/photo-1583422409516-2895a77efded?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200',
      'Sydney': 'https://images.unsplash.com/photo-1530452540502-56ce99f8977b?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=1200'
    };
    
    return destinationImages[name] || destination?.image || '';
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-travel-gradient py-12 flex-grow">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{destination?.name}</h1>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{destination?.location}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <img 
                  src={getEnhancedImage(destination?.name || '')}
                  alt={destination?.name}
                  className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                />
              </div>
              
              <div className="bg-white dark:bg-muted p-6 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-4">${destination?.price}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">per person</p>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-3 text-travel-blue-bright" />
                    <div>
                      <p className="font-medium">{destination?.duration} days</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-3 text-travel-orange" />
                    <div>
                      <p className="font-medium">{destination?.location}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Location</p>
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
            
            <Tabs defaultValue="overview" className="w-full mb-12">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="itinerary">Sample Itinerary</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="bg-white dark:bg-muted p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Destination Overview</h3>
                <p className="mb-4">{destination?.description}</p>
                <p className="mb-4">Experience the beauty and culture of {destination?.name} with our carefully crafted {destination?.duration}-day tour package. This trip offers the perfect balance of guided experiences and free time to explore on your own.</p>
                <p>Our package includes accommodation, local transportation, and guided tours to the most significant attractions in {destination?.name}.</p>
              </TabsContent>
              
              <TabsContent value="itinerary" className="bg-white dark:bg-muted p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Sample Itinerary</h3>
                <div className="space-y-6">
                  {Array.from({ length: destination?.duration }, (_, i) => (
                    <div key={i} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h4 className="font-bold mb-2">Day {i + 1}</h4>
                      <p>Sample activities for day {i + 1} of your trip to {destination?.name}. Your actual itinerary will be customized based on your preferences when you book.</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews" className="bg-white dark:bg-muted p-6 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Traveler Reviews</h3>
                <p className="text-gray-600 dark:text-gray-400">No reviews yet for this destination.</p>
              </TabsContent>
            </Tabs>
            
            {showReservation && (
              <div id="reservation-section" className="mb-12">
                <h2 className="text-2xl font-bold mb-6">Reserve Your Trip</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4">Trip Details</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="date">Travel Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full justify-start text-left font-normal h-10 mt-1"
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
                                onSelect={handleDateChange}
                                initialFocus
                                disabled={(currentDate) => currentDate < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div>
                          <Label htmlFor="travelers">Number of Travelers</Label>
                          <Select value={travelers} onValueChange={handleTravelersChange}>
                            <SelectTrigger id="travelers" className="mt-1">
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
                        
                        <div className="pt-4 border-t mt-4">
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600 dark:text-gray-400">Price per person:</span>
                            <span className="font-medium">${destination?.price}</span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Total Price:</span>
                            <span className="text-travel-blue-bright">${totalPrice}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold mb-4 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-travel-blue-bright" />
                        Payment Details
                      </h3>
                      
                      {!user ? (
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
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={handleCardNumberChange}
                              className={formErrors.cardNumber ? "border-red-500 mt-1" : "mt-1"}
                            />
                            {formErrors.cardNumber && (
                              <p className="text-red-500 text-sm mt-1">Please enter a valid 16-digit card number</p>
                            )}
                          </div>
                          
                          <div>
                            <Label htmlFor="cardName">Name on Card</Label>
                            <Input
                              id="cardName"
                              placeholder="John Doe"
                              value={cardName}
                              onChange={(e) => setCardName(e.target.value)}
                              className={formErrors.cardName ? "border-red-500 mt-1" : "mt-1"}
                            />
                            {formErrors.cardName && (
                              <p className="text-red-500 text-sm mt-1">Please enter the name on your card</p>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input
                                id="expiryDate"
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChange={handleExpiryDateChange}
                                className={formErrors.expiryDate ? "border-red-500 mt-1" : "mt-1"}
                              />
                              {formErrors.expiryDate && (
                                <p className="text-red-500 text-sm mt-1">Use MM/YY format</p>
                              )}
                            </div>
                            
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={cvv}
                                onChange={handleCvvChange}
                                type="password"
                                className={formErrors.cvv ? "border-red-500 mt-1" : "mt-1"}
                              />
                              {formErrors.cvv && (
                                <p className="text-red-500 text-sm mt-1">Invalid CVV</p>
                              )}
                            </div>
                          </div>
                          
                          <Button 
                            onClick={handleReservation} 
                            disabled={isBooking || !date}
                            className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90 mt-4"
                          >
                            {isBooking ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing Payment...
                              </>
                            ) : (
                              <>
                                <TicketCheck className="mr-2 h-4 w-4" />
                                Complete Booking
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default TripDetails;
