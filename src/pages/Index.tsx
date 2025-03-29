
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import ModelViewer from '@/components/ModelViewer';
import FloatingModels from '@/components/FloatingModels';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Box, ShoppingBag, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [models, setModels] = useState([]);
  const [floatingModels, setFloatingModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    async function fetchFeaturedModels() {
      try {
        const { data, error } = await supabase
          .from('models')
          .select('*')
          .eq('is_featured', true)
          .limit(3);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Use the first model as the main model
          setModels(data.slice(0, 1));
          
          // Create floating model configuration from fetched models
          if (data.length > 1) {
            const floatingModelData = data.map((model, index) => ({
              id: model.id || `model-${index}`,
              url: model.model_url,
              position: getPositionForIndex(index),
              scale: isMobile ? "0.6 0.6 0.6" : "1 1 1",
              rotationAxis: "y" as 'y',
              initialRotation: `${index * 120}deg`,
              zIndex: 2 - index
            }));
            setFloatingModels(floatingModelData);
          }
        } else {
          // If no models are found, use defaults
          setModels([{
            id: 'default',
            name: 'Sculpture Sample',
            description: 'A beautiful example of our craftsmanship',
            model_url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb'
          }]);
        }
      } catch (error) {
        console.error('Error fetching models:', error);
      } finally {
        setLoading(false);
      }
    }
    
    async function fetchFeaturedProducts() {
      try {
        // In a real app, this would fetch from the products table with a featured flag
        setFeaturedProducts([
          {
            id: 1,
            name: 'Custom Portrait Sculpture',
            description: 'Personalized 3D printed portrait',
            price: 2999,
            imageUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
            discount: '20% OFF'
          },
          {
            id: 2,
            name: 'Pet Figurine',
            description: 'Turn your pet into a 3D model',
            price: 1999,
            imageUrl: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc',
            discount: 'Limited Time'
          },
          {
            id: 3,
            name: '3D Family Photo Frame',
            description: 'Create a 3D scene from your family photo',
            price: 3499,
            imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
            discount: 'New Arrival'
          }
        ]);
        setLoadingProducts(false);
      } catch (error) {
        console.error('Error in featured products fetch:', error);
        setLoadingProducts(false);
      }
    }
    
    fetchFeaturedModels();
    fetchFeaturedProducts();
  }, [isMobile]);

  // Helper function to position models based on index
  const getPositionForIndex = (index) => {
    const positions = [
      { top: isMobile ? '15%' : '10%', right: isMobile ? '5%' : '15%' },
      { bottom: isMobile ? '15%' : '10%', left: isMobile ? '5%' : '15%' },
      { top: isMobile ? '30%' : '40%', left: isMobile ? '35%' : '40%' }
    ];
    return positions[index % positions.length];
  };

  return (
    <div className="relative">
      {/* Hero Section with 3D Models */}
      <section className="relative py-10 md:py-20 min-h-[85vh] overflow-hidden">
        {/* 3D Model Background with multiple floating models */}
        <div className="absolute inset-0 w-full z-0">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ideazzz-purple"></div>
            </div>
          ) : (
            <FloatingModels 
              models={floatingModels} 
              backgroundImage="/lovable-uploads/e878763e-514f-4b8d-9415-d20319b19995.png"
              rotateOnScroll={true}
            />
          )}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center min-h-[70vh] md:min-h-0">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left"
            >
              <div className="backdrop-blur-sm bg-black/30 p-6 rounded-lg border border-white/10 w-full max-w-lg">
                <Badge className="mb-4 bg-ideazzz-purple px-4 py-1 text-white">Premium Craftsmanship</Badge>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-white">Create Your <span className="text-ideazzz-purple">Personalized 3D Models</span></h1>
                <p className="text-base md:text-xl text-gray-200 mb-6 md:mb-8">
                  Experience the artistry of sculpting and 3D printing that transforms your concepts into tangible masterpieces.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                  <Link to="/shop">
                    <Button size="lg" className="bg-ideazzz-purple hover:bg-ideazzz-purple/90">Explore Shop</Button>
                  </Link>
                  <Link to="/booking">
                    <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-ideazzz-purple">Book a 3D Scan</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Empty div to maintain grid layout */}
              <div className={isMobile ? "h-[100px]" : "h-[300px]"}></div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Products Section */}
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-10">
            <Badge className="mb-2 bg-ideazzz-pink px-4 py-1 text-white">Special Offers</Badge>
            <h2 className="text-2xl md:text-4xl font-bold">Featured Products</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Explore our handpicked collection of premium 3D models and services
            </p>
          </div>
          
          {loadingProducts ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ideazzz-purple"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {featuredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  whileHover={{ y: -10 }}
                  className="relative"
                >
                  <Card className="overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
                    <div className="relative h-36 md:h-48 overflow-hidden">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover transform transition-transform hover:scale-110" 
                      />
                      {product.discount && (
                        <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-sm font-semibold">
                          {product.discount}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4 md:p-5">
                      <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{product.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-2 md:mb-3 text-xs">
                        {product.description}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm md:text-base font-bold">₹{product.price.toLocaleString()}</span>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-ideazzz-purple border-ideazzz-purple hover:bg-ideazzz-purple hover:text-white"
                          asChild
                        >
                          <Link to={`/shop/${product.id}`}>
                            <ShoppingBag className="h-3 w-3 md:h-4 md:w-4 mr-1" /> View
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-8 md:mt-10 text-center">
            <Link to="/shop">
              <Button size="lg" className="bg-ideazzz-purple hover:bg-ideazzz-purple/90">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover how we can transform your ideas into reality with our premium sculpting and 3D printing services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-8">
                <div className="w-14 h-14 bg-ideazzz-purple/10 rounded-lg flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ideazzz-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Custom Design</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Work with our expert designers to bring your unique vision to life with precision and artistry.
                </p>
                <Link to="/booking" className="text-ideazzz-purple font-medium inline-flex items-center">
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
            
            {/* Service Card 2 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-8">
                <div className="w-14 h-14 bg-ideazzz-pink/10 rounded-lg flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ideazzz-pink" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">3D Printing</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  High-quality 3D printing services using premium materials for durable and detailed results.
                </p>
                <Link to="/shop" className="text-ideazzz-pink font-medium inline-flex items-center">
                  Explore Products
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
            
            {/* Service Card 3 */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-8">
                <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Premium Materials</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  We use only the highest quality materials to ensure longevity and beauty in every piece.
                </p>
                <Link to="/about" className="text-blue-500 font-medium inline-flex items-center">
                  About Our Process
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
