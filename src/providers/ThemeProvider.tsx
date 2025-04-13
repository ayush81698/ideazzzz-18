
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Get theme values from our hook
  const { theme, toggleTheme } = useTheme();
  
  // Debug logging
  console.log("ThemeProvider current theme:", theme);

  // Apply theme class to document on mount and when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light', 'dark');
    
    // Add the current theme class
    root.classList.add(theme);
    
    // Update the root element's data-theme attribute
    root.setAttribute('data-theme', theme);
    
    // Apply body classes based on theme
    if (theme === 'dark') {
      document.body.classList.add('bg-black', 'text-white');
      document.body.classList.remove('bg-white', 'text-black');
    } else {
      document.body.classList.add('bg-white', 'text-black');
      document.body.classList.remove('bg-black', 'text-white');
    }
    
    console.log("ThemeProvider: Theme applied to document:", theme);
    
    // Force re-render of components that might not be directly connected to the theme context
    document.dispatchEvent(new Event('themeChanged'));
    
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
};
