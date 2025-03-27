
import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img src="/lovable-uploads/d754419d-a8f8-4d9d-b619-460b25f1a2eb.png" alt="Ideazzz Logo" className="h-10" />
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className={cn("nav-link", isActive("/") && "after:w-full text-ideazzz-purple")}>
            Home
          </Link>
          <Link to="/shop" className={cn("nav-link", isActive("/shop") && "after:w-full text-ideazzz-purple")}>
            Shop
          </Link>
          <Link to="/booking" className={cn("nav-link", isActive("/booking") && "after:w-full text-ideazzz-purple")}>
            Booking
          </Link>
          <Link to="/about" className={cn("nav-link", isActive("/about") && "after:w-full text-ideazzz-purple")}>
            About
          </Link>
        </nav>
        
        {/* Right Icons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5 text-ideazzz-purple" />
              <span className="absolute -top-1 -right-1 bg-ideazzz-pink text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>
          </Link>
          <Link to="/admin">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5 text-ideazzz-purple" />
            </Button>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Mobile Menu */}
      <div className={cn(
        "fixed inset-0 bg-white z-40 pt-20 px-4 md:hidden transition-transform duration-300 ease-in-out",
        mobileMenuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <nav className="flex flex-col space-y-6">
          <Link to="/" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link to="/shop" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
            Shop
          </Link>
          <Link to="/booking" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
            Booking
          </Link>
          <Link to="/about" className="text-xl font-medium" onClick={() => setMobileMenuOpen(false)}>
            About
          </Link>
          <div className="flex space-x-4 pt-4">
            <Link to="/cart" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Cart</span>
              </Button>
            </Link>
            <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="outline" className="flex items-center space-x-2">
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
    <div className="min-h-screen flex flex-col">
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
