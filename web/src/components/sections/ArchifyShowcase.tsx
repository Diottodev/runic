import { type RefObject } from 'react'
import { useLocale } from '@/contexts/locale-context'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'

export function ArchifyShowcase() {
  const { t } = useLocale()
  const { ref: headerRef, inView: headerIn } = useInView()
  const { ref: demoRef, inView: demoIn } = useInView(0.15)

  return (
    <section id="archify" className="py-20 md:py-28 border-t border-border/50">
      <div className="container max-w-6xl">

        {/* Header */}
        <div
          ref={headerRef as RefObject<HTMLDivElement>}
          className={cn('mb-10 reveal', headerIn && 'in-view')}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-highlight mb-3">
            {t.archify.eyebrow}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="font-display font-extrabold text-3xl md:text-[2.6rem] tracking-tight leading-[1.08]">
                {t.archify.title}
              </h2>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed max-w-xl">
                {t.archify.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Demo card */}
        <div
          ref={demoRef as RefObject<HTMLDivElement>}
          className={cn(
            'opacity-0 translate-y-4',
            demoIn && 'opacity-100 translate-y-0'
          )}
          style={{
            transition: 'opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1)',
          }}
        >
          <div className="rounded-2xl border border-border/70 bg-card overflow-hidden card-lift">
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-muted/30">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
              <span className="ml-3 font-mono text-xs text-muted-foreground hidden sm:inline">
                archify-demo.html
              </span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-muted-foreground/70 border border-border rounded px-1.5 py-0.5">
                live render
              </span>
            </div>

            {/* Diagram */}
            <iframe
              src="/archify-demo.html?embed=1"
              title={t.archify.demo_caption}
              className="w-full bg-transparent"
              style={{ aspectRatio: '1080 / 588', border: 0, display: 'block', width: '100%' }}
              loading="lazy"
            />

            {/* Caption row */}
            <div className="flex items-center gap-3 px-4 py-3 border-t border-border/60 bg-muted/30">
              <p className="text-xs text-muted-foreground leading-relaxed">
                {t.archify.demo_caption}
              </p>
              <a
                href="/archify-demo.html"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto shrink-0 text-xs font-semibold text-foreground border border-border rounded-lg px-3 py-1.5 hover:border-foreground/40 hover:text-foreground transition-all duration-200"
              >
                {t.archify.open_full}
              </a>
            </div>
          </div>
        </div>

        {/* Feature bullets */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {t.archify.points.map(p => (
            <div
              key={p.title}
              className="rounded-xl border border-border/70 bg-card p-4 card-lift"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-base leading-none" aria-hidden>
                  {p.icon}
                </span>
                <h3 className="font-display font-semibold text-sm tracking-tight">
                  {p.title}
                </h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {p.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
