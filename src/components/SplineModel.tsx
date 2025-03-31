
import React, { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Progress } from '@/components/ui/progress';

interface SplineModelProps {
  scene: string;
  className?: string;
  performance?: boolean; // Added performance prop
}

const SplineModel: React.FC<SplineModelProps> = ({ scene, className, performance = false }) => {
  const [loading, setLoading] = useState(true);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-50">
          <div className="text-white mb-4">Loading 3D Model...</div>
          <Progress value={50} className="w-64 h-2" />
        </div>
      )}
      <Spline 
        scene={scene} 
        onLoad={handleLoad} 
        style={{ width: '100%', height: '100%' }}
        {...(performance ? { performance: 'economy' } : {})}
      />
    </div>
  );
};

export default SplineModel;
