
import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeValue = useTheme();

  // Apply theme class to document on mount and when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(themeValue.theme);
    
    // Update the root element's data-theme attribute as well
    root.setAttribute('data-theme', themeValue.theme);
    
    // Set background color and text color based on theme
    if (themeValue.theme === 'dark') {
      document.body.className = 'bg-black text-white';
    } else {
      document.body.className = 'bg-white text-black';
    }
  }, [themeValue.theme]);

  return (
    <ThemeContext.Provider value={themeValue}>
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
