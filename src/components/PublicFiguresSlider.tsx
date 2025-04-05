
import React from 'react';
import { usePublicFiguresGridSlider } from './hooks/usePublicFiguresGridSlider';
import { Image } from '@/components/ui/image';

const PublicFiguresSlider: React.FC = () => {
  const { figures } = usePublicFiguresGridSlider();
  
  return (
    <section className="py-12 overflow-hidden bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
          Our recent projects 
        </h2>
        
        <div className="figures-grid-wrapper">
          <div className="figures-gallery slide-right">
            {figures.map((figure, index) => (
              <div 
                key={`figure-${figure.id}-${index}`} 
                className="figure-item"
              >
                <div className="figure-container">
                  <Image
                    src={figure.imageurl}
                    alt={figure.name}
                    loading="lazy"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                  <h3 className="figure-name">{figure.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(PublicFiguresSlider);
