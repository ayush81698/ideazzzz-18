
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
      .update({ position_data: positionData })
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
