
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ModelViewerProps {
  modelUrl: string;
  className?: string;
  autoRotate?: boolean;
  scale?: string;
  cameraControls?: boolean;
  backgroundAlpha?: number;
  fieldOfView?: string;
  rotateOnScroll?: boolean;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  className,
  autoRotate = false,
  scale = "1 1 1",
  cameraControls = true,
  backgroundAlpha = 0,
  fieldOfView = "45deg",
  rotateOnScroll = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(0);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
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
  
  // Handle scroll-based rotation
  useEffect(() => {
    if (!rotateOnScroll) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newRotation = scrollY * 0.1 % 360; // Adjust the multiplier for rotation speed
      setRotation(newRotation);
      
      // Update the model rotation if the model-viewer element exists
      if (isScriptLoaded && containerRef.current) {
        const modelViewer = containerRef.current.querySelector('model-viewer');
        if (modelViewer) {
          modelViewer.setAttribute('camera-orbit', `${newRotation}deg 75deg 105%`);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [rotateOnScroll, isScriptLoaded]);
  
  // Fallback for when model URL is invalid or can't be loaded
  const handleModelError = () => {
    console.error(`Failed to load model from URL: ${modelUrl}`);
  };
  
  return (
    <div ref={containerRef} className={cn("model-container", className)}>
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
              exposure="0.75"
              shadow-softness="1"
              environment-image="neutral"
              scale="${scale}"
              field-of-view="${fieldOfView}"
              style="width: 100%; height: 100%; background-color: rgba(0,0,0,${backgroundAlpha});"
              camera-orbit="${rotation}deg 75deg 105%"
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
