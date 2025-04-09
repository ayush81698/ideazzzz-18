
import React, { useState, useEffect } from 'react';
import SplineModel from './SplineModel';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

interface ModelViewerProps {
  modelUrl?: string | null;
  width?: string;
  height?: string;
  className?: string;
  position?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  scale?: string;
  rotationAxis?: 'x' | 'y' | 'z';
  initialRotation?: string;
  zIndex?: number;
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
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  width = '100%',
  height = '100%',
  className = '',
  position,
  top,
  left,
  right,
  bottom,
  scale,
  rotationAxis,
  initialRotation,
  zIndex,
  rotateOnScroll,
  scrollY,
  angleX,
  angleY,
  angleZ,
  autoRotate,
  cameraControls,
  backgroundAlpha,
  fieldOfView,
  exposure,
}) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [modelError, setModelError] = useState<string | null>(null);
  // Using reliable fallback model URLs
  const fallbackModelUrls = [
    'https://prod.spline.design/WorDEPrxYHiC4pAl/scene.splinecode',
    'https://prod.spline.design/zBE88NNswGCLp5LL/scene.splinecode'
  ];
  const [currentModelUrl, setCurrentModelUrl] = useState<string>(modelUrl || fallbackModelUrls[0]);

  useEffect(() => {
    setLoading(true);
    setProgress(0);
    setModelError(null);
    
    if (modelUrl) {
      setCurrentModelUrl(modelUrl);
    }

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
    
    // If the current model URL is already a fallback, try the next one
    if (currentModelUrl !== modelUrl && fallbackModelUrls.includes(currentModelUrl)) {
      const currentIndex = fallbackModelUrls.indexOf(currentModelUrl);
      if (currentIndex < fallbackModelUrls.length - 1) {
        // Try next fallback
        setCurrentModelUrl(fallbackModelUrls[currentIndex + 1]);
        return;
      }
    }
    
    // If we're already using the original URL or have tried all fallbacks
    if (currentModelUrl === modelUrl) {
      // First try with a fallback
      setCurrentModelUrl(fallbackModelUrls[0]);
    } else {
      // Show error if all fallbacks have been tried
      setModelError('Failed to load 3D model');
      setLoading(false);
    }
  };

  // Prepare model options from props
  const modelOptions = {
    rotationAxis,
    initialRotation,
    rotateOnScroll,
    scrollY,
    angleX,
    angleY,
    angleZ,
    autoRotate,
    cameraControls,
    backgroundAlpha,
    fieldOfView,
    exposure
  };

  return (
    <div 
      className={`relative ${className}`} 
      style={{ 
        width, 
        height,
        position: position as any,
        top,
        left,
        right,
        bottom,
        zIndex
      }}
    >
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
      
      <div style={{ 
        opacity: loading ? 0 : 1, 
        transition: 'opacity 0.5s ease',
        transform: scale ? `scale(${scale})` : undefined,
      }}>
        <SplineModel
          scene={currentModelUrl}
          onLoad={handleModelLoad}
          onError={handleModelError}
          options={modelOptions}
        />
      </div>
    </div>
  );
};

export default ModelViewer;
