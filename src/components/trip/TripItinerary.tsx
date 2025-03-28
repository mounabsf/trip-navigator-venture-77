
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Coffee, Camera, Hotel } from 'lucide-react';
import { Destination } from '@/services/api';

interface TripItineraryProps {
  selectedDestination: Destination | null;
  itinerary: string[][];
  onGenerateItinerary: () => void;
  onContinue: () => void;
}

const TripItinerary: React.FC<TripItineraryProps> = ({
  selectedDestination,
  itinerary,
  onGenerateItinerary,
  onContinue
}) => {
  const activityIcons = {
    morning: <Coffee className="h-4 w-4 mr-2 text-travel-orange" />,
    afternoon: <Camera className="h-4 w-4 mr-2 text-travel-blue-bright" />,
    evening: <Hotel className="h-4 w-4 mr-2 text-travel-teal" />
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Personalized Itinerary</CardTitle>
        <CardDescription>
          {selectedDestination?.name}, {selectedDestination?.location} - {selectedDestination?.duration} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        {itinerary.length > 0 ? (
          <div className="space-y-6">
            {itinerary.map((dayActivities, dayIndex) => (
              <div key={dayIndex} className="bg-white dark:bg-muted p-4 rounded-lg border">
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
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No itinerary has been generated yet.</p>
            <Button onClick={onGenerateItinerary}>Generate Itinerary</Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={onContinue} 
          disabled={itinerary.length === 0}
          className="w-full bg-travel-blue-bright hover:bg-travel-blue-bright/90"
        >
          <Plane className="mr-2 h-4 w-4" />
          Continue to Reservation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TripItinerary;
