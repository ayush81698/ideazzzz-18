
import React, { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ShoppingCart, User, Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    // Check if dark mode is enabled
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
    
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);
  
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:bg-gray-900/90 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/d754419d-a8f8-4d9d-b619-460b25f1a2eb.png" alt="Ideazzz Logo" className="h-10" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={cn("nav-link", isActive("/") && "after:w-full text-ideazzz-purple dark:text-ideazzz-light")}>
            Home
          </Link>
          <Link to="/shop" className={cn("nav-link", isActive("/shop") && "after:w-full text-ideazzz-purple dark:text-ideazzz-light")}>
            Shop
          </Link>
          <Link to="/booking" className={cn("nav-link", isActive("/booking") && "after:w-full text-ideazzz-purple dark:text-ideazzz-light")}>
            Booking
          </Link>
          <Link to="/about" className={cn("nav-link", isActive("/about") && "after:w-full text-ideazzz-purple dark:text-ideazzz-light")}>
            About
          </Link>
        </nav>
        
        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <Toggle 
            aria-label="Toggle dark mode" 
            className="border-0"
            pressed={darkMode}
            onPressedChange={toggleDarkMode}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-ideazzz-purple" />
            )}
          </Toggle>
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5 text-ideazzz-purple dark:text-ideazzz-light" />
              <span className="absolute -top-1 -right-1 bg-ideazzz-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5 text-ideazzz-purple dark:text-ideazzz-light" />
            </Button>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="flex items-center space-x-2 md:hidden">
          <Toggle 
            aria-label="Toggle dark mode" 
            className="border-0"
            pressed={darkMode}
            onPressedChange={toggleDarkMode}
          >
            {darkMode ? (
              <Sun className="h-5 w-5 text-yellow-400" />
            ) : (
              <Moon className="h-5 w-5 text-ideazzz-purple" />
            )}
          </Toggle>
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X className="h-6 w-6 dark:text-white" /> : <Menu className="h-6 w-6 dark:text-white" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 bg-white dark:bg-gray-900 z-40 pt-20 px-4 md:hidden transition-transform duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="flex flex-col space-y-6">
          <Link to="/" className="text-xl font-medium dark:text-white" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/shop" className="text-xl font-medium dark:text-white" onClick={() => setMobileMenuOpen(false)}>
            Shop
          </Link>
          <Link to="/booking" className="text-xl font-medium dark:text-white" onClick={() => setMobileMenuOpen(false)}>
            Booking
          </Link>
          <Link to="/about" className="text-xl font-medium dark:text-white" onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
          <div className="flex space-x-4 pt-4">
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="flex items-center space-x-2 dark:border-gray-700 dark:text-white">
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
              </Button>
            </Link>
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="flex items-center space-x-2 dark:border-gray-700 dark:text-white">
                <User className="h-5 w-5" />
                <span>Admin</span>
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

const Footer = () => {
  return (
    <footer className="bg-ideazzz-dark text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Ideazzz</h3>
            <p className="text-gray-300">
              Turning your ideas into personalized 3D reality. Capture your likeness forever with our cutting-edge 3D scanning and printing technology.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/shop" className="text-gray-300 hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/booking" className="text-gray-300 hover:text-white transition-colors">Book a Scan</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Studio Locations</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Mumbai - Malad</li>
              <li className="text-gray-300">Mumbai - Andheri</li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="text-gray-300">Email: info@ideazzz.com</li>
              <li className="text-gray-300">Phone: +91 9876543210</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Ideazzz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
