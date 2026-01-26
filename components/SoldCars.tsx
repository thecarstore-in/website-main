'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

const IMAGE_BASE =
  'https://cdn.jsdelivr.net/gh/thecarstore-in/cars/sold/';

const GITHUB_API_URL =
  'https://api.github.com/repos/thecarstore-in/cars/contents/sold';

export default function SoldShowcase() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<string[]>([]);

  // Fetch images from GitHub repo
  useEffect(() => {
    async function fetchImages() {
      try {
        const response = await fetch(GITHUB_API_URL);
        const files = await response.json();
        
        // Filter only image files
        const imageFiles = files
          .filter((file: any) => 
            file.type === 'file' && 
            /\.(webp|jpg|jpeg|png)$/i.test(file.name)
          )
          .map((file: any) => file.name);
        
        setImages(imageFiles);
      } catch (error) {
        console.error('Error fetching sold images:', error);
        // Fallback to empty array
        setImages([]);
      }
    }

    fetchImages();
  }, []);

  // Animate the slider
  useEffect(() => {
    const track = trackRef.current;
    if (!track || images.length === 0) return;

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
  }, [images]);

  if (images.length === 0) {
    return null; // or a loading state
  }

  return (
    <section
      id="sold"
      className="py-32 bg-black text-gray-100 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12">
          Recently Sold
        </h2>
        <p className="text-gray-400 max-w-xl">
          A selection of vehicles that found their next owners through The Car Store.
        </p>
      </div>

      {/* Slider */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex gap-8 will-change-transform"
          style={{ width: 'max-content' }}
        >
          {[...images, ...images].map((img, index) => (
            <div
              key={index}
              className="relative w-[320px] h-[220px] flex-shrink-0"
            >
              <Image
                src={`${IMAGE_BASE}${img}`}
                alt="Sold car"
                fill
                className="object-cover "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}