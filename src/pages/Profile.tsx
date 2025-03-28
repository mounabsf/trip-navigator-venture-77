
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  // Mock reservations
  const mockReservations = [
    {
      id: 1,
      destination: 'Paris, France',
      date: '2023-10-15',
      duration: 5,
      people: 2,
      totalPrice: 1250
    },
    {
      id: 2,
      destination: 'Tokyo, Japan',
      date: '2024-03-22',
      duration: 7,
      people: 1,
      totalPrice: 1800
    }
  ];

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would update the user profile in the database
    toast.success('Profile updated successfully');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Redirect to login if not authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <div className="flex-1 container py-10">
        <Tabs defaultValue="profile" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="trips">My Trips</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="shadow-lg dark:border-travel-dark-accent">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your profile information.
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleUpdateProfile}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-muted-foreground">
                      Leave blank to keep current password
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={handleLogout}>
                    Logout
                  </Button>
                  <Button type="submit" className="bg-travel-blue-bright hover:bg-travel-blue-bright/90">
                    Save Changes
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          
          <TabsContent value="trips">
            <Card className="shadow-lg dark:border-travel-dark-accent">
              <CardHeader>
                <CardTitle>My Trips</CardTitle>
                <CardDescription>
                  View your upcoming and past reservations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mockReservations.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">You have no trips yet.</p>
                    <Button 
                      className="mt-4 bg-travel-blue-bright hover:bg-travel-blue-bright/90"
                      onClick={() => navigate('/destinations')}
                    >
                      Explore Destinations
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mockReservations.map(reservation => (
                      <Card key={reservation.id} className="overflow-hidden">
                        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">{reservation.destination}</h3>
                            <div className="text-sm text-muted-foreground">
                              <p>Date: {new Date(reservation.date).toLocaleDateString()}</p>
                              <p>Duration: {reservation.duration} days</p>
                              <p>Travelers: {reservation.people}</p>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <p className="font-semibold">${reservation.totalPrice}</p>
                            <div className="flex gap-2 mt-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => window.print()}
                              >
                                Print Ticket
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-travel-blue-bright hover:bg-travel-blue-bright/90"
                                onClick={() => navigate(`/plan?destination=${encodeURIComponent(reservation.destination)}`)}
                              >
                                View Itinerary
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
