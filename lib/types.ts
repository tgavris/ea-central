export type Colleague = {
  id: string
  name: string
  teams?: string[]
}

export type InsightType = 'email' | 'calendar' | 'travel' | 'document'
export type InsightUrgency = 'normal' | 'urgent' | 'predicted-risk'

export type Insight = {
  id: string
  colleagueId: string
  type: InsightType
  title: string
  description: string
  rule: string
  timestamp: Date
  urgency: InsightUrgency
  badge?: 'Decision needed' | 'Predicted risk'
  sources?: { label: string; url: string }[]
  suggestedResponse?: string
  crossChannelContext?: string
}

export type TodoStatus = 'todo' | 'in-progress' | 'done' | 'snoozed'
export type TodoSpeed = 'quick' | 'medium' | 'long'
export type TodoUrgency = 'high' | 'medium' | 'low'
export type TodoViewBy = 'status' | 'speed' | 'urgency'

export type TodoItem = {
  id: string
  colleagueId: string
  title: string
  description: string
  source: 'insight' | 'inbox'
  sourceId: string
  status: TodoStatus
  speed: TodoSpeed
  urgency: TodoUrgency
  createdAt: Date
  metadata: Record<string, unknown>
}

export type EmailMessage = {
  id: string
  from: string
  fromName: string
  to: string
  timestamp: Date
  body: string
}

export type InboxItem = {
  id: string
  colleagueId: string
  subject: string
  from: string
  fromName: string
  preview: string
  timestamp: Date
  unread?: boolean
  thread: EmailMessage[]
}
