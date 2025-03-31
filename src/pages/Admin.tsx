
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ModelManager from '@/components/ModelManager';
import ProductManager from '@/components/ProductManager';
import { addProduct, fetchProducts } from '@/services/productService';
import { toast } from 'sonner';

// Sample products for seeding the database
const sampleProducts = [
  {
    name: "Superhero Action Figure",
    description: "Custom superhero action figure with dynamic pose",
    price: 4999,
    category: "Action Figures",
    stock: 15,
    imageurl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80",
    discount: "20% OFF",
    featured: true
  },
  {
    name: "Celebrity Miniature",
    description: "Highly detailed celebrity figurine with lifelike features",
    price: 6999,
    category: "Collectibles",
    stock: 8,
    imageurl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80",
    discount: "Limited Edition",
    featured: false
  },
  {
    name: "Wedding Cake Topper",
    description: "Personalized wedding cake topper from your photos",
    price: 3499,
    category: "Special Occasions",
    stock: 20,
    imageurl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80",
    discount: "",
    featured: true
  }
];

const Admin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);
  const [needsProductSeeding, setNeedsProductSeeding] = useState(false);

  useEffect(() => {
    checkAdminAuth();
    checkProducts();
  }, []);

  const checkAdminAuth = async () => {
    try {
      setIsLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setIsAdmin(false);
        setIsLoading(false);
        return;
      }
      
      setUser(session.user);
      
      // Check if the user's email is in the admin_users table
      if (session.user?.email === 'ayushkava1@gmail.com') {
        setIsAdmin(true);
        setIsLoading(false);
        return;
      }
      
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', session.user.email)
        .single();
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(true);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error in admin authentication:', error);
      setIsAdmin(false);
      setIsLoading(false);
    }
  };

  const checkProducts = async () => {
    try {
      const products = await fetchProducts();
      
      if (!products || products.length === 0) {
        setNeedsProductSeeding(true);
      } else {
        console.log("Products found:", products.length);
        setNeedsProductSeeding(false);
      }
    } catch (error) {
      console.error('Error checking products:', error);
    }
  };

  const seedProducts = async () => {
    try {
      setIsLoading(true);
      
      // Add each sample product to the database
      for (const product of sampleProducts) {
        await addProduct(product);
      }
      
      setNeedsProductSeeding(false);
      toast.success('Sample products added successfully');
    } catch (error) {
      console.error('Error seeding products:', error);
      toast.error('Failed to add sample products');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdmin(false);
    setUser(null);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Checking admin credentials...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert className="mb-8">
          <AlertDescription>
            You need to be an admin to access this page. Please log in with admin credentials.
          </AlertDescription>
        </Alert>
        <div className="flex justify-center">
          <Button asChild>
            <Navigate to="/auth" replace />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-4">
          <p className="text-muted-foreground">Logged in as {user?.email}</p>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      
      {needsProductSeeding && (
        <Alert className="mb-8">
          <AlertDescription className="flex items-center justify-between">
            <span>No products found in the database. Add sample products to get started?</span>
            <Button onClick={seedProducts}>Add Sample Products</Button>
          </AlertDescription>
        </Alert>
      )}
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="models">3D Models</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="space-y-4">
          <ProductManager />
        </TabsContent>
        
        <TabsContent value="models" className="space-y-4">
          <ModelManager />
        </TabsContent>
        
        <TabsContent value="bookings" className="space-y-4">
          <h2 className="text-2xl font-bold">Booking Management</h2>
          <p className="text-muted-foreground">
            Manage customer bookings and appointments here. This section is under development.
          </p>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">
            Manage user accounts and permissions here. This section is under development.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
