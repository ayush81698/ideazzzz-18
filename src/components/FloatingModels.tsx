
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
  backgroundImage?: string;
  rotateOnScroll?: boolean;
}

const FloatingModels: React.FC<FloatingModelsProps> = ({ 
  models = [], 
  backgroundImage,
  rotateOnScroll = true
}) => {
  const isMobile = useIsMobile();
  const [scrollY, setScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedModels, setLoadedModels] = useState<Set<string>>(new Set());
  
  useEffect(() => {
    const handleScroll = () => {
      // Use requestAnimationFrame for smoother scroll handling
      requestAnimationFrame(() => {
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
  
  // Default models if none provided
  const defaultModels: FloatingModel[] = [
    {
      id: 'model1',
      url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      position: {
        top: isMobile ? '15%' : '20%',
        left: isMobile ? '5%' : '15%',
      },
      scale: isMobile ? '0.4 0.4 0.4' : '1 1 1',
      rotationAxis: 'y',
      initialRotation: '45deg',
      zIndex: 3,
      angleX: '10deg',
      angleY: '45deg',
      angleZ: '5deg'
    },
    {
      id: 'model2',
      url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      position: {
        top: isMobile ? '5%' : '10%',
        right: isMobile ? '40%' : '80%',
      },
      scale: isMobile ? '0.3 0.3 0.3' : '0.4 0.4 0.4',
      rotationAxis: 'y',
      initialRotation: '180deg',
      zIndex: 2,
      angleX: '0deg',
      angleY: '-30deg',
      angleZ: '0deg'
    },
    {
      id: 'model3',
      url: 'https://modelviewer.dev/shared-assets/models/NeilArmstrong.glb',
      position: {
        bottom: isMobile ? '15%' : '20%',
        right: isMobile ? '20%' : '30%',
      },
      scale: isMobile ? '0.2 0.2 0.2' : '0.3 0.3 0.3',
      rotationAxis: 'y',
      initialRotation: '90deg',
      zIndex: 1,
      angleX: '-5deg',
      angleY: '120deg',
      angleZ: '0deg'
    }
  ];
  
  const displayModels = models.length > 0 ? models : defaultModels;

  return (
    <div 
      className="absolute inset-0 overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
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
          rotationMultiplier={0.05} // Reduced for smoother rotation
          height={isMobile ? "55%" : "65%"}
          width={isMobile ? "55%" : "45%"}
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
