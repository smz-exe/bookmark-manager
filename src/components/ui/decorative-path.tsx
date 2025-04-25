'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DecorativePathProps {
  className?: string;
  variant?: 'primary' | 'secondary';
  animated?: boolean;
}

export function DecorativePath({
  className,
  variant = 'primary',
  animated = true,
}: DecorativePathProps) {
  const isSecondary = variant === 'secondary';

  // Animation variants for path drawing
  const pathAnimation = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { type: 'spring', duration: 1.5, bounce: 0, delay: i * 0.2 },
        opacity: { duration: 0.5, delay: i * 0.2 },
      },
    }),
  };

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none z-0', className)}>
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Abstract flowing paths */}
        {animated ? (
          <>
            <motion.path
              d="M-100,240 C150,290 400,100 550,280 C700,460 1100,170 1300,290"
              stroke={isSecondary ? 'url(#gradient-secondary)' : 'url(#gradient-primary)'}
              strokeWidth="2"
              strokeDasharray="12,12"
              custom={0}
              initial="hidden"
              animate="visible"
              variants={pathAnimation}
              className="opacity-30"
            />
            <motion.path
              d="M-100,500 C200,450 450,700 650,450 C850,200 950,650 1300,600"
              stroke={isSecondary ? 'url(#gradient-secondary-alt)' : 'url(#gradient-primary-alt)'}
              strokeWidth="2"
              strokeDasharray="8,14"
              custom={1}
              initial="hidden"
              animate="visible"
              variants={pathAnimation}
              className="opacity-40"
            />
            <motion.path
              d="M-100,100 C150,90 300,400 500,320 C700,240 900,350 1300,150"
              stroke={isSecondary ? 'url(#gradient-secondary)' : 'url(#gradient-primary)'}
              strokeWidth="2"
              custom={2}
              initial="hidden"
              animate="visible"
              variants={pathAnimation}
              className="opacity-20"
            />
            <motion.path
              d="M-100,750 C100,700 300,750 500,650 C700,550 900,750 1300,700"
              stroke={isSecondary ? 'url(#gradient-secondary-alt)' : 'url(#gradient-primary-alt)'}
              strokeWidth="2"
              strokeDasharray="5,10"
              custom={3}
              initial="hidden"
              animate="visible"
              variants={pathAnimation}
              className="opacity-30"
            />
          </>
        ) : (
          <>
            <path
              d="M-100,240 C150,290 400,100 550,280 C700,460 1100,170 1300,290"
              stroke={isSecondary ? 'url(#gradient-secondary)' : 'url(#gradient-primary)'}
              strokeWidth="2"
              strokeDasharray="12,12"
              className="opacity-30"
            />
            <path
              d="M-100,500 C200,450 450,700 650,450 C850,200 950,650 1300,600"
              stroke={isSecondary ? 'url(#gradient-secondary-alt)' : 'url(#gradient-primary-alt)'}
              strokeWidth="2"
              strokeDasharray="8,14"
              className="opacity-40"
            />
            <path
              d="M-100,100 C150,90 300,400 500,320 C700,240 900,350 1300,150"
              stroke={isSecondary ? 'url(#gradient-secondary)' : 'url(#gradient-primary)'}
              strokeWidth="2"
              className="opacity-20"
            />
            <path
              d="M-100,750 C100,700 300,750 500,650 C700,550 900,750 1300,700"
              stroke={isSecondary ? 'url(#gradient-secondary-alt)' : 'url(#gradient-primary-alt)'}
              strokeWidth="2"
              strokeDasharray="5,10"
              className="opacity-30"
            />
          </>
        )}

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="gradient-primary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="gradient-primary-alt" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--secondary)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--secondary)" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="gradient-secondary" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="gradient-secondary-alt" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
            <stop offset="50%" stopColor="var(--secondary)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
