import { InsightsHeader } from '@/components/insights-header'
import { InsightsList } from '@/components/insights-list'
import { InsightsPageClient } from '@/components/insights-page-client'
import { getAllInsightsSorted, getNeedsAttentionCount } from '@/lib/data/insights'

export default function InsightsPage() {
  const insights = getAllInsightsSorted()
  const attentionCount = getNeedsAttentionCount(insights)

  return (
    <InsightsPageClient>
      <div className="flex flex-col h-full">
        <InsightsHeader insightCount={attentionCount} />
        
        <main className="flex-1 overflow-auto p-6">
          <InsightsList insights={insights} />
        </main>
      </div>
    </InsightsPageClient>
  )
}
