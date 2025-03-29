
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
  rotationAxis = "y"
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

  // Handle smooth scroll-based rotation with requestAnimationFrame
  useEffect(() => {
    if (!rotateOnScroll || !isScriptLoaded) return;
    
    let lastTime = 0;
    let scrollSpeed = 0;
    let idleTimer: NodeJS.Timeout | null = null;

    const updateRotation = (timestamp: number) => {
      // Calculate time delta for consistent animation speed
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      
      // Get current scroll position
      const scrollY = window.scrollY;
      const scrollDiff = scrollY - lastScrollYRef.current;
      
      // Update scroll speed with decay
      if (Math.abs(scrollDiff) > 0) {
        scrollSpeed = scrollDiff * rotationMultiplier;
        // Clear previous idle timer
        if (idleTimer) clearTimeout(idleTimer);
        
        // Set new idle timer to gradually stop rotation
        idleTimer = setTimeout(() => {
          scrollSpeed = 0;
        }, 1000);
      } else {
        // Apply decay when not scrolling
        scrollSpeed *= 0.95;
        if (Math.abs(scrollSpeed) < 0.01) scrollSpeed = 0;
      }
      
      // Update rotation based on scroll speed
      if (Math.abs(scrollSpeed) > 0) {
        setRotation(prev => (prev + scrollSpeed) % 360);
      }
      
      // Update the model rotation if the model-viewer element exists
      if (containerRef.current) {
        const modelViewer = containerRef.current.querySelector('model-viewer');
        if (modelViewer) {
          // Extract the existing camera orbit values
          const orbitParts = isMobile ? mobileCameraOrbit.split(' ') : cameraOrbit.split(' ');
          
          // Use the appropriate rotation axis
          let newOrbit;
          if (rotationAxis === 'y') {
            newOrbit = `${rotation}deg ${orbitParts[1]} ${orbitParts[2]}`;
          } else if (rotationAxis === 'x') {
            newOrbit = `${orbitParts[0]} ${rotation}deg ${orbitParts[2]}`;
          } else {
            // For 'z' axis, we'd need to use a different approach
            newOrbit = `${orbitParts[0]} ${orbitParts[1]} ${orbitParts[2]}`;
          }
          
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
      if (idleTimer) {
        clearTimeout(idleTimer);
      }
    };
  }, [rotateOnScroll, isScriptLoaded, rotation, rotationMultiplier, cameraOrbit, isMobile, mobileCameraOrbit, rotationAxis]);
  
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
