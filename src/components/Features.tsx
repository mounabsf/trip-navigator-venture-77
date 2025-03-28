
import { MapPin, Calendar, CreditCard, Clock, UserCheck, TicketCheck } from 'lucide-react';

const features = [
  {
    icon: <MapPin className="h-8 w-8 text-travel-blue-bright" />,
    title: 'Explore Destinations',
    description: 'Discover amazing places around the world with detailed information and stunning photos.'
  },
  {
    icon: <Calendar className="h-8 w-8 text-travel-blue-bright" />,
    title: 'Plan Your Trip',
    description: 'Select dates, duration, and number of travelers to create your perfect vacation itinerary.'
  },
  {
    icon: <CreditCard className="h-8 w-8 text-travel-blue-bright" />,
    title: 'Easy Booking',
    description: 'Secure your reservation with our simple booking process and various payment options.'
  },
  {
    icon: <Clock className="h-8 w-8 text-travel-blue-bright" />,
    title: 'Real-time Updates',
    description: 'Get updates about your trip, including itinerary changes and travel recommendations.'
  },
  {
    icon: <UserCheck className="h-8 w-8 text-travel-blue-bright" />,
    title: 'User Profiles',
    description: 'Create your profile to save favorites, track past trips, and get personalized suggestions.'
  },
  {
    icon: <TicketCheck className="h-8 w-8 text-travel-blue-bright" />,
    title: 'Digital Tickets',
    description: 'Access and print your tickets anytime, anywhere for a hassle-free travel experience.'
  }
];

const Features = () => {
  return (
    <section className="py-16 bg-travel-gradient">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Travel Planner</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We make travel planning simple and enjoyable with these great features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
