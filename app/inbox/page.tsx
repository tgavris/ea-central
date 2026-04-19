'use client'

import { useState } from 'react'
import { Search, RefreshCw, Plus, Check, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getAllInboxItemsSorted } from '@/lib/data/inbox'
import { getColleagueName } from '@/lib/data/colleagues'
import { formatDistanceToNow } from '@/lib/format-date'
import { useTodo } from '@/lib/todo-context'
import type { InboxItem } from '@/lib/types'

function formatFullDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default function InboxPage() {
  const allItems = getAllInboxItemsSorted()
  const [selected, setSelected] = useState<InboxItem>(allItems[0])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filtered = allItems.filter((item) => {
    const matchesSearch =
      search === '' ||
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.fromName.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || (filter === 'unread' && item.unread)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left pane - list */}
      <div className="w-80 shrink-0 flex flex-col border-r bg-background">
        {/* List header */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-sm font-semibold text-foreground">Inbox</h1>
            <button className="p-1 rounded hover:bg-muted transition-colors text-muted-foreground">
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-7 text-xs bg-muted border-0 focus-visible:ring-1"
            />
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 px-3 py-2 border-b">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-medium transition-colors capitalize',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Email list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item)}
              className={cn(
                'w-full text-left px-4 py-3 border-b border-border/50 transition-colors',
                selected?.id === item.id
                  ? 'bg-blue-50'
                  : 'hover:bg-muted/50'
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <span className={cn(
                  'text-xs truncate',
                  item.unread ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'
                )}>
                  {item.fromName}
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0">
                  {formatDistanceToNow(item.timestamp)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                {item.unread && (
                  <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                )}
                <p className={cn(
                  'text-xs truncate',
                  item.unread ? 'font-medium text-foreground' : 'text-muted-foreground'
                )}>
                  {item.subject}
                </p>
              </div>
              <p className="text-[11px] text-muted-foreground truncate leading-relaxed">
                {item.preview}
              </p>
            </button>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No messages found
            </div>
          )}
        </div>
      </div>

      {/* Right pane - thread */}
      {selected ? (
        <ThreadPane item={selected} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Select a message to read
        </div>
      )}
    </div>
  )
}

function ThreadPane({ item }: { item: InboxItem }) {
  const { addTodo, isTodoAdded } = useTodo()
  const isAdded = isTodoAdded(item.id)
  const colleagueName = getColleagueName(item.colleagueId)

  const handleAddTodo = () => {
    if (isAdded) return
    addTodo({
      colleagueId: item.colleagueId,
      title: item.subject,
      description: item.preview,
      source: 'inbox',
      sourceId: item.id,
      status: 'todo',
      metadata: { from: item.from, timestamp: item.timestamp },
    })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Thread header */}
      <div className="px-6 py-4 border-b shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground leading-snug mb-1 text-balance">
              {item.subject}
            </h2>
            <Badge variant="secondary" className="text-xs font-normal">
              {colleagueName}
            </Badge>
          </div>
          <Button
            size="sm"
            variant={isAdded ? 'secondary' : 'outline'}
            onClick={handleAddTodo}
            disabled={isAdded}
            className="shrink-0 text-xs"
          >
            {isAdded ? (
              <><Check className="h-3.5 w-3.5 mr-1.5" />Added to To-do</>
            ) : (
              <><Plus className="h-3.5 w-3.5 mr-1.5" />Add to To-do</>
            )}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {item.thread.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
      </div>
    </div>
  )
}

function MessageBubble({ msg }: { msg: InboxItem['thread'][number] }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      {/* Message header */}
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
            {msg.fromName.charAt(0)}
          </div>
          <div className="text-left min-w-0">
            <span className="text-xs font-semibold text-foreground">{msg.fromName}</span>
            <span className="text-xs text-muted-foreground ml-2">{msg.from}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-muted-foreground">{formatFullDate(msg.timestamp)}</span>
          <ChevronDown className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', !expanded && '-rotate-90')} />
        </div>
      </button>

      {/* Message body */}
      {expanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="pl-10">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
              {msg.body}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
