'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { InsightsList } from '@/components/insights-list'
import { InsightsPageClient } from '@/components/insights-page-client'
import { useTodo } from '@/lib/todo-context'
import type { Insight } from '@/lib/types'

interface ColleagueInsightsClientProps {
  colleague: { id: string; name: string }
  colleagueId: string
  insights: Insight[]
  attentionCount: number
}

export function ColleagueInsightsClient({ colleague, colleagueId, insights, attentionCount }: ColleagueInsightsClientProps) {
  const pathname = usePathname()
  const { todos } = useTodo()

  const todoCount = todos.filter(t => t.colleagueId === colleagueId && t.status !== 'done').length

  const tabs = [
    { label: 'Insights', href: `/insights/${colleagueId}`, count: attentionCount },
    { label: 'To do', href: `/todo/${colleagueId}`, count: todoCount },
    { label: 'Archive', href: `/archive/${colleagueId}` },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <InsightsPageClient>
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
          <InsightsList insights={insights} colleagueName={colleague.name} />
        </main>
      </div>
    </InsightsPageClient>
  )
}
