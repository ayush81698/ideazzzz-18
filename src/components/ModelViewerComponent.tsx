
import React, { useEffect, useRef, useState } from 'react';
import '@google/model-viewer';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

// Only define this on the client side
if (typeof window !== 'undefined') {
  // Ensure global JSX namespace is updated only once
  if (!window.hasOwnProperty('modelViewerDefined')) {
    window.modelViewerDefined = true;
  }
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

// Add this to the global Window interface
declare global {
  interface Window {
    modelViewerDefined?: boolean;
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
  const [arAvailable, setArAvailable] = useState<boolean>(false);
  const [modelVisible, setModelVisible] = useState<boolean>(false);
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  
  // Guards against SSR/hydration issues
  if (typeof window === 'undefined') return null;

  // Helper function to detect AR support based on browser
  useEffect(() => {
    const checkARSupport = () => {
      // Check for Android AR support
      const isAndroid = /Android/i.test(navigator.userAgent);
      const isChrome = /Chrome/i.test(navigator.userAgent) && !/Edge|Edg/i.test(navigator.userAgent);
      const androidARSupport = isAndroid && isChrome;
      
      // Check for iOS AR support
      const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      const iosSafari = isiOS && /Safari/i.test(navigator.userAgent) && !/CriOS|FxiOS/i.test(navigator.userAgent);
      const iOSARSupport = isiOS && ios_src;
      
      // AR is supported if either platform has support
      const supported = androidARSupport || iOSARSupport;
      setArSupported(supported);
      
      console.log(`AR Support Check: Android=${androidARSupport}, iOS=${iOSARSupport}, Overall=${supported}`);
      
      // Log MIME type diagnostic info if available
      if (modelViewerRef.current) {
        console.log(`Model URL: ${src}`);
        if (ios_src) console.log(`iOS Model URL: ${ios_src}`);
      }
    };
    
    checkARSupport();
  }, [src, ios_src]);

  // Function to enhance AR button visibility with better event handling
  const enhanceARButton = () => {
    if (!enableAR || !modelViewerRef.current) return;
    
    const arButton = modelViewerRef.current.querySelector('button[slot="ar-button"]');
    
    if (arButton && arButton instanceof HTMLElement) {
      console.log("AR button found, enhancing...");
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
      
      setArAvailable(true);
      
      // Show a toast notification only once when AR is available
      if (isMobile && !modelVisible) {
        toast.info("AR View Available", {
          description: "Tap the 'View in AR' button to see this model in your space",
          duration: 5000,
          position: "bottom-center"
        });
        setModelVisible(true);
      }
    } else {
      console.warn("AR button not found in model-viewer, will retry");
    }
  };

  // Handle AR activation results
  useEffect(() => {
    if (!modelViewerRef.current) return;
    
    const handleActivateAR = () => {
      console.log("AR activation attempted");
    };
    
    const handleARTracking = (event: any) => {
      console.log("AR tracking event:", event.detail);
    };
    
    const modelViewer = modelViewerRef.current;
    
    if (modelViewer) {
      modelViewer.addEventListener('ar-tracking', handleARTracking);
      modelViewer.addEventListener('activate-ar', handleActivateAR);
    }
    
    return () => {
      if (modelViewer) {
        modelViewer.removeEventListener('ar-tracking', handleARTracking);
        modelViewer.removeEventListener('activate-ar', handleActivateAR);
      }
    };
  }, []);

  useEffect(() => {
    // Multiple approaches to ensure AR button is enhanced
    
    // 1. Use model-visibility event (more reliable than load)
    const handleVisibilityChange = (event: any) => {
      const isVisible = event.detail.visible;
      if (isVisible) {
        console.log(`Model ${alt} is now visible`);
        enhanceARButton();
        setModelVisible(true);
      }
    };
    
    // 2. Use ar-status event to detect AR availability
    const handleArStatus = (event: any) => {
      console.log(`AR Status: ${event.detail.status}`);
      if (event.detail.status === 'session-started') {
        console.log('AR session started');
      } else if (event.detail.status === 'not-presenting') {
        console.log('AR not presenting - check if device supports AR');
      } else if (event.detail.status === 'failed') {
        console.error('AR session failed to start');
        // Show toast with failure reason
        toast.error("AR Failed", {
          description: "Could not start AR view. Please try again or use another device.",
          duration: 3000,
        });
      }
    };
    
    // 3. Use load event as backup
    const handleLoad = () => {
      console.log(`Model ${alt} loaded, enhancing AR button`);
      enhanceARButton();
    };
    
    // 4. Fallback timer as last resort
    const timerId = setTimeout(() => {
      console.log("Fallback timer: enhancing AR button");
      enhanceARButton();
    }, 1500);

    // Attach all event listeners if model-viewer element exists
    if (modelViewerRef.current) {
      modelViewerRef.current.addEventListener('model-visibility', handleVisibilityChange);
      modelViewerRef.current.addEventListener('ar-status', handleArStatus);
      modelViewerRef.current.addEventListener('load', handleLoad);
      
      // Try once immediately in case the model is already loaded
      enhanceARButton();
    }

    // Clean up all listeners and timers
    return () => {
      clearTimeout(timerId);
      
      if (modelViewerRef.current) {
        modelViewerRef.current.removeEventListener('model-visibility', handleVisibilityChange);
        modelViewerRef.current.removeEventListener('ar-status', handleArStatus);
        modelViewerRef.current.removeEventListener('load', handleLoad);
      }
    };
  }, [alt]);

  // Special handling for iOS devices
  const isIOS = isMobile && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  // For iOS devices where model-viewer AR might not work, provide a direct AR Quick Look link
  if (ios_src && isIOS) {
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

  // Add fallback for devices where AR might not work properly
  if (arSupported === false && isMobile) {
    return (
      <div className={`ar-unsupported ${className}`} style={{ width, height, position: 'relative' }}>
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
        />
        <div 
          className="ar-unsupported-message"
          style={{
            position: 'absolute',
            bottom: '16px',
            right: '16px',
            backgroundColor: '#fff',
            color: '#000',
            padding: '8px 16px',
            borderRadius: '20px',
            textAlign: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            zIndex: 10,
            fontSize: '14px',
            maxWidth: '80%'
          }}
        >
          <p>AR not supported on this device/browser</p>
          {isIOS && !ios_src && <p>iOS device requires USDZ model file</p>}
        </div>
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

export default ModelViewerComponent;
