
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Product } from '@/types/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RotateCw } from 'lucide-react';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSave: (product: Product) => void;
}

const ProductDialog: React.FC<ProductDialogProps> = ({ open, onOpenChange, product, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('');
  const [featured, setFeatured] = useState(false);
  const [stock, setStock] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [modelUrl, setModelUrl] = useState('');
  const [selectedModelFile, setSelectedModelFile] = useState<File | null>(null);
  const [uploadingModel, setUploadingModel] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name || '');
      setDescription(product.description || '');
      setPrice(product.price?.toString() || '');
      setDiscount(product.discount || '');
      setImageUrl(product.imageurl || '');
      setCategory(product.category || '');
      setFeatured(product.featured || false);
      setStock(product.stock?.toString() || '');
      setModelUrl(product.model_url || '');
    } else {
      resetForm();
    }
  }, [product, open]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setDiscount('');
    setImageUrl('');
    setCategory('');
    setFeatured(false);
    setStock('');
    setSelectedFile(null);
    setModelUrl('');
    setSelectedModelFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleModelFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedModelFile(e.target.files[0]);
    }
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError, data } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (error) {
      console.error(`Error uploading to ${bucket}:`, error);
      toast.error(`Failed to upload file to ${bucket}`);
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!name || !description || !price) {
        toast.error('Please fill in all required fields');
        return;
      }
      
      let imageUrlToUse = imageUrl;
      if (selectedFile) {
        const uploadedUrl = await uploadFile(selectedFile, 'products');
        if (uploadedUrl) {
          imageUrlToUse = uploadedUrl;
        } else {
          return; // Exit if upload failed
        }
      }
      
      let modelUrlToUse = modelUrl;
      if (selectedModelFile) {
        setUploadingModel(true);
        const uploadedModelUrl = await uploadFile(selectedModelFile, 'models');
        if (uploadedModelUrl) {
          modelUrlToUse = uploadedModelUrl;
        }
        setUploadingModel(false);
      }

      const updatedProduct: Product = {
        id: product?.id || '',
        name,
        description,
        price: parseFloat(price),
        discount,
        imageurl: imageUrlToUse,
        category,
        featured,
        stock: stock ? parseInt(stock) : undefined,
        model_url: modelUrlToUse || null,
      };

      onSave(updatedProduct);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('Failed to save product');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="price" className="text-right">Price</Label>
            <Input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="discount" className="text-right">Discount</Label>
            <Input
              id="discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="col-span-3"
              placeholder="e.g. 10% off"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">Category</Label>
            <Input
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="featured" className="text-right">Featured</Label>
            <div className="flex items-center col-span-3">
              <Switch 
                id="featured" 
                checked={featured}
                onCheckedChange={setFeatured}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">Image URL</Label>
            <Input
              id="image"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="imageUpload" className="text-right">Upload Image</Label>
            <Input
              id="imageUpload"
              type="file"
              onChange={handleFileChange}
              className="col-span-3"
              accept="image/*"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelUrl" className="text-right">3D Model URL</Label>
            <Input
              id="modelUrl"
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
              className="col-span-3"
              placeholder="https://example.com/model.glb"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="modelUpload" className="text-right">Upload 3D Model</Label>
            <Input
              id="modelUpload"
              type="file"
              onChange={handleModelFileChange}
              className="col-span-3"
              accept=".glb,.gltf"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={uploading || uploadingModel}>
            {(uploading || uploadingModel) ? (
              <>
                <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                {uploading ? 'Uploading Image...' : 'Uploading Model...'}
              </>
            ) : (
              'Save'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
