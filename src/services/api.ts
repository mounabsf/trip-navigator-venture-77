
// API service for communicating with the backend

// Base URL for API calls
const API_URL = 'http://127.0.0.1/travel_planner/api';

// User interfaces
export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Destination {
  id: number;
  name: string;
  location: string;
  description: string;
  image: string;
  price: number;
  duration: number;
}

export interface Reservation {
  id: number;
  destination: Destination;
  date: string;
  people: number;
  totalPrice: number;
  status: string;
  bookingReference: string;
  itinerary: string[][];
}

// Auth services
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch(`${API_URL}/auth/register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await response.json();
    console.log("Registration response:", data);
    return data;
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

// User profile services
export const updateUserProfile = async (userId: number, name: string, email: string, password?: string) => {
  try {
    const response = await fetch(`${API_URL}/user/update-profile.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, name, email, password }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Profile update error:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

// Trip and destination services
export const getDestinations = async () => {
  try {
    console.log("Fetching destinations from:", `${API_URL}/trips/destinations.php`);
    const response = await fetch(`${API_URL}/trips/destinations.php`);
    const data = await response.json();
    console.log("Destinations response:", data);
    return data;
  } catch (error) {
    console.error('Error fetching destinations:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

export const createReservation = async (
  userId: number,
  destinationId: number,
  travelDate: string,
  travelers: number,
  totalPrice: number,
  itinerary: string[][]
) => {
  try {
    const response = await fetch(`${API_URL}/trips/book.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        destinationId,
        travelDate,
        travelers,
        totalPrice,
        itinerary
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Booking error:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

export const bookTrip = async (
  userId: number,
  destinationId: number,
  travelDate: string,
  travelers: number,
  totalPrice: number,
  itinerary: string[][]
) => {
  return createReservation(userId, destinationId, travelDate, travelers, totalPrice, itinerary);
};

// User reservations services
export const getUserReservations = async (userId: number) => {
  try {
    const response = await fetch(`${API_URL}/user/reservations.php?userId=${userId}`);
    const data = await response.json();
    console.log("Reservations response:", data);
    return data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

export const cancelReservation = async (userId: number, reservationId: number) => {
  try {
    const response = await fetch(`${API_URL}/user/cancel-reservation.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, reservationId }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Cancel reservation error:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

// Helper: Generate random itinerary for a destination
export const generateItinerary = (destination: Destination | null) => {
  if (!destination) return [];
  
  const morningActivities = [
    `Explore the local markets of ${destination.name}`,
    `Take a guided tour of ${destination.name}'s historic sites`,
    `Enjoy a relaxing breakfast at a local café`,
    `Visit the most famous museum in ${destination.name}`,
    `Take a morning hike with stunning views of ${destination.name}`,
    `Join a local cooking class to learn ${destination.location} cuisine`,
  ];
  
  const afternoonActivities = [
    `Visit the main attractions in ${destination.name}`,
    `Enjoy lunch at a traditional restaurant`,
    `Take a boat tour around ${destination.name}`,
    `Relax at a local beach or park`,
    `Go shopping for local crafts and souvenirs`,
    `Take a photography tour of the best spots in ${destination.name}`,
  ];
  
  const eveningActivities = [
    `Experience the nightlife of ${destination.name}`,
    `Enjoy a dinner with local entertainment`,
    `Take a sunset walk along famous landmarks`,
    `Attend a cultural show or concert`,
    `Try the best local restaurants for dinner`,
    `Join a night tour of the illuminated city`,
  ];
  
  const getRandomActivity = (activities: string[]) => {
    return activities[Math.floor(Math.random() * activities.length)];
  };
  
  const itinerary = [];
  
  for (let i = 0; i < destination.duration; i++) {
    itinerary.push([
      getRandomActivity(morningActivities),
      getRandomActivity(afternoonActivities),
      getRandomActivity(eveningActivities)
    ]);
  }
  
  return itinerary;
};
