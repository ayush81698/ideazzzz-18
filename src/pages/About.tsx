import React from 'react';
import { motion } from 'framer-motion';
import { 
  Card, CardContent
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Camera, Cpu, Printer } from 'lucide-react';

const About = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const teamMembers = [
    {
      name: 'Ayush Kumar',
      role: 'Founder & CEO',
      bio: 'Former 3D artist with 10+ years of experience in the animation industry. Passionate about bringing personalized 3D modeling to everyone.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    },
    {
      name: 'Priya Sharma',
      role: 'Head of 3D Design',
      bio: 'Expert 3D modeler with background in character design for major animation studios. Ensures every model meets our exacting quality standards.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    },
    {
      name: 'Rahul Mehta',
      role: 'Technical Director',
      bio: 'Hardware specialist responsible for our cutting-edge scanning technology. Previously worked on 3D scanning systems for medical applications.',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    },
    {
      name: 'Neha Patel',
      role: 'Customer Experience Manager',
      bio: 'Ensures every customer has an amazing experience from their first scan to final delivery. Background in luxury retail customer service.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80'
    }
  ];

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5 }}
          variants={fadeInUp}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-ideazzz-purple/10 text-ideazzz-purple border-none text-sm py-1 px-3">
            About Ideazzz
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Bringing Your Personality Into The Third Dimension
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're a team of artists, engineers, and innovators passionate about creating personalized 3D models that capture the essence of individuals and bring them to life.
          </p>
        </motion.div>
        
        {/* Our Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.1 }}
            variants={fadeInUp}
          >
            <Badge className="mb-4 bg-ideazzz-pink/10 text-ideazzz-pink border-none text-sm py-1 px-3">
              Our Story
            </Badge>
            <h2 className="text-3xl font-bold mb-6">From Idea to Ideazzz</h2>
            <div className="space-y-4 text-lg">
              <p>
                Founded in 2018, Ideazzz began when our founder Ayush Kumar, a 3D artist, realized that the technology to create personalized 3D models was becoming more accessible but remained out of reach for most people.
              </p>
              <p>
                After assembling a team of like-minded artists and engineers, we built our first scanning studio in Mumbai with just 10 cameras. Today, we operate state-of-the-art studios with 30 DSLR cameras for ultra-high-resolution scanning.
              </p>
              <p>
                Our mission is to democratize personalized 3D modeling by making it accessible, affordable, and incredibly detailed. We've served over 500 customers and continue to push the boundaries of what's possible in personalized 3D art.
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.5, delay: 0.2 }}
            variants={fadeInUp}
            className="relative"
          >
            <div className="aspect-video bg-gradient-to-r from-ideazzz-purple/10 to-ideazzz-pink/10 rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1000&q=80" 
                alt="Our journey" 
                className="w-full h-full object-cover mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ideazzz-purple/30 to-ideazzz-pink/30 rounded-xl"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center px-6">
                  <h3 className="text-2xl md:text-3xl font-bold mb-2">Our Journey</h3>
                  <p className="text-lg">From 10 cameras to 30, from concept to reality</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Our Process Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.3 }}
          variants={fadeInUp}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-ideazzz-purple/10 text-ideazzz-purple border-none text-sm py-1 px-3">
              Our Process
            </Badge>
            <h2 className="text-3xl font-bold mb-6">How We Create Your 3D Model</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our meticulous process ensures every detail is captured and rendered perfectly
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg overflow-hidden">
              <div className="h-2 bg-ideazzz-purple"></div>
              <CardContent className="p-6">
                <div className="mb-4 h-12 w-12 rounded-full bg-ideazzz-purple/10 flex items-center justify-center">
                  <Camera className="h-6 w-6 text-ideazzz-purple" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. High-Resolution Scanning</h3>
                <p className="text-muted-foreground">
                  We use 30 synchronized DSLR cameras to capture you from every angle simultaneously. This provides us with extremely detailed reference images for creating your 3D model.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg overflow-hidden">
              <div className="h-2 bg-ideazzz-pink"></div>
              <CardContent className="p-6">
                <div className="mb-4 h-12 w-12 rounded-full bg-ideazzz-pink/10 flex items-center justify-center">
                  <Cpu className="h-6 w-6 text-ideazzz-pink" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. Digital Artistry</h3>
                <p className="text-muted-foreground">
                  Our skilled 3D artists use Blender to transform your scan data into a detailed 3D model. We meticulously refine every detail to ensure a perfect likeness.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg overflow-hidden">
              <div className="h-2 bg-ideazzz-purple"></div>
              <CardContent className="p-6">
                <div className="mb-4 h-12 w-12 rounded-full bg-ideazzz-purple/10 flex items-center justify-center">
                  <Printer className="h-6 w-6 text-ideazzz-purple" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Precision 3D Printing</h3>
                <p className="text-muted-foreground">
                  Using industrial-grade 3D printers, we bring your digital model into the physical world with incredible detail and durability, followed by expert finishing touches.
                </p>
              </CardContent>
            </Card>
          </div>
        </motion.div>
        
        {/* Our Team Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.4 }}
          variants={fadeInUp}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-ideazzz-pink/10 text-ideazzz-pink border-none text-sm py-1 px-3">
              Our Team
            </Badge>
            <h2 className="text-3xl font-bold mb-6">Meet the Creators</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our team combines artistic vision with technical expertise
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.5, delay: 0.1 * index }}
                variants={fadeInUp}
              >
                <Card className="border-none shadow-lg overflow-hidden card-hover">
                  <CardContent className="p-0">
                    <div className="aspect-square overflow-hidden">
                      <img 
                        src={member.image} 
                        alt={member.name} 
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold">{member.name}</h3>
                      <p className="text-ideazzz-purple mb-2">{member.role}</p>
                      <p className="text-muted-foreground text-sm">{member.bio}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Why Choose Us Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.5 }}
          variants={fadeInUp}
          className="mb-24"
        >
          <div className="text-center mb-12">
            <Badge className="mb-4 bg-ideazzz-purple/10 text-ideazzz-purple border-none text-sm py-1 px-3">
              Why Choose Us
            </Badge>
            <h2 className="text-3xl font-bold mb-6">The Ideazzz Advantage</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              What sets us apart from other 3D modeling services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Unmatched Resolution",
                description: "Our 30-camera setup captures details that others miss, from the smallest facial features to clothing textures."
              },
              {
                title: "Artistic Expertise",
                description: "Our team includes veteran 3D artists who go beyond automation to add the human touch that makes each model special."
              },
              {
                title: "Premium Materials",
                description: "We use only the highest quality printing materials for durability, detail retention, and beautiful finish."
              },
              {
                title: "Personalized Experience",
                description: "From your initial consultation to delivery, we provide a premium, personalized experience tailored to your needs."
              },
              {
                title: "Quick Turnaround",
                description: "Despite our meticulous attention to detail, we deliver most orders within 2-3 weeks."
              },
              {
                title: "Satisfaction Guarantee",
                description: "We're not happy until you're happy. We'll work with you until your model meets your expectations."
              }
            ].map((advantage, index) => (
              <Card key={index} className="border-none shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-ideazzz-pink mr-3 mt-1" />
                    <div>
                      <h3 className="text-lg font-bold mb-2">{advantage.title}</h3>
                      <p className="text-muted-foreground">{advantage.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
        
        {/* CTA Section */}
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.5, delay: 0.6 }}
          variants={fadeInUp}
          className="bg-gradient-to-r from-ideazzz-purple to-ideazzz-pink rounded-2xl p-8 md:p-12 text-white text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Create Your 3D Model?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Book your scanning session today and join hundreds of satisfied customers who have experienced the Ideazzz difference.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/booking">
              <Button size="lg" className="bg-white text-ideazzz-purple hover:bg-gray-100">
                Book a Scanning Session <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Browse Our Collection
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
