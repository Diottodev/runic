import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CodeBlockProps {
  code: string
  language?: string
  filename?: string
  className?: string
}

export function CodeBlock({ code, filename, className }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={cn('rounded-xl border border-border overflow-hidden', className)}>
      {filename && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/50 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
          </div>
          <span className="text-xs text-muted-foreground font-mono">{filename}</span>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {copied ? (
              <><Check className="w-3.5 h-3.5 text-emerald-500" />Copied</>
            ) : (
              <><Copy className="w-3.5 h-3.5" />Copy</>
            )}
          </button>
        </div>
      )}
      <div className="relative bg-[hsl(0,0%,5%)] dark:bg-[hsl(0,0%,4%)]">
        {!filename && (
          <button
            onClick={copy}
            className="absolute top-3 right-3 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors bg-muted/30 hover:bg-muted/60 px-2 py-1 rounded-md"
          >
            {copied ? (
              <><Check className="w-3 h-3 text-emerald-500" />Copied</>
            ) : (
              <><Copy className="w-3 h-3" />Copy</>
            )}
          </button>
        )}
        <pre className="p-4 text-sm font-mono text-neutral-300 overflow-x-auto leading-relaxed">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  )
}
