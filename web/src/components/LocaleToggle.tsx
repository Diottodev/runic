import { useLocale } from '@/contexts/locale-context'

export function LocaleToggle() {
  const { locale, setLocale } = useLocale()

  return (
    <button
      onClick={() => setLocale(locale === 'en' ? 'pt' : 'en')}
      className="flex items-center gap-0.5 h-8 px-2.5 rounded-md border border-border/60 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted transition-colors tracking-wide"
      aria-label="Toggle language"
    >
      <span className={locale === 'en' ? 'text-foreground' : 'opacity-40'}>EN</span>
      <span className="opacity-30 mx-0.5">/</span>
      <span className={locale === 'pt' ? 'text-foreground' : 'opacity-40'}>PT</span>
    </button>
  )
}
