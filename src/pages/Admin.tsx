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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { 
  Eye, Pencil, Trash2, Plus, CalendarDays, Package, ShoppingBag, Users, Upload, Check, X
} from 'lucide-react';
import { products } from './Shop';
import { supabase } from '@/integrations/supabase/client';

// Define types for the application
interface BookingType {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  package: string;
  location: string;
  date: string;
  time: string;
  status: string;
  canCancel?: boolean;
}

interface ModelType {
  id: string;
  name: string;
  description: string;
  model_url: string;
  is_featured: boolean;
  position: string;
}

// Schema definitions
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

const modelSchema = z.object({
  name: z.string().min(2, {
    message: "Model name must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  model_url: z.string().url({
    message: "Please enter a valid URL for the 3D model.",
  }),
  is_featured: z.boolean().default(false),
  position: z.string().default("homepage"),
});

const contentSchema = z.object({
  id: z.string(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  content: z.string().min(10, {
    message: "Content must be at least 10 characters.",
  }),
  section: z.string(),
});

type ProductFormValues = z.infer<typeof productSchema>;
type LoginFormValues = z.infer<typeof loginSchema>;
type ModelFormValues = z.infer<typeof modelSchema>;
type ContentFormValues = z.infer<typeof contentSchema>;

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [productsList, setProductsList] = useState([...products]);
  const [bookingsList, setBookingsList] = useState<BookingType[]>([]);
  const [modelsList, setModelsList] = useState<ModelType[]>([]);
  const [contentList, setContentList] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<null | number>(null);
  const [editingModel, setEditingModel] = useState<null | string>(null);
  const [editingContent, setEditingContent] = useState<null | string>(null);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [openModelDialog, setOpenModelDialog] = useState(false);
  const [openContentDialog, setOpenContentDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
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
  
  const modelForm = useForm<ModelFormValues>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      name: '',
      description: '',
      model_url: '',
      is_featured: false,
      position: 'homepage'
    },
  });
  
  const contentForm = useForm<ContentFormValues>({
    resolver: zodResolver(contentSchema),
    defaultValues: {
      id: '',
      title: '',
      content: '',
      section: 'about'
    },
  });
  
  // Fetch bookings from Supabase
  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        const formattedBookings = data.map(booking => ({
          id: booking.id,
          customerName: booking.customer_name,
          email: booking.email,
          phone: booking.phone,
          package: booking.package,
          location: booking.location,
          date: booking.date,
          time: booking.time,
          status: booking.status,
          canCancel: booking.can_cancel
        }));
        
        setBookingsList(formattedBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
    }
  };
  
  // Fetch models from Supabase
  const fetchModels = async () => {
    try {
      const { data, error } = await supabase
        .from('models')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setModelsList(data);
      }
    } catch (error) {
      console.error('Error fetching models:', error);
      toast.error('Failed to load models');
    }
  };
  
  // Fetch content from Supabase
  const fetchContent = async () => {
    try {
      const { data, error } = await supabase
        .from('content')
        .select('*');
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setContentList(data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
      toast.error('Failed to load content');
    }
  };
  
  // Update booking status
  const updateBookingStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setBookingsList(prevBookings => 
        prevBookings.map(booking => 
          booking.id === id ? { ...booking, status } : booking
        )
      );
      
      toast.success(`Booking status updated to ${status}`);
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast.error('Failed to update booking status');
    }
  };
  
  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', data.email)
        .single();
      
      if (error || !adminData) {
        throw new Error('Invalid credentials');
      }
      
      // In a real app, you'd verify the password with bcrypt
      // For this demo, we'll just check if the email matches
      if (adminData.email === data.email) {
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
  
  const openEditModelDialog = (modelId: string) => {
    const model = modelsList.find(m => m.id === modelId);
    if (model) {
      modelForm.reset({
        name: model.name,
        description: model.description || '',
        model_url: model.model_url,
        is_featured: model.is_featured,
        position: model.position
      });
      setEditingModel(modelId);
      setOpenModelDialog(true);
    }
  };
  
  const openEditContentDialog = (contentId: string) => {
    const content = contentList.find(c => c.id === contentId);
    if (content) {
      contentForm.reset({
        id: content.id,
        title: content.title || '',
        content: content.content || '',
        section: content.section
      });
      setEditingContent(contentId);
      setOpenContentDialog(true);
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
  
  const handleAddEditModel = async (data: ModelFormValues) => {
    setIsLoading(true);
    
    try {
      if (editingModel) {
        // Update existing model
        const { error } = await supabase
          .from('models')
          .update({
            name: data.name,
            description: data.description,
            model_url: data.model_url,
            is_featured: data.is_featured,
            position: data.position,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingModel);
        
        if (error) throw error;
        
        toast.success("Model Updated", {
          description: `${data.name} has been updated successfully`,
        });
      } else {
        // Add new model
        const { error } = await supabase
          .from('models')
          .insert({
            name: data.name,
            description: data.description,
            model_url: data.model_url,
            is_featured: data.is_featured,
            position: data.position
          });
        
        if (error) throw error;
        
        toast.success("Model Added", {
          description: `${data.name} has been added successfully`,
        });
      }
      
      // Refresh models list
      fetchModels();
      
      setOpenModelDialog(false);
      setEditingModel(null);
      modelForm.reset();
    } catch (error) {
      console.error('Error saving model:', error);
      toast.error('Failed to save model');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddEditContent = async (data: ContentFormValues) => {
    setIsLoading(true);
    
    try {
      if (editingContent) {
        // Update existing content
        const { error } = await supabase
          .from('content')
          .update({
            title: data.title,
            content: data.content,
            section: data.section,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingContent);
        
        if (error) throw error;
        
        toast.success("Content Updated", {
          description: `${data.title} has been updated successfully`,
        });
      } else {
        // Add new content
        const { error } = await supabase
          .from('content')
          .insert({
            id: data.id,
            title: data.title,
            content: data.content,
            section: data.section
          });
        
        if (error) throw error;
        
        toast.success("Content Added", {
          description: `${data.title} has been added successfully`,
        });
      }
      
      // Refresh content list
      fetchContent();
      
      setOpenContentDialog(false);
      setEditingContent(null);
      contentForm.reset();
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    } finally {
      setIsLoading(false);
    }
  };
  
  const deleteProduct = (productId: number) => {
    setProductsList(productsList.filter(p => p.id !== productId));
    toast.success("Product Deleted", {
      description: "The product has been deleted successfully",
    });
  };
  
  const deleteModel = async (modelId: string) => {
    try {
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', modelId);
      
      if (error) throw error;
      
      setModelsList(prevModels => prevModels.filter(model => model.id !== modelId));
      
      toast.success("Model Deleted", {
        description: "The model has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error('Failed to delete model');
    }
  };
  
  const deleteContent = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from('content')
        .delete()
        .eq('id', contentId);
      
      if (error) throw error;
      
      setContentList(prevContent => prevContent.filter(content => content.id !== contentId));
      
      toast.success("Content Deleted", {
        description: "The content has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting content:', error);
      toast.error('Failed to delete content');
    }
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Admin dashboard stats
  const stats = [
    { title: 'Total Products', value: productsList.length, icon: Package, color: 'bg-blue-500' },
    { title: 'Bookings', value: bookingsList.length, icon: CalendarDays, color: 'bg-ideazzz-purple' },
    { title: 'Models', value: modelsList.length, icon: Upload, color: 'bg-amber-500' },
    { title: 'Users', value: 48, icon: Users, color: 'bg-ideazzz-pink' },
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="bookings">Booking Management</TabsTrigger>
              <TabsTrigger value="products">Products Management</TabsTrigger>
              <TabsTrigger value="models">3D Models</TabsTrigger>
              <TabsTrigger value="content">Website Content</TabsTrigger>
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
                        {bookingsList.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={7} className="text-center py-6">
                              No bookings found
                            </TableCell>
                          </TableRow>
                        ) : (
                          bookingsList.map((booking) => (
                            <TableRow key={booking.id}>
                              <TableCell>{booking.id.substring(0, 8)}...</TableCell>
                              <TableCell>
                                <div className="font-medium">{booking.customerName}</div>
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
                                    ${booking.status === 'processing' ? 'bg-purple-500' : ''}
                                    ${booking.status === 'dispatched' ? 'bg-indigo-500' : ''}
                                    ${booking.status === 'delivered' ? 'bg-teal-500' : ''}
                                  `}
                                >
                                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-wrap gap-2">
                                  {booking.status === 'pending' && (
                                    <>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="flex items-center text-green-600"
                                        onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                      >
                                        <Check className="mr-1 h-4 w-4" /> Accept
                                      </Button>
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        className="flex items-center text-red-600"
                                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                                      >
                                        <X className="mr-1 h-4 w-4" /> Cancel
                                      </Button>
                                    </>
                                  )}
                                  
                                  {booking.status === 'confirmed' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => updateBookingStatus(booking.id, 'processing')}
                                    >
                                      Mark Processing
                                    </Button>
                                  )}
                                  
                                  {booking.status === 'processing' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => updateBookingStatus(booking.id, 'dispatched')}
                                    >
                                      Mark Dispatched
                                    </Button>
                                  )}
                                  
                                  {booking.status === 'dispatched' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => updateBookingStatus(booking.id, 'delivered')}
                                    >
                                      Mark Delivered
                                    </Button>
                                  )}
                                  
                                  {booking.status === 'delivered' && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => updateBookingStatus(booking.id, 'completed')}
                                    >
                                      Mark Completed
                                    </Button>
                                  )}
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
                                  <FormMessage
