
import React, { useEffect, useState, useRef } from 'react';
import Spline from '@splinetool/react-spline';
import { Skeleton } from '@/components/ui/skeleton';

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
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;
  const splineRef = useRef<any>(null);
  
  // Known working fallback models
  const fallbackModels = [
    'https://prod.spline.design/WorDEPrxYHiC4pAl/scene.splinecode',
    'https://prod.spline.design/zBE88NNswGCLp5LL/scene.splinecode'
  ];
  
  useEffect(() => {
    setLoadFailed(false);
    setRetryCount(0);
    
    return () => {
      // Clean up any resources when component unmounts
      if (splineRef.current) {
        try {
          // Attempt to clean up Spline instance
          splineRef.current = null;
        } catch (error) {
          console.error("Error cleaning up Spline:", error);
        }
      }
    };
  }, [scene]);

  const handleLoad = (splineApp: any) => {
    console.log("Spline model loaded successfully");
    splineRef.current = splineApp;
    
    // Apply any options if provided
    if (options?.autoRotate && splineApp) {
      try {
        // Auto-rotation could be implemented here if needed
      } catch (err) {
        console.warn("Could not apply auto-rotation:", err);
      }
    }
    
    if (onLoad) onLoad();
  };

  const handleError = (error: any) => {
    console.error("Error loading Spline model:", error);
    
    // If we haven't exceeded retry attempts, try with a fallback model
    if (retryCount < maxRetries) {
      console.log(`Retrying with fallback model #${retryCount + 1}`);
      setRetryCount(prev => prev + 1);
      // Let the parent component know there was an issue
      if (onError) onError(error instanceof Error ? error : new Error('Failed to load model, trying fallback'));
    } else {
      setLoadFailed(true);
      if (onError) onError(error instanceof Error ? error : new Error('Failed to load model after multiple attempts'));
    }
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

  // If we're on a retry attempt, use a fallback model
  const currentScene = retryCount > 0 && fallbackModels[retryCount - 1] ? 
    fallbackModels[retryCount - 1] : scene;

  // Add error boundary by wrapping Spline in a try-catch
  try {
    return (
      <Spline 
        scene={currentScene} 
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
