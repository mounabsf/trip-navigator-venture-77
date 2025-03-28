
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { getUserReservations, cancelReservation } from '@/services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, DollarSign, MapPin, TicketCheck, Trash2, Users, Info, Printer, CalendarCheck } from 'lucide-react';
import { toast } from 'sonner';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedReservation, setSelectedReservation] = useState<number | null>(null);
  const [isOpenCancelDialog, setIsOpenCancelDialog] = useState(false);
  const [isOpenItineraryDialog, setIsOpenItineraryDialog] = useState(false);
  const [currentReservation, setCurrentReservation] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const { data: reservationsData, isLoading, isError, refetch } = useQuery({
    queryKey: ['reservations', user?.id],
    queryFn: () => getUserReservations(user?.id || 0),
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleCancelReservation = async () => {
    if (!user || !selectedReservation) return;
    
    try {
      const response = await cancelReservation(user.id, selectedReservation);
      
      if (response.success) {
        toast.success('Reservation cancelled successfully');
        setIsOpenCancelDialog(false);
        refetch();
      } else {
        toast.error(response.message || 'Failed to cancel reservation');
      }
    } catch (error) {
      console.error('Error cancelling reservation:', error);
      toast.error('An error occurred while cancelling your reservation');
    }
  };

  const openItineraryDialog = (reservation: any) => {
    setCurrentReservation(reservation);
    setIsOpenItineraryDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const filteredReservations = reservationsData?.data?.filter((reservation: any) => {
    if (filterStatus === 'all') return true;
    return reservation.status === filterStatus;
  });

  const handlePrint = () => {
    window.print();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 container py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your trips and reservations</p>
          </div>
          <Button onClick={() => navigate('/plan')} className="bg-travel-blue-bright hover:bg-travel-blue-bright/90">
            <Calendar className="mr-2 h-4 w-4" />
            Plan New Trip
          </Button>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming Trips</TabsTrigger>
              <TabsTrigger value="past">Past Trips</TabsTrigger>
            </TabsList>
            
            <div className="flex items-center">
              <label htmlFor="status-filter" className="mr-2 text-sm">Status:</label>
              <select 
                id="status-filter"
                className="text-sm border rounded p-1.5"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          
          <TabsContent value="upcoming">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="animate-spin h-10 w-10 border-b-2 border-travel-blue-bright rounded-full mx-auto mb-4"></div>
                <p>Loading your trips...</p>
              </div>
            ) : isError ? (
              <div className="text-center py-10">
                <Info className="h-10 w-10 text-destructive mx-auto mb-4" />
                <p className="text-destructive">Error loading your reservations</p>
                <Button onClick={() => refetch()} variant="outline" className="mt-4">
                  Try Again
                </Button>
              </div>
            ) : filteredReservations?.length === 0 ? (
              <div className="text-center py-10 bg-muted/20 rounded-lg">
                <Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">You don't have any trips yet</p>
                <Button onClick={() => navigate('/plan')} className="mt-2 bg-travel-blue-bright hover:bg-travel-blue-bright/90">
                  Plan Your First Trip
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReservations?.map((reservation: any) => (
                  <Card key={reservation.id} className="overflow-hidden h-full flex flex-col">
                    <div className="relative h-48 w-full">
                      <img
                        src={reservation.destination.image}
                        alt={reservation.destination.name}
                        className="object-cover w-full h-full"
                      />
                      <div className={`absolute top-2 right-2 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(reservation.status)}`}>
                        {reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle>{reservation.destination.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {reservation.destination.location}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <CalendarCheck className="h-4 w-4 mr-1 text-travel-blue-bright" />
                            {format(new Date(reservation.date), 'MMM d, yyyy')}
                          </span>
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-travel-orange" />
                            {reservation.destination.duration} days
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-travel-blue-bright" />
                            {reservation.people} {reservation.people === 1 ? 'person' : 'people'}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1 text-travel-orange" />
                            ${reservation.totalPrice}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-semibold">Booking Reference:</span> {reservation.bookingReference}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex flex-col gap-2">
                      <Button
                        onClick={() => openItineraryDialog(reservation)}
                        className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90"
                      >
                        <TicketCheck className="mr-2 h-4 w-4" />
                        View Itinerary
                      </Button>
                      {reservation.status === 'confirmed' && (
                        <Button
                          onClick={() => {
                            setSelectedReservation(reservation.id);
                            setIsOpenCancelDialog(true);
                          }}
                          variant="outline"
                          className="w-full text-destructive border-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Cancel Trip
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="past">
            <div className="text-center py-10 bg-muted/20 rounded-lg">
              <Info className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Your past trips will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <Dialog open={isOpenCancelDialog} onOpenChange={setIsOpenCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Reservation</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this reservation? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenCancelDialog(false)}>
              Keep Reservation
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelReservation}
            >
              Cancel Reservation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isOpenItineraryDialog} onOpenChange={setIsOpenItineraryDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Trip Itinerary</DialogTitle>
            <DialogDescription>
              {currentReservation?.destination?.name}, {currentReservation?.destination?.location} - {format(new Date(currentReservation?.date || new Date()), 'MMMM d, yyyy')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h4 className="font-semibold">Booking Details</h4>
                <p className="text-sm text-muted-foreground">Reference: {currentReservation?.bookingReference}</p>
                <p className="text-sm text-muted-foreground">Status: {currentReservation?.status}</p>
              </div>
              <div className="mt-2 md:mt-0">
                <h4 className="font-semibold">Trip Information</h4>
                <p className="text-sm text-muted-foreground">Duration: {currentReservation?.destination?.duration} days</p>
                <p className="text-sm text-muted-foreground">Travelers: {currentReservation?.people}</p>
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <h4 className="font-semibold mb-4">Day-by-Day Itinerary</h4>
            
            {currentReservation?.itinerary.map((dayActivities: string[], dayIndex: number) => (
              <div key={dayIndex} className="mb-6 p-4 bg-muted/20 rounded-lg">
                <h5 className="font-medium mb-2">Day {dayIndex + 1}</h5>
                <ul className="space-y-3">
                  <li className="flex">
                    <div className="bg-travel-orange/20 text-travel-orange p-1 rounded mr-2 flex-shrink-0">AM</div>
                    <div>{dayActivities[0]}</div>
                  </li>
                  <li className="flex">
                    <div className="bg-travel-blue-bright/20 text-travel-blue-bright p-1 rounded mr-2 flex-shrink-0">PM</div>
                    <div>{dayActivities[1]}</div>
                  </li>
                  <li className="flex">
                    <div className="bg-travel-teal/20 text-travel-teal p-1 rounded mr-2 flex-shrink-0">EVE</div>
                    <div>{dayActivities[2]}</div>
                  </li>
                </ul>
              </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print Itinerary
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Dashboard;
