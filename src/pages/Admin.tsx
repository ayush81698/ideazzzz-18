
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import ProductsTable from '@/components/ProductsTable';
import BookingsManager from '@/components/BookingsManager';
import UsersManager from '@/components/UsersManager';
import PublicFiguresManager from '@/components/PublicFiguresManager';

// Explicitly define admin emails for type safety
const ADMIN_EMAILS: string[] = [
  'admin@ideazzz.com', 
  'ayuxx770@gmail.com',
  'ayushkava1@gmail.com' // Added the new admin email
];

const Admin = () => {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error) throw error;
        
        if (!user) {
          toast.error('You must be logged in to access the admin panel');
          navigate('/auth', { replace: true });
          return;
        }
        
        const userEmail = user.email?.toLowerCase() || '';
        
        if (!ADMIN_EMAILS.includes(userEmail)) {
          toast.error('You do not have admin privileges');
          navigate('/', { replace: true });
          return;
        }
        
        // User is authenticated and has admin privileges
        setIsAdmin(true);
        setLoading(false);
      } catch (error) {
        console.error('Admin check error:', error);
        toast.error('Error verifying admin status');
        navigate('/', { replace: true });
      }
    };
    
    checkAdminStatus();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-ideazzz-purple"></div>
      </div>
    );
  }

  if (!isAdmin) {
    // This is an extra safety measure in case navigation fails
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">You do not have permission to access this page.</p>
        <button 
          onClick={() => navigate('/')} 
          className="px-4 py-2 bg-ideazzz-purple text-white rounded hover:bg-ideazzz-purple/90"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="products" className="w-full">
        <TabsList className="mb-8 grid grid-cols-4 max-w-4xl">
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="bookings">Bookings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="public-figures">Public Figures</TabsTrigger>
        </TabsList>
        
        <TabsContent value="products" className="w-full">
          <ProductsTable />
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
