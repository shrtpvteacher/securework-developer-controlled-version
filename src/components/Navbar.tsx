import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Menu, X } from 'lucide-react';
import WalletConnect from './WalletConnect';


const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/job-board', label: 'Job Board Gallery' },
    { path: '/create-job', label: 'Create Job' },
    { path: '/client-dashboard', label: 'Client Dashboard' },
    { path: '/freelancer-dashboard', label: 'Freelancer Dashboard' },
    
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
 <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8"> 
    <div className="flex items-center h-16">
      {/*  Left: logo + name */}
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="p-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-lg">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
          SecureWork
        </span>
      </Link>

      {/*  Center: links */}
      <ul className="hidden md:flex flex-1 justify-center space-x-4">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`px-1 py-4 text-sm font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-blue-600'
                      : 'text-gray-700 hover:text-blue-600'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

      {/* Right: wallet (desktop) */}
      <div className="hidden md:block shrink-0">
        <WalletConnect />
      </div>

      {/* Mobile controls */}
     <div className="md:hidden flex items-center gap-4 shrink-0">
            <WalletConnect />
            <button
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-1 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

          {/* Mobile dropdown */}
            {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <ul className="px-2 py-3 space-y-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(link.path)
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;