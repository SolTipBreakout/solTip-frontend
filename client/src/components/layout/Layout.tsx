import { motion } from "framer-motion";
import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Animated gradient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_0%_0%,_#14F195_0%,_transparent_50%)]" />
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_100%_100%,_#9945FF_0%,_transparent_50%)]" />
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_50%_50%,_#14F195_0%,_transparent_20%)]" />
      </div>

      {/* Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Glass morphism header */}
          <header className="relative z-10 mb-8">
            <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    SolTip
                  </h1>
                </div>
                <nav className="flex items-center space-x-4">
                  {/* Add your navigation items here */}
                </nav>
              </div>
            </div>
          </header>

          {/* Main content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </motion.main>
    </div>
  );
} 