
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ModelViewer from '@/components/ModelViewer';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

const models = [
  {
    id: 1,
    title: "Superhero Action Figure",
    description: "Custom superhero action figure with dynamic pose",
    price: 4999,
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb", 
    tags: ["Bestseller", "Customizable"],
    rating: 4.9
  },
  {
    id: 2,
    title: "Celebrity Miniature",
    description: "Highly detailed celebrity figurine with lifelike features",
    price: 6999,
    modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    tags: ["Premium", "Limited Edition"],
    rating: 4.7
  },
  {
    id: 3,
    title: "Wedding Cake Topper",
    description: "Personalized wedding cake topper from your photos",
    price: 3499,
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    tags: ["Custom", "Gift Idea"],
    rating: 5.0
  },
  {
    id: 4,
    title: "Gaming Character",
    description: "Your favorite gaming character in high-quality 3D print",
    price: 5499,
    modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    tags: ["Popular", "Gaming"],
    rating: 4.8
  }
];

const features = [
  {
    title: "30 DSLR Cameras",
    description: "Our studio uses 30 professional-grade DSLR cameras to capture every detail from all angles.",
    icon: "📸"
  },
  {
    title: "Blender Enhanced",
    description: "Expert 3D artists enhance your model in Blender with perfect details and textures.",
    icon: "🎨"
  },
  {
    title: "Professional 3D Printing",
    description: "State-of-the-art 3D printers create your model with precision and durability.",
    icon: "🖨️"
  },
  {
    title: "Home Delivery",
    description: "Your personalized 3D model delivered safely to your doorstep.",
    icon: "🚚"
  }
];

const Index = () => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const modelRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-rotate-slow');
        } else {
          entry.target.classList.remove('animate-rotate-slow');
        }
      });
    }, { threshold: 0.2 });
    
    modelRefs.current.forEach((ref) => {
      if (ref) {
        observerRef.current?.observe(ref);
      }
    });
    
    return () => {
      modelRefs.current.forEach((ref) => {
        if (ref) {
          observerRef.current?.unobserve(ref);
        }
      });
    };
  }, []);
  
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-gradient-to-br from-ideazzz-light via-white to-ideazzz-light">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] bg-ideazzz-pink opacity-10 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-ideazzz-purple opacity-10 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeInUp}
            className="flex flex-col justify-center"
          >
            <Badge className="mb-4 bg-ideazzz-pink/10 text-ideazzz-pink border-none text-sm py-1 px-3 w-fit">
              Premium 3D Personalization
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Your <span className="text-ideazzz-purple">Personal</span> Character in <span className="text-ideazzz-pink">3D</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
              Transform yourself into a stunning 3D model with our cutting-edge scanning technology. Perfect for gifts, memorabilia, or just because you deserve it!
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/booking">
                <Button className="btn-primary">
                  Book Your Scan <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/shop">
                <Button variant="outline" className="btn-secondary">
                  Shop 3D Models
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4 mt-8">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                From <span className="font-medium text-foreground">500+</span> satisfied customers
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.4 }}
            variants={fadeInUp}
            className="flex items-center justify-center h-[400px] md:h-[500px]"
          >
            <ModelViewer 
              modelUrl="https://modelviewer.dev/shared-assets/models/RobotExpressive.glb"
              className="w-full h-full" 
              autoRotate={true}
            />
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <Badge className="mb-4 bg-ideazzz-purple/10 text-ideazzz-purple border-none text-sm py-1 px-3">
              Our Process
            </Badge>
            <h2 className="section-title">How We Create Your 3D Model</h2>
            <p className="section-subtitle">
              State-of-the-art technology combined with expert craftsmanship to deliver personalized 3D models.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeInUp}
              >
                <Card className="h-full card-hover border-none shadow-lg bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Models Section */}
      <section className="py-20 bg-gradient-to-br from-ideazzz-light via-white to-ideazzz-light">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <Badge className="mb-4 bg-ideazzz-pink/10 text-ideazzz-pink border-none text-sm py-1 px-3">
              Featured Models
            </Badge>
            <h2 className="section-title">Popular 3D Models</h2>
            <p className="section-subtitle">
              Explore our collection of ready-to-ship 3D character models
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {models.map((model, index) => (
              <motion.div
                key={model.id}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeInUp}
                className="model-card"
              >
                <Card className="overflow-hidden card-hover border-none shadow-xl">
                  <div className="h-[300px] relative bg-gradient-to-br from-ideazzz-purple/5 to-ideazzz-pink/5">
                    <div 
                      ref={el => modelRefs.current[index] = el}
                      className="h-full w-full transform transition-transform duration-500"
                    >
                      <ModelViewer 
                        modelUrl={model.modelUrl} 
                        className="h-full"
                        autoRotate={false}
                      />
                    </div>
                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      {model.tags.map((tag, i) => (
                        <Badge key={i} className="bg-ideazzz-pink text-white border-none">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold">{model.title}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{model.rating}</span>
                      </div>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">{model.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold">₹{model.price.toLocaleString()}</span>
                      <Link to={`/shop/${model.id}`}>
                        <Button size="sm" className="bg-ideazzz-purple hover:bg-ideazzz-dark">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/shop">
              <Button size="lg" className="btn-primary">
                View All Models <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-ideazzz-dark text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              variants={fadeInUp}
            >
              <Badge className="mb-4 bg-white/10 text-white border-none text-sm py-1 px-3">
                Limited Time Offer
              </Badge>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Get 20% Off Your First 3D Scan
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Book your scanning session today and receive a special discount for first-time customers.
              </p>
              <Link to="/booking">
                <Button size="lg" className="bg-white text-ideazzz-purple hover:bg-gray-100">
                  Book Your Scan Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5 }}
            variants={fadeInUp}
            className="text-center mb-14"
          >
            <Badge className="mb-4 bg-ideazzz-purple/10 text-ideazzz-purple border-none text-sm py-1 px-3">
              Customer Stories
            </Badge>
            <h2 className="section-title">Why Our Customers Love Us</h2>
            <p className="section-subtitle">
              Hear what our satisfied customers have to say about their experience with Ideazzz
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((_, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: index * 0.1 }}
                variants={fadeInUp}
              >
                <Card className="card-hover border-none shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="mb-4 italic text-muted-foreground">
                      "I was amazed by the level of detail in my 3D model. The team at Ideazzz were professional and made the whole experience enjoyable. The final product exceeded my expectations!"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-ideazzz-purple/20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-ideazzz-purple font-bold">
                          {String.fromCharCode(65 + index)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold">Customer {index + 1}</h4>
                        <p className="text-sm text-muted-foreground">Mumbai</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-br from-ideazzz-light via-white to-ideazzz-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5 }}
              variants={fadeInUp}
            >
              <Badge className="mb-4 bg-ideazzz-purple/10 text-ideazzz-purple border-none text-sm py-1 px-3">
                Why Choose Ideazzz
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                The Ideazzz Advantage
              </h2>
              <p className="text-muted-foreground mb-8">
                Our combination of cutting-edge technology, artistic expertise, and commitment to quality sets us apart from the competition.
              </p>
              
              <div className="space-y-4">
                {[
                  "Highest resolution 3D scanning in the industry",
                  "Professional artists for detailed refinements",
                  "Premium quality printing materials",
                  "Fast turnaround time",
                  "100% satisfaction guarantee"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-ideazzz-pink mr-2 flex-shrink-0 mt-0.5" />
                    <p>{item}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Link to="/booking">
                  <Button className="btn-primary">
                    Book Your Scan <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div 
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.5, delay: 0.2 }}
              variants={fadeInUp}
              className="h-[500px]"
            >
              <ModelViewer 
                modelUrl="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                className="h-full" 
                autoRotate={true}
              />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
