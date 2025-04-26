'use client';

import { useAuth } from '@/components/providers/auth-provider';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Moon, Sun, User, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AnimatedGradient } from '@/components/ui/animated-gradient';
import { DecorativePath } from '@/components/ui/decorative-path';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

export function Header() {
  const { user, signOut } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const [showSearch, setShowSearch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('light'); // Default to light for SSR

  // Set mounted state when component mounts
  useEffect(() => {
    setMounted(true);
    // Get the actual theme after mounting to avoid hydration mismatch
    setCurrentTheme(resolvedTheme || 'light');
  }, [resolvedTheme]);

  // Use fixed colors for server rendering, then update on client
  // Use dark theme colors for consistent server rendering
  const darkThemeColors = ['#4F46E5', '#6366F1', '#8B5CF6'];
  const lightThemeColors = ['#818CF8', '#93C5FD', '#C4B5FD'];

  // Use dark colors for initial SSR to avoid hydration mismatch
  const gradientColors = mounted
    ? currentTheme === 'dark'
      ? darkThemeColors
      : lightThemeColors
    : darkThemeColors;

  return (
    <header className="relative z-40 w-full border-b bg-background/80 backdrop-blur-md">
      <div className="relative w-full overflow-hidden">
        {/* Sophisticated background with multiple layers */}
        <div className="absolute inset-0 opacity-40">
          <AnimatedGradient colors={gradientColors} speed={0.04} blur="medium" />
        </div>

        {/* Decorative path backgrounds */}
        <DecorativePath
          variant={currentTheme === 'dark' ? 'secondary' : 'primary'}
          className="opacity-60"
        />

        {/* Glass-effect overlay */}
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px]"></div>

        {/* Header content */}
        <motion.div
          className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex h-16 items-center justify-between py-4">
            {/* Logo section with enhanced animation */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 17,
              }}
            >
              <Link href="/" className="flex items-center space-x-2 group">
                <span className="text-xl font-bold tracking-tight text-black dark:text-white">
                  <span className="relative">
                    Bookmark Manager
                    <motion.span
                      className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-black/50 dark:from-white/50 via-black/30 dark:via-white/30 to-transparent"
                      initial={{ width: '0%' }}
                      whileInView={{ width: '100%' }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </span>
                </span>
              </Link>
            </motion.div>

            {/* Search bar - shown conditionally with enhanced animation */}
            {showSearch && (
              <motion.div
                className="hidden md:flex flex-1 px-6 max-w-md mx-4"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
              >
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search bookmarks..."
                    className="pl-10 pr-4 py-2 bg-background/60 border-primary/20 focus:border-primary/50 rounded-full shadow-sm focus:shadow-primary/10"
                    autoFocus
                  />
                </div>
              </motion.div>
            )}

            {/* Action buttons with improved styling */}
            <div className="flex items-center gap-2 md:gap-3">
              {user && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-primary/10 transition-colors"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <span className="sr-only">Search</span>
                </Button>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-primary/10 transition-colors"
                  >
                    {!mounted || currentTheme === 'dark' ? (
                      <Moon className="h-4 w-4 text-primary/90" />
                    ) : (
                      <Sun className="h-4 w-4 text-primary/90" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="rounded-lg border-primary/10 shadow-lg">
                  <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full border-primary/20 hover:border-primary/50 px-3 shadow-sm hover:shadow-md hover:shadow-primary/5 transition-all"
                    >
                      <User className="h-4 w-4 mr-2 text-primary" />
                      <span className="text-sm font-medium">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="rounded-lg border-primary/10 w-48 shadow-lg"
                  >
                    <DropdownMenuItem className="cursor-pointer">Profile</DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">Settings</DropdownMenuItem>
                    <DropdownMenuItem
                      className="cursor-pointer text-destructive"
                      onClick={() => signOut()}
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  asChild
                  className="rounded-full shadow-md hover:shadow-lg transition-all bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                  size="sm"
                >
                  <Link href="/login">Sign in</Link>
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
