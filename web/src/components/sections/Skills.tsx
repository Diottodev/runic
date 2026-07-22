import { useState, useMemo, type RefObject } from 'react'
import { Badge } from '@/components/ui/badge'
import { skills, domains, type Domain } from '@/lib/skills-data'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/use-in-view'
import { useLocale } from '@/contexts/locale-context'
import { Search, X } from 'lucide-react'

const domainColorMap: Record<Domain, 'cyan' | 'blue' | 'violet' | 'rose' | 'amber' | 'emerald'> = {
  engineering:              'cyan',
  'engineering-team':       'blue',
  'ai-research':            'violet',
  'ai-security':            'rose',
  research:                 'amber',
  'research-ops':           'emerald',
  marketing:                'rose',
  product:                  'violet',
  'c-level':                'amber',
  compliance:               'blue',
  content:                  'emerald',
  finance:                  'cyan',
  commercial:               'violet',
  productivity:             'amber',
  'project-management':     'blue',
  business:                 'emerald',
  superpowers:              'rose',
}

export function Skills() {
  const [activeDomain, setActiveDomain] = useState<Domain | 'all'>('all')
  const [search, setSearch] = useState('')
  const { ref: headerRef, inView: headerIn } = useInView()
  const { t, locale } = useLocale()

  const domainFiltered = activeDomain === 'all'
    ? skills
    : skills.filter(s => s.domain === activeDomain)

  const filtered = useMemo(() => {
    if (!search.trim()) return domainFiltered
    const q = search.toLowerCase().trim()
    return domainFiltered.filter(s => {
      const description = locale === 'pt' ? s.descriptionPt : s.description
      return s.name.toLowerCase().includes(q)
        || description.toLowerCase().includes(q)
        || s.tags.some(t => t.toLowerCase().includes(q))
        || s.domain.toLowerCase().includes(q)
    })
  }, [domainFiltered, search, locale])

  return (
    <section id="skills" className="py-20 md:py-28 border-t border-border/50">
      <div className="container max-w-6xl">

        {/* Header */}
        <div
          ref={headerRef as RefObject<HTMLDivElement>}
          className={cn('mb-10 reveal', headerIn && 'in-view')}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-highlight mb-3">
            {t.skills.eyebrow}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h2 className="font-display font-extrabold text-3xl md:text-[2.6rem] tracking-tight leading-[1.08]">
                {t.skills.title}
              </h2>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed max-w-md">
                {t.skills.subtitle}
              </p>
            </div>
            <span className="text-xs text-muted-foreground tabular-nums font-mono">
              {filtered.length} {t.skills.count_label}
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={locale === 'pt' ? 'Pesquisar skills...' : 'Search skills...'}
            className="w-full h-10 pl-9 pr-9 rounded-lg border border-border bg-muted/30 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-foreground/30 focus:bg-muted/50 transition-all duration-200"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Domain filter */}
        <div className="flex flex-wrap gap-1.5 mb-8">
          <FilterBtn
            active={activeDomain === 'all'}
            onClick={() => setActiveDomain('all')}
          >
            {t.skills.all} ({skills.length})
          </FilterBtn>
          {domains.map(d => (
            <FilterBtn
              key={d.id}
              active={activeDomain === d.id}
              onClick={() => setActiveDomain(d.id)}
            >
              {d.label} ({skills.filter(s => s.domain === d.id).length})
            </FilterBtn>
          ))}
        </div>

        {/* Grid — key triggers re-mount animation */}
        <div
          key={activeDomain}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 animate-grid-fade"
        >
          {filtered.map((skill, idx) => {
            const color = domainColorMap[skill.domain]
            const description = locale === 'pt' ? skill.descriptionPt : skill.description
            return (
              <SkillCard
                key={`${skill.domain}-${skill.name}`}
                skill={skill}
                color={color}
                description={description}
                idx={idx}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ─── Filter button ─── */
function FilterBtn({ children, active, onClick }: {
  children: React.ReactNode
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 border',
        active
          ? 'bg-foreground text-background border-foreground'
          : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
      )}
    >
      {children}
    </button>
  )
}

/* ─── Skill card ─── */
const badgeBg: Record<string, string> = {
  cyan:    'bg-cyan-500/8 group-hover:bg-cyan-500/12',
  blue:    'bg-blue-500/8 group-hover:bg-blue-500/12',
  violet:  'bg-violet-500/8 group-hover:bg-violet-500/12',
  rose:    'bg-rose-500/8 group-hover:bg-rose-500/12',
  amber:   'bg-amber-500/8 group-hover:bg-amber-500/12',
  emerald: 'bg-emerald-500/8 group-hover:bg-emerald-500/12',
}

function SkillCard({ skill, color, description, idx }: {
  skill: { name: string; icon: string; tags: string[]; isNew?: boolean }
  color: 'cyan' | 'blue' | 'violet' | 'rose' | 'amber' | 'emerald'
  description: string
  idx: number
}) {
  return (
    <div
      className="group relative flex flex-col gap-3 rounded-xl border border-border/70 bg-card p-4 card-lift cursor-pointer"
      style={{ animationDelay: `${Math.min(idx, 9) * 25}ms` }}
    >
      {/* New badge */}
      {skill.isNew && (
        <span className="absolute top-3 right-3 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground border border-border rounded px-1.5 py-0.5">
          New
        </span>
      )}

      {/* Icon + name row */}
      <div className="flex items-center gap-3">
        <div className={cn(
          'w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0 transition-all duration-200',
          badgeBg[color]
        )}>
          {skill.icon}
        </div>
        <code className="text-[13px] font-semibold font-mono text-foreground tracking-tight">
          {skill.name}
        </code>
      </div>

      {/* Description */}
      <p className="skill-desc flex-1">{description}</p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1">
        {skill.tags.map(tag => (
          <Badge
            key={tag}
            variant={color}
            className="text-[9px] font-mono py-0 px-1.5 rounded"
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}
