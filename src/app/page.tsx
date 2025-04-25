import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container mx-auto flex items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-2">
          <span className="font-bold text-xl md:text-2xl">Bookmark Manager</span>
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
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 md:space-y-8">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Organize your web, <span className="text-primary">effortlessly</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Save, organize, and revisit your favorite websites with our elegant and powerful
                  bookmark management solution.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button asChild size="lg">
                  <Link href="/signup">Start for free</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#features">Learn more</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

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
