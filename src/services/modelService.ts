
import { supabase } from '@/integrations/supabase/client';
import { Model, SupabaseModel } from '@/types/models';
import { toast } from 'sonner';

export async function fetchModels() {
  try {
    const { data, error } = await supabase
      .from('models')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    console.info('Models data received:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching models:', error);
    throw error;
  }
}

export async function addModel(modelToInsert: SupabaseModel) {
  try {
    const { data, error } = await supabase
      .from('models')
      .insert(modelToInsert)
      .select();

    if (error) throw error;
    return data ? data[0] : null;
  } catch (error) {
    console.error('Error adding model:', error);
    throw error;
  }
}

export async function updateModel(id: string, modelToUpdate: Partial<Model>) {
  try {
    const { position_data, ...modelToSend } = modelToUpdate as any;

    const { error } = await supabase
      .from('models')
      .update(modelToSend)
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating model:', error);
    throw error;
  }
}

export async function deleteModel(id: string) {
  try {
    const { error } = await supabase
      .from('models')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting model:', error);
    throw error;
  }
}

export async function updateModelFeatureStatus(model: Model) {
  try {
    const { error } = await supabase
      .from('models')
      .update({ is_featured: model.is_featured })
      .eq('id', model.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating model feature status:', error);
    throw error;
  }
}

export async function uploadModelFile(file: File, onProgressUpdate: (progress: number) => void) {
  if (!file) {
    toast.error('Please select a file to upload');
    return null;
  }

  try {
    onProgressUpdate(0);
    toast.info('Uploading model file, please wait...');

    // Create storage bucket if it doesn't exist
    const { data: buckets } = await supabase.storage.listBuckets();
    const modelsBucketExists = buckets?.some(bucket => bucket.name === 'models');
    
    if (!modelsBucketExists) {
      const { error } = await supabase.storage.createBucket('models', {
        public: true
      });
      
      if (error) {
        throw new Error(`Failed to create storage bucket: ${error.message}`);
      }
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Simulate progress animation
    const progressInterval = setInterval(() => {
      onProgressUpdate(prev => {
        // Simulate progress from 0 to 95%
        if (prev < 95) {
          return prev + 5;
        }
        return prev;
      });
    }, 200);

    // Upload the file
    const { error: uploadError } = await supabase.storage
      .from('models')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }
    
    // Complete the progress
    clearInterval(progressInterval);
    onProgressUpdate(100);

    const { data: { publicUrl } } = supabase.storage
      .from('models')
      .getPublicUrl(filePath);

    toast.success('File uploaded successfully');
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    toast.error('Failed to upload file');
    return null;
  }
}
