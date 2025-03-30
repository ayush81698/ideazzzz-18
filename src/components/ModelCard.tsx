
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Pencil, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Model } from '@/types/models';

interface ModelCardProps {
  model: Model;
  onEdit: (model: Model) => void;
  onDelete: (id: string) => void;
  onFeatureChange: (model: Model) => void;
}

const ModelCard: React.FC<ModelCardProps> = ({ model, onEdit, onDelete, onFeatureChange }) => {
  return (
    <Card key={model.id} className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-start justify-between">
          <span className="truncate">{model.name}</span>
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button size="icon" variant="ghost" onClick={() => onEdit(model)}>
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
                    onClick={() => onDelete(model.id)}
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
                onFeatureChange(updatedModel);
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelCard;
