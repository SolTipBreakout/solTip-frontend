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
    <div 
      onClick={toggleTheme}
      className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
    >
      <span className="flex items-center space-x-2 text-gray-300">
        <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
        <span>{isDark ? "Light Mode" : "Dark Mode"}</span>
      </span>
      <div className="w-10 h-5 bg-gray-700 rounded-full relative">
        <div className={`w-4 h-4 absolute rounded-full bg-[#14F195] top-0.5 ${isDark ? "left-5" : "left-0.5"} transition-all duration-300`}></div>
      </div>
    </div>
  );
}
