import { notFound } from 'next/navigation'
import { getInsightsByColleague, getNeedsAttentionCount } from '@/lib/data/insights'
import { getColleagueById, colleagues } from '@/lib/data/colleagues'
import { ColleagueInsightsClient } from '@/components/colleague-insights-client'

export function generateStaticParams() {
  return colleagues.map((c) => ({ colleagueId: c.id }))
}

interface ColleagueInsightsPageProps {
  params: Promise<{ colleagueId: string }>
}

export default async function ColleagueInsightsPage({ params }: ColleagueInsightsPageProps) {
  const { colleagueId } = await params
  const colleague = getColleagueById(colleagueId)

  if (!colleague) {
    notFound()
  }

  const insights = getInsightsByColleague(colleagueId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  const attentionCount = getNeedsAttentionCount(insights)

  return (
    <ColleagueInsightsClient
      colleague={colleague}
      colleagueId={colleagueId}
      insights={insights}
      attentionCount={attentionCount}
    />
  )
}
