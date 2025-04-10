
import React, { useEffect, useRef } from 'react';
import '@google/model-viewer';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
}

interface ModelViewerProps {
  src: string;
  ios_src?: string;
  alt: string;
  poster?: string;
  width?: string;
  height?: string;
  ar?: boolean;
  autoRotate?: boolean;
  cameraControls?: boolean;
  environmentImage?: string;
  exposure?: number;
  shadowIntensity?: number;
  className?: string;
}

const ModelViewerComponent: React.FC<ModelViewerProps> = ({
  src,
  ios_src,
  alt,
  poster,
  width = "100%",
  height = "300px",
  ar = true,
  autoRotate = true,
  cameraControls = true,
  environmentImage = "neutral",
  exposure = 1,
  shadowIntensity = 1,
  className = ""
}) => {
  const modelViewerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (modelViewerRef.current) {
      // Any additional setup if needed
    }
  }, []);

  return (
    <model-viewer
      ref={modelViewerRef}
      src={src}
      ios-src={ios_src}
      alt={alt}
      poster={poster}
      ar={ar ? "true" : "false"}
      ar-modes="webxr scene-viewer quick-look"
      camera-controls={cameraControls ? "true" : "false"}
      auto-rotate={autoRotate ? "true" : "false"}
      environment-image={environmentImage}
      exposure={exposure}
      shadow-intensity={shadowIntensity}
      style={{ width, height }}
      className={className}
    >
      <div className="poster" slot="poster">
        {poster && <img src={poster} alt={`${alt} poster`} />}
        <div className="progress-bar hide" slot="progress-bar">
          <div className="update-bar"></div>
        </div>
      </div>
    </model-viewer>
  );
};

export default ModelViewerComponent;
