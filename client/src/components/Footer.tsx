import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} SolTipConnect. All rights reserved.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
            Home
          </Link>
          <Link to="/send" className="text-sm text-muted-foreground hover:text-foreground">
            Send Tip
          </Link>
          <Link to="/connect" className="text-sm text-muted-foreground hover:text-foreground">
            Connect Platforms
          </Link>
        </div>
      </div>
    </footer>
  );
} 