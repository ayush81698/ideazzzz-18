
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLocation } from 'react-router-dom';
import Lenis from '@studio-freight/lenis';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  const pageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Initialize smooth scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Page transition effect
  useEffect(() => {
    const page = pageRef.current;
    const overlay = overlayRef.current;
    
    if (page && overlay) {
      // Timeline for page transitions
      const tl = gsap.timeline();
      
      // Initial page load animation
      tl.fromTo(page, 
        { opacity: 0, y: 30 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: "power2.out" 
        }
      );
      
      // Animate overlay on route changes
      gsap.set(overlay, { 
        y: '100%',
        opacity: 1 
      });
      
      return () => {
        tl.kill();
      };
    }
  }, [location.pathname]);

  return (
    <div className="page-transition-wrapper">
      {/* Transition overlay */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 bg-black pointer-events-none z-50 opacity-0"
      />
      
      {/* Main content */}
      <div 
        ref={pageRef} 
        className="page-content"
        data-parallax-layers
      >
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
