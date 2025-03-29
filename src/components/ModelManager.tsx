
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Model {
  id: string;
  name: string;
  description: string;
  model_url: string;
  is_featured: boolean;
  position_data?: {
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    scale?: string;
    rotation?: string;
  };
}

interface SupabaseModel {
  name: string;
  description?: string;
  model_url: string;
  is_featured?: boolean;
  position_data?: any;
}

const ModelManager = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [newModel, setNewModel] = useState<Partial<Model>>({
    name: '',
    description: '',
    model_url: '',
    is_featured: false,
    position_data: {
      top: '',
      left: '',
      scale: '1 1 1',
      rotation: '0deg'
    }
  });
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchModels();
  }, []);

  async function fetchModels() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('models')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setModels(data || []);
    } catch (error) {
      console.error('Error fetching models:', error);
      toast({
        title: 'Error',
        description: 'Failed to load models',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('position_data.')) {
      const field = name.split('.')[1];
      
      if (editingModel) {
        setEditingModel({
          ...editingModel,
          position_data: {
            ...editingModel.position_data,
            [field]: value
          }
        });
      } else {
        setNewModel({
          ...newModel,
          position_data: {
            ...newModel.position_data,
            [field]: value
          }
        });
      }
    } else {
      if (editingModel) {
        setEditingModel({ ...editingModel, [name]: value });
      } else {
        setNewModel({ ...newModel, [name]: value });
      }
    }
  };

  const handleFeaturedChange = (checked: boolean) => {
    if (editingModel) {
      setEditingModel({ ...editingModel, is_featured: checked });
    } else {
      setNewModel({ ...newModel, is_featured: checked });
    }
  };

  const addModel = async () => {
    try {
      if (!newModel.name || !newModel.model_url) {
        toast({
          title: 'Validation Error',
          description: 'Model name and URL are required',
          variant: 'destructive',
        });
        return;
      }

      // Create a properly typed object for Supabase
      const modelToInsert: SupabaseModel = {
        name: newModel.name,
        description: newModel.description,
        model_url: newModel.model_url,
        is_featured: newModel.is_featured,
        position_data: newModel.position_data
      };

      const { data, error } = await supabase
        .from('models')
        .insert(modelToInsert)
        .select();

      if (error) throw error;

      setModels([...models, data[0]]);
      setNewModel({
        name: '',
        description: '',
        model_url: '',
        is_featured: false,
        position_data: {
          top: '',
          left: '',
          scale: '1 1 1',
          rotation: '0deg'
        }
      });
      setIsDialogOpen(false);
      
      toast({
        title: 'Success',
        description: 'Model added successfully',
      });
    } catch (error) {
      console.error('Error adding model:', error);
      toast({
        title: 'Error',
        description: 'Failed to add model',
        variant: 'destructive',
      });
    }
  };

  const updateModel = async () => {
    try {
      if (!editingModel || !editingModel.name || !editingModel.model_url) {
        toast({
          title: 'Validation Error',
          description: 'Model name and URL are required',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('models')
        .update(editingModel)
        .eq('id', editingModel.id);

      if (error) throw error;

      setModels(models.map(model => model.id === editingModel.id ? editingModel : model));
      setEditingModel(null);
      setIsDialogOpen(false);
      
      toast({
        title: 'Success',
        description: 'Model updated successfully',
      });
    } catch (error) {
      console.error('Error updating model:', error);
      toast({
        title: 'Error',
        description: 'Failed to update model',
        variant: 'destructive',
      });
    }
  };

  const deleteModel = async (id: string) => {
    try {
      const { error } = await supabase
        .from('models')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setModels(models.filter(model => model.id !== id));
      
      toast({
        title: 'Success',
        description: 'Model deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting model:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete model',
        variant: 'destructive',
      });
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
            <Card key={model.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-start justify-between">
                  <span className="truncate">{model.name}</span>
                  <div className="flex space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="ghost" onClick={() => openEditDialog(model)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit Model</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteModel(model.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete Model</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md mb-3 flex items-center justify-center overflow-hidden">
                  <iframe 
                    src={`https://model-viewer-embed.vercel.app/?src=${encodeURIComponent(model.model_url)}`}
                    className="w-full h-full"
                    title={model.name}
                  />
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{model.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {model.model_url.split('/').pop()?.substring(0, 20)}...
                  </span>
                  <div className="flex items-center">
                    <Label htmlFor={`featured-${model.id}`} className="mr-2 text-xs">Featured</Label>
                    <Switch 
                      id={`featured-${model.id}`} 
                      checked={model.is_featured}
                      disabled
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingModel ? 'Edit Model' : 'Add New Model'}</DialogTitle>
            <DialogDescription>
              {editingModel 
                ? 'Update the details of your 3D model' 
                : 'Enter the details for your new 3D model'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={editingModel?.name || newModel.name}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Model name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                name="description"
                value={editingModel?.description || newModel.description}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Model description"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="model_url" className="text-right">
                Model URL
              </Label>
              <Input
                id="model_url"
                name="model_url"
                value={editingModel?.model_url || newModel.model_url}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="https://example.com/model.glb"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Featured
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch 
                  id="is_featured"
                  checked={editingModel?.is_featured || newModel.is_featured}
                  onCheckedChange={handleFeaturedChange}
                />
                <Label htmlFor="is_featured" className="ml-2">
                  Show on homepage
                </Label>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-2">
              <h4 className="text-sm font-medium mb-2">Position Settings (Optional)</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="position_top" className="text-xs">
                    Top Position
                  </Label>
                  <Input
                    id="position_top"
                    name="position_data.top"
                    value={editingModel?.position_data?.top || newModel.position_data?.top || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="e.g., 10%"
                  />
                </div>
                
                <div>
                  <Label htmlFor="position_left" className="text-xs">
                    Left Position
                  </Label>
                  <Input
                    id="position_left"
                    name="position_data.left"
                    value={editingModel?.position_data?.left || newModel.position_data?.left || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="e.g., 20%"
                  />
                </div>
                
                <div>
                  <Label htmlFor="scale" className="text-xs">
                    Scale
                  </Label>
                  <Input
                    id="scale"
                    name="position_data.scale"
                    value={editingModel?.position_data?.scale || newModel.position_data?.scale || '1 1 1'}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="e.g., 1 1 1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="rotation" className="text-xs">
                    Initial Rotation
                  </Label>
                  <Input
                    id="rotation"
                    name="position_data.rotation"
                    value={editingModel?.position_data?.rotation || newModel.position_data?.rotation || '0deg'}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="e.g., 45deg"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-ideazzz-purple hover:bg-ideazzz-purple/90"
              onClick={editingModel ? updateModel : addModel}
            >
              {editingModel ? 'Update' : 'Add'} Model
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ModelManager;
