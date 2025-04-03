
import React, { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface SplineModelProps {
  scene: string;
  className?: string;
  performance?: boolean;
  quality?: 'high' | 'medium' | 'low';
}

const SplineModel: React.FC<SplineModelProps> = ({ 
  scene, 
  className, 
  performance = false,
  quality = 'medium'
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progressValue, setProgressValue] = useState(10);
  const [retryCount, setRetryCount] = useState(0);
  const isMobile = useIsMobile();
  
  const handleLoad = () => {
    setLoading(false);
    setError(null);
    console.log('Spline model loaded successfully');
  };
  
  const handleError = (err: Error) => {
    console.error('Error loading Spline model:', err);
    setError(err);
    setLoading(false);
    
    // Show toast only on first error to avoid spamming
    if (retryCount === 0) {
      toast.error('Failed to load 3D model', {
        description: 'Showing fallback content instead',
      });
    }
  };

  // Auto-retry loading with reduced quality on error
  useEffect(() => {
    if (error && retryCount < 2) {
      const timer = setTimeout(() => {
        console.log(`Retrying Spline load (attempt ${retryCount + 1})...`);
        setLoading(true);
        setError(null);
        setRetryCount(prev => prev + 1);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  useEffect(() => {
    // Simulate loading progress
    if (loading && !error) {
      const interval = setInterval(() => {
        setProgressValue((prev) => {
          const newValue = prev + Math.floor(Math.random() * 15);
          return newValue > 90 ? 90 : newValue;
        });
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [loading, error]);

  // Quality settings for different levels
  const getQualitySettings = () => {
    // Use lowest quality on mobile or after failed attempts
    if (isMobile || retryCount > 0) {
      return {
        performance: 'economy',
        quality: 'preview',
        enableRoughness: false,
        enableRendezvousScaling: true,
        downgradeWhenHidden: true,
        downgradeDeviceTarget: 2,
      };
    }
    
    // Desktop quality settings
    switch (quality) {
      case 'high':
        return {
          performance: performance ? 'balanced' : 'default',
          enableRendezvousScaling: false,
        };
      case 'low':
        return {
          performance: 'economy',
          quality: 'preview',
          enableRoughness: false,
          enableRendezvousScaling: true,
          downgradeWhenHidden: true,
        };
      case 'medium':
      default:
        return {
          performance: performance ? 'economy' : 'balanced',
          enableRendezvousScaling: true,
        };
    }
  };

  const qualitySettings = getQualitySettings();

  // If we've tried multiple times and still have errors, show static fallback
  if (!loading && error && retryCount >= 2) {
    return (
      <div className={`bg-gradient-to-br from-ideazzz-purple/10 to-ideazzz-pink/10 ${className} flex flex-col items-center justify-center`}>
        <AlertCircle className="h-12 w-12 text-gray-400 mb-2" />
        <p className="text-center text-gray-500">Unable to load 3D model</p>
        <img 
          src="/fallback-image.jpg" 
          alt="3D Model Fallback" 
          className="w-full h-full object-cover opacity-50 mt-4" 
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-50">
          <div className="text-white mb-4">Loading 3D Model{retryCount > 0 ? ` (Retry ${retryCount})` : ''}...</div>
          <Progress value={progressValue} className="w-64 h-2" />
        </div>
      )}
      <div className="h-full">
        {!error && (
          <Spline 
            scene={scene} 
            onLoad={handleLoad}
            onError={handleError}
            style={{ width: '100%', height: '100%' }}
            {...qualitySettings}
          />
        )}
      </div>
    </div>
  );
};

export default SplineModel;
