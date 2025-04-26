'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { useAuth } from '@/components/providers/auth-provider';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user && !isLoading) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  // If still loading auth state, show minimal loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-primary font-medium">Loading...</div>
      </div>
    );
  }

  // Only render landing page content for non-authenticated users
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto flex items-center justify-between p-4 md:p-6 absolute inset-x-0 top-0 z-50">
        <div className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 17,
            }}
          >
            <span className="text-xl font-bold tracking-tight text-black dark:text-white">
              <span className="relative">
                Bookmark Manager
                <motion.span
                  className="absolute -bottom-1 left-0 h-[2px] w-full bg-gradient-to-r from-black/50 dark:from-white/50 via-black/30 dark:via-white/30 to-transparent"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                />
              </span>
            </span>
          </motion.div>
        </div>
        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Get started</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <BackgroundPaths title="Bookmark Manager" className="min-h-screen">
          <section className="flex items-center justify-center w-full py-16 md:py-20 lg:py-24">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center text-center space-y-6 md:space-y-8">
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                    Organize your web, <span className="text-primary">effortlessly</span>
                  </h1>
                  <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                    Save, organize, and revisit your favorite websites with our elegant and powerful
                    bookmark management solution.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <div
                    className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 
                        dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                        overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <Button
                      asChild
                      variant="ghost"
                      className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                            bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                            text-black dark:text-white transition-all duration-300 
                            group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                            hover:shadow-md dark:hover:shadow-neutral-800/50"
                    >
                      <Link href="/signup">
                        <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                          Start for free
                        </span>
                        <span
                          className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                                transition-all duration-300"
                        >
                          →
                        </span>
                      </Link>
                    </Button>
                  </div>

                  <div
                    className="inline-block group relative bg-gradient-to-b from-black/10 to-white/10 
                        dark:from-white/10 dark:to-black/10 p-px rounded-2xl backdrop-blur-lg 
                        overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <Button
                      asChild
                      variant="ghost"
                      className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                            bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                            text-black dark:text-white transition-all duration-300 
                            group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                            hover:shadow-md dark:hover:shadow-neutral-800/50"
                    >
                      <Link href="#features">
                        <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                          Learn more
                        </span>
                        <span
                          className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                                transition-all duration-300"
                        >
                          ↓
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </BackgroundPaths>

        <section className="py-12 md:py-24 bg-muted/50" id="features">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid gap-6 md:gap-10 lg:grid-cols-3">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full p-3 bg-primary/10">
                  <Image src="/file.svg" alt="Save" width={32} height={32} className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold">Effortless Saving</h3>
                <p className="text-muted-foreground">
                  Quickly save websites with custom titles, notes, and tags for easy organization.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full p-3 bg-primary/10">
                  <Image
                    src="/globe.svg"
                    alt="Organize"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                </div>
                <h3 className="text-xl font-bold">Smart Organization</h3>
                <p className="text-muted-foreground">
                  Filter bookmarks by tags, search by keywords, and customize your viewing
                  experience.
                </p>
              </div>

              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full p-3 bg-primary/10">
                  <Image
                    src="/window.svg"
                    alt="Access"
                    width={32}
                    height={32}
                    className="h-8 w-8"
                  />
                </div>
                <h3 className="text-xl font-bold">Beautiful Experience</h3>
                <p className="text-muted-foreground">
                  Enjoy a luxurious, modern interface with both light and dark modes for comfortable
                  browsing.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
                  Ready to organize your online world?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Join thousands of users who have transformed how they manage their web bookmarks.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/signup">Get started now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-0">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-4 md:h-14 md:px-6">
          <p className="text-xs text-muted-foreground md:text-sm">
            © {new Date().getFullYear()} Bookmark Manager. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline md:text-sm"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline md:text-sm"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
