import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Tabs, TabsContent, TabsList, TabsTrigger
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from '@/components/ui/card';
import { addToCart } from './Shop';
import ModelViewer from '@/components/ModelViewer';
import { 
  ShoppingCart, ArrowLeft, Star, Truck, Package, RotateCcw, MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';
import { fetchProducts } from '@/services/productService';

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  useEffect(() => {
    const loadProduct = async () => {
      setIsLoading(true);
      try {
        // Fetch products from the service
        const allProducts = await fetchProducts();
        
        if (id) {
          const foundProduct = allProducts.find(p => p.id === id);
          setProduct(foundProduct || null);
          
          // Set related products (excluding current product)
          const related = allProducts
            .filter(p => p.id !== id)
            .slice(0, isMobile ? 2 : 4);
          setRelatedProducts(related);
        }
      } catch (error) {
        console.error("Error loading product:", error);
        toast.error("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProduct();
  }, [id, isMobile]);
  
  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      
      toast.success("Added to cart", {
        description: `${quantity} × ${product.name} has been added to your cart`,
      });
    }
  };
  
  const reviews = [
    {
      id: 1,
      author: "Rahul S.",
      rating: 5,
      date: "2023-06-15",
      title: "Exceeded my expectations!",
      comment: "The detail on this model is incredible. It looks just like me, right down to the smallest details. Worth every rupee!",
      verified: true
    },
    {
      id: 2,
      author: "Priya M.",
      rating: 4,
      date: "2023-05-22",
      title: "Great quality, slight delay in shipping",
      comment: "The model itself is fantastic and the quality is excellent. Took a bit longer than expected to arrive, but was worth the wait.",
      verified: true
    },
    {
      id: 3,
      author: "Arjun K.",
      rating: 5,
      date: "2023-04-10",
      title: "Perfect gift for my father",
      comment: "I ordered this as a birthday gift for my father and he absolutely loved it. The likeness is remarkable and the finish is very professional.",
      verified: true
    }
  ];
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-200 rounded-md mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-6 md:py-10">
      <div className="container mx-auto px-4">
        <div className="mb-4 md:mb-6">
          <Link to="/shop" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Shop
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 mb-8 md:mb-16">
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={fadeInUp}
            className="bg-gradient-to-br from-ideazzz-purple/5 to-ideazzz-pink/5 rounded-xl overflow-hidden"
          >
            <Tabs defaultValue="model" className={isMobile ? "h-[350px]" : "h-[600px]"}>
              <TabsList className="justify-center mb-2 md:mb-4">
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="model">3D Model</TabsTrigger>
              </TabsList>
              <TabsContent value="image" className="h-full">
                <img 
                  src={product.imageUrl} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </TabsContent>
              <TabsContent value="model" className="h-full">
                <div className="h-full">
                  <ModelViewer 
                    modelUrl={product.modelUrl} 
                    className="h-full"
                    autoRotate={true}
                    scale={isMobile ? "1.2 1.2 1.2" : "1 1 1"}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={fadeInUp}
          >
            <div className="flex flex-wrap gap-2 mb-3">
              {product.tags.map((tag: string, i: number) => (
                <Badge key={i} className="bg-ideazzz-pink text-white border-none">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-3 md:mb-4">
              <div className="flex items-center mr-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 md:h-5 md:w-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm md:text-base text-muted-foreground">{product.rating} ({reviews.length} reviews)</span>
            </div>
            
            <div className="text-2xl md:text-3xl font-bold text-ideazzz-purple mb-4 md:mb-6">
              ₹{product.price.toLocaleString()}
            </div>
            
            <div className="prose max-w-none mb-6 md:mb-8">
              <p className="text-base md:text-lg text-muted-foreground">{product.description}</p>
              <p className="text-base md:text-lg mt-4">
                This highly detailed 3D model is meticulously crafted by our expert artists. Each model is printed using premium materials to ensure durability and exceptional detail.
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mb-6 md:mb-8">
              <div className="flex items-center border rounded-md">
                <button 
                  className="px-3 py-1 md:px-4 md:py-2 text-base md:text-lg font-medium border-r"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="px-3 py-1 md:px-4 md:py-2 text-base md:text-lg font-medium min-w-[40px] text-center">
                  {quantity}
                </span>
                <button 
                  className="px-3 py-1 md:px-4 md:py-2 text-base md:text-lg font-medium border-l"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  +
                </button>
              </div>
              <div className="text-sm md:text-base text-muted-foreground">
                {product.stock > 0 ? (
                  <span className="text-green-600 flex items-center">
                    <span className="h-2 w-2 bg-green-600 rounded-full inline-block mr-2"></span>
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600 flex items-center">
                    <span className="h-2 w-2 bg-red-600 rounded-full inline-block mr-2"></span>
                    Out of Stock
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
              <Button 
                size={isMobile ? "default" : "lg"} 
                className="bg-ideazzz-purple hover:bg-ideazzz-dark flex-1 flex items-center justify-center"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                Add to Cart
              </Button>
              <Link to="/booking" className="flex-1">
                <Button 
                  size={isMobile ? "default" : "lg"} 
                  variant="outline"
                  className="w-full bg-white border-ideazzz-purple text-ideazzz-purple hover:bg-ideazzz-purple/5"
                >
                  Book Custom Model
                </Button>
              </Link>
            </div>
            
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start">
                <Truck className="h-4 w-4 md:h-5 md:w-5 text-ideazzz-purple mr-2 md:mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm md:text-base font-medium">Free Shipping</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Free delivery across India for orders above ₹3,000</p>
                </div>
              </div>
              <div className="flex items-start">
                <Package className="h-4 w-4 md:h-5 md:w-5 text-ideazzz-purple mr-2 md:mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm md:text-base font-medium">Secure Packaging</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">Special protective packaging ensures your model arrives in perfect condition</p>
                </div>
              </div>
              <div className="flex items-start">
                <RotateCcw className="h-4 w-4 md:h-5 md:w-5 text-ideazzz-purple mr-2 md:mr-3 mt-0.5" />
                <div>
                  <h3 className="text-sm md:text-base font-medium">Easy Returns</h3>
                  <p className="text-xs md:text-sm text-muted-foreground">30-day return policy if you're not completely satisfied</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.2 }}
          variants={fadeInUp}
          className="mb-8 md:mb-16"
        >
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start border-b rounded-none mb-4 md:mb-6 overflow-x-auto flex">
              <TabsTrigger value="details" className="rounded-none text-sm md:text-base whitespace-nowrap">Details</TabsTrigger>
              <TabsTrigger value="reviews" className="rounded-none text-sm md:text-base whitespace-nowrap">Reviews ({reviews.length})</TabsTrigger>
              <TabsTrigger value="shipping" className="rounded-none text-sm md:text-base whitespace-nowrap">Shipping & Returns</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="pt-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Product Specifications</h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Dimensions</span>
                        <span className="font-medium">15 cm x 8 cm x 7 cm</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Material</span>
                        <span className="font-medium">Premium PLA</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Weight</span>
                        <span className="font-medium">250g</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Print Quality</span>
                        <span className="font-medium">Ultra-High Resolution</span>
                      </li>
                      <li className="flex justify-between border-b pb-2">
                        <span className="text-muted-foreground">Finishing</span>
                        <span className="font-medium">Hand-painted</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-2">Features</h3>
                    <ul className="space-y-2">
                      {[
                        "Highly detailed 3D printed model",
                        "Durable and long-lasting construction",
                        "Vibrant and fade-resistant colors",
                        "Stable base for easy display",
                        "Comes in protective gift box"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-ideazzz-purple mr-2">•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold mb-2">Description</h3>
                    <p className="text-muted-foreground">
                      This {product.name} is crafted with meticulous attention to detail using our advanced 3D printing technology. Each model is carefully designed to capture the essence and character of the subject, making it a perfect addition to your collection or a thoughtful gift for someone special.
                    </p>
                    <p className="text-muted-foreground mt-4">
                      Our artists spend hours refining each model in Blender to ensure that every detail is perfect before it's printed. The model is then printed using premium PLA material and hand-finished for a professional look.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold mb-2">Care Instructions</h3>
                    <ul className="space-y-2">
                      {[
                        "Avoid direct sunlight to prevent color fading",
                        "Clean with a soft, dry cloth to remove dust",
                        "Do not use water or cleaning chemicals",
                        "Handle with care to preserve delicate features",
                        "Store in the provided box when not on display"
                      ].map((instruction, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-ideazzz-pink mr-2">•</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-2">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold">Customer Reviews</h3>
                    <div className="flex items-center mt-2">
                      <div className="flex items-center mr-3">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-5 w-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-muted-foreground">Based on {reviews.length} reviews</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    className="bg-white border-ideazzz-purple text-ideazzz-purple hover:bg-ideazzz-purple/5"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Write a Review
                  </Button>
                </div>
                
                <div className="divide-y">
                  {reviews.map((review) => (
                    <div key={review.id} className="py-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <div className="mr-3">
                            <div className="h-10 w-10 bg-ideazzz-purple/20 rounded-full flex items-center justify-center text-ideazzz-purple font-bold">
                              {review.author.charAt(0)}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-bold">{review.author}</h4>
                            <div className="flex items-center">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                  />
                                ))}
                              </div>
                              {review.verified && (
                                <Badge className="ml-2 bg-green-500/10 text-green-600 border-green-500 text-xs">
                                  Verified Purchase
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {review.date}
                        </div>
                      </div>
                      <h5 className="font-medium mb-2">{review.title}</h5>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="shipping" className="pt-2">
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold mb-4">Shipping Information</h3>
                  <div className="space-y-4">
                    <p>
                      We take great care to ensure your 3D model arrives safely and in perfect condition. Each model is carefully packaged in protective materials and shipped in a sturdy box.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Standard Shipping</CardTitle>
                          <CardDescription>Free for orders above ₹3,000</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Delivery Time</span>
                              <span className="font-medium">3-5 business days</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Cost</span>
                              <span className="font-medium">₹250 (Free above ₹3,000)</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Tracking</span>
                              <span className="font-medium">Yes</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>Express Shipping</CardTitle>
                          <CardDescription>For urgent deliveries</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-2">
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Delivery Time</span>
                              <span className="font-medium">1-2 business days</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Cost</span>
                              <span className="font-medium">₹500</span>
                            </li>
                            <li className="flex justify-between">
                              <span className="text-muted-foreground">Tracking</span>
                              <span className="font-medium">Yes</span>
                            </li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-4">Return Policy</h3>
                  <div className="space-y-4">
                    <p>
                      We want you to be completely satisfied with your purchase. If for any reason you're not happy with your 3D model, we offer a comprehensive return policy:
                    </p>
                    <ul className="space-y-3">
                      {[
                        "You may return your product within 30 days of delivery",
                        "The product must be in its original condition and packaging",
                        "Custom models designed specifically to your requirements cannot be returned unless there is a manufacturing defect",
                        "Shipping costs for returns are the responsibility of the customer unless the return is due to a defect or error on our part",
                        "Refunds will be processed within 7-10 business days after we receive the returned item"
                      ].map((point, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-ideazzz-purple mr-2">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="mt-4">
                      To initiate a return, please contact our customer service team at returns@ideazzz.com or call us at +91 9876543210.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
        
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.3 }}
          variants={fadeInUp}
        >
          <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {relatedProducts.map((relatedProduct, index) => (
              <Link to={`/shop/${relatedProduct.id}`} key={relatedProduct.id}>
                <Card className="overflow-hidden card-hover border-none shadow-md h-full">
                  <div className="h-[120px] md:h-[200px] relative bg-gradient-to-br from-ideazzz-purple/5 to-ideazzz-pink/5 overflow-hidden">
                    <img 
                      src={relatedProduct.imageUrl} 
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      {relatedProduct.tags.slice(0, 1).map((tag: string, i: number) => (
                        <Badge key={i} className="bg-ideazzz-pink text-white border-none text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardContent className="p-3 md:p-4">
                    <h3 className="font-bold mb-1 text-sm md:text-base line-clamp-1">{relatedProduct.name}</h3>
                    <p className="text-xs md:text-sm text-muted-foreground mb-2 line-clamp-2">{relatedProduct.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-ideazzz-purple text-sm md:text-base">₹{relatedProduct.price.toLocaleString()}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 md:h-4 md:w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-xs md:text-sm">{relatedProduct.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProductPage;
