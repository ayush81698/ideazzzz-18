
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import AuthButtons from './AuthButtons';

const Layout = () => {
  const location = useLocation();
  
  const routes = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'Book a Session', path: '/booking' },
    { name: 'About Us', path: '/about' },
    { name: 'Cart', path: '/cart' },
    { name: 'Admin', path: '/admin' }
  ];
  
  const isActive = (path: string) => {
    return path === '/' 
      ? location.pathname === '/'
      : location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4 sticky top-0 z-50 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-bold text-2xl text-ideazzz-purple">
              Ideazzz
            </Link>
            <nav className="hidden md:flex gap-6">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  to={route.path}
                  className={cn(
                    "hover:text-ideazzz-purple transition-colors",
                    isActive(route.path) && "text-ideazzz-purple font-semibold"
                  )}
                >
                  {route.name}
                </Link>
              ))}
            </nav>
          </div>
          <AuthButtons />
        </div>
      </header>
      
      <motion.main 
        className="flex-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      
      <footer className="bg-gray-50 py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">Ideazzz</h3>
              <p className="text-gray-600">
                Turning your ideas into stunning 3D reality. Personalized statues, action figures, and more.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {routes.map((route) => (
                  <li key={route.path}>
                    <Link to={route.path} className="text-gray-600 hover:text-ideazzz-purple">
                      {route.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Us</h3>
              <address className="not-italic text-gray-600">
                <p>Email: info@ideazzz.com</p>
                <p>Phone: +91 9876543210</p>
                <p>Address: 123 Creativity Lane, Mumbai, India</p>
              </address>
            </div>
          </div>
          
          <div className="mt-8 pt-4 border-t text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} Ideazzz. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
