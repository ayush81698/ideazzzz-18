
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Trash2, Plus, Minus, ChevronRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { cartItems, removeFromCart } from './Shop';
import { useIsMobile } from '@/hooks/use-mobile';

const Cart = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    // Load cart items from localStorage when component mounts
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
      } catch (e) {
        console.error('Error parsing cart data:', e);
        setItems([]);
      }
    } else {
      setItems([]);
    }
    setLoading(false);
  }, []);

  const updateQuantity = (id, delta) => {
    setItems(prevItems => {
      const newItems = prevItems.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, (item.quantity || 1) + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      
      // Update localStorage
      localStorage.setItem('cartItems', JSON.stringify(newItems));
      return newItems;
    });
  };

  const handleRemoveItem = (id) => {
    // Use the removeFromCart function from Shop.tsx
    const updatedCart = removeFromCart(id);
    setItems(updatedCart);
    
    toast.success("Item removed", {
      description: "The item has been removed from your cart",
    });
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  };

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    return subtotal >= 3000 ? 0 : 250;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ideazzz-purple"></div>
      </div>
    );
  }

  return (
    <div className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-2 md:mb-4">Your Shopping Cart</h1>
        <p className="text-muted-foreground mb-6 md:mb-8 text-sm md:text-base">
          Review your items and proceed to checkout
        </p>

        {items.length === 0 ? (
          <div className="text-center py-12 md:py-16">
            <div className="flex justify-center mb-4">
              <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            </div>
            <h2 className="text-xl md:text-2xl font-medium mb-2 md:mb-4">Your cart is empty</h2>
            <p className="text-muted-foreground mb-6 md:mb-8 max-w-md mx-auto">
              Looks like you haven't added anything to your cart yet. Explore our shop to find something you'll love!
            </p>
            <Link to="/shop">
              <Button size={isMobile ? "default" : "lg"} className="bg-ideazzz-purple hover:bg-ideazzz-purple/90">
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
                        <div className="flex items-center space-x-3 md:space-x-4 flex-grow">
                          <Link to={`/shop/${item.id}`} className="shrink-0">
                            <div className="h-16 w-16 md:h-20 md:w-20 overflow-hidden rounded-md bg-gray-100">
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="h-full w-full object-cover"
                              />
                            </div>
                          </Link>
                          <div className="flex-grow min-w-0">
                            <Link to={`/shop/${item.id}`}>
                              <h3 className="font-medium text-sm md:text-base mb-1 line-clamp-1">{item.name}</h3>
                            </Link>
                            <p className="text-muted-foreground text-xs md:text-sm mb-1 line-clamp-1">{item.category}</p>
                            <div className="text-ideazzz-purple font-semibold">
                              ₹{item.price.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between md:justify-end md:min-w-[160px]">
                          <div className="flex items-center border rounded-md mr-3 md:mr-4">
                            <button 
                              className="p-1 md:p-1.5 text-sm"
                              onClick={() => updateQuantity(item.id, -1)}
                            >
                              <Minus className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                            <span className="px-2 md:px-3 py-1 text-sm md:text-base">
                              {item.quantity || 1}
                            </span>
                            <button 
                              className="p-1 md:p-1.5 text-sm"
                              onClick={() => updateQuantity(item.id, 1)}
                            >
                              <Plus className="h-3 w-3 md:h-4 md:w-4" />
                            </button>
                          </div>
                          
                          <button 
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 md:h-5 md:w-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6">
                <Link to="/shop">
                  <Button variant="outline" className="w-full md:w-auto">
                    <ChevronRight className="h-4 w-4 mr-2 rotate-180" />
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            </div>
            
            <div>
              <Card>
                <CardContent className="p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-bold mb-4">Order Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>₹{calculateSubtotal().toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm md:text-base">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>
                        {calculateShipping() === 0 ? 
                          'Free' : 
                          `₹${calculateShipping().toLocaleString()}`
                        }
                      </span>
                    </div>
                    
                    <Separator className="my-3" />
                    
                    <div className="flex justify-between font-bold text-base md:text-lg">
                      <span>Total</span>
                      <span>₹{calculateTotal().toLocaleString()}</span>
                    </div>
                    
                    {calculateShipping() > 0 && (
                      <p className="text-xs md:text-sm text-muted-foreground mt-2">
                        Add ₹{(3000 - calculateSubtotal()).toLocaleString()} more to qualify for free shipping
                      </p>
                    )}
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-ideazzz-purple hover:bg-ideazzz-purple/90"
                    size={isMobile ? "default" : "lg"}
                    onClick={() => {
                      toast.success("Checkout initiated", {
                        description: "This is a demo checkout. In a real app, you would be redirected to a payment gateway.",
                      });
                    }}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <div className="mt-4 text-xs md:text-sm text-center text-muted-foreground">
                    Secure checkout powered by our trusted payment partners
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
