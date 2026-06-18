import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Zap, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useLocale } from '@/contexts/locale-context'
import { skills } from '@/lib/skills-data'

/* ─── Count-up number ─── */
function CountUp({ target, delay = 0 }: { target: number; delay?: number }) {
  const [display, setDisplay] = useState(0)
  useEffect(() => {
    const t0 = performance.now() + delay
    const dur = 900
    let raf: number
    const tick = (now: number) => {
      if (now < t0) { raf = requestAnimationFrame(tick); return }
      const p = Math.min((now - t0) / dur, 1)
      setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, delay])
  return <>{display}</>
}

/* ─── Word-mask reveal ─── */
function MaskWords({
  text,
  baseDelay,
  serif,
  gradient,
}: {
  text: string
  baseDelay: number
  serif?: boolean
  gradient?: boolean
}) {
  const words = text.split(' ')
  return (
    <span className="inline" aria-label={text}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden align-bottom"
          style={{ lineHeight: 'inherit' }}
        >
          <span
            className={gradient ? 'inline-block gradient-text' : 'inline-block'}
            style={{
              fontFamily: serif ? "'Instrument Serif', Georgia, serif" : undefined,
              fontStyle: serif ? 'italic' : undefined,
              animation: `line-up 0.9s cubic-bezier(0.16,1,0.3,1) ${baseDelay + i * 65}ms forwards`,
              opacity: 0,
            }}
          >
            {word}{i < words.length - 1 ? '\u00A0' : ''}
          </span>
        </span>
      ))}
    </span>
  )
}

/* ─── Marquee ticker ─── */
const TICKER = [
  'Code Review', 'Debugging', 'Architecture', 'LLM Cost', 'Security',
  'Testing', 'Documentation', 'AI Research', 'Git Workflows', 'Performance',
  'Refactoring', 'Prompt Engineering', 'Observability', 'API Design', 'RAG',
  'JetBrains', 'VS Code', 'Cursor', 'Windsurf', 'Claude Code',
]

function Marquee() {
  const items = [...TICKER, ...TICKER]
  return (
    <div
      className="relative w-full overflow-hidden opacity-0 animate-fade-up [animation-fill-mode:forwards]"
      style={{ animationDelay: '1050ms' }}
    >
      <div className="absolute inset-y-0 left-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to right, hsl(var(--background)), transparent)' }} />
      <div className="absolute inset-y-0 right-0 w-24 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to left, hsl(var(--background)), transparent)' }} />
      <div className="marquee-track py-3">
        {items.map((item, i) => (
          <span key={i} className="flex-shrink-0 inline-flex items-center">
            <span className="text-[10px] font-medium tracking-[0.08em] text-muted-foreground/40 whitespace-nowrap px-5 uppercase">
              {item}
            </span>
            <span className="text-muted-foreground/20 text-[9px]">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Hero ─── */
export function Hero() {
  const { t } = useLocale()

  const sectionRef = useRef<HTMLElement>(null)
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    let hasLeft = false
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) { hasLeft = true }
        else if (hasLeft) { setAnimKey(k => k + 1); hasLeft = false }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-[72vh] flex flex-col">

      {/* ── DARK MODE: Aurora Plasma ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="hero-aurora hero-aurora-1" />
        <div className="hero-aurora hero-aurora-2" />
        <div className="hero-aurora hero-aurora-3" />
        <div className="hero-scan-line" />
      </div>

      {/* ── LIGHT MODE: Organic Blobs ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />
      </div>

      {/* ── RUNE DRIFT PARTICLES (both modes) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden>
        {/* Large background runes — very faint */}
        <span className="hero-rune" style={{ fontSize:'8rem', top:'8%', left:'72%', animationName:'rune-drift-a', animationDuration:'22s', animationDelay:'0s', animationIterationCount:'infinite' }}>ᚱ</span>
        <span className="hero-rune" style={{ fontSize:'5.5rem', top:'55%', left:'82%', animationName:'rune-drift-b', animationDuration:'18s', animationDelay:'5s', animationIterationCount:'infinite' }}>ᚲ</span>
        <span className="hero-rune" style={{ fontSize:'6.5rem', top:'30%', left:'8%', animationName:'rune-drift-c', animationDuration:'26s', animationDelay:'8s', animationIterationCount:'infinite' }}>ᛏ</span>
        <span className="hero-rune" style={{ fontSize:'4.5rem', top:'70%', left:'55%', animationName:'rune-drift-d', animationDuration:'20s', animationDelay:'3s', animationIterationCount:'infinite' }}>ᛊ</span>
        <span className="hero-rune" style={{ fontSize:'7rem', top:'15%', left:'42%', animationName:'rune-drift-b', animationDuration:'30s', animationDelay:'12s', animationIterationCount:'infinite' }}>ᚨ</span>
        <span className="hero-rune" style={{ fontSize:'3.5rem', top:'78%', left:'18%', animationName:'rune-drift-a', animationDuration:'24s', animationDelay:'16s', animationIterationCount:'infinite' }}>ᛚ</span>
        <span className="hero-rune" style={{ fontSize:'5rem', top:'42%', left:'92%', animationName:'rune-drift-c', animationDuration:'19s', animationDelay:'7s', animationIterationCount:'infinite' }}>ᚢ</span>
        <span className="hero-rune" style={{ fontSize:'4rem', top:'5%', left:'22%', animationName:'rune-drift-d', animationDuration:'28s', animationDelay:'20s', animationIterationCount:'infinite' }}>ᚾ</span>
      </div>

      {/* ── RUNE BUBBLE BURST (both modes) ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="hero-bubble-rune" style={{ width:'36px', height:'36px', fontSize:'13px', bottom:'22%', left:'14%', animationDuration:'9s', animationDelay:'1s' }}>ᚱ</div>
        <div className="hero-bubble-rune" style={{ width:'28px', height:'28px', fontSize:'10px', bottom:'35%', left:'78%', animationDuration:'12s', animationDelay:'4.5s' }}>ᛁ</div>
        <div className="hero-bubble-rune" style={{ width:'42px', height:'42px', fontSize:'15px', bottom:'15%', left:'60%', animationDuration:'10s', animationDelay:'7s' }}>ᚲ</div>
        <div className="hero-bubble-rune" style={{ width:'24px', height:'24px', fontSize:'9px', bottom:'45%', left:'30%', animationDuration:'14s', animationDelay:'2s' }}>ᛊ</div>
        <div className="hero-bubble-rune" style={{ width:'32px', height:'32px', fontSize:'11px', bottom:'28%', left:'88%', animationDuration:'11s', animationDelay:'9s' }}>ᚨ</div>
        <div className="hero-bubble-rune" style={{ width:'20px', height:'20px', fontSize:'8px', bottom:'55%', left:'5%', animationDuration:'15s', animationDelay:'5s' }}>ᚾ</div>
      </div>

      {/* Grid + beam (both modes) */}
      <div className="absolute inset-0 dot-grid opacity-[0.32] dark:opacity-[0.18] pointer-events-none" />
      <div className="hero-beam" />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 90% 70% at 30% 50%, transparent 40%, hsl(var(--background) / 0.5) 100%)' }}
      />

      {/* ── TOP META — version + platforms (top right) ── */}
      <div className="relative container max-w-6xl">
        <div
          className="flex justify-end items-start pt-16 md:pt-20 opacity-0 animate-fade-up [animation-fill-mode:forwards]"
          style={{ animationDelay: '200ms' }}
        >
          <div className="text-right flex flex-col gap-1">
            <span className="text-[9px] tracking-[0.18em] text-muted-foreground/50 uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>v2.0.0 — MIT</span>
            <span className="text-[9px] tracking-[0.14em] text-muted-foreground/35 uppercase" style={{ fontFamily: "'Space Mono', monospace" }}>Claude · Cursor · Windsurf · VS Code · JetBrains</span>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT — left-aligned, bottom of hero ── */}
      <div
        key={animKey}
        className="relative container max-w-6xl mt-auto pb-10 md:pb-16 pt-8"
      >
        <div className="max-w-[800px]">

          {/* Badge */}
          <div
            className="mb-10 opacity-0 animate-fade-up [animation-fill-mode:forwards]"
            style={{ animationDelay: '0ms' }}
          >
            <div className="inline-flex items-center gap-2.5 border border-border bg-card/60 backdrop-blur-sm px-4 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-highlight animate-pulse-dot" />
              <span className="font-display text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase">
                {t.hero.badge}
              </span>
            </div>
          </div>

          {/* Heading — large, left-aligned, editorial */}
          <h1
            className="font-display font-bold tracking-[-0.04em] leading-[0.92] mb-8"
            style={{ fontSize: 'clamp(2.4rem,6vw,5.2rem)' }}
          >
            {/* Line 1: display sans */}
            <span className="block">
              <MaskWords text={t.hero.title1} baseDelay={80} />
            </span>

            {/* Line 2: serif italic + wine gradient */}
            <span
              className="block mt-2"
              style={{
                fontSize: 'clamp(2.1rem,5.4vw,4.6rem)',
                letterSpacing: '-0.02em',
                lineHeight: '1.0',
              }}
            >
              <MaskWords text={t.hero.title2} baseDelay={260} serif gradient />
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="max-w-[420px] text-[0.975rem] md:text-[1.05rem] text-muted-foreground leading-[1.68] mb-10 opacity-0 animate-fade-up [animation-fill-mode:forwards]"
            style={{ animationDelay: '520ms' }}
          >
            {t.hero.subtitle}
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-3 mb-12 opacity-0 animate-fade-up [animation-fill-mode:forwards]"
            style={{ animationDelay: '620ms' }}
          >
            <Button asChild size="lg" className="gap-2 h-11 px-7 font-semibold text-sm">
              <a href="#install">
                {t.hero.cta_install}
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="gap-2 h-11 px-7 font-semibold text-sm">
              <a href="#skills">
                <Zap className="h-4 w-4" />
                {t.hero.cta_browse}
              </a>
            </Button>
          </div>

          {/* Stat row — inline, left-aligned */}
          <div
            className="flex items-center gap-4 opacity-0 animate-fade-up [animation-fill-mode:forwards]"
            style={{ animationDelay: '720ms' }}
          >
            <div className="flex items-baseline gap-1.5">
              <span className="font-display text-2xl font-bold text-foreground tabular-nums">
                <CountUp target={skills.length} delay={780} />
              </span>
              <span className="text-[10px] text-muted-foreground/70 tracking-[0.06em]" style={{ fontFamily: "'Space Mono', monospace" }}>skills</span>
            </div>
            <span className="w-px h-6 bg-border" />
            <span className="text-[10px] text-muted-foreground/55 tracking-[0.08em]" style={{ fontFamily: "'Space Mono', monospace" }}>5 IDEs</span>
            <span className="w-px h-6 bg-border" />
            <span className="text-[10px] text-muted-foreground/55 tracking-[0.08em]" style={{ fontFamily: "'Space Mono', monospace" }}>open source</span>
          </div>

        </div>
      </div>

      {/* Marquee */}
      <div key={`mq-${animKey}`}>
        <Marquee />
      </div>

      {/* Scroll indicator */}
      <div
        key={`sc-${animKey}`}
        className="absolute bottom-6 right-8 flex flex-col items-end gap-1 opacity-0 animate-fade-up [animation-fill-mode:forwards]"
        style={{ animationDelay: '1400ms' }}
        aria-hidden
      >
        <ChevronDown className="h-3 w-3 text-muted-foreground/25 animate-scroll-bounce" />
        <span className="text-[8px] uppercase tracking-[0.22em] text-muted-foreground/30 font-semibold">scroll</span>
      </div>

    </section>
  )
}
