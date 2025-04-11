
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    
    // Check for mobile user agent in addition to width
    const checkMobileUA = () => {
      const ua = navigator.userAgent;
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    };
    
    // Return true if either width is mobile-sized OR user agent is mobile
    return window.innerWidth < MOBILE_BREAKPOINT || checkMobileUA();
  })

  React.useEffect(() => {
    // Safety check for SSR
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const isWidthMobile = window.innerWidth < MOBILE_BREAKPOINT;
      const isDeviceMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isWidthMobile || isDeviceMobile);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return isMobile;
}
