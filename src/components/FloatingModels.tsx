
import React from 'react';
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
  
  // Default models if none provided
  const defaultModels: Model[] = [
    {
      id: 'model1',
      url: 'https://modelviewer.dev/shared-assets/models/Astronaut.glb',
      position: {
        top: '10%',
        right: isMobile ? '5%' : '15%',
      },
      scale: isMobile ? '0.7 0.7 0.7' : '1.2 1.2 1.2',
      rotationAxis: 'y',
      initialRotation: '45deg',
      zIndex: 1
    },
    {
      id: 'model2',
      url: 'https://modelviewer.dev/shared-assets/models/RobotExpressive.glb',
      position: {
        bottom: '10%',
        left: isMobile ? '5%' : '15%',
      },
      scale: isMobile ? '0.5 0.5 0.5' : '0.8 0.8 0.8',
      rotationAxis: 'y',
      initialRotation: '180deg',
      zIndex: 2
    },
    {
      id: 'model3',
      url: 'https://modelviewer.dev/shared-assets/models/Mixer.glb',
      position: {
        top: '40%',
        left: isMobile ? '35%' : '40%',
      },
      scale: isMobile ? '0.6 0.6 0.6' : '1 1 1',
      rotationAxis: 'y',
      initialRotation: '90deg',
      zIndex: 0
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
          autoRotate={false}
          cameraControls={false}
          backgroundAlpha={0}
          backgroundImage={backgroundImage}
          rotationMultiplier={0.15}
          height={isMobile ? "50%" : "70%"}
          width={isMobile ? "50%" : "50%"}
        />
      ))}
    </div>
  );
};

export default FloatingModels;
