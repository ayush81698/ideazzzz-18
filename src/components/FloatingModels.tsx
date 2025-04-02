import React from 'react';

export interface FloatingModel {
  id: string;
  url: string;
  position: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
  };
  scale: string;
  rotationAxis: 'x' | 'y' | 'z';
  initialRotation: string;
  zIndex: number;
  angleX?: string;
  angleY?: string;
  angleZ?: string;
}

interface FloatingModelsProps {
  models: FloatingModel[];
  rotateOnScroll?: boolean;
  singleModelMode?: boolean;
}

// This component has been simplified to not render any models to improve performance
const FloatingModels: React.FC<FloatingModelsProps> = () => {
  return null;
};

export default FloatingModels;
