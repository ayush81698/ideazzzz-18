
import React, { useEffect, useRef } from 'react';
import '@google/model-viewer';
import { useIsMobile } from '@/hooks/use-mobile';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface ModelViewerProps {
  src: string;
  ios_src?: string;
  alt: string;
  poster?: string;
  width?: string;
  height?: string;
  ar?: boolean;
  autoRotate?: boolean;
  cameraControls?: boolean;
  environmentImage?: string;
  exposure?: number;
  shadowIntensity?: number;
  className?: string;
}

const ModelViewerComponent: React.FC<ModelViewerProps> = ({
  src,
  ios_src,
  alt,
  poster,
  width = "100%",
  height = "300px",
  ar = true,
  autoRotate = true,
  cameraControls = true,
  environmentImage = "neutral",
  exposure = 1,
  shadowIntensity = 1,
  className = ""
}) => {
  const modelViewerRef = useRef<HTMLElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const modelViewer = modelViewerRef.current;
    
    if (modelViewer) {
      // Ensure AR mode is enabled for mobile devices when available
      if (isMobile && ar && ios_src) {
        // Add any mobile-specific AR configuration here
        console.log("AR mode available for mobile device");
      }
      
      // Event listeners for AR mode
      const onARTracking = (event: any) => {
        console.log("AR tracking started", event);
      };
      
      const onARError = (event: any) => {
        console.error("AR error encountered", event);
      };
      
      modelViewer.addEventListener('ar-tracking', onARTracking);
      modelViewer.addEventListener('ar-error', onARError);
      
      return () => {
        modelViewer.removeEventListener('ar-tracking', onARTracking);
        modelViewer.removeEventListener('ar-error', onARError);
      };
    }
  }, [isMobile, ar, ios_src]);

  return (
    <model-viewer
      ref={modelViewerRef}
      src={src}
      ios-src={ios_src}
      alt={alt}
      poster={poster}
      ar={ar && ios_src ? "true" : "false"}
      ar-modes="webxr scene-viewer quick-look"
      camera-controls={cameraControls ? "true" : "false"}
      auto-rotate={autoRotate ? "true" : "false"}
      environment-image={environmentImage}
      exposure={exposure}
      shadow-intensity={shadowIntensity}
      style={{ width, height }}
      className={className}
      ar-status="not-presenting"
      ar-scale="auto"
    >
      <div className="poster" slot="poster">
        {poster && <img src={poster} alt={`${alt} poster`} />}
        <div className="progress-bar hide" slot="progress-bar">
          <div className="update-bar"></div>
        </div>
      </div>
      
      {ar && ios_src && (
        <button slot="ar-button" className="ar-button">
          View in AR
        </button>
      )}
    </model-viewer>
  );
};

export default ModelViewerComponent;
