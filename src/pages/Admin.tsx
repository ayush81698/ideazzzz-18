
import React, { useState } from 'react';
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
  Eye, Pencil, Trash2, Plus, CalendarDays, Package, ShoppingBag, Users 
} from 'lucide-react';
import { products } from './Shop';

// Mock bookings data
const bookings = [
  {
    id: 1,
    customerName: 'Rahul Sharma',
    email: 'rahul@example.com',
    phone: '9876543210',
    package: 'Premium Package',
    location: 'Mumbai - Andheri',
    date: '2023-07-15',
    time: '10:00 AM',
    status: 'confirmed'
  },
  {
    id: 2,
    customerName: 'Priya Patel',
    email: 'priya@example.com',
    phone: '9876543211',
    package: 'Standard Package',
    location: 'Mumbai - Malad',
    date: '2023-07-16',
    time: '02:00 PM',
    status: 'confirmed'
  },
  {
    id: 3,
    customerName: 'Aarav Singh',
    email: 'aarav@example.com',
    phone: '9876543212',
    package: 'Family Package',
    location: 'Mumbai - Andheri',
    date: '2023-07-17',
    time: '11:00 AM',
    status: 'pending'
  },
  {
    id: 4,
    customerName: 'Neha Kapoor',
    email: 'neha@example.com',
    phone: '9876543213',
    package: 'Premium Package',
    location: 'Mumbai - Malad',
    date: '2023-07-18',
    time: '04:00 PM',
    status: 'cancelled'
  },
  {
    id: 5,
    customerName: 'Vikram Joshi',
    email: 'vikram@example.com',
    phone: '9876543214',
    package: 'Standard Package',
    location: 'Mumbai - Andheri',
    date: '2023-07-19',
    time: '01:00 PM',
    status: 'completed'
  }
];

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
  
  const handleLogin = (data: LoginFormValues) => {
    if (data.email === 'ayushk1@gmail.com' && data.password === '88888888') {
      setIsLoggedIn(true);
      toast.success("Login Successful", {
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast.error("Login Failed", {
        description: "Invalid email or password",
      });
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
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  // Admin dashboard stats
  const stats = [
    { title: 'Total Products', value: productsList.length, icon: Package, color: 'bg-blue-500' },
    { title: 'Bookings', value: bookings.length, icon: CalendarDays, color: 'bg-ideazzz-purple' },
    { title: 'Completed Orders', value: 12, icon: ShoppingBag, color: 'bg-green-500' },
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
                    <Button type="submit" className="w-full bg-ideazzz-purple">
                      Sign In
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex flex-col">
                <div className="text-sm text-muted-foreground text-center">
                  <p>Demo credentials:</p>
                  <p>Email: ayushk1@gmail.com</p>
                  <p>Password: 88888888</p>
                </div>
              </CardFooter>
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
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="products">Products Management</TabsTrigger>
              <TabsTrigger value="bookings">Booking Management</TabsTrigger>
            </TabsList>
            
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
                        {bookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell>{booking.id}</TableCell>
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
                                `}
                              >
                                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button variant="outline" size="sm">
                                  View Details
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className={booking.status === 'cancelled' ? 'text-gray-400 cursor-not-allowed' : ''}
                                  disabled={booking.status === 'cancelled'}
                                >
                                  {booking.status === 'confirmed' || booking.status === 'pending' 
                                    ? 'Mark Completed' 
                                    : 'Reschedule'}
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
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
