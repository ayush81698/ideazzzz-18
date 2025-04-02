
import React, { useState, useEffect } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
}

export const Image = React.memo(({
  src,
  alt,
  className,
  width,
  height,
  loading = 'lazy',
  objectFit = 'cover',
  priority = false,
  ...props
}: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setError(false);
    
    // If priority is true, preload the image
    if (priority && src) {
      const img = new window.Image();
      img.src = src;
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setError(true);
    }
  }, [src, priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
  };

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ 
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : '100%',
      }}
    >
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
          <span className="sr-only">Loading...</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <span className="text-sm text-gray-500">Failed to load image</span>
        </div>
      )}
      <img
        src={src}
        alt={alt || ''}
        className={`${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 h-full w-full`}
        style={{ objectFit }}
        loading={priority ? 'eager' : loading}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
    </div>
  );
});

Image.displayName = 'Image';
