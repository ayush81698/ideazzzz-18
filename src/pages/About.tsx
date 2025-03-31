
import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="py-12 bg-black text-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About ADeazzz</h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Creating personalized 3D figurines from your photos with AI precision
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
            <p className="text-gray-400 mb-4">
              ADeazzz was born from a simple idea: to transform ordinary photos into extraordinary 3D models. Our founder, a passionate 3D artist, noticed how difficult it was for people to get custom figurines made without spending a fortune.
            </p>
            <p className="text-gray-400 mb-4">
              In 2023, we developed a proprietary AI-powered 3D modeling system that can accurately recreate human features from just a few photos. This technology has allowed us to democratize custom 3D figurines, making them accessible to everyone.
            </p>
            <p className="text-gray-400">
              Today, we're proud to serve customers across India, delivering handcrafted, personalized 3D figurines for all occasions - from wedding cake toppers to superhero action figures of your children.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <img 
              src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=80" 
              alt="3D printing workshop" 
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-400">
            We believe everyone deserves to see themselves represented in 3D art. Our mission is to make custom 3D figurines accessible, affordable, and of the highest quality, while pushing the boundaries of what's possible with AI-assisted 3D modeling.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">High Quality Materials</h3>
            <p className="text-gray-400">
              We use premium PLA and resin to ensure your figurines are durable, detailed, and environmentally friendly.
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">AI-Powered Modeling</h3>
            <p className="text-gray-400">
              Our proprietary AI technology creates accurate 3D models from regular photos with remarkable detail.
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Handcrafted Finishing</h3>
            <p className="text-gray-400">
              Each figurine is hand-painted by skilled artists who bring the models to life with incredible attention to detail.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Get In Touch</h2>
          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Have questions about our process or want to discuss a custom order? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:hello@adeazzz.com" className="bg-ideazzz-purple hover:bg-ideazzz-purple/80 text-white px-8 py-3 rounded-lg font-medium">
              Email Us
            </a>
            <a href="/booking" className="bg-transparent border border-ideazzz-purple text-ideazzz-purple hover:bg-ideazzz-purple/10 px-8 py-3 rounded-lg font-medium">
              Book a Consultation
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
