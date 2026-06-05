import { type RefObject } from 'react'
import { Shield, Layers, Zap, Target, BookOpen, GitBranch } from 'lucide-react'
import { useLocale } from '@/contexts/locale-context'
import { useInView } from '@/hooks/use-in-view'
import { cn } from '@/lib/utils'

const icons = [
  <Zap className="h-[17px] w-[17px]" />,
  <Target className="h-[17px] w-[17px]" />,
  <Layers className="h-[17px] w-[17px]" />,
  <Shield className="h-[17px] w-[17px]" />,
  <BookOpen className="h-[17px] w-[17px]" />,
  <GitBranch className="h-[17px] w-[17px]" />,
]

const nums = ['01', '02', '03', '04', '05', '06']

function FeatureCard({
  icon,
  num,
  title,
  description,
  delay,
  inView,
}: {
  icon: React.ReactNode
  num: string
  title: string
  description: string
  delay: number
  inView: boolean
}) {
  return (
    <div
      className={cn(
        'group relative bg-background p-7 flex flex-col gap-5 overflow-hidden',
        'border-l-2 border-l-transparent',
        'dark:hover:bg-card dark:hover:border-l-highlight',
        'hover:bg-muted/40 hover:border-l-primary',
        'opacity-0 translate-y-4',
        inView && 'opacity-100 translate-y-0',
      )}
      style={{
        transition: `opacity 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.5s cubic-bezier(0.22,1,0.36,1) ${delay}ms, border-color 0.22s ease, background-color 0.22s ease`,
      }}
    >
      {/* Number watermark */}
      <span
        className="absolute top-5 right-5 font-display font-black text-[3rem] leading-none select-none pointer-events-none transition-colors duration-300"
        style={{ color: 'hsl(var(--border) / 0.7)' }}
        aria-hidden
      >
        {num}
      </span>

      {/* Icon */}
      <div className="relative z-10 w-8 h-8 rounded-lg border border-border bg-muted/60 flex items-center justify-center text-muted-foreground group-hover:text-foreground group-hover:border-border/80 transition-all duration-200">
        {icon}
      </div>

      {/* Text */}
      <div className="relative z-10">
        <h3 className="font-display font-semibold text-[0.875rem] mb-2 tracking-tight leading-snug">
          {title}
        </h3>
        <p className="text-[0.8125rem] text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  )
}

export function Features() {
  const { t } = useLocale()
  const { ref: headerRef, inView: headerIn } = useInView()
  const { ref: gridRef, inView: gridIn } = useInView(0.05)

  return (
    <section className="py-20 md:py-28 border-t border-border/60">
      <div className="container max-w-6xl">

        {/* Header — editorial two-column layout */}
        <div
          ref={headerRef as RefObject<HTMLDivElement>}
          className={cn('mb-14 reveal', headerIn && 'in-view')}
        >
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-highlight mb-4">
                {t.features.eyebrow}
              </p>
              <h2 className="font-display font-extrabold text-[2rem] md:text-[2.75rem] tracking-tight leading-[1.05]">
                {t.features.title}
              </h2>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-[320px] md:pb-1.5">
              {t.features.subtitle}
            </p>
          </div>
          <div className="mt-10 h-px w-full bg-border/60" />
        </div>

        {/* Grid — gap-px creates hairline borders via bg-border */}
        <div
          ref={gridRef as RefObject<HTMLDivElement>}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border"
          style={{ borderRadius: 'calc(var(--radius) + 1px)', overflow: 'hidden' }}
        >
          {t.features.items.map((f, i) => (
            <FeatureCard
              key={f.title}
              icon={icons[i]}
              num={nums[i]}
              title={f.title}
              description={f.description}
              delay={i * 65}
              inView={gridIn}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
