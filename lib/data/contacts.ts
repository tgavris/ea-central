export type ContactAlert = {
  type: 'company_changed' | 'title_changed'
  label: string
  from: string
  to: string
  confidence: 'High' | 'Medium' | 'Low'
  detectedAt: string
}

export type SharedNetworkEntry = {
  name: string
  initials: string
  avatarColor: string
  strength: 'strong' | 'moderate' | 'weak'
  description: string
}

export type Contact = {
  id: string
  partnerId: string
  firstName: string
  lastName: string
  email: string
  workPhone?: string
  mobile?: string
  office?: string
  linkedIn?: string
  company: string
  title: string
  department?: string
  address?: string
  needsAttention?: boolean
  starred?: boolean
  suggestedFromOutlook?: boolean
  alerts?: ContactAlert[]
  relationshipBrief?: string
  keyTopics?: string[]
  basedOn?: { icon: 'email' | 'calendar' | 'linkedin' | 'note'; text: string }[]
  nextInteraction?: {
    title: string
    date: string
    daysAway: number
    warning?: string
  }
  sharedNetwork?: SharedNetworkEntry[]
  recentActivity?: {
    emails30d: number
    meetings30d: number
    lastInteraction: string
  }
  notes?: string
}

export const contacts: Contact[] = [
  {
    id: 'tom-bradley',
    partnerId: 'sarah-chen',
    firstName: 'Tom',
    lastName: 'Bradley',
    email: 'tom.bradley@acmecorp.com',
    workPhone: '+1 (415) 555-0431',
    mobile: '+1 (415) 555-0402',
    office: 'Acme Tower / Floor 50',
    linkedIn: 'https://linkedin.com/in/tombradley',
    company: 'Acme Corp',
    title: 'CFO',
    department: 'Finance',
    address: 'San Francisco, CA',
    needsAttention: true,
    suggestedFromOutlook: true,
    alerts: [
      {
        type: 'company_changed',
        label: 'Company may have changed',
        from: 'Acme Corp',
        to: 'Acme Global Industries',
        confidence: 'High',
        detectedAt: 'Feb 20, 2026',
      },
      {
        type: 'title_changed',
        label: 'Title may have changed',
        from: 'CFO',
        to: 'CEO',
        confidence: 'High',
        detectedAt: 'Feb 25, 2026',
      },
    ],
    relationshipBrief:
      'Tom is the key sponsor for the Acme Transformation Program. Phase 1 wrapped successfully and Phase 2 scoping is underway. Tom has been pushing for accelerated timelines. His steering committee meets weekly on Wednesdays.',
    keyTopics: [
      'Transformation Program Phase 2',
      'Accelerated timeline request',
      'Steering committee prep',
    ],
    basedOn: [
      { icon: 'email', text: '15 emails in last 30 days · Phase 2 scoping, timeline acceleration requests' },
      { icon: 'calendar', text: '2 meetings in last 30 days · Steering committee calls' },
      { icon: 'linkedin', text: 'LinkedIn profile · Recently updated to CEO, Acme Global Industries' },
      { icon: 'note', text: 'EA desk note · "Key stakeholder for Transformation Program" — added by Alex Morgan' },
    ],
    nextInteraction: {
      title: 'Acme Steering Committee',
      date: 'Mar 6, 2026',
      daysAway: 6,
      warning: "Significant gap — you usually meet weekly but it's been 20 days",
    },
    sharedNetwork: [
      {
        name: 'David Park',
        initials: 'DP',
        avatarColor: 'bg-purple-500',
        strength: 'moderate',
        description: "CC'd together on Acme engagement emails",
      },
      {
        name: 'Amanda Liu',
        initials: 'AL',
        avatarColor: 'bg-blue-500',
        strength: 'weak',
        description: 'Both attended Acme advisory session',
      },
    ],
    recentActivity: {
      emails30d: 15,
      meetings30d: 2,
      lastInteraction: 'Feb 6, 2026',
    },
    notes: 'Key stakeholder for Transformation Program engagement.',
  },
  {
    id: 'margaret-chen',
    partnerId: 'sarah-chen',
    firstName: 'Margaret',
    lastName: 'Chen',
    email: 'margaret.chen@gmail.com',
    company: 'Independent',
    title: 'Board Advisor',
    address: 'New York, NY',
    relationshipBrief:
      'Margaret is a longtime board advisor and personal connection of Sarah. She provides strategic counsel on governance matters and has introductions across the financial services sector.',
    keyTopics: ['Board governance', 'Financial services introductions', 'Advisory sessions'],
    basedOn: [
      { icon: 'email', text: '4 emails in last 30 days · Governance updates, meeting follow-ups' },
      { icon: 'calendar', text: '1 meeting in last 30 days · Quarterly advisory call' },
    ],
    nextInteraction: {
      title: 'Quarterly Advisory Call',
      date: 'Mar 15, 2026',
      daysAway: 15,
    },
    sharedNetwork: [
      {
        name: 'Tom Bradley',
        initials: 'TB',
        avatarColor: 'bg-orange-500',
        strength: 'weak',
        description: 'Both on Acme advisory board',
      },
    ],
    recentActivity: {
      emails30d: 4,
      meetings30d: 1,
      lastInteraction: 'Feb 14, 2026',
    },
    notes: 'Personal connection — handle with care on formal communications.',
  },
  {
    id: 'amanda-liu',
    partnerId: 'sarah-chen',
    firstName: 'Amanda',
    lastName: 'Liu',
    email: 'amanda.liu@deloitte.com',
    workPhone: '+1 (212) 555-0188',
    office: 'Deloitte NYC / Floor 32',
    linkedIn: 'https://linkedin.com/in/amandaliucfo',
    company: 'Deloitte',
    title: 'Partner, CFO Advisory',
    department: 'Financial Advisory',
    address: 'New York, NY',
    starred: true,
    relationshipBrief:
      "Amanda leads Deloitte's CFO Advisory practice and is a close professional contact of Sarah from their time together on the FSB advisory panel. She frequently co-presents at industry conferences.",
    keyTopics: ['CFO Advisory benchmarking', 'FSB panel coordination', 'Conference co-presentation'],
    basedOn: [
      { icon: 'email', text: '8 emails in last 30 days · Conference logistics, FSB briefings' },
      { icon: 'calendar', text: '3 meetings in last 30 days · Panel prep sessions' },
      { icon: 'linkedin', text: 'LinkedIn profile · Recently posted on CFO trends 2026' },
    ],
    nextInteraction: {
      title: 'FSB Panel Pre-brief',
      date: 'Mar 10, 2026',
      daysAway: 10,
    },
    sharedNetwork: [
      {
        name: 'Tom Bradley',
        initials: 'TB',
        avatarColor: 'bg-orange-500',
        strength: 'moderate',
        description: 'Both attended Acme advisory session',
      },
    ],
    recentActivity: {
      emails30d: 8,
      meetings30d: 3,
      lastInteraction: 'Feb 18, 2026',
    },
    notes: "Key collaboration partner for the FSB panel. Sarah wants to deepen this relationship ahead of the April conference.",
  },
  {
    id: 'david-park',
    partnerId: 'james-whitfield',
    firstName: 'David',
    lastName: 'Park',
    email: 'david.park@mckinsey.com',
    workPhone: '+1 (212) 555-0299',
    office: 'McKinsey NYC / 55 E 52nd St',
    linkedIn: 'https://linkedin.com/in/davidparkmc',
    company: 'McKinsey & Company',
    title: 'Partner',
    department: 'Strategy & Corporate Finance',
    address: 'New York, NY',
    relationshipBrief:
      "David is the lead McKinsey partner on James's current transformation engagement. The relationship is active and high-frequency. David has been escalating on timeline and is a key decision-maker for contract renewal.",
    keyTopics: ['Transformation engagement', 'Contract renewal', 'Q1 deliverables'],
    basedOn: [
      { icon: 'email', text: '22 emails in last 30 days · Engagement updates, escalations' },
      { icon: 'calendar', text: '5 meetings in last 30 days · Weekly syncs, steering committee' },
      { icon: 'note', text: 'EA desk note · "Relationship critical for renewal decision in June" — added by Alex Morgan' },
    ],
    nextInteraction: {
      title: 'Weekly Engagement Sync',
      date: 'Mar 5, 2026',
      daysAway: 5,
    },
    sharedNetwork: [
      {
        name: 'Tom Bradley',
        initials: 'TB',
        avatarColor: 'bg-orange-500',
        strength: 'moderate',
        description: "CC'd together on Acme engagement emails",
      },
    ],
    recentActivity: {
      emails30d: 22,
      meetings30d: 5,
      lastInteraction: 'Feb 27, 2026',
    },
    notes: 'High-priority relationship. Flag all inbound same-day.',
  },
  {
    id: 'robert-tanaka',
    partnerId: 'james-whitfield',
    firstName: 'Robert',
    lastName: 'Tanaka',
    email: 'robert.tanaka@boardco.com',
    workPhone: '+44 20 7555 0142',
    office: 'BoardCo London / Canary Wharf',
    linkedIn: 'https://linkedin.com/in/roberttanaka',
    company: 'BoardCo',
    title: 'Managing Director',
    department: 'Board Practice',
    address: 'London, UK',
    relationshipBrief:
      "Robert runs the board practice at BoardCo and has been a trusted advisor to James for five years. He is a key reference contact for non-executive director searches and sits on three FTSE 250 boards.",
    keyTopics: ['NED search mandates', 'Board composition advisory', 'Remuneration committee prep'],
    basedOn: [
      { icon: 'email', text: '6 emails in last 30 days · NED shortlists, reference checks' },
      { icon: 'calendar', text: '1 meeting in last 30 days · NED search update call' },
      { icon: 'linkedin', text: 'LinkedIn profile · Recent board appointment announced' },
    ],
    nextInteraction: {
      title: 'NED Search Update Call',
      date: 'Mar 12, 2026',
      daysAway: 12,
    },
    sharedNetwork: [
      {
        name: 'Jennifer Walsh',
        initials: 'JW',
        avatarColor: 'bg-emerald-500',
        strength: 'weak',
        description: 'Both on the same remuneration committee',
      },
    ],
    recentActivity: {
      emails30d: 6,
      meetings30d: 1,
      lastInteraction: 'Feb 20, 2026',
    },
    notes: 'Long-standing trusted advisor. Always respond within 24 hours.',
  },
  {
    id: 'jennifer-walsh',
    partnerId: 'james-whitfield',
    firstName: 'Jennifer',
    lastName: 'Walsh',
    email: 'jennifer.walsh@gs.com',
    workPhone: '+1 (212) 555-0371',
    mobile: '+1 (917) 555-0084',
    office: 'Goldman Sachs / 200 West St',
    linkedIn: 'https://linkedin.com/in/jenniferwalshgs',
    company: 'Goldman Sachs',
    title: 'Managing Director, Investment Banking',
    department: 'Investment Banking',
    address: 'New York, NY',
    needsAttention: true,
    alerts: [
      {
        type: 'title_changed',
        label: 'Title may have changed',
        from: 'Managing Director, Investment Banking',
        to: 'Partner & Co-Head, TMT Banking',
        confidence: 'High',
        detectedAt: 'Feb 22, 2026',
      },
    ],
    relationshipBrief:
      "Jennifer leads Goldman's TMT banking coverage and is a key contact for James on financing mandates. She has referred two deals in the past 18 months. The relationship has been quieter recently — last interaction was 3 weeks ago.",
    keyTopics: ['TMT financing mandates', 'Deal pipeline', 'Referral network'],
    basedOn: [
      { icon: 'email', text: '3 emails in last 30 days · Deal pipeline check-in' },
      { icon: 'calendar', text: '0 meetings in last 30 days' },
      { icon: 'linkedin', text: 'LinkedIn profile · Promoted to Co-Head, TMT Banking (Feb 2026)' },
    ],
    nextInteraction: {
      title: 'Catch-up call',
      date: 'Mar 8, 2026',
      daysAway: 8,
      warning: "Relationship cooling — no meeting in 3 weeks, down from weekly cadence",
    },
    sharedNetwork: [
      {
        name: 'Robert Tanaka',
        initials: 'RT',
        avatarColor: 'bg-teal-600',
        strength: 'weak',
        description: 'Both on the same remuneration committee',
      },
    ],
    recentActivity: {
      emails30d: 3,
      meetings30d: 0,
      lastInteraction: 'Feb 7, 2026',
    },
    notes: 'Important deal referrer. Schedule a catch-up before end of March.',
  },
]

export function getContactsByPartner(partnerId: string): Contact[] {
  return contacts.filter((c) => c.partnerId === partnerId)
}

export function getContactById(id: string): Contact | undefined {
  return contacts.find((c) => c.id === id)
}

export function getNeedsAttentionContacts(): Contact[] {
  return contacts.filter((c) => c.needsAttention)
}
