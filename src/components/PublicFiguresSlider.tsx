
import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { PublicFigure } from '@/types/models';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './PublicFiguresSlider.css';
import { usePublicFiguresGridSlider } from './hooks/usePublicFiguresGridSlider';

interface PublicFiguresSliderProps {
  publicFigures: PublicFigure[];
  loading: boolean;
}

const PublicFiguresSlider: React.FC<PublicFiguresSliderProps> = ({ publicFigures, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const transitionDuration = 0.5;
  const [showGrid, setShowGrid] = useState(false);
  
  const { GridView } = usePublicFiguresGridSlider({
    publicFigures,
    currentIndex,
    setCurrentIndex
  });

  useEffect(() => {
    if (!loading && publicFigures.length > 0 && videoRef.current) {
      const video = videoRef.current;
      let videoSrc = publicFigures[currentIndex]?.video_url || '';
      
      // Check if the video URL is a YouTube URL and convert it to a direct MP4 URL if possible
      // Note: This is a simplified check, won't work for all YouTube URL formats
      if (videoSrc && videoSrc.includes('youtube.com/watch')) {
        // For demonstration purposes, we'll use a fallback video instead
        videoSrc = 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4';
      }
      
      if (videoSrc) {
        video.src = videoSrc;
        video.load();
        video.play().catch(err => console.error('Error playing video:', err));
      }
    }
  }, [currentIndex, loading, publicFigures]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === publicFigures.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? publicFigures.length - 1 : prevIndex - 1
    );
  };

  const toggleEnlargedImage = (imageUrl?: string) => {
    if (imageUrl) {
      setEnlargedImage(imageUrl);
    } else {
      setEnlargedImage(null);
    }
  };

  if (loading || publicFigures.length === 0) {
    return (
      <div className="public-figures-slider flex items-center justify-center">
        <div className="slider-content">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
            <p className="mt-4 text-xl">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  const currentFigure = publicFigures[currentIndex];

  return (
    <div className="public-figures-slider">
      <video
        ref={videoRef}
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src={currentFigure?.video_url || ''}
          type="video/mp4"
        />
      </video>

      <div className="slider-content">
        <div className="flex flex-col h-full justify-center">
          <div className="container mx-auto px-4">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: transitionDuration }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            >
              <div className="flex flex-col space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold">
                  {currentFigure.name}
                </h2>
                <h3 className="text-xl md:text-2xl text-gray-200">
                  {currentFigure.subtitle}
                </h3>
                <p className="text-lg max-w-lg">
                  {currentFigure.description}
                </p>
              </div>
              <div className="flex justify-center">
                <img
                  src={currentFigure.imageurl}
                  alt={currentFigure.name}
                  className="figure-image w-full max-w-md rounded-lg shadow-2xl"
                  onClick={() => toggleEnlargedImage(currentFigure.imageurl)}
                />
              </div>
            </motion.div>
          </div>

          <div className="container mx-auto px-4 mt-8">
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePrev}
                variant="outline"
                className="bg-black bg-opacity-30 text-white border-white hover:bg-black hover:bg-opacity-50"
              >
                <ArrowLeft className="mr-2" size={16} /> Previous
              </Button>
              <Button
                onClick={() => setShowGrid(!showGrid)}
                variant="outline"
                className="bg-black bg-opacity-30 text-white border-white hover:bg-black hover:bg-opacity-50"
              >
                {showGrid ? 'Hide All' : 'Show All'}
              </Button>
              <Button
                onClick={handleNext}
                variant="outline"
                className="bg-black bg-opacity-30 text-white border-white hover:bg-black hover:bg-opacity-50"
              >
                Next <ArrowRight className="ml-2" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showGrid && <GridView />}
      </AnimatePresence>

      {/* Enlarged image overlay */}
      {enlargedImage && (
        <div 
          className="enlarged-image-container"
          onClick={() => toggleEnlargedImage()}
        >
          <img 
            src={enlargedImage} 
            alt="Enlarged view" 
            className="enlarged-image"
          />
        </div>
      )}
    </div>
  );
};

export default PublicFiguresSlider;
