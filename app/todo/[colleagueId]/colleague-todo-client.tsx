'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { TodoBoard } from '@/components/todo-board'
import { cn } from '@/lib/utils'
import { useTodo } from '@/lib/todo-context'
import { insights, getNeedsAttentionCount } from '@/lib/data/insights'
import { getColleagueById } from '@/lib/data/colleagues'
import type { TodoViewBy } from '@/lib/types'

interface ColleagueTodoClientProps {
  colleagueId: string
}

export function ColleagueTodoClient({ colleagueId }: ColleagueTodoClientProps) {
  const colleague = getColleagueById(colleagueId)
  const pathname = usePathname()
  const { todos } = useTodo()
  const [viewBy, setViewBy] = useState<TodoViewBy>('status')

  if (!colleague) {
    return <div>Colleague not found</div>
  }

  const collegeTodos = todos.filter(t => t.colleagueId === colleagueId && t.status !== 'done')
  const todoCount = collegeTodos.length
  const insightCount = getNeedsAttentionCount(insights)

  const tabs = [
    { label: 'Insights', href: `/insights/${colleagueId}`, count: insightCount },
    { label: 'To do', href: `/todo/${colleagueId}`, count: todoCount },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="px-6 pt-5 pb-0">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            {colleague.name}
          </h1>
        </div>
        <div className="flex items-center gap-6 px-6">
          {tabs.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex items-center gap-2 py-3 text-sm border-b-2 -mb-px transition-colors',
                isActive(tab.href)
                  ? 'border-foreground text-foreground font-medium'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span className={cn(
                  'text-xs px-1.5 py-0.5 rounded-full',
                  isActive(tab.href)
                    ? 'bg-foreground/10 text-foreground'
                    : 'bg-muted text-muted-foreground'
                )}>
                  {tab.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </header>

      <div className="flex items-center justify-between px-6 py-3 border-b bg-background">
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground mr-2">View by</span>
          {(['status', 'speed', 'urgency'] as TodoViewBy[]).map((v) => (
            <button
              key={v}
              onClick={() => setViewBy(v)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors capitalize',
                viewBy === v
                  ? 'bg-foreground text-background'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search tasks"
            className="pl-8 h-8 w-48 text-xs"
          />
        </div>
      </div>

      <main className="flex-1 overflow-hidden p-6">
        <TodoBoard viewBy={viewBy} colleagueId={colleagueId} />
      </main>
    </div>
  )
}
