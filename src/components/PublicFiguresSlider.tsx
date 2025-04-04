
import React from 'react';
import { usePublicFiguresGridSlider } from './hooks/usePublicFiguresGridSlider';

const PublicFiguresSlider: React.FC = () => {
  const { figuresGalleries } = usePublicFiguresGridSlider();
  
  return (
    <section className="py-16 overflow-hidden bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
          Public Figures We Worked With
        </h2>
        
        <div className="figures-wrapper">
          {figuresGalleries.map((gallery, galleryIndex) => (
            <div 
              key={`gallery-${galleryIndex}`} 
              className="figures-gallery"
              style={{ '--i': galleryIndex } as React.CSSProperties}
            >
              {gallery.map((figure, index) => (
                <div 
                  key={`figure-${figure.id}-${index}`} 
                  className="figure-item"
                >
                  <div>
                    <img
                      src={figure.imageurl}
                      alt={figure.name}
                      loading="lazy"
                    />
                    <h3 className="figure-name">{figure.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default React.memo(PublicFiguresSlider);
