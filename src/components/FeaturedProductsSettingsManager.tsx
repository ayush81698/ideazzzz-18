
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Switch } from "@/components/ui/switch";

interface FeaturedProductsSettings {
  id: string;
  background_type: 'image' | 'youtube' | 'color';
  background_value: string;
  title: string;
  subtitle: string;
  active: boolean;
}

const FeaturedProductsSettingsManager = () => {
  const [settings, setSettings] = useState<FeaturedProductsSettings>({
    id: '',
    background_type: 'image',
    background_value: '',
    title: 'Featured Products',
    subtitle: 'Explore our handpicked collection of premium 3D models and services',
    active: true
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('content')
          .select('*')
          .eq('section', 'featured_products')
          .eq('id', 'settings')
          .single();
          
        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching featured products settings:', error);
          toast.error('Failed to load settings');
          return;
        }
        
        if (data) {
          try {
            const parsedContent = data.content ? 
              (typeof data.content === 'string' ? JSON.parse(data.content) : data.content) : 
              {};
              
            setSettings({
              id: data.id,
              background_type: parsedContent.background_type || 'image',
              background_value: parsedContent.background_value || '',
              title: data.title || 'Featured Products',
              subtitle: parsedContent.subtitle || 'Explore our handpicked collection of premium 3D models and services',
              active: parsedContent.active !== false
            });
          } catch (e) {
            console.error('Error parsing content JSON:', e);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load settings');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // First, check if we need to create the content table
      try {
        const { error: checkError } = await supabase
          .from('content')
          .select('id')
          .limit(1);
          
        if (checkError && checkError.message.includes('does not exist')) {
          // Create content table if it doesn't exist
          await fetch(`${import.meta.env.VITE_SUPABASE_URL || "https://isjcanepamlbwrxujuvz.supabase.co"}/rest/v1/sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzamNhbmVwYW1sYndyeHVqdXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNjMyMDQsImV4cCI6MjA1ODYzOTIwNH0.ue75CyIzjYJ6WZW7mMImLiGij0KW0JpU5FrDXubpusc",
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzamNhbmVwYW1sYndyeHVqdXZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMwNjMyMDQsImV4cCI6MjA1ODYzOTIwNH0.ue75CyIzjYJ6WZW7mMImLiGij0KW0JpU5FrDXubpusc"}`
            },
            body: JSON.stringify({
              query: `
                CREATE TABLE IF NOT EXISTS public.content (
                  id TEXT NOT NULL,
                  section TEXT NOT NULL,
                  title TEXT,
                  content JSONB,
                  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
                  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
                  PRIMARY KEY (id, section)
                );
              `
            })
          });
        }
      } catch (err) {
        console.error("Error checking or creating content table:", err);
      }
      
      const contentJson = JSON.stringify({
        background_type: settings.background_type,
        background_value: settings.background_value,
        subtitle: settings.subtitle,
        active: settings.active
      });
      
      // Use explicit insert or update approach to avoid ON CONFLICT issues
      const { data: existingData } = await supabase
        .from('content')
        .select('id')
        .eq('id', 'settings')
        .eq('section', 'featured_products')
        .single();
      
      let error;
      
      if (existingData) {
        // If record exists, update it
        const { error: updateError } = await supabase
          .from('content')
          .update({
            title: settings.title,
            content: contentJson,
            updated_at: new Date().toISOString()
          })
          .eq('id', 'settings')
          .eq('section', 'featured_products');
          
        error = updateError;
      } else {
        // If record doesn't exist, insert it
        const { error: insertError } = await supabase
          .from('content')
          .insert({
            id: 'settings',
            section: 'featured_products',
            title: settings.title,
            content: contentJson
          });
          
        error = insertError;
      }
        
      if (error) {
        console.error('Error saving settings:', error);
        toast.error('Failed to save settings: ' + error.message);
        return;
      }
      
      toast.success('Settings saved successfully');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings: ' + (error.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  const handleBackgroundTypeChange = (type: 'image' | 'youtube' | 'color') => {
    setSettings({
      ...settings,
      background_type: type,
      background_value: ''
    });
  };

  const getBackgroundInput = () => {
    switch (settings.background_type) {
      case 'youtube':
        return (
          <div className="space-y-2">
            <Label htmlFor="youtube_url">YouTube Video URL</Label>
            <Input
              id="youtube_url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={settings.background_value}
              onChange={(e) => setSettings({ ...settings, background_value: e.target.value })}
            />
            <p className="text-xs text-gray-500">
              Enter a YouTube URL. The video will be used as background.
            </p>
            
            {settings.background_value && (
              <div className="mt-4 aspect-video rounded-md overflow-hidden">
                <iframe
                  src={`https://www.youtube.com/embed/${getYoutubeVideoId(settings.background_value)}`}
                  width="100%"
                  height="100%"
                  title="YouTube preview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                ></iframe>
              </div>
            )}
          </div>
        );
        
      case 'color':
        return (
          <div className="space-y-2">
            <Label htmlFor="color_value">Background Color</Label>
            <div className="flex items-center gap-3">
              <Input
                id="color_value"
                type="text"
                placeholder="#f3f4f6"
                value={settings.background_value}
                onChange={(e) => setSettings({ ...settings, background_value: e.target.value })}
              />
              <Input
                type="color"
                value={settings.background_value}
                onChange={(e) => setSettings({ ...settings, background_value: e.target.value })}
                className="w-12 h-10 p-1"
              />
            </div>
            <p className="text-xs text-gray-500">
              Enter a color value (HEX or color name)
            </p>
            
            {settings.background_value && (
              <div 
                className="mt-4 h-20 rounded-md"
                style={{ backgroundColor: settings.background_value }}
              ></div>
            )}
          </div>
        );
        
      default: // image
        return (
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={settings.background_value}
              onChange={(e) => setSettings({ ...settings, background_value: e.target.value })}
            />
            <p className="text-xs text-gray-500">
              Enter the URL of an image to use as background
            </p>
            
            {settings.background_value && (
              <div className="mt-4 rounded-md overflow-hidden">
                <img
                  src={settings.background_value}
                  alt="Background preview"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://placehold.co/600x400?text=Invalid+Image';
                  }}
                />
              </div>
            )}
          </div>
        );
    }
  };

  const getYoutubeVideoId = (url: string): string => {
    if (!url) return '';
    
    let videoId = '';
    
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
    } else if (url.includes('youtube.com/watch')) {
      const urlParams = new URLSearchParams(url.split('?')[1]);
      videoId = urlParams.get('v') || '';
    } else if (url.includes('youtube.com/embed/')) {
      videoId = url.split('youtube.com/embed/')[1]?.split('?')[0] || '';
    }
    
    return videoId;
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ideazzz-purple"></div>
      </div>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Featured Products Settings</CardTitle>
        <CardDescription>Customize how the featured products section appears on your homepage</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="section_title">Section Title</Label>
          <Input
            id="section_title"
            value={settings.title}
            onChange={(e) => setSettings({ ...settings, title: e.target.value })}
            placeholder="Featured Products"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="section_subtitle">Section Subtitle</Label>
          <Input
            id="section_subtitle"
            value={settings.subtitle}
            onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
            placeholder="Explore our handpicked collection of premium 3D models and services"
          />
        </div>
        
        <div className="space-y-2 border-t pt-4">
          <Label>Background Type</Label>
          <div className="flex flex-wrap gap-3 mt-2">
            <Button 
              variant={settings.background_type === 'image' ? 'default' : 'outline'}
              onClick={() => handleBackgroundTypeChange('image')}
              size="sm"
            >
              Image
            </Button>
            <Button 
              variant={settings.background_type === 'youtube' ? 'default' : 'outline'}
              onClick={() => handleBackgroundTypeChange('youtube')}
              size="sm"
            >
              YouTube Video
            </Button>
            <Button 
              variant={settings.background_type === 'color' ? 'default' : 'outline'}
              onClick={() => handleBackgroundTypeChange('color')}
              size="sm"
            >
              Color
            </Button>
          </div>
        </div>
        
        {getBackgroundInput()}
        
        <div className="flex items-center space-x-2 border-t pt-4">
          <Switch 
            id="active-status" 
            checked={settings.active}
            onCheckedChange={(checked) => setSettings({ ...settings, active: checked })}
          />
          <Label htmlFor="active-status">Show featured products section</Label>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeaturedProductsSettingsManager;
