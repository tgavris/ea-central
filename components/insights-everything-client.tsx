'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Calendar, Plane, FileText, Zap, Sparkles, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { InsightsHeader } from '@/components/insights-header'
import { InsightsList } from '@/components/insights-list'
import { AddToTodoButton } from '@/components/add-to-todo-button'
import { getColleagueById } from '@/lib/data/colleagues'
import { formatDateTime } from '@/lib/format-date'
import { useTodo } from '@/lib/todo-context'
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

interface InsightsEverythingClientProps {
  insights: Insight[]
  attentionCount: number
}

export function InsightsEverythingClient({ insights, attentionCount }: InsightsEverythingClientProps) {
  const [selected, setSelected] = useState<Insight | null>(null)
  const { clearUndoNotifications } = useTodo()

  useEffect(() => {
    clearUndoNotifications()
  }, [clearUndoNotifications])

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Shared full-width header — one border-b line for both panels */}
      <InsightsHeader insightCount={attentionCount} />

      {/* Content area — splits when detail is open */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left pane — list */}
        <div className={selected ? 'w-80 shrink-0 flex flex-col border-r overflow-hidden' : 'flex-1 flex flex-col overflow-hidden'}>
          <div className="flex-1 overflow-y-auto p-6">
            <InsightsList
              insights={insights}
              selectedId={selected?.id}
              onSelect={setSelected}
            />
          </div>
        </div>

        {/* Right pane — detail */}
        {selected && (
          <div className="flex-1 flex flex-col overflow-hidden bg-background">
            <InsightDetailPane insight={selected} onClose={() => setSelected(null)} />
          </div>
        )}
      </div>
    </div>
  )
}

function InsightDetailPane({ insight, onClose }: { insight: Insight; onClose: () => void }) {
  const Icon = TYPE_ICONS[insight.type]
  const colleague = getColleagueById(insight.colleagueId)

  return (
    <>
      {/* Header */}
      <div className="px-6 py-4 border-b shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {colleague && (
                <Badge variant="secondary" className="text-xs font-normal">
                  {colleague.name}
                </Badge>
              )}
              {insight.badge === 'Decision needed' && (
                <Badge variant="secondary" className="text-xs font-medium">
                  <Zap className="h-3 w-3 mr-1" />
                  Decision needed
                </Badge>
              )}
              {insight.badge === 'Predicted risk' && (
                <Badge variant="secondary" className="text-xs font-medium">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Predicted risk
                </Badge>
              )}
            </div>
            <h2 className="text-base font-semibold text-foreground leading-snug">
              {insight.title}
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            <AddToTodoButton insight={insight} variant="outline" size="sm" />
            <button
              onClick={onClose}
              className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">

        {/* Why this matters / What this impacts — 2-column card */}
        {(insight.whyItMatters || insight.whatItImpacts) && (
          <div className="rounded-lg border bg-card overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-border">
              {/* Left: Why */}
              <div className="p-4 space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Why this matters
                </p>
                <p className="text-xs text-foreground leading-relaxed">
                  {insight.whyItMatters ?? insight.description}
                </p>
              </div>
              {/* Right: Impact */}
              <div className="p-4 space-y-1.5">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                  <TrendingUp className="h-3 w-3 text-amber-500" />
                  What this impacts
                </p>
                <p className="text-xs text-foreground leading-relaxed">
                  {insight.whatItImpacts ?? '—'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action step */}
        {insight.actionStep && (
          <div className="rounded-lg border bg-card p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-3">
              Action step
            </p>
            <div className="flex items-center gap-3">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                1
              </span>
              <p className="flex-1 text-sm text-foreground leading-snug">
                {insight.actionStep.description}
              </p>
              <Button size="sm" className="shrink-0 gap-1">
                {insight.actionStep.ctaLabel}
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {/* Sources + meta row */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            {insight.sources && insight.sources.map((source, i) => (
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
    </>
  )
}
