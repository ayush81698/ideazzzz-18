
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface ModelViewerProps {
  modelUrl: string;
  className?: string;
  autoRotate?: boolean;
  scale?: string;
  cameraControls?: boolean;
  backgroundAlpha?: number;
  fieldOfView?: string;
  rotateOnScroll?: boolean;
  rotationMultiplier?: number;
  cameraOrbit?: string;
  exposure?: string;
  height?: string;
  width?: string;
  position?: 'absolute' | 'relative' | 'fixed';
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex?: number;
  skyboxImage?: string;
  backgroundImage?: string;
  initialRotation?: string;
  rotationAxis?: 'x' | 'y' | 'z';
  angleX?: string;
  angleY?: string;
  angleZ?: string;
  scrollY?: number;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  className,
  autoRotate = false,
  scale = "1 1 1",
  cameraControls = true,
  backgroundAlpha = 0,
  fieldOfView = "45deg",
  rotateOnScroll = false,
  rotationMultiplier = 0.2,
  cameraOrbit = "0deg 75deg 105%",
  exposure = "0.75",
  height = "100%",
  width = "100%",
  position = "relative",
  top,
  left,
  right,
  bottom,
  zIndex = 0,
  skyboxImage,
  backgroundImage,
  initialRotation = "0deg",
  rotationAxis = "y",
  angleX = "0deg",
  angleY = "0deg",
  angleZ = "0deg",
  scrollY = 0
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(parseInt(initialRotation) || 0);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const lastScrollYRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const isMobile = useIsMobile();
  
  // Load model-viewer script
  useEffect(() => {
    if (document.querySelector('script[src*="model-viewer"]')) {
      setIsScriptLoaded(true);
      return;
    }
    
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    script.onload = () => setIsScriptLoaded(true);
    document.body.appendChild(script);
    
    return () => {
      // Don't remove the script on unmount as it might be used by other components
    };
  }, []);

  // Apply mobile-specific scaling
  const mobileScale = isMobile ? "0.8 0.8 0.8" : scale;
  const mobileCameraOrbit = isMobile ? "0deg 75deg 150%" : cameraOrbit;
  const mobileFieldOfView = isMobile ? "50deg" : fieldOfView;

  // Use the scrollY prop for controlled rotation if rotateOnScroll is true
  useEffect(() => {
    if (!rotateOnScroll || !isScriptLoaded || !containerRef.current) return;
    
    const modelViewer = containerRef.current.querySelector('model-viewer');
    if (!modelViewer) return;
    
    // Calculate rotation based on scroll position
    const newRotation = (rotation + (scrollY * 0.1)) % 360;
    setRotation(newRotation);
    
    // Extract the existing camera orbit values
    const orbitParts = isMobile ? mobileCameraOrbit.split(' ') : cameraOrbit.split(' ');
    
    // Use the appropriate rotation axis
    let newOrbit;
    if (rotationAxis === 'y') {
      newOrbit = `${newRotation}deg ${orbitParts[1]} ${orbitParts[2]}`;
    } else if (rotationAxis === 'x') {
      newOrbit = `${orbitParts[0]} ${newRotation}deg ${orbitParts[2]}`;
    } else {
      // For 'z' axis, we'd need to use a different approach
      newOrbit = `${orbitParts[0]} ${orbitParts[1]} ${orbitParts[2]}`;
    }
    
    modelViewer.setAttribute('camera-orbit', newOrbit);
  }, [rotateOnScroll, isScriptLoaded, scrollY, isMobile, mobileCameraOrbit, cameraOrbit, rotationAxis, rotation]);
  
  // Handle model loading events
  useEffect(() => {
    const handleModelLoad = () => {
      setIsModelLoaded(true);
      console.log(`Model loaded successfully: ${modelUrl}`);
    };
    
    const handleModelError = () => {
      console.error(`Failed to load model from URL: ${modelUrl}`);
    };
    
    if (isScriptLoaded && containerRef.current) {
      const modelViewer = containerRef.current.querySelector('model-viewer');
      if (modelViewer) {
        modelViewer.addEventListener('load', handleModelLoad);
        modelViewer.addEventListener('error', handleModelError);
      }
    }
    
    return () => {
      if (isScriptLoaded && containerRef.current) {
        const modelViewer = containerRef.current.querySelector('model-viewer');
        if (modelViewer) {
          modelViewer.removeEventListener('load', handleModelLoad);
          modelViewer.removeEventListener('error', handleModelError);
        }
      }
    };
  }, [isScriptLoaded, modelUrl]);
  
  return (
    <div 
      ref={containerRef} 
      className={cn("model-container", className)}
      style={{ 
        position, 
        zIndex, 
        height,
        width,
        top,
        left,
        right,
        bottom,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}
    >
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <model-viewer
              src="${modelUrl}"
              alt="3D model"
              auto-rotate="${autoRotate ? "true" : "false"}"
              rotation-per-second="30deg"
              camera-controls="${cameraControls ? "true" : "false"}"
              shadow-intensity="1"
              exposure="${exposure}"
              shadow-softness="1"
              environment-image="${skyboxImage || 'neutral'}"
              scale="${isMobile ? mobileScale : scale}"
              field-of-view="${isMobile ? mobileFieldOfView : fieldOfView}"
              style="width: 100%; height: 100%; background-color: rgba(0,0,0,${backgroundAlpha});"
              camera-orbit="${isMobile ? mobileCameraOrbit : cameraOrbit}"
              orientation="${angleX} ${angleY} ${angleZ}"
              ar
              ar-modes="webxr scene-viewer quick-look"
              poster="https://via.placeholder.com/600x400?text=Loading+3D+Model"
              loading="lazy"
              reveal="auto"
              onError="document.dispatchEvent(new CustomEvent('model-error', {}))"
            ></model-viewer>
          `
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ModelViewer;
