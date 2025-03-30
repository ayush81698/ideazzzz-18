
import React, { useEffect, useState } from 'react';
import ModelViewer from './ModelViewer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Progress } from '@/components/ui/progress';

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
  singleModelMode?: boolean; // New prop to enable single model mode
}

const FloatingModels: React.FC<FloatingModelsProps> = ({ 
  models = [], 
  rotateOnScroll = true,
  singleModelMode = false
}) => {
  const isMobile = useIsMobile();
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedModels, setLoadedModels] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const handleScroll = () => {
      // Limit scroll updates for smoother performance
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
      });
    };
    
    if (rotateOnScroll) {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    return () => {
      if (rotateOnScroll) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [rotateOnScroll]);

  useEffect(() => {
    if (loadedModels.size === models.length && models.length > 0) {
      setIsLoading(false);
    }
  }, [loadedModels, models]);

  // Handle model load events
  const handleModelLoad = (modelId: string) => {
    setLoadedModels(prev => {
      const newSet = new Set(prev);
      newSet.add(modelId);
      return newSet;
    });
  };

  // For single model mode, we only show the first model
  const displayModels = singleModelMode && models.length > 0 ? [models[0]] : models;
  
  // Single model position for homepage
  const getSingleModelProps = () => {
    return {
      position: 'absolute',
      right: isMobile ? '0' : '0',
      top: isMobile ? '20%' : '10%',
      height: isMobile ? '70%' : '80%',
      width: isMobile ? '100%' : '50%',
      zIndex: 0
    };
  };

  return (
    <div className={`absolute inset-0 ${singleModelMode ? 'pointer-events-none' : ''} overflow-hidden`}>
      {isLoading && displayModels.length > 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-50">
          <div className="text-white mb-4">Loading 3D Model...</div>
          <Progress 
            value={Math.round((loadedModels.size / displayModels.length) * 100)} 
            className="w-64 h-2"
          />
        </div>
      )}

      {displayModels.map((model) => (
        <ModelViewer
          key={model.id}
          modelUrl={model.url}
          position="absolute"
          top={singleModelMode ? undefined : model.position.top}
          left={singleModelMode ? undefined : model.position.left}
          right={singleModelMode ? getSingleModelProps().right : model.position.right}
          bottom={singleModelMode ? undefined : model.position.bottom}
          scale={model.scale}
          zIndex={singleModelMode ? getSingleModelProps().zIndex : model.zIndex}
          rotationAxis={model.rotationAxis}
          initialRotation={model.initialRotation}
          rotateOnScroll={rotateOnScroll}
          scrollY={scrollY}
          autoRotate={false}
          cameraControls={false}
          backgroundAlpha={0}
          rotationMultiplier={0.005} // Reduced for smoother rotation
          height={singleModelMode ? getSingleModelProps().height : (isMobile ? "60%" : "70%")}
          width={singleModelMode ? getSingleModelProps().width : (isMobile ? "60%" : "50%")}
          angleX={model.angleX}
          angleY={model.angleY}
          angleZ={model.angleZ}
          onModelLoad={() => handleModelLoad(model.id)}
        />
      ))}
    </div>
  );
};

export default FloatingModels;
