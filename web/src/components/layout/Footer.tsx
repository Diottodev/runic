import { Github } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'

export function Footer() {
  const { t } = useLocale()

  return (
    <footer className="border-t border-border/60 bg-background">
      <div className="container max-w-6xl py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Built by</span>
          <a
            href="https://github.com/Diottodev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
            Diottodev
          </a>
          <span>·</span>
          <span>{t.footer.made_with}</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <a
            href="https://github.com/Diottodev/runic"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            GitHub
          </a>
          <a
            href="https://github.com/Diottodev/runic/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Contributing
          </a>
          <a
            href="https://github.com/Diottodev/runic/blob/main/CHANGELOG.md"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            Changelog
          </a>
        </div>
      </div>
    </footer>
  )
}
