
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeContext } from '@/providers/ThemeProvider';

const About = () => {
  const { theme } = useThemeContext();
  
  useEffect(() => {
    console.log("About page theme:", theme);
  }, [theme]);
  
  // Define classes based on theme
  const bgClass = theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800';
  const cardClass = theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100';
  const buttonTextClass = theme === 'dark' ? 'text-white' : 'text-purple-700';

  return (
    <div className={`py-12 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our vision</h1>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} max-w-2xl mx-auto`}>
            trusted by 50+ clients 
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              IDEAZZZZ is a innovative, creative and affirmative hub which is built on talent and relationships. Our cosmopolitan team is based in Mumbai, India
            </p>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
              INF IDEAZZZZ CREATIVE PVT LTD is a 360 Degree Creative & Innovative Hub where Ideas are Explored, Imaginations are Given Life, Creativity is been flourished and Execution flashes the strength of our Creative & Innovative Team.
            </p>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              We showcase our passionate concepts & presentations to the world through Digital, AR-VR, Television, Events, Films, Outdoor, Print and Radio Media for our Clients.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="relative h-[400px] rounded-lg overflow-hidden"
          >
            <img 
              src="https://www.ideazzzz.com/wp-content/uploads/elementor/thumbs/1-Banner-1-qjjq1s4yrx10812141c684yjo0m7s258d3guuu688w.jpeg" 
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
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            We believe everyone deserves to see themselves represented in 3D art. Our mission is to make custom 3D figurines accessible, affordable, and of the highest quality, while pushing the boundaries of what's possible with AI-assisted 3D modeling.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <div className={`${cardClass} rounded-lg p-6`}>
            <h3 className="text-xl font-bold mb-4">High Quality Materials</h3>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              We use premium PLA and resin to ensure your figurines are durable, detailed, and environmentally friendly.
            </p>
          </div>
          
          <div className={`${cardClass} rounded-lg p-6`}>
            <h3 className="text-xl font-bold mb-4">AI-Powered Modeling</h3>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Our proprietary AI technology creates accurate 3D models from regular photos with remarkable detail.
            </p>
          </div>
          
          <div className={`${cardClass} rounded-lg p-6`}>
            <h3 className="text-xl font-bold mb-4">Handcrafted Finishing</h3>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
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
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-8 max-w-2xl mx-auto`}>
            Have questions about our process or want to discuss a custom order? We'd love to hear from you!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a href="mailto:hello@adeazzz.com" className="bg-ideazzz-purple hover:bg-ideazzz-purple/80 text-white px-8 py-3 rounded-lg font-medium">
              Email Us
            </a>
            <a href="/booking" className={`bg-transparent border border-ideazzz-purple ${buttonTextClass} hover:bg-ideazzz-purple/10 px-8 py-3 rounded-lg font-medium`}>
              Book a Consultation
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
