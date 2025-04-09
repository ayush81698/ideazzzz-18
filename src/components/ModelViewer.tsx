
import React, { useState, useEffect } from 'react';
import SplineModel from './SplineModel';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

interface ModelViewerProps {
  modelUrl?: string | null;
  width?: string;
  height?: string;
  className?: string;
  // Add missing props from errors
  position?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  scale?: string;
  rotationAxis?: 'x' | 'y' | 'z';
  initialRotation?: string;
  zIndex?: number;
  angleX?: string;
  angleY?: string;
  angleZ?: string;
  rotateOnScroll?: boolean;
  scrollY?: number;
  autoRotate?: boolean;
  cameraControls?: boolean;
  backgroundAlpha?: number;
  fieldOfView?: string;
  exposure?: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  width = '100%',
  height = '100%',
  className = '',
  // Add remaining props with defaults
  position,
  top,
  left,
  right,
  bottom,
  scale,
  zIndex,
  // Default values for the rest
  rotationAxis,
  initialRotation,
  angleX,
  angleY,
  angleZ,
  rotateOnScroll,
  scrollY,
  autoRotate,
  cameraControls,
  backgroundAlpha,
  fieldOfView,
  exposure
}) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [modelError, setModelError] = useState<string | null>(null);
  const fallbackModelUrl = 'https://prod.spline.design/8JkST9hQpUjRqFjD/scene.splinecode';

  useEffect(() => {
    setLoading(true);
    setProgress(0);
    setModelError(null);

    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        // Slow down as we get closer to 100%
        const increment = prevProgress < 50 ? 5 : prevProgress < 80 ? 3 : 1;
        const newProgress = Math.min(prevProgress + increment, 95);
        return newProgress;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, [modelUrl]);

  const handleModelLoad = () => {
    // Complete the progress bar
    setProgress(100);
    
    // Add small delay before hiding loading state
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleModelError = (error: Error) => {
    console.error('Error loading model:', error);
    setModelError('Failed to load 3D model');
    setLoading(false);
  };

  // Create inline styles for positioned elements
  const containerStyle: React.CSSProperties = {
    width,
    height,
    position: position as React.CSSProperties['position'] || undefined,
    top: top || undefined,
    left: left || undefined,
    right: right || undefined,
    bottom: bottom || undefined,
    zIndex: zIndex || undefined,
  };

  return (
    <div className={`relative ${className}`} style={containerStyle}>
      {loading && (
        <div className="absolute inset-0 bg-black/5 backdrop-blur-sm flex flex-col items-center justify-center z-10">
          <div className="w-64 space-y-4">
            <div className="text-center mb-2">Loading 3D Model</div>
            <Progress value={progress} className="h-2" />
            <div className="text-center text-sm text-muted-foreground">{progress}%</div>
          </div>
        </div>
      )}
      
      {modelError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/5">
          <div className="bg-destructive/10 border border-destructive text-destructive p-4 rounded-md">
            {modelError}
          </div>
        </div>
      )}
      
      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        <SplineModel
          scene={modelUrl || fallbackModelUrl}
          onLoad={handleModelLoad}
          onError={handleModelError}
        />
      </div>
    </div>
  );
};

export default ModelViewer;
