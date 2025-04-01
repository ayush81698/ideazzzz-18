
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

interface PublicFigure {
  id: string;
  name: string;
  imageurl: string;
}

const PublicFiguresSlider: React.FC = () => {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchFigures = async () => {
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
          // Fallback to placeholder data
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
            },
            { 
              id: '4', 
              name: 'Deepika Padukone', 
              imageurl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9' 
            },
            { 
              id: '5', 
              name: 'Shah Rukh Khan', 
              imageurl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04' 
            }
          ]);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching public figures:', error);
        // Set fallback data in case of error
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
        setLoading(false);
      }
    };
    
    fetchFigures();
  }, []);

  // Rotate through images every 3 seconds
  useEffect(() => {
    if (!loading && figures.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % figures.length);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [loading, figures.length]);

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
        
        <div className="relative w-full max-w-4xl mx-auto h-64 md:h-80 overflow-hidden rounded-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={figures[currentIndex].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <div className="relative w-full h-full">
                <img 
                  src={figures[currentIndex].imageurl} 
                  alt={figures[currentIndex].name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{figures[currentIndex].name}</h3>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
            {figures.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentIndex ? "bg-white" : "bg-white/30"
                }`}
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

export default PublicFiguresSlider;
