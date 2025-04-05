
import React from 'react';
import ImageCollage from './ImageCollage';

// This component now uses the ImageCollage component instead of the slider
const PublicFiguresSlider: React.FC = () => {
  return <ImageCollage />;
};

export default React.memo(PublicFiguresSlider);
