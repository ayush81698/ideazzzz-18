
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { LogIn, LogOut, User } from 'lucide-react';

const AuthButtons = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth state change event:", event);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Get initial session
    const getInitialSession = async () => {
      console.log("Getting initial session");
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
      console.log("Initial session user:", data.session?.user);
    };

    getInitialSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link to="/profile">
          <Button variant="outline" size="sm" className="flex items-center gap-2 bg-purple-600/80 text-white border-purple-400 hover:bg-purple-700">
            <User size={16} />
            Profile
          </Button>
        </Link>
        <Button onClick={handleSignOut} variant="outline" size="sm" className="flex items-center gap-2 bg-gray-700 text-white border-gray-600 hover:bg-gray-800">
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center">
      <Link to="/auth">
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-purple-600/80 text-white border-purple-400 hover:bg-purple-700">
          <LogIn size={16} />
          Sign In
        </Button>
      </Link>
    </div>
  );
};

export default AuthButtons;
