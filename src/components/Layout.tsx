import React, { useState, useEffect } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { cartItems } from '@/pages/Shop';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSwitcher } from '@/hooks/useTheme';
import { supabase } from '@/integrations/supabase/client';
import AuthButtons from '@/components/AuthButtons';

const Layout = () => {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartCount(parsedCart.length);
      } catch (e) {
        console.error('Error parsing cart data:', e);
      }
    } else {
      setCartCount(0);
    }
    
    const handleStorageChange = () => {
      const updatedCart = localStorage.getItem('cartItems');
      if (updatedCart) {
        try {
          const parsedCart = JSON.parse(updatedCart);
          setCartCount(parsedCart.length);
        } catch (e) {
          console.error('Error parsing cart data:', e);
        }
      } else {
        setCartCount(0);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location.pathname, cartItems]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col dark">
      <header className={`sticky top-0 z-50 w-full ${isScrolled ? 'bg-black/90 backdrop-blur-md shadow-sm' : 'bg-black'} transition-all duration-300`}>
        <div className="container mx-auto flex items-center justify-between px-4 h-16">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/6b787a6d-ec96-492c-9e23-419a0a02a642.png" 
              alt="ADeazzz Logo" 
              className="h-10 w-auto"
            />
          </Link>
          
          {!isMobile && (
            <NavigationMenu className="hidden md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/shop">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Shop
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/booking">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Book a Session
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <Link to="/about">
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      About
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                {user && (
                  <NavigationMenuItem>
                    <Link to="/admin">
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Admin
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
          )}
          
          <div className="flex items-center gap-2 md:gap-4">
            <ThemeSwitcher />
            
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
            
            <AuthButtons />
            
            {isMobile && (
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="p-0 bg-black text-white">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-8">
                      <Link to="/" className="flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                        <img 
                          src="/lovable-uploads/6b787a6d-ec96-492c-9e23-419a0a02a642.png" 
                          alt="ADeazzz Logo" 
                          className="h-8 w-auto"
                        />
                      </Link>
                      <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <div className="flex flex-col space-y-4">
                      <Link to="/" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">Home</Button>
                      </Link>
                      <Link to="/shop" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">Shop</Button>
                      </Link>
                      <Link to="/booking" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">Book a Session</Button>
                      </Link>
                      <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start">About</Button>
                      </Link>
                      {user && (
                        <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">Admin</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>
      
      <main className="flex-1 bg-black text-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">ADeazzz</h3>
              <p className="text-sm text-gray-400">
                Premium 3D personalized models and figurines from your photos.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-sm text-gray-400 hover:text-white">Home</Link></li>
                <li><Link to="/shop" className="text-sm text-gray-400 hover:text-white">Shop</Link></li>
                <li><Link to="/booking" className="text-sm text-gray-400 hover:text-white">Book a Session</Link></li>
                <li><Link to="/about" className="text-sm text-gray-400 hover:text-white">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-sm text-gray-400">Email: hello@adeazzz.com</li>
                <li className="text-sm text-gray-400">Phone: +91 98765 43210</li>
                <li className="text-sm text-gray-400">Studio: Mumbai, India</li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-4">Newsletter</h3>
              <p className="text-sm text-gray-400 mb-2">
                Subscribe for updates on new products and special offers.
              </p>
              <div className="flex mt-2">
                <input 
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 border border-gray-700 bg-gray-800 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-ideazzz-purple text-white"
                />
                <Button className="rounded-l-none bg-ideazzz-purple hover:bg-ideazzz-purple/80">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} ADeazzz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
