
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import SplineModel from '@/components/SplineModel';
import PublicFiguresSlider from '@/components/PublicFiguresSlider';
import { Image } from '@/components/ui/image';

interface FeaturedProductsSettings {
  title: string;
  subtitle: string;
  background_type: 'image' | 'youtube' | 'color';
  background_value: string;
  active: boolean;
}

const Index = () => {
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const [settings, setSettings] = useState<FeaturedProductsSettings>({
    title: 'Featured Products',
    subtitle: 'Explore our handpicked collection of premium 3D models and services',
    background_type: 'image',
    background_value: '',
    active: true
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    const timeout = setTimeout(() => setIsModelLoaded(true), 1000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    // Fetch settings for featured products section
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('section', 'featured_products')
          .eq('id', 'settings')
          .single();
          
        if (error && error.code !== 'PGRST116') {
          // PGRST116 is "no rows returned" - not an error for us
          console.error('Error fetching featured products settings:', error);
        }
        
        if (data) {
          try {
            const parsedContent = JSON.parse(data.content || '{}');
            setSettings({
              title: data.title || 'Featured Products',
              subtitle: parsedContent.subtitle || 'Explore our handpicked collection of premium 3D models and services',
              background_type: parsedContent.background_type || 'image',
              background_value: parsedContent.background_value || '',
              active: parsedContent.active !== false
            });
          } catch (e) {
            console.error('Error parsing content JSON:', e);
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    
    fetchSettings();
  }, []);

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('featured', true)
          .limit(3);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setFeaturedProducts(data);
        } else {
          setFeaturedProducts([
            {
              id: 1,
              name: 'Custom Portrait Sculpture',
              description: 'Personalized 3D printed portrait',
              price: 2999,
              imageurl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b',
              discount: '20% OFF'
            },
            {
              id: 2,
              name: 'Pet Figurine',
              description: 'Turn your pet into a 3D model',
              price: 1999,
              imageurl: 'https://images.unsplash.com/photo-1487887235947-a955ef187fcc',
              discount: 'Limited Time'
            },
            {
              id: 3,
              name: '3D Family Photo Frame',
              description: 'Create a 3D scene from your family photo',
              price: 3499,
              imageurl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
              discount: 'New Arrival'
            }
          ]);
        }
        setLoadingProducts(false);
      } catch (error) {
        console.error('Error in featured products fetch:', error);
        setLoadingProducts(false);
      }
    }
    
    fetchFeaturedProducts();
  }, [isMobile]);

  const handleSplineError = () => {
    console.log('Spline error detected, showing fallback');
    setSplineError(true);
  };
  
  // Function to get YouTube embed URL from any YouTube URL format
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    
    let videoId = '';
    
    if (url.includes('youtu.be/')) {
      // Short URL format: https://youtu.be/VIDEO_ID
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/watch')) {
      // Standard URL format: https://www.youtube.com/watch?v=VIDEO_ID
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtube.com/embed/')) {
      // Embed URL format: https://www.youtube.com/embed/VIDEO_ID
      videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
    }
    
    if (!videoId) return url;
    
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0`;
  };

  const getFeaturedProductsBackground = () => {
    if (settings.background_type === 'youtube' && settings.background_value) {
      return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <iframe
            src={getYouTubeEmbedUrl(settings.background_value)}
            className="absolute w-full h-full"
            style={{ 
              transform: 'scale(1.2)',
              transformOrigin: 'center center'
            }}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
          ></iframe>
          <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        </div>
      );
    } else if (settings.background_type === 'image' && settings.background_value) {
      return (
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${settings.background_value})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-70"></div>
        </div>
      );
    } else if (settings.background_type === 'color' && settings.background_value) {
      return (
        <div 
          className="absolute inset-0"
          style={{ backgroundColor: settings.background_value }}
        ></div>
      );
    }
    
    // Default background if no settings or invalid ones
    return <div className="absolute inset-0 bg-gray-50 dark:bg-gray-900"></div>;
  };

  return (
    <div className="relative" data-parallax-layers>
      <style>{`
        .spline-container canvas {
          image-rendering: crisp-edges;
          width: ${isMobile ? '100%' : '70%'};
          height: ${isMobile ? '100%' : '70%'};
          filter: ${splineError ? 'none' : 'blur(1px)'};
        }
        
        .hero-background {
          background-image: url('/fallback-image.jpg');
          background-size: cover;
          background-position: center;
          opacity: ${splineError ? '0.7' : '0.3'};
          transition: opacity 0.5s ease;
        }
      `}</style>

      <section className="relative py-4 md:py-16 min-h-[85vh] overflow-hidden flex items-center">
        <div className="absolute inset-0 w-full h-full z-0 hero-background"></div>
        
        <div className="absolute inset-0 w-full h-full z-0 spline-container parallax__layer" data-parallax-layer="1">
          {isModelLoaded && !splineError ? (
            <SplineModel 
              scene="https://prod.spline.design/AXqCZid080td1A-X/scene.splinecode"
              className="w-full h-full"
              performance={true}
              quality={isMobile ? 'low' : 'medium'}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-ideazzz-purple/10 to-ideazzz-pink/10 opacity-50"></div>
          )}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col justify-between items-center min-h-[70vh]">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col justify-center items-center text-center w-full mt-2 md:mt-4"
            >
              <div className="backdrop-blur-sm bg-black/30 p-4 rounded-lg border border-white/10 shadow-lg max-w-xl">
                <h1 className="text-sm md:text-xl lg:text-2xl font-bold mb-2 md:mb-3 text-white">
                  3D print Your <span className="text-ideazzz-purple">Personalized Models</span>
                </h1>
              </div>
            </motion.div>
            
            <div className="flex flex-wrap gap-4 justify-center mb-10">
              <Link to="/shop">
                <Button size="lg" className="bg-ideazzz-purple hover:bg-ideazzz-purple/90">Explore Shop</Button>
              </Link>
              <Link to="/booking">
                <Button size="lg" variant="outline" className="text-purple border-white hover:bg-white hover:text-ideazzz-purple">Book a 3D Scan</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <PublicFiguresSlider />
      
      {settings.active && (
        <section className="py-12 md:py-16 relative overflow-hidden">
          {getFeaturedProductsBackground()}
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-8 md:mb-10">
              <Badge className="mb-2 bg-ideazzz-pink px-4 py-1 text-white">Special Offers</Badge>
              <h2 className="text-2xl md:text-4xl font-bold text-white">{settings.title}</h2>
              <p className="text-gray-300 mt-2">
                {settings.subtitle}
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
                    <Card className="overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white/10 backdrop-blur-sm border border-white/20">
                      <div className="relative h-36 md:h-48 overflow-hidden">
                        <Image 
                          src={product.imageurl} 
                          alt={product.name}
                          className="w-full h-full object-cover transform transition-transform hover:scale-110"
                          priority={true}
                        />
                        {product.discount && (
                          <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-sm font-semibold">
                            {product.discount}
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4 md:p-5">
                        <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2 text-white">{product.name}</h3>
                        <p className="text-gray-300 mb-2 md:mb-3 text-xs md:text-sm">
                          {product.description}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm md:text-base font-bold text-white">₹{product.price.toLocaleString()}</span>
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
      )}
      
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover how we can transform your ideas into reality with our premium sculpting and 3D printing services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              <div className="p-8">
                <div className="w-14 h-14 bg-ideazzz-purple/10 rounded-lg flex items-center justify-center mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ideazzz-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
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
