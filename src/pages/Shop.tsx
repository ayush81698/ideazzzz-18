import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, CardContent, CardFooter 
} from '@/components/ui/card';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Slider 
} from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import ModelViewerComponent from '@/components/ModelViewerComponent';
import { Filter, ShoppingCart, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';
import { fetchProducts, Product } from '@/services/productService';
import { supabase } from '@/integrations/supabase/client';

// Create a simple cart store for demonstration
export const cartItems: any[] = [];

export const addToCart = (product: any) => {
  const existingIndex = cartItems.findIndex(item => item.id === product.id);
  
  if (existingIndex >= 0) {
    cartItems[existingIndex].quantity += 1;
  } else {
    cartItems.push({...product, quantity: 1});
  }
  
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
  
  // Dispatch custom event to notify components about cart changes
  const event = new CustomEvent('cartUpdated');
  window.dispatchEvent(event);
  
  return [...cartItems];
};

export const removeFromCart = (productId: string | number) => {
  const index = cartItems.findIndex(item => item.id === productId);
  if (index >= 0) {
    cartItems.splice(index, 1);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    
    // Dispatch custom event to notify components about cart changes
    const event = new CustomEvent('cartUpdated');
    window.dispatchEvent(event);
  }
  return [...cartItems];
};

const categories = [
  "All Categories",
  "Action Figures",
  "Collectibles",
  "Special Occasions",
  "Gaming",
  "Artistic",
  "Sports",
  "Family",
  "Pets"
];

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  useEffect(() => {
    loadProducts();
    
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        cartItems.length = 0; // Clear the array
        cartItems.push(...parsedCart); // Add all items from saved cart
      } catch (e) {
        console.error('Error parsing cart data:', e);
      }
    }
  }, []);
  
  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, priceRange, products]);
  
  const filterProducts = () => {
    let filtered = [...products];
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }
    
    // Filter by price range
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(filtered);
  };
  
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast.success("Added to cart", {
      description: "Item has been added to your cart",
    });
  };
  
  const handleProductClick = (productId: string) => {
    navigate(`/shop/${productId}`);
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="py-6 md:py-10">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          variants={fadeInUp}
          className="text-center mb-8 md:mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2 md:mb-4">Shop 3D Models</h1>
          <p className="text-muted-foreground text-sm md:text-lg max-w-2xl mx-auto">
            Browse our collection of premium 3D character models, ready to ship to your doorstep
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-8">
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={fadeInUp}
            className={`${showFilters ? 'block' : 'hidden'} lg:block`}
          >
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4 md:mb-6">Filters</h2>
              
              <div className="space-y-4 md:space-y-6">
                <div>
                  <Label htmlFor="search" className="mb-2 block font-medium">Search</Label>
                  <Input
                    id="search"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category" className="mb-2 block font-medium">Category</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="mb-2 block font-medium">Price Range</Label>
                  <div className="pt-4 px-2">
                    <Slider
                      defaultValue={[0, 15000]}
                      max={15000}
                      step={500}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-6"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>₹{priceRange[0].toLocaleString()}</span>
                      <span>₹{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All Categories');
                    setPriceRange([0, 15000]);
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </motion.div>
          
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4 md:mb-6">
              <div className="text-sm md:text-lg font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="lg:hidden flex items-center"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                <Select defaultValue="featured">
                  <SelectTrigger className="w-[120px] md:w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
                <Button 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All Categories');
                    setPriceRange([0, 15000]);
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    variants={fadeInUp}
                  >
                    <Card className="overflow-hidden card-hover border-none shadow-lg h-full">
                      <div 
                        className="h-[180px] md:h-[250px] relative bg-gradient-to-br from-ideazzz-purple/5 to-ideazzz-pink/5 overflow-hidden group"
                        onClick={() => handleProductClick(product.id)}
                      >
                        <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0">
                          {product.model_url ? (
                            <ModelViewerComponent 
                              src={product.model_url}
                              ios_src={product.usdz_url}
                              alt={product.name}
                              height="100%"
                              width="100%"
                              autoRotate={true}
                              cameraControls={true}
                              enableAR={true}
                              poster={product.imageurl}
                            />
                          ) : (
                            <img 
                              src={product.imageurl || '/placeholder.svg'} 
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/placeholder.svg';
                              }}
                            />
                          )}
                        </div>
                        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          {product.model_url && (
                            <ModelViewerComponent 
                              src={product.model_url}
                              ios_src={product.usdz_url}
                              alt={product.name}
                              height="100%"
                              width="100%"
                              autoRotate={true}
                              cameraControls={true}
                              enableAR={true}
                            />
                          )}
                        </div>
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          {product.discount && (
                            <Badge className="bg-ideazzz-pink text-white border-none text-xs">
                              {product.discount}
                            </Badge>
                          )}
                          {product.featured && (
                            <Badge className="bg-yellow-500 text-white border-none text-xs">
                              Featured
                            </Badge>
                          )}
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <Badge className={`${product.stock && product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} text-white border-none text-xs`}>
                            {product.stock && product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-3 md:p-6" onClick={() => handleProductClick(product.id)}>
                        <div className="flex justify-between items-start mb-1 md:mb-2">
                          <h3 className="text-base md:text-lg font-bold">{product.name}</h3>
                        </div>
                        <p className="text-muted-foreground text-xs md:text-sm mb-2 line-clamp-2">{product.description}</p>
                        <div className="text-xs md:text-sm text-muted-foreground mb-2">Category: {product.category || 'General'}</div>
                        <div className="text-base md:text-lg font-bold text-ideazzz-purple">₹{product.price.toLocaleString()}</div>
                      </CardContent>
                      <CardFooter className="px-3 md:px-6 py-2 md:py-4 bg-gray-50 flex justify-between">
                        <Button 
                          size="sm"
                          variant="outline" 
                          className="w-1/2 text-xs md:text-sm"
                          onClick={() => handleProductClick(product.id)}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="w-1/2 ml-2 bg-ideazzz-purple hover:bg-ideazzz-dark flex items-center justify-center text-xs md:text-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={!product.stock || product.stock === 0}
                        >
                          <ShoppingCart className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
