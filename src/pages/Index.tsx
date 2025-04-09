
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import PublicFiguresSlider from '@/components/PublicFiguresSlider';
import { PublicFigure } from '@/types/models';

const Index = () => {
  const [publicFigures, setPublicFigures] = useState<PublicFigure[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicFigures = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('public_figures')
          .select('*')
          .order('order', { ascending: true });

        if (error) {
          throw error;
        }

        // Use actual data if available, otherwise use fallback data
        if (data && data.length > 0) {
          console.log("Using real public figures data:", data);
          setPublicFigures(data);
        } else {
          // This is fallback data in case the database is empty
          console.log("Using fallback public figures data");
          setPublicFigures([
            {
              id: '1',
              name: 'Sarah Johnson',
              subtitle: '3D Artist',
              description: 'Award-winning 3D artist with over 10 years of experience in creating hyperrealistic models and environments.',
              imageurl: '/lovable-uploads/6b787a6d-ec96-492c-9e23-419a0a02a642.png',
              video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4',
              order: 1
            },
            {
              id: '2',
              name: 'Michael Chen',
              subtitle: 'VR Developer',
              description: 'Michael specializes in creating immersive VR experiences with a focus on interactive environments and physics-based interactions.',
              imageurl: '/lovable-uploads/6b787a6d-ec96-492c-9e23-419a0a02a642.png',
              video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4',
              order: 2
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching public figures:', error);
        toast.error('Failed to load public figures');
        // Still use fallback data in case of error
        setPublicFigures([
          {
            id: '1',
            name: 'Sarah Johnson',
            subtitle: '3D Artist',
            description: 'Award-winning 3D artist with over 10 years of experience in creating hyperrealistic models and environments.',
            imageurl: '/lovable-uploads/6b787a6d-ec96-492c-9e23-419a0a02a642.png',
            video_url: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-1240-large.mp4',
            order: 1
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicFigures();
  }, []);

  return (
    <div className="relative w-full">
      <PublicFiguresSlider publicFigures={publicFigures} loading={loading} />
      {/* FloatingModels component has been removed */}
    </div>
  );
};

export default Index;
