'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useTodo } from '@/lib/todo-context'
import { getColleagueById } from '@/lib/data/colleagues'
import { getInsightsByColleague, getNeedsAttentionCount } from '@/lib/data/insights'

interface ColleagueArchiveClientProps {
  colleagueId: string
}

export function ColleagueArchiveClient({ colleagueId }: ColleagueArchiveClientProps) {
  const colleague = getColleagueById(colleagueId)
  const pathname = usePathname()
  const { todos } = useTodo()

  if (!colleague) {
    return <div>Colleague not found</div>
  }

  const collegeTodos = todos.filter(t => t.colleagueId === colleagueId && t.status !== 'done')
  const collegeInsights = getInsightsByColleague(colleagueId)
  const todoCount = collegeTodos.length
  const insightCount = getNeedsAttentionCount(collegeInsights)

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

      <main className="flex-1 overflow-auto p-6">
        <div className="text-center text-muted-foreground">
          Archive for {colleague.name}
        </div>
      </main>
    </div>
  )
}
