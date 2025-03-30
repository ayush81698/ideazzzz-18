
import React, { useState, useEffect } from 'react';
import { Model, PositionData } from '@/types/models';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { RotateCw } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { uploadModelFile } from '@/services/modelService';

interface ModelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingModel: Model | null;
  onSave: (modelData: any, file: File | null) => Promise<void>;
}

const ModelDialog: React.FC<ModelDialogProps> = ({ 
  open, 
  onOpenChange, 
  editingModel, 
  onSave 
}) => {
  const [modelData, setModelData] = useState<Partial<Model>>({
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
      zIndex: 1,
      rotationAxis: 'y'
    }
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [modelSourceType, setModelSourceType] = useState<'file' | 'url'>('file');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (editingModel) {
      // Initialize with editing model data
      let modelWithPositionData = {...editingModel};
      
      if (editingModel.position && !editingModel.position_data) {
        try {
          if (editingModel.position !== 'homepage') {
            const positionData = JSON.parse(editingModel.position) as PositionData;
            modelWithPositionData.position_data = positionData;
          } else {
            modelWithPositionData.position_data = {};
          }
        } catch (e) {
          console.error('Failed to parse position data:', e);
          modelWithPositionData.position_data = {};
        }
      }
      
      setModelData(modelWithPositionData);
      setModelSourceType('url');
    } else {
      // Reset for new model
      setModelData({
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
          zIndex: 1,
          rotationAxis: 'y'
        }
      });
      setModelSourceType('file');
    }
    
    setSelectedFile(null);
    setUploadProgress(0);
  }, [editingModel, open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('position_data.')) {
      const field = name.split('.')[1];
      setModelData({
        ...modelData,
        position_data: {
          ...modelData.position_data,
          [field]: value
        }
      });
    } else {
      setModelData({ ...modelData, [name]: value });
    }
  };

  const handleFeaturedChange = (checked: boolean) => {
    setModelData({ ...modelData, is_featured: checked });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      await onSave(modelData, selectedFile);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving model:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              value={modelData.name || ''}
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
              value={modelData.description || ''}
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
                {uploading && (
                  <Progress
                    value={uploadProgress}
                    className="h-2 mt-2"
                  />
                )}
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
                value={modelData.model_url || ''}
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
                checked={modelData.is_featured || false}
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
                  value={modelData.position_data?.top || ''}
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
                  value={modelData.position_data?.left || ''}
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
                  value={modelData.position_data?.right || ''}
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
                  value={modelData.position_data?.bottom || ''}
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
                  value={modelData.position_data?.scale || '1 1 1'}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="e.g., 1 1 1"
                />
              </div>
              
              <div>
                <Label htmlFor="rotationAxis" className="text-xs">
                  Rotation Axis
                </Label>
                <select
                  id="rotationAxis"
                  name="position_data.rotationAxis"
                  value={modelData.position_data?.rotationAxis || 'y'}
                  onChange={(e) => {
                    setModelData({
                      ...modelData,
                      position_data: {
                        ...modelData.position_data,
                        rotationAxis: e.target.value as 'x' | 'y' | 'z'
                      }
                    });
                  }}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="x">X Axis</option>
                  <option value="y">Y Axis</option>
                  <option value="z">Z Axis</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="rotation" className="text-xs">
                  Initial Rotation
                </Label>
                <Input
                  id="rotation"
                  name="position_data.rotation"
                  value={modelData.position_data?.rotation || '0deg'}
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
                  value={modelData.position_data?.angleX || '0deg'}
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
                  value={modelData.position_data?.angleY || '0deg'}
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
                  value={modelData.position_data?.angleZ || '0deg'}
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
                  value={modelData.position_data?.zIndex || 1}
                  onChange={handleInputChange}
                  className="mt-1"
                  placeholder="e.g., 1"
                />
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            className="bg-ideazzz-purple hover:bg-ideazzz-purple/90"
            onClick={handleSave}
            disabled={uploading}
          >
            {uploading ? (
              <>
                <RotateCw className="h-4 w-4 mr-2 animate-spin" />
                Uploading... {uploadProgress}%
              </>
            ) : (
              <>{editingModel ? 'Update' : 'Add'} Model</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ModelDialog;
