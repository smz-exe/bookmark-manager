'use client';

import React, { useRef, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGradientProps {
  colors: string[];
  speed?: number;
  blur?: 'light' | 'medium' | 'heavy';
}

interface BlobStyle {
  top: string;
  left: string;
  width: number;
  height: number;
  tx1: number;
  ty1: number;
  tx2: number;
  ty2: number;
  tx3: number;
  ty3: number;
  tx4: number;
  ty4: number;
}

// Define fixed blob positions for server-side rendering
// These must remain constant to avoid hydration mismatches
const fixedBlobStyles: BlobStyle[] = [
  {
    top: '25%',
    left: '20%',
    width: 600,
    height: 600,
    tx1: 0.2,
    ty1: 0.1,
    tx2: 0.3,
    ty2: 0.2,
    tx3: 0.1,
    ty3: 0.3,
    tx4: 0.2,
    ty4: 0.1,
  },
  {
    top: '15%',
    left: '30%',
    width: 700,
    height: 700,
    tx1: -0.2,
    ty1: 0.3,
    tx2: 0.1,
    ty2: -0.2,
    tx3: -0.1,
    ty3: -0.3,
    tx4: 0.3,
    ty4: 0.2,
  },
  {
    top: '30%',
    left: '10%',
    width: 550,
    height: 650,
    tx1: 0.1,
    ty1: -0.2,
    tx2: -0.3,
    ty2: 0.1,
    tx3: 0.2,
    ty3: -0.1,
    tx4: -0.1,
    ty4: -0.2,
  },
];

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({
  colors,
  speed = 0.05,
  blur = 'light',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only set mounted to true on client-side
    setMounted(true);
  }, []);

  const blurClass = blur === 'light' ? 'blur-2xl' : blur === 'medium' ? 'blur-3xl' : 'blur-[100px]';

  // If not mounted yet (server-side), don't render the animated elements
  if (!mounted) {
    return <div ref={containerRef} className="absolute inset-0 overflow-hidden" />;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      <div className={cn(`absolute inset-0`, blurClass)}>
        {colors.slice(0, 3).map((color, index) => {
          // Always use fixed positions for consistency
          const style = fixedBlobStyles[index];

          if (!style) return null;

          return (
            <svg
              key={index}
              className="absolute animate-background-gradient"
              style={
                {
                  top: style.top,
                  left: style.left,
                  '--background-gradient-speed': `${1 / speed}s`,
                  '--tx-1': style.tx1,
                  '--ty-1': style.ty1,
                  '--tx-2': style.tx2,
                  '--ty-2': style.ty2,
                  '--tx-3': style.tx3,
                  '--ty-3': style.ty3,
                  '--tx-4': style.tx4,
                  '--ty-4': style.ty4,
                } as React.CSSProperties
              }
              width={style.width}
              height={style.height}
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="50"
                fill={color}
                className="opacity-30 dark:opacity-[0.15]"
              />
            </svg>
          );
        })}
      </div>
    </div>
  );
};

export { AnimatedGradient };
