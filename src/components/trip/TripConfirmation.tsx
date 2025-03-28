
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TicketCheck } from 'lucide-react';
import { format } from 'date-fns';
import { Destination } from '@/services/api';

interface TripConfirmationProps {
  selectedDestination: Destination | null;
  date: Date | undefined;
  travelers: string;
  bookingReference: string;
  onPrint: () => void;
}

const TripConfirmation: React.FC<TripConfirmationProps> = ({
  selectedDestination,
  date,
  travelers,
  bookingReference,
  onPrint
}) => {
  const navigate = useNavigate();

  return (
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
            <Button onClick={onPrint} variant="outline">
              Print Ticket
            </Button>
            <Button onClick={() => navigate('/dashboard')} className="bg-travel-blue-bright hover:bg-travel-blue-bright/90">
              View Dashboard
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripConfirmation;
