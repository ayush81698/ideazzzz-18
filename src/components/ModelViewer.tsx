
import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ModelViewerProps {
  modelUrl: string;
  className?: string;
  autoRotate?: boolean;
  scale?: string;
  cameraControls?: boolean;
  backgroundAlpha?: number;
  fieldOfView?: string;
}

const ModelViewer: React.FC<ModelViewerProps> = ({
  modelUrl,
  className,
  autoRotate = false,
  scale = "1 1 1",
  cameraControls = true,
  backgroundAlpha = 0,
  fieldOfView = "45deg"
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js';
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  return (
    <div ref={containerRef} className={cn("model-container", className)}>
      <div
        dangerouslySetInnerHTML={{
          __html: `
            <model-viewer
              src="${modelUrl}"
              alt="3D model"
              auto-rotate="${autoRotate ? "true" : "false"}"
              rotation-per-second="30deg"
              camera-controls="${cameraControls ? "true" : "false"}"
              shadow-intensity="1"
              exposure="0.75"
              shadow-softness="1"
              environment-image="neutral"
              scale="${scale}"
              field-of-view="${fieldOfView}"
              style="width: 100%; height: 100%; background-color: rgba(0,0,0,${backgroundAlpha});"
            ></model-viewer>
          `
        }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default ModelViewer;
