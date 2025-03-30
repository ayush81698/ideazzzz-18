
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import ModelManager from '@/components/ModelManager';

// Add admin credentials to the database on component mount
const addAdminUserIfNotExists = async () => {
  try {
    // Check if admin user exists
    const { data: existingAdmin } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'ayushkava1@gmail.com')
      .maybeSingle();
    
    // If admin doesn't exist, create it
    if (!existingAdmin) {
      await supabase.from('admin_users').insert({
        email: 'ayushkava1@gmail.com',
        password: '88888888',
        created_at: new Date().toISOString()
      });
      console.info('Admin user created successfully');
    }
  } catch (error) {
    console.error('Error checking/creating admin user:', error);
  }
};

const Admin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('models'); // Changed default tab to models
  const navigate = useNavigate();

  useEffect(() => {
    // Add admin user on mount
    addAdminUserIfNotExists();
    
    // Check if user is already logged in
    checkAdminSession();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchAllBookings();
    }
  }, [isLoggedIn]);

  const checkAdminSession = async () => {
    const adminEmail = localStorage.getItem('admin_email');
    
    if (adminEmail) {
      console.info('Admin login attempt with:', adminEmail);
      
      try {
        const { data, error } = await supabase
          .from('admin_users')
          .select('*')
          .eq('email', adminEmail)
          .single();
        
        if (data) {
          setIsLoggedIn(true);
          setEmail(adminEmail);
        } else {
          localStorage.removeItem('admin_email');
        }
      } catch (error) {
        console.error('Error checking admin session:', error);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .eq('password', password)
        .single();
      
      if (error) {
        toast.error('Invalid credentials');
        return;
      }
      
      if (data) {
        localStorage.setItem('admin_email', email);
        setIsLoggedIn(true);
        toast.success('Admin login successful');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_email');
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
    toast.info('Logged out successfully');
  };
  
  const fetchAllBookings = async () => {
    try {
      console.info('Fetching all bookings for admin dashboard');
      
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.info('Admin booking data received:', data);
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to fetch bookings');
    }
  };
  
  const updateBookingStatus = async (id, status) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status, 
          updated_at: new Date().toISOString(),
          can_cancel: status === 'pending'
        })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state without refetching
      setBookings(bookings.map(booking => {
        if (booking.id === id) {
          return {
            ...booking, 
            status,
            can_cancel: status === 'pending',
            updated_at: new Date().toISOString()
          };
        }
        return booking;
      }));
      
      toast.success(`Booking status updated to ${status}`);
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ayushkava1@gmail.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Log In</Button>
            </form>
            <div className="mt-4 text-sm text-center text-muted-foreground">
              <p>Demo credentials:</p>
              <p>Email: ayushkava1@gmail.com</p>
              <p>Password: 88888888</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Log Out</Button>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="models">3D Models</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="shop">Shop</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="models">
          <ModelManager />
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-4">
          <h2 className="text-2xl font-bold">Customer Bookings</h2>
          
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">No bookings found</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{booking.customer_name}</CardTitle>
                      {getStatusBadge(booking.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-muted-foreground">Package:</p>
                        <p className="font-medium">{booking.package}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location:</p>
                        <p className="font-medium">{booking.location}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-muted-foreground">Date:</p>
                        <p className="font-medium">{booking.date}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time:</p>
                        <p className="font-medium">{booking.time}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-muted-foreground">Contact:</p>
                      <p className="font-medium">{booking.email}</p>
                      <p className="font-medium">{booking.phone}</p>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-muted-foreground text-xs">
                        Booked on: {formatDate(booking.created_at)}
                      </p>
                      {booking.created_at !== booking.updated_at && (
                        <p className="text-muted-foreground text-xs">
                          Last updated: {formatDate(booking.updated_at)}
                        </p>
                      )}
                    </div>
                    
                    {booking.status !== 'cancelled' && booking.status !== 'completed' && (
                      <div className="flex gap-2 pt-2">
                        {booking.status === 'pending' && (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                          >
                            Confirm
                          </Button>
                        )}
                        
                        {booking.status !== 'completed' && (
                          <Button 
                            size="sm" 
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            onClick={() => updateBookingStatus(booking.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                        
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                          onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="models">
          <ModelManager />
        </TabsContent>
        
        <TabsContent value="shop">
          <h2 className="text-2xl font-bold mb-4">Shop Management</h2>
          <p className="text-muted-foreground">Coming soon: Product management interface.</p>
        </TabsContent>
        
        <TabsContent value="settings">
          <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>
          <p className="text-muted-foreground">Coming soon: Site configuration, admin user management, etc.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
