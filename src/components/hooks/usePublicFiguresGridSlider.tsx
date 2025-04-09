import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { PublicFigure } from '@/types/models';

export const usePublicFiguresGridSlider = ({ 
  publicFigures, 
  currentIndex, 
  setCurrentIndex 
}: {
  publicFigures: PublicFigure[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}) => {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [figuresGalleries, setFiguresGalleries] = useState<PublicFigure[][]>([]);
  const [showGrid, setShowGrid] = useState(false);
  
  // Use the passed publicFigures if provided
  useEffect(() => {
    if (publicFigures && publicFigures.length > 0) {
      setFigures(publicFigures);
    } else {
      fetchFigures();
    }
  }, [publicFigures]);
  
  // Fetch public figures from Supabase if not provided
  const fetchFigures = async () => {
    try {
      const { data, error } = await supabase
        .from('public_figures')
        .select('*');
          
      if (error) throw error;
      
      if (data && data.length > 0) {
        setFigures(data);
      }
    } catch (error) {
      console.error('Error fetching public figures:', error);
      setFigures([]);
    }
  };

  // Create galleries with different ordering of figures
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
    const gallery2 = [...extendedFigures].reverse();
    
    // Shift the second gallery to ensure different figures appear in parallel positions
    if (gallery2.length > 3) {
      // Take first few items and push them to the end
      const firstItems = gallery2.splice(0, 3);
      gallery2.push(...firstItems);
    }
    
    setFiguresGalleries([gallery1, gallery2]);
  }, [figures]);

  // The GridView component that shows all public figures
  const GridView = () => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-90 p-4 overflow-auto"
      >
        <div className="container mx-auto py-8">
          <h2 className="text-3xl font-bold mb-8 text-white text-center">All Public Figures</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {publicFigures.map((figure, index) => (
              <div 
                key={figure.id} 
                className="cursor-pointer"
                onClick={() => {
                  setCurrentIndex(index);
                  setShowGrid(false);
                }}
              >
                <div className="relative aspect-square overflow-hidden rounded-lg mb-2">
                  <img 
                    src={figure.imageurl} 
                    alt={figure.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-white font-medium text-sm md:text-base">{figure.name}</h3>
                {figure.subtitle && (
                  <p className="text-gray-400 text-xs md:text-sm">{figure.subtitle}</p>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button
              onClick={() => setShowGrid(false)}
              className="bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    );
  };

  return { figures, figuresGalleries, GridView, showGrid, setShowGrid };
};
