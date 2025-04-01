
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useIsMobile } from '@/hooks/use-mobile';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';

interface PublicFigure {
  id: string;
  name: string;
  imageUrl: string;
}

const PublicFiguresSlider: React.FC = () => {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchFigures = async () => {
      try {
        // Try to fetch from Supabase if table exists
        const { data, error } = await supabase
          .from('public_figures')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setFigures(data);
        } else {
          // Fallback to placeholder data
          setFigures([
            { 
              id: '1', 
              name: 'Amitabh Bachchan', 
              imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9' 
            },
            { 
              id: '2', 
              name: 'Priyanka Chopra', 
              imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04' 
            },
            { 
              id: '3', 
              name: 'Virat Kohli', 
              imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901' 
            },
            { 
              id: '4', 
              name: 'Deepika Padukone', 
              imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9' 
            },
            { 
              id: '5', 
              name: 'Shah Rukh Khan', 
              imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04' 
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
            imageUrl: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9' 
          },
          { 
            id: '2', 
            name: 'Priyanka Chopra', 
            imageUrl: 'https://images.unsplash.com/photo-1721322800607-8c38375eef04' 
          },
          { 
            id: '3', 
            name: 'Virat Kohli', 
            imageUrl: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901' 
          }
        ]);
        setLoading(false);
      }
    };
    
    fetchFigures();
  }, []);

  useEffect(() => {
    if (!loading && figures.length > 0 && sliderRef.current) {
      const slider = sliderRef.current;
      const slides = slider.querySelectorAll('.slider-item');
      
      if (slides.length > 0) {
        // Setup GSAP animation for slides
        gsap.set(slides, { xPercent: 0, opacity: 0 });
        
        slides.forEach((slide, index) => {
          gsap.to(slide, {
            opacity: 1,
            duration: 0.7,
            delay: index * 0.1,
            ease: "power2.out"
          });
        });
        
        // Create infinite slider animation
        const duration = 20;
        const slideWidth = slides[0].getBoundingClientRect().width;
        const totalWidth = slideWidth * slides.length;
        
        gsap.to(slides, {
          xPercent: -100 * (slides.length - (isMobile ? 1 : 3)),
          ease: "none",
          duration: duration,
          repeat: -1,
          repeatDelay: 1,
          yoyo: true
        });
      }
    }
  }, [loading, figures, isMobile]);

  if (loading) {
    return (
      <div className="h-40 w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ideazzz-purple"></div>
      </div>
    );
  }

  return (
    <section className="py-16 overflow-hidden bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
          Public Figures We Worked With
        </h2>
        
        <div className="relative w-full">
          <div 
            ref={sliderRef} 
            className="flex flex-nowrap gap-4 md:gap-6 py-4 overflow-visible"
          >
            {figures.map((figure) => (
              <div key={figure.id} className="slider-item flex-shrink-0 w-80 md:w-96">
                <Card className="overflow-hidden h-full rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 bg-black/50 backdrop-blur-sm">
                  <div className="h-64 md:h-80 relative overflow-hidden">
                    <img 
                      src={figure.imageUrl} 
                      alt={figure.name} 
                      className="w-full h-full object-cover transform transition-transform hover:scale-105 duration-700"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                      <h3 className="text-xl font-bold text-white">{figure.name}</h3>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PublicFiguresSlider;
