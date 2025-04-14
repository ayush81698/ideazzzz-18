
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/products";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ModelViewerComponent from './ModelViewerComponent';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

const ProductDialog = ({ product, open, onClose, onAddToCart }: ProductDialogProps) => {
  const isMobile = useIsMobile();
  
  // Guard against undefined window during SSR/hydration
  if (typeof window === 'undefined') return null;
  if (!product) return null;

  // Determine if AR is available based on whether we have the required model format
  const arAvailable = Boolean(product.model_url) && (Boolean(product.usdz_url) || !(/iPhone|iPad|iPod/i.test(navigator.userAgent)));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          <DialogDescription className="text-lg mt-1">${product.price.toFixed(2)}</DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            {product.model_url ? (
              <div className={`${isMobile ? 'h-[450px]' : 'h-[550px]'} relative`}>
                <ModelViewerComponent
                  src={product.model_url}
                  ios_src={product.usdz_url}
                  alt={product.name}
                  height="100%"
                  autoRotate={true}
                  cameraControls={true}
                  enableAR={true}
                  className="w-full h-full"
                />
                {arAvailable && (
                  <div className="absolute top-2 left-2 bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs flex items-center">
                    <span className="mr-1">✨</span> AR Available
                  </div>
                )}
              </div>
            ) : product.images && product.images.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {product.images.map((image, index) => (
                    <CarouselItem key={index} className="flex items-center justify-center">
                      <img
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        className="object-contain h-[400px] max-w-full rounded-md"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            ) : (
              <div className="w-full h-[400px] flex items-center justify-center bg-gray-100 rounded-md">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {product.model_url && (
              <div className="bg-gray-100 p-3 rounded-md mb-4 text-sm">
                <p className="font-semibold mb-1">📱 Experience in Augmented Reality</p>
                <p>Look for the AR button in the model viewer to see this product in your space!</p>
                <ul className="mt-2 space-y-1">
                  <li>• Android: Use the 👋 View in AR button</li>
                  <li>• iOS: Use the 🍏 View in AR button</li>
                </ul>
              </div>
            )}
            
            {onAddToCart && (
              <Button
                onClick={() => onAddToCart(product)}
                className="w-full"
              >
                Add to Cart
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
