
import React, { useEffect, useState } from 'react';
import ModelViewer from './ModelViewer';
import { useIsMobile } from '@/hooks/use-mobile';

interface Model {
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
  models: Model[];
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
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    if (rotateOnScroll) {
      window.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (rotateOnScroll) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [rotateOnScroll]);
  
  // Default models if none provided
  const defaultModels: Model[] = [
    {
      id: 'model1',
      url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      position: {
        top: '5%',
        right: isMobile ? '10%' : '20%',
      },
      scale: isMobile ? '0.6 0.6 0.6' : '1 1 1',
      rotationAxis: 'y',
      initialRotation: '45deg',
      zIndex: 1,
      angleX: '0deg',
      angleY: '60deg',
      angleZ: '0deg'
    },
    {
      id: 'model2',
      url: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
      position: {
        bottom: '15%',
        left: isMobile ? '5%' : '15%',
      },
      scale: isMobile ? '0.4 0.4 0.4' : '0.7 0.7 0.7',
      rotationAxis: 'y',
      initialRotation: '180deg',
      zIndex: 3,
      angleX: '10deg',
      angleY: '-30deg',
      angleZ: '5deg'
    },
    {
      id: 'model3',
      url: 'https://modelviewer.dev/shared-assets/models/Mixer.glb',
      position: {
        top: '30%',
        left: isMobile ? '20%' : '35%',
      },
      scale: isMobile ? '0.3 0.3 0.3' : '0.5 0.5 0.5',
      rotationAxis: 'y',
      initialRotation: '90deg',
      zIndex: 2,
      angleX: '-5deg',
      angleY: '120deg',
      angleZ: '0deg'
    }
  ];
  
  const displayModels = models.length > 0 ? models : defaultModels;
  
  return (
    <div className="absolute inset-0 overflow-hidden">
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
          backgroundImage={backgroundImage}
          rotationMultiplier={0.15}
          height={isMobile ? "60%" : "70%"}
          width={isMobile ? "60%" : "50%"}
          angleX={model.angleX}
          angleY={model.angleY}
          angleZ={model.angleZ}
        />
      ))}
    </div>
  );
};

export default FloatingModels;
