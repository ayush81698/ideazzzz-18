
import { Model, SupabaseModel } from '@/types/models';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Fetch all models from the database
export const fetchModels = async () => {
  try {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    toast.error('Failed to load models');
    return [];
  }
};

// Fetch featured models for the homepage
export const fetchFeaturedModels = async () => {
  try {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .eq('is_featured', true)
      .limit(1);
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching featured models:', error);
    toast.error('Failed to load featured models');
    return [];
  }
};

// Add a new model to the database
export const addModel = async (model: SupabaseModel) => {
  try {
    const { data, error } = await supabase
      .from('models')
      .insert([model])
      .select();
      
    if (error) {
      throw error;
    }
    
    toast.success('Model added successfully');
    return data?.[0];
  } catch (error) {
    console.error('Error adding model:', error);
    toast.error('Failed to add model');
    return null;
  }
};

// Update an existing model
export const updateModel = async (id: string, model: Partial<SupabaseModel>) => {
  try {
    const { data, error } = await supabase
      .from('models')
      .update(model)
      .eq('id', id)
      .select();
      
    if (error) {
      throw error;
    }
    
    toast.success('Model updated successfully');
    return data?.[0];
  } catch (error) {
    console.error('Error updating model:', error);
    toast.error('Failed to update model');
    return null;
  }
};

// Delete a model
export const deleteModel = async (id: string) => {
  try {
    const { error } = await supabase
      .from('models')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    toast.success('Model deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting model:', error);
    toast.error('Failed to delete model');
    return false;
  }
};

// Toggle the featured status of a model
export const toggleFeaturedStatus = async (id: string, isFeatured: boolean) => {
  try {
    // First, if we're setting a model to featured, un-feature any currently featured models
    if (isFeatured) {
      await supabase
        .from('models')
        .update({ is_featured: false })
        .eq('is_featured', true);
    }
    
    // Then update the selected model
    const { data, error } = await supabase
      .from('models')
      .update({ is_featured: isFeatured })
      .eq('id', id)
      .select();
      
    if (error) {
      throw error;
    }
    
    toast.success(`Model ${isFeatured ? 'featured' : 'unfeatured'} successfully`);
    return data?.[0];
  } catch (error) {
    console.error('Error toggling featured status:', error);
    toast.error('Failed to update model status');
    return null;
  }
};

// Update model positions
export const updateModelPosition = async (id: string, positionData: string) => {
  try {
    const { data, error } = await supabase
      .from('models')
      .update({ position: positionData })
      .eq('id', id)
      .select();
      
    if (error) {
      throw error;
    }
    
    toast.success('Model position updated');
    return data?.[0];
  } catch (error) {
    console.error('Error updating model position:', error);
    toast.error('Failed to update model position');
    return null;
  }
};

// Add the missing functions

// Update model feature status (combining the toggle function with a more generic approach)
export const updateModelFeatureStatus = async (model: Model) => {
  try {
    // If featuring this model, unfeature all others
    if (model.is_featured) {
      await supabase
        .from('models')
        .update({ is_featured: false })
        .eq('is_featured', true);
    }
    
    const { data, error } = await supabase
      .from('models')
      .update({ is_featured: model.is_featured })
      .eq('id', model.id)
      .select();
      
    if (error) {
      throw error;
    }
    
    toast.success(`Model ${model.is_featured ? 'featured' : 'unfeatured'} successfully`);
    return data?.[0];
  } catch (error) {
    console.error('Error updating model feature status:', error);
    toast.error('Failed to update model status');
    return null;
  }
};

// Upload model file function
export const uploadModelFile = async (file: File, progressCallback?: (progress: number) => void) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `models/${fileName}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('models')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        onUploadProgress: (progress) => {
          if (progressCallback) {
            const percent = (progress.loaded / progress.total) * 100;
            progressCallback(percent);
          }
        }
      });
    
    if (uploadError) {
      throw uploadError;
    }
    
    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('models')
      .getPublicUrl(filePath);
    
    toast.success('Model file uploaded successfully');
    return publicUrl;
  } catch (error) {
    console.error('Error uploading model file:', error);
    toast.error('Failed to upload model file');
    return null;
  }
};
