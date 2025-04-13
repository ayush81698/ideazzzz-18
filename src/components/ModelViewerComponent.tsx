
import React, { useEffect, useRef } from 'react';
import '@google/model-viewer';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

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
  autoRotate?: boolean;
  cameraControls?: boolean;
  environmentImage?: string;
  exposure?: number;
  shadowIntensity?: number;
  className?: string;
  enableAR?: boolean;
}

const ModelViewerComponent: React.FC<ModelViewerProps> = ({
  src,
  ios_src,
  alt,
  poster,
  width = "100%",
  height = "300px",
  autoRotate = true,
  cameraControls = true,
  environmentImage = "neutral",
  exposure = 1,
  shadowIntensity = 1,
  className = "",
  enableAR = true
}) => {
  const modelViewerRef = useRef<HTMLElement | null>(null);
  const isMobile = useIsMobile();
  
  // Function to enhance AR button visibility
  const enhanceARButton = () => {
    if (enableAR && modelViewerRef.current) {
      const arButton = modelViewerRef.current.querySelector('button[slot="ar-button"]');
      if (arButton && arButton instanceof HTMLElement) {
        // Make AR button more visible and user-friendly
        arButton.style.opacity = '1';
        arButton.style.visibility = 'visible';
        arButton.style.position = 'absolute';
        arButton.style.bottom = '16px';
        arButton.style.right = '16px';
        arButton.style.backgroundColor = '#ffffff';
        arButton.style.border = '1px solid #cccccc';
        arButton.style.borderRadius = '24px';
        arButton.style.padding = '8px 16px';
        arButton.style.fontSize = '14px';
        arButton.style.fontWeight = 'bold';
        arButton.style.color = '#333333';
        arButton.style.cursor = 'pointer';
        arButton.style.boxShadow = '0px 2px 4px rgba(0,0,0,0.2)';
        arButton.style.display = 'flex';
        arButton.style.alignItems = 'center';
        arButton.style.justifyContent = 'center';
        arButton.textContent = '👋 View in AR';

        // Create a dedicated AR info toast
        if (isMobile) {
          setTimeout(() => {
            toast.info("AR View Available", {
              description: "Tap the 'View in AR' button to see this model in your space",
              duration: 5000,
              position: "bottom-center"
            });
          }, 2000);
        }
      } else {
        console.warn("AR button not found in model-viewer");
      }
    }
  };

  useEffect(() => {
    // Add event listeners to know when model is loaded
    const handleLoad = () => {
      console.log("Model loaded, enhancing AR button");
      enhanceARButton();
    };

    if (modelViewerRef.current) {
      modelViewerRef.current.addEventListener('load', handleLoad);
      
      // Also try to enhance after a small delay as a fallback
      setTimeout(enhanceARButton, 1000);
    }

    return () => {
      if (modelViewerRef.current) {
        modelViewerRef.current.removeEventListener('load', handleLoad);
      }
    };
  }, []);

  // For iOS devices where model-viewer AR might not work, provide a direct AR Quick Look link
  if (ios_src && isMobile && /iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return (
      <div className={`ios-ar-container ${className}`} style={{ width, height, position: 'relative' }}>
        {/* Standard model viewer for display */}
        <model-viewer
          ref={modelViewerRef}
          src={src}
          alt={alt}
          poster={poster}
          camera-controls={cameraControls ? "true" : "false"}
          auto-rotate={autoRotate ? "true" : "false"}
          environment-image={environmentImage}
          exposure={exposure}
          shadow-intensity={shadowIntensity}
          style={{ width: '100%', height: '100%' }}
          loading="eager"
        >
          <div className="poster" slot="poster">
            {poster && <img src={poster} alt={`${alt} poster`} />}
            <div className="progress-bar hide" slot="progress-bar">
              <div className="update-bar"></div>
            </div>
          </div>
        </model-viewer>
        
        {/* iOS AR Quick Look link - styled to be very visible */}
        <a 
          href={ios_src}
          rel="ar" 
          className="ios-ar-button"
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            backgroundColor: '#fff',
            color: '#000',
            padding: '8px 16px',
            borderRadius: '20px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 10,
            fontWeight: 'bold'
          }}
        >
          <span style={{ marginRight: '6px' }}>🍏</span> View in AR
        </a>
      </div>
    );
  }

  // Standard model-viewer with AR for other devices
  return (
    <model-viewer
      ref={modelViewerRef}
      src={src}
      ios-src={ios_src}
      alt={alt}
      poster={poster}
      camera-controls={cameraControls ? "true" : "false"}
      auto-rotate={autoRotate ? "true" : "false"}
      environment-image={environmentImage}
      exposure={exposure}
      shadow-intensity={shadowIntensity}
      style={{ width, height }}
      className={className}
      loading="eager"
      ar={enableAR ? "true" : "false"}
      ar-modes="webxr scene-viewer quick-look"
      ar-scale="auto"
    >
      <div className="poster" slot="poster">
        {poster && <img src={poster} alt={`${alt} poster`} />}
        <div className="progress-bar hide" slot="progress-bar">
          <div className="update-bar"></div>
        </div>
      </div>
      {/* Custom AR button to ensure it's always visible */}
      <button 
        slot="ar-button" 
        className="ar-button" 
        style={{
          opacity: '1',
          visibility: 'visible',
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          backgroundColor: '#ffffff',
          border: '1px solid #cccccc',
          borderRadius: '24px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#333333',
          cursor: 'pointer',
          boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10
        }}
      >
        👋 View in AR
      </button>
    </model-viewer>
  );
};

export default ModelViewerComponent;
