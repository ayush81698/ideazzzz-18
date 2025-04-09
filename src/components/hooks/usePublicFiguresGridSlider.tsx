
import React from 'react';
import { motion } from 'framer-motion';
import { PublicFigure } from '@/types/models';

interface UsePublicFiguresGridSliderProps {
  publicFigures: PublicFigure[];
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
}

export function usePublicFiguresGridSlider({
  publicFigures,
  currentIndex,
  setCurrentIndex
}: UsePublicFiguresGridSliderProps) {
  
  // Create a Grid View component inside this hook
  const GridView = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 overflow-y-auto"
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-white mb-8">All Public Figures</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {publicFigures.map((figure, idx) => (
            <motion.div
              key={figure.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                scale: currentIndex === idx ? 1.05 : 1,
                borderColor: currentIndex === idx ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.2)"
              }}
              transition={{
                duration: 0.3,
                delay: idx * 0.05
              }}
              className="bg-black/50 rounded-lg overflow-hidden border-2 border-white/20 cursor-pointer"
              onClick={() => {
                setCurrentIndex(idx);
              }}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={figure.imageurl} 
                  alt={figure.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-110"
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold">{figure.name}</h3>
                {figure.subtitle && (
                  <p className="text-sm text-gray-300 mt-1">{figure.subtitle}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Return needed data and components
  return {
    GridView
  };
}
