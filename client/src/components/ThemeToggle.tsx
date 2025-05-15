import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button 
      onClick={toggleTheme}
      className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      <span className="flex items-center space-x-2">
        <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
      </span>
      <div className="w-10 h-5 bg-gray-300 dark:bg-[#9945FF] rounded-full relative">
        <div className={`w-4 h-4 absolute rounded-full bg-white top-0.5 ${isDark ? "left-5" : "left-0.5"} transition-all duration-300`}></div>
      </div>
    </button>
  );
}
