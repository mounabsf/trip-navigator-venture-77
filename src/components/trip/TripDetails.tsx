
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, BadgeDollarSign, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Destination } from '@/services/api';

interface TripDetailsProps {
  destinations: Destination[] | undefined;
  selectedDestination: Destination | null;
  date: Date | undefined;
  travelers: string;
  onDestinationChange: (value: string) => void;
  onDateChange: (date: Date | undefined) => void;
  onTravelersChange: (value: string) => void;
  onGenerateItinerary: () => void;
}

const TripDetails: React.FC<TripDetailsProps> = ({
  destinations,
  selectedDestination,
  date,
  travelers,
  onDestinationChange,
  onDateChange,
  onTravelersChange,
  onGenerateItinerary
}) => {
  return (
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
            onValueChange={onDestinationChange}
          >
            <SelectTrigger id="destination">
              <SelectValue placeholder="Select a destination" />
            </SelectTrigger>
            <SelectContent>
              {destinations?.map(destination => (
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
                onSelect={onDateChange}
                initialFocus
                disabled={(currentDate) => currentDate < new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div>
          <Label htmlFor="travelers">Number of Travelers</Label>
          <Select value={travelers} onValueChange={onTravelersChange}>
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
          onClick={onGenerateItinerary} 
          disabled={!selectedDestination || !date}
          className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90"
        >
          Generate Itinerary
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TripDetails;
