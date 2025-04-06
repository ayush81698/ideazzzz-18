
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import './PublicFiguresSlider.css';

interface PublicFigure {
  id: string;
  name: string;
  imageurl: string;
  subtitle?: string;
  description?: string;
  order?: number;
}

const PublicFiguresSlider: React.FC = () => {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  
  // Fetch public figures from Supabase
  useEffect(() => {
    const fetchFigures = async () => {
      try {
        const { data, error } = await supabase
          .from('public_figures')
          .select('*')
          .order('order', { ascending: true });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setFigures(data);
        } else {
          // Fallback data if no figures are found
          setFigures([
            {
              id: '1',
              name: 'Emma Johnson',
              imageurl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
              subtitle: 'Fashion Icon',
              description: 'Collaborated on custom jewelry models'
            },
            {
              id: '2',
              name: 'Michael Chen',
              imageurl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
              subtitle: 'Tech Entrepreneur',
              description: 'Created 3D printed prototype series'
            },
            {
              id: '3',
              name: 'Sarah Williams',
              imageurl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
              subtitle: 'Artist & Designer',
              description: 'Custom art installation pieces'
            },
            {
              id: '4',
              name: 'David Rodriguez',
              imageurl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
              subtitle: 'Film Director',
              description: 'Movie prop replicas'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching public figures:', error);
        setFigures([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFigures();
  }, []);

  // Handle swipe/click for mobile
  useEffect(() => {
    if (isMobile && figures.length > 0) {
      const interval = setInterval(() => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % figures.length);
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isMobile, figures.length]);

  const handleCardClick = (index: number) => {
    if (isMobile) {
      setActiveIndex(index);
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-900 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-ideazzz-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-16 overflow-hidden bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
          Public Figures We Worked With 
        </h2>
        
        {isMobile ? (
          <div className="w-full max-w-md mx-auto">
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl shadow-xl">
              {figures.map((figure, index) => (
                <div 
                  key={figure.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${figure.imageurl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                  onClick={() => handleCardClick(index)}
                >
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{figure.name}</h3>
                    {figure.subtitle && (
                      <p className="text-sm opacity-90 mb-2">{figure.subtitle}</p>
                    )}
                    {figure.description && (
                      <p className="text-sm opacity-75">{figure.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 space-x-2">
              {figures.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === activeIndex ? 'bg-ideazzz-purple' : 'bg-gray-400'
                  }`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="general-container mx-auto w-full md:w-4/5 lg:w-3/4 xl:w-2/3 h-auto md:h-[21rem] flex flex-col md:flex-row">
            {figures.map((figure, index) => (
              <React.Fragment key={figure.id}>
                <input 
                  className="radio" 
                  type="radio" 
                  name="card" 
                  id={`card${index}`} 
                  defaultChecked={index === 0} 
                />
                <label 
                  className="content md:flex-1 mb-4 md:mb-0 md:mr-2 relative rounded-3xl overflow-hidden cursor-pointer transition-all" 
                  htmlFor={`card${index}`}
                  style={{
                    backgroundImage: `url(${figure.imageurl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}
                >
                  <h1 className="title-card">
                    <span className="marg-bott font-bold text-lg md:text-xl lg:text-2xl">
                      {figure.name}
                    </span>
                    {figure.subtitle && (
                      <span className="subtitle text-sm md:text-base">
                        {figure.subtitle}
                      </span>
                    )}
                  </h1>
                  {figure.description && (
                    <h3 className="card-title subsubtitle">
                      <span>{figure.description}</span>
                    </h3>
                  )}
                </label>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(PublicFiguresSlider);
