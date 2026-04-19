'use client'

import { useState, useRef } from 'react'
import { Upload, ImageIcon, FileText, Clock, Tag, Hash, Mail, Search, Star, Reply, Forward, MoreHorizontal, Paperclip, Send, Smile, AtSign, Bold, Italic, Link2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type ScreenshotType = 'slack' | 'outlook' | 'uploaded'

type Clipping = {
  id: string
  filename: string
  uploadedAt: string
  source: string
  tags: string[]
  screenshotType: ScreenshotType
  imageSrc?: string
  transcript: string
}

const MOCK_CLIPPINGS: Clipping[] = [
  {
    id: 'c1',
    filename: 'acme-board-update.png',
    uploadedAt: 'Today, 09:14 AM',
    source: 'Slack · #acme-corp',
    tags: ['Acme Corp', 'Board', 'Sarah Chen'],
    screenshotType: 'slack',
    transcript: `Board Update — Acme Corp Transformation\n\nChannel: #acme-corp\nPosted by: Tom Bradley\nDate: April 19, 2026 · 09:08 AM\n\n"Following yesterday's steering committee, the board has approved Phase 2 of the transformation roadmap. Key milestones:\n\n• Cost optimisation target raised to $120M (up from $95M)\n• Digital infrastructure workstream to begin Q3\n• External advisor review scheduled for May 12\n• Next all-hands: April 28 @ 10:00 AM EST\n\nPlease ensure all workstream leads have submitted their updated plans by EOD Friday."\n\nReactions: 👍 ×4  ✅ ×3  🎯 ×2\n\nSarah Chen replied [09:11 AM]: "Thanks Tom — Alex, can you block May 12 and prep the pre-read pack?"\n\nAI Note: Tom referenced the May 12 advisor review — consider blocking Sarah's calendar and coordinating pre-reading materials.`,
  },
  {
    id: 'c2',
    filename: 'q2-offsite-logistics.png',
    uploadedAt: 'Yesterday, 3:47 PM',
    source: 'Outlook · Inbox',
    tags: ['Offsite', 'Calendar', 'James Whitfield'],
    screenshotType: 'outlook',
    transcript: `Q2 Leadership Offsite — Logistics Confirmed\n\nFrom: Events Team <events@mckinsey.com>\nTo: James Whitfield <j.whitfield@mckinsey.com>; Alex Morgan <a.morgan@mckinsey.com>\nDate: April 18, 2026 · 3:41 PM\nSubject: [CONFIRMED] Q2 Leadership Offsite — May 6–7, Miami\n\nHi team,\n\nPlease find the confirmed logistics for the Q2 Leadership Offsite below:\n\n  Date: May 6–7, 2026\n  Venue: The Biltmore, Coral Gables, FL\n  Check-in: May 6 @ 2:00 PM\n  Dinner: May 6 @ 7:30 PM (required attendance)\n  Sessions: May 7 @ 8:30 AM – 5:00 PM\n\nFlight recommendations have been shared separately. Ground transport will be arranged from MIA.\n\nPlease confirm dietary requirements by April 25.\n\nBest,\nEvents & Logistics Team\nMcKinsey & Company\n\nAI Note: James has a conflict on May 6 AM — flight booking needed before April 22 to get preferred seats.`,
  },
  {
    id: 'c3',
    filename: 'contract-renewal-thread.png',
    uploadedAt: 'Apr 17, 11:02 AM',
    source: 'Slack · #legal-ops',
    tags: ['Contract', 'Legal', 'Urgent'],
    screenshotType: 'slack',
    transcript: `Contract Renewal — Vendor MSA Discussion\n\nChannel: #legal-ops\nParticipants: Rachel Kim (Legal), David Osei (Procurement), Alex Morgan\nDate: April 17, 2026\n\nRachel Kim [10:44 AM]:\n"The MSA with DataBridge expires May 31. We need sign-off from the partner before the 30-day notice window closes. Current terms are attached."\n\nDavid Osei [10:51 AM]:\n"Procurement is ready. We're proposing a 15% reduction on the SaaS tier — DataBridge has indicated they'll accept. Just need partner approval."\n\nAlex Morgan [11:02 AM]:\n"Got it — I'll flag this to Sarah and add it to her review queue. Can you send the redlined version to me directly?"\n\nAI Note: Deadline is May 1 for the 30-day notice. This should be added as a high-urgency to-do for Sarah Chen.`,
  },
  {
    id: 'c4',
    filename: 'james-travel-approval.png',
    uploadedAt: 'Apr 16, 08:30 AM',
    source: 'Outlook · Sent',
    tags: ['Travel', 'James Whitfield', 'Approval'],
    screenshotType: 'outlook',
    transcript: `Travel Approval Request — Tokyo Client Visit\n\nFrom: Alex Morgan <a.morgan@mckinsey.com>\nTo: Travel Desk <travel@mckinsey.com>\nCC: James Whitfield <j.whitfield@mckinsey.com>\nDate: April 16, 2026 · 8:24 AM\nSubject: Travel Approval — JW Tokyo May 19–22\n\nHi Travel Desk,\n\nPlease process the following travel for Partner James Whitfield:\n\n  Trip: Tokyo Client Visit — Nomura Holdings\n  Departure: May 19, 2026 (LHR → NRT, Business)\n  Return: May 22, 2026 (NRT → LHR, Business)\n  Hotel: The Peninsula Tokyo (May 19–22)\n  Ground: Nippon Limousine both ways\n\nPurpose: Relationship management and Q2 business review with Nomura leadership. Pre-approved under client engagement budget.\n\nPlease confirm once booked. James prefers window seats.\n\nThanks,\nAlex Morgan\nExecutive Assistant to James Whitfield\n\nAI Note: Visa check required — UK passport, Japan entry. No visa needed for <90 days.`,
  },
  {
    id: 'c5',
    filename: 'sarah-chen-dm-prep.png',
    uploadedAt: 'Apr 15, 5:19 PM',
    source: 'Slack · DM · Sarah Chen',
    tags: ['Sarah Chen', 'Prep', 'Meeting'],
    screenshotType: 'slack',
    transcript: `Direct Message — Sarah Chen & Alex Morgan\n\nDate: April 15, 2026\n\nSarah Chen [5:02 PM]:\n"Alex — quick heads up, the Nomura call tomorrow moved to 8 AM. Can you update the invite and resend to the right people? Also need the Q1 deck prepped and sent to Kenji by 7 AM."\n\nAlex Morgan [5:09 PM]:\n"On it — updating the calendar invite now. Will send the revised deck to Kenji Yamamoto (k.yamamoto@nomura.com) by 7 AM. Anything to add to the agenda?"\n\nSarah Chen [5:14 PM]:\n"Add a 10-min slot for the JV discussion — I'll handle that part. Also flag James in case he wants to join."\n\nAlex Morgan [5:19 PM]:\n"Done ✓ — invite updated, James flagged, deck in progress. I'll send you a preview by 10 PM."\n\nSarah Chen [5:20 PM]:\n"Perfect, thanks 🙏"\n\nAI Note: Deck for Nomura Q1 review should be ready for Sarah's sign-off tonight. Kenji Yamamoto added to contact watchlist.`,
  },
]

// ─── Mock screenshot renderers ────────────────────────────────────────────────

function SlackScreenshot({ clip }: { clip: Clipping }) {
  const isChannel = clip.source.includes('#')
  const channelName = clip.source.split('·')[1]?.trim() ?? 'general'
  const isDM = clip.source.includes('DM')

  type SlackMsg = { user: string; initials: string; color: string; time: string; text: string; reactions?: string[]; replies?: string[] }

  const messages: Record<string, SlackMsg[]> = {
    c1: [
      { user: 'Tom Bradley', initials: 'TB', color: '#1e40af', time: '9:08 AM', text: 'Following yesterday\'s steering committee, the board has approved Phase 2 of the transformation roadmap. Key milestones:\n\n• Cost optimisation target raised to $120M\n• Digital infrastructure workstream to begin Q3\n• External advisor review scheduled for May 12\n• Next all-hands: April 28 @ 10:00 AM EST\n\nPlease ensure all workstream leads have submitted updated plans by EOD Friday.', reactions: ['👍 4', '✅ 3', '🎯 2'] },
      { user: 'Sarah Chen', initials: 'SC', color: '#005FB8', time: '9:11 AM', text: 'Thanks Tom — Alex, can you block May 12 and prep the pre-read pack?' },
      { user: 'Alex Morgan', initials: 'AM', color: '#7c3aed', time: '9:14 AM', text: 'On it! I\'ll get the May 12 block on your calendar and start pulling the pre-read together. 📅' },
    ],
    c3: [
      { user: 'Rachel Kim', initials: 'RK', color: '#be185d', time: '10:44 AM', text: 'The MSA with DataBridge expires May 31. We need sign-off from the partner before the 30-day notice window closes. Current terms attached 📎', reactions: ['👀 2'] },
      { user: 'David Osei', initials: 'DO', color: '#065f46', time: '10:51 AM', text: 'Procurement is ready. We\'re proposing a 15% reduction on the SaaS tier — DataBridge has indicated they\'ll accept. Just need partner approval.' },
      { user: 'Alex Morgan', initials: 'AM', color: '#7c3aed', time: '11:02 AM', text: 'Got it — I\'ll flag this to Sarah and add it to her review queue. Can you send the redlined version to me directly?' },
    ],
    c5: [
      { user: 'Sarah Chen', initials: 'SC', color: '#005FB8', time: '5:02 PM', text: 'Alex — quick heads up, the Nomura call tomorrow moved to 8 AM. Can you update the invite and resend to the right people? Also need the Q1 deck prepped and sent to Kenji by 7 AM.' },
      { user: 'Alex Morgan', initials: 'AM', color: '#7c3aed', time: '5:09 PM', text: 'On it — updating the calendar invite now. Will send the revised deck to Kenji Yamamoto by 7 AM. Anything to add to the agenda?' },
      { user: 'Sarah Chen', initials: 'SC', color: '#005FB8', time: '5:14 PM', text: 'Add a 10-min slot for the JV discussion — I\'ll handle that part. Also flag James in case he wants to join.' },
      { user: 'Alex Morgan', initials: 'AM', color: '#7c3aed', time: '5:19 PM', text: 'Done ✓ — invite updated, James flagged, deck in progress. I\'ll send you a preview by 10 PM.' },
      { user: 'Sarah Chen', initials: 'SC', color: '#005FB8', time: '5:20 PM', text: 'Perfect, thanks 🙏' },
    ],
  }

  const msgs = messages[clip.id] ?? messages['c1']

  return (
    <div className="rounded-xl border overflow-hidden bg-white dark:bg-zinc-900 text-sm font-sans shadow-sm">
      {/* Slack top bar */}
      <div className="bg-[#3f0e40] px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-[#5a195a] rounded px-10 py-0.5 text-[11px] text-white/60 flex items-center gap-1.5">
            <Search className="h-2.5 w-2.5" />
            McKinsey &amp; Company
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar strip */}
        <div className="w-40 bg-[#3f0e40] text-white/70 text-[11px] py-3 px-3 shrink-0 space-y-3">
          <p className="text-white font-semibold text-xs truncate">McKinsey</p>
          {['# general', '# announcements', channelName.startsWith('#') ? channelName : `# ${channelName.replace('DM · ', '')}`].map((ch, i) => (
            <div key={i} className={cn('rounded px-1.5 py-1 truncate', i === 2 ? 'bg-white/20 text-white' : '')}>{ch}</div>
          ))}
          <div className="pt-1 border-t border-white/10">
            <p className="text-white/50 text-[10px] mb-1">Direct messages</p>
            {['Sarah Chen', 'James Whitfield', 'Alex Morgan'].map((n) => (
              <div key={n} className="flex items-center gap-1.5 py-0.5">
                <div className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
                <span className="truncate text-[11px]">{n.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Main area */}
        <div className="flex-1 bg-white dark:bg-zinc-900 min-w-0">
          {/* Channel header */}
          <div className="border-b px-4 py-2.5 flex items-center gap-2">
            {isDM ? (
              <div className="h-5 w-5 rounded-full bg-[#005FB8] flex items-center justify-center text-[9px] text-white font-bold">SC</div>
            ) : (
              <Hash className="h-3.5 w-3.5 text-zinc-500" />
            )}
            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
              {isDM ? 'Sarah Chen' : channelName.replace('#', '').replace('DM · ', '')}
            </span>
            <span className="ml-auto flex items-center gap-2 text-zinc-400">
              <Search className="h-3.5 w-3.5" />
              <AtSign className="h-3.5 w-3.5" />
            </span>
          </div>

          {/* Messages */}
          <div className="px-4 py-3 space-y-4 bg-white dark:bg-zinc-900">
            <p className="text-[10px] text-zinc-400 text-center">April 19, 2026</p>
            {msgs.map((msg, i) => (
              <div key={i} className="flex gap-2.5 group">
                <div
                  className="h-7 w-7 rounded-lg shrink-0 flex items-center justify-center text-[10px] text-white font-bold mt-0.5"
                  style={{ backgroundColor: msg.color }}
                >
                  {msg.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className="text-[12px] font-bold text-zinc-900 dark:text-zinc-100">{msg.user}</span>
                    <span className="text-[10px] text-zinc-400">{msg.time}</span>
                  </div>
                  <p className="text-[12px] text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">{msg.text}</p>
                  {msg.reactions && (
                    <div className="flex gap-1 mt-1.5">
                      {msg.reactions.map((r) => (
                        <span key={r} className="text-[11px] bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 rounded-full px-1.5 py-0.5">{r}</span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Compose bar */}
          <div className="border-t px-3 py-2 bg-white dark:bg-zinc-900">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-1.5 flex items-center gap-2">
              <span className="text-[11px] text-zinc-400 flex-1">
                Message {isDM ? 'Sarah Chen' : channelName}
              </span>
              <div className="flex gap-2 text-zinc-400">
                <Bold className="h-3 w-3" />
                <Italic className="h-3 w-3" />
                <Link2 className="h-3 w-3" />
                <Paperclip className="h-3 w-3" />
                <Smile className="h-3 w-3" />
                <Send className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function OutlookScreenshot({ clip }: { clip: Clipping }) {
  type OutlookEmail = {
    from: string; fromEmail: string; initials: string; color: string;
    to: string; subject: string; date: string; body: string[];
  }

  const emails: Record<string, OutlookEmail> = {
    c2: {
      from: 'Events Team',
      fromEmail: 'events@mckinsey.com',
      initials: 'ET',
      color: '#0078d4',
      to: 'James Whitfield; Alex Morgan',
      subject: '[CONFIRMED] Q2 Leadership Offsite — May 6–7, Miami',
      date: 'April 18, 2026 · 3:41 PM',
      body: [
        'Hi team,',
        'Please find the confirmed logistics for the Q2 Leadership Offsite below:',
        '📍 Venue: The Biltmore, Coral Gables, FL\n📅 Date: May 6–7, 2026\n🕑 Check-in: May 6 @ 2:00 PM\n🍽️ Dinner: May 6 @ 7:30 PM (required attendance)\n📋 Sessions: May 7 @ 8:30 AM – 5:00 PM',
        'Flight recommendations have been shared separately. Ground transport will be arranged from MIA.',
        'Please confirm dietary requirements by April 25.',
        'Best,\nEvents & Logistics Team\nMcKinsey & Company',
      ],
    },
    c4: {
      from: 'Alex Morgan',
      fromEmail: 'a.morgan@mckinsey.com',
      initials: 'AM',
      color: '#7c3aed',
      to: 'Travel Desk; James Whitfield',
      subject: 'Travel Approval — JW Tokyo May 19–22',
      date: 'April 16, 2026 · 8:24 AM',
      body: [
        'Hi Travel Desk,',
        'Please process the following travel for Partner James Whitfield:',
        '✈️ Departure: May 19, LHR → NRT (Business)\n✈️ Return: May 22, NRT → LHR (Business)\n🏨 Hotel: The Peninsula Tokyo (May 19–22)\n🚗 Ground: Nippon Limousine both ways',
        'Purpose: Relationship management and Q2 business review with Nomura leadership. Pre-approved under client engagement budget.',
        'Please confirm once booked. James prefers window seats.',
        'Thanks,\nAlex Morgan\nExecutive Assistant to James Whitfield',
      ],
    },
  }

  const email = emails[clip.id] ?? emails['c2']

  return (
    <div className="rounded-xl border overflow-hidden bg-white dark:bg-zinc-900 font-sans shadow-sm">
      {/* Outlook top bar */}
      <div className="bg-[#0078d4] px-4 py-2 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-white/30" />
          <div className="h-3 w-3 rounded-full bg-white/30" />
          <div className="h-3 w-3 rounded-full bg-white/30" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-white text-xs font-semibold">Microsoft Outlook</span>
        </div>
        <Search className="h-3.5 w-3.5 text-white/70" />
      </div>

      <div className="flex">
        {/* Folder sidebar */}
        <div className="w-36 bg-[#f3f2f1] dark:bg-zinc-800 border-r text-[11px] py-3 px-2 shrink-0 space-y-0.5">
          {[
            { label: 'Inbox', count: 12, active: true },
            { label: 'Sent Items', count: null, active: false },
            { label: 'Drafts', count: 3, active: false },
            { label: 'Junk Email', count: null, active: false },
            { label: 'Deleted Items', count: null, active: false },
          ].map(({ label, count, active }) => (
            <div key={label} className={cn('flex items-center justify-between rounded px-2 py-1', active ? 'bg-[#0078d4] text-white' : 'text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700')}>
              <span className="truncate">{label}</span>
              {count && <span className={cn('text-[10px] font-bold', active ? 'text-white' : 'text-[#0078d4]')}>{count}</span>}
            </div>
          ))}
        </div>

        {/* Email panel */}
        <div className="flex-1 min-w-0 bg-white dark:bg-zinc-900">
          {/* Email header */}
          <div className="border-b px-5 pt-4 pb-3">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">{email.subject}</h3>
            <div className="flex items-start gap-3">
              <div
                className="h-8 w-8 rounded-full shrink-0 flex items-center justify-center text-[11px] text-white font-bold"
                style={{ backgroundColor: email.color }}
              >
                {email.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{email.from}</span>
                  <span className="text-[10px] text-zinc-400">{email.date}</span>
                </div>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                  <span className="text-zinc-400">From:</span> {email.fromEmail}
                </p>
                <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                  <span className="text-zinc-400">To:</span> {email.to}
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-2.5">
              {[Reply, Forward, Star, MoreHorizontal].map((Icon, i) => (
                <button key={i} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                  <Icon className="h-3.5 w-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Body */}
          <div className="px-5 py-4 space-y-3">
            {email.body.map((para, i) => (
              <p key={i} className="text-[12px] text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed">{para}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ScreenshotPreview({ clip }: { clip: Clipping }) {
  if (clip.imageSrc) {
    return (
      <img src={clip.imageSrc} alt={clip.filename} className="max-w-full object-contain rounded-xl border" />
    )
  }
  if (clip.screenshotType === 'slack') return <SlackScreenshot clip={clip} />
  if (clip.screenshotType === 'outlook') return <OutlookScreenshot clip={clip} />
  return (
    <div className="rounded-xl border bg-muted flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <ImageIcon className="h-10 w-10 opacity-30" />
      <p className="text-sm">{clip.filename}</p>
    </div>
  )
}

// ─── Thumbnail ────────────────────────────────────────────────────────────────

function ClippingThumbnail({ clip }: { clip: Clipping }) {
  if (clip.imageSrc) {
    return <img src={clip.imageSrc} alt={clip.filename} className="h-full w-full object-cover" />
  }
  if (clip.screenshotType === 'slack') {
    return (
      <div className="h-full w-full bg-[#3f0e40] flex flex-col">
        <div className="flex-1 bg-white dark:bg-zinc-800 p-1 space-y-1">
          {[70, 85, 55].map((w, i) => (
            <div key={i} className="flex gap-1 items-start">
              <div className="h-3 w-3 rounded bg-zinc-300 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-0.5">
                <div className="h-1.5 rounded bg-zinc-200" style={{ width: `${w}%` }} />
                <div className="h-1 rounded bg-zinc-100" style={{ width: `${w - 15}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="h-3 bg-[#3f0e40]" />
      </div>
    )
  }
  if (clip.screenshotType === 'outlook') {
    return (
      <div className="h-full w-full flex flex-col">
        <div className="h-2.5 bg-[#0078d4]" />
        <div className="flex-1 bg-white dark:bg-zinc-800 p-1 space-y-1">
          <div className="h-1.5 rounded bg-zinc-300 w-4/5" />
          <div className="h-1 rounded bg-zinc-200 w-3/5" />
          <div className="h-1 rounded bg-zinc-100 w-full mt-1" />
          <div className="h-1 rounded bg-zinc-100 w-full" />
          <div className="h-1 rounded bg-zinc-100 w-2/3" />
        </div>
      </div>
    )
  }
  return <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function ClippingsPage() {
  const [clippings, setClippings] = useState<Clipping[]>(MOCK_CLIPPINGS)
  const [selected, setSelected] = useState<Clipping>(MOCK_CLIPPINGS[0])
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const newClipping: Clipping = {
          id: `c-${Date.now()}-${Math.random()}`,
          filename: file.name,
          uploadedAt: 'Just now',
          source: 'Uploaded manually',
          tags: [],
          screenshotType: 'uploaded',
          imageSrc: e.target?.result as string,
          transcript: 'AI is processing this screenshot…\n\nTranscript will appear here shortly once the image has been analysed.',
        }
        setClippings((prev) => [newClipping, ...prev])
        setSelected(newClipping)
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <header className="sticky top-0 z-10 bg-background border-b shrink-0">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Clippings</h1>
            <p className="text-sm text-muted-foreground">Saved screenshots and notes from connected channels</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Upload className="h-4 w-4" />
            Upload screenshot
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: clippings list */}
        <aside
          className="w-72 shrink-0 border-r flex flex-col overflow-hidden bg-background"
          onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true) }}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); handleFiles(e.dataTransfer.files) }}
        >
          <div
            className={cn(
              'mx-3 mt-3 mb-2 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 py-2.5 text-xs text-muted-foreground transition-colors cursor-pointer',
              isDraggingOver ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-muted-foreground/40'
            )}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-3.5 w-3.5" />
            Drop or click to upload
          </div>

          <div className="flex-1 overflow-y-auto">
            {clippings.map((clip) => (
              <button
                key={clip.id}
                onClick={() => setSelected(clip)}
                className={cn(
                  'w-full text-left px-3 py-3 border-b transition-colors flex gap-3',
                  selected.id === clip.id
                    ? 'bg-primary/5 border-l-2 border-l-primary'
                    : 'hover:bg-muted/50 border-l-2 border-l-transparent'
                )}
              >
                <div className="h-14 w-20 shrink-0 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                  <ClippingThumbnail clip={clip} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{clip.filename}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{clip.source}</p>
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    {clip.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                    <Clock className="h-2.5 w-2.5" />
                    {clip.uploadedAt}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Right: detail view */}
        <div className="flex-1 overflow-y-auto bg-background">
          {selected && (
            <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">

              {/* Screenshot */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <h2 className="text-sm font-semibold text-foreground">Screenshot</h2>
                    <span className="text-xs text-muted-foreground">· {selected.source}</span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="flex items-center gap-1 text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        <Tag className="h-2.5 w-2.5" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ScreenshotPreview clip={selected} />
              </section>

              {/* Transcript */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Transcript</h2>
                </div>
                <div className="rounded-xl border bg-card p-5">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                    {selected.transcript}
                  </pre>
                </div>
              </section>

              <div className="pb-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
