'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Plus,
  Edit,
  Check,
  X,
  Mail,
  Phone,
  Smartphone,
  Building2,
  Linkedin,
  MapPin,
  Briefcase,
  LayoutGrid,
  AlertCircle,
  Star,
  RefreshCw,
  Calendar,
  FileText,
  Sparkles,
  ChevronRight,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { contacts, getContactsByPartner, type Contact } from '@/lib/data/contacts'

const partners = [
  { id: 'sarah-chen', name: 'Sarah Chen', initials: 'SC' },
  { id: 'james-whitfield', name: 'James Whitfield', initials: 'JW' },
]

function groupByLastName(list: Contact[]): Record<string, Contact[]> {
  const groups: Record<string, Contact[]> = {}
  const sorted = [...list].sort((a, b) => a.lastName.localeCompare(b.lastName))
  for (const contact of sorted) {
    const letter = contact.lastName[0].toUpperCase()
    if (!groups[letter]) groups[letter] = []
    groups[letter].push(contact)
  }
  return groups
}

export default function ContactsPage() {
  const [activePartnerId, setActivePartnerId] = useState('sarah-chen')
  const [selectedId, setSelectedId] = useState<string>('tom-bradley')
  const [search, setSearch] = useState('')
  const [needsAttentionOnly, setNeedsAttentionOnly] = useState(false)

  const allContacts = getContactsByPartner(activePartnerId)
  const needsAttentionCount = contacts.filter((c) => c.needsAttention).length

  const filtered = useMemo(() => {
    return allContacts.filter((c) => {
      const fullName = `${c.firstName} ${c.lastName}`.toLowerCase()
      const matchesSearch =
        search === '' ||
        fullName.includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.company.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = !needsAttentionOnly || c.needsAttention
      return matchesSearch && matchesFilter
    })
  }, [allContacts, search, needsAttentionOnly])

  const grouped = groupByLastName(filtered)
  const selected = contacts.find((c) => c.id === selectedId) ?? contacts[0]

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left panel */}
      <div className="w-72 shrink-0 flex flex-col border-r bg-background overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 border-b shrink-0">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h1 className="text-base font-semibold text-foreground shrink-0">Contacts</h1>
            <button className="flex items-center gap-1 text-xs font-medium text-primary border border-primary/30 rounded-md px-2 py-1 hover:bg-primary/5 transition-colors whitespace-nowrap shrink-0">
              <Plus className="h-3 w-3" />
              New contact
            </button>
          </div>

          {/* View by partner */}
          <div className="flex items-center gap-1.5 mb-3">
            <span className="text-[11px] text-muted-foreground shrink-0">Partner:</span>
            <div className="flex gap-1 min-w-0">
              {partners.map((p) => {
                const count = getContactsByPartner(p.id).length
                const isActive = activePartnerId === p.id
                return (
                  <button
                    key={p.id}
                    onClick={() => setActivePartnerId(p.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap',
                      isActive
                        ? 'bg-muted text-foreground border border-border'
                        : 'text-muted-foreground hover:bg-muted/60 border border-transparent'
                    )}
                  >
                    <span className="h-4 w-4 rounded-full bg-muted-foreground/20 text-[9px] font-bold text-foreground/70 flex items-center justify-center shrink-0">
                      {p.initials}
                    </span>
                    <span>{p.name.split(' ')[0]} {p.name.split(' ')[1].charAt(0)}.</span>
                    <span className="text-[10px] text-muted-foreground">{count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-muted rounded-md pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Needs attention filter */}
          <button
            onClick={() => setNeedsAttentionOnly((v) => !v)}
            className={cn(
              'flex items-center justify-between w-full px-2.5 py-1.5 rounded-md text-xs transition-colors border',
              needsAttentionOnly
                ? 'bg-muted border-border text-foreground'
                : 'bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/60'
            )}
          >
            <span className="flex items-center gap-1.5">
              <AlertCircle className="h-3.5 w-3.5" />
              Needs attention
            </span>
            <span className="text-[11px] font-medium bg-muted-foreground/15 text-muted-foreground px-1.5 py-0.5 rounded-full">
              {needsAttentionCount}
            </span>
          </button>
        </div>

        {/* Contact list */}
        <div className="flex-1 overflow-y-auto">
          {Object.keys(grouped).length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">No contacts found</div>
          ) : (
            Object.entries(grouped).map(([letter, items]) => (
              <div key={letter}>
                <div className="px-4 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50 sticky top-0">
                  {letter}
                </div>
                {items.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedId(c.id)}
                    className={cn(
                      'w-full text-left px-4 py-2.5 border-b border-border/50 flex items-center gap-3 transition-colors',
                      selectedId === c.id ? 'bg-muted' : 'hover:bg-muted/50'
                    )}
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-[11px] font-bold text-white shrink-0">
                      {c.firstName[0]}{c.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-medium text-foreground truncate">
                          {c.lastName}, {c.firstName}
                        </span>
                        {c.starred && <Star className="h-3 w-3 text-muted-foreground fill-muted-foreground/40 shrink-0" />}
                      </div>
                      <span className="text-[11px] text-muted-foreground truncate block">{c.email}</span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {c.needsAttention && <AlertCircle className="h-3.5 w-3.5 text-muted-foreground" />}
                      {selectedId === c.id && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
                    </div>
                  </button>
                ))}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right panel */}
      {selected ? (
        <ContactDetail contact={selected} />
      ) : (
        <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
          Select a contact to view details
        </div>
      )}
    </div>
  )
}

function ContactDetail({ contact }: { contact: Contact }) {
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<number>>(new Set())
  const [confirmedSuggested, setConfirmedSuggested] = useState(false)
  const [dismissedSuggested, setDismissedSuggested] = useState(false)

  const visibleAlerts = (contact.alerts ?? []).filter((_, i) => !dismissedAlerts.has(i))

  return (
    <div className="flex-1 overflow-y-auto bg-background">
      {/* Contact header */}
      <div className="sticky top-0 z-10 bg-background border-b px-8 py-4">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-lg font-bold text-white shrink-0">
            {contact.firstName[0]}{contact.lastName[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-semibold text-foreground">{contact.firstName} {contact.lastName}</h1>
            <p className="text-sm text-muted-foreground">{contact.title} · {contact.company}</p>
            {contact.address && (
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {contact.address}
              </p>
            )}
          </div>
          <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground border rounded-md px-3 py-1.5 hover:bg-muted transition-colors shrink-0">
            <Edit className="h-3.5 w-3.5" />
            Edit
          </button>
        </div>
      </div>

      <div className="px-8 py-5 space-y-5">
        {/* Suggested from Outlook banner */}
        {contact.suggestedFromOutlook && !confirmedSuggested && !dismissedSuggested && (
          <div className="flex items-center justify-between gap-3 bg-muted border border-border rounded-lg px-4 py-2.5">
            <span className="flex items-center gap-2 text-xs text-foreground font-medium">
              <Sparkles className="h-3.5 w-3.5 text-muted-foreground" />
              Suggested from Outlook interaction history
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setConfirmedSuggested(true)}
                className="flex items-center gap-1 text-xs font-medium text-foreground border border-border rounded px-2 py-1 hover:bg-background transition-colors"
              >
                <Check className="h-3 w-3" /> Confirm
              </button>
              <button
                onClick={() => setDismissedSuggested(true)}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground border rounded px-2 py-1 hover:bg-background transition-colors"
              >
                <X className="h-3 w-3" /> Dismiss
              </button>
            </div>
          </div>
        )}

        {/* AI Alerts */}
        {visibleAlerts.map((alert, i) => (
          <div
            key={i}
            className="border border-border rounded-lg overflow-hidden"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/50">
              <RefreshCw className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-foreground">{alert.label}</span>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-medium text-foreground line-through opacity-50">{alert.from}</span>
                <ChevronRight className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">{alert.to}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Detected from {alert.type === 'company_changed' ? 'Email signature' : 'Email signature'} · {alert.confidence} confidence · {alert.detectedAt}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 px-4 py-2 border-t bg-muted/30">
              <button
                onClick={() => setDismissedAlerts((prev) => new Set([...prev, i]))}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted"
              >
                Dismiss
              </button>
              <button className="flex items-center gap-1 text-xs font-medium text-foreground border border-border rounded px-2 py-1 hover:bg-muted transition-colors">
                <Check className="h-3 w-3" /> Update
              </button>
            </div>
          </div>
        ))}

        {/* Contact details grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <div className="space-y-3">
            {contact.email && (
              <DetailRow icon={<Mail className="h-3.5 w-3.5" />} label="Email">
                <a href={`mailto:${contact.email}`} className="text-foreground hover:underline">{contact.email}</a>
              </DetailRow>
            )}
            {contact.workPhone && (
              <DetailRow icon={<Phone className="h-3.5 w-3.5" />} label="Work phone">
                <span>{contact.workPhone}</span>
              </DetailRow>
            )}
            {contact.mobile && (
              <DetailRow icon={<Smartphone className="h-3.5 w-3.5" />} label="Mobile">
                <span>{contact.mobile}</span>
              </DetailRow>
            )}
            {contact.office && (
              <DetailRow icon={<Building2 className="h-3.5 w-3.5" />} label="Office">
                <span>{contact.office}</span>
              </DetailRow>
            )}
            {contact.linkedIn && (
              <DetailRow icon={<Linkedin className="h-3.5 w-3.5" />} label="LinkedIn">
                <a href={contact.linkedIn} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">
                  View profile ↗
                </a>
              </DetailRow>
            )}
          </div>
          <div className="space-y-3">
            {contact.company && (
              <DetailRow icon={<Building2 className="h-3.5 w-3.5" />} label="Company">
                <span>{contact.company}</span>
              </DetailRow>
            )}
            {contact.title && (
              <DetailRow icon={<Briefcase className="h-3.5 w-3.5" />} label="Title">
                <span>{contact.title}</span>
              </DetailRow>
            )}
            {contact.department && (
              <DetailRow icon={<LayoutGrid className="h-3.5 w-3.5" />} label="Department">
                <span>{contact.department}</span>
              </DetailRow>
            )}
            {contact.address && (
              <DetailRow icon={<MapPin className="h-3.5 w-3.5" />} label="Address">
                <span>{contact.address}</span>
              </DetailRow>
            )}
          </div>
        </div>

        {/* AI Insights */}
        {contact.relationshipBrief && (
          <section className="border rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30">
              <div className="flex items-center gap-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span className="text-sm font-semibold text-foreground">AI Insights</span>
                <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded">Auto-generated</span>
              </div>
              <span className="text-[11px] text-muted-foreground">Refreshed 3 hours ago</span>
            </div>

            <div className="px-4 py-4">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Relationship Brief</p>
              <p className="text-sm text-foreground leading-relaxed mb-4">{contact.relationshipBrief}</p>

              {contact.keyTopics && contact.keyTopics.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1.5">Key topics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {contact.keyTopics.map((t) => (
                      <span key={t} className="text-xs bg-muted text-muted-foreground border border-border rounded-full px-2.5 py-0.5">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {contact.basedOn && contact.basedOn.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Based on</p>
                  <div className="space-y-1.5">
                    {contact.basedOn.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="text-muted-foreground mt-0.5 shrink-0">
                          {item.icon === 'email' && <Mail className="h-3.5 w-3.5" />}
                          {item.icon === 'calendar' && <Calendar className="h-3.5 w-3.5" />}
                          {item.icon === 'linkedin' && <Linkedin className="h-3.5 w-3.5" />}
                          {item.icon === 'note' && <FileText className="h-3.5 w-3.5" />}
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Next interaction */}
        {contact.nextInteraction && (
          <section className="border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b">
              <span className="text-sm font-semibold text-foreground">Next interaction</span>
            </div>
            <div className="px-4 py-3">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{contact.nextInteraction.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {contact.nextInteraction.date}{' '}
                    <span className="text-foreground font-medium">· in {contact.nextInteraction.daysAway} days</span>
                  </p>
                </div>
              </div>
              {contact.nextInteraction.warning && (
                <div className="flex items-center gap-2 bg-muted border border-border rounded-lg px-3 py-2 mt-2">
                  <AlertCircle className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <p className="text-xs text-muted-foreground">{contact.nextInteraction.warning}</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Shared network */}
        {contact.sharedNetwork && contact.sharedNetwork.length > 0 && (
          <section className="border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b">
              <span className="text-sm font-semibold text-foreground">Shared network</span>
            </div>
            <div className="divide-y">
              {contact.sharedNetwork.map((person, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3">
                  <div className={cn('h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0', person.avatarColor)}>
                    {person.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground">{person.name}</span>
                      <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full border bg-muted text-muted-foreground border-border">
                        {person.strength}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">{person.description}</p>
                  </div>
                  <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recent activity */}
        {contact.recentActivity && (
          <section className="border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b">
              <span className="text-sm font-semibold text-foreground">Recent activity</span>
            </div>
            <div className="grid grid-cols-3 divide-x">
              <div className="px-4 py-4 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mb-1">
                  <Mail className="h-3 w-3" />
                  Emails (30d)
                </div>
                <p className="text-2xl font-bold text-foreground">{contact.recentActivity.emails30d}</p>
              </div>
              <div className="px-4 py-4 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mb-1">
                  <Calendar className="h-3 w-3" />
                  Meetings (30d)
                </div>
                <p className="text-2xl font-bold text-foreground">{contact.recentActivity.meetings30d}</p>
              </div>
              <div className="px-4 py-4 text-center">
                <div className="flex items-center justify-center gap-1 text-[11px] text-muted-foreground mb-1">
                  <RefreshCw className="h-3 w-3" />
                  Last Interaction
                </div>
                <p className="text-sm font-semibold text-foreground">{contact.recentActivity.lastInteraction}</p>
              </div>
            </div>
          </section>
        )}

        {/* Notes */}
        {contact.notes && (
          <section className="border rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b">
              <span className="text-sm font-semibold text-foreground">Notes</span>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-muted-foreground">{contact.notes}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function DetailRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-muted-foreground mt-0.5 shrink-0">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide leading-none mb-0.5">{label}</p>
        <div className="text-xs text-foreground">{children}</div>
      </div>
    </div>
  )
}
