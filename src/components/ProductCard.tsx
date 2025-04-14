
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/products";
import ModelViewerComponent from './ModelViewerComponent';
import { useIsMobile } from '@/hooks/use-mobile';
import { Box, Info } from 'lucide-react'; 
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const isMobile = useIsMobile();
  const [arAttempted, setArAttempted] = useState(false);
  
  // Guard against undefined window during SSR/hydration
  if (typeof window === 'undefined') return null;
  
  // Function to detect if AR is likely to be supported
  const isARSupported = () => {
    // iOS AR QuickLook is supported on iOS Safari
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isIOSSupported = isIOS && product.usdz_url;
    
    // Android Scene Viewer is supported on Chrome
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isChrome = /Chrome/i.test(navigator.userAgent) && !/Edge|Edg/i.test(navigator.userAgent);
    const isAndroidSupported = isAndroid && isChrome && product.model_url;
    
    return isIOSSupported || isAndroidSupported;
  };

  // Handle direct AR launch for cases where model-viewer fails
  const handleARFallbackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If already attempted AR through model-viewer, try direct URL approach
    if (arAttempted) {
      const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
      
      if (isIOS && product.usdz_url) {
        // For iOS, use a direct link to USDZ
        window.location.href = product.usdz_url;
        toast.info("Opening AR QuickLook");
      } else if (product.model_url) {
        // For Android, attempt scene-viewer URL scheme
        const gARUrl = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(product.model_url)}&mode=ar_preferred#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(window.location.href)};end;`;
        window.location.href = gARUrl;
        toast.info("Opening Scene Viewer");
      } else {
        toast.error("AR not supported on this device");
      }
    } else {
      setArAttempted(true);
    }
  };
  
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-96 bg-gray-100">
        {product.model_url ? (
          <ModelViewerComponent 
            src={product.model_url}
            ios_src={product.usdz_url}
            alt={product.name}
            height="384px"
            autoRotate={true}
            cameraControls={true}
            enableAR={true}
            poster={product.images && product.images.length > 0 ? product.images[0] : undefined}
          />
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
        
        {/* AR Fallback button if AR is likely supported but might not work through model-viewer */}
        {product.model_url && isMobile && isARSupported() && (
          <button
            onClick={handleARFallbackClick}
            className="absolute bottom-2 right-2 bg-white text-black px-3 py-1 rounded-full text-xs font-medium shadow-md flex items-center z-20"
            aria-label="View in AR (alternative)"
          >
            {arAttempted ? '🔄 Try AR (alt)' : <Info size={12} className="mr-1" />}
          </button>
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
