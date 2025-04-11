
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/products";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import ModelViewerComponent from './ModelViewerComponent';
import { useIsMobile } from '@/hooks/use-mobile';
import { View } from 'lucide-react';

interface ProductDialogProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
  onAddToCart?: (product: Product) => void;
}

const ProductDialog = ({ product, open, onClose, onAddToCart }: ProductDialogProps) => {
  const isMobile = useIsMobile();
  
  if (!product) return null;

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
              <div className={`${isMobile ? 'h-[350px]' : 'h-[450px]'}`}>
                <ModelViewerComponent
                  src={product.model_url}
                  ios_src={product.usdz_url}
                  alt={product.name}
                  height="100%"
                  autoRotate={true}
                  cameraControls={true}
                  ar={Boolean(product.usdz_url)}
                  className="w-full h-full"
                />
                
                {/* Enhanced AR badge for the product dialog - more visible */}
                {product.usdz_url && (
                  <div className="absolute top-4 right-4 z-30 pointer-events-none">
                    <div className="bg-purple-600 text-white text-sm px-3 py-1.5 rounded-full flex items-center gap-2 animate-pulse">
                      <View size={18} />
                      <span>{isMobile ? "Tap for AR" : "AR Available"}</span>
                    </div>
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
            
            {onAddToCart && (
              <Button
                onClick={() => onAddToCart(product)}
                className="w-full"
              >
                Add to Cart
              </Button>
            )}
            
            {product.model_url && product.usdz_url && (
              <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-center gap-2 text-purple-700 font-semibold mb-2">
                  <View size={20} />
                  <span>AR Viewing Instructions</span>
                </div>
                <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                  <li>On <strong>iOS</strong>: Tap the 3D model to reveal the AR button</li>
                  <li>On <strong>Android</strong>: Look for the "View in AR" button near the bottom of the model</li>
                  <li>Position your camera toward a flat surface</li>
                  <li>Pinch to resize and drag to reposition the model in AR</li>
                </ul>
                
                {/* Add extra prominent AR button outside the model viewer for mobile */}
                {isMobile && (
                  <div className="mt-4">
                    <Button 
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2" 
                      onClick={() => {
                        const arButton = document.querySelector('button[slot="ar-button"]');
                        if (arButton) {
                          (arButton as HTMLElement).click();
                        } else {
                          console.log("AR button not found");
                        }
                      }}
                    >
                      <View size={20} />
                      View in AR
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
