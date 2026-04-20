'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Insight } from '@/lib/types'
import { useTodo } from '@/lib/todo-context'

interface InsightRowProps {
  insight: Insight
  showColleague?: boolean
  onSelect?: () => void
  isSelected?: boolean
}

export function InsightRow({ insight, showColleague = false, onSelect, isSelected }: InsightRowProps) {
  const { todos, addTodo, removeTodo, isTodoAdded, registerUndo, dismissUndo } = useTodo()

  const [state, setState] = useState<'idle' | 'added'>('idle')
  const [visible, setVisible] = useState(true)
  const addedTodoIdRef = useRef<string | null>(null)
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Tracks that undo was explicitly invoked so the sync effect doesn't fight back
  const undoingRef = useRef(false)

  // Sync with external state (e.g. todo added from detail pane or drag-drop)
  const alreadyAdded = isTodoAdded(insight.id)
  useEffect(() => {
    if (alreadyAdded && state === 'idle' && !undoingRef.current) {
      setVisible(true)
      setState('added')
    }
  }, [alreadyAdded, state])

  const handleAddTodo = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    undoingRef.current = false

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
    setVisible(true)

    // Auto-dismiss the undo banner after 8 seconds (but keep todo in context)
    dismissTimerRef.current = setTimeout(() => {
      setVisible(false)
      dismissUndo()
    }, 8000)
  }

  const handleUndo = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (dismissTimerRef.current) clearTimeout(dismissTimerRef.current)

    // Use ref if fresh click, otherwise find by sourceId (handles re-mount case)
    const todoId = addedTodoIdRef.current
      ?? todos.find((t) => t.source === 'insight' && t.sourceId === insight.id)?.id
      ?? null
    if (todoId) {
      undoingRef.current = true
      removeTodo(todoId)
    }
    addedTodoIdRef.current = null
    dismissUndo()
    setState('idle')
    setVisible(true)
    // Allow sync effect to run again after this frame
    requestAnimationFrame(() => { undoingRef.current = false })
  }

  // Row collapsed after auto-dismiss banner (todo still exists in context)
  if (!visible && state === 'idle') return null

  // The inline confirmation row
  if (state === 'added') {
    return (
      <div className="flex items-center gap-2 py-2.5 text-sm">
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
    <div
      role={onSelect ? 'button' : undefined}
      onClick={onSelect}
      className={cn(
        'group flex items-start gap-3 py-2.5 -mx-5 px-5 transition-colors duration-100',
        onSelect && 'cursor-pointer',
        isSelected ? 'bg-muted' : 'hover:bg-muted/60',
      )}
    >
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
        {onSelect ? (
          <span className="text-sm font-semibold text-foreground">
            {insight.title}
          </span>
        ) : (
          <Link href={`/insights/${insight.colleagueId}/${insight.id}`} className="inline">
            <span className="text-sm font-semibold text-foreground hover:underline underline-offset-2 cursor-pointer">
              {insight.title}
            </span>
          </Link>
        )}
        <span className="text-sm text-muted-foreground">
          {' '}&ndash;{' '}{insight.description}
        </span>

        {(insight.sources || insight.badge || showColleague) && (
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            {insight.badge && (
              <span className="text-xs font-medium text-muted-foreground">
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
