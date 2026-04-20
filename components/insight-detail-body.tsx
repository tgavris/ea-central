'use client'

import { Mail, Calendar, Plane, FileText, ArrowRight, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatDateTime } from '@/lib/format-date'
import type { Insight } from '@/lib/types'

const TYPE_ICONS = {
  email: Mail,
  calendar: Calendar,
  travel: Plane,
  document: FileText,
}

const TYPE_LABELS: Record<string, string> = {
  email: 'Email',
  calendar: 'Calendar',
  travel: 'Travel',
  document: 'Document',
}

const CONFLICT_ACCENT: Record<string, string> = {
  blue:   'border-blue-400/60 bg-blue-500/10 text-blue-600 dark:text-blue-400',
  orange: 'border-orange-400/60 bg-orange-500/10 text-orange-600 dark:text-orange-400',
  red:    'border-red-400/60 bg-red-500/10 text-red-600 dark:text-red-400',
}

export function InsightDetailBody({ insight }: { insight: Insight }) {
  const Icon = TYPE_ICONS[insight.type]

  return (
    <div className="space-y-4">

      {/* Why it matters — single merged paragraph */}
      <div className="rounded-lg border bg-card px-4 py-3 flex items-start gap-2.5">
        <span className="mt-1 inline-block w-1.5 h-1.5 shrink-0 rounded-full bg-emerald-500" />
        <p className="text-xs text-foreground leading-relaxed">
          {insight.whyItMatters
            ? `${insight.whyItMatters}${insight.whatItImpacts ? ` ${insight.whatItImpacts}` : ''}`
            : insight.description}
        </p>
      </div>

      {/* Action step — with rich inline content */}
      {(insight.actionStep || insight.suggestedResponse || insight.conflictSlots || insight.alternatives) && (
        <div className="rounded-lg border bg-card p-4 space-y-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            Action step
          </p>

          {insight.actionStep && (
            <div className="flex items-start gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold mt-0.5">
                1
              </span>
              <p className="text-sm text-foreground leading-snug">{insight.actionStep.description}</p>
            </div>
          )}

          <RichActionContent insight={insight} />
        </div>
      )}

      {/* Sources + meta footer */}
      <div className="flex items-center justify-between gap-3 pt-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          {insight.sources?.map((source, i) => (
            <a
              key={i}
              href={source.url}
              className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2.5 py-0.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              {source.label}
            </a>
          ))}
          {!insight.sources?.length && (
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Icon className="h-3 w-3" />
              <span>{TYPE_LABELS[insight.type]}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground shrink-0 flex-wrap justify-end">
          <span>{insight.rule}</span>
          <span className="opacity-40">·</span>
          <span>{formatDateTime(insight.timestamp)}</span>
        </div>
      </div>

    </div>
  )
}

function RichActionContent({ insight }: { insight: Insight }) {
  /* ── Email draft ─────────────────────────────────────────── */
  if (insight.suggestedResponse) {
    return (
      <div className="space-y-2.5">
        <div className="rounded-md border bg-muted/30 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b bg-muted/20">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] text-muted-foreground font-medium">Draft reply</span>
          </div>
          <pre className="text-xs text-foreground whitespace-pre-wrap font-sans leading-relaxed px-4 py-3 max-h-48 overflow-y-auto">
            {insight.suggestedResponse}
          </pre>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" className="gap-1">
            Send <ArrowRight className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline">Edit Draft</Button>
        </div>
      </div>
    )
  }

  /* ── Calendar conflict snapshot ──────────────────────────── */
  if (insight.conflictSlots) {
    const slots = insight.conflictSlots
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>Conflict · {slots[0]?.time.split('·')[1]?.trim()}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {slots.map((slot, i) => (
            <div
              key={i}
              className={cn('rounded-md border-l-2 p-3 space-y-0.5', CONFLICT_ACCENT[slot.accent])}
            >
              <p className="text-xs font-semibold text-foreground">{slot.title}</p>
              <p className="text-[11px] text-muted-foreground">{slot.time.split('·')[0].trim()}</p>
              <p className="text-[11px] text-muted-foreground">{slot.note}</p>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {slots.map((slot, i) => (
            <Button key={i} size="sm" variant={i === 0 ? 'default' : 'outline'} className="flex-1 text-xs">
              Move {slot.title}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  /* ── Flight / option alternatives ────────────────────────── */
  if (insight.alternatives) {
    return (
      <div className="space-y-2">
        {insight.alternatives.map((alt, i) => (
          <div
            key={i}
            className={cn(
              'rounded-md border p-3 flex items-start gap-3',
              alt.recommended ? 'border-primary/40 bg-primary/5' : '',
            )}
          >
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5 flex-wrap">
                {alt.recommended && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-primary">
                    <CheckCircle2 className="h-3 w-3" />Recommended
                  </span>
                )}
                <p className="text-xs font-semibold text-foreground">{alt.label}</p>
              </div>
              <p className="text-[11px] text-muted-foreground">{alt.sublabel}</p>
              <p className="text-[11px] text-muted-foreground">{alt.detail}</p>
            </div>
            <Button size="sm" variant={alt.recommended ? 'default' : 'outline'} className="shrink-0 text-xs gap-1">
              {alt.ctaLabel}
            </Button>
          </div>
        ))}
      </div>
    )
  }

  /* ── Default CTA button ──────────────────────────────────── */
  if (insight.actionStep) {
    return (
      <Button size="sm" className="gap-1">
        {insight.actionStep.ctaLabel}
        <ArrowRight className="h-3.5 w-3.5" />
      </Button>
    )
  }

  return null
}
