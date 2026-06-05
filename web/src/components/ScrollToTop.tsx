import { useEffect, useState } from 'react'
import { ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      className={cn(
        'fixed bottom-6 right-6 z-50 w-9 h-9 rounded-full border border-border bg-card/80 backdrop-blur-sm',
        'flex items-center justify-center text-muted-foreground',
        'hover:text-foreground hover:border-muted-foreground/40 transition-all duration-200',
        'shadow-lg shadow-black/20',
        visible ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-3 pointer-events-none',
      )}
      style={{ transition: 'opacity 0.25s ease, transform 0.25s ease, color 0.2s, border-color 0.2s' }}
    >
      <ArrowUp className="h-3.5 w-3.5" />
    </button>
  )
}
