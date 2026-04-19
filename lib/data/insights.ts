import type { Insight } from '@/lib/types'

// Helper to create dates relative to now
const hoursAgo = (hours: number) => new Date(Date.now() - hours * 60 * 60 * 1000)
const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60 * 1000)

export const insights: Insight[] = [
  {
    id: 'ins-1',
    colleagueId: 'sarah-chen',
    type: 'email',
    title: 'Draft reply to Goldman Sachs: Q1 strategy review meeting',
    description: 'Description of why this is important and the context.',
    rule: 'Client correspondence rule',
    timestamp: hoursAgo(4),
    urgency: 'urgent',
    sources: [
      { label: 'Email 1', url: '#' },
      { label: 'Email 2', url: '#' },
    ],
    suggestedResponse: `Dear Mr. Thompson,

Thank you for reaching out regarding the Q1 strategy review meeting. Sarah is available on the following dates:

- Tuesday, April 22nd at 2:00 PM EST
- Wednesday, April 23rd at 10:00 AM EST
- Friday, April 25th at 3:30 PM EST

Please let us know which time works best for your team, and we will send a calendar invitation with the conference details.

Best regards,
[Your name]
Executive Assistant to Sarah Chen`,
    crossChannelContext: 'Sarah mentioned in Slack that Goldman is a priority client this quarter. She has a board meeting on April 24th that should not conflict.',
  },
  {
    id: 'ins-2',
    colleagueId: 'sarah-chen',
    type: 'email',
    title: 'Draft reply to Board Secretary: agenda item confirmation',
    description: 'Confirmation needed for Q2 board meeting agenda items.',
    rule: 'Board communication rule',
    timestamp: hoursAgo(2),
    urgency: 'urgent',
    suggestedResponse: `Dear Board Secretary,

I can confirm that Sarah Chen will present the following agenda items at the Q2 board meeting:

1. Digital Transformation Initiative Update (15 minutes)
2. Q1 Financial Performance Review (20 minutes)
3. Strategic Partnerships Overview (10 minutes)

Please let me know if you need any additional materials or if there are any changes to the schedule.

Best regards`,
  },
  {
    id: 'ins-3',
    colleagueId: 'sarah-chen',
    type: 'calendar',
    title: 'Reschedule: Board prep conflicts with Acme Corp call',
    description: 'Two high-priority meetings are scheduled at the same time on Thursday.',
    rule: 'External meeting reschedule',
    timestamp: hoursAgo(1),
    urgency: 'normal',
    crossChannelContext: 'The Acme Corp call was originally scheduled last week but was postponed due to travel. Board prep is a recurring weekly meeting.',
  },
  {
    id: 'ins-4',
    colleagueId: 'sarah-chen',
    type: 'travel',
    title: "Passport expiry alert: Sarah Chen's passport expires Mar 18",
    description: 'Passport will expire in less than 6 months, which may affect international travel.',
    rule: 'Travel document rule',
    timestamp: hoursAgo(5),
    urgency: 'urgent',
  },
  {
    id: 'ins-5',
    colleagueId: 'sarah-chen',
    type: 'calendar',
    title: "CEO's office requesting urgent 1:1 — only opening overlaps Nomura prep",
    description: 'The CEO needs to discuss Q2 priorities before the all-hands meeting.',
    rule: 'Urgent',
    timestamp: minutesAgo(12),
    urgency: 'urgent',
    badge: 'Decision needed',
  },
  {
    id: 'ins-6',
    colleagueId: 'sarah-chen',
    type: 'travel',
    title: 'BA289 LHR→JFK likely delayed — North Atlantic storm',
    description: '~14 hours (flight departs tomorrow 08:40)',
    rule: 'Flight monitoring',
    timestamp: minutesAgo(18),
    urgency: 'predicted-risk',
    badge: 'Predicted risk',
    crossChannelContext: 'Sarah has a client dinner scheduled for tomorrow evening in NYC. If the flight is delayed significantly, alternative arrangements may be needed.',
  },
  {
    id: 'ins-7',
    colleagueId: 'james-whitfield',
    type: 'email',
    title: 'Follow up needed: McKinsey proposal review',
    description: 'McKinsey sent the final proposal 3 days ago with no response.',
    rule: 'Client correspondence rule',
    timestamp: hoursAgo(6),
    urgency: 'normal',
  },
  {
    id: 'ins-8',
    colleagueId: 'adelina-atara',
    type: 'calendar',
    title: 'Quarterly review prep: 5 documents pending signature',
    description: 'Documents need to be signed before end of week.',
    rule: 'Document workflow',
    timestamp: hoursAgo(3),
    urgency: 'normal',
  },
  {
    id: 'ins-9',
    colleagueId: 'adelina-atara',
    type: 'email',
    title: 'Vendor contract renewal reminder',
    description: 'AWS contract expires in 30 days.',
    rule: 'Contract management',
    timestamp: hoursAgo(8),
    urgency: 'normal',
  },
  {
    id: 'ins-10',
    colleagueId: 'adelina-atara',
    type: 'travel',
    title: 'Singapore trip: Visa application deadline approaching',
    description: 'Visa processing takes 5-7 business days.',
    rule: 'Travel document rule',
    timestamp: hoursAgo(2),
    urgency: 'urgent',
  },
  {
    id: 'ins-11',
    colleagueId: 'frederick-blunst',
    type: 'calendar',
    title: 'Team offsite location confirmation needed',
    description: 'Venue is holding 2 dates, decision needed by Friday.',
    rule: 'Event planning',
    timestamp: hoursAgo(4),
    urgency: 'normal',
  },
  {
    id: 'ins-12',
    colleagueId: 'frederick-blunst',
    type: 'email',
    title: 'Press interview request from Bloomberg',
    description: 'Request for 30-minute interview on industry trends.',
    rule: 'Media relations',
    timestamp: hoursAgo(7),
    urgency: 'normal',
  },
  {
    id: 'ins-13',
    colleagueId: 'frederick-blunst',
    type: 'document',
    title: 'Q1 report needs final approval',
    description: 'Finance team awaiting sign-off before distribution.',
    rule: 'Document workflow',
    timestamp: hoursAgo(1),
    urgency: 'urgent',
    badge: 'Decision needed',
  },
  {
    id: 'ins-14',
    colleagueId: 'personal',
    type: 'calendar',
    title: 'Reminder: Car service appointment tomorrow',
    description: 'Annual service at 9:00 AM.',
    rule: 'Personal calendar',
    timestamp: hoursAgo(10),
    urgency: 'normal',
  },
  {
    id: 'ins-15',
    colleagueId: 'personal',
    type: 'travel',
    title: 'Family vacation: Hotel confirmation needed',
    description: 'Reservation hold expires in 48 hours.',
    rule: 'Personal travel',
    timestamp: hoursAgo(5),
    urgency: 'normal',
  },
]

export function getInsightsByColleague(colleagueId: string): Insight[] {
  return insights.filter((i) => i.colleagueId === colleagueId)
}

export function getInsightById(id: string): Insight | undefined {
  return insights.find((i) => i.id === id)
}

export function getInsightCountByColleague(colleagueId: string): number {
  return insights.filter((i) => i.colleagueId === colleagueId).length
}

export function getAllInsightsSorted(): Insight[] {
  return [...insights].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

export function isNeedsAttention(insight: Insight): boolean {
  return insight.urgency === 'urgent' || insight.urgency === 'predicted-risk'
}

export function getNeedsAttentionCount(insightList: Insight[]): number {
  return insightList.filter(isNeedsAttention).length
}

export function getNeedsAttentionCountByColleague(colleagueId: string): number {
  return insights.filter((i) => i.colleagueId === colleagueId && isNeedsAttention(i)).length
}

export function getInsightsByColleagueAndTeam(colleagueId: string, team: string): Insight[] {
  return insights.filter((i) => i.colleagueId === colleagueId && i.team === team)
}

export function getNeedsAttentionCountByColleagueAndTeam(colleagueId: string, team: string): number {
  return getInsightsByColleagueAndTeam(colleagueId, team).filter(isNeedsAttention).length
}
