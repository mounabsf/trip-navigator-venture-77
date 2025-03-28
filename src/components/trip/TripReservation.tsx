
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, TicketCheck, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { Destination } from '@/services/api';
import { User } from '@/services/api';
import { toast } from 'sonner';

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

  const handleSubmit = () => {
    if (!user) {
      toast.error('Please log in to complete your reservation');
      return;
    }
    
    if (validateForm()) {
      // Always accept the card for this demo
      onReservation();
    } else {
      toast.error('Please fill in all payment details correctly');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirm Your Reservation</CardTitle>
        <CardDescription>
          Review the details of your trip and complete payment to confirm.
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
          <>
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
            
            <div className="bg-white dark:bg-muted p-4 rounded-lg border">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-travel-blue-bright" />
                Payment Details
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    className={formErrors.cardNumber ? "border-red-500" : ""}
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
                    className={formErrors.cardName ? "border-red-500" : ""}
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
                      className={formErrors.expiryDate ? "border-red-500" : ""}
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
                      className={formErrors.cvv ? "border-red-500" : ""}
                    />
                    {formErrors.cvv && (
                      <p className="text-red-500 text-sm mt-1">Invalid CVV</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit}
          disabled={isBooking || !user}
          className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90"
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
      </CardFooter>
    </Card>
  );
};

export default TripReservation;
