'use client'

import { useState, useEffect } from 'react'
import { X, Mail, Calendar, Plane, FileText, ExternalLink, Zap, Sparkles, Layers } from 'lucide-react'
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
            {insight.badge && (
              <div className="mb-2">
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
            )}
            <h2 className="text-base font-semibold text-foreground leading-snug mb-1 text-balance">
              {insight.title}
            </h2>
            {colleague && (
              <Badge variant="secondary" className="text-xs font-normal">
                {colleague.name}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 shrink-0">
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
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
        {/* Meta */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
          <Icon className="h-3.5 w-3.5" />
          <span>{TYPE_LABELS[insight.type]}</span>
          <span className="opacity-40">·</span>
          <span>{insight.rule}</span>
          <span className="opacity-40">·</span>
          <span>{formatDateTime(insight.timestamp)}</span>
        </div>

        {/* Description */}
        <p className="text-sm text-foreground leading-relaxed">
          {insight.description}
        </p>

        {/* Cross-channel context */}
        {insight.crossChannelContext && (
          <div className="space-y-1.5 border-l-2 border-muted pl-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <Layers className="h-3 w-3" /> Context
            </p>
            <p className="text-sm text-foreground leading-relaxed">
              {insight.crossChannelContext}
            </p>
          </div>
        )}

        {/* Suggested response */}
        {insight.suggestedResponse && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Suggested response
            </p>
            <div className="rounded-xl border bg-muted/30 p-4">
              <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                {insight.suggestedResponse}
              </pre>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm">Use this response</Button>
              <Button size="sm" variant="outline">Edit before sending</Button>
            </div>
          </div>
        )}

        {/* Sources */}
        {insight.sources && insight.sources.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Sources
            </p>
            <div className="flex flex-wrap gap-2">
              {insight.sources.map((source, i) => (
                <Button key={i} variant="outline" size="sm" className="text-xs" asChild>
                  <a href={source.url}>
                    {source.label}
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
