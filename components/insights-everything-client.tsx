'use client'

import { useState, useEffect } from 'react'
import { X, Zap, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { InsightsHeader } from '@/components/insights-header'
import { InsightsList } from '@/components/insights-list'
import { AddToTodoButton } from '@/components/add-to-todo-button'
import { InsightDetailBody } from '@/components/insight-detail-body'
import { getColleagueById } from '@/lib/data/colleagues'
import { useTodo } from '@/lib/todo-context'
import type { Insight } from '@/lib/types'

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
      <InsightsHeader insightCount={attentionCount} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left pane */}
        <div className={selected ? 'w-80 shrink-0 flex flex-col border-r overflow-hidden' : 'flex-1 flex flex-col overflow-hidden'}>
          <div className="flex-1 overflow-y-auto">
            <InsightsList insights={insights} selectedId={selected?.id} onSelect={setSelected} />
          </div>
        </div>

        {/* Right pane */}
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
  const colleague = getColleagueById(insight.colleagueId)

  return (
    <>
      {/* Header */}
      <div className="px-6 py-4 border-b shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              {colleague && (
                <Badge variant="secondary" className="text-xs font-normal">{colleague.name}</Badge>
              )}
              {insight.badge === 'Decision needed' && (
                <Badge variant="secondary" className="text-xs font-medium">
                  <Zap className="h-3 w-3 mr-1" />Decision needed
                </Badge>
              )}
              {insight.badge === 'Predicted risk' && (
                <Badge variant="secondary" className="text-xs font-medium">
                  <Sparkles className="h-3 w-3 mr-1" />Predicted risk
                </Badge>
              )}
            </div>
            <h2 className="text-base font-semibold text-foreground leading-snug">{insight.title}</h2>
          </div>
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            <AddToTodoButton insight={insight} variant="outline" size="sm" />
            <button onClick={onClose} className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground" aria-label="Close">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Body — shared with modal */}
      <div className="flex-1 overflow-y-auto px-6 py-5">
        <InsightDetailBody insight={insight} />
      </div>
    </>
  )
}
