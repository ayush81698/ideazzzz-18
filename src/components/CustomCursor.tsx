
import React, { useEffect, useState, useRef } from 'react';

const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    // Function to update cursor position
    const editCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
      setIsVisible(true);
    };

    // Function to handle hover effects on interactive elements
    const handleHoverStart = () => setIsHovering(true);
    const handleHoverEnd = () => setIsHovering(false);

    // Add event listeners to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, [role="button"], .interactive');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', handleHoverStart);
      el.addEventListener('mouseleave', handleHoverEnd);
    });

    // Hide cursor when leaving window
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Add event listeners
    window.addEventListener('mousemove', editCursor);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    // Set cursor property on body
    document.body.style.cursor = 'none';

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', editCursor);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
      document.body.style.cursor = '';
      
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', handleHoverStart);
        el.removeEventListener('mouseleave', handleHoverEnd);
      });
    };
  }, []);

  // Don't show custom cursor on mobile/touch devices
  useEffect(() => {
    const isTouchDevice = ('ontouchstart' in window) || 
                          (navigator.maxTouchPoints > 0) ||
                          ((navigator as any).msMaxTouchPoints > 0);
    
    if (isTouchDevice) {
      setIsVisible(false);
      document.body.style.cursor = '';
    }
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className={`fixed w-5 h-5 bg-white rounded-full pointer-events-none mix-blend-difference z-[9999] transition-transform duration-150 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${
        isHovering ? 'scale-[3]' : 'scale-100'
      }`}
      style={{ 
        left: '-100px', 
        top: '-100px' 
      }}
    />
  );
};

export default CustomCursor;
