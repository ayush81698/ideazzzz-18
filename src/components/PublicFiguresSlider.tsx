
import React from 'react';
import OptimizedPublicFiguresSlider from './OptimizedPublicFiguresSlider';

const PublicFiguresSlider: React.FC = () => {
  return (
    <section className="py-16 overflow-hidden bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
          Public Figures We Worked With
        </h2>
        
        <OptimizedPublicFiguresSlider />
      </div>
    </section>
  );
};

export default React.memo(PublicFiguresSlider);
