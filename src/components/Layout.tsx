
import React from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  NavigationMenu, 
  NavigationMenuContent, 
  NavigationMenuItem, 
  NavigationMenuLink, 
  NavigationMenuList, 
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { Sun, Moon, Menu, User, ShoppingCart } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useThemeContext } from '@/providers/ThemeProvider';
import AuthButtons from './AuthButtons';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

interface NavigationItem {
  title: string;
  href: string;
  description?: string;
}

const Layout = () => {
  const isMobile = useIsMobile();
  const location = useLocation();
  const { theme, toggleTheme } = useThemeContext();
  const [user, setUser] = useState(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  
  useEffect(() => {
    // Check for user session
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
    };
    
    checkSession();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const components: NavigationItem[] = [
    {
      title: 'Classical Collection',
      href: '/shop?category=classical',
      description: 'Timeless pieces inspired by ancient Greek and Roman art.'
    },
    {
      title: 'Modern Abstracts',
      href: '/shop?category=modern',
      description: 'Contemporary sculptures that push artistic boundaries.'
    },
    {
      title: 'Custom Portraits',
      href: '/shop?category=portraits',
      description: 'Personalized 3D printed busts and figurines.'
    },
    {
      title: 'Architectural Models',
      href: '/shop?category=architecture',
      description: 'Detailed replicas of iconic buildings and structures.'
    }
  ];
  
  const services: NavigationItem[] = [
    {
      title: '3D Scanning',
      href: '/booking',
      description: 'Create digital replicas of physical objects with precision.'
    },
    {
      title: 'Custom Sculpting',
      href: '/booking',
      description: 'Bring your unique vision to life with our expert sculpting service.'
    },
    {
      title: '3D Printing',
      href: '/booking',
      description: 'Transform digital designs into physical objects.'
    },
    {
      title: 'Finishing & Painting',
      href: '/booking',
      description: 'Professional finishing touches to elevate your creations.'
    }
  ];
  
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-ideazzz-purple to-ideazzz-pink text-transparent bg-clip-text">ideazzz</span>
            </Link>
            
            {!isMobile && (
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavLink to="/" className={({isActive}) => isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                      </NavigationMenuLink>
                    </NavLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Shop</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {components.map((component) => (
                          <li key={component.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={component.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{component.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {component.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                        {services.map((component) => (
                          <li key={component.title}>
                            <NavigationMenuLink asChild>
                              <Link
                                to={component.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{component.title}</div>
                                <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                  {component.description}
                                </p>
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavLink to="/about" className={({isActive}) => isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        About
                      </NavigationMenuLink>
                    </NavLink>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <NavLink to="/booking" className={({isActive}) => isActive ? "text-primary" : "text-muted-foreground hover:text-primary"}>
                      <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Book Now
                      </NavigationMenuLink>
                    </NavLink>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Theme Toggle Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 bg-ideazzz-purple text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {isMobile ? (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="flex flex-col gap-4 py-4">
                    <Link 
                      to="/" 
                      className={`text-lg font-medium ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      Home
                    </Link>
                    <Link 
                      to="/shop" 
                      className={`text-lg font-medium ${location.pathname === '/shop' ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      Shop
                    </Link>
                    <Link 
                      to="/booking" 
                      className={`text-lg font-medium ${location.pathname === '/booking' ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      Book Now
                    </Link>
                    <Link 
                      to="/about" 
                      className={`text-lg font-medium ${location.pathname === '/about' ? 'text-primary' : 'text-muted-foreground'}`}
                    >
                      About
                    </Link>
                    <Separator />
                    
                    {user ? (
                      <>
                        <Link 
                          to="/profile" 
                          className={`text-lg font-medium ${location.pathname === '/profile' ? 'text-primary' : 'text-muted-foreground'}`}
                        >
                          My Profile
                        </Link>
                        <Button
                          onClick={async () => {
                            await supabase.auth.signOut();
                          }}
                          variant="outline"
                        >
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Link to="/auth">
                        <Button className="w-full">Login / Register</Button>
                      </Link>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            ) : (
              <>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <Link to="/profile">
                        <DropdownMenuItem>
                          My Profile
                        </DropdownMenuItem>
                      </Link>
                      <Link to="/admin">
                        <DropdownMenuItem>
                          Admin Dashboard
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem 
                        onClick={async () => {
                          await supabase.auth.signOut();
                        }}
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <AuthButtons />
                )}
              </>
            )}
          </div>
        </div>
      </header>
      
      <main>
        <Outlet />
      </main>
      
      <footer className="bg-background border-t">
        <div className="container py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">About ideazzz</h3>
              <p className="text-muted-foreground">
                We transform your ideas into tangible 3D sculptures and prints through expert craftsmanship and cutting-edge technology.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Shop</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/shop?category=classical" className="text-muted-foreground hover:text-primary">
                    Classical Collection
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=modern" className="text-muted-foreground hover:text-primary">
                    Modern Abstracts
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=portraits" className="text-muted-foreground hover:text-primary">
                    Custom Portraits
                  </Link>
                </li>
                <li>
                  <Link to="/shop?category=architecture" className="text-muted-foreground hover:text-primary">
                    Architectural Models
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Services</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/booking" className="text-muted-foreground hover:text-primary">
                    3D Scanning
                  </Link>
                </li>
                <li>
                  <Link to="/booking" className="text-muted-foreground hover:text-primary">
                    Custom Sculpting
                  </Link>
                </li>
                <li>
                  <Link to="/booking" className="text-muted-foreground hover:text-primary">
                    3D Printing
                  </Link>
                </li>
                <li>
                  <Link to="/booking" className="text-muted-foreground hover:text-primary">
                    Finishing & Painting
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-muted-foreground">
                  Mumbai, India
                </li>
                <li>
                  <a href="mailto:info@ideazzz.com" className="text-muted-foreground hover:text-primary">
                    info@ideazzz.com
                  </a>
                </li>
                <li>
                  <a href="tel:+91-9876543210" className="text-muted-foreground hover:text-primary">
                    +91 9876543210
                  </a>
                </li>
                <li className="pt-4">
                  <div className="flex space-x-4">
                    <a href="#" className="text-muted-foreground hover:text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                      </svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                      </svg>
                    </a>
                    <a href="#" className="text-muted-foreground hover:text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                      </svg>
                    </a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} ideazzz. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Layout;
