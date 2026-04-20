import { InsightsEverythingClient } from '@/components/insights-everything-client'
import { getAllInsightsSorted, getNeedsAttentionCount } from '@/lib/data/insights'

export default function InsightsPage() {
  const insights = getAllInsightsSorted()
  const attentionCount = getNeedsAttentionCount(insights)

  return <InsightsEverythingClient insights={insights} attentionCount={attentionCount} />
}
