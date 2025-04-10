
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createProduct, updateProduct, deleteProduct } from "@/services/productService";
import { CreateProductParams, Product, UpdateProductParams } from "@/types/products";
import { useQueryClient, useMutation } from "@tanstack/react-query";

interface ProductManagerProps {
  initialProduct?: Product;
  onComplete?: () => void;
  mode?: "create" | "edit";
}

const ProductManager = ({ initialProduct, onComplete, mode = "create" }: ProductManagerProps) => {
  const [name, setName] = useState(initialProduct?.name || "");
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [price, setPrice] = useState(initialProduct?.price?.toString() || "");
  const [images, setImages] = useState<string>(initialProduct?.images?.join("\n") || "");
  const [modelUrl, setModelUrl] = useState(initialProduct?.model_url || "");
  const [usdzUrl, setUsdzUrl] = useState(initialProduct?.usdz_url || "");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (onComplete) onComplete();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create product: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (onComplete) onComplete();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update product: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (onComplete) onComplete();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete product: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const parsedPrice = parseFloat(price);
      if (isNaN(parsedPrice) || parsedPrice <= 0) {
        toast({
          title: "Invalid price",
          description: "Please enter a valid price",
          variant: "destructive",
        });
        return;
      }

      const imageArray = images
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);

      if (mode === "create") {
        const newProduct: CreateProductParams = {
          name,
          description,
          price: parsedPrice,
          images: imageArray,
          model_url: modelUrl || undefined,
          usdz_url: usdzUrl || undefined,
        };
        createMutation.mutate(newProduct);
      } else {
        if (!initialProduct) return;

        const updatedProduct: UpdateProductParams = {
          id: initialProduct.id,
          name,
          description,
          price: parsedPrice,
          images: imageArray,
          model_url: modelUrl || null,
          usdz_url: usdzUrl || null,
        };
        updateMutation.mutate(updatedProduct);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `An unexpected error occurred: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const handleDelete = () => {
    if (!initialProduct) return;
    
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(initialProduct.id);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{mode === "create" ? "Add New Product" : "Edit Product"}</CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Fill in the details to add a new product"
            : "Update the product information"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter product description"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter product price"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="images">Images (One URL per line)</Label>
            <Textarea
              id="images"
              value={images}
              onChange={(e) => setImages(e.target.value)}
              placeholder="Enter image URLs (one per line)"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="model-url">3D Model URL (.glb)</Label>
            <Input
              id="model-url"
              value={modelUrl}
              onChange={(e) => setModelUrl(e.target.value)}
              placeholder="Enter GLB model URL (optional)"
            />
            <p className="text-xs text-gray-500">
              The URL for the 3D model file in GLB format (compatible with Android and web)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usdz-url">iOS AR Model URL (.usdz)</Label>
            <Input
              id="usdz-url"
              value={usdzUrl}
              onChange={(e) => setUsdzUrl(e.target.value)}
              placeholder="Enter USDZ model URL (optional for iOS AR)"
            />
            <p className="text-xs text-gray-500">
              The URL for the iOS AR-compatible model file in USDZ format (required for AR on iOS)
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? mode === "create"
                ? "Creating..."
                : "Updating..."
              : mode === "create"
              ? "Create Product"
              : "Update Product"}
          </Button>

          {mode === "edit" && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            onClick={onComplete}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ProductManager;
