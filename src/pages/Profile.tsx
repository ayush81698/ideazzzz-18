
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

const Profile = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true); // In a real app, this would come from auth state
  
  // Mock data for bookings and orders
  const [bookings, setBookings] = useState([
    {
      id: 1,
      package: 'Premium 3D Scan',
      location: 'Mumbai - Andheri',
      date: '2023-08-15',
      time: '10:00 AM',
      status: 'confirmed',
      bookingTime: new Date(Date.now() - 30 * 60000).toISOString(), // 30 minutes ago
      canCancel: true
    },
    {
      id: 2,
      package: 'Family Package',
      location: 'Mumbai - Malad',
      date: '2023-09-01',
      time: '02:00 PM',
      status: 'pending',
      bookingTime: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
      canCancel: false
    }
  ]);
  
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
  
  // Check if a booking is within the cancellation window (1 hour)
  useEffect(() => {
    const checkCancellationWindows = () => {
      setBookings(prev => prev.map(booking => {
        const bookingTime = new Date(booking.bookingTime);
        const currentTime = new Date();
        const timeDiffHours = (currentTime.getTime() - bookingTime.getTime()) / (1000 * 60 * 60);
        
        return {
          ...booking,
          canCancel: timeDiffHours <= 1 && booking.status !== 'cancelled'
        };
      }));
    };
    
    checkCancellationWindows();
    const interval = setInterval(checkCancellationWindows, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, []);
  
  const handleCancelBooking = (id: number) => {
    // In a real app, this would call the API to cancel the booking
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, status: 'cancelled', canCancel: false } : booking
    ));
    
    toast.success("Booking Cancelled", {
      description: "Your booking has been successfully cancelled",
    });
  };
  
  const handleLogout = () => {
    // In a real app, this would call the auth service to log out
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

  if (!isLoggedIn) {
    navigate('/auth');
    return null;
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
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <h2 className="text-2xl font-bold mb-1">John Doe</h2>
                  <p className="text-muted-foreground mb-6">john.doe@example.com</p>
                  
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
                                    disabled={!booking.canCancel}
                                    onClick={() => handleCancelBooking(booking.id)}
                                  >
                                    {booking.canCancel ? "Cancel Booking" : "Cannot Cancel"}
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
