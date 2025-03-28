
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { CalendarClock, Package, User, LogOut } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<any[]>([]);
  
  // Mock data for orders
  const [orders, setOrders] = useState([
    {
      id: 1,
      product: 'Greek Statue Replica',
      price: 4999,
      orderDate: '2023-07-05',
      status: 'completed',
      statusProgress: 100,
      stages: [
        { name: 'Order Received', complete: true, date: '2023-07-05' },
        { name: 'Processing', complete: true, date: '2023-07-06' },
        { name: 'Crafting', complete: true, date: '2023-07-10' },
        { name: 'Quality Check', complete: true, date: '2023-07-12' },
        { name: 'Shipped', complete: true, date: '2023-07-13' },
        { name: 'Delivered', complete: true, date: '2023-07-15' }
      ]
    },
    {
      id: 2,
      product: 'Portrait Bust',
      price: 6999,
      orderDate: '2023-07-20',
      status: 'in-progress',
      statusProgress: 50,
      stages: [
        { name: 'Order Received', complete: true, date: '2023-07-20' },
        { name: 'Processing', complete: true, date: '2023-07-21' },
        { name: 'Crafting', complete: true, date: '2023-07-25' },
        { name: 'Quality Check', complete: false, date: null },
        { name: 'Shipped', complete: false, date: null },
        { name: 'Delivered', complete: false, date: null }
      ]
    }
  ]);
  
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const currentUser = session?.user;
        setUser(currentUser ?? null);
        setIsLoggedIn(!!currentUser);
        
        if (currentUser) {
          fetchUserBookings(currentUser.id);
        } else {
          // If no user is logged in, redirect to auth page
          navigate('/auth');
        }
        
        setLoading(false);
      }
    );
    
    // Get initial session
    const getInitialSession = async () => {
      setLoading(true);
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user;
      
      setUser(currentUser ?? null);
      setIsLoggedIn(!!currentUser);
      
      if (currentUser) {
        await fetchUserBookings(currentUser.id);
      } else {
        // If no user is logged in, redirect to auth page
        navigate('/auth');
      }
      
      setLoading(false);
    };
    
    getInitialSession();
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);
  
  // Fetch user's bookings from Supabase
  const fetchUserBookings = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load your bookings');
    }
  };
  
  const handleCancelBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled', can_cancel: false })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === id ? { ...booking, status: 'cancelled', can_cancel: false } : booking
      ));
      
      toast.success("Booking Cancelled", {
        description: "Your booking has been successfully cancelled",
      });
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    }
  };
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    navigate('/auth');
    toast.info("Logged Out", {
      description: "You have been logged out successfully",
    });
  };
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ideazzz-purple"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null; // Will redirect to /auth via the useEffect
  }

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={fadeInUp}
            className="lg:col-span-1"
          >
            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src="/placeholder.svg" alt="User Avatar" />
                    <AvatarFallback>{user?.email?.substring(0, 2).toUpperCase() || 'U'}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-1">{user?.user_metadata?.name || "User"}</h2>
                  <p className="text-muted-foreground mb-6">{user?.email}</p>
                  
                  <div className="w-full space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                      <User className="mr-2 h-4 w-4" /> Profile Settings
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Package className="mr-2 h-4 w-4" /> Orders & Tracking
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <CalendarClock className="mr-2 h-4 w-4" /> My Bookings
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-500" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Main Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeInUp}
            className="lg:col-span-3"
          >
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>My Account</CardTitle>
                <CardDescription>
                  Manage your bookings, orders, and personal information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="bookings" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                    <TabsTrigger value="orders">Order Tracking</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="bookings">
                    {bookings.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">You have no bookings yet</p>
                        <Button className="mt-4" onClick={() => navigate('/booking')}>
                          Book a Session
                        </Button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Package</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead>Date & Time</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {bookings.map((booking) => (
                              <TableRow key={booking.id}>
                                <TableCell className="font-medium">{booking.package}</TableCell>
                                <TableCell>{booking.location}</TableCell>
                                <TableCell>
                                  {booking.date} at {booking.time}
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    className={`
                                      ${booking.status === 'confirmed' ? 'bg-blue-500' : ''}
                                      ${booking.status === 'pending' ? 'bg-yellow-500' : ''}
                                      ${booking.status === 'completed' ? 'bg-green-500' : ''}
                                      ${booking.status === 'cancelled' ? 'bg-red-500' : ''}
                                    `}
                                  >
                                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    variant="destructive" 
                                    size="sm"
                                    disabled={!booking.can_cancel || booking.status === 'cancelled'}
                                    onClick={() => handleCancelBooking(booking.id)}
                                  >
                                    {booking.can_cancel && booking.status !== 'cancelled' ? "Cancel Booking" : "Cannot Cancel"}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="orders">
                    {orders.length === 0 ? (
                      <div className="text-center py-10">
                        <p className="text-muted-foreground">You have no orders yet</p>
                        <Button className="mt-4" onClick={() => navigate('/shop')}>
                          Shop Now
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <Card key={order.id} className="overflow-hidden border border-gray-100">
                            <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="text-lg">{order.product}</CardTitle>
                                  <CardDescription>
                                    Order #{order.id} - Placed on {order.orderDate}
                                  </CardDescription>
                                </div>
                                <Badge
                                  className={`
                                    ${order.status === 'in-progress' ? 'bg-blue-500' : ''}
                                    ${order.status === 'completed' ? 'bg-green-500' : ''}
                                  `}
                                >
                                  {order.status === 'in-progress' ? 'In Progress' : 'Completed'}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent className="p-4">
                              <div className="mb-4">
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm text-muted-foreground">Order Progress</span>
                                  <span className="text-sm font-medium">{order.statusProgress}%</span>
                                </div>
                                <Progress value={order.statusProgress} className="h-2" />
                              </div>
                              
                              <div className="relative">
                                <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                                <ul className="space-y-4 relative z-10">
                                  {order.stages.map((stage, index) => (
                                    <li key={index} className="pl-8 relative">
                                      <div className={`absolute left-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                        stage.complete 
                                          ? 'bg-green-100 border-green-500 text-green-500' 
                                          : 'bg-gray-100 border-gray-300 text-gray-400'
                                      }`}>
                                        {stage.complete ? '✓' : ''}
                                      </div>
                                      <div className="flex justify-between">
                                        <span className={stage.complete ? 'font-medium' : 'text-muted-foreground'}>
                                          {stage.name}
                                        </span>
                                        {stage.date && (
                                          <span className="text-sm text-muted-foreground">
                                            {stage.date}
                                          </span>
                                        )}
                                      </div>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
