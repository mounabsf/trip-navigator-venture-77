
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DestinationCard, { Destination } from '@/components/DestinationCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Search, Filter, X } from 'lucide-react';

// Extended destination data
const allDestinations: Destination[] = [
  {
    id: 1,
    name: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80',
    description: 'Experience the romance of the City of Light with iconic landmarks like the Eiffel Tower and charming cafés.',
    price: 1299,
    duration: 7,
    location: 'France'
  },
  {
    id: 2,
    name: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80',
    description: 'Discover the perfect blend of tradition and innovation in Japan\'s vibrant capital city.',
    price: 1599,
    duration: 10,
    location: 'Japan'
  },
  {
    id: 3,
    name: 'Rome',
    image: 'https://images.unsplash.com/photo-1525874684015-58379d421a52?auto=format&fit=crop&w=600&q=80',
    description: 'Explore ancient history and enjoy delicious Italian cuisine in the Eternal City.',
    price: 1199,
    duration: 6,
    location: 'Italy'
  },
  {
    id: 4,
    name: 'Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=600&q=80',
    description: 'Relax on pristine beaches and immerse yourself in the rich cultural heritage of this Indonesian paradise.',
    price: 1099,
    duration: 8,
    location: 'Indonesia'
  },
  {
    id: 5,
    name: 'New York',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80',
    description: 'Experience the energy of the city that never sleeps with world-class shopping, dining, and entertainment.',
    price: 1499,
    duration: 5,
    location: 'USA'
  },
  {
    id: 6,
    name: 'Santorini',
    image: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    description: 'Enjoy breathtaking sunsets and stunning views on this iconic Greek island with white-washed buildings.',
    price: 1399,
    duration: 6,
    location: 'Greece'
  },
  {
    id: 7,
    name: 'Sydney',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=600&q=80',
    description: 'Explore the beautiful harbor city with the iconic Opera House and vibrant cultural scene.',
    price: 1799,
    duration: 12,
    location: 'Australia'
  },
  {
    id: 8,
    name: 'London',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=600&q=80',
    description: 'Discover the rich history and modern attractions of England\'s vibrant capital city.',
    price: 1349,
    duration: 7,
    location: 'UK'
  },
  {
    id: 9,
    name: 'Bangkok',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c8dd0c5?auto=format&fit=crop&w=600&q=80',
    description: 'Experience the vibrant street life, ornate temples, and amazing cuisine of Thailand\'s capital.',
    price: 999,
    duration: 9,
    location: 'Thailand'
  },
  {
    id: 10,
    name: 'Barcelona',
    image: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=600&q=80',
    description: 'Enjoy the unique architecture, beautiful beaches, and vibrant culture of this Spanish city.',
    price: 1199,
    duration: 6,
    location: 'Spain'
  },
  {
    id: 11,
    name: 'Dubai',
    image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=600&q=80',
    description: 'Experience the luxury and innovation of this futuristic desert city with stunning architecture.',
    price: 1699,
    duration: 7,
    location: 'UAE'
  },
  {
    id: 12,
    name: 'Cairo',
    image: 'https://images.unsplash.com/photo-1553913861-c0fddf2619ee?auto=format&fit=crop&w=600&q=80',
    description: 'Explore ancient pyramids and experience the rich history of Egypt\'s bustling capital city.',
    price: 1099,
    duration: 8,
    location: 'Egypt'
  }
];

const Destinations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [durationFilter, setDurationFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredDestinations = allDestinations.filter(destination => {
    // Search filter
    const matchesSearch = destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price filter
    const matchesPrice = destination.price >= priceRange[0] && destination.price <= priceRange[1];
    
    // Duration filter
    let matchesDuration = true;
    if (durationFilter) {
      if (durationFilter === '1-5') {
        matchesDuration = destination.duration >= 1 && destination.duration <= 5;
      } else if (durationFilter === '6-10') {
        matchesDuration = destination.duration >= 6 && destination.duration <= 10;
      } else if (durationFilter === '10+') {
        matchesDuration = destination.duration > 10;
      }
    }
    
    // Location filter
    const matchesLocation = locationFilter ? destination.location === locationFilter : true;
    
    return matchesSearch && matchesPrice && matchesDuration && matchesLocation;
  });

  const locations = Array.from(new Set(allDestinations.map(dest => dest.location))).sort();

  const resetFilters = () => {
    setSearchTerm('');
    setPriceRange([0, 2000]);
    setDurationFilter('');
    setLocationFilter('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="bg-travel-gradient py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Explore Our Destinations</h1>
          
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <div className="relative w-full md:max-w-md">
              <Input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            </div>
            
            <Button 
              variant="outline" 
              className="w-full md:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
          
          {showFilters && (
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Filters</h3>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                  <X className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Price Range (${priceRange[0]} - ${priceRange[1]})</label>
                  <Slider
                    defaultValue={priceRange}
                    min={0}
                    max={2000}
                    step={50}
                    onValueChange={setPriceRange}
                    className="my-4"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <Select value={durationFilter} onValueChange={setDurationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any duration</SelectItem>
                      <SelectItem value="1-5">1-5 days</SelectItem>
                      <SelectItem value="6-10">6-10 days</SelectItem>
                      <SelectItem value="10+">More than 10 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any location</SelectItem>
                      {locations.map(location => (
                        <SelectItem key={location} value={location}>{location}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
          
          {filteredDestinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDestinations.map(destination => (
                <DestinationCard 
                  key={destination.id}
                  id={destination.id}
                  name={destination.name}
                  location={destination.location}
                  image={destination.image}
                  price={destination.price}
                  duration={destination.duration}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-2">No destinations found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or search term.</p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Destinations;
