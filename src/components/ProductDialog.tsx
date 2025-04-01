
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { Product } from '@/types/products';

interface ProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  onSave: (product: Partial<Product>, file: File | null) => Promise<void>;
}

const ProductDialog: React.FC<ProductDialogProps> = ({
  open,
  onOpenChange,
  editingProduct,
  onSave
}) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    editingProduct || {
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 10,
      imageurl: '',
      discount: '',
      featured: false,
      model_url: '',
    }
  );
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'stock') {
      setFormData({ ...formData, [name]: Number(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, featured: checked });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!formData.name) {
        toast.error('Product name is required');
        return;
      }

      if (!formData.price || formData.price <= 0) {
        toast.error('Please enter a valid price');
        return;
      }

      setIsSubmitting(true);
      await onSave(formData, imageFile);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {editingProduct 
              ? 'Update the product details below.' 
              : 'Fill in the details to add a new product.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Product name"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your product"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price in rupees"
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="Available quantity"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              placeholder="Product category"
            />
          </div>
          <div>
            <Label htmlFor="imageurl">Image URL</Label>
            <Input
              id="imageurl"
              name="imageurl"
              value={formData.imageurl}
              onChange={handleInputChange}
              placeholder="URL to product image"
            />
          </div>
          <div>
            <Label htmlFor="model_url">3D Model URL (GLB format)</Label>
            <Input
              id="model_url"
              name="model_url"
              value={formData.model_url || ''}
              onChange={handleInputChange}
              placeholder="URL to 3D GLB model (optional)"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Add a URL to a .glb 3D model file for product preview
            </p>
          </div>
          <div>
            <Label htmlFor="discount">Discount Label</Label>
            <Input
              id="discount"
              name="discount"
              value={formData.discount}
              onChange={handleInputChange}
              placeholder="e.g. 20% OFF or Limited Edition"
            />
          </div>
          <div>
            <Label htmlFor="image">Upload Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured"
              checked={formData.featured || false}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="featured">Feature on homepage</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Product'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
