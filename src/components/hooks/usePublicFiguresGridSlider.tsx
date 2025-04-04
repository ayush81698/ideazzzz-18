
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PublicFigure {
  id: string;
  name: string;
  imageurl: string;
}

export const usePublicFiguresGridSlider = () => {
  const [figures, setFigures] = useState<PublicFigure[]>([]);
  const [figuresGalleries, setFiguresGalleries] = useState<PublicFigure[][]>([]);
  
  // Fetch public figures from Supabase
  useEffect(() => {
    const fetchFigures = async () => {
      try {
        const { data, error } = await supabase
          .from('public_figures')
          .select('*');
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          setFigures(data);
        } else {
          // Fallback data if no figures are found
          setFigures([
            {
              id: '1',
              name: 'Emma Johnson',
              imageurl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
            },
            {
              id: '2',
              name: 'Michael Chen',
              imageurl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
            },
            {
              id: '3',
              name: 'Sarah Williams',
              imageurl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
            },
            {
              id: '4',
              name: 'David Rodriguez',
              imageurl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
            },
            {
              id: '5',
              name: 'Aisha Patel',
              imageurl: 'https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching public figures:', error);
        setFigures([]);
      }
    };
    
    fetchFigures();
  }, []);

  // Create 2 different galleries with different ordering of figures
  useEffect(() => {
    if (figures.length === 0) return;

    // Duplicate figures to ensure we have enough for the display
    const extendedFigures = [...figures];
    
    // Keep duplicating until we have at least 10 figures
    while (extendedFigures.length < 10) {
      extendedFigures.push(...figures);
    }
    
    // Create two galleries with different ordering
    const gallery1 = [...extendedFigures];
    
    // Create a second gallery with a different order
    // We'll reverse the array and shift it to ensure different content appears side by side
    const gallery2 = [...extendedFigures].reverse();
    
    // Shift the second gallery to ensure different figures appear in parallel positions
    if (gallery2.length > 3) {
      // Take first few items and push them to the end
      const firstItems = gallery2.splice(0, 3);
      gallery2.push(...firstItems);
    }
    
    setFiguresGalleries([gallery1, gallery2]);
  }, [figures]);

  return { figures, figuresGalleries };
};
