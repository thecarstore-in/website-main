'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaWhatsapp, FaChevronDown } from 'react-icons/fa';

const IMAGES = [
  'https://cdn.jsdelivr.net/gh/thecarstore-in/cars/hero/1.webp',
  'https://cdn.jsdelivr.net/gh/thecarstore-in/cars/hero/2.webp',
  'https://cdn.jsdelivr.net/gh/thecarstore-in/cars/hero/3.webp',
];

const WHATSAPP_NUMBER = '918135843184'; 

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Images */}
      {IMAGES.map((src, index) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={src}
            alt="Premium pre-owned cars"
            fill
            priority={index === 0}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <div className="max-w-5xl text-center">
          {/* Tagline */}
          <div className="mb-8 inline-block">
            <p className="text-sm md:text-base font-bold tracking-[0.3em] text-white uppercase border-t border-b border-white/30 py-2 px-6">
              Curated Excellence
            </p>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-8 leading-tight">
            Premium Pre-Owned
            <br />
            <span className="text-gray-300">Vehicles</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed mb-12 font-medium">
            Handpicked selection of certified used cars.
            <br />
            Quality assured. Transparent pricing.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20I%20am%20interested%20in%20your%20cars`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:rounded-2xl inline-flex items-center justify-center gap-3 bg-white text-black px-8 py-4 text-base font-bold tracking-wide hover:bg-gray-200 transition-all min-w-[240px]"
            >
              <FaWhatsapp size={20} />
              Contact on WhatsApp
            </a>

            <Link
              href="/inventory"
              className="hover:rounded-2xl inline-flex items-center justify-center gap-3 border-2 border-white text-white px-8 py-4 text-base font-bold tracking-wide hover:bg-white hover:text-black transition-all min-w-[240px]"
            >
              Browse Inventory
            </Link>
          </div>

          {/* Slider Indicators */}
          <div className="flex items-center justify-center gap-2">
            {IMAGES.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`h-1 transition-all ${
                  index === current ? 'w-12 bg-white' : 'w-8 bg-white/40'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Chevron → ROUTES (NO SCROLL) */}
      <Link
        href="/inventory"
        className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 animate-bounce"
        aria-label="Go to inventory page"
      >
        <FaChevronDown className="text-white" size={24} />
      </Link>
    </section>
  );
}
