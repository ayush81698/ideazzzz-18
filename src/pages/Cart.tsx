
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Card, CardContent, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  ShoppingCart, Trash2, ArrowRight, Plus, Minus, ArrowLeft, CreditCard, 
  MapPin, ShoppingBag
} from 'lucide-react';

// Mock cart data
const initialCartItems = [
  {
    id: 1,
    name: "Superhero Action Figure",
    price: 4999,
    quantity: 1,
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: 3,
    name: "Wedding Cake Topper",
    price: 3499,
    quantity: 2,
    imageUrl: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&w=800&q=80"
  }
];

const Cart = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  
  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
    toast.success("Item removed", {
      description: "The item has been removed from your cart",
    });
  };
  
  const applyPromoCode = () => {
    if (promoCode.toLowerCase() === 'ideazzz20') {
      setPromoApplied(true);
      toast.success("Promo code applied", {
        description: "You've received a 20% discount!",
      });
    } else {
      toast.error("Invalid promo code", {
        description: "The promo code you entered is invalid or expired",
      });
    }
  };
  
  const handleCheckout = () => {
    setIsCheckingOut(true);
    toast.success("Order placed successfully!", {
      description: "Thank you for your purchase. Your order will be processed shortly.",
    });
    
    // Reset cart after successful checkout
    setTimeout(() => {
      setCartItems([]);
      setIsCheckingOut(false);
    }, 2000);
  };
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const discount = promoApplied ? subtotal * 0.2 : 0;
  const shipping = subtotal > 3000 ? 0 : 250;
  const total = subtotal - discount + shipping;
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={fadeInUp}
            className="text-center"
          >
            <div className="mb-6 text-ideazzz-purple">
              <ShoppingCart className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground text-lg mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link to="/shop">
              <Button size="lg" className="bg-ideazzz-purple">
                Continue Shopping <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-10">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6">
          <Link to="/shop" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" /> Continue Shopping
          </Link>
        </div>
        
        <motion.h1 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          variants={fadeInUp}
          className="text-3xl font-bold mb-8"
        >
          Your Shopping Cart
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={fadeInUp}
            className="lg:col-span-2"
          >
            <Card className="border-none shadow-lg">
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <CardTitle>Cart Items ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</CardTitle>
                  <Button 
                    variant="ghost" 
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                    onClick={() => {
                      setCartItems([]);
                      toast.success("Cart cleared", {
                        description: "All items have been removed from your cart",
                      });
                    }}
                  >
                    Clear Cart
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ul className="divide-y">
                  {cartItems.map((item) => (
                    <li key={item.id} className="p-6">
                      <div className="flex items-center space-x-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                          <img
                            src={item.imageUrl}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <Link to={`/shop/${item.id}`} className="text-lg font-medium hover:text-ideazzz-purple transition-colors">
                            {item.name}
                          </Link>
                          <p className="mt-1 text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border rounded-md">
                            <button 
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-2 py-1 text-sm font-medium min-w-[28px] text-center">
                              {item.quantity}
                            </span>
                            <button 
                              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-lg font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">₹{item.price.toLocaleString()} each</p>
                          </div>
                          
                          <button 
                            className="p-1 text-muted-foreground hover:text-red-500 transition-colors"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Order Summary Section */}
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeInUp}
          >
            <Card className="border-none shadow-lg">
              <CardHeader className="border-b">
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  
                  {promoApplied && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount (20%)</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{shipping > 0 ? `₹${shipping}` : 'Free'}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-ideazzz-purple">₹{total.toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium">Have a promo code?</p>
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Enter promo code" 
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                    />
                    <Button 
                      onClick={applyPromoCode}
                      disabled={promoApplied || !promoCode}
                      variant="outline"
                    >
                      Apply
                    </Button>
                  </div>
                  {promoApplied && (
                    <p className="text-sm text-green-600">Promo code "IDEAZZZ20" applied!</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-6 flex flex-col space-y-4">
                <Button 
                  className="w-full bg-ideazzz-purple"
                  onClick={() => setIsCheckingOut(!isCheckingOut)}
                >
                  {isCheckingOut ? 'Back to Cart' : 'Proceed to Checkout'}
                </Button>
                
                <div className="text-xs text-muted-foreground text-center">
                  <p>Secure checkout powered by Razorpay</p>
                  <p className="mt-1">Free shipping on orders above ₹3,000</p>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        
        {/* Checkout Section */}
        {isCheckingOut && (
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.3 }}
            variants={fadeInUp}
            className="mt-12"
          >
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Customer Information */}
              <div className="space-y-6">
                <Card className="border-none shadow-lg">
                  <CardHeader className="border-b">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-ideazzz-purple" />
                      <CardTitle>Shipping Information</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="firstName">
                          First Name
                        </label>
                        <Input id="firstName" placeholder="First Name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="lastName">
                          Last Name
                        </label>
                        <Input id="lastName" placeholder="Last Name" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="email">
                        Email
                      </label>
                      <Input id="email" type="email" placeholder="Email" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="phone">
                        Phone Number
                      </label>
                      <Input id="phone" placeholder="Phone Number" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="address">
                        Address
                      </label>
                      <Input id="address" placeholder="Street Address" />
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="city">
                          City
                        </label>
                        <Input id="city" placeholder="City" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="state">
                          State
                        </label>
                        <Input id="state" placeholder="State" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="pincode">
                          PIN Code
                        </label>
                        <Input id="pincode" placeholder="PIN Code" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-none shadow-lg">
                  <CardHeader className="border-b">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-ideazzz-purple" />
                      <CardTitle>Payment Method</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="cardNumber">
                        Card Number
                      </label>
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="expiry">
                          Expiry Date
                        </label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="cvv">
                          CVV
                        </label>
                        <Input id="cvv" placeholder="123" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="nameOnCard">
                        Name on Card
                      </label>
                      <Input id="nameOnCard" placeholder="Name on Card" />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Order Review */}
              <div className="space-y-6">
                <Card className="border-none shadow-lg">
                  <CardHeader className="border-b">
                    <div className="flex items-center space-x-2">
                      <ShoppingBag className="h-5 w-5 text-ideazzz-purple" />
                      <CardTitle>Order Review</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <ul className="divide-y">
                      {cartItems.map((item) => (
                        <li key={item.id} className="p-4 flex items-center space-x-4">
                          <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                          </div>
                          
                          <div className="text-right">
                            <p className="font-medium">₹{(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="p-4 bg-gray-50">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span>₹{subtotal.toLocaleString()}</span>
                        </div>
                        
                        {promoApplied && (
                          <div className="flex justify-between text-green-600">
                            <span>Discount (20%)</span>
                            <span>-₹{discount.toLocaleString()}</span>
                          </div>
                        )}
                        
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Shipping</span>
                          <span>{shipping > 0 ? `₹${shipping}` : 'Free'}</span>
                        </div>
                        
                        <Separator />
                        
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span className="text-ideazzz-purple">₹{total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="space-y-4">
                  <Button 
                    className="w-full h-12 text-lg bg-ideazzz-purple"
                    onClick={handleCheckout}
                  >
                    Place Order
                  </Button>
                  
                  <p className="text-sm text-muted-foreground text-center">
                    By placing your order, you agree to our <Link to="#" className="text-ideazzz-purple hover:underline">Terms of Service</Link> and <Link to="#" className="text-ideazzz-purple hover:underline">Privacy Policy</Link>.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Cart;
