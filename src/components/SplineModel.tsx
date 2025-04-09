
import React, { useEffect } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineModelProps {
  scene: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  options?: {
    rotationAxis?: 'x' | 'y' | 'z';
    initialRotation?: string;
    rotateOnScroll?: boolean;
    scrollY?: number;
    angleX?: string;
    angleY?: string;
    angleZ?: string;
    autoRotate?: boolean;
    cameraControls?: boolean;
    backgroundAlpha?: number;
    fieldOfView?: string;
    exposure?: string;
  };
}

const SplineModel: React.FC<SplineModelProps> = ({ scene, onLoad, onError, options }) => {
  useEffect(() => {
    return () => {
      // Clean up any resources when component unmounts
    };
  }, [scene]);

  const handleLoad = () => {
    console.log("Spline model loaded successfully");
    if (onLoad) onLoad();
  };

  const handleError = (error: any) => {
    console.error("Error loading Spline model:", error);
    if (onError) onError(error instanceof Error ? error : new Error('Failed to load model'));
  };

  return (
    <Spline 
      scene={scene} 
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

export default SplineModel;
