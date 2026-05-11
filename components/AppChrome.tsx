import Link from "next/link";
import { HeartHandshake } from "lucide-react";

export function AppChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-ink/10 bg-paper/95">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-moss text-white">
              <HeartHandshake size={20} aria-hidden="true" />
            </span>
            <span>Pet Adoption Match</span>
          </Link>
          <div className="flex items-center gap-2 text-sm font-medium">
            <Link
              href="/"
              className="focus-ring rounded-md px-3 py-2 text-ink/75 hover:bg-white"
            >
              Browse
            </Link>
            <Link
              href="/favorites"
              className="focus-ring rounded-md px-3 py-2 text-ink/75 hover:bg-white"
            >
              Favorites
            </Link>
            <Link
              href="/shelter"
              className="focus-ring rounded-md bg-ink px-3 py-2 text-white hover:bg-ink/90"
            >
              Shelter portal
            </Link>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
