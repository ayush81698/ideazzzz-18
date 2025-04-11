
import React, { useEffect, useRef } from 'react';
import '@google/model-viewer';
import { useIsMobile } from '@/hooks/use-mobile';
import { Box, View } from 'lucide-react';

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
      if (isMobile && ar) {
        console.log("AR mode available for mobile device");
      }
      
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

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ar-button {
        background-color: #7e22ce !important;
        color: white !important;
        border-radius: 8px !important;
        border: none !important;
        padding: 8px 16px !important;
        font-weight: bold !important;
        position: absolute !important;
        bottom: 16px !important;
        right: 16px !important;
        z-index: 10 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
        opacity: 1 !important;
        animation: pulse 2s infinite !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }
      
      .ar-button:active {
        background-color: #581c87 !important;
        transform: scale(0.98) !important;
      }
      
      .ar-button svg {
        margin-right: 4px;
      }
      
      @keyframes pulse {
        0% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(126, 34, 206, 0.7);
        }
        70% {
          transform: scale(1.05);
          box-shadow: 0 0 0 10px rgba(126, 34, 206, 0);
        }
        100% {
          transform: scale(1);
          box-shadow: 0 0 0 0 rgba(126, 34, 206, 0);
        }
      }
      
      /* Make AR button more prominent on mobile */
      @media (max-width: 768px) {
        .ar-button {
          padding: 12px 20px !important;
          font-size: 16px !important;
          bottom: 20px !important;
          right: 20px !important;
          z-index: 20 !important; 
          opacity: 1 !important;
          visibility: visible !important;
        }
        
        model-viewer::part(default-ar-button) {
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <model-viewer
      ref={modelViewerRef}
      src={src}
      ios-src={ios_src}
      alt={alt}
      poster={poster}
      ar={ar ? "true" : "false"}
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
      ar-placement="floor"
      reveal="auto"
      loading="eager"
    >
      <div className="poster" slot="poster">
        {poster && <img src={poster} alt={`${alt} poster`} />}
        <div className="progress-bar hide" slot="progress-bar">
          <div className="update-bar"></div>
        </div>
      </div>
      
      {ar && (
        <button slot="ar-button" className="ar-button">
          <View size={24} />
          View in AR
        </button>
      )}

      {/* Add explicit Android AR button */}
      <div id="ar-prompt" className="absolute bottom-5 left-0 right-0 text-center">
        <span className="px-4 py-2 bg-purple-600 text-white rounded-full shadow-lg">
          Tap to view in your space
        </span>
      </div>
    </model-viewer>
  );
};

export default ModelViewerComponent;
