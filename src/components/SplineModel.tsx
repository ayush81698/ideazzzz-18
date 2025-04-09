
import React, { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';

interface SplineModelProps {
  scene: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

const SplineModel: React.FC<SplineModelProps> = ({ scene, onLoad, onError }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
    return () => {
      // Clean up any resources when component unmounts
    };
  }, [scene]);

  const handleLoad = () => {
    console.log("Spline model loaded successfully:", scene);
    if (onLoad) onLoad();
  };

  const handleError = (error: any) => {
    console.error("Error loading Spline model:", error);
    setHasError(true);
    if (onError) onError(error instanceof Error ? error : new Error('Failed to load model'));
  };

  // If we've already tried and failed to load the model, don't try again
  if (hasError) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-black/5 text-sm text-muted-foreground p-4">
        Unable to load 3D model
      </div>
    );
  }

  return (
    <Spline 
      scene={scene} 
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

export default SplineModel;
