
import React from 'react';
import { ModelViewerProps } from './ModelViewerProps';

/**
 * Fallback viewer for devices where AR is not supported
 */
const UnsupportedARViewer: React.FC<ModelViewerProps> = ({
  src,
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
  // Determine whether the device is iOS
  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);

  return (
    <div className={`ar-unsupported ${className}`} style={{ width, height, position: 'relative' }}>
      <model-viewer
        ref={el => {
          // Intentionally empty, we don't need to do anything with the ref here
        }}
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
      />
      <div 
        className="ar-unsupported-message"
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          backgroundColor: '#fff',
          color: '#000',
          padding: '8px 16px',
          borderRadius: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          zIndex: 10,
          fontSize: '14px',
          maxWidth: '80%'
        }}
      >
        <p>AR not supported on this device/browser</p>
        {isIOS && <p>iOS device requires USDZ model file</p>}
      </div>
    </div>
  );
};

export default UnsupportedARViewer;
