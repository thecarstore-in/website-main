'use client';

import { useEffect, useRef, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  stagger?: boolean;
  staggerDelay?: number;
  animation?: 'fade-up' | 'fade-left' | 'fade-right' | 'scale' | 'none';
}

export default function AnimatedSection({ 
  children, 
  stagger = false,
  staggerDelay = 100,
  animation = 'fade-up'
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (stagger) {
              // Stagger animation for children
              const children = Array.from(element.children) as HTMLElement[];
              children.forEach((child, index) => {
                setTimeout(() => {
                  child.style.opacity = '1';
                  child.style.transform = 'translateY(0) translateX(0) scale(1)';
                }, index * staggerDelay);
              });
            } else {
              // Simple fade in for whole section
              element.style.opacity = '1';
              element.style.transform = 'translateY(0) translateX(0) scale(1)';
            }
            
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px',
      }
    );

    // Set initial styles
    if (stagger) {
      const children = Array.from(element.children) as HTMLElement[];
      children.forEach((child) => {
        (child as HTMLElement).style.opacity = '0';
        (child as HTMLElement).style.transition = 'all 0.6s ease-out';
        
        if (animation === 'fade-left') {
          (child as HTMLElement).style.transform = 'translateX(-30px)';
        } else if (animation === 'fade-right') {
          (child as HTMLElement).style.transform = 'translateX(30px)';
        } else if (animation === 'scale') {
          (child as HTMLElement).style.transform = 'scale(0.8)';
        } else {
          (child as HTMLElement).style.transform = 'translateY(30px)';
        }
      });
    } else {
      element.style.opacity = '0';
      element.style.transition = 'all 0.8s ease-out';
      element.style.transform = 'translateY(50px)';
    }

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [stagger, staggerDelay, animation]);

  return (
    <div ref={ref}>
      {children}
    </div>
  );
}