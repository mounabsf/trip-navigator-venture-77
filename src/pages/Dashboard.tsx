
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getUserReservations, cancelReservation, Reservation } from '@/services/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Map, Camera, Coffee, Hotel, TicketCheck, Calendar as CalendarIcon, BadgeDollarSign, Users, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [viewItinerary, setViewItinerary] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch user reservations
  const { data: reservations, isLoading, isError } = useQuery({
    queryKey: ['reservations', user?.id],
    queryFn: () => getUserReservations(user?.id || 0),
    enabled: !!user,
  });

  const handleCancelReservation = async (reservationId: number) => {
    if (!user) return;
    
    try {
      const response = await cancelReservation(user.id, reservationId);
      
      if (response.success) {
        toast.success('Reservation cancelled successfully');
        queryClient.invalidateQueries({ queryKey: ['reservations', user.id] });
      } else {
        toast.error(response.message || 'Failed to cancel reservation');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleShowItinerary = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setViewItinerary(true);
  };

  const activityIcons = {
    morning: <Coffee className="h-4 w-4 mr-2 text-travel-orange" />,
    afternoon: <Camera className="h-4 w-4 mr-2 text-travel-blue-bright" />,
    evening: <Hotel className="h-4 w-4 mr-2 text-travel-teal" />
  };

  const statusColors = {
    confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1 container mx-auto px-4 py-10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">My Dashboard</h1>
          <p className="text-muted-foreground mb-8">Welcome back, {user.name}!</p>
          
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
              <TabsTrigger value="past">Past Trips</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
            
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-travel-blue-bright"></div>
              </div>
            ) : isError ? (
              <div className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                <p className="text-destructive">Error loading your reservations. Please try again later.</p>
              </div>
            ) : (
              <>
                {/* Upcoming Trips */}
                <TabsContent value="upcoming">
                  {reservations?.data?.filter(r => r.status === 'confirmed' && new Date(r.date) >= new Date()).length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-lg">
                      <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">No upcoming trips</h3>
                      <p className="text-muted-foreground mb-6">You don't have any upcoming reservations.</p>
                      <Button onClick={() => navigate('/destinations')} className="bg-travel-blue-bright hover:bg-travel-blue-bright/90">
                        Explore Destinations
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reservations?.data
                        ?.filter(r => r.status === 'confirmed' && new Date(r.date) >= new Date())
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                        .map(reservation => (
                          <Card key={reservation.id} className="overflow-hidden transition-all hover:shadow-md">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                              <div className="md:col-span-3 h-40 md:h-auto">
                                <img 
                                  src={reservation.destination.image} 
                                  alt={reservation.destination.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="md:col-span-9 p-6">
                                <div className="flex flex-col md:flex-row gap-4 justify-between">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge className={statusColors[reservation.status]}>
                                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                                      </Badge>
                                      <h3 className="font-semibold text-xl">{reservation.destination.name}, {reservation.destination.location}</h3>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                      <div className="flex items-center">
                                        <CalendarIcon className="h-4 w-4 mr-1 text-travel-orange" />
                                        <span>{format(new Date(reservation.date), 'MMM dd, yyyy')}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1 text-travel-blue-bright" />
                                        <span>{reservation.people} {reservation.people === 1 ? 'person' : 'people'}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <BadgeDollarSign className="h-4 w-4 mr-1 text-travel-teal" />
                                        <span>${reservation.totalPrice}</span>
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Booking Reference: {reservation.bookingReference}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-4">
                                  <Button 
                                    size="sm" 
                                    className="bg-travel-blue-bright hover:bg-travel-blue-bright/90"
                                    onClick={() => handleShowItinerary(reservation)}
                                  >
                                    View Itinerary
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => window.print()}
                                  >
                                    Print Ticket
                                  </Button>
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button size="sm" variant="destructive">Cancel Trip</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to cancel your trip to {reservation.destination.name}? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                                        <AlertDialogAction
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                          onClick={() => handleCancelReservation(reservation.id)}
                                        >
                                          Yes, Cancel Trip
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Past Trips */}
                <TabsContent value="past">
                  {reservations?.data?.filter(r => r.status === 'confirmed' && new Date(r.date) < new Date()).length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-lg">
                      <Map className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">No past trips</h3>
                      <p className="text-muted-foreground mb-6">You don't have any past reservations.</p>
                      <Button onClick={() => navigate('/destinations')} className="bg-travel-blue-bright hover:bg-travel-blue-bright/90">
                        Explore Destinations
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reservations?.data
                        ?.filter(r => r.status === 'confirmed' && new Date(r.date) < new Date())
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(reservation => (
                          <Card key={reservation.id} className="opacity-80 overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                              <div className="md:col-span-3 h-40 md:h-auto">
                                <img 
                                  src={reservation.destination.image} 
                                  alt={reservation.destination.name}
                                  className="w-full h-full object-cover brightness-75"
                                />
                              </div>
                              <div className="md:col-span-9 p-6">
                                <div className="flex flex-col md:flex-row gap-4 justify-between">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                        Completed
                                      </Badge>
                                      <h3 className="font-semibold text-xl">{reservation.destination.name}, {reservation.destination.location}</h3>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                      <div className="flex items-center">
                                        <CalendarIcon className="h-4 w-4 mr-1 text-travel-orange" />
                                        <span>{format(new Date(reservation.date), 'MMM dd, yyyy')}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1 text-travel-blue-bright" />
                                        <span>{reservation.people} {reservation.people === 1 ? 'person' : 'people'}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <BadgeDollarSign className="h-4 w-4 mr-1 text-travel-teal" />
                                        <span>${reservation.totalPrice}</span>
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Booking Reference: {reservation.bookingReference}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-4">
                                  <Button 
                                    size="sm" 
                                    className="bg-travel-blue-bright hover:bg-travel-blue-bright/90"
                                    onClick={() => handleShowItinerary(reservation)}
                                  >
                                    View Itinerary
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => navigate(`/plan?destination=${reservation.destination.id}`)}
                                  >
                                    Book Again
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  )}
                </TabsContent>
                
                {/* Cancelled Trips */}
                <TabsContent value="cancelled">
                  {reservations?.data?.filter(r => r.status === 'cancelled').length === 0 ? (
                    <div className="text-center py-12 bg-muted/20 rounded-lg">
                      <TicketCheck className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">No cancelled trips</h3>
                      <p className="text-muted-foreground mb-6">You don't have any cancelled reservations.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reservations?.data
                        ?.filter(r => r.status === 'cancelled')
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map(reservation => (
                          <Card key={reservation.id} className="opacity-70 overflow-hidden">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
                              <div className="md:col-span-3 h-40 md:h-auto">
                                <img 
                                  src={reservation.destination.image} 
                                  alt={reservation.destination.name}
                                  className="w-full h-full object-cover grayscale"
                                />
                              </div>
                              <div className="md:col-span-9 p-6">
                                <div className="flex flex-col md:flex-row gap-4 justify-between">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                                        Cancelled
                                      </Badge>
                                      <h3 className="font-semibold text-xl">{reservation.destination.name}, {reservation.destination.location}</h3>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                      <div className="flex items-center">
                                        <CalendarIcon className="h-4 w-4 mr-1 text-travel-orange" />
                                        <span>{format(new Date(reservation.date), 'MMM dd, yyyy')}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <Users className="h-4 w-4 mr-1 text-travel-blue-bright" />
                                        <span>{reservation.people} {reservation.people === 1 ? 'person' : 'people'}</span>
                                      </div>
                                      <div className="flex items-center">
                                        <BadgeDollarSign className="h-4 w-4 mr-1 text-travel-teal" />
                                        <span>${reservation.totalPrice}</span>
                                      </div>
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                      Booking Reference: {reservation.bookingReference}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-4">
                                  <Button 
                                    size="sm" 
                                    variant="outline" 
                                    onClick={() => navigate(`/plan?destination=${reservation.destination.id}`)}
                                  >
                                    Book Again
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
        </div>
      </div>
      
      {/* Itinerary Modal */}
      {viewItinerary && selectedReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedReservation.destination.name} - Itinerary</h2>
                  <p className="text-muted-foreground">
                    {format(new Date(selectedReservation.date), 'MMMM dd, yyyy')} • {selectedReservation.destination.duration} days
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setViewItinerary(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </Button>
              </div>
              
              <div className="space-y-6">
                {selectedReservation.itinerary.map((dayActivities, dayIndex) => (
                  <div key={dayIndex} className="bg-muted/20 p-4 rounded-lg border">
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
              
              <div className="mt-6 flex justify-end">
                <Button variant="outline" onClick={() => window.print()}>Print Itinerary</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default Dashboard;
