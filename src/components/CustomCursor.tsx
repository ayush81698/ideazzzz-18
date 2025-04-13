
import React, { useEffect, useRef } from 'react';
import { useThemeContext } from '@/providers/ThemeProvider';

// Custom cursor component that respects theme
const CustomCursor: React.FC = () => {
  const { theme } = useThemeContext();
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    window.addEventListener('mousemove', onMouseMove);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  // Return null on mobile devices to disable custom cursor
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return null;
  }

  return (
    <div 
      ref={cursorRef}
      className={`fixed w-6 h-6 rounded-full pointer-events-none z-[9999] transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference ${
        theme === 'dark' ? 'bg-white' : 'bg-black'
      }`}
      style={{
        transition: 'transform 0.2s ease-out',
      }}
    />
  );
};

export default CustomCursor;
