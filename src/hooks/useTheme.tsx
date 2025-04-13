
import { useState, useEffect } from 'react';
import { useThemeContext } from '@/providers/ThemeProvider';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Initialize theme from localStorage with light as fallback
  const [theme, setTheme] = useState<Theme>(() => {
    // Ensure we're in a browser environment
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        console.log("Using saved theme from localStorage:", savedTheme);
        return savedTheme;
      }
      
      // Default to light theme if no saved preference
      console.log("No saved theme, using default light theme");
      return 'light';
    }
    return 'light'; // Default to light theme as fallback
  });

  useEffect(() => {
    // Store the theme preference in localStorage whenever it changes
    if (theme) {
      localStorage.setItem('theme', theme);
      console.log('Theme set in localStorage:', theme);
      
      // Dispatch a custom event to notify other components
      window.dispatchEvent(new CustomEvent('themeChange', { detail: theme }));
    }
  }, [theme]);

  const toggleTheme = () => {
    console.log("Toggle theme called, current theme:", theme);
    setTheme(prevTheme => {
      const newTheme = prevTheme === 'dark' ? 'light' : 'dark';
      console.log("Switching theme to:", newTheme);
      return newTheme;
    });
  };

  return { theme, toggleTheme };
}

// Separate component for the theme switcher
export const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useThemeContext();
  
  return (
    <button
      onClick={toggleTheme}
      className={`p-2 rounded-full transition-colors ${
        theme === 'dark' 
          ? 'bg-gray-700 hover:bg-gray-600' 
          : 'bg-gray-200 hover:bg-gray-300'
      }`}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      )}
    </button>
  );
};
