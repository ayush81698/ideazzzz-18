
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/providers/ThemeProvider";
import Layout from "@/components/Layout";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import Booking from "./pages/Booking";
import About from "./pages/About";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import LoadingScreen from "@/components/LoadingScreen";
import { useState, useEffect } from "react";
import "./App.css";

const queryClient = new QueryClient();

const App = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate checking if all resources are loaded
    const handleLoad = () => {
      // Allow some time for all resources to render
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    };

    // Check if the page has already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <div className="dark">
            {isLoading && <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />}
            <Toaster />
            <Sonner />
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="shop" element={<Shop />} />
                  <Route path="shop/:id" element={<ProductPage />} />
                  <Route path="booking" element={<Booking />} />
                  <Route path="about" element={<About />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="admin" element={<Admin />} />
                  <Route path="auth" element={<Auth />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </AnimatePresence>
          </div>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
