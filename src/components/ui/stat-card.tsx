import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimatedGradient } from '@/components/ui/animated-gradient';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  colors: string[];
  delay?: number;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  colors,
  delay = 0,
  className,
}) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: delay + 0.3,
      },
    },
  };

  const item = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      className={cn(
        'relative overflow-hidden h-full bg-background dark:bg-background/50 rounded-lg border',
        className,
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay }}
    >
      <AnimatedGradient colors={colors} speed={0.05} blur="medium" />
      <motion.div
        className="relative z-10 p-5 text-foreground backdrop-blur-sm h-full flex flex-col"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div className="flex justify-between items-start mb-4" variants={item}>
          <h3 className="text-sm font-medium text-foreground/80">{title}</h3>
          {icon && <div className="text-primary">{icon}</div>}
        </motion.div>

        <motion.p className="text-2xl sm:text-3xl font-bold mb-2" variants={item}>
          {value}
        </motion.p>

        {subtitle && (
          <motion.p className="text-sm text-foreground/70 mt-auto" variants={item}>
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </motion.div>
  );
};

export { StatCard };
