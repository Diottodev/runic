import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { translations, type Locale, type Translations } from '@/lib/i18n'

interface LocaleCtx {
  locale: Locale
  setLocale: (l: Locale) => void
  t: Translations
}

const LocaleContext = createContext<LocaleCtx | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    try {
      const stored = localStorage.getItem('locale')
      if (stored === 'pt' || stored === 'en') return stored
      // fallback to browser language
      const lang = navigator.language || navigator.languages?.[0] || 'en'
      return lang.toLowerCase().startsWith('pt') ? 'pt' : 'en'
    } catch {
      return 'en'
    }
  })

  const setLocale = (l: Locale) => {
    setLocaleState(l)
    try { localStorage.setItem('locale', l) } catch { /* noop */ }
  }

  useEffect(() => {
    document.documentElement.lang = locale === 'pt' ? 'pt-BR' : 'en'
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>')
  return ctx
}
