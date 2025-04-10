
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/products";
import ModelViewerComponent from './ModelViewerComponent';
import { useIsMobile } from '@/hooks/use-mobile';
import { Box, View } from 'lucide-react'; // Import View icon for better AR indication

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-64 bg-gray-100">
        {product.model_url ? (
          <>
            <ModelViewerComponent 
              src={product.model_url}
              ios_src={product.usdz_url}
              alt={product.name}
              height="256px"
              autoRotate={true}
              cameraControls={true}
              ar={Boolean(product.usdz_url)}
              poster={product.images && product.images.length > 0 ? product.images[0] : undefined}
            />
            
            {/* AR View Indicator - Enhanced visibility */}
            {product.usdz_url && (
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-purple-600 text-white rounded-full p-2 shadow-lg" title="AR Available">
                  <View size={20} /> {/* Changed to View icon for better AR representation */}
                </div>
              </div>
            )}
          </>
        ) : (
          product.images && product.images.length > 0 ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <span className="text-gray-400">No image</span>
            </div>
          )
        )}
        
        {/* Enhanced Mobile AR Badge - Always visible when AR is available */}
        {product.model_url && product.usdz_url && (
          <div className="absolute bottom-2 right-2 z-10">
            <div className="bg-purple-600 text-white text-xs px-3 py-1.5 rounded-full animate-pulse flex items-center gap-1.5">
              <View size={16} />
              <span>AR View</span>
            </div>
          </div>
        )}
      </div>

      <CardHeader className="flex-grow">
        <CardTitle>{product.name}</CardTitle>
        <CardDescription className="line-clamp-2">{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="font-bold text-lg">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onViewDetails(product)} className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
