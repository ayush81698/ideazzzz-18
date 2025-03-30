
import React, { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { Model } from '@/types/models';
import ModelCard from './ModelCard';
import ModelDialog from './ModelDialog';
import { 
  fetchModels, 
  addModel, 
  updateModel, 
  deleteModel,
  updateModelFeatureStatus,
  uploadModelFile
} from '@/services/modelService';

const ModelManager = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast: useToastFn } = useToast();

  useEffect(() => {
    loadModels();
  }, []);

  async function loadModels() {
    try {
      setLoading(true);
      const modelData = await fetchModels();
      
      if (modelData && modelData.length > 0) {
        setModels(modelData);
      } else {
        setModels([]);
        toast.info('No models found. Add your first 3D model!');
      }
    } catch (error) {
      console.error('Error loading models:', error);
      useToastFn({
        title: 'Error',
        description: 'Failed to load models',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleSaveModel = async (modelData: Partial<Model>, selectedFile: File | null) => {
    try {
      if (!modelData.name) {
        toast.error('Model name is required');
        return;
      }

      setUploading(true);
      let modelUrl = modelData.model_url;
      
      // Handle file upload if a new file is selected
      if (selectedFile) {
        const uploadedUrl = await uploadModelFile(selectedFile, (progress) => {
          setUploadProgress(progress);
        });
        
        if (uploadedUrl) {
          modelUrl = uploadedUrl;
        } else {
          setUploading(false);
          return;
        }
      } else if (!modelUrl) {
        toast.error('Please provide a model URL or upload a file');
        setUploading(false);
        return;
      }

      const positionJson = modelData.position_data ? JSON.stringify(modelData.position_data) : null;

      if (editingModel) {
        // Update existing model
        await updateModel(editingModel.id, {
          ...modelData,
          model_url: modelUrl,
          position: positionJson,
        });

        setModels(models.map(model => 
          model.id === editingModel.id 
            ? { ...model, ...modelData, model_url: modelUrl, position: positionJson } 
            : model
        ));
        
        toast.success('Model updated successfully');
        if (modelData.is_featured) {
          toast.info('Model updated on homepage. Refresh to see changes!');
        }
      } else {
        // Add new model
        const modelToInsert = {
          name: modelData.name,
          description: modelData.description,
          model_url: modelUrl,
          is_featured: modelData.is_featured,
          position: positionJson
        };

        const newModel = await addModel(modelToInsert);
        if (newModel) {
          setModels([...models, newModel]);
          toast.success('Model added successfully');
          
          if (newModel.is_featured) {
            toast.info('Model added to homepage. Refresh to see it!');
          }
        }
      }
      
      // Reset state
      setEditingModel(null);
      
    } catch (error) {
      console.error('Error saving model:', error);
      toast.error(`Failed to ${editingModel ? 'update' : 'add'} model`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDeleteModel = async (id: string) => {
    try {
      await deleteModel(id);
      setModels(models.filter(model => model.id !== id));
      toast.success('Model deleted successfully');
    } catch (error) {
      toast.error('Failed to delete model');
    }
  };

  const handleFeatureChange = async (model: Model) => {
    try {
      await updateModelFeatureStatus(model);
      setModels(models.map(m => m.id === model.id ? model : m));
      toast.success(`Model ${model.is_featured ? 'added to' : 'removed from'} homepage`);
      
      if (model.is_featured) {
        toast.info('Refresh the homepage to see your changes');
      }
    } catch (error) {
      toast.error('Failed to update model feature status');
    }
  };

  const openEditDialog = (model: Model) => {
    setEditingModel(model);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingModel(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">3D Models</h2>
        <Button onClick={openAddDialog} className="bg-ideazzz-purple hover:bg-ideazzz-purple/90">
          <Plus className="h-4 w-4 mr-2" /> Add New Model
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ideazzz-purple"></div>
        </div>
      ) : models.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <p className="text-muted-foreground mb-4">No models found. Add your first 3D model!</p>
            <Button onClick={openAddDialog} variant="outline">
              <Plus className="h-4 w-4 mr-2" /> Add Model
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <ModelCard 
              key={model.id}
              model={model}
              onEdit={openEditDialog}
              onDelete={handleDeleteModel}
              onFeatureChange={handleFeatureChange}
            />
          ))}
        </div>
      )}

      <ModelDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingModel={editingModel}
        onSave={handleSaveModel}
      />
    </div>
  );
};

export default ModelManager;
