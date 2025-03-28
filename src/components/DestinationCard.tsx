
import React from 'react';
import { Link } from 'react-router-dom';

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
  id?: number;
  name?: string;
  location?: string;
  image?: string;
  price?: number;
  duration?: number;
  destination?: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({ 
  id, 
  name, 
  location, 
  image, 
  price, 
  duration,
  destination 
}) => {
  // Use individual props if provided, otherwise use destination object
  const destId = id || destination?.id;
  const destName = name || destination?.name;
  const destLocation = location || destination?.location;
  const destImage = image || destination?.image;
  const destPrice = price || destination?.price;
  const destDuration = duration || destination?.duration;

  return (
    <div className="rounded-lg overflow-hidden shadow-lg bg-card card-hover">
      <div className="relative">
        <img
          src={destImage}
          alt={destName}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 right-0 bg-secondary text-secondary-foreground px-3 py-1 m-2 rounded-md text-sm font-semibold">
          {destDuration} days
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold mb-1">{destName}</h3>
        <p className="text-muted-foreground text-sm mb-4">{destLocation}</p>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-primary font-bold text-lg">${destPrice}</p>
            <p className="text-xs text-muted-foreground">per person</p>
          </div>
          
          <Link 
            to={`/trip/${destId}`} 
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-md text-sm transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DestinationCard;
