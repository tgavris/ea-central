'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Insight } from '@/lib/types'
import { useTodo } from '@/lib/todo-context'

interface InsightRowProps {
  insight: Insight
  showColleague?: boolean
}

export function InsightRow({ insight, showColleague = false }: InsightRowProps) {
  const { addTodo, removeTodo, isTodoAdded, registerUndo, dismissUndo } = useTodo()

  // 'idle' | 'added' | 'dismissed'
  const [state, setState] = useState<'idle' | 'added' | 'dismissed'>('idle')
  const [visible, setVisible] = useState(true)
  const addedTodoIdRef = useRef<string | null>(null)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync with external state (e.g. if todo was added from detail page)
  const alreadyAdded = isTodoAdded(insight.id)
  useEffect(() => {
    if (alreadyAdded && state === 'idle') {
      setState('added')
    }
  }, [alreadyAdded, state])

  const handleAddTodo = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const id = addTodo({
      colleagueId: insight.colleagueId,
      title: insight.title,
      description: insight.description,
      source: 'insight',
      sourceId: insight.id,
      status: 'todo',
      speed: 'medium',
      urgency: insight.urgency === 'urgent' ? 'high' : insight.badge ? 'medium' : 'low',
      metadata: {
        type: insight.type,
        rule: insight.rule,
        urgency: insight.urgency,
        badge: insight.badge,
        sources: insight.sources,
      },
    })
    addedTodoIdRef.current = id

    registerUndo()
    setState('added')

    // Auto-dismiss after 4 seconds
    dismissTimerRef.current = setTimeout(() => {
      setVisible(false)
      dismissUndo()
    }, 4000)
  }

  const handleUndo = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)
    if (addedTodoIdRef.current) {
      removeTodo(addedTodoIdRef.current)
      addedTodoIdRef.current = null
    }
    dismissUndo()
    setState('idle')
    setVisible(true)
  }

  // Once dismissed (faded out), keep height=0 to collapse the row
  if (!visible) return null

  // The inline confirmation row
  if (state === 'added') {
    return (
      <div className={cn(
        'flex items-center gap-2 py-2.5 text-sm transition-opacity duration-300',
        !visible && 'opacity-0'
      )}>
        <span className="text-muted-foreground">
          <span className="font-medium text-foreground">&ldquo;{insight.title}&rdquo;</span>
          {' '}added to To-do.
        </span>
        <button
          onClick={handleUndo}
          className="text-primary text-sm font-medium hover:underline underline-offset-2 shrink-0"
        >
          Undo
        </button>
      </div>
    )
  }

  return (
    <div className="group flex items-start gap-3 py-2.5 -mx-5 px-5 rounded-lg hover:bg-blue-100/60 transition-colors duration-100">
      {/* Urgency dot */}
      <span className={cn(
        'mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full',
        insight.badge === 'Decision needed' && 'bg-amber-500',
        insight.badge === 'Predicted risk' && 'bg-blue-500',
        !insight.badge && insight.urgency === 'urgent' && 'bg-red-400',
        !insight.badge && insight.urgency === 'normal' && 'bg-muted-foreground/30',
      )} />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <Link href={`/insights/${insight.colleagueId}/${insight.id}`} className="inline">
          <span className="text-sm font-semibold text-foreground hover:underline underline-offset-2 cursor-pointer">
            {insight.title}
          </span>
        </Link>
        <span className="text-sm text-muted-foreground">
          {' '}&ndash;{' '}{insight.description}
        </span>

        {(insight.sources || insight.badge || showColleague) && (
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {insight.badge && (
              <span className={cn(
                'text-xs font-medium',
                insight.badge === 'Decision needed' && 'text-amber-600',
                insight.badge === 'Predicted risk' && 'text-blue-600',
              )}>
                {insight.badge}
              </span>
            )}
            {insight.sources && insight.sources.length > 0 && (
              <span className="text-xs text-muted-foreground">
                From:{' '}
                {insight.sources.map((s, i) => (
                  <span key={s.label}>
                    <a
                      href={s.url}
                      onClick={(e) => e.stopPropagation()}
                      className="text-primary hover:underline underline-offset-2"
                    >
                      {s.label}
                    </a>
                    {i < insight.sources!.length - 1 && (
                      <span className="text-muted-foreground/40"> &bull; </span>
                    )}
                  </span>
                ))}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Actions - visible on hover */}
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 pt-0.5">
        <button
          onClick={handleAddTodo}
          className="text-xs px-2.5 py-1 rounded-md border border-border text-foreground hover:bg-muted bg-background font-medium transition-colors"
        >
          + To-do
        </button>
      </div>
    </div>
  )
}

export { InsightRow as InsightCard }
