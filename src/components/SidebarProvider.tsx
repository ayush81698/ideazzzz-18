
import React from 'react';
import AnimatedSidebar from './AnimatedSidebar';

// Define our navigation items
const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    path: '/',
    eyebrow: 'Start'
  },
  {
    id: 'shop',
    label: 'Shop',
    path: '/shop',
    eyebrow: 'Products'
  },
  {
    id: 'booking',
    label: 'Booking',
    path: '/booking',
    eyebrow: 'Sessions'
  },
  {
    id: 'about',
    label: 'About',
    path: '/about',
    eyebrow: 'Info'
  }
];

interface SidebarProviderProps {
  children: React.ReactNode;
}

const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen">
      <AnimatedSidebar menuItems={navigationItems} />
      {children}
    </div>
  );
};

export default SidebarProvider;
