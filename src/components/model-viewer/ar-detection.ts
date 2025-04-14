
import { toast } from 'sonner';

/**
 * Detects if AR is supported on the current device and browser
 */
export function detectARSupport(modelUrl?: string, iosModelUrl?: string): boolean {
  // Guard against SSR
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  
  // iOS AR QuickLook is supported on iOS Safari with USDZ file
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isIOSSupported = isIOS && !!iosModelUrl;
  
  // Android Scene Viewer is supported on Chrome with GLB/GLTF file
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isChrome = /Chrome/i.test(navigator.userAgent) && !/Edge|Edg/i.test(navigator.userAgent);
  const isAndroidSupported = isAndroid && isChrome && !!modelUrl;
  
  const hasWebXR = 'xr' in navigator;
  
  return isIOSSupported || isAndroidSupported || hasWebXR;
}

/**
 * Enhance AR button visibility and functionality
 */
export function enhanceARButton(
  modelViewerElement: HTMLElement | null, 
  enableAR: boolean,
  modelName: string,
  isMobile: boolean,
  setArAvailable: (state: boolean) => void,
  setModelVisible: (state: boolean) => void,
  modelVisible: boolean
): void {
  if (!enableAR || !modelViewerElement) return;
  
  const arButton = modelViewerElement.querySelector('button[slot="ar-button"]');
  
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
}

/**
 * Handles device-specific AR support
 */
export function getARSupportInfo(): {
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
} {
  // Guard against SSR
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return { isIOS: false, isAndroid: false, isMobile: false };
  }
  
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isMobile = isIOS || isAndroid;
  
  return { isIOS, isAndroid, isMobile };
}
