
import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

interface PublicFigure {
  id: string;
  name: string;
  imageurl: string;
}

// Memoize the individual figure component to prevent unnecessary re-renders
const FigureImage = memo(({ figure, isVisible }: { figure: PublicFigure, isVisible: boolean }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      key={figure.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible && imageLoaded ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className="absolute inset-0"
    >
      <div className="relative w-full h-full">
        <img 
          src={figure.imageurl} 
          alt={figure.name} 
          className="w-full h-full object-cover"
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          style={{ transform: 'translate3d(0, 0, 0)' }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 will-change-transform">
          <h3 className="text-xl font-bold text-white">{figure.name}</h3>
        </div>
      </div>
    </motion.div>
  );
});

FigureImage.displayName = 'FigureImage';

const PublicFiguresSlider: React.FC = () => {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();
  const animationRef = useRef<number | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);
  const rotationIntervalRef = useRef<number>(3000); // 3 seconds

  // Use callback for fetchFigures to avoid recreation on each render
  const fetchFigures = useCallback(async () => {
    try {
      // Use type assertion to allow accessing the public_figures table
      const { data, error } = await (supabase as any)
        .from('public_figures')
        .select('*');
      
      if (error) {
        console.error('Error fetching from public_figures:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        setFigures(data);
      } else {
        // Fallback to placeholder data - fewer items for better performance
        setFigures([
          { 
            id: '1', 
            name: 'Amitabh Bachchan', 
            imageurl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9' 
          },
          { 
            id: '2', 
            name: 'Priyanka Chopra', 
            imageurl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04' 
          },
          { 
            id: '3', 
            name: 'Virat Kohli', 
            imageurl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901' 
          }
        ]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching public figures:', error);
      // Set fallback data in case of error - fewer items for better performance
      setFigures([
        { 
          id: '1', 
          name: 'Amitabh Bachchan', 
          imageurl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9' 
        },
        { 
          id: '2', 
          name: 'Priyanka Chopra', 
          imageurl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04' 
        }
      ]);
      setLoading(false);
    }
  }, []);
  
  // Fetch figures on component mount
  useEffect(() => {
    fetchFigures();
  }, [fetchFigures]);

  // Animation frame loop for smooth rotation
  useEffect(() => {
    if (loading || figures.length === 0) return;

    const updateSlider = (timestamp: number) => {
      // Only update if enough time has passed
      if (timestamp - lastUpdateTimeRef.current >= rotationIntervalRef.current) {
        setCurrentIndex(prevIndex => (prevIndex + 1) % figures.length);
        lastUpdateTimeRef.current = timestamp;
      }
      
      animationRef.current = requestAnimationFrame(updateSlider);
    };
    
    animationRef.current = requestAnimationFrame(updateSlider);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [loading, figures.length]);

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="h-40 w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ideazzz-purple"></div>
      </div>
    );
  }

  if (figures.length === 0) {
    return null;
  }

  return (
    <section className="py-16 overflow-hidden bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
          Public Figures We Worked With
        </h2>
        
        <div className="relative w-full max-w-4xl mx-auto h-64 md:h-80 overflow-hidden rounded-lg will-change-transform">
          {figures.map((figure, index) => (
            <FigureImage 
              key={figure.id} 
              figure={figure} 
              isVisible={index === currentIndex}
            />
          ))}
          
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 z-10">
            {figures.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/30"
                } will-change-transform`}
                onClick={() => setCurrentIndex(index)}
                aria-label={`View figure ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(PublicFiguresSlider);
