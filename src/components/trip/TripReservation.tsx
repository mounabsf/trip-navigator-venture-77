
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, TicketCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Destination } from '@/services/api';
import { User } from '@/services/api';

interface TripReservationProps {
  user: User | null;
  selectedDestination: Destination | null;
  date: Date | undefined;
  travelers: string;
  totalPrice: number;
  isBooking: boolean;
  onReservation: () => void;
}

const TripReservation: React.FC<TripReservationProps> = ({
  user,
  selectedDestination,
  date,
  travelers,
  totalPrice,
  isBooking,
  onReservation
}) => {
  const navigate = useNavigate();

  return (
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
          onClick={onReservation}
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
  );
};

export default TripReservation;
