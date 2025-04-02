
import React, { ReactNode, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    // Destroy any existing instance
    if (lenisRef.current) {
      lenisRef.current.destroy();
      lenisRef.current = null;
    }
    
    // Create new Lenis instance with minimal options to avoid compatibility issues
    lenisRef.current = new Lenis({
      duration: 1.2,
      smoothWheel: true,
    });

    // Create RAF loop for animation
    const raf = (time: number) => {
      if (lenisRef.current) {
        lenisRef.current.raf(time);
      }
      requestAnimationFrame(raf);
    };
    
    // Start animation loop
    const animationId = requestAnimationFrame(raf);

    // Cleanup function
    return () => {
      cancelAnimationFrame(animationId);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="page-transition-wrapper w-full h-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
