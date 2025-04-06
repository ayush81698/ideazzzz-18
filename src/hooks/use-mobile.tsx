
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    // Initial state based on current window width (or assume non-mobile for SSR)
    return typeof window !== 'undefined' 
      ? window.innerWidth < MOBILE_BREAKPOINT 
      : false
  })

  React.useEffect(() => {
    // Safety check for SSR
    if (typeof window === 'undefined') return

    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    
    // Set initial value
    handleResize()
    
    // Add event listener for window resize
    window.addEventListener('resize', handleResize)
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return isMobile
}
