
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, BadgeDollarSign, Eye } from 'lucide-react';

interface DestinationCardProps {
  id: number;
  name: string;
  location: string;
  image: string;
  price: number;
  duration: number;
  onViewDetails?: () => void;
}

const DestinationCard: React.FC<DestinationCardProps> = ({
  id,
  name,
  location,
  image,
  price,
  duration,
  onViewDetails,
}) => {
  return (
    <Card className="overflow-hidden card-hover">
      <div className="relative h-48">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-1">{name}</h3>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          {location}
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-1 text-travel-orange" />
            <span>{duration} days</span>
          </div>
          <div className="flex items-center text-sm">
            <BadgeDollarSign className="h-4 w-4 mr-1 text-travel-blue-bright" />
            <span>${price}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link to={`/trip/${id}`} className="flex-1">
          <Button 
            variant="outline" 
            className="w-full border-travel-blue-bright text-travel-blue-bright hover:bg-travel-blue hover:bg-opacity-10"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </Link>
        <Link to={`/plan?destination=${id}`} className="flex-1">
          <Button className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90">
            Book Now
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DestinationCard;
