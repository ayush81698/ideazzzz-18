
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import './PublicFiguresSlider.css';

interface PublicFigure {
  id: string;
  name: string;
  imageurl: string;
  subtitle?: string;
  description?: string;
  order?: number;
  video_url?: string;
}

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return null;
  
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  if (!youtubeRegex.test(url)) return url;
  
  let videoId = '';
  
  if (url.includes('youtu.be')) {
    videoId = url.split('/').pop() || '';
  } else if (url.includes('youtube.com/watch')) {
    const urlParams = new URLSearchParams(url.split('?')[1]);
    videoId = urlParams.get('v') || '';
  } else if (url.includes('youtube.com/embed')) {
    videoId = url.split('/').pop() || '';
  }
  
  if (!videoId) return url;
  
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0`;
};

const isYouTubeUrl = (url: string) => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be');
};

const PublicFiguresSlider: React.FC = () => {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const fetchFigures = async () => {
      try {
        const { data, error } = await supabase
          .from('public_figures')
          .select('*')
          .order('order', { ascending: true });
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setFigures(data);
        } else {
          setFigures([
            {
              id: '1',
              name: 'Emma Johnson',
              imageurl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
              subtitle: 'Fashion Icon',
              description: 'Collaborated on custom jewelry models'
            },
            {
              id: '2',
              name: 'Michael Chen',
              imageurl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
              subtitle: 'Tech Entrepreneur',
              description: 'Created 3D printed prototype series'
            },
            {
              id: '3',
              name: 'Sarah Williams',
              imageurl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
              subtitle: 'Artist & Designer',
              description: 'Custom art installation pieces'
            },
            {
              id: '4',
              name: 'David Rodriguez',
              imageurl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60',
              subtitle: 'Film Director',
              description: 'Movie prop replicas'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching public figures:', error);
        setFigures([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFigures();
  }, []);

  const handleCardClick = (index: number) => {
    if (isMobile) {
      setActiveIndex(index);
    }
  };

  const activeVideoUrl = figures.length > 0 ? figures[activeIndex].video_url : undefined;

  if (loading) {
    return (
      <div className="py-16 bg-gray-900 flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-ideazzz-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="py-16 overflow-hidden bg-gray-900 relative">
      {activeVideoUrl && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {isYouTubeUrl(activeVideoUrl) ? (
            <iframe
              src={getYouTubeEmbedUrl(activeVideoUrl)}
              className="absolute w-full h-full object-cover"
              style={{ 
                pointerEvents: 'none',
                transform: isMobile ? 'scale(3)' : 'scale(1.9)',
                transformOrigin: 'center center'
              }}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            <video 
              src={activeVideoUrl}
              className="absolute w-full h-full object-cover"
              style={{ 
                transform: isMobile ? 'scale(3)' : 'scale(1.4)',
                transformOrigin: 'center center'
              }}
              autoPlay 
              muted 
              loop 
              playsInline
            />
          )}
          {!isMobile && <div className="absolute inset-0 bg-black bg-opacity-40"></div>}
        </div>
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
          Public Figures We Worked With 
        </h2>
        
        {isMobile ? (
          <div className="w-full max-w-md mx-auto">
            <div className="relative h-[300px] w-full overflow-hidden rounded-xl shadow-xl">
              {figures.map((figure, index) => (
                <div 
                  key={figure.id}
                  className={`absolute inset-0 transition-opacity duration-500 ${
                    index === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                  onClick={() => handleCardClick(index)}
                >
                  <div 
                    className="absolute inset-0" 
                    style={{
                      backgroundImage: `url(${figure.imageurl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  ></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-20 bg-black bg-opacity-50">
                    <h3 className="text-xl font-bold mb-1">{figure.name}</h3>
                    {figure.subtitle && (
                      <p className="text-sm opacity-90 mb-2">{figure.subtitle}</p>
                    )}
                    {figure.description && (
                      <p className="text-sm opacity-75">{figure.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4 gap-3">
              {figures.map((_, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === activeIndex ? 'bg-ideazzz-purple text-white' : 'bg-gray-700 text-gray-300'
                  } hover:bg-ideazzz-purple hover:text-white transition-colors`}
                  onClick={() => setActiveIndex(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="general-container mx-auto w-full md:w-4/5 lg:w-3/4 xl:w-2/3 h-auto md:h-[21rem] flex flex-col md:flex-row">
            {figures.map((figure, index) => (
              <React.Fragment key={figure.id}>
                <input 
                  className="radio" 
                  type="radio" 
                  name="card" 
                  id={`card${index}`} 
                  defaultChecked={index === 0} 
                  onChange={() => setActiveIndex(index)}
                />
                <label 
                  className="content md:flex-1 mb-4 md:mb-0 md:mr-2 relative rounded-3xl overflow-hidden cursor-pointer transition-all" 
                  htmlFor={`card${index}`}
                >
                  <div className="absolute inset-0 w-full h-full" style={{
                    backgroundImage: `url(${figure.imageurl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                  }}></div>
                  
                  <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                  
                  <div className="relative z-10 h-full flex flex-col justify-between p-5">
                    <h1 className="title-card z-10 relative">
                      <span className="marg-bott font-bold text-lg md:text-xl lg:text-2xl text-white">
                        {figure.name}
                      </span>
                      {figure.subtitle && (
                        <span className="subtitle text-sm md:text-base text-white block mt-1">
                          {figure.subtitle}
                        </span>
                      )}
                    </h1>
                    {figure.description && (
                      <h3 className="card-title subsubtitle z-10 relative">
                        <span className="text-white text-sm">{figure.description}</span>
                      </h3>
                    )}
                  </div>
                </label>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(PublicFiguresSlider);
