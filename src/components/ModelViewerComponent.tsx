
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
  
  useEffect(() => {
    // Make AR button more visible if AR is enabled
    if (enableAR && modelViewerRef.current) {
      const arButton = modelViewerRef.current.querySelector('.ar-button');
      if (arButton && arButton instanceof HTMLElement) {
        arButton.style.opacity = '1';
        arButton.style.visibility = 'visible';
        arButton.style.position = 'absolute';
        arButton.style.bottom = '16px';
        arButton.style.right = '16px';
      }
    }
  }, [enableAR]);

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
        
        {/* iOS AR Quick Look link */}
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
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
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
      <button slot="ar-button" className="ar-button">
        👋 View in AR
      </button>
    </model-viewer>
  );
};

export default ModelViewerComponent;
