
import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { X, Menu, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface MenuItem {
  id: string;
  label: string;
  path: string;
  eyebrow?: string;
}

interface AnimatedSidebarProps {
  menuItems: MenuItem[];
}

const AnimatedSidebar: React.FC<AnimatedSidebarProps> = ({ menuItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isMobile = useIsMobile();

  const toggleSidebar = () => {
    setIsOpen(prev => !prev);
  };

  // Initialize GSAP animations
  useEffect(() => {
    // Create the main timeline
    const tl = gsap.timeline({ paused: true });
    timelineRef.current = tl;

    // Setup initial states
    gsap.set(menuRef.current, { x: '100%' });
    gsap.set(overlayRef.current, { autoAlpha: 0 });
    gsap.set(itemsRef.current, { y: 50, autoAlpha: 0 });

    // Add animations to timeline
    tl.to(overlayRef.current, { 
      autoAlpha: 1, 
      duration: 0.4, 
      ease: 'power3.inOut' 
    })
    .to(menuRef.current, { 
      x: '0%', 
      duration: 0.6, 
      ease: 'power3.out' 
    }, '-=0.2')
    .to(itemsRef.current, { 
      y: 0, 
      autoAlpha: 1, 
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out'
    }, '-=0.4');

    return () => {
      // Clean up animation on unmount
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
  }, [menuItems.length]);

  // Control animation when isOpen changes
  useEffect(() => {
    if (!timelineRef.current) return;

    if (isOpen) {
      // Play opening animation
      timelineRef.current.play();
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Reverse to close
      timelineRef.current.reverse();
      // Re-enable body scroll
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <>
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="menu-button fixed top-4 right-4 z-[120] p-3 rounded-full bg-purple-600/80 backdrop-blur-lg border border-purple-400/40 shadow-lg hover:bg-purple-700"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <div className="menu-button-text">
          <div className="icon-wrap">
            {isOpen ? (
              <X className="menu-button-icon h-5 w-5 text-white" />
            ) : (
              <Menu className="menu-button-icon h-5 w-5 text-white" />
            )}
          </div>
        </div>
      </button>

      {/* Navigation Menu */}
      <div 
        ref={sidebarRef} 
        className={`nav fixed inset-0 z-[100] pointer-events-none ${isOpen ? 'pointer-events-auto' : ''}`}
      >
        {/* Overlay */}
        <div 
          ref={overlayRef} 
          className="overlay absolute inset-0 bg-[#13131366] backdrop-blur-sm" 
          onClick={toggleSidebar}
        ></div>

        {/* Menu Container */}
        <div 
          ref={menuRef} 
          className="menu h-full w-full md:w-[35em] ml-auto relative overflow-auto bg-black/90"
          style={{ paddingTop: 'calc(3 * var(--menu-padding, 2em))', paddingBottom: 'var(--menu-padding, 2em)' }}
        >
          {/* Menu Background */}
          <div className="menu-bg absolute inset-0">
            <div className="bg-panel first absolute inset-0 rounded-l-[1.25em] bg-black/90"></div>
            <div className="bg-panel second absolute inset-0 rounded-l-[1.25em] translate-x-1 translate-y-1 bg-gray-900/80"></div>
          </div>

          {/* Menu Content */}
          <div className="menu-inner relative z-1 flex flex-col justify-between h-full p-4 md:p-8">
            {/* Menu Links */}
            <ul className="menu-list">
              {menuItems.map((item, index) => (
                <li 
                  key={item.id} 
                  ref={el => itemsRef.current[index] = el}
                  className="menu-list-item mb-4"
                >
                  <Link 
                    to={item.path} 
                    className="menu-link group w-full flex gap-3 py-3 px-[var(--menu-padding,2em)] relative rounded-md hover:bg-purple-600/20"
                    onClick={toggleSidebar}
                  >
                    <div className="menu-link-bg absolute inset-0 bg-black/60 origin-bottom rounded-md"></div>
                    <div className="flex flex-col z-1">
                      {item.eyebrow && (
                        <span className="eyebrow text-xs uppercase mb-1 text-purple-300">{item.eyebrow}</span>
                      )}
                      <h2 className="menu-link-heading text-[2.5rem] md:text-[5.625rem] uppercase font-bold leading-[0.75] text-white">
                        {item.label}
                      </h2>
                    </div>
                    <ChevronRight className="ml-auto self-center text-purple-300 opacity-60 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Menu Footer */}
            <div className="menu-details flex flex-col gap-5 px-[var(--menu-padding,2em)]">
              <p className="p-small text-purple-200">Connect with us</p>
              <div className="socials-row flex gap-6">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-large text-link text-white hover:text-purple-300">
                  Twitter
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-large text-link text-white hover:text-purple-300">
                  Instagram
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-large text-link text-white hover:text-purple-300">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AnimatedSidebar;
