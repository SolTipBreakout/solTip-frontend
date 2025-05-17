import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-purple-900/20 py-6 md:py-8 bg-black/30 backdrop-blur-md">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <p className="text-sm text-white">
            &copy; {new Date().getFullYear()} SolTipConnect. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-white hover:text-purple-300 transition-colors">
            Home
          </Link>
          <Link to="/send" className="text-sm text-white hover:text-purple-300 transition-colors">
            Send Tip
          </Link>
          <Link to="/connect" className="text-sm text-white hover:text-purple-300 transition-colors">
            Connect Platforms
          </Link>
        </div>
      </div>
    </footer>
  );
} 