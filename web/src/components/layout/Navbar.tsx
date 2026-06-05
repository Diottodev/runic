import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import { LocaleToggle } from '@/components/LocaleToggle'
import { useLocale } from '@/contexts/locale-context'

export function Navbar() {
  const { t } = useLocale()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="container flex h-14 max-w-6xl items-center justify-between">

        {/* Logo — /D typographic mark */}
        <a href="#" className="flex items-center gap-2.5 group" aria-label="runic home">
          {/* The /D icon box — wine dark theme */}
          <div className="w-8 h-8 rounded-[6px] overflow-hidden flex-shrink-0 group-hover:opacity-90 transition-opacity duration-200"
               style={{ boxShadow: '0 0 0 1px rgba(200,57,90,0.18)' }}>
            <img src="/favicon.svg" alt="Runic" className="w-full h-full object-cover" draggable={false} />
          </div>
        </a>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-0.5">
          {[
            { href: '#skills',  label: t.nav.skills },
            { href: '#install', label: t.nav.install },
            { href: 'https://github.com/Diottodev/runic', label: t.nav.docs, external: true },
          ].map(({ href, label, external }) => (
            <a
              key={label}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="nav-underline px-3 py-1.5 rounded-md text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-1.5">
          <LocaleToggle />
          <ThemeToggle />
          <Button asChild size="sm" className="gap-1.5 h-8 text-[11px] font-semibold rounded-lg">
            <a href="https://github.com/Diottodev/runic" target="_blank" rel="noopener noreferrer">
              <Github className="h-3.5 w-3.5" />
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </header>
  )
}
