
/**
 * Utility functions for AR functionality
 */

/**
 * Checks if the current device likely supports AR
 */
export const isARSupported = (modelUrl?: string, usdzUrl?: string): boolean => {
  // Guard against SSR
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  
  // iOS AR QuickLook is supported on iOS Safari with USDZ file
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isIOSSupported = isIOS && !!usdzUrl;
  
  // Android Scene Viewer is supported on Chrome with GLB/GLTF file
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isChrome = /Chrome/i.test(navigator.userAgent) && !/Edge|Edg/i.test(navigator.userAgent);
  const isAndroidSupported = isAndroid && isChrome && !!modelUrl;
  
  // WebXR support (future-proofing)
  const hasWebXR = 'xr' in navigator;
  
  return isIOSSupported || isAndroidSupported || hasWebXR;
};

/**
 * Attempts to directly launch AR experience as fallback
 */
export const launchARDirectly = (modelUrl?: string, usdzUrl?: string): boolean => {
  // Guard against SSR
  if (typeof window === 'undefined') return false;
  
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (isIOS && usdzUrl) {
    // For iOS, use a direct link to USDZ
    window.location.href = usdzUrl;
    return true;
  } else if (modelUrl) {
    // For Android, attempt scene-viewer URL scheme
    const gARUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(modelUrl)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
    window.location.href = gARUrl;
    return true;
  }
  
  return false;
};

/**
 * Checks if a URL is accessible with proper MIME type
 * Useful for debugging AR issues
 */
export const checkModelUrl = async (url: string): Promise<{accessible: boolean, mimeType?: string, error?: string}> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    if (!response.ok) {
      return { 
        accessible: false, 
        error: `HTTP error: ${response.status}` 
      };
    }
    
    const mimeType = response.headers.get('content-type');
    return { 
      accessible: true, 
      mimeType: mimeType || undefined 
    };
  } catch (error) {
    return { 
      accessible: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

/**
 * Get expected MIME type for various 3D model formats
 */
export const getExpectedMimeType = (fileUrl: string): string => {
  const extension = fileUrl.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'glb':
      return 'model/gltf-binary';
    case 'gltf':
      return 'model/gltf+json';
    case 'usdz':
      return 'model/vnd.usd+zip';
    default:
      return 'application/octet-stream';
  }
};

/**
 * Debug AR implementation issues
 */
export const debugARImplementation = (modelUrl?: string, usdzUrl?: string): void => {
  console.group('AR Debug Information');
  
  // Log device/browser info
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const browser = /Chrome/i.test(navigator.userAgent) ? 'Chrome' : 
                 /Safari/i.test(navigator.userAgent) ? 'Safari' :
                 /Firefox/i.test(navigator.userAgent) ? 'Firefox' : 'Other';
  
  console.log(`Device: ${isIOS ? 'iOS' : isAndroid ? 'Android' : 'Desktop'}`);
  console.log(`Browser: ${browser}`);
  console.log(`User Agent: ${navigator.userAgent}`);
  
  // Log URLs
  console.log(`GLB URL: ${modelUrl || 'Not provided'}`);
  console.log(`USDZ URL: ${usdzUrl || 'Not provided'}`);
  
  // Log AR support
  console.log(`AR likely supported: ${isARSupported(modelUrl, usdzUrl)}`);
  
  // Check for model-viewer
  const hasModelViewer = customElements.get('model-viewer') !== undefined;
  console.log(`<model-viewer> registered: ${hasModelViewer}`);
  
  console.groupEnd();
};
