import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Mail, Calendar, Plane, FileText, ExternalLink, Zap, Sparkles, Layers } from 'lucide-react'
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
      {/* Back nav — minimal, inline */}
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
        <div className="max-w-2xl mx-auto px-8 py-10 space-y-10">

          {/* Title block */}
          <div className="space-y-4">
            {insight.badge && (
              <div>
                {insight.badge === 'Decision needed' && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium">
                    <Zap className="h-3 w-3 mr-1" />
                    Decision needed
                  </Badge>
                )}
                {insight.badge === 'Predicted risk' && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Predicted risk
                  </Badge>
                )}
              </div>
            )}

            <h1 className="text-2xl font-semibold text-foreground leading-snug text-balance">
              {insight.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon className="h-3.5 w-3.5" />
              <span>{typeLabels[insight.type]}</span>
              <span className="text-muted-foreground/40">·</span>
              <span>{insight.rule}</span>
              <span className="text-muted-foreground/40">·</span>
              <span>{formatDateTime(insight.timestamp)}</span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <AddToTodoButton insight={insight} />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {insight.description}
            </p>
          </div>

          {/* Cross-channel context */}
          {insight.crossChannelContext && (
            <div className="space-y-2 border-l-2 border-muted pl-4">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Layers className="h-3 w-3" />
                Context
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                {insight.crossChannelContext}
              </p>
            </div>
          )}

          {/* Suggested response */}
          {insight.suggestedResponse && (
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" />
                Suggested response
              </p>
              <div className="rounded-xl border bg-muted/30 p-5">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                  {insight.suggestedResponse}
                </pre>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm">Use this response</Button>
                <Button size="sm" variant="outline">Edit before sending</Button>
              </div>
            </div>
          )}

          {/* Sources */}
          {insight.sources && insight.sources.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                Sources
              </p>
              <div className="flex flex-wrap gap-2">
                {insight.sources.map((source, index) => (
                  <Button key={index} variant="outline" size="sm" className="text-xs" asChild>
                    <a href={source.url}>
                      {source.label}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
