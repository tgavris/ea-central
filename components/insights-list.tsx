import Link from 'next/link'
import { User } from 'lucide-react'
import { InsightRow } from '@/components/insight-card'
import { getColleagueName, getColleagueById } from '@/lib/data/colleagues'
import type { Insight } from '@/lib/types'

interface InsightsListProps {
  insights: Insight[]
  colleagueName?: string
}

export function InsightsList({ insights, colleagueName }: InsightsListProps) {
  const needsAttention = insights.filter(
    (i) => i.urgency === 'urgent' || i.urgency === 'predicted-risk' || i.badge
  )
  const catchUp = insights.filter(
    (i) => i.urgency === 'normal' && !i.badge
  )

  if (insights.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-muted-foreground text-sm">No insights to show</p>
      </div>
    )
  }

  // Group insights by colleague when viewing "Everything" (no colleagueName filter)
  const groupByColleague = !colleagueName

  const renderInsightGroup = (items: Insight[], title: string) => {
    if (items.length === 0) return null

    if (groupByColleague) {
      // Group by colleague
      const grouped = items.reduce((acc, insight) => {
        const collegeName = getColleagueName(insight.colleagueId)
        if (!acc[collegeName]) {
          acc[collegeName] = []
        }
        acc[collegeName].push(insight)
        return acc
      }, {} as Record<string, Insight[]>)

      return (
        <section>
          <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
            {title}
          </h2>
          <div className="space-y-6">
            {Object.entries(grouped).map(([name, groupItems]) => {
              const colleague = getColleagueById(groupItems[0]?.colleagueId)
              return (
                <div key={name}>
                  <div className="flex items-center gap-2.5 mb-2.5 px-2.5 py-1.5 bg-muted rounded-lg w-fit">
                    <div className="flex h-5 w-5 items-center justify-center rounded bg-muted-foreground/20">
                      <User className="h-3 w-3 text-foreground/60" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">
                      {name}
                    </span>
                  </div>
                  <div className="bg-blue-50 rounded-xl px-5 py-1">
                    {groupItems.map((insight, index) => (
                      <div key={insight.id}>
                        <InsightRow insight={insight} />
                        {index < groupItems.length - 1 && (
                          <hr className="border-blue-100" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )
    }

    // Single colleague view - no grouping
    return (
      <section>
        <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-3">
          {title}
        </h2>
        <div className="bg-blue-50 rounded-xl px-5 py-1">
          {items.map((insight, index) => (
            <div key={insight.id}>
              <InsightRow insight={insight} />
              {index < items.length - 1 && (
                <hr className="border-blue-100" />
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  return (
    <div className="space-y-10">
      {/* Pending for You */}
      {renderInsightGroup(needsAttention, 'Pending for You')}

      {/* Topics to catch up on - only show on individual colleague pages, grouped by rule */}
      {colleagueName && catchUp.length > 0 && (() => {
        const byRule = catchUp.reduce((acc, insight) => {
          const key = insight.rule || 'Other'
          if (!acc[key]) acc[key] = []
          acc[key].push(insight)
          return acc
        }, {} as Record<string, Insight[]>)

        return (
          <section>
            <h2 className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-4">
              Topics to catch up on
            </h2>
            <div className="space-y-3">
              {Object.entries(byRule).map(([rule, items]) => (
                <div key={rule} className="space-y-2">
                  {items.map((insight) => (
                    <p key={insight.id} className="text-sm text-foreground leading-relaxed">
                      <span className="font-semibold">{rule}</span>
                      <span className="whitespace-nowrap">{' '}—{' '}</span>
                      <Link
                        href={`/insights/${insight.colleagueId}/${insight.id}`}
                        className="hover:underline underline-offset-2"
                      >
                        {insight.description}
                      </Link>
                      {insight.sources && insight.sources.length > 0 && (
                        <span className="text-muted-foreground">
                          {' '}From:{' '}
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
                                <span className="text-muted-foreground/40"> • </span>
                              )}
                            </span>
                          ))}
                        </span>
                      )}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </section>
        )
      })()}
    </div>
  )
}
