
import React, { useEffect, useState } from 'react';
import '@google/model-viewer';
import { useIsMobile } from '@/hooks/use-mobile';
import { ModelViewerProps } from './ModelViewerProps';
import IOSModelViewer from './IOSModelViewer';
import UnsupportedARViewer from './UnsupportedARViewer';
import StandardModelViewer from './StandardModelViewer';
import { detectARSupport, getARSupportInfo } from './ar-detection';

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

const ModelViewerComponent: React.FC<ModelViewerProps> = (props) => {
  const {
    src,
    ios_src,
    alt,
    enableAR = true
  } = props;
  
  const isMobile = useIsMobile();
  const [arSupported, setArSupported] = useState<boolean | null>(null);
  
  // Guards against SSR/hydration issues
  if (typeof window === 'undefined') return null;

  // Helper function to detect AR support based on browser
  useEffect(() => {
    const checkARSupport = () => {
      const supported = detectARSupport(src, ios_src);
      setArSupported(supported);
      
      console.log(`AR Support Check: Overall=${supported}`);
      console.log(`Model URL: ${src}`);
      if (ios_src) console.log(`iOS Model URL: ${ios_src}`);
    };
    
    checkARSupport();
  }, [src, ios_src]);

  // Special handling for iOS devices
  const { isIOS } = getARSupportInfo();
  
  // For iOS devices where model-viewer AR might not work, provide a direct AR Quick Look link
  if (ios_src && isIOS) {
    return <IOSModelViewer {...props} />;
  }

  // Add fallback for devices where AR might not work properly
  if (arSupported === false && isMobile) {
    return <UnsupportedARViewer {...props} />;
  }

  // Standard model-viewer with AR for other devices
  return <StandardModelViewer {...props} />;
};

export default ModelViewerComponent;
