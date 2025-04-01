
import React, { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Progress } from '@/components/ui/progress';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const [progressValue, setProgressValue] = useState(10);
  const isMobile = useIsMobile();
  
  const handleLoad = () => {
    setLoading(false);
  };

  useEffect(() => {
    // Simulate loading progress
    if (loading) {
      const interval = setInterval(() => {
        setProgressValue((prev) => {
          const newValue = prev + Math.floor(Math.random() * 15);
          return newValue > 90 ? 90 : newValue;
        });
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Quality settings for different levels
  const getQualitySettings = () => {
    // Always use low quality on mobile
    if (isMobile) {
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

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-50">
          <div className="text-white mb-4">Loading 3D Model...</div>
          <Progress value={progressValue} className="w-64 h-2" />
        </div>
      )}
      <Spline 
        scene={scene} 
        onLoad={handleLoad} 
        style={{ width: '100%', height: '100%' }}
        {...qualitySettings}
      />
    </div>
  );
};

export default SplineModel;
