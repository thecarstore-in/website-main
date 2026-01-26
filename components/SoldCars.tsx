'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

const SOLD_IMAGES = [
  '1.webp',
  '2.webp',
  '3.webp',
  '4.webp',
  '5.webp',
];

const IMAGE_BASE =
  'https://cdn.jsdelivr.net/gh/thecarstore-in/cars/sold/';

export default function SoldShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let animationId: number;
    let position = 0;

    const speed = 0.3; // lower = slower, premium feel

    const animate = () => {
      position -= speed;
      if (Math.abs(position) >= track.scrollWidth / 2) {
        position = 0;
      }
      track.style.transform = `translateX(${position}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section
      id="sold"
      className="py-32 bg-black text-gray-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 ">
          Recently Sold
        </h2>
        <p className="text-gray-400 max-w-xl">
          A selection of vehicles that found their next owners through AutoHub.
        </p>
      </div>

      {/* Slider */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {[...SOLD_IMAGES, ...SOLD_IMAGES].map((img, index) => (
            <div
              key={index}
              className="relative w-[320px] h-[220px] flex-shrink-0"
            >
              <Image
                src={`${IMAGE_BASE}${img}`}
                alt="Sold car"
                fill
                className="object-cover grayscale"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
