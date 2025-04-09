import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { format } from 'date-fns';

interface AdminUser {
  id: string;
  email: string | null;
  created_at: string;
  last_sign_in_at: string | null;
  phone: string | null;
  app_metadata: { provider: string };
  user_metadata: any;
}

export const UsersManager = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter(
        user => 
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  // Function to fetch actual users from the database
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Fetching users from Supabase...');
      
      // First, try to get all users from the admin_users table
      const { data: userData, error: userError } = await supabase
        .from('admin_users')
        .select('*');
      
      if (userError) {
        console.error('Error fetching from admin_users:', userError);
      }
      
      // Also try to get public_figures data to merge with users
      const { data: publicFiguresData, error: publicFiguresError } = await supabase
        .from('public_figures')
        .select('*');
      
      if (publicFiguresError) {
        console.error('Error fetching from public_figures:', publicFiguresError);
      }
      
      // Try to get auth users if possible
      let authUsers: AdminUser[] = [];
      try {
        console.log('Attempting to fetch authenticated users...');
        const { data, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
          console.error('Error fetching auth users:', error);
        } else if (data && data.users && data.users.length > 0) {
          console.log(`Retrieved ${data.users.length} authenticated users`);
          authUsers = data.users.map(user => ({
            id: user.id,
            email: user.email,
            created_at: user.created_at,
            last_sign_in_at: user.last_sign_in_at,
            phone: user.phone,
            app_metadata: user.app_metadata,
            user_metadata: user.user_metadata
          }));
        }
      } catch (e) {
        console.log('Admin API not accessible, continuing with regular database users');
      }
      
      // Combine all data sources
      let allUsers: AdminUser[] = [];
      
      // Add admin users if we have them
      if (userData && userData.length > 0) {
        console.log(`Got ${userData.length} users from admin_users table`);
        const mappedAdminUsers = userData.map(user => ({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: null,
          phone: null,
          app_metadata: { provider: 'Database' },
          user_metadata: {}
        }));
        allUsers = [...allUsers, ...mappedAdminUsers];
      }
      
      // Add public figures as users if we have them
      if (publicFiguresData && publicFiguresData.length > 0) {
        console.log(`Got ${publicFiguresData.length} users from public_figures table`);
        const mappedPublicFigures = publicFiguresData.map(figure => ({
          id: figure.id,
          email: `${figure.name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          created_at: figure.created_at,
          last_sign_in_at: null,
          phone: null,
          app_metadata: { provider: 'PublicFigure' },
          user_metadata: { name: figure.name }
        }));
        allUsers = [...allUsers, ...mappedPublicFigures];
      }
      
      // Add auth users if we have them
      if (authUsers.length > 0) {
        console.log(`Got ${authUsers.length} users from auth system`);
        allUsers = [...allUsers, ...authUsers];
      }
      
      // Remove duplicates (based on id)
      const uniqueUsers = Array.from(
        new Map(allUsers.map(user => [user.id, user])).values()
      );
      
      if (uniqueUsers.length === 0) {
        console.warn('No users found in any data source');
        toast.warning('No users found. Please add users to see them here.');
      } else {
        console.log(`Successfully loaded ${uniqueUsers.length} unique users`);
        toast.success(`Loaded ${uniqueUsers.length} users successfully`);
      }
      
      setUsers(uniqueUsers);
      setFilteredUsers(uniqueUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Error fetching users. Please try again later.');
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Users Management</h2>
        <div className="flex space-x-2">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64"
          />
          <Button onClick={fetchUsers} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Last Sign In</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">Loading...</TableCell>
              </TableRow>
            ) : filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id.substring(0, 8)}...</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.created_at ? format(new Date(user.created_at), 'PP') : 'N/A'}</TableCell>
                  <TableCell>{user.app_metadata?.provider || 'Unknown'}</TableCell>
                  <TableCell>
                    {user.last_sign_in_at 
                      ? format(new Date(user.last_sign_in_at), 'PP pp')
                      : 'Never'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">No users found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UsersManager;
