
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { Image } from '@/components/ui/image';

interface PublicFigure {
  id: string;
  name: string;
  imageurl: string;
}

const ImageCollage: React.FC = () => {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Fetch public figures from Supabase
  useEffect(() => {
    const fetchFigures = async () => {
      try {
        const { data, error } = await supabase
          .from('public_figures')
          .select('*');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          // Double the data to have more images for the collage
          setFigures([...data, ...data]);
        } else {
          // Fallback data if no figures are found
          const fallbackData = [
            {
              id: '1',
              name: 'Emma Johnson',
              imageurl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
            },
            {
              id: '2',
              name: 'Michael Chen',
              imageurl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
            },
            {
              id: '3',
              name: 'Sarah Williams',
              imageurl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
            },
            {
              id: '4',
              name: 'David Rodriguez',
              imageurl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
            },
            {
              id: '5',
              name: 'Aisha Patel',
              imageurl: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
            }
          ];
          // Double the fallback data as well
          setFigures([...fallbackData, ...fallbackData]);
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
          Our recent projects 
        </h2>
        
        <div className="image-collage">
          {figures.map((figure, index) => (
            <motion.div 
              key={`${figure.id}-${index}`}
              className="image-item"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5,
                delay: index * 0.05,
                ease: 'easeOut'
              }}
              whileHover={{ 
                scale: 1.05, 
                zIndex: 10,
                transition: { duration: 0.2 } 
              }}
              style={{
                // Generate random positions within the collage
                left: `${Math.random() * 80}%`,
                top: `${Math.random() * 70}%`,
                // Random rotation between -15 and 15 degrees
                rotate: `${Math.random() * 30 - 15}deg`,
                // Random z-index for layering effect
                zIndex: Math.floor(Math.random() * 5) + 1
              }}
            >
              <div className="relative w-40 h-40 md:w-56 md:h-56 overflow-hidden rounded-md shadow-lg">
                <Image
                  src={figure.imageurl}
                  alt={figure.name}
                  loading="lazy"
                  objectFit="cover"
                  className="w-full h-full transform transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-3">
                  <h3 className="text-white text-sm md:text-base font-medium">
                    {figure.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImageCollage;
