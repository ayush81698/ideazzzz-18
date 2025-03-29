
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
  position?: 'absolute' | 'relative' | 'fixed';
  zIndex?: number;
  skyboxImage?: string;
  backgroundImage?: string;
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
  position = "relative",
  zIndex = 0,
  skyboxImage,
  backgroundImage
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
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

  // Handle smooth scroll-based rotation with requestAnimationFrame
  useEffect(() => {
    if (!rotateOnScroll) return;
    
    const updateRotation = () => {
      const scrollY = window.scrollY;
      // Use a smaller multiplier for smoother rotation
      const targetRotation = scrollY * rotationMultiplier % 360;
      
      // Smooth transition between current and target rotation
      const currentRotation = rotation;
      const delta = (targetRotation - currentRotation) * 0.1; // Smoothing factor
      
      if (Math.abs(delta) > 0.01) {
        setRotation(currentRotation + delta);
      }
      
      // Update the model rotation if the model-viewer element exists
      if (isScriptLoaded && containerRef.current) {
        const modelViewer = containerRef.current.querySelector('model-viewer');
        if (modelViewer) {
          // Extract the existing camera orbit values
          const orbitParts = isMobile ? mobileCameraOrbit.split(' ') : cameraOrbit.split(' ');
          // Replace only the first part (rotation)
          const newOrbit = `${(currentRotation + delta)}deg ${orbitParts[1]} ${orbitParts[2]}`;
          modelViewer.setAttribute('camera-orbit', newOrbit);
        }
      }
      
      lastScrollYRef.current = scrollY;
      animationFrameRef.current = requestAnimationFrame(updateRotation);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateRotation);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [rotateOnScroll, isScriptLoaded, rotation, rotationMultiplier, cameraOrbit, isMobile, mobileCameraOrbit]);
  
  // Fallback for when model URL is invalid or can't be loaded
  useEffect(() => {
    const handleModelError = () => {
      console.error(`Failed to load model from URL: ${modelUrl}`);
    };
    
    document.addEventListener('model-error', handleModelError);
    return () => document.removeEventListener('model-error', handleModelError);
  }, [modelUrl]);
  
  return (
    <div 
      ref={containerRef} 
      className={cn("model-container", className)}
      style={{ 
        position, 
        zIndex, 
        height,
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
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
