
import React, { useEffect, useRef, useState, memo } from 'react';
import ModelViewer from './ModelViewer';

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

// This component efficiently renders 3D models around the page
const FloatingModels: React.FC<FloatingModelsProps> = ({ 
  models, 
  rotateOnScroll = false,
  singleModelMode = false
}) => {
  const [scrollY, setScrollY] = useState(0);
  const [modelsToShow, setModelsToShow] = useState<FloatingModel[]>([]);
  const [hasError, setHasError] = useState(false);
  const requestRef = useRef<number | null>(null);
  
  // On mount, determine how many models to load based on device performance
  useEffect(() => {
    try {
      // Only show one model or a subset on low-end devices to improve performance
      if (singleModelMode || window.navigator.hardwareConcurrency <= 4) {
        setModelsToShow(models.slice(0, 1));
      } else {
        setModelsToShow(models);
      }
    } catch (err) {
      console.error('Error in FloatingModels:', err);
      setHasError(true);
      setModelsToShow([]);
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [models, singleModelMode]);
  
  // If we have errors or no models, don't render anything
  if (hasError || modelsToShow.length === 0) {
    return null;
  }
  
  // Use requestAnimationFrame for smooth scrolling
  const handleScroll = () => {
    if (rotateOnScroll) {
      requestRef.current = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    }
  };
  
  // Only add scroll listener if rotate on scroll is enabled
  useEffect(() => {
    if (rotateOnScroll) {
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('scroll', handleScroll);
        if (requestRef.current) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [rotateOnScroll]);
  
  return (
    <>
      {modelsToShow.map((model) => (
        <ModelViewer
          key={model.id}
          modelUrl={model.url}
          position="fixed"
          top={model.position.top}
          left={model.position.left}
          right={model.position.right}
          bottom={model.position.bottom}
          scale={model.scale}
          rotationAxis={model.rotationAxis}
          initialRotation={model.initialRotation}
          zIndex={model.zIndex}
          rotateOnScroll={rotateOnScroll}
          scrollY={scrollY}
          angleX={model.angleX}
          angleY={model.angleY}
          angleZ={model.angleZ}
        />
      ))}
    </>
  );
};

export default memo(FloatingModels);
