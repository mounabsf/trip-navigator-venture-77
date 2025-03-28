
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, BadgeDollarSign, Eye } from 'lucide-react';

export interface Destination {
  id: number;
  name: string;
  location: string;
  image: string;
  description: string;
  price: number;
  duration: number;
}

interface DestinationCardProps {
  id: number;
  name: string;
  location: string;
  image: string;
  price: number;
  duration: number;
  destination?: Destination; // Optional, for backward compatibility
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  id,
  name,
  location,
  image,
  price,
  duration,
  destination,
}) => {
  // If a destination object is provided, use its properties instead
  const actualId = destination?.id ?? id;
  const actualName = destination?.name ?? name;
  const actualLocation = destination?.location ?? location;
  const actualImage = destination?.image ?? image;
  const actualPrice = destination?.price ?? price;
  const actualDuration = destination?.duration ?? duration;

  return (
    <Card className="overflow-hidden card-hover">
      <div className="relative h-48">
        <img
          src={actualImage}
          alt={actualName}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{actualName}</h3>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {actualLocation}
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-travel-orange" />
            <span>{actualDuration} days</span>
          </div>
          <div className="flex items-center text-sm">
            <BadgeDollarSign className="h-4 w-4 mr-1 text-travel-blue-bright" />
            <span>${actualPrice}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link to={`/trip/${actualId}`} className="flex-1">
          <Button 
            variant="outline" 
            className="w-full border-travel-blue-bright text-travel-blue-bright hover:bg-travel-blue hover:bg-opacity-10"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </Link>
        <Link to={`/plan?destination=${actualId}`} className="flex-1">
          <Button className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90">
            Book Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DestinationCard;
