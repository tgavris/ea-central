import { notFound } from 'next/navigation'
import { InsightsHeader } from '@/components/insights-header'
import { InsightsList } from '@/components/insights-list'
import { InsightsPageClient } from '@/components/insights-page-client'
import { getInsightsByColleagueAndTeam, getNeedsAttentionCountByColleagueAndTeam } from '@/lib/data/insights'
import { getColleagueById } from '@/lib/data/colleagues'

interface ColleagueTeamInsightsPageProps {
  params: Promise<{ colleagueId: string; teamName: string }>
}

export default async function ColleagueTeamInsightsPage({ params }: ColleagueTeamInsightsPageProps) {
  const { colleagueId, teamName } = await params
  const colleague = getColleagueById(colleagueId)
  const decodedTeamName = decodeURIComponent(teamName)
  
  if (!colleague || !colleague.teams?.includes(decodedTeamName)) {
    notFound()
  }

  const insights = getInsightsByColleagueAndTeam(colleagueId, decodedTeamName)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  const attentionCount = getNeedsAttentionCountByColleagueAndTeam(colleagueId, decodedTeamName)

  return (
    <InsightsPageClient>
      <div className="flex flex-col h-full">
        <InsightsHeader 
          colleagueName={colleague.name}
          team={decodedTeamName}
          insightCount={attentionCount} 
        />
        
        <main className="flex-1 overflow-auto p-6">
          <InsightsList insights={insights} />
        </main>
      </div>
    </InsightsPageClient>
  )
}
