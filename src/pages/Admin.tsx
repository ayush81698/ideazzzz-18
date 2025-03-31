
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import ModelManager from '@/components/ModelManager';
import ProductManager from '@/components/ProductManager';

const Admin = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAdminAuth();
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
