'use client'

import { useState, useRef } from 'react'
import {
  Mail,
  Calendar,
  Plane,
  FileText,
  Bell,
  User,
  Edit,
  Check,
  ChevronRight,
  Zap,
  Globe,
  MessageSquare,
  Video,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type RuleStatus = 'active' | 'paused' | 'pending'

type Rule = {
  id: string
  title: string
  description: string
  trigger: string
  status: RuleStatus
  category: 'email' | 'calendar' | 'travel' | 'document'
  partnerId?: string
}

const rules: Rule[] = [
  // Email rules
  {
    id: 'r-email-1',
    title: 'Client correspondence rule',
    description: 'Draft suggested replies for emails from key clients within 4 hours. Flag if no draft exists after 2 hours.',
    trigger: 'Incoming email from contact tagged as "Client"',
    status: 'active',
    category: 'email',
  },
  {
    id: 'r-email-2',
    title: 'Board communication rule',
    description: 'Escalate all board-level correspondence immediately. Suggest formal reply templates.',
    trigger: 'Email from or to board member contacts',
    status: 'active',
    category: 'email',
  },
  {
    id: 'r-email-3',
    title: 'Media relations rule',
    description: 'Flag incoming press/journalist requests and suggest holding response. Do not auto-reply.',
    trigger: 'Email from known media domain or containing keywords: interview, press, journalist',
    status: 'active',
    category: 'email',
  },
  {
    id: 'r-email-4',
    title: 'Contract management rule',
    description: 'Alert when contract-related emails are received. Add to to-do with 48-hour deadline.',
    trigger: 'Email containing keywords: contract, renewal, agreement, sign-off',
    status: 'paused',
    category: 'email',
  },
  // Calendar rules
  {
    id: 'r-cal-1',
    title: 'External meeting reschedule',
    description: "Suggest reschedule when two external meetings overlap on a partner's calendar. Prioritise client meetings.",
    trigger: 'Calendar conflict detected with at least one external attendee',
    status: 'active',
    category: 'calendar',
  },
  {
    id: 'r-cal-2',
    title: 'Leadership review blocks',
    description: 'Automatically protect 2-hour prep blocks before any board or executive committee meetings.',
    trigger: 'Meeting with title containing: board, ExCo, leadership review, steering committee',
    status: 'active',
    category: 'calendar',
  },
  {
    id: 'r-cal-3',
    title: 'Client Transformation Program',
    description: 'Reserve weekly Wednesday 2pm slot for Acme steering committee. Decline conflicts automatically.',
    trigger: 'Any invite to the Wednesday 2pm recurring slot',
    status: 'active',
    category: 'calendar',
    partnerId: 'sarah-chen',
  },
  {
    id: 'r-cal-4',
    title: 'Schedule gap alerts',
    description: 'Alert when a key contact has not been met in longer than the usual cadence. Propose new slot.',
    trigger: 'No meeting with a starred contact in the past 14 days',
    status: 'active',
    category: 'calendar',
  },
  // Travel rules
  {
    id: 'r-travel-1',
    title: 'Travel document rule',
    description: 'Alert when passport expiry is within 6 months and travel is booked. Suggest renewal.',
    trigger: 'Passport expiry date within 180 days AND upcoming international travel',
    status: 'active',
    category: 'travel',
  },
  {
    id: 'r-travel-2',
    title: 'Flight monitoring',
    description: 'Monitor live flight status for all booked travel. Alert if delay exceeds 45 minutes.',
    trigger: 'Flight departure within 24 hours',
    status: 'active',
    category: 'travel',
  },
  {
    id: 'r-travel-3',
    title: 'Personal travel rule',
    description: 'Manage personal travel bookings and reminders separately from business travel.',
    trigger: 'Calendar event tagged Personal with travel keywords',
    status: 'paused',
    category: 'travel',
  },
  // Document rules
  {
    id: 'r-doc-1',
    title: 'Document workflow',
    description: 'Alert when documents are awaiting sign-off for more than 24 hours. Escalate after 48 hours.',
    trigger: 'Document shared with partner but unopened after 24 hours',
    status: 'active',
    category: 'document',
  },
  {
    id: 'r-doc-2',
    title: 'Personal calendar',
    description: 'Keep personal and professional calendar events separate. Flag scheduling conflicts.',
    trigger: 'Personal calendar event overlapping with work commitment',
    status: 'active',
    category: 'document',
  },
]

type Integration = {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  connected: boolean
  connectedAs?: string
}

const STATUS_CONFIG: Record<RuleStatus, { label: string; className: string; dotClass: string }> = {
  active: {
    label: 'Active',
    className: 'bg-muted text-foreground border-border',
    dotClass: 'bg-green-500',
  },
  paused: {
    label: 'Paused',
    className: 'bg-muted text-muted-foreground border-border',
    dotClass: 'bg-amber-400',
  },
  pending: {
    label: 'Pending',
    className: 'bg-muted text-muted-foreground border-border',
    dotClass: 'bg-muted-foreground/40',
  },
}

type PrefSection = 'profile' | 'rules' | 'notifications' | 'integrations'

const SECTIONS: { id: PrefSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'profile', label: 'EA Profile', icon: User },
  { id: 'rules', label: 'Automation Rules', icon: Zap },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Globe },
]

const CATEGORY_CONFIG = {
  email: { label: 'Email rules', icon: Mail, color: 'text-blue-500' },
  calendar: { label: 'Calendar rules', icon: Calendar, color: 'text-violet-500' },
  travel: { label: 'Travel rules', icon: Plane, color: 'text-emerald-500' },
  document: { label: 'Document rules', icon: FileText, color: 'text-orange-500' },
}

export default function PreferencesPage() {
  const [ruleStatuses, setRuleStatuses] = useState<Record<string, RuleStatus>>(
    Object.fromEntries(rules.map((r) => [r.id, r.status]))
  )
  const [notifications, setNotifications] = useState({
    inApp: true,
    emailDigest: true,
    slackDm: false,
    urgentOnly: false,
  })
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    outlook: true,
    slack: true,
    zoom: false,
    google: false,
  })

  const [activeSection, setActiveSection] = useState<PrefSection>('profile')
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const scrollToSection = (id: PrefSection) => {
    setActiveSection(id)
    const el = sectionRefs.current[id]
    const container = scrollContainerRef.current
    const header = headerRef.current
    if (el && container) {
      const headerHeight = header?.offsetHeight ?? 0
      const containerTop = container.getBoundingClientRect().top
      const elTop = el.getBoundingClientRect().top
      const offset = elTop - containerTop - headerHeight - 24
      container.scrollBy({ top: offset, behavior: 'smooth' })
    }
  }

  const toggleRule = (id: string) => {
    setRuleStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === 'active' ? 'paused' : 'active',
    }))
  }

  const categories = ['email', 'calendar', 'travel', 'document'] as const

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left nav */}
      <aside className="w-48 shrink-0 border-r bg-background py-6 overflow-y-auto">
        <p className="px-4 mb-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sections</p>
        <nav className="space-y-0.5 px-2">
          {SECTIONS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={cn(
                'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors text-left',
                activeSection === id
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Scrollable right pane */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto"
        onScroll={() => {
          const headerHeight = headerRef.current?.offsetHeight ?? 0
          const threshold = headerHeight + 32
          const ids = SECTIONS.map((s) => s.id)
          for (let i = ids.length - 1; i >= 0; i--) {
            const el = sectionRefs.current[ids[i]]
            if (el) {
              const rect = el.getBoundingClientRect()
              if (rect.top <= threshold) {
                setActiveSection(ids[i])
                break
              }
            }
          }
        }}
      >
      <header ref={headerRef} className="sticky top-0 z-10 bg-background border-b shrink-0">
        <div className="px-8 py-4">
          <h1 className="text-lg font-semibold text-foreground">Preferences</h1>
          <p className="text-sm text-muted-foreground">Configure your EA Central settings and automation rules</p>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-8 py-6 space-y-8">

        {/* A. EA Profile */}
        <section ref={(el) => { sectionRefs.current['profile'] = el }}>
          <SectionHeader letter="A" title="EA Profile" />
          <div className="border rounded-xl overflow-hidden">
            <div className="flex items-start gap-4 p-5 border-b">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
                AM
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-sm font-semibold text-foreground">Alex Morgan</h3>
                  <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">EA</span>
                </div>
                <p className="text-xs text-muted-foreground">alex.morgan@mckinsey.com</p>
                <p className="text-xs text-muted-foreground mt-0.5">McKinsey &amp; Company · London, GMT+1</p>
              </div>
              <button className="flex items-center gap-1.5 text-xs text-muted-foreground border rounded-md px-3 py-1.5 hover:bg-muted transition-colors">
                <Edit className="h-3.5 w-3.5" />
                Edit
              </button>
            </div>

            <div className="divide-y">
              <ProfileRow label="Role" value="Executive Assistant" />
              <ProfileRow label="Timezone" value="Europe/London (GMT+1)" />
              <ProfileRow label="Working hours" value="Mon–Fri, 8:00 AM – 6:30 PM" />
              <ProfileRow label="Partners managed">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-medium bg-muted text-foreground border border-border px-2 py-0.5 rounded-full">
                    <span className="h-3.5 w-3.5 rounded-full bg-primary text-[8px] text-primary-foreground flex items-center justify-center font-bold">S</span>
                    Sarah Chen
                  </span>
                  <span className="flex items-center gap-1 text-xs font-medium bg-muted text-foreground border border-border px-2 py-0.5 rounded-full">
                    <span className="h-3.5 w-3.5 rounded-full bg-primary text-[8px] text-primary-foreground flex items-center justify-center font-bold">J</span>
                    James Whitfield
                  </span>
                </div>
              </ProfileRow>
            </div>

            <div className="px-5 py-3 bg-muted border-t border-border flex items-start gap-2">
              <Info className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Partner-specific experience is enabled. Rules and insights are personalised for each partner you manage.
              </p>
            </div>
          </div>
        </section>

        {/* B. Automation Rules */}
        <section ref={(el) => { sectionRefs.current['rules'] = el }}>
          <SectionHeader letter="B" title="Automation Rules" />
          <div className="space-y-5">
            {categories.map((cat) => {
              const config = CATEGORY_CONFIG[cat]
              const catRules = rules.filter((r) => r.category === cat)
              const Icon = config.icon
              return (
                <div key={cat} className="border rounded-xl overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
                    <Icon className={cn('h-4 w-4', config.color)} />
                    <span className="text-sm font-semibold text-foreground">{config.label}</span>
                    <span className="ml-auto text-[11px] text-muted-foreground">
                      {catRules.filter((r) => ruleStatuses[r.id] === 'active').length}/{catRules.length} active
                    </span>
                  </div>
                  <div className="divide-y">
                    {catRules.map((rule) => {
                      const status = ruleStatuses[rule.id]
                      const sc = STATUS_CONFIG[status]
                      return (
                        <div key={rule.id} className="px-4 py-3.5">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              <span className={cn('h-2 w-2 rounded-full shrink-0 mt-1.5', sc.dotClass)} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                  <span className="text-sm font-medium text-foreground">{rule.title}</span>
                                  <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full border', sc.className)}>
                                    {sc.label}
                                  </span>
                                  {rule.partnerId && (
                                    <span className="text-[10px] font-medium bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded-full">
                                      Sarah Chen
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">{rule.description}</p>
                                <p className="text-[11px] text-muted-foreground/70 mt-1">
                                  <span className="font-medium">Trigger:</span> {rule.trigger}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 mt-0.5">
                              <button className="text-[11px] text-primary hover:underline">Edit</button>
                              <Toggle
                                enabled={status === 'active'}
                                onChange={() => toggleRule(rule.id)}
                              />
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="px-4 py-2.5 border-t bg-muted/20">
                    <button className="flex items-center gap-1.5 text-xs text-primary hover:underline font-medium">
                      <Zap className="h-3 w-3" />
                      Add rule
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* C. Notifications */}
        <section ref={(el) => { sectionRefs.current['notifications'] = el }}>
          <SectionHeader letter="C" title="Notifications" />
          <div className="border rounded-xl divide-y overflow-hidden">
            <NotifRow
              icon={<Bell className="h-4 w-4 text-blue-500" />}
              label="In-app notifications"
              description="Show alerts and insights in the EA Central sidebar"
              enabled={notifications.inApp}
              onChange={() => setNotifications((n) => ({ ...n, inApp: !n.inApp }))}
            />
            <NotifRow
              icon={<Mail className="h-4 w-4 text-violet-500" />}
              label="Daily email digest"
              description="Receive a summary of pending actions and insights each morning at 8:00 AM"
              enabled={notifications.emailDigest}
              onChange={() => setNotifications((n) => ({ ...n, emailDigest: !n.emailDigest }))}
            />
            <NotifRow
              icon={<MessageSquare className="h-4 w-4 text-emerald-500" />}
              label="Slack DMs"
              description="Send urgent alerts directly to your Slack account"
              enabled={notifications.slackDm}
              onChange={() => setNotifications((n) => ({ ...n, slackDm: !n.slackDm }))}
            />
            <NotifRow
              icon={<Bell className="h-4 w-4 text-amber-500" />}
              label="Urgent-only mode"
              description="Only surface notifications flagged as urgent or predicted risk"
              enabled={notifications.urgentOnly}
              onChange={() => setNotifications((n) => ({ ...n, urgentOnly: !n.urgentOnly }))}
            />
          </div>
        </section>

        {/* D. Integrations */}
        <section ref={(el) => { sectionRefs.current['integrations'] = el }}>
          <SectionHeader letter="D" title="Integrations" />
          <div className="border rounded-xl divide-y overflow-hidden">
            <IntegrationRow
              icon={<div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center"><Mail className="h-4 w-4 text-white" /></div>}
              name="Microsoft Outlook"
              description="Sync email and calendar. AI reads your inbox to surface insights."
              connected={integrations.outlook}
              connectedAs="alex.morgan@mckinsey.com"
              onToggle={() => setIntegrations((i) => ({ ...i, outlook: !i.outlook }))}
            />
            <IntegrationRow
              icon={<div className="h-8 w-8 rounded bg-[#4a154b] flex items-center justify-center"><MessageSquare className="h-4 w-4 text-white" /></div>}
              name="Slack"
              description="Read channel messages and DMs relevant to your partners. Send alerts."
              connected={integrations.slack}
              connectedAs="@alex.morgan · McKinsey & Co workspace"
              onToggle={() => setIntegrations((i) => ({ ...i, slack: !i.slack }))}
            />
            <IntegrationRow
              icon={<div className="h-8 w-8 rounded bg-blue-500 flex items-center justify-center"><Video className="h-4 w-4 text-white" /></div>}
              name="Zoom"
              description="Automatically create Zoom links for scheduled video meetings."
              connected={integrations.zoom}
              onToggle={() => setIntegrations((i) => ({ ...i, zoom: !i.zoom }))}
            />
            <IntegrationRow
              icon={<div className="h-8 w-8 rounded bg-white border flex items-center justify-center"><Globe className="h-4 w-4 text-red-500" /></div>}
              name="Google Workspace"
              description="Alternative to Microsoft 365. Sync Gmail and Google Calendar."
              connected={integrations.google}
              onToggle={() => setIntegrations((i) => ({ ...i, google: !i.google }))}
            />
          </div>
        </section>

        <div className="pb-8" />
      </main>
      </div>
    </div>
  )
}

function SectionHeader({ letter, title }: { letter: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="h-5 w-5 rounded bg-muted text-[11px] font-bold text-muted-foreground flex items-center justify-center shrink-0">
        {letter}
      </span>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
    </div>
  )
}

function ProfileRow({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center px-5 py-2.5 gap-4">
      <span className="text-xs text-muted-foreground w-36 shrink-0">{label}</span>
      {children ?? <span className="text-xs text-foreground">{value}</span>}
    </div>
  )
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
        enabled ? 'bg-primary' : 'bg-muted-foreground/30'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
          enabled ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  )
}

function NotifRow({
  icon,
  label,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  description: string
  enabled: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5">
      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  )
}

function IntegrationRow({
  icon,
  name,
  description,
  connected,
  connectedAs,
  onToggle,
}: {
  icon: React.ReactNode
  name: string
  description: string
  connected: boolean
  connectedAs?: string
  onToggle: () => void
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-4">
      <div className="shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium text-foreground">{name}</p>
          {connected && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded-full">
              <Check className="h-2.5 w-2.5" />
              Connected
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {connected && connectedAs && (
          <p className="text-[11px] text-muted-foreground/70 mt-0.5">{connectedAs}</p>
        )}
      </div>
      <div className="shrink-0">
        {connected ? (
          <button
            onClick={onToggle}
            className="text-xs text-muted-foreground border rounded-md px-3 py-1.5 hover:bg-muted transition-colors"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="flex items-center gap-1 text-xs font-medium text-primary border border-primary/30 rounded-md px-3 py-1.5 hover:bg-primary/5 transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
            Connect
          </button>
        )}
      </div>
    </div>
  )
}
