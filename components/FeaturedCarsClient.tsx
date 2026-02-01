'use client';

import { useRef, useEffect, useState } from 'react';
import CarCard from './CarCard';
import Link from 'next/link';
import { FaArrowRight } from 'react-icons/fa';
import { Car } from '@/lib/types';

export default function FeaturedCarsClient({ cars }: { cars: Car[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px is typical tablet/mobile breakpoint
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // On mobile, intercept vertical touch gestures so they scroll the page, not the horizontal container
  useEffect(() => {
    if (!isMobile) return;

    const container = scrollContainerRef.current;
    if (!container) return;

    let startX = 0;
    let startY = 0;
    let lastY = 0;
    let isVertical: boolean | null = null; // null = undecided

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      lastY = startY;
      isVertical = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - startX);
      const dy = Math.abs(touch.clientY - startY);

      // Decide direction once we have enough movement
      if (isVertical === null && (dx > 5 || dy > 5)) {
        isVertical = dy > dx;
      }

      if (isVertical) {
        // Scroll the page by the delta since last move
        const deltaY = touch.clientY - lastY;
        window.scrollBy({ top: -deltaY, behavior: 'auto' });
        lastY = touch.clientY;
        e.preventDefault(); // stop the horizontal container from scrolling
      }

      // If horizontal, do nothing — let the container handle it natively
    };

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchmove', onTouchMove, { passive: false });

    return () => {
      container.removeEventListener('touchstart', onTouchStart);
      container.removeEventListener('touchmove', onTouchMove);
    };
  }, [isMobile]);

  // Desktop: convert vertical wheel into horizontal scroll
  useEffect(() => {
    if (isMobile) return;

    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = (e: WheelEvent) => {
      const container = scrollContainerRef.current;
      const section = sectionRef.current;
      
      if (!container || !section) return;

      // Check if mouse is over the section
      const rect = section.getBoundingClientRect();
      const isOverSection = 
        e.clientY >= rect.top && 
        e.clientY <= rect.bottom &&
        e.clientX >= rect.left && 
        e.clientX <= rect.right;

      if (!isOverSection) return;

      const { scrollLeft, scrollWidth, clientWidth } = container;
      const isAtStart = scrollLeft <= 1;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;

      // Scrolling down
      if (e.deltaY > 0 && !isAtEnd) {
        e.preventDefault();
        e.stopPropagation();
        setIsScrolling(true);
        container.scrollLeft += e.deltaY;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
        return;
      }
      
      // Scrolling up
      if (e.deltaY < 0 && !isAtStart) {
        e.preventDefault();
        e.stopPropagation();
        setIsScrolling(true);
        container.scrollLeft += e.deltaY;
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => setIsScrolling(false), 150);
        return;
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false, capture: true });
    
    return () => {
      window.removeEventListener('wheel', handleScroll, { capture: true });
      clearTimeout(scrollTimeout);
    };
  }, [isMobile]);

  return (
    <section 
      ref={sectionRef} 
      id="featured" 
      className="px-6 py-16 md:py-20"
      style={{ position: 'relative' }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Featured Vehicles
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Handpicked premium vehicles from our exclusive collection
          </p>
        </div>

        {/* Horizontal Scrollable Container */}
        <div className="relative mb-12">
          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-scroll md:overflow-x-auto overflow-y-visible md:overflow-y-hidden pb-4 [&::-webkit-scrollbar]:hidden"
            style={isMobile ? undefined : { 
              scrollBehavior: isScrolling ? 'auto' : 'smooth',
              overscrollBehavior: 'contain'
            }}
          >
            <div className="flex gap-6 md:gap-8" style={{ minWidth: 'min-content' }}>
              {cars.map((car) => (
                <div key={car.id} className="flex-shrink-0 w-[300px] md:w-[350px] lg:w-[400px]">
                  <CarCard car={car} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View More Button */}
        <div className="flex justify-center">
          <Link
            href="/inventory"
            className="bg-white group inline-flex items-center justify-center gap-3 border-2 border-black text-black px-8 py-4 text-base font-bold tracking-wide hover:bg-white-80 hover:text-black/80 hover:rounded-2xl transition-all"
          >
            View All Inventory
            <FaArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}