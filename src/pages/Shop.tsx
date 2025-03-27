
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
import ModelViewer from '@/components/ModelViewer';
import { Filter, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';

// Mock data for products
export const products = [
  {
    id: 1,
    name: "Superhero Action Figure",
    description: "Custom superhero action figure with dynamic pose",
    price: 4999,
    category: "Action Figures",
    stock: 15,
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    tags: ["Bestseller", "Customizable"],
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 2,
    name: "Celebrity Miniature",
    description: "Highly detailed celebrity figurine with lifelike features",
    price: 6999,
    category: "Collectibles",
    stock: 8,
    modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    tags: ["Premium", "Limited Edition"],
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    name: "Wedding Cake Topper",
    description: "Personalized wedding cake topper from your photos",
    price: 3499,
    category: "Special Occasions",
    stock: 20,
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    tags: ["Custom", "Gift Idea"],
    rating: 5.0,
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 4,
    name: "Gaming Character",
    description: "Your favorite gaming character in high-quality 3D print",
    price: 5499,
    category: "Gaming",
    stock: 12,
    modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    tags: ["Popular", "Gaming"],
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1501286353178-1ec881214838?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 5,
    name: "Custom Portrait Bust",
    description: "Elegant bust sculpture of yourself or loved one",
    price: 8999,
    category: "Artistic",
    stock: 5,
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    tags: ["Premium", "Artistic"],
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 6,
    name: "Sports Figure",
    description: "Dynamic sports action figure with custom jersey",
    price: 4599,
    category: "Sports",
    stock: 18,
    modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    tags: ["Sports", "Customizable"],
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 7,
    name: "Family Portrait Set",
    description: "Complete family set with multiple figures",
    price: 12999,
    category: "Family",
    stock: 7,
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    tags: ["Family", "Gift Set"],
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 8,
    name: "Pet Figurine",
    description: "Detailed 3D model of your beloved pet",
    price: 3999,
    category: "Pets",
    stock: 15,
    modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    tags: ["Pets", "Bestseller"],
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80"
  }
];

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
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [priceRange, setPriceRange] = useState([0, 15000]);
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, priceRange]);
  
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
  
  const addToCart = (productId: number) => {
    // Placeholder for cart functionality
    toast.success("Added to cart", {
      description: "Item has been added to your cart",
    });
  };
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          variants={fadeInUp}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Shop 3D Models</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse our collection of premium 3D character models, ready to ship to your doorstep
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={fadeInUp}
            className={`${showFilters ? 'block' : 'hidden'} lg:block`}
          >
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Filters</h2>
              
              <div className="space-y-6">
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
          
          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <div className="text-lg font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="lg:hidden flex items-center"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </Button>
                <Select defaultValue="featured">
                  <SelectTrigger className="w-[150px]">
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
            
            {filteredProducts.length === 0 ? (
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial="hidden"
                    animate="visible"
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    variants={fadeInUp}
                  >
                    <Card className="overflow-hidden card-hover border-none shadow-lg">
                      <div className="h-[250px] relative bg-gradient-to-br from-ideazzz-purple/5 to-ideazzz-pink/5 overflow-hidden group">
                        <div className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-0">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <ModelViewer 
                            modelUrl={product.modelUrl} 
                            className="h-full"
                          />
                        </div>
                        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                          {product.tags.map((tag, i) => (
                            <Badge key={i} className="bg-ideazzz-pink text-white border-none">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="absolute bottom-2 right-2">
                          <Badge className={`${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'} text-white border-none`}>
                            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-bold">{product.name}</h3>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm font-medium">{product.rating}</span>
                          </div>
                        </div>
                        <p className="text-muted-foreground text-sm mb-2">{product.description}</p>
                        <div className="text-sm text-muted-foreground mb-2">Category: {product.category}</div>
                        <div className="text-lg font-bold text-ideazzz-purple">₹{product.price.toLocaleString()}</div>
                      </CardContent>
                      <CardFooter className="px-6 py-4 bg-gray-50 flex justify-between">
                        <Button 
                          size="sm"
                          variant="outline" 
                          className="w-1/2"
                          onClick={() => window.location.href = `/shop/${product.id}`}
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm" 
                          className="w-1/2 ml-2 bg-ideazzz-purple hover:bg-ideazzz-dark flex items-center justify-center"
                          onClick={() => addToCart(product.id)}
                          disabled={product.stock === 0}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
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
