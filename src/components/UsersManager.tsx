
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, ArrowUpDown } from "lucide-react";

// Renamed to AdminUser to avoid conflicts with Supabase's User type
interface AdminUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  phone: string | null;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    [key: string]: any;
  };
}

const UsersManager = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }>({ 
    field: 'created_at', 
    direction: 'desc' 
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterAndSortUsers();
  }, [users, searchQuery, sortBy]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // For development purposes, directly fetch users from auth.users
      // In production, this should be handled through a secure backend API
      const { data, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      // Convert data to AdminUser format
      const adminUsers: AdminUser[] = data || [];
      
      // For demo purposes, if no users are found, use sample data
      if (!data || data.length === 0) {
        const demoUsers: AdminUser[] = [
          {
            id: '1',
            email: 'user1@example.com',
            created_at: new Date().toISOString(),
            last_sign_in_at: new Date().toISOString(),
            phone: '+91 98765 43210',
            app_metadata: { provider: 'email' },
            user_metadata: { name: 'Demo User 1' }
          },
          {
            id: '2',
            email: 'user2@example.com',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            last_sign_in_at: null,
            phone: null,
            app_metadata: { provider: 'google' },
            user_metadata: { name: 'Demo User 2' }
          },
          {
            id: '3',
            email: 'admin@ideazzz.com',
            created_at: new Date(Date.now() - 186400000).toISOString(), // 2+ days ago
            last_sign_in_at: new Date().toISOString(),
            phone: '+91 98765 43210',
            app_metadata: { provider: 'email' },
            user_metadata: { name: 'Admin User' }
          }
        ];
        setUsers(demoUsers);
        setFilteredUsers(demoUsers);
      } else {
        setUsers(adminUsers);
        setFilteredUsers(adminUsers);
      }
      
    } catch (error) {
      console.error('Error fetching users:', error);
      
      // Fall back to sample data for demo purposes
      const demoUsers: AdminUser[] = [
        {
          id: '1',
          email: 'user1@example.com',
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          phone: '+91 98765 43210',
          app_metadata: { provider: 'email' },
          user_metadata: { name: 'Demo User 1' }
        },
        {
          id: '2',
          email: 'user2@example.com',
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          last_sign_in_at: null,
          phone: null,
          app_metadata: { provider: 'google' },
          user_metadata: { name: 'Demo User 2' }
        }
      ];
      setUsers(demoUsers);
      setFilteredUsers(demoUsers);
      
      toast.error('Using demo data for testing purposes');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortUsers = () => {
    let filtered = [...users];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        (user.email && user.email.toLowerCase().includes(query)) ||
        (user.phone && user.phone.toLowerCase().includes(query)) ||
        (user.user_metadata?.name && user.user_metadata.name.toLowerCase().includes(query))
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const direction = sortBy.direction === 'asc' ? 1 : -1;
      
      if (sortBy.field === 'created_at') {
        return direction * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      }
      
      if (sortBy.field === 'email') {
        return direction * ((a.email || '').localeCompare(b.email || ''));
      }
      
      if (sortBy.field === 'last_sign_in') {
        if (!a.last_sign_in_at) return direction;
        if (!b.last_sign_in_at) return -direction;
        return direction * (new Date(a.last_sign_in_at).getTime() - new Date(b.last_sign_in_at).getTime());
      }
      
      return 0;
    });
    
    setFilteredUsers(filtered);
  };

  const toggleSort = (field: string) => {
    setSortBy(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>
      
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={fetchUsers}>Refresh</Button>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-8 bg-muted/20 rounded-lg">
          <p className="text-muted-foreground">No users found</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>List of registered users</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="p-0 hover:bg-transparent flex items-center"
                    onClick={() => toggleSort('email')}
                  >
                    Email
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="p-0 hover:bg-transparent flex items-center"
                    onClick={() => toggleSort('created_at')}
                  >
                    Joined
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    className="p-0 hover:bg-transparent flex items-center"
                    onClick={() => toggleSort('last_sign_in')}
                  >
                    Last Sign In
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.app_metadata?.provider || 'Email'}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell>{formatDate(user.last_sign_in_at)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default UsersManager;
