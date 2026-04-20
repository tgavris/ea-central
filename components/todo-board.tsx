'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Mail, Calendar, Plane, FileText, AlertTriangle, X, Zap, Sparkles, ArrowRight, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Insight, TodoItem, TodoStatus, TodoSpeed, TodoUrgency, TodoViewBy } from '@/lib/types'
import { useTodo } from '@/lib/todo-context'
import { TodoCard } from '@/components/todo-card'
import { InsightDetailBody } from '@/components/insight-detail-body'
import { colleagues } from '@/lib/data/colleagues'
import { insights } from '@/lib/data/insights'
import { getColleagueName } from '@/lib/data/colleagues'
import { formatDateTime } from '@/lib/format-date'

interface Column<T extends string> {
  id: T
  title: string
}

const statusColumns: Column<TodoStatus>[] = [
  { id: 'todo', title: 'Insights' },
  { id: 'in-progress', title: 'In progress' },
  { id: 'done', title: 'Done' },
  { id: 'snoozed', title: 'Snoozed' },
]

const speedColumns: Column<TodoSpeed>[] = [
  { id: 'urgent', title: 'Urgent' },
  { id: 'soon', title: 'Soon' },
  { id: 'whenever', title: 'Whenever' },
]

const urgencyColumns: Column<TodoUrgency>[] = [
  { id: 'high', title: 'High' },
  { id: 'medium', title: 'Medium' },
  { id: 'low', title: 'Low' },
]

const TYPE_ICON = {
  email: Mail,
  calendar: Calendar,
  travel: Plane,
  document: FileText,
}

function InsightBoardCard({
  insight,
  onDragStart,
  onDragEnd,
  isDragging,
  onClick,
}: {
  insight: Insight
  onDragStart: (e: React.DragEvent) => void
  onDragEnd: () => void
  isDragging: boolean
  onClick: () => void
}) {
  const Icon = TYPE_ICON[insight.type] ?? FileText
  const colleagueName = getColleagueName(insight.colleagueId)

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={cn(
        'cursor-grab active:cursor-grabbing rounded-lg border bg-background p-3 shadow-sm transition-all select-none',
        isDragging ? 'opacity-40 scale-95' : 'hover:shadow-md hover:border-primary/30',
        insight.urgency === 'urgent' && 'border-l-2 border-l-red-400',
        insight.urgency === 'predicted-risk' && 'border-l-2 border-l-blue-400',
        insight.urgency === 'normal' && 'border-l-2 border-l-transparent',
      )}
    >
      <div className="flex items-start gap-2 mb-2">
        <div className="h-6 w-6 rounded flex items-center justify-center shrink-0 bg-muted">
          <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        </div>
        <p className="text-xs font-semibold text-foreground leading-snug flex-1">{insight.title}</p>
      </div>

      <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2 mb-2">
        {insight.description}
      </p>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
          {colleagueName}
        </span>
        {insight.badge && (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {insight.badge}
          </span>
        )}
        {insight.urgency === 'urgent' && !insight.badge && (
          <span className="flex items-center gap-0.5 text-[10px] font-medium text-red-600">
            <AlertTriangle className="h-2.5 w-2.5" />
            Urgent
          </span>
        )}
      </div>
    </div>
  )
}

const TYPE_LABELS: Record<string, string> = {
  email: 'Email',
  calendar: 'Calendar',
  travel: 'Travel',
  document: 'Document',
}

function InsightModal({
  insight,
  onClose,
  onMoveTo,
}: {
  insight: Insight
  onClose: () => void
  onMoveTo: (status: TodoStatus, urgency: TodoUrgency, speed: TodoSpeed) => void
}) {
  const Icon = TYPE_ICON[insight.type] ?? FileText
  const colleagueName = getColleagueName(insight.colleagueId)

  const defaultUrgency: TodoUrgency =
    insight.urgency === 'urgent' ? 'high' : insight.badge ? 'medium' : 'low'
  const [selectedUrgency, setSelectedUrgency] = useState<TodoUrgency>(defaultUrgency)
  const [selectedSpeed, setSelectedSpeed] = useState<TodoSpeed>('medium')

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-xl max-h-[85vh] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {insight.badge && (
                <div className="mb-2">
                  {insight.badge === 'Decision needed' && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                      <Zap className="h-3 w-3" /> Decision needed
                    </span>
                  )}
                  {insight.badge === 'Predicted risk' && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                      <Sparkles className="h-3 w-3" /> Predicted risk
                    </span>
                  )}
                </div>
              )}
              <h2 className="text-base font-semibold text-foreground leading-snug">{insight.title}</h2>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground flex-wrap">
                <Icon className="h-3.5 w-3.5" />
                <span>{TYPE_LABELS[insight.type]}</span>
                <span className="opacity-40">·</span>
                <span>{insight.rule}</span>
                <span className="opacity-40">·</span>
                <span>{colleagueName}</span>
                <span className="opacity-40">·</span>
                <span>{formatDateTime(insight.timestamp)}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body — same content as split-pane detail */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          <InsightDetailBody insight={insight} />
        </div>

        {/* Footer — flags + move to */}
        <div className="px-6 py-4 border-t bg-muted/20 shrink-0 space-y-3">
          {/* Flags row */}
          <div className="flex items-start gap-6">
            {/* Urgency */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Urgency</p>
              <div className="flex items-center gap-1">
                {([
                  { id: 'high', label: 'High', active: 'bg-muted text-foreground border-border', dot: 'bg-red-500' },
                  { id: 'medium', label: 'Medium', active: 'bg-muted text-foreground border-border', dot: 'bg-amber-400' },
                  { id: 'low', label: 'Low', active: 'bg-muted text-muted-foreground border-border', dot: 'bg-muted-foreground/40' },
                ] as { id: TodoUrgency; label: string; active: string; dot: string }[]).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedUrgency(opt.id)}
                    className={cn(
                      'flex items-center gap-1.5 text-xs font-medium border rounded-md px-2.5 py-1 transition-colors',
                      selectedUrgency === opt.id
                        ? opt.active
                        : 'border-border text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', selectedUrgency === opt.id ? opt.dot : 'bg-muted-foreground/30')} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Speed */}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Speed</p>
              <div className="flex items-center gap-1">
                {([
                  { id: 'quick', label: 'Quick', active: 'bg-muted text-foreground border-border' },
                  { id: 'medium', label: 'Medium', active: 'bg-muted text-foreground border-border' },
                  { id: 'long', label: 'Long', active: 'bg-muted text-foreground border-border' },
                ] as { id: TodoSpeed; label: string; active: string }[]).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedSpeed(opt.id)}
                    className={cn(
                      'text-xs font-medium border rounded-md px-2.5 py-1 transition-colors',
                      selectedSpeed === opt.id
                        ? opt.active
                        : 'border-border text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Move to row */}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Move to</p>
            <div className="flex items-center gap-2">
              {([
                { id: 'in-progress', label: 'In progress', className: 'border-border text-foreground hover:bg-muted' },
                { id: 'done', label: 'Done', className: 'border-border text-foreground hover:bg-muted' },
                { id: 'snoozed', label: 'Snoozed', className: 'border-border text-foreground hover:bg-muted' },
              ] as { id: TodoStatus; label: string; className: string }[]).map((col) => (
                <button
                  key={col.id}
                  onClick={() => { onMoveTo(col.id, selectedUrgency, selectedSpeed); onClose() }}
                  className={cn(
                    'flex items-center gap-1.5 text-xs font-medium border rounded-md px-3 py-1.5 transition-colors',
                    col.className
                  )}
                >
                  <ArrowRight className="h-3 w-3" />
                  {col.label}
                </button>
              ))}
              <Link
                href={`/insights/${insight.colleagueId}/${insight.id}`}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                Full detail <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TodoModal({
  todo,
  onClose,
  onMoveTo,
}: {
  todo: TodoItem
  onClose: () => void
  onMoveTo: (status: TodoStatus) => void
}) {
  const colleagueName = getColleagueName(todo.colleagueId)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-xl max-h-[85vh] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-5 pb-4 border-b shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {colleagueName}
                </span>
              </div>
              <h2 className="text-base font-semibold text-foreground leading-snug">{todo.title}</h2>
            </div>
            <button onClick={onClose} className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {todo.description && (
            <div className="rounded-lg border bg-card px-4 py-3 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Context
              </p>
              <p className="text-sm text-foreground leading-relaxed">{todo.description}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/20 shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Move to</p>
          <div className="flex items-center gap-2">
            {([
              { id: 'todo', label: 'Insights' },
              { id: 'in-progress', label: 'In progress' },
              { id: 'done', label: 'Done' },
              { id: 'snoozed', label: 'Snoozed' },
            ] as { id: TodoStatus; label: string }[])
              .filter((col) => col.id !== todo.status)
              .map((col) => (
                <button
                  key={col.id}
                  onClick={() => onMoveTo(col.id)}
                  className="flex items-center gap-1.5 text-xs font-medium border border-border rounded-md px-3 py-1.5 hover:bg-muted transition-colors"
                >
                  <ArrowRight className="h-3 w-3" />
                  {col.label}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface TodoBoardProps {
  viewBy: TodoViewBy
  colleagueId?: string
}

export function TodoBoard({ viewBy, colleagueId }: TodoBoardProps) {
  const { todos, updateTodoStatus, addTodo } = useTodo()
  const [draggedTodo, setDraggedTodo] = useState<TodoItem | null>(null)
  const [draggedInsightId, setDraggedInsightId] = useState<string | null>(null)
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
  const [modalInsight, setModalInsight] = useState<Insight | null>(null)
  const [modalTodo, setModalTodo] = useState<TodoItem | null>(null)

  const handleTodoCardClick = (todo: TodoItem) => {
    if (todo.source === 'insight') {
      const linked = insights.find((i) => i.id === todo.sourceId)
      if (linked) { setModalInsight(linked); return }
    }
    setModalTodo(todo)
  }
  const [addingTask, setAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskColleagueId, setNewTaskColleagueId] = useState(colleagueId ?? 'personal')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (addingTask) inputRef.current?.focus()
  }, [addingTask])

  const handleAddTask = () => {
    const title = newTaskTitle.trim()
    if (!title) {
      setAddingTask(false)
      return
    }
    addTodo({
      title,
      description: '',
      colleagueId: newTaskColleagueId,
      source: 'inbox',
      sourceId: `manual-${Date.now()}`,
      status: 'todo',
      speed: 'medium',
      urgency: 'medium',
      metadata: {},
    })
    setNewTaskTitle('')
    setAddingTask(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddTask()
    if (e.key === 'Escape') {
      setNewTaskTitle('')
      setAddingTask(false)
    }
  }

  const handleDragStart = (e: React.DragEvent, todo: TodoItem) => {
    setDraggedTodo(todo)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', todo.id)
  }

  const handleDragEnd = () => {
    setDraggedTodo(null)
    setDraggedInsightId(null)
    setDragOverColumn(null)
  }

  const handleInsightDragStart = (e: React.DragEvent, insightId: string) => {
    setDraggedInsightId(insightId)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/insight-id', insightId)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDragOverColumn(null)
  }

  const addInsightAsTodo = (insight: Insight, status: TodoStatus, urgency: TodoUrgency, speed: TodoSpeed) => {
    // If this insight is already a todo, just move it — don't duplicate
    const existing = todos.find((t) => t.source === 'insight' && t.sourceId === insight.id)
    if (existing) {
      updateTodoStatus(existing.id, status)
      return
    }
    addTodo({
      colleagueId: insight.colleagueId,
      title: insight.title,
      description: insight.description,
      source: 'insight',
      sourceId: insight.id,
      status,
      speed,
      urgency,
      metadata: { type: insight.type, rule: insight.rule },
    })
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    const newStatus = columnId as TodoStatus

    if (draggedInsightId && viewBy === 'status') {
      // Raw insight card dropped — convert to todo (or update status if already exists)
      // Dropping back on the Insights column is a no-op for raw insight cards
      if (columnId !== 'todo') {
        const insight = insights.find((i) => i.id === draggedInsightId)
        if (insight) {
          const urgency: TodoUrgency = insight.urgency === 'urgent' ? 'high' : insight.badge ? 'medium' : 'low'
          addInsightAsTodo(insight, newStatus, urgency, 'medium')
        }
      }
    } else if (draggedTodo && viewBy === 'status') {
      // Todo card dragged to any column — update status (including back to 'todo' / Insights column)
      if (draggedTodo.status !== newStatus) {
        updateTodoStatus(draggedTodo.id, newStatus)
      }
    }

    setDraggedTodo(null)
    setDraggedInsightId(null)
    setDragOverColumn(null)
  }

  const getTodosByColumn = (columnId: string): TodoItem[] => {
    const filtered = colleagueId 
      ? todos.filter((t) => t.colleagueId === colleagueId)
      : todos
    
    if (viewBy === 'status') return filtered.filter((t) => t.status === columnId)
    if (viewBy === 'speed') return filtered.filter((t) => t.speed === columnId)
    if (viewBy === 'urgency') return filtered.filter((t) => t.urgency === columnId)
    return []
  }

  const columns =
    viewBy === 'status' ? statusColumns :
    viewBy === 'speed' ? speedColumns :
    urgencyColumns

  const emptyHint: Record<string, string> = {
    // status
    todo: 'Add items from Insights or Inbox',
    'in-progress': 'Drag items here when working',
    done: 'Completed items appear here',
    snoozed: 'Snoozed items appear here',
    // speed
    urgent: 'No urgent items',
    soon: 'No items due soon',
    whenever: 'No low-priority items',
    // urgency
    high: 'No high-urgency items',
    medium: 'No medium-urgency items',
    low: 'No low-urgency items',
  }

  // Todos flagged via "+To-do" (status='todo') shown at top of Insights column
  const queuedTodos = (colleagueId
    ? todos.filter((t) => t.colleagueId === colleagueId)
    : todos
  ).filter((t) => t.status === 'todo')

  // Raw insights not yet converted — shown below queued todos
  const todoInsightIds = new Set(todos.filter((t) => t.source === 'insight').map((t) => t.sourceId))
  const columnInsights = (colleagueId
    ? insights.filter((i) => i.colleagueId === colleagueId)
    : insights
  ).filter((i) => !todoInsightIds.has(i.id))

  return (
    <div className="grid grid-cols-4 gap-6 h-full">
      {columns.map((column) => {
        const isInsightsColumn = viewBy === 'status' && column.id === 'todo'
        const columnTodos = getTodosByColumn(column.id)
        const isDragOver = dragOverColumn === column.id
        const itemCount = isInsightsColumn ? queuedTodos.length + columnInsights.length : columnTodos.length

        return (
          <div
            key={column.id}
            className="flex flex-col min-h-0"
            onDragOver={(e) => handleDragOver(e, column.id)}
            onDragLeave={(e) => { e.stopPropagation(); handleDragLeave() }}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-foreground">
                  {column.title}
                </h3>
                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                  {itemCount}
                </span>
              </div>
            </div>

            {/* Column Content */}
            <div
              className={cn(
                'flex-1 overflow-auto rounded-lg border-2 border-dashed p-3 transition-colors',
                isDragOver
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-transparent bg-muted/30',
              )}
            >
              <div className="space-y-3">
                {isInsightsColumn ? (
                  queuedTodos.length === 0 && columnInsights.length === 0 ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">
                      No insights
                    </div>
                  ) : (
                    <>
                      {/* Queued todos (added via +To-do) appear first */}
                      {queuedTodos.map((todo) => (
                        <div
                          key={todo.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, todo)}
                          onDragEnd={handleDragEnd}
                          className="cursor-grab active:cursor-grabbing"
                        >
                          <TodoCard
                            todo={todo}
                            isDragging={draggedTodo?.id === todo.id}
                            onClick={() => handleTodoCardClick(todo)}
                          />
                        </div>
                      ))}

                      {/* Divider if both sections have items */}
                      {queuedTodos.length > 0 && columnInsights.length > 0 && (
                        <div className="flex items-center gap-2 py-1">
                          <hr className="flex-1 border-border" />
                          <span className="text-[10px] text-muted-foreground shrink-0">All insights</span>
                          <hr className="flex-1 border-border" />
                        </div>
                      )}

                      {/* Raw insight cards below */}
                      {columnInsights.map((insight) => (
                        <InsightBoardCard
                          key={insight.id}
                          insight={insight}
                          isDragging={draggedInsightId === insight.id}
                          onDragStart={(e) => handleInsightDragStart(e, insight.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => setModalInsight(insight)}
                        />
                      ))}
                    </>
                  )
                ) : (
                  <>
                    {columnTodos.map((todo) => (
                      <div
                        key={todo.id}
                        draggable={viewBy === 'status'}
                        onDragStart={(e) => handleDragStart(e, todo)}
                        onDragEnd={handleDragEnd}
                        className={cn(viewBy === 'status' && 'cursor-grab active:cursor-grabbing')}
                      >
                        <TodoCard
                          todo={todo}
                          isDragging={draggedTodo?.id === todo.id}
                          onClick={() => handleTodoCardClick(todo)}
                        />
                      </div>
                    ))}

                    {columnTodos.length === 0 && !isDragOver && !addingTask && (
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        {emptyHint[column.id]}
                      </div>
                    )}

                    {viewBy === 'status' && (
                      <div className="mt-1">
                        {addingTask ? (
                          <div className="rounded-lg border bg-background p-2.5 space-y-2 shadow-sm">
                            <input
                              ref={inputRef}
                              value={newTaskTitle}
                              onChange={(e) => setNewTaskTitle(e.target.value)}
                              onKeyDown={handleKeyDown}
                              placeholder="Task title..."
                              className="w-full text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                            />
                            {!colleagueId && (
                              <select
                                value={newTaskColleagueId}
                                onChange={(e) => setNewTaskColleagueId(e.target.value)}
                                className="w-full text-xs bg-muted rounded px-2 py-1 text-foreground outline-none"
                              >
                                {colleagues.map((c) => (
                                  <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                              </select>
                            )}
                            <div className="flex items-center gap-2 pt-0.5">
                              <button
                                onClick={handleAddTask}
                                className="text-xs font-medium bg-foreground text-background px-2.5 py-1 rounded hover:opacity-80 transition-opacity"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => { setNewTaskTitle(''); setAddingTask(false) }}
                                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAddingTask(true)}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-full py-1 px-1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add task
                          </button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )
      })}

      {modalInsight && (
        <InsightModal
          insight={modalInsight}
          onClose={() => setModalInsight(null)}
          onMoveTo={(status, urgency, speed) => addInsightAsTodo(modalInsight, status, urgency, speed)}
        />
      )}

      {modalTodo && (
        <TodoModal
          todo={modalTodo}
          onClose={() => setModalTodo(null)}
          onMoveTo={(status) => { updateTodoStatus(modalTodo.id, status); setModalTodo(null) }}
        />
      )}
    </div>
  )
}
