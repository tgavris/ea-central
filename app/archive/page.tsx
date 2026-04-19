'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Archive } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTodo } from '@/lib/todo-context'
import { insights, getNeedsAttentionCount } from '@/lib/data/insights'

export default function ArchivePage() {
  const pathname = usePathname()
  const { todos } = useTodo()
  
  const todoCount = todos.filter(t => t.status !== 'done').length
  const insightCount = getNeedsAttentionCount(insights)
  
  const tabs = [
    { label: 'Insights', href: '/insights', count: insightCount },
    { label: 'To do', href: '/todo', count: todoCount },
  ]

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        {/* H1 - matches left nav selection */}
        <div className="px-6 pt-5 pb-0">
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Everything
          </h1>
        </div>
        
        {/* Tabs */}
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

      {/* Empty State */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-muted mb-4">
            <Archive className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-medium text-foreground mb-2">No archived items</h2>
          <p className="text-sm text-muted-foreground max-w-sm">
            Completed insights and to-dos will appear here for reference.
          </p>
        </div>
      </main>
    </div>
  )
}
