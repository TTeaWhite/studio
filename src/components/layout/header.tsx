import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, CalendarDays, Code } from 'lucide-react'; // Add CalendarDays icon

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
           <Code className="h-6 w-6 text-primary" />
          <span className="font-bold text-foreground">优先流</span>
        </Link>
        <nav className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              任务
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/calendar">
              <CalendarDays className="mr-2 h-4 w-4" />
              日历
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
