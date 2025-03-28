
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export interface Destination {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
  duration: number;
  location: string;
}

interface DestinationCardProps {
  destination: Destination;
}

const DestinationCard = ({ destination }: DestinationCardProps) => {
  return (
    <Card className="overflow-hidden card-hover h-full">
      <div className="relative h-48 w-full">
        <img
          src={destination.image}
          alt={destination.name}
          className="object-cover w-full h-full"
        />
        <div className="absolute top-2 right-2 bg-white rounded-full px-3 py-1 text-sm font-semibold text-gray-800 flex items-center">
          <DollarSign className="h-4 w-4 mr-1 text-travel-blue-bright" />
          {destination.price}
        </div>
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold">{destination.name}</CardTitle>
        </div>
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="h-4 w-4 mr-1" />
          {destination.location}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <CardDescription className="text-sm line-clamp-2 mb-4">
          {destination.description}
        </CardDescription>
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center text-gray-600">
            <Clock className="h-4 w-4 mr-1 text-travel-orange" />
            <span>{destination.duration} days</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-1 text-travel-orange" />
            <span>Available now</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/plan?destination=${destination.id}`} className="w-full">
          <Button className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90">
            Plan Trip
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default DestinationCard;
