
import React, { useState, useEffect } from 'react';
import SplineModel from './SplineModel';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

interface ModelViewerProps {
  modelUrl?: string | null;
  width?: string;
  height?: string;
  className?: string;
  autoRotate?: boolean;
  cameraControls?: boolean;
  backgroundAlpha?: number;
  fieldOfView?: string;
  exposure?: string;
  scale?: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  width = '100%',
  height = '100%',
  className = '',
  // Additional props with defaults
  autoRotate = false, 
  cameraControls = true,
  backgroundAlpha = 1,
  fieldOfView = '50deg',
  exposure = '1',
  scale = '1'
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

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
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
