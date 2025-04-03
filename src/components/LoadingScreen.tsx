
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Simulate loading time or use actual loading detection
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onLoadingComplete) onLoadingComplete();
    }, 2500); // Adjust time as needed

    return () => clearTimeout(timer);
  }, [onLoadingComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md ${
        !isVisible ? 'pointer-events-none' : ''
      }`}
    >
      <div className="relative w-24 h-24 md:w-32 md:h-32">
        <svg className="hand" viewBox="0 0 32 20" width="100%" height="100%">
          <clipPath id="finger-pinky">
            <rect rx="2.5" ry="2.5" width="6" height="15" />
          </clipPath>
          <clipPath id="finger-ring">
            <rect rx="2.5" ry="2.5" width="6" height="18" />
          </clipPath>
          <clipPath id="finger-middle">
            <rect rx="2.5" ry="2.5" width="6" height="20" />
          </clipPath>
          <clipPath id="finger-index">
            <rect rx="2.5" ry="2.5" width="6" height="17" />
          </clipPath>
          <clipPath id="finger-thumb">
            <rect width="6" height="15.2" />
          </clipPath>
          <g className="hand__finger hand__finger--pinky" transform="translate(0,3.5)" clipPath="url(#finger-pinky)">
            <g className="hand__finger-inner">
              <rect className="hand__skin" rx="2.5" ry="2.5" width="6" height="15" />
              <rect rx="0.25" ry="0.25" width="3" height="0.5" x="1.5" y="1.5" />
              <rect rx="0.25" ry="0.25" width="3" height="0.5" x="1.5" y="2.5" />
              <path className="hand__nail" d="M 2 10 H 4 A 1 1 0 0 1 5 11 V 12 A 2 2 0 0 1 3 14 H 3 A 2 2 0 0 1 1 12 V 11 A 1 1 0 0 1 2 10 Z" />
            </g>
          </g>
          <g className="hand__finger hand__finger--ring" transform="translate(6.5,1.8)" clipPath="url(#finger-ring)">
            <g className="hand__finger-inner">
              <rect className="hand__skin" rx="2.5" ry="2.5" width="6" height="18" />
              <rect rx="0.25" ry="0.25" width="3" height="0.5" x="1.5" y="1.5" />
              <rect rx="0.25" ry="0.25" width="3" height="0.5" x="1.5" y="2.5" />
              <path className="hand__nail" d="M 2 13 H 4 A 1 1 0 0 1 5 14 V 15 A 2 2 0 0 1 3 17 H 3 A 2 2 0 0 1 1 15 V 14 A 1 1 0 0 1 2 13 Z" />
            </g>
          </g>
          <g className="hand__finger hand__finger--middle" transform="translate(13,0)" clipPath="url(#finger-middle)">
            <g className="hand__finger-inner">
              <rect className="hand__skin" rx="2.5" ry="2.5" width="6" height="20" />
              <rect rx="0.25" ry="0.25" width="3" height="0.5" x="1.5" y="1.5" />
              <rect rx="0.25" ry="0.25" width="3" height="0.5" x="1.5" y="2.5" />
              <path className="hand__nail" d="M 2 15 H 4 A 1 1 0 0 1 5 16 V 17 A 2 2 0 0 1 3 19 H 3 A 2 2 0 0 1 1 17 V 16 A 1 1 0 0 1 2 15 Z" />
            </g>
          </g>
          <g className="hand__finger hand__finger--index" transform="translate(19.5,2.5)" clipPath="url(#finger-index)">
            <g className="hand__finger-inner">
              <rect className="hand__skin" rx="2.5" ry="2.5" width="6" height="17" />
              <rect rx="0.25" ry="0.25" width="3" height="0.5" x="1.5" y="1.5" />
              <rect rx="0.25" ry="0.25" width="3" height="0.5" x="1.5" y="2.5" />
              <path className="hand__nail" d="M 2 12 H 4 A 1 1 0 0 1 5 13 V 14 A 2 2 0 0 1 3 16 H 3 A 2 2 0 0 1 1 14 V 13 A 1 1 0 0 1 2 12 Z" />
            </g>
          </g>
          <g className="hand__finger hand__finger--thumb" transform="translate(26,0)" clipPath="url(#finger-thumb)">
            <g className="hand__finger-inner">
              <path className="hand__skin" d="M 0 0 C 0 0 0.652 0.986 1.494 1.455 C 2.775 2.169 6 0.763 6 3.018 C 6 5.197 4.62 7 2.61 7 C 1.495 7 0 7 0 7 L 0 0 Z" transform="translate(0,8.2)" />
            </g>
          </g>
        </svg>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
