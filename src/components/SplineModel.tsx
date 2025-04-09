
import React, { useEffect, useState } from 'react';
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
  const [loadFailed, setLoadFailed] = useState(false);
  
  useEffect(() => {
    setLoadFailed(false);
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
    setLoadFailed(true);
    if (onError) onError(error instanceof Error ? error : new Error('Failed to load model'));
  };

  // If the model fails to load, display a fallback or error message
  if (loadFailed) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-indigo-900/50">
        <div className="text-center p-4">
          <p className="text-white text-lg">Unable to load 3D model</p>
          <p className="text-white/60 text-sm mt-2">Try refreshing the page</p>
        </div>
      </div>
    );
  }

  // Add error boundary by wrapping Spline in a try-catch
  try {
    return (
      <Spline 
        scene={scene} 
        onLoad={handleLoad}
        onError={handleError}
      />
    );
  } catch (error) {
    console.error("Error rendering Spline component:", error);
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/50 to-indigo-900/50">
        <div className="text-center p-4">
          <p className="text-white text-lg">Unable to load 3D model</p>
          <p className="text-white/60 text-sm mt-2">Try refreshing the page</p>
        </div>
      </div>
    );
  }
};

export default SplineModel;
