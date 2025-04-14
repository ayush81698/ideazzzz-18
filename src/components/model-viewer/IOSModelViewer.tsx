
import React from 'react';
import { ModelViewerProps } from './ModelViewerProps';

/**
 * iOS-specific model viewer with AR Quick Look support
 */
const IOSModelViewer: React.FC<ModelViewerProps> = ({
  src,
  ios_src,
  alt,
  poster,
  width = "100%",
  height = "300px",
  autoRotate = true,
  cameraControls = true,
  environmentImage = "neutral",
  exposure = 1,
  shadowIntensity = 1,
  className = "",
}) => {
  // Guard against SSR/hydration issues
  if (typeof window === 'undefined') return null;

  return (
    <div className={`ios-ar-container ${className}`} style={{ width, height, position: 'relative' }}>
      {/* Standard model viewer for display */}
      <model-viewer
        src={src}
        alt={alt}
        poster={poster}
        camera-controls={cameraControls ? "true" : "false"}
        auto-rotate={autoRotate ? "true" : "false"}
        environment-image={environmentImage}
        exposure={exposure}
        shadow-intensity={shadowIntensity}
        style={{ width: '100%', height: '100%' }}
        loading="eager"
      >
        <div className="poster" slot="poster">
          {poster && <img src={poster} alt={`${alt} poster`} />}
          <div className="progress-bar hide" slot="progress-bar">
            <div className="update-bar"></div>
          </div>
        </div>
      </model-viewer>
      
      {/* iOS AR Quick Look link - styled to be very visible */}
      <a 
        href={ios_src}
        rel="ar" 
        className="ios-ar-button"
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          backgroundColor: '#fff',
          color: '#000',
          padding: '8px 16px',
          borderRadius: '20px',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          zIndex: 10,
          fontWeight: 'bold'
        }}
      >
        <span style={{ marginRight: '6px' }}>🍏</span> View in AR
      </a>
    </div>
  );
};

export default IOSModelViewer;
