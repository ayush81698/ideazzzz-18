import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast } from 'sonner';
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
import { Textarea } from '@/components/ui/textarea';
import { Pencil, Trash2, Plus, X, Upload, RotateCw } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PositionData {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  scale?: string;
  rotation?: string;
  zIndex?: number;
  angleX?: string;
  angleY?: string;
  angleZ?: string;
}

interface Model {
  id: string;
  name: string;
  description: string;
  model_url: string;
  is_featured: boolean;
  position?: string;
  position_data?: PositionData;
}

interface SupabaseModel {
  name: string;
  description?: string;
  model_url: string;
  is_featured?: boolean;
  position?: string;
}

const ModelManager = () => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [newModel, setNewModel] = useState<Partial<Model>>({
    name: '',
    description: '',
    model_url: '',
    is_featured: false,
    position_data: {
      top: '',
      left: '',
      scale: '1 1 1',
      rotation: '0deg',
      angleX: '0deg',
      angleY: '0deg',
      angleZ: '0deg',
      zIndex: 1
    }
  });
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelSourceType, setModelSourceType] = useState<'file' | 'url'>('file');
  const { toast: useToastFn } = useToast();

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
      useToastFn({
        title: 'Error',
        description: 'Failed to load models',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const uploadModelFile = async () => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return null;
    }

    try {
      setUploading(true);
      toast.info('Uploading model file, please wait...');

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `models/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('models')
        .upload(filePath, selectedFile);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('models')
        .getPublicUrl(filePath);

      toast.success('File uploaded successfully');
      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to upload file');
      return null;
    } finally {
      setUploading(false);
      setSelectedFile(null);
      const fileInput = document.getElementById('model-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    }
  };

  const addModel = async () => {
    try {
      if (!newModel.name) {
        toast.error('Model name is required');
        return;
      }

      let modelUrl = newModel.model_url;
      
      if (modelSourceType === 'file') {
        if (!selectedFile) {
          toast.error('Please select a 3D model file to upload');
          return;
        }
        const uploadedUrl = await uploadModelFile();
        if (uploadedUrl) {
          modelUrl = uploadedUrl;
        } else {
          return;
        }
      } else if (!modelUrl) {
        toast.error('Please provide a model URL');
        return;
      }

      const positionJson = newModel.position_data ? JSON.stringify(newModel.position_data) : null;

      const modelToInsert: SupabaseModel = {
        name: newModel.name,
        description: newModel.description,
        model_url: modelUrl,
        is_featured: newModel.is_featured,
        position: positionJson
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
          rotation: '0deg',
          angleX: '0deg',
          angleY: '0deg',
          angleZ: '0deg',
          zIndex: 1
        }
      });
      setIsDialogOpen(false);
      setModelSourceType('file');
      
      toast.success('Model added successfully');
    } catch (error) {
      console.error('Error adding model:', error);
      toast.error('Failed to add model');
    }
  };

  const updateModel = async () => {
    try {
      if (!editingModel || !editingModel.name) {
        toast.error('Model name is required');
        return;
      }

      let modelUrl = editingModel.model_url;
      
      if (modelSourceType === 'file' && selectedFile) {
        const uploadedUrl = await uploadModelFile();
        if (uploadedUrl) {
          modelUrl = uploadedUrl;
        } else {
          return;
        }
      } else if (modelSourceType === 'url' && !modelUrl) {
        toast.error('Please provide a model URL');
        return;
      }

      const positionJson = editingModel.position_data ? JSON.stringify(editingModel.position_data) : null;

      const modelToUpdate = {
        ...editingModel,
        model_url: modelUrl,
        position: positionJson,
      };

      const { position_data, ...modelToSend } = modelToUpdate;

      const { error } = await supabase
        .from('models')
        .update(modelToSend)
        .eq('id', editingModel.id);

      if (error) throw error;

      setModels(models.map(model => model.id === editingModel.id ? modelToUpdate : model));
      setEditingModel(null);
      setIsDialogOpen(false);
      setModelSourceType('file');
      
      toast.success('Model updated successfully');
    } catch (error) {
      console.error('Error updating model:', error);
      toast.error('Failed to update model');
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
      
      toast.success('Model deleted successfully');
    } catch (error) {
      console.error('Error deleting model:', error);
      toast.error('Failed to delete model');
    }
  };

  const openEditDialog = (model: Model) => {
    let modelWithPositionData = {...model};
    
    if (model.position && !model.position_data) {
      try {
        const positionData = JSON.parse(model.position) as PositionData;
        modelWithPositionData.position_data = positionData;
      } catch (e) {
        console.error('Failed to parse position data:', e);
        modelWithPositionData.position_data = {};
      }
    }
    
    setEditingModel(modelWithPositionData);
    setModelSourceType('url');
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingModel(null);
    setModelSourceType('file');
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
                      onCheckedChange={(checked) => {
                        const updatedModel = {...model, is_featured: checked};
                        updateModelFeatureStatus(updatedModel);
                      }}
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
              <Textarea
                id="description"
                name="description"
                value={editingModel?.description || newModel.description}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Model description"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">
                Model Source
              </Label>
              <div className="col-span-3">
                <RadioGroup
                  value={modelSourceType}
                  onValueChange={(value) => setModelSourceType(value as 'file' | 'url')}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="file" id="source-file" />
                    <Label htmlFor="source-file">Upload a 3D model file</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="url" id="source-url" />
                    <Label htmlFor="source-url">Use a URL</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            
            {modelSourceType === 'file' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="model-file" className="text-right">
                  Upload File
                </Label>
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <Input
                      id="model-file"
                      type="file"
                      accept=".glb,.gltf"
                      onChange={handleFileChange}
                      className="flex-1"
                    />
                    {uploading && (
                      <RotateCw className="h-4 w-4 animate-spin" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload a 3D model file (.glb or .gltf format)
                  </p>
                </div>
              </div>
            )}
            
            {modelSourceType === 'url' && (
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
            )}
            
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
              <h4 className="text-sm font-medium mb-2">Position & Rotation Settings</h4>
              
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
                  <Label htmlFor="position_right" className="text-xs">
                    Right Position
                  </Label>
                  <Input
                    id="position_right"
                    name="position_data.right"
                    value={editingModel?.position_data?.right || newModel.position_data?.right || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="e.g., 20%"
                  />
                </div>
                
                <div>
                  <Label htmlFor="position_bottom" className="text-xs">
                    Bottom Position
                  </Label>
                  <Input
                    id="position_bottom"
                    name="position_data.bottom"
                    value={editingModel?.position_data?.bottom || newModel.position_data?.bottom || ''}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="e.g., 10%"
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

                <div>
                  <Label htmlFor="angleX" className="text-xs">
                    X Angle
                  </Label>
                  <Input
                    id="angleX"
                    name="position_data.angleX"
                    value={editingModel?.position_data?.angleX || newModel.position_data?.angleX || '0deg'}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="e.g., 10deg"
                  />
                </div>

                <div>
                  <Label htmlFor="angleY" className="text-xs">
                    Y Angle
                  </Label>
                  <Input
                    id="angleY"
                    name="position_data.angleY"
                    value={editingModel?.position_data?.angleY || newModel.position_data?.angleY || '0deg'}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="e.g., 60deg"
                  />
                </div>

                <div>
                  <Label htmlFor="angleZ" className="text-xs">
                    Z Angle
                  </Label>
                  <Input
                    id="angleZ"
                    name="position_data.angleZ"
                    value={editingModel?.position_data?.angleZ || newModel.position_data?.angleZ || '0deg'}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="e.g., 5deg"
                  />
                </div>

                <div>
                  <Label htmlFor="zIndex" className="text-xs">
                    Z-Index
                  </Label>
                  <Input
                    id="zIndex"
                    name="position_data.zIndex"
                    type="number"
                    value={editingModel?.position_data?.zIndex || newModel.position_data?.zIndex || 1}
                    onChange={handleInputChange}
                    className="mt-1"
                    placeholder="e.g., 1"
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
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>{editingModel ? 'Update' : 'Add'} Model</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
  
  async function updateModelFeatureStatus(model: Model) {
    try {
      const { error } = await supabase
        .from('models')
        .update({ is_featured: model.is_featured })
        .eq('id', model.id);

      if (error) throw error;

      setModels(models.map(m => m.id === model.id ? model : m));
      toast.success(`Model ${model.is_featured ? 'added to' : 'removed from'} homepage`);
    } catch (error) {
      console.error('Error updating model feature status:', error);
      toast.error('Failed to update model feature status');
    }
  }
};

export default ModelManager;
