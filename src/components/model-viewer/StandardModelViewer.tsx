import React, { useRef, useEffect } from 'react';
import { ModelViewerProps } from './ModelViewerProps';
import { enhanceARButton } from './ar-detection';
import { useIsMobile } from '@/hooks/use-mobile';

/**
 * Standard model viewer component with AR support
 */
const StandardModelViewer: React.FC<ModelViewerProps> = ({
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
  const [arAvailable, setArAvailable] = React.useState<boolean>(false);
  const [modelVisible, setModelVisible] = React.useState<boolean>(false);

  // Handle AR button visibility enhancement
  useEffect(() => {
    const handleVisibilityChange = (event: any) => {
      // Ensure we're setting a boolean value to the boolean state
      const isVisible = event.detail.visible === true;
      if (isVisible) {
        console.log(`Model ${alt} is now visible`);
        enhanceARButton(
          modelViewerRef.current, 
          enableAR, 
          alt, 
          isMobile, 
          setArAvailable, 
          setModelVisible,
          modelVisible
        );
        setModelVisible(true);
      }
    };
    
    const handleArStatus = (event: any) => {
      console.log(`AR Status: ${event.detail.status}`);
    };
    
    const handleLoad = () => {
      console.log(`Model ${alt} loaded, enhancing AR button`);
      enhanceARButton(
        modelViewerRef.current, 
        enableAR, 
        alt, 
        isMobile, 
        setArAvailable, 
        setModelVisible,
        modelVisible
      );
    };
    
    // Initial enhancement attempt
    enhanceARButton(
      modelViewerRef.current, 
      enableAR, 
      alt, 
      isMobile, 
      setArAvailable, 
      setModelVisible,
      modelVisible
    );
    
    // Fallback timer as last resort
    const timerId = setTimeout(() => {
      console.log("Fallback timer: enhancing AR button");
      enhanceARButton(
        modelViewerRef.current, 
        enableAR, 
        alt, 
        isMobile, 
        setArAvailable, 
        setModelVisible,
        modelVisible
      );
    }, 1500);
    
    // Attach event listeners
    if (modelViewerRef.current) {
      modelViewerRef.current.addEventListener('model-visibility', handleVisibilityChange);
      modelViewerRef.current.addEventListener('ar-status', handleArStatus);
      modelViewerRef.current.addEventListener('load', handleLoad);
    }
    
    return () => {
      clearTimeout(timerId);
      
      if (modelViewerRef.current) {
        modelViewerRef.current.removeEventListener('model-visibility', handleVisibilityChange);
        modelViewerRef.current.removeEventListener('ar-status', handleArStatus);
        modelViewerRef.current.removeEventListener('load', handleLoad);
      }
    };
  }, [alt, enableAR, isMobile, modelVisible]);

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
      ar-placement="floor"
    >
      <div className="poster" slot="poster">
        {poster && <img src={poster} alt={`${alt} poster`} />}
        <div className="progress-bar hide" slot="progress-bar">
          <div className="update-bar"></div>
        </div>
      </div>
      
      {/* We keep the custom AR button to ensure it's always visible */}
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

export default StandardModelViewer;
