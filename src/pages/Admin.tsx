
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from '@/components/ui/tabs';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Eye, Pencil, Trash2, Plus, CalendarDays, Package, ShoppingBag, Users, Upload, Check, X
} from 'lucide-react';
import { products } from './Shop';
import { supabase } from '@/integrations/supabase/client';

const productSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  price: z.number().min(1, {
    message: "Price must be greater than 0.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
  modelUrl: z.string().url({
    message: "Please enter a valid URL for the 3D model.",
  }),
  imageUrl: z.string().url({
    message: "Please enter a valid URL for the image.",
  }),
  stock: z.number().min(0, {
    message: "Stock cannot be negative.",
  }),
  tags: z.string(),
  rating: z.number().min(0).max(5)
});

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

type ProductFormValues = z.infer<typeof productSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productsList, setProductsList] = useState([...products]);
  const [editingProduct, setEditingProduct] = useState<null | number>(null);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [editingBooking, setEditingBooking] = useState<null | string>(null);
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [models, setModels] = useState([]);
  const [content, setContent] = useState([]);
  
  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      category: '',
      modelUrl: '',
      imageUrl: '',
      stock: 0,
      tags: '',
      rating: 4.5
    },
  });
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
  });
  
  const fetchBookings = async () => {
    try {
      console.log("Fetching all bookings for admin dashboard");
      const { data, error } = await supabase
        .from('bookings')
        .select('*');
      
      if (error) {
        throw error;
      }
      console.log("Admin booking data received:", data);
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      toast.error("Failed to load bookings.");
    }
  };
  
  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*');
      
      if (error) {
        throw error;
      }
      console.log("Models data received:", data);
      setModels(data || []);
    } catch (error) {
      console.error("Error fetching models:", error);
      toast.error("Failed to load models.");
    }
  };
  
  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*');
      
      if (error) {
        throw error;
      }
      setContent(data || []);
    } catch (error) {
      console.error("Error fetching content:", error);
      toast.error("Failed to load content.");
    }
  };
  
  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      console.log("Admin login attempt with:", data.email);
      
      // For demonstration, we'll hardcode the check until proper authentication is set up
      if (data.email === 'ayushk1@gmail.com' && data.password === '88888888') {
        setIsLoggedIn(true);
        fetchBookings();
        fetchModels();
        fetchContent();
        toast.success("Login Successful", {
          description: "Welcome to the admin dashboard",
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login Failed", {
        description: "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    loginForm.reset();
    toast.info("Logged Out", {
      description: "You have been logged out successfully",
    });
  };
  
  const openEditProductDialog = (productId: number) => {
    const product = productsList.find(p => p.id === productId);
    if (product) {
      productForm.reset({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        modelUrl: product.modelUrl,
        imageUrl: product.imageUrl,
        stock: product.stock,
        tags: product.tags.join(', '),
        rating: product.rating
      });
      setEditingProduct(productId);
      setOpenProductDialog(true);
    }
  };
  
  const handleAddEditProduct = (data: ProductFormValues) => {
    console.log("Form data:", data);
    
    const formattedProduct = {
      id: editingProduct || productsList.length + 1,
      name: data.name,
      description: data.description,
      price: data.price,
      category: data.category,
      modelUrl: data.modelUrl,
      imageUrl: data.imageUrl,
      stock: data.stock,
      tags: data.tags.split(',').map(tag => tag.trim()),
      rating: data.rating
    };
    
    if (editingProduct) {
      // Update existing product
      setProductsList(productsList.map(p => 
        p.id === editingProduct ? formattedProduct : p
      ));
      toast.success("Product Updated", {
        description: `${data.name} has been updated successfully`,
      });
    } else {
      // Add new product
      setProductsList([...productsList, formattedProduct]);
      toast.success("Product Added", {
        description: `${data.name} has been added successfully`,
      });
    }
    
    setOpenProductDialog(false);
    setEditingProduct(null);
    productForm.reset();
  };
  
  const deleteProduct = (productId: number) => {
    setProductsList(productsList.filter(p => p.id !== productId));
    toast.success("Product Deleted", {
      description: "The product has been deleted successfully",
    });
  };
  
  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      console.log(`Updating booking ${id} to status ${newStatus}`);
      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: newStatus,
          can_cancel: newStatus !== 'completed' && newStatus !== 'cancelled',
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setBookings(prev => prev.map(booking => 
        booking.id === id ? { 
          ...booking, 
          status: newStatus,
          can_cancel: newStatus !== 'completed' && newStatus !== 'cancelled',
          updated_at: new Date().toISOString()
        } : booking
      ));
      
      toast.success("Booking Updated", {
        description: `Booking status changed to ${newStatus}`,
      });
      
      setOpenBookingDialog(false);
      setEditingBooking(null);
      
    } catch (error) {
      console.error('Error updating booking:', error);
      toast.error('Failed to update booking status');
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Admin dashboard stats
  const stats = [
    { title: 'Total Products', value: productsList.length, icon: Package, color: 'bg-blue-500' },
    { title: 'Bookings', value: bookings.length, icon: CalendarDays, color: 'bg-ideazzz-purple' },
    { title: 'Completed Orders', value: bookings.filter(b => b.status === 'completed').length, icon: ShoppingBag, color: 'bg-green-500' },
    { title: 'Registered Users', value: 48, icon: Users, color: 'bg-ideazzz-pink' },
  ];

  if (!isLoggedIn) {
    return (
      <div className="py-20">
        <div className="container mx-auto px-4 max-w-md">
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={fadeInUp}
          >
            <Card>
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Admin Login</CardTitle>
                <CardDescription className="text-center">
                  Enter your credentials to access the admin panel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="admin@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full bg-ideazzz-purple" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                    <div className="text-center mt-4">
                      <p className="text-sm text-gray-500">
                        Demo credentials: ayushk1@gmail.com / 88888888
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <motion.h1 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={fadeInUp}
            className="text-3xl font-bold"
          >
            Admin Dashboard
          </motion.h1>
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={fadeInUp}
          >
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </motion.div>
        </div>
        
        {/* Stats Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          variants={fadeInUp}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <h3 className="text-2xl font-bold">{stat.value}</h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.3 }}
          variants={fadeInUp}
        >
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="bookings">Booking Management</TabsTrigger>
              <TabsTrigger value="products">Products Management</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings">
              <Card>
                <CardHeader>
                  <CardTitle>Bookings</CardTitle>
                  <CardDescription>Manage customer appointments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Package</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Date & Time</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bookings.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-4">
                              No bookings found
                            </TableCell>
                          </TableRow>
                        ) : (
                          bookings.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell className="font-mono text-xs">{booking.id.substring(0, 8)}...</TableCell>
                              <TableCell>
                                <div className="font-medium">{booking.customer_name}</div>
                                <div className="text-sm text-muted-foreground">{booking.email}</div>
                              </TableCell>
                              <TableCell>{booking.package}</TableCell>
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
                                <div className="flex space-x-2">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm">
                                        View Details
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Booking Details</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-muted-foreground">Customer</Label>
                                            <p className="font-medium">{booking.customer_name}</p>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">Contact</Label>
                                            <p className="font-medium">{booking.email}</p>
                                            <p className="text-sm">{booking.phone}</p>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-muted-foreground">Package</Label>
                                            <p className="font-medium">{booking.package}</p>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">Location</Label>
                                            <p className="font-medium">{booking.location}</p>
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Label className="text-muted-foreground">Date</Label>
                                            <p className="font-medium">{booking.date}</p>
                                          </div>
                                          <div>
                                            <Label className="text-muted-foreground">Time</Label>
                                            <p className="font-medium">{booking.time}</p>
                                          </div>
                                        </div>
                                        <div>
                                          <Label className="text-muted-foreground">Status</Label>
                                          <div className="flex items-center space-x-2 mt-1">
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
                                            <p className="text-sm text-muted-foreground">
                                              Updated: {new Date(booking.updated_at).toLocaleString()}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                  
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className={booking.status === 'cancelled' ? 'text-gray-400 cursor-not-allowed' : ''}
                                        disabled={booking.status === 'cancelled'}
                                      >
                                        Update Status
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Update Booking Status</DialogTitle>
                                        <DialogDescription>
                                          Change the status of this booking
                                        </DialogDescription>
                                      </DialogHeader>
                                      <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                          <Label>Current Status</Label>
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
                                        </div>
                                        <div className="space-y-2">
                                          <Label>New Status</Label>
                                          <div className="grid grid-cols-2 gap-2">
                                            {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                                              <Button
                                                key={status}
                                                variant={status === booking.status ? "default" : "outline"}
                                                size="sm"
                                                disabled={status === booking.status}
                                                onClick={() => updateBookingStatus(booking.id, status)}
                                                className={`
                                                  ${status === 'confirmed' ? 'border-blue-500 text-blue-500 hover:bg-blue-50' : ''}
                                                  ${status === 'pending' ? 'border-yellow-500 text-yellow-500 hover:bg-yellow-50' : ''}
                                                  ${status === 'completed' ? 'border-green-500 text-green-500 hover:bg-green-50' : ''}
                                                  ${status === 'cancelled' ? 'border-red-500 text-red-500 hover:bg-red-50' : ''}
                                                  ${status === booking.status ? 'cursor-not-allowed opacity-50' : ''}
                                                `}
                                              >
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                              </Button>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button variant="outline" onClick={() => {}} className="w-full">
                                          Close
                                        </Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="products">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Products</CardTitle>
                    <CardDescription>Manage your product inventory</CardDescription>
                  </div>
                  <Dialog open={openProductDialog} onOpenChange={setOpenProductDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={() => {
                          setEditingProduct(null);
                          productForm.reset({
                            name: '',
                            description: '',
                            price: 0,
                            category: '',
                            modelUrl: '',
                            imageUrl: '',
                            stock: 0,
                            tags: '',
                            rating: 4.5
                          });
                        }}
                      >
                        <Plus className="h-4 w-4 mr-2" /> Add Product
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>
                          {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </DialogTitle>
                        <DialogDescription>
                          {editingProduct 
                            ? 'Make changes to the existing product' 
                            : 'Fill in the details for the new product'}
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...productForm}>
                        <form onSubmit={productForm.handleSubmit(handleAddEditProduct)} className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={productForm.control}
                              name="name"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Product Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Product name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={productForm.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Action Figures" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <FormField
                            control={productForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Product description" 
                                    className="min-h-[100px]"
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={productForm.control}
                              name="price"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Price (₹)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="0" 
                                      step="1"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={productForm.control}
                              name="stock"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Stock</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="0" 
                                      step="1"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={productForm.control}
                              name="modelUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>3D Model URL</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://example.com/model.glb" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={productForm.control}
                              name="imageUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Image URL</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://example.com/image.jpg" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={productForm.control}
                              name="tags"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Tags (comma separated)</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Premium, Bestseller" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={productForm.control}
                              name="rating"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Rating (0-5)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="0" 
                                      max="5" 
                                      step="0.1"
                                      {...field}
                                      onChange={(e) => field.onChange(Number(e.target.value))}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <DialogFooter>
                            <Button type="submit" className="bg-ideazzz-purple">
                              {editingProduct ? 'Update Product' : 'Add Product'}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {productsList.length === 0 ? (
                    <div className="text-center py-10">
                      <p className="text-muted-foreground">No products found</p>
                      <Button 
                        className="mt-4"
                        onClick={() => {
                          setEditingProduct(null);
                          productForm.reset();
                          setOpenProductDialog(true);
                        }}
                      >
                        Add your first product
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Stock</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {productsList.map((product) => (
                            <TableRow key={product.id}>
                              <TableCell>{product.id}</TableCell>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{product.category}</TableCell>
                              <TableCell>₹{product.price.toLocaleString()}</TableCell>
                              <TableCell>{product.stock}</TableCell>
                              <TableCell>
                                <Badge className={product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}>
                                  {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    onClick={() => navigate(`/shop/${product.id}`)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => openEditProductDialog(product.id)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="text-red-500"
                                    onClick={() => deleteProduct(product.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
