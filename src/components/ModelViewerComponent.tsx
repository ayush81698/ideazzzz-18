
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
        
        // Force the AR button to be visible
        const arButton = modelViewer.querySelector('button[slot="ar-button"]');
        if (arButton) {
          arButton.style.visibility = 'visible';
          arButton.style.opacity = '1';
          arButton.style.display = 'flex';
        }
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
    // Force AR button visibility through DOM manipulation after render
    setTimeout(() => {
      const arButton = document.querySelector('button.ar-button');
      if (arButton) {
        (arButton as HTMLElement).style.visibility = 'visible';
        (arButton as HTMLElement).style.opacity = '1';
        (arButton as HTMLElement).style.display = 'flex';
        (arButton as HTMLElement).style.zIndex = '100';
      }
      
      // Force model-viewer default AR button visibility as well
      const defaultArButton = document.querySelector('model-viewer::part(default-ar-button)');
      if (defaultArButton) {
        (defaultArButton as HTMLElement).style.visibility = 'visible';
        (defaultArButton as HTMLElement).style.opacity = '1';
        (defaultArButton as HTMLElement).style.pointerEvents = 'auto';
      }
    }, 1000);
  }, []);

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
        z-index: 100 !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1) !important;
        opacity: 1 !important;
        animation: pulse 2s infinite !important;
        visibility: visible !important;
        pointer-events: auto !important;
      }
      
      model-viewer::part(default-ar-button) {
        visibility: visible !important;
        opacity: 1 !important;
        pointer-events: auto !important;
        display: block !important;
        position: absolute !important;
        bottom: 16px !important;
        right: 16px !important;
        z-index: 100 !important;
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
          z-index: 200 !important; 
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
        }
        
        model-viewer::part(default-ar-button) {
          visibility: visible !important;
          opacity: 1 !important;
          pointer-events: auto !important;
          display: block !important;
          position: absolute !important;
          bottom: 16px !important;
          right: 16px !important;
          z-index: 200 !important;
        }
        
        #ar-prompt {
          background-color: rgba(0, 0, 0, 0.7) !important;
          padding: 10px !important;
          border-radius: 10px !important;
          z-index: 200 !important;
          opacity: 1 !important;
          visibility: visible !important;
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
      quick-look-browsers="safari chrome"
      touch-action="pan-y"
    >
      <div className="poster" slot="poster">
        {poster && <img src={poster} alt={`${alt} poster`} />}
        <div className="progress-bar hide" slot="progress-bar">
          <div className="update-bar"></div>
        </div>
      </div>
      
      {/* Explicit AR Button with high visibility */}
      {ar && (
        <button slot="ar-button" className="ar-button" style={{visibility: 'visible', opacity: 1}}>
          <View size={24} />
          View in AR
        </button>
      )}

      {/* Add explicit Android AR prompt with higher z-index */}
      <div id="ar-prompt" className="absolute bottom-5 left-0 right-0 text-center z-50" style={{zIndex: 100}}>
        <span className="px-4 py-2 bg-purple-600 text-white rounded-full shadow-lg">
          Tap to view in your space
        </span>
      </div>
    </model-viewer>
  );
};

export default ModelViewerComponent;
