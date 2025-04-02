
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Image } from '@/components/ui/image';

interface PublicFigure {
  id: string;
  name: string;
  imageurl: string;
}

const OptimizedPublicFiguresSlider = () => {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef<number>();
  const lastUpdateTimeRef = useRef<number>(0);
  const navigate = useNavigate();

  // Fetch public figures on component mount
  useEffect(() => {
    const fetchFigures = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('public_figures')
          .select('*');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setFigures(data);
        } else {
          setFigures([]);
        }
      } catch (error) {
        console.error('Error fetching public figures:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFigures();
  }, []);

  // Optimize slider animation using requestAnimationFrame
  useEffect(() => {
    if (figures.length <= 1) return;
    
    const animateSlider = (timestamp: number) => {
      // Update every 3 seconds (3000ms)
      if (!lastUpdateTimeRef.current) {
        lastUpdateTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - lastUpdateTimeRef.current;
      
      if (elapsed >= 3000) {
        setActiveIndex(prevIndex => (prevIndex + 1) % figures.length);
        lastUpdateTimeRef.current = timestamp;
      }
      
      animationRef.current = requestAnimationFrame(animateSlider);
    };
    
    animationRef.current = requestAnimationFrame(animateSlider);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [figures.length]);

  // Memoize the slider content to prevent unnecessary re-renders
  const sliderContent = useMemo(() => {
    if (isLoading) {
      return (
        <div className="w-full h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-t-ideazzz-purple rounded-full animate-spin"></div>
        </div>
      );
    }

    if (figures.length === 0) {
      return (
        <div className="w-full h-64 flex items-center justify-center text-center">
          <p className="text-muted-foreground">No public figures available</p>
        </div>
      );
    }

    return (
      <div className="relative overflow-hidden w-full h-[400px]">
        {figures.map((figure, index) => (
          <div
            key={figure.id}
            className="absolute w-full h-full transform transition-all duration-1000 will-change-transform"
            style={{
              transform: `translateX(${(index - activeIndex) * 100}%)`,
              opacity: index === activeIndex ? 1 : 0.3,
              zIndex: index === activeIndex ? 10 : 1,
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-lg">
              <Image
                src={figure.imageurl}
                alt={figure.name}
                className="w-full h-full object-cover"
                loading="lazy"
                width={800}
                height={400}
                onError={(e) => {
                  // Fallback image on error
                  (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=Image+Not+Found";
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-white font-semibold text-xl">{figure.name}</h3>
              </div>
            </div>
          </div>
        ))}
        
        {/* Navigation dots */}
        {figures.length > 1 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
            {figures.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === activeIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }, [figures, activeIndex, isLoading]);

  return (
    <div className="w-full">
      {sliderContent}
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default React.memo(OptimizedPublicFiguresSlider);
