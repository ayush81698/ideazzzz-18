
import React, { ReactNode, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Lenis from '@studio-freight/lenis';

interface PageTransitionProps {
  children: ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize lenis for smooth scrolling
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        mouseMultiplier: 1,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      });

      // Function to update lenis on animation frame
      function raf(time: number) {
        lenisRef.current?.raf(time);
        requestAnimationFrame(raf);
      }

      // Start animation loop
      requestAnimationFrame(raf);
    }

    // Cleanup function
    return () => {
      lenisRef.current?.destroy();
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="page-transition-wrapper"
    >
      <div className="page-content">{children}</div>
    </motion.div>
  );
};

export default PageTransition;
