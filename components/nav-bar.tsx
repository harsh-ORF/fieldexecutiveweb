import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PackageOpen } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export function NavBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <PackageOpen className="h-5 w-5" />
          <span>Order Media Management</span>
        </Link>
        <nav className="flex flex-1 items-center justify-end gap-4">
          <ModeToggle />
          <Button asChild variant="default">
            <Link href="/">Orders</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}