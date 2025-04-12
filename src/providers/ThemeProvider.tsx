
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
    
    // Set background color for dark mode
    if (themeValue.theme === 'dark') {
      document.body.classList.add('bg-black', 'text-white');
      document.body.classList.remove('bg-white', 'text-black');
    } else {
      document.body.classList.add('bg-white', 'text-black');
      document.body.classList.remove('bg-black', 'text-white');
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
