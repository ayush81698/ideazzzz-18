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
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { ShoppingCart, Menu, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import AuthButtons from '@/components/AuthButtons';
import { ThemeSwitcher } from '@/hooks/useTheme';
import { useThemeContext } from '@/providers/ThemeProvider';
import AnimatedSidebar from './AnimatedSidebar';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const { theme } = useThemeContext();
  const isMobile = useIsMobile();
  
  // Define navigation items for AnimatedSidebar
  const navigationItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      eyebrow: 'Start'
    },
    {
      id: 'shop',
      label: 'Shop',
      path: '/shop',
      eyebrow: 'Products'
    },
    {
      id: 'booking',
      label: 'Booking',
      path: '/booking',
      eyebrow: 'Sessions'
    },
    {
      id: 'about',
      label: 'About',
      path: '/about',
      eyebrow: 'Info'
    },
    {
      id: 'admin',
      label: 'Admin',
      path: '/admin',
      eyebrow: 'Dashboard'
    },
    {
      id: 'cart',
      label: 'Cart',
      path: '/cart',
      eyebrow: 'Shopping'
    }
  ];

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user?.email) {
        const adminEmails = ['admin@ideazzz.com', 'ayuxx770@gmail.com'];
        setIsAdmin(adminEmails.includes(user.email));
      }
    };
    
    checkUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        const newUser = session?.user || null;
        setUser(newUser);
        
        if (newUser?.email) {
          const adminEmails = ['admin@ideazzz.com', 'ayuxx770@gmail.com'];
          setIsAdmin(adminEmails.includes(newUser.email));
        } else {
          setIsAdmin(false);
        }
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  useEffect(() => {
    const handleCartUpdate = () => {
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCartCount(parsedCart.length);
        } catch (e) {
          console.error('Error parsing cart data:', e);
          setCartCount(0);
        }
      } else {
        setCartCount(0);
      }
    };
    
    handleCartUpdate();
    
    window.addEventListener('storage', handleCartUpdate);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', handleCartUpdate);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleCartClick = () => {
    navigate('/cart');
  };

  const getMenuTextClass = () => {
    return theme === 'dark' 
      ? 'text-white hover:text-gray-200' 
      : 'text-gray-800 hover:text-gray-900';
  };

  const getHeaderClass = () => {
    const scrolledClass = isScrolled 
      ? `${theme === 'dark' ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-md shadow-sm` 
      : theme === 'dark' ? 'bg-gray-900' : 'bg-white';
    
    return `sticky top-0 z-50 w-full ${scrolledClass} transition-all duration-300`;
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <header className={getHeaderClass()}>
        <div className="container mx-auto flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/6b787a6d-ec96-492c-9e23-419a0a02a642.png" 
                alt="Ideazzz Logo" 
                className="h-10 w-auto"
              />
            </Link>
            
            {!isMobile && (
              <NavigationMenu className="ml-4">
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <Link to="/">
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${getMenuTextClass()} hover:bg-purple-600/20`}>
                        Home
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/shop">
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${getMenuTextClass()} hover:bg-purple-600/20`}>
                        Shop
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/booking">
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${getMenuTextClass()} hover:bg-purple-600/20`}>
                        Book a Session
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/about">
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${getMenuTextClass()} hover:bg-purple-600/20`}>
                        About
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Link to="/cart">
                      <NavigationMenuLink className={`${navigationMenuTriggerStyle()} ${getMenuTextClass()} hover:bg-purple-600/20`}>
                        <span className="flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Cart
                          {cartCount > 0 && (
                            <span className="ml-1 bg-purple-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                              {cartCount}
                            </span>
                          )}
                        </span>
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <div className="z-20 mr-2">
              <ThemeSwitcher />
            </div>
            
            <div className="z-20">
              <AuthButtons />
            </div>
            
            <AnimatedSidebar menuItems={navigationItems} />
          </div>
        </div>
      </header>
      
      <main className={`flex-1 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
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
      
      <footer className={`${theme === 'dark' ? 'bg-gray-900 text-white border-t border-gray-800' : 'bg-gray-900 text-white'} py-8`}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Ideazzz</h3>
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
                <li className="text-sm text-gray-400">Email: hello@ideazzz.com</li>
                <li className="text-sm text-gray-400">Phone: +91 98765 43210</li>
                <li className="text-sm text-gray-400 flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <a
                    href="https://maps.app.goo.gl/Li4PhiQgrShMnH7w7"
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="hover:text-white hover:underline"
                  >
                    Mumbai - Malad Studio
                  </a>
                </li>
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
            <p>© {new Date().getFullYear()} Ideazzz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
