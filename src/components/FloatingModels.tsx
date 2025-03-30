
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
}

const FloatingModels: React.FC<FloatingModelsProps> = ({ 
  models = [], 
  rotateOnScroll = true
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
  
  // Default models if none provided - ensuring different angles
  const defaultModels: FloatingModel[] = [
    {
      id: 'model1',
      url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      position: {
        top: isMobile ? '25%' : '30%',
        left: isMobile ? '5%' : '15%',
      },
      scale: isMobile ? '0.4 0.4 0.4' : '0.7 0.7 0.7',
      rotationAxis: 'y',
      initialRotation: '45deg',
      zIndex: 3,
      angleX: '10deg',
      angleY: '45deg',
      angleZ: '0deg'
    },
    {
      id: 'model2',
      url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      position: {
        top: isMobile ? '15%' : '20%',
        right: isMobile ? '5%' : '15%',
      },
      scale: isMobile ? '0.3 0.3 0.3' : '0.6 0.6 0.6',
      rotationAxis: 'y',
      initialRotation: '180deg',
      zIndex: 2,
      angleX: '0deg',
      angleY: '-45deg',
      angleZ: '0deg'
    },
    {
      id: 'model3',
      url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      position: {
        bottom: isMobile ? '15%' : '20%',
        left: isMobile ? '30%' : '40%',
      },
      scale: isMobile ? '0.35 0.35 0.35' : '0.65 0.65 0.65',
      rotationAxis: 'x',
      initialRotation: '30deg',
      zIndex: 1,
      angleX: '30deg',
      angleY: '0deg',
      angleZ: '0deg'
    }
  ];
  
  const displayModels = models.length > 0 ? models : defaultModels;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {isLoading && displayModels.length > 0 && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-50">
          <div className="text-white mb-4">Loading 3D Models...</div>
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
          top={model.position.top}
          left={model.position.left}
          right={model.position.right}
          bottom={model.position.bottom}
          scale={model.scale}
          zIndex={model.zIndex}
          rotationAxis={model.rotationAxis}
          initialRotation={model.initialRotation}
          rotateOnScroll={rotateOnScroll}
          scrollY={scrollY}
          autoRotate={false}
          cameraControls={false}
          backgroundAlpha={0}
          rotationMultiplier={0.01} // Reduced for smoother rotation
          height={isMobile ? "60%" : "70%"}
          width={isMobile ? "60%" : "50%"}
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
