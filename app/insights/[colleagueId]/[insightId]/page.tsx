import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Calendar, Plane, FileText, Zap, Sparkles, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getInsightById, insights } from '@/lib/data/insights'
import { getColleagueById } from '@/lib/data/colleagues'
import { formatDateTime } from '@/lib/format-date'
import { AddToTodoButton } from '@/components/add-to-todo-button'

export function generateStaticParams() {
  return insights.map((i) => ({ colleagueId: i.colleagueId, insightId: i.id }))
}

const typeIcons = {
  email: Mail,
  calendar: Calendar,
  travel: Plane,
  document: FileText,
}

const typeLabels = {
  email: 'Email',
  calendar: 'Calendar',
  travel: 'Travel',
  document: 'Document',
}

interface InsightDetailPageProps {
  params: Promise<{ colleagueId: string; insightId: string }>
}

export default async function InsightDetailPage({ params }: InsightDetailPageProps) {
  const { colleagueId, insightId } = await params
  const insight = getInsightById(insightId)
  const colleague = getColleagueById(colleagueId)

  if (!insight || !colleague) {
    notFound()
  }

  const Icon = typeIcons[insight.type]

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Back nav */}
      <div className="px-8 pt-6 pb-0">
        <Link
          href={`/insights/${colleagueId}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {colleague.name}
        </Link>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-2xl mx-auto px-8 py-8 space-y-6">

          {/* Title block */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="text-xs font-normal">{colleague.name}</Badge>
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
            <h1 className="text-xl font-semibold text-foreground leading-snug">
              {insight.title}
            </h1>
            <div className="flex items-center gap-2 pt-1">
              <AddToTodoButton insight={insight} />
            </div>
          </div>

          {/* Why this matters / What this impacts — 2-column card */}
          {(insight.whyItMatters || insight.whatItImpacts) && (
            <div className="rounded-lg border bg-card overflow-hidden">
              <div className="grid grid-cols-2 divide-x divide-border">
                <div className="p-5 space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Why this matters
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {insight.whyItMatters ?? insight.description}
                  </p>
                </div>
                <div className="p-5 space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-amber-500" />
                    What this impacts
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {insight.whatItImpacts ?? '—'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action step */}
          {insight.actionStep && (
            <div className="rounded-lg border bg-card p-5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-4">
                Action step
              </p>
              <div className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  1
                </span>
                <p className="flex-1 text-sm text-foreground leading-snug">
                  {insight.actionStep.description}
                </p>
                <Button size="sm" className="shrink-0 gap-1">
                  {insight.actionStep.ctaLabel}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}

          {/* Sources + meta */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {insight.sources?.map((source, i) => (
                <a
                  key={i}
                  href={source.url}
                  className="inline-flex items-center gap-1 rounded-full border bg-muted/40 px-2.5 py-0.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  {source.label}
                </a>
              ))}
              {!insight.sources?.length && (
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  <span>{typeLabels[insight.type]}</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground shrink-0">
              <span>{insight.rule}</span>
              <span className="opacity-40">·</span>
              <span>{formatDateTime(insight.timestamp)}</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
