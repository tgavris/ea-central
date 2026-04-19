'use client'

import { useState, useRef } from 'react'
import {
  User,
  Bell,
  Bot,
  GitBranch,
  Palette,
  Database,
  ChevronDown,
  Download,
  Upload,
  RotateCcw,
  Keyboard,
  Clock,
  AlertTriangle,
  Sparkles,
  Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type Section = 'profile' | 'notifications' | 'ai-autonomy' | 'queue' | 'appearance' | 'data'

const SECTIONS: { id: Section; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'profile', label: 'Your Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'ai-autonomy', label: 'AI Autonomy', icon: Bot },
  { id: 'queue', label: 'Queue & Workflow', icon: GitBranch },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'data', label: 'Data & Export', icon: Database },
]

const PARTNER_COLORS = [
  '#1a56db', '#1c64f2', '#3f83f8', '#76a9fa', '#bfdbfe',
  '#111827', '#1f2937', '#374151', '#d97706', '#b45309',
  '#065f46', '#047857', '#e11d48', '#be185d', '#06b6d4', '#cffafe',
]

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('profile')

  const [displayName, setDisplayName] = useState('Alex Morgan')
  const [email] = useState('alex.morgan@mckinsey.com')
  const [role, setRole] = useState('Executive Assistant')

  const [notifCategories, setNotifCategories] = useState({
    p1decisions: true,
    checkItemsStale: true,
    coverageGaps: false,
  })
  const [deliveryChannels, setDeliveryChannels] = useState({
    inAppToasts: true,
    browserPush: false,
    quietHours: false,
  })
  const [emailDigest, setEmailDigest] = useState('Off')

  const [autoApproveThreshold, setAutoApproveThreshold] = useState(85)
  const [escalationBehavior, setEscalationBehavior] = useState('Hold for review')
  const [suggestionFrequency, setSuggestionFrequency] = useState('Balanced — default')
  const [domainOverrides, setDomainOverrides] = useState({
    scheduling: false,
    travel: false,
    communication: false,
    expenses: false,
  })

  const [workStart, setWorkStart] = useState('08:30 AM')
  const [workEnd, setWorkEnd] = useState('06:00 PM')
  const [timezone, setTimezone] = useState('Eastern (EST)')
  const [queueSorting, setQueueSorting] = useState('Time-sensitive first')
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true)

  const [partnerColors, setPartnerColors] = useState<Record<string, string>>({
    'sarah-chen': '#005FB8',
    'james-whitfield': '#00285C',
  })

  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})

  const scrollToSection = (id: Section) => {
    setActiveSection(id)
    const el = sectionRefs.current[id]
    const container = scrollContainerRef.current
    const header = headerRef.current
    if (el && container) {
      const headerHeight = header?.offsetHeight ?? 0
      const containerTop = container.getBoundingClientRect().top
      const elTop = el.getBoundingClientRect().top
      const offset = elTop - containerTop - headerHeight - 24 // 24px breathing room
      container.scrollBy({ top: offset, behavior: 'smooth' })
    }
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left sidebar — fixed height so it never scrolls away */}
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

      {/* Main content */}
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
        <header ref={headerRef} className="sticky top-0 z-10 bg-background border-b px-8 py-4">
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          <p className="text-sm text-muted-foreground">Profile, notifications, AI behavior, and data management</p>
        </header>

        <div className="px-8 py-6 space-y-10 max-w-2xl">

          {/* ── Your Profile ── */}
          <section ref={(el) => { sectionRefs.current['profile'] = el }}>
            <SectionTitle>Your Profile</SectionTitle>
            <Card>
              <CardSection title="Profile Information" icon={<User className="h-4 w-4 text-muted-foreground" />}>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Display Name">
                    <input
                      className="input-base"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </Field>
                  <Field label="Email">
                    <input className="input-base bg-muted/40 cursor-not-allowed" value={email} readOnly />
                  </Field>
                </div>
                <Field label="Role / Title" className="mt-3">
                  <input
                    className="input-base"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  />
                </Field>
                <p className="text-xs text-muted-foreground mt-3">
                  Assigned partners: <span className="text-foreground font-medium">Sarah Chen, James Whitfield</span>
                </p>
              </CardSection>
            </Card>
          </section>

          {/* ── Notifications ── */}
          <section ref={(el) => { sectionRefs.current['notifications'] = el }}>
            <SectionTitle>Notifications</SectionTitle>
            <div className="space-y-4">
              <Card>
                <CardSection title="Notification Categories" icon={<Bell className="h-4 w-4 text-muted-foreground" />}>
                  <p className="text-xs text-muted-foreground mb-3">
                    Sidebar badges are limited to pending input and P1 decisions. Toggle additional notification alerts below.
                  </p>
                  <div className="space-y-2">
                    {([
                      { key: 'p1decisions', label: 'P1 decisions' },
                      { key: 'checkItemsStale', label: 'CHECK items stale > 2 hours' },
                      { key: 'coverageGaps', label: 'Coverage gaps' },
                    ] as const).map(({ key, label }) => (
                      <label key={key} className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifCategories[key]}
                          onChange={() => setNotifCategories((p) => ({ ...p, [key]: !p[key] }))}
                          className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                        />
                        <span className="text-sm text-foreground">{label}</span>
                      </label>
                    ))}
                  </div>
                </CardSection>
              </Card>

              <Card>
                <CardSection title="Delivery Channels" icon={<Bell className="h-4 w-4 text-muted-foreground" />}>
                  <div className="divide-y">
                    <DeliveryRow
                      label="In-app toasts"
                      description="Show toast notifications in the bottom-right"
                      enabled={deliveryChannels.inAppToasts}
                      onToggle={() => setDeliveryChannels((p) => ({ ...p, inAppToasts: !p.inAppToasts }))}
                    />
                    <DeliveryRow
                      label="Browser push notifications"
                      description="Get notified even when the tab is in background"
                      enabled={deliveryChannels.browserPush}
                      onToggle={() => setDeliveryChannels((p) => ({ ...p, browserPush: !p.browserPush }))}
                    />
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-medium text-foreground">Email digest</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Receive a summary email at a set cadence</p>
                      </div>
                      <SelectField
                        value={emailDigest}
                        onChange={setEmailDigest}
                        options={['Off', 'Daily', 'Weekly']}
                        className="w-24"
                      />
                    </div>
                    <DeliveryRow
                      label="Quiet hours"
                      description="Suppress all notifications during these hours"
                      enabled={deliveryChannels.quietHours}
                      onToggle={() => setDeliveryChannels((p) => ({ ...p, quietHours: !p.quietHours }))}
                    />
                  </div>
                </CardSection>
              </Card>
            </div>
          </section>

          {/* ── AI Autonomy & Behavior ── */}
          <section ref={(el) => { sectionRefs.current['ai-autonomy'] = el }}>
            <SectionTitle>AI Autonomy &amp; Behavior</SectionTitle>
            <div className="space-y-4">

              <Card>
                <CardSection title="Auto-approve Threshold" icon={<Shield className="h-4 w-4 text-muted-foreground" />}>
                  <p className="text-xs text-muted-foreground mb-4">
                    CHECK items with a confidence score above this threshold will be highlighted for quick batch approval.
                    Higher values mean more items require manual review.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={autoApproveThreshold}
                        onChange={(e) => setAutoApproveThreshold(Number(e.target.value))}
                        className="flex-1 accent-primary h-1.5 cursor-pointer"
                      />
                      <span className="text-sm font-semibold text-foreground w-10 text-right">
                        {autoApproveThreshold}%
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] text-muted-foreground px-0.5">
                      <span>More autonomous</span>
                      <span>More cautious</span>
                    </div>
                  </div>
                </CardSection>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardSection
                    title="Escalation Behavior"
                    icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
                  >
                    <p className="text-xs text-muted-foreground mb-3">How STOP and edge-case items are handled.</p>
                    <SelectField
                      value={escalationBehavior}
                      onChange={setEscalationBehavior}
                      options={['Hold for review', 'Escalate immediately', 'Auto-resolve']}
                      className="w-full"
                    />
                  </CardSection>
                </Card>
                <Card>
                  <CardSection
                    title="Suggestion Frequency"
                    icon={<Sparkles className="h-4 w-4 text-muted-foreground" />}
                  >
                    <p className="text-xs text-muted-foreground mb-3">How actively the AI surfaces suggestions.</p>
                    <SelectField
                      value={suggestionFrequency}
                      onChange={setSuggestionFrequency}
                      options={['Balanced — default', 'High frequency', 'Low frequency', 'Off']}
                      className="w-full"
                    />
                  </CardSection>
                </Card>
              </div>

              <Card>
                <CardSection
                  title="Domain-Level Overrides"
                  icon={<Shield className="h-4 w-4 text-muted-foreground" />}
                >
                  <p className="text-xs text-muted-foreground mb-3">
                    Override AI auto-approve behavior per domain. When disabled, the global threshold above applies.
                  </p>
                  <div className="divide-y">
                    {(Object.keys(domainOverrides) as Array<keyof typeof domainOverrides>).map((key) => (
                      <div key={key} className="flex items-center justify-between py-2.5">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={domainOverrides[key]}
                            onChange={() => setDomainOverrides((p) => ({ ...p, [key]: !p[key] }))}
                            className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                          />
                          <span className="text-sm text-foreground capitalize">{key}</span>
                        </label>
                        <span className="text-xs text-muted-foreground">
                          {domainOverrides[key] ? 'Custom threshold' : 'Using global threshold'}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardSection>
              </Card>
            </div>
          </section>

          {/* ── Queue & Workflow ── */}
          <section ref={(el) => { sectionRefs.current['queue'] = el }}>
            <SectionTitle>Queue &amp; Workflow</SectionTitle>
            <div className="space-y-4">

              <Card>
                <CardSection title="Working Hours" icon={<Clock className="h-4 w-4 text-muted-foreground" />}>
                  <p className="text-xs text-muted-foreground mb-3">Items arriving outside these hours will be flagged.</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Start</span>
                      <input
                        type="text"
                        value={workStart}
                        onChange={(e) => setWorkStart(e.target.value)}
                        className="input-base w-28 text-center"
                      />
                    </div>
                    <span className="text-muted-foreground">—</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">End</span>
                      <input
                        type="text"
                        value={workEnd}
                        onChange={(e) => setWorkEnd(e.target.value)}
                        className="input-base w-28 text-center"
                      />
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-xs text-muted-foreground">Timezone</span>
                      <SelectField
                        value={timezone}
                        onChange={setTimezone}
                        options={['Eastern (EST)', 'Pacific (PST)', 'Central (CST)', 'GMT', 'CET']}
                        className="w-36"
                      />
                    </div>
                  </div>
                </CardSection>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardSection title="Queue Sorting" icon={<GitBranch className="h-4 w-4 text-muted-foreground" />}>
                    <p className="text-xs text-muted-foreground mb-3">Default sort order for the Pending Input queue.</p>
                    <SelectField
                      value={queueSorting}
                      onChange={setQueueSorting}
                      options={['Time-sensitive first', 'Newest first', 'Oldest first', 'Priority']}
                      className="w-full"
                    />
                  </CardSection>
                </Card>

                <Card>
                  <CardSection
                    title="Keyboard Shortcuts"
                    icon={<Keyboard className="h-4 w-4 text-muted-foreground" />}
                    action={
                      <Toggle enabled={keyboardShortcuts} onChange={() => setKeyboardShortcuts((p) => !p)} />
                    }
                  >
                    <p className="text-xs text-muted-foreground mb-3">Hotkeys for the Pending Input queue.</p>
                    <div className="space-y-1.5">
                      {[
                        { key: 'Enter', action: 'Approve' },
                        { key: 'R', action: 'Reject' },
                        { key: 'E', action: 'Escalate' },
                        { key: 'N / P', action: 'Next / Previous item' },
                      ].map(({ key, action }) => (
                        <div key={key} className="flex items-center justify-between">
                          <kbd className="text-[11px] font-mono bg-muted border border-border rounded px-1.5 py-0.5">
                            {key}
                          </kbd>
                          <span className="text-xs text-muted-foreground">{action}</span>
                        </div>
                      ))}
                    </div>
                  </CardSection>
                </Card>
              </div>
            </div>
          </section>

          {/* ── Appearance ── */}
          <section ref={(el) => { sectionRefs.current['appearance'] = el }}>
            <SectionTitle>Appearance</SectionTitle>
            <Card>
              <CardSection title="Partner Colors" icon={<Palette className="h-4 w-4 text-muted-foreground" />}>
                <p className="text-xs text-muted-foreground mb-4">
                  Customize accent colors for each partner across the dashboard.
                </p>
                <div className="space-y-4">
                  {[
                    { id: 'sarah-chen', name: 'Sarah Chen' },
                    { id: 'james-whitfield', name: 'James Whitfield' },
                  ].map(({ id, name }) => (
                    <div key={id} className="flex items-center gap-3">
                      <div
                        className="h-9 w-9 rounded-full shrink-0 border border-border"
                        style={{ backgroundColor: partnerColors[id] }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{name}</p>
                        <p className="text-[11px] text-muted-foreground uppercase font-mono">
                          {partnerColors[id]}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-wrap">
                        {PARTNER_COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => setPartnerColors((p) => ({ ...p, [id]: color }))}
                            className={cn(
                              'h-5 w-5 rounded-full border transition-transform hover:scale-110',
                              partnerColors[id] === color ? 'ring-2 ring-offset-1 ring-primary border-transparent' : 'border-transparent'
                            )}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardSection>
            </Card>
          </section>

          {/* ── Data & Export ── */}
          <section ref={(el) => { sectionRefs.current['data'] = el }}>
            <SectionTitle>Data &amp; Export</SectionTitle>
            <Card>
              <CardSection title="Manage Settings" icon={<Database className="h-4 w-4 text-muted-foreground" />}>
                <p className="text-xs text-muted-foreground mb-4">
                  Export, import, or reset your configuration. Useful for onboarding a new EA or syncing across devices.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <button className="flex items-center gap-1.5 text-sm border rounded-md px-3 py-1.5 hover:bg-muted transition-colors text-foreground">
                    <Download className="h-3.5 w-3.5" />
                    Export Settings
                  </button>
                  <button className="flex items-center gap-1.5 text-sm border rounded-md px-3 py-1.5 hover:bg-muted transition-colors text-foreground">
                    <Upload className="h-3.5 w-3.5" />
                    Import Settings
                  </button>
                  <button className="flex items-center gap-1.5 text-sm border rounded-md px-3 py-1.5 hover:bg-muted transition-colors text-foreground">
                    <Download className="h-3.5 w-3.5" />
                    Export Automations Data
                  </button>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <button className="flex items-center gap-1.5 text-sm text-destructive hover:underline font-medium">
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset to Defaults
                  </button>
                </div>
              </CardSection>
            </Card>
          </section>

          <div className="pb-8" />
        </div>
      </div>

      {/* Inline styles for shared primitives */}
      <style jsx global>{`
        .input-base {
          width: 100%;
          border: 1px solid hsl(var(--border) / 1);
          border-radius: 0.5rem;
          padding: 0.375rem 0.625rem;
          font-size: 0.875rem;
          line-height: 1.5;
          background: hsl(var(--background) / 1);
          color: hsl(var(--foreground) / 1);
          outline: none;
          transition: border-color 0.15s;
        }
        .input-base:focus {
          border-color: hsl(var(--ring) / 1);
          box-shadow: 0 0 0 2px hsl(var(--ring) / 0.2);
        }
      `}</style>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-foreground mb-3">{children}</h2>
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="border rounded-xl overflow-hidden bg-card">{children}</div>
}

function CardSection({
  title,
  icon,
  action,
  children,
}: {
  title: string
  icon?: React.ReactNode
  action?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        {action}
      </div>
      {children}
    </div>
  )
}

function Field({
  label,
  children,
  className,
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="block text-xs text-muted-foreground mb-1">{label}</label>
      {children}
    </div>
  )
}

function SelectField({
  value,
  onChange,
  options,
  className,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'w-full appearance-none border border-border rounded-md px-2.5 py-1.5 pr-7 text-sm bg-background text-foreground cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-ring'
        )}
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
    </div>
  )
}

function DeliveryRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string
  description: string
  enabled: boolean
  onToggle: () => void
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Toggle enabled={enabled} onChange={onToggle} />
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
