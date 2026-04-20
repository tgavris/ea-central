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
    description: 'John Thompson requested meeting dates for the Q1 strategy review and is awaiting Sarah\'s availability.',
    rule: 'Client correspondence rule',
    timestamp: hoursAgo(4),
    urgency: 'urgent',
    sources: [
      { label: 'Email 1', url: '#' },
      { label: 'Email 2', url: '#' },
    ],
    whyItMatters: 'Goldman Sachs is a Tier 1 client. The Q1 strategy review is time-sensitive — John Thompson proposed three dates in late April and needs confirmation before the board meeting.',
    whatItImpacts: 'Delayed response risks losing the preferred meeting window. The Q1 strategy review outcome feeds into Sarah\'s Q2 board prep and client relationship scoring.',
    actionStep: { description: 'Review draft reply and confirm Sarah\'s available slots', ctaLabel: 'Edit Draft' },
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
    whyItMatters: 'Board meetings require 48-hour advance confirmation. The Board Secretary needs Sarah\'s agenda item sign-off before Thursday EOD to finalise the pack.',
    whatItImpacts: 'Missing this deadline creates a downstream bottleneck for the Feb 17–18 prep block. Board communications are high-visibility and errors affect credibility.',
    actionStep: { description: 'Review and send confirmation to the Board Secretary', ctaLabel: 'Send Reply' },
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
    whyItMatters: 'The Acme Corp call (rescheduled from last week) and Sarah\'s recurring board prep block both land at 3 PM Thursday. Neither can be auto-resolved.',
    whatItImpacts: 'Acme Corp CEO is a Tier 1 client. Moving board prep past 4 PM risks Sarah\'s evening commitments and reduces preparation quality.',
    actionStep: { description: 'Review both events and select the resolution option', ctaLabel: 'View Conflict' },
    crossChannelContext: 'The Acme Corp call was originally scheduled last week but was postponed due to travel. Board prep is a recurring weekly meeting.',
    conflictSlots: [
      { title: 'Board Prep', time: '3:00 – 4:00 PM · Thu Feb 13', note: 'Recurring · Protected block', accent: 'blue' },
      { title: 'Acme Corp Call', time: '3:00 – 4:00 PM · Thu Feb 13', note: 'Rescheduled from last week', accent: 'orange' },
    ],
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
    whyItMatters: 'Sarah\'s passport expires Mar 18 — inside the 6-month validity window required by several Q2 travel destinations, including Singapore and the UAE.',
    whatItImpacts: 'Without renewal, Sarah risks being denied boarding on confirmed Q2 trips. Standard renewal takes 4–6 weeks; expedited is 2–3 weeks.',
    actionStep: { description: 'Initiate passport renewal and brief Sarah on timeline', ctaLabel: 'Start Renewal' },
  },
  {
    id: 'ins-5',
    colleagueId: 'sarah-chen',
    type: 'calendar',
    title: "CEO's office requesting urgent 1:1 — only opening overlaps Nomura prep",
    description: 'The CEO needs to discuss Q2 priorities before the all-hands meeting.',
    rule: 'Scheduling conflict rule',
    timestamp: minutesAgo(12),
    urgency: 'urgent',
    badge: 'Decision needed',
    whyItMatters: 'The CEO\'s office flagged this as urgent. The only available slot in both diaries is Thursday 2–3 PM, which directly overlaps Sarah\'s protected Nomura prep block.',
    whatItImpacts: 'Declining risks a high-visibility executive relationship. Accepting removes 60 minutes of prep time for a £34M partnership pitch the following morning.',
    actionStep: { description: 'Compare both commitments and choose a resolution', ctaLabel: 'Compare' },
    conflictSlots: [
      { title: "CEO 1:1", time: '2:00 – 3:00 PM · Thu Feb 13', note: 'Urgent request · CEO\'s office', accent: 'red' },
      { title: 'Nomura Prep', time: '2:00 – 3:00 PM · Thu Feb 13', note: 'Protected · £34M pitch tomorrow', accent: 'blue' },
    ],
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
    whyItMatters: 'BA289 has an 80% delay probability due to a North Atlantic storm system. Historical data shows similar storms produce 10–16 hour delays on this route.',
    whatItImpacts: 'Sarah has a client dinner in NYC tomorrow evening. A 14-hour delay means arrival past midnight — the dinner and any morning meetings would be at risk.',
    actionStep: { description: 'Review backup flight options and pre-book if needed', ctaLabel: 'View Alternatives' },
    crossChannelContext: 'Sarah has a client dinner scheduled for tomorrow evening in NYC. If the flight is delayed significantly, alternative arrangements may be needed.',
    alternatives: [
      {
        label: 'VS3  06:15 → 09:05  LHR → JFK',
        sublabel: 'Virgin Atlantic · departs 2h 25m earlier',
        detail: 'All 4 attendees available · On-time rate 94% · £892 · 4 seats remaining',
        recommended: true,
        ctaLabel: 'Book Backup Flight',
      },
      {
        label: 'Move Acme Corp meeting to virtual',
        sublabel: 'Teams / Zoom · no rebooking needed',
        detail: 'Notify NYC clients to join remotely — avoids flight change entirely',
        recommended: false,
        ctaLabel: 'Switch to Virtual',
      },
    ],
    nearbyOpportunities: [
      {
        name: 'David Park',
        company: 'JPMorgan Chase',
        relationship: 'Tier 1 client',
        suggestion: 'Client dinner',
        note: 'Last met 3 months ago · expressed interest in Q2 strategy session',
      },
      {
        name: 'Elena Vasquez',
        company: 'BlackRock',
        relationship: 'Prospective client',
        suggestion: 'Coffee meeting',
        note: 'Intro arranged via Michael Peterson · strong fit for Q3 engagement',
      },
    ],
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
    whyItMatters: 'McKinsey submitted the final proposal 3 days ago. No acknowledgement has been sent, which is outside James\'s standard 24-hour response norm.',
    whatItImpacts: 'Silence on a final proposal risks the engagement timeline slipping. McKinsey\'s team has a kickoff date pencilled in that may be reassigned.',
    actionStep: { description: 'Send acknowledgement and confirm James\'s review timeline', ctaLabel: 'Draft Reply' },
    suggestedResponse: `Dear McKinsey Team,

Thank you for sending through the final proposal. James has received it and will provide his feedback by end of this week.

We appreciate your patience and will be in touch shortly.

Best regards,
[Your name]
Executive Assistant to James Whitfield`,
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
    whyItMatters: '5 quarterly review documents are awaiting Adelina\'s signature and have been sitting in queue for over 48 hours.',
    whatItImpacts: 'Sign-off is required before the finance team can distribute the quarterly pack. Distribution is blocked until all documents are cleared.',
    actionStep: { description: 'Route documents to Adelina for review and signature', ctaLabel: 'Route for Sign-off' },
  },
  {
    id: 'ins-9',
    colleagueId: 'adelina-atara',
    type: 'email',
    title: 'Vendor contract renewal reminder',
    description: 'AWS contract expires in 30 days.',
    rule: 'Contract management rule',
    timestamp: hoursAgo(8),
    urgency: 'normal',
    whyItMatters: 'The AWS Enterprise contract expires in 30 days. Procurement requires a minimum of 21 days to process renewals and issue a new PO.',
    whatItImpacts: 'Lapsing the contract would cause a service interruption to 3 production workloads. Renewing now locks in current pricing before the rate increase in May.',
    actionStep: { description: 'Initiate renewal process with the procurement team', ctaLabel: 'Start Renewal' },
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
    whyItMatters: 'Adelina\'s Singapore trip departs in 9 business days. Singapore visa processing takes 5–7 business days — the application must be submitted today.',
    whatItImpacts: 'Missing the application window means the trip cannot proceed. The Singapore meetings involve two Tier 1 clients and cannot easily be rescheduled.',
    actionStep: { description: 'Submit visa application on Adelina\'s behalf today', ctaLabel: 'Apply Now' },
    nearbyOpportunities: [
      {
        name: 'James Tan',
        company: 'Temasek Holdings',
        relationship: 'Tier 1 client',
        suggestion: 'Executive dinner',
        note: 'Contract renewal due in Q3 · has not met Adelina in person since last year',
      },
      {
        name: 'Priya Nair',
        company: 'GIC Private Limited',
        relationship: 'Active prospect',
        suggestion: 'Lunch meeting',
        note: 'Warm intro from Frederick · ideal time to progress the conversation',
      },
    ],
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
    whyItMatters: 'The venue is holding two dates for the team offsite and needs a decision by Friday COB. After that, both options are released to other bookings.',
    whatItImpacts: 'Missing the deadline means restarting the venue search. The offsite has 22 attendees confirmed and a fixed Q2 budget allocation.',
    actionStep: { description: 'Confirm the preferred date with Frederick and notify venue', ctaLabel: 'Confirm Date' },
  },
  {
    id: 'ins-12',
    colleagueId: 'frederick-blunst',
    type: 'email',
    title: 'Press interview request from Bloomberg',
    description: 'Request for 30-minute interview on industry trends.',
    rule: 'Media relations rule',
    timestamp: hoursAgo(7),
    urgency: 'normal',
    whyItMatters: 'Bloomberg has requested a 30-minute interview with Frederick on industry trends. The request came via the PR team and has a 48-hour response window.',
    whatItImpacts: 'Declining without response could affect future press relationships. Accepting requires coordinating Frederick\'s schedule and a briefing note.',
    actionStep: { description: 'Flag to Frederick and draft a holding response', ctaLabel: 'Draft Response' },
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
    whyItMatters: 'The Q1 financial report is complete and requires Frederick\'s sign-off before the finance team distributes it to the board and senior leadership.',
    whatItImpacts: 'Distribution is time-sensitive — the board pack goes out at 5 PM today. Delays affect the entire board\'s preparation for Thursday\'s meeting.',
    actionStep: { description: 'Route the final report to Frederick for immediate sign-off', ctaLabel: 'Review & Approve' },
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
    whyItMatters: 'Annual car service is booked for tomorrow at 9:00 AM. The appointment was scheduled 6 weeks ago and has no same-day cancellation option.',
    whatItImpacts: 'The appointment overlaps with a team standup at 9:30 AM. A calendar block may be needed to avoid double-booking.',
    actionStep: { description: 'Confirm the appointment and block travel time in the calendar', ctaLabel: 'Confirm' },
  },
  {
    id: 'ins-15',
    colleagueId: 'personal',
    type: 'travel',
    title: 'Family vacation: Hotel confirmation needed',
    description: 'Reservation hold expires in 48 hours.',
    rule: 'Personal travel rule',
    timestamp: hoursAgo(5),
    urgency: 'normal',
    whyItMatters: 'The hotel reservation hold for the family vacation expires in 48 hours. Payment confirmation is required to secure the booking at the current rate.',
    whatItImpacts: 'Letting the hold lapse risks losing the room. The same hotel is showing no availability for the following weekend at any price.',
    actionStep: { description: 'Confirm the reservation before the hold expires', ctaLabel: 'Confirm Booking' },
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
