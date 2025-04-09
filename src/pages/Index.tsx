
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PublicFiguresSlider from '@/components/PublicFiguresSlider';
import { PublicFigure } from '@/types/models';
import ModelViewer from '@/components/ModelViewer';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from '@/components/ProductCard';
import ImageCollage from '@/components/ImageCollage';

const Index = () => {
  const [publicFigures, setPublicFigures] = useState<PublicFigure[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicFigures = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('public_figures')
          .select('*')
          .order('order', { ascending: true });

        if (error) {
          throw error;
        }

        // Use actual data if available, otherwise use fallback data
        if (data && data.length > 0) {
          console.log("Using real public figures data:", data);
          setPublicFigures(data);
        } else {
          // This is fallback data in case the database is empty
          console.log("Using fallback public figures data");
          setPublicFigures([
            {
              id: '1',
              name: 'Sarah Johnson',
              subtitle: '3D Artist',
              description: 'Award-winning 3D artist with over 10 years of experience in creating hyperrealistic models and environments.',
              imageurl: '/lovable-uploads/6b787a6d-ec96-492c-9e23-419a0a02a642.png',
              video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4',
              order: 1
            },
            {
              id: '2',
              name: 'Michael Chen',
              subtitle: 'VR Developer',
              description: 'Michael specializes in creating immersive VR experiences with a focus on interactive environments and physics-based interactions.',
              imageurl: '/lovable-uploads/6b787a6d-ec96-492c-9e23-419a0a02a642.png',
              video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4',
              order: 2
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching public figures:', error);
        toast.error('Failed to load public figures');
        // Still use fallback data in case of error
        setPublicFigures([
          {
            id: '1',
            name: 'Sarah Johnson',
            subtitle: '3D Artist',
            description: 'Award-winning 3D artist with over 10 years of experience in creating hyperrealistic models and environments.',
            imageurl: '/lovable-uploads/6b787a6d-ec96-492c-9e23-419a0a02a642.png',
            video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4',
            order: 1
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_featured', true)
          .limit(4);

        if (error) throw error;

        if (data && data.length > 0) {
          setFeaturedProducts(data);
        } else {
          // Fallback data
          setFeaturedProducts([
            {
              id: '1',
              name: 'Custom 3D Portrait',
              description: 'A highly detailed, personalized 3D portrait based on your photos',
              price: 2999,
              imageurl: '/lovable-uploads/d754419d-a8f8-4d9d-b619-460b25f1a2eb.png',
              model_url: 'https://prod.spline.design/8JkST9hQpUjRqFjD/scene.splinecode'
            },
            {
              id: '2',
              name: 'Family Group Model',
              description: 'Beautiful 3D representation of your entire family',
              price: 4999,
              imageurl: '/lovable-uploads/e878763e-514f-4b8d-9415-d20319b19995.png',
              model_url: 'https://prod.spline.design/8JkST9hQpUjRqFjD/scene.splinecode',
              discount: '15% OFF'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        // Fallback data
        setFeaturedProducts([
          {
            id: '1',
            name: 'Custom 3D Portrait',
            description: 'A highly detailed, personalized 3D portrait based on your photos',
            price: 2999,
            imageurl: '/lovable-uploads/d754419d-a8f8-4d9d-b619-460b25f1a2eb.png',
            model_url: 'https://prod.spline.design/8JkST9hQpUjRqFjD/scene.splinecode'
          }
        ]);
      }
    };

    fetchPublicFigures();
    fetchFeaturedProducts();
  }, []);

  return (
    <div className="relative w-full">
      {/* Hero Section with 3D Model */}
      <section className="relative h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ModelViewer
            modelUrl="https://prod.spline.design/8JkST9hQpUjRqFjD/scene.splinecode"
            width="100%"
            height="100%"
            autoRotate={true}
            cameraControls={false}
            backgroundAlpha={0}
            fieldOfView="45deg"
            exposure="1"
          />
        </div>
        <div className="container mx-auto px-4 z-10 relative">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
              Bring Your Photos to Life in 3D
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-300">
              Transform your cherished memories into stunning 3D models with our premium personalization service.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link to="/shop">
                  Shop Models <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black" asChild>
                <Link to="/booking">
                  Book a Session
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Public Figures Slider */}
      <PublicFiguresSlider publicFigures={publicFigures} loading={loading} />

      {/* Featured Products */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Products</h2>
            <Link to="/shop" className="text-purple-400 hover:text-purple-300 flex items-center">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <ProductCard product={product} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </section>

      {/* Image Collage */}
      <ImageCollage />
    </div>
  );
};

export default Index;
