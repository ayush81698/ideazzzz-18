
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import ModelViewer from '@/components/ModelViewer';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageurl: string;
    discount?: string;
    model_url?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [showModel, setShowModel] = useState(false);
  const hasModel = !!product.model_url;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="relative"
      onMouseEnter={() => hasModel && setShowModel(true)}
      onMouseLeave={() => setShowModel(false)}
    >
      <Card className="overflow-hidden h-full shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 md:h-56 overflow-hidden">
          {showModel && hasModel ? (
            <ModelViewer
              modelUrl={product.model_url!}
              height="100%"
              width="100%"
              autoRotate={true}
              cameraControls={false}
              backgroundAlpha={0}
              fieldOfView="30deg"
              exposure="1.5"
            />
          ) : (
            <img 
              src={product.imageurl} 
              alt={product.name}
              className="w-full h-full object-cover transform transition-transform hover:scale-105" 
            />
          )}
          {product.discount && (
            <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-sm font-semibold">
              {product.discount}
            </div>
          )}
          {hasModel && (
            <div className="absolute bottom-0 left-0 bg-purple-600 text-white px-2 py-0.5 text-xs font-medium">
              3D Preview
            </div>
          )}
        </div>
        <CardContent className="p-4 md:p-5">
          <h3 className="text-base md:text-lg font-semibold mb-1 md:mb-2">{product.name}</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-2 md:mb-3 text-xs md:text-sm line-clamp-2">
            {product.description}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base font-bold">₹{product.price.toLocaleString()}</span>
            <Button 
              variant="outline" 
              size="sm"
              className="text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white"
              asChild
            >
              <Link to={`/shop/${product.id}`}>
                <ShoppingBag className="h-3 w-3 md:h-4 md:w-4 mr-1" /> View
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
