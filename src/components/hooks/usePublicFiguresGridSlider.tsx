
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PublicFigure } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';

interface UsePublicFiguresGridSliderProps {
  publicFigures: PublicFigure[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export const usePublicFiguresGridSlider = ({ 
  publicFigures,
  currentIndex,
  setCurrentIndex
}: UsePublicFiguresGridSliderProps) => {
  const [showGrid, setShowGrid] = useState(false);
  
  const GridView = () => {
    if (!showGrid) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black bg-opacity-70 flex items-center justify-center p-4 md:p-8 overflow-auto"
        onClick={() => setShowGrid(false)}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full max-w-7xl max-h-full overflow-y-auto p-4 bg-black bg-opacity-50 rounded-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {publicFigures.map((figure, index) => (
            <div 
              key={figure.id + index} 
              className={`relative rounded-lg overflow-hidden cursor-pointer transition-all duration-300 ${
                currentIndex === index ? 'ring-4 ring-white' : ''
              }`}
              onClick={() => {
                setCurrentIndex(index);
                setShowGrid(false);
              }}
            >
              <img 
                src={figure.imageurl} 
                alt={figure.name} 
                className="w-full h-40 md:h-48 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent flex flex-col justify-end p-2">
                <h3 className="text-white text-sm md:text-base font-bold truncate">
                  {figure.name}
                </h3>
                {figure.subtitle && (
                  <p className="text-gray-200 text-xs truncate">
                    {figure.subtitle}
                  </p>
                )}
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    );
  };

  return {
    GridView,
    showGrid,
    setShowGrid
  };
};
