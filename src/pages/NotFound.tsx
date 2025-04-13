
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useThemeContext } from "@/providers/ThemeProvider";

const NotFound = () => {
  const location = useLocation();
  const { theme } = useThemeContext();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className={`min-h-screen flex items-center justify-center ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'
    }`}>
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          Oops! Page not found
        </p>
        <a 
          href="/" 
          className={`${
            theme === 'dark' ? 'text-purple-400 hover:text-purple-300' : 'text-blue-500 hover:text-blue-700'
          } underline`}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
