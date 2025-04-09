
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { PublicFigure } from '@/types/models'; // Using our newly defined interface

interface UsePublicFiguresGridSliderProps {
  publicFigures: PublicFigure[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export const usePublicFiguresGridSlider = (props?: UsePublicFiguresGridSliderProps) => {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [figuresGalleries, setFiguresGalleries] = useState<PublicFigure[][]>([]);
  const [showGrid, setShowGrid] = useState(false);
  
  // Use provided figures if available, otherwise fetch from Supabase
  useEffect(() => {
    if (props?.publicFigures) {
      setFigures(props.publicFigures);
    } else {
      const fetchFigures = async () => {
        try {
          const { data, error } = await supabase
            .from('public_figures')
            .select('*');
            
          if (error) throw error;
          
          if (data && data.length > 0) {
            setFigures(data);
          } else {
            // Fallback data if no figures are found
            setFigures([
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
            ]);
          }
        } catch (error) {
          console.error('Error fetching public figures:', error);
          setFigures([]);
        }
      };
      
      fetchFigures();
    }
  }, [props?.publicFigures]);

  // Create 2 different galleries with different ordering of figures
  useEffect(() => {
    if (figures.length === 0) return;

    // Duplicate figures to ensure we have enough for the display
    const extendedFigures = [...figures];
    
    // Keep duplicating until we have at least 10 figures
    while (extendedFigures.length < 10) {
      extendedFigures.push(...figures);
    }
    
    // Create two galleries with different ordering
    const gallery1 = [...extendedFigures];
    
    // Create a second gallery with a different order
    // We'll reverse the array and shift it to ensure different content appears side by side
    const gallery2 = [...extendedFigures].reverse();
    
    // Shift the second gallery to ensure different figures appear in parallel positions
    if (gallery2.length > 3) {
      // Take first few items and push them to the end
      const firstItems = gallery2.splice(0, 3);
      gallery2.push(...firstItems);
    }
    
    setFiguresGalleries([gallery1, gallery2]);
  }, [figures]);

  // Create the GridView component
  const GridView = () => {
    const figuresData = props?.publicFigures || figures;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 overflow-auto"
      >
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-3xl font-bold text-white mb-8">All Public Figures</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {figuresData.map((figure, index) => (
              <motion.div
                key={figure.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="cursor-pointer"
                onClick={() => {
                  if (props?.setCurrentIndex) {
                    props.setCurrentIndex(index);
                    setShowGrid(false);
                  }
                }}
              >
                <div className="aspect-square overflow-hidden rounded-lg mb-2">
                  <img
                    src={figure.imageurl}
                    alt={figure.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="font-medium text-white">{figure.name}</h3>
                {figure.subtitle && (
                  <p className="text-sm text-gray-300">{figure.subtitle}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  return { figures, figuresGalleries, GridView, showGrid, setShowGrid };
};
