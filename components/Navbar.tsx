'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  const navItemClass =
    'text-base font-bold text-gray-800 hover:text-gray-400 transition-colors';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group"
          >
            <Image
              src="/logo.webp"
              alt="The Car Store Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="text-2xl font-bold tracking-tight text-black">
              The Car Store
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('featured')} className={navItemClass}>
              Featured
            </button>
            <button onClick={() => scrollToSection('brands')} className={navItemClass}>
              Brands
            </button>
            <button onClick={() => scrollToSection('about')} className={navItemClass}>
              About
            </button>
            <button onClick={() => scrollToSection('types')} className={navItemClass}>
              Types
            </button>
            <a href="/inventory" className={navItemClass}>
  Inventory
</a>
            <button onClick={() => scrollToSection('sold')} className={navItemClass}>
              Sold
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 "
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-gray-900 transition-transform duration-300 ${
                  isMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-gray-900 transition-opacity duration-300 ${
                  isMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-gray-900 transition-transform duration-300 ${
                  isMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-neutral-800 py-4">
            <div className="flex flex-col gap-3">
              {['featured', 'brands', 'types', 'inventory', 'sold'].map(
                (section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className="text-left text-base font-bold text-gray-900 hover:text-gray-400 transition-colors py-2"
                  >
                    {section === 'inventory'
                      ? 'All Cars'
                      : section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}