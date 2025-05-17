import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const themeConfig = {
  colors: {
    primary: {
      DEFAULT: "#9945FF",
      foreground: "#FFFFFF",
    },
    secondary: {
      DEFAULT: "#14F195",
      foreground: "#000000",
    },
    background: {
      DEFAULT: "#000000",
      card: "#0A0A0A",
    },
    foreground: {
      DEFAULT: "#FFFFFF",
      muted: "#A1A1AA",
    },
    muted: {
      DEFAULT: "#27272A",
      foreground: "#A1A1AA",
    },
    border: {
      DEFAULT: "#27272A",
    },
    ring: {
      DEFAULT: "#9945FF",
    },
    success: {
      DEFAULT: "#14F195",
      muted: "#0D9D63",
    },
    warning: {
      DEFAULT: "#FFB800",
      muted: "#B38200",
    },
    error: {
      DEFAULT: "#FF4B4B",
      muted: "#B33333",
    },
  },
  borderRadius: {
    lg: "0.75rem",
    md: "0.5rem",
    sm: "0.25rem",
  },
  container: {
    center: true,
    padding: "1rem",
  },
  fonts: {
    sans: ["Inter", "sans-serif"],
    mono: ["JetBrains Mono", "monospace"],
  },
  animation: {
    default: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "500ms cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const; 