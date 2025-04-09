
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PublicFiguresSlider from '@/components/PublicFiguresSlider';
import { PublicFigure } from '@/types/models';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import ModelViewer from '@/components/ModelViewer';
import ImageCollage from '@/components/ImageCollage';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ProductCard from '@/components/ProductCard';

const Index = () => {
  const [publicFigures, setPublicFigures] = useState<PublicFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [featuredProducts, setFeaturedProducts] = useState([
    {
      id: '1',
      name: 'Custom 3D Figure',
      description: 'Personalized 3D figure based on your photo',
      price: 79.99,
      imageurl: '/lovable-uploads/6b787a6d-ec96-492c-9e23-419a0a02a642.png',
      model_url: 'https://prod.spline.design/WorDEPrxYHiC4pAl/scene.splinecode',
      category: 'figures'
    },
    {
      id: '2',
      name: 'Custom 3D Portrait',
      description: 'Personalized 3D portrait model',
      price: 59.99,
      imageurl: '/lovable-uploads/d754419d-a8f8-4d9d-b619-460b25f1a2eb.png', 
      model_url: 'https://prod.spline.design/WorDEPrxYHiC4pAl/scene.splinecode',
      category: 'portraits'
    },
    {
      id: '3',
      name: 'Custom Avatar',
      description: 'Personal 3D avatar for gaming and metaverse',
      price: 49.99,
      imageurl: '/lovable-uploads/e878763e-514f-4b8d-9415-d20319b19995.png',
      model_url: 'https://prod.spline.design/WorDEPrxYHiC4pAl/scene.splinecode',
      category: 'avatars'
    }
  ]);

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

    fetchPublicFigures();
  }, []);

  return (
    <div className="relative w-full">
      {/* Hero Section with 3D Model */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ModelViewer
            modelUrl="https://prod.spline.design/WorDEPrxYHiC4pAl/scene.splinecode"
            autoRotate={true}
            cameraControls={false}
            height="100%"
            width="100%"
          />
        </div>
        
        <motion.div 
          className="container relative z-10 mx-auto px-4 text-center pt-16 pb-32"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Turn Your Photos Into <span className="text-ideazzz-purple">Amazing 3D</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-3xl mx-auto">
            Premium personalized 3D models and figurines created from your photos with state-of-the-art technology
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button size="lg" className="bg-ideazzz-purple hover:bg-ideazzz-purple/90 text-lg px-8">
                Shop Now
              </Button>
            </Link>
            <Link to="/booking">
              <Button size="lg" variant="outline" className="border-ideazzz-purple text-ideazzz-purple hover:bg-ideazzz-purple/10 text-lg px-8">
                Book a Session
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center">
            Featured Products
          </h2>
          
          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-2">
                    <ProductCard product={product} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
          
          <div className="mt-10 text-center">
            <Link to="/shop">
              <Button variant="outline" className="border-ideazzz-purple text-ideazzz-purple hover:bg-ideazzz-purple/10">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Public Figures Slider Section */}
      <PublicFiguresSlider publicFigures={publicFigures} loading={loading} />
      
      {/* Image Collage Section */}
      <ImageCollage />
    </div>
  );
};

export default Index;
