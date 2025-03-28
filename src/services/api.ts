
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Destination {
  id: number;
  name: string;
  location: string;
  image: string;
  description: string;
  price: number;
  duration: number;
}

export interface Reservation {
  id: number;
  destination: {
    id: number;
    name: string;
    location: string;
    image: string;
    duration: number;
  };
  date: string;
  people: number;
  totalPrice: number;
  status: 'confirmed' | 'cancelled' | 'completed';
  bookingReference: string;
  itinerary: string[][];
}

const API_URL = 'http://localhost/travel_planner/api';

// User Authentication
export const registerUser = async (name: string, email: string, password: string): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_URL}/auth/register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Register error:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

export const loginUser = async (email: string, password: string): Promise<ApiResponse<null>> => {
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

// Destinations
export const getDestinations = async (): Promise<ApiResponse<Destination[]>> => {
  try {
    const response = await fetch(`${API_URL}/trips/destinations.php`);
    return await response.json();
  } catch (error) {
    console.error('Get destinations error:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

// Reservations
export const createReservation = async (
  userId: number,
  destinationId: number,
  travelDate: string,
  travelers: number,
  totalPrice: number,
  itinerary: string[][]
): Promise<ApiResponse<{ reservationId: number; bookingReference: string }>> => {
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
        itinerary,
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Create reservation error:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

export const getUserReservations = async (userId: number): Promise<ApiResponse<Reservation[]>> => {
  try {
    const response = await fetch(`${API_URL}/user/reservations.php?userId=${userId}`);
    return await response.json();
  } catch (error) {
    console.error('Get user reservations error:', error);
    return { success: false, message: 'Network error occurred' };
  }
};

export const cancelReservation = async (userId: number, reservationId: number): Promise<ApiResponse<null>> => {
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

// User Profile
export const updateUserProfile = async (
  userId: number,
  name: string,
  email: string,
  password?: string
): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_URL}/user/update-profile.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        name,
        email,
        ...(password ? { password } : {}),
      }),
    });
    
    return await response.json();
  } catch (error) {
    console.error('Update profile error:', error);
    return { success: false, message: 'Network error occurred' };
  }
};
