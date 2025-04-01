
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ProductManager from '@/components/ProductManager';
import ModelManager from '@/components/ModelManager';
import BookingsManager from '@/components/BookingsManager';
import UsersManager from '@/components/UsersManager';
import PublicFiguresManager from '@/components/PublicFiguresManager';

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          toast.error('You must be logged in to access the admin panel');
          navigate('/auth');
          return;
        }
        
        // Check if user is admin - for now, we'll just check if the user exists
        // since we don't have a profiles table with roles yet
        setLoading(false);
        
        // Uncomment this when you have a profiles table with role field
        /*
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        
        if (!data || data.role !== 'admin') {
          toast.error('You do not have admin privileges');
          navigate('/');
          return;
        }
        */
        
      } catch (error) {
        console.error('Admin check error:', error);
        toast.error('Error verifying admin status');
        navigate('/');
      }
    };
    
    checkAdmin();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-ideazzz-purple"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-8 grid grid-cols-5 max-w-4xl">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="models">3D Models</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="public-figures">Public Figures</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="w-full">
          <ProductManager />
        </TabsContent>
        
        <TabsContent value="models" className="w-full">
          <ModelManager />
        </TabsContent>
        
        <TabsContent value="bookings" className="w-full">
          <BookingsManager />
        </TabsContent>
        
        <TabsContent value="users" className="w-full">
          <UsersManager />
        </TabsContent>
        
        <TabsContent value="public-figures" className="w-full">
          <PublicFiguresManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
