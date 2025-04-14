
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from './providers/ThemeProvider';

// Import model-viewer script once at the application root level
// This ensures it's only loaded once and available throughout the app
import '@google/model-viewer';

// Add CORS headers for AR content via meta tags
const addCorsMetaTags = () => {
  const corsMetaTag = document.createElement('meta');
  corsMetaTag.setAttribute('http-equiv', 'Cross-Origin-Opener-Policy');
  corsMetaTag.setAttribute('content', 'same-origin-allow-popups');
  document.head.appendChild(corsMetaTag);
};

// Run configuration functions
if (typeof window !== 'undefined') {
  addCorsMetaTags();
  
  // Log AR capability for debugging
  const isIOSDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroidDevice = /Android/i.test(navigator.userAgent);
  console.log(`Device detection: iOS=${isIOSDevice}, Android=${isAndroidDevice}`);
  
  // Check if WebXR is supported (for AR)
  if ('xr' in window.navigator) {
    (navigator as any).xr?.isSessionSupported('immersive-ar')
      .then((supported: boolean) => {
        console.log(`WebXR AR supported: ${supported}`);
      })
      .catch((err: any) => {
        console.log(`WebXR check error: ${err}`);
      });
  } else {
    console.log('WebXR not available in this browser');
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster position="top-right" />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
