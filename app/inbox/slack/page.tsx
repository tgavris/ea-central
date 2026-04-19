'use client'

import { useState } from 'react'
import { Search, Plus, Hash, MessageSquare, ChevronDown, User } from 'lucide-react'
import { cn } from '@/lib/utils'

type Reaction = { emoji: string; count: number }

type SlackMessage = {
  id: string
  author: string
  initials: string
  avatarColor: string
  time: string
  body: string
  reactions?: Reaction[]
}

type Channel = {
  id: string
  name: string
  unread?: boolean
  preview?: string
}

type DirectMessage = {
  id: string
  name: string
  initials: string
  avatarColor: string
  online?: boolean
  preview?: string
}

type Thread = {
  id: string
  channel: string
  isDm?: boolean
  badge?: string
  messageCount: number
  date: string
  messages: SlackMessage[]
}

const channels: Channel[] = [
  {
    id: 'sarah-chen-team',
    name: 'sarah-chen-team',
    unread: true,
    preview: 'Wednesday 2pm works for Sara...',
  },
  {
    id: 'travel-coordination',
    name: 'travel-coordination',
    preview: 'My partner is on the same flight...',
  },
]

const directMessages: DirectMessage[] = [
  {
    id: 'david-park',
    name: 'David Park',
    initials: 'DP',
    avatarColor: 'bg-purple-500',
    online: true,
    preview: "She's asking about video confe...",
  },
  {
    id: 'maria-lopez',
    name: 'Maria Lopez',
    initials: 'ML',
    avatarColor: 'bg-blue-500',
    preview: 'Yes please! And can you share ...',
  },
  {
    id: 'it-bot',
    name: 'IT Bot',
    initials: 'IB',
    avatarColor: 'bg-slate-500',
    preview: 'Reminder: Your VPN certificate ...',
  },
]

const threads: Thread[] = [
  {
    id: 'sarah-chen-team',
    channel: '#sarah-chen-team',
    badge: 'Sarah Chen',
    messageCount: 5,
    date: 'Wednesday, February 25',
    messages: [
      {
        id: 'm1',
        author: 'David Park',
        initials: 'DP',
        avatarColor: 'bg-purple-500',
        time: '3:00 AM',
        body: "Team — Q1 planning deck needs to be finalized by Friday. @alex.morgan can you block Sarah's calendar for review time?",
      },
      {
        id: 'm2',
        author: 'Alex Morgan',
        initials: 'AM',
        avatarColor: 'bg-blue-600',
        time: '3:05 AM',
        body: "On it. I'll block Thursday afternoon and Friday morning for her.",
        reactions: [{ emoji: '👍', count: 2 }],
      },
      {
        id: 'm3',
        author: 'Nina Patel',
        initials: 'NP',
        avatarColor: 'bg-violet-500',
        time: '3:30 AM',
        body: 'Can we also add a 30-min sync with the analytics team? They have the market sizing data we need.',
        reactions: [{ emoji: '👍', count: 2 }],
      },
      {
        id: 'm4',
        author: 'David Park',
        initials: 'DP',
        avatarColor: 'bg-purple-500',
        time: '4:15 AM',
        body: '@alex.morgan can you find a slot for that sync? Ideally Wednesday or Thursday.',
      },
      {
        id: 'm5',
        author: 'Alex Morgan',
        initials: 'AM',
        avatarColor: 'bg-blue-600',
        time: '4:20 AM',
        body: 'Wednesday 2pm works for Sarah and the analytics team. Sending invite now.',
        reactions: [{ emoji: '✅', count: 3 }],
      },
    ],
  },
  {
    id: 'travel-coordination',
    channel: '#travel-coordination',
    messageCount: 4,
    date: 'Tuesday, February 24',
    messages: [
      {
        id: 't1',
        author: 'James Liu',
        initials: 'JL',
        avatarColor: 'bg-emerald-600',
        time: '9:12 AM',
        body: 'Heads up — the 7am flight to NYC on Thursday is showing delays on the airline app. Might be worth checking alternatives.',
      },
      {
        id: 't2',
        author: 'Alex Morgan',
        initials: 'AM',
        avatarColor: 'bg-blue-600',
        time: '9:18 AM',
        body: "Thanks James. I'll monitor it and rebook if needed. Sarah has a client dinner at 7pm so we need her there by 5 at the latest.",
        reactions: [{ emoji: '👍', count: 1 }],
      },
      {
        id: 't3',
        author: 'Priya Nair',
        initials: 'PN',
        avatarColor: 'bg-pink-500',
        time: '10:05 AM',
        body: "My partner is on the same flight! He said the gate change is confirmed — now departing from Terminal B, Gate 22. Alex, I've updated the travel sheet.",
        reactions: [{ emoji: '🙏', count: 2 }],
      },
      {
        id: 't4',
        author: 'Alex Morgan',
        initials: 'AM',
        avatarColor: 'bg-blue-600',
        time: '10:10 AM',
        body: "Got it, updating Sarah's calendar notes now. Will send her a heads up before she leaves for the airport.",
        reactions: [{ emoji: '✅', count: 2 }],
      },
    ],
  },
  {
    id: 'david-park',
    channel: 'David Park',
    isDm: true,
    messageCount: 6,
    date: 'Thursday, February 20',
    messages: [
      {
        id: 'd1',
        author: 'David Park',
        initials: 'DP',
        avatarColor: 'bg-purple-500',
        time: '11:00 AM',
        body: "Hey Alex — Sarah's interviewing for the VP role at Meridian and wants to keep it quiet. Can you make sure her calendar looks normal next week?",
      },
      {
        id: 'd2',
        author: 'Alex Morgan',
        initials: 'AM',
        avatarColor: 'bg-blue-600',
        time: '11:03 AM',
        body: "Understood. I'll mark the blocks as 'Focus time' and decline conflicting meetings discreetly.",
        reactions: [{ emoji: '👍', count: 1 }],
      },
      {
        id: 'd3',
        author: 'David Park',
        initials: 'DP',
        avatarColor: 'bg-purple-500',
        time: '11:05 AM',
        body: "Perfect. Also — she's asking about video conferencing setup for the panel interview. Can you sort that out with IT?",
      },
      {
        id: 'd4',
        author: 'Alex Morgan',
        initials: 'AM',
        avatarColor: 'bg-blue-600',
        time: '11:08 AM',
        body: "On it. I'll get the Zoom room set up and test it 30 minutes before the call. Anything else she needs?",
      },
      {
        id: 'd5',
        author: 'David Park',
        initials: 'DP',
        avatarColor: 'bg-purple-500',
        time: '11:12 AM',
        body: "Just prep a one-pager on Meridian's org structure — she wants background on who'll be in the panel.",
        reactions: [{ emoji: '👍', count: 1 }],
      },
      {
        id: 'd6',
        author: 'Alex Morgan',
        initials: 'AM',
        avatarColor: 'bg-blue-600',
        time: '11:15 AM',
        body: "Will do. I'll have it in her prep folder by EOD.",
        reactions: [{ emoji: '✅', count: 1 }],
      },
    ],
  },
  {
    id: 'maria-lopez',
    channel: 'Maria Lopez',
    isDm: true,
    messageCount: 4,
    date: 'Wednesday, February 25',
    messages: [
      {
        id: 'ml1',
        author: 'Maria Lopez',
        initials: 'ML',
        avatarColor: 'bg-blue-500',
        time: '2:00 PM',
        body: "Hi Alex — I'm pulling together the board materials for next week. Do you have the latest version of the strategy slide deck Sarah presented in January?",
      },
      {
        id: 'ml2',
        author: 'Alex Morgan',
        initials: 'AM',
        avatarColor: 'bg-blue-600',
        time: '2:04 PM',
        body: "Yes, I'll share it now. Just a note — slide 14 has an updated revenue projection that Sarah revised last week.",
        reactions: [{ emoji: '👍', count: 1 }],
      },
      {
        id: 'ml3',
        author: 'Maria Lopez',
        initials: 'ML',
        avatarColor: 'bg-blue-500',
        time: '2:07 PM',
        body: "Yes please! And can you share the Q4 board minutes too? I want to cross-reference the commitments.",
      },
      {
        id: 'ml4',
        author: 'Alex Morgan',
        initials: 'AM',
        avatarColor: 'bg-blue-600',
        time: '2:09 PM',
        body: "Sent both to your inbox. Let me know if you need anything else before the board meeting.",
        reactions: [{ emoji: '🙏', count: 1 }],
      },
    ],
  },
  {
    id: 'it-bot',
    channel: 'IT Bot',
    isDm: true,
    messageCount: 3,
    date: 'Monday, February 23',
    messages: [
      {
        id: 'ib1',
        author: 'IT Bot',
        initials: 'IB',
        avatarColor: 'bg-slate-500',
        time: '8:00 AM',
        body: '🔔 Reminder: Your VPN certificate expires in 7 days. Please renew it via the IT portal to avoid disruption to remote access.',
      },
      {
        id: 'ib2',
        author: 'IT Bot',
        initials: 'IB',
        avatarColor: 'bg-slate-500',
        time: '9:00 AM',
        body: '🔒 Security notice: A new sign-in to your account was detected from Chicago, IL. If this was you, no action needed. If not, please contact IT Security immediately.',
      },
      {
        id: 'ib3',
        author: 'IT Bot',
        initials: 'IB',
        avatarColor: 'bg-slate-500',
        time: '10:00 AM',
        body: '✅ Your software update for Zoom (v6.2.1) has been installed successfully. Restart your machine at your earliest convenience to complete the update.',
      },
    ],
  },
]

export default function SlackPage() {
  const [activeId, setActiveId] = useState<string>('sarah-chen-team')
  const [search, setSearch] = useState('')

  const thread = threads.find((t) => t.id === activeId) ?? threads[0]
  const isDm = thread.isDm ?? false

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Slack left sidebar */}
      <div className="w-64 shrink-0 flex flex-col border-r bg-[#3f0e40] text-white overflow-y-auto">
        {/* Workspace header */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">McKinsey &amp; Co</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
                <span className="text-xs text-white/70">Alex Morgan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/50 pointer-events-none" />
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 text-xs text-white placeholder:text-white/50 rounded pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="px-3 py-3">
          <button className="flex items-center gap-1 text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5 hover:text-white transition-colors w-full">
            <ChevronDown className="h-3 w-3" />
            Channels
          </button>
          <div className="space-y-0.5">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveId(ch.id)}
                className={cn(
                  'w-full text-left px-2 py-1 rounded text-sm flex flex-col transition-colors',
                  activeId === ch.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 shrink-0" />
                  <span className={cn('truncate', ch.unread && activeId !== ch.id && 'font-semibold text-white')}>
                    {ch.name}
                  </span>
                </span>
                {ch.preview && (
                  <span className="text-[11px] text-white/40 truncate pl-5 mt-0.5">{ch.preview}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Messages */}
        <div className="px-3 py-2">
          <button className="flex items-center gap-1 text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5 hover:text-white transition-colors w-full">
            <ChevronDown className="h-3 w-3" />
            Direct Messages
          </button>
          <div className="space-y-0.5">
            {directMessages.map((dm) => (
              <button
                key={dm.id}
                onClick={() => setActiveId(dm.id)}
                className={cn(
                  'w-full text-left px-2 py-1 rounded text-sm flex flex-col transition-colors',
                  activeId === dm.id
                    ? 'bg-white/20 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                <span className="flex items-center gap-2">
                  <span className={cn('h-5 w-5 rounded-sm text-[10px] font-bold flex items-center justify-center shrink-0', dm.avatarColor)}>
                    {dm.initials}
                  </span>
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="truncate">{dm.name}</span>
                    {dm.online && <span className="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />}
                  </span>
                </span>
                {dm.preview && (
                  <span className="text-[11px] text-white/40 truncate pl-7 mt-0.5">{dm.preview}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Threads */}
        <div className="px-3 py-2">
          <button className="flex items-center gap-1 text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5 hover:text-white transition-colors w-full">
            <ChevronDown className="h-3 w-3" />
            Threads
          </button>
          <button className="w-full text-left px-2 py-1 rounded text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors flex flex-col">
            <span className="flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">#meridian-engagement → Thread</span>
            </span>
            <span className="text-[11px] text-white/40 truncate pl-6 mt-0.5">
              Great. Also remind me to call Dr...
            </span>
          </button>
        </div>
      </div>

      {/* Main message area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Channel header */}
        <div className="px-6 py-3 border-b flex items-center justify-between shrink-0 bg-background">
          <div className="flex items-center gap-2">
            {isDm ? (
              <User className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Hash className="h-4 w-4 text-muted-foreground" />
            )}
            <h1 className="text-sm font-semibold text-foreground">
              {thread.channel.replace('#', '')}
            </h1>
            {thread.badge && (
              <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-0.5 rounded">
                {thread.badge}
              </span>
            )}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Compose
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-xs text-muted-foreground mb-4">{thread.messageCount} messages</p>

          {/* Date separator */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground bg-background px-2">{thread.date}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-4">
            {thread.messages.map((msg) => (
              <MessageRow key={msg.id} msg={msg} />
            ))}
          </div>
        </div>

        {/* Compose box */}
        <div className="px-6 py-3 border-t shrink-0 bg-background">
          <div className="rounded-lg border bg-card px-4 py-2.5 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Message ${thread.channel}`}
              className="flex-1 text-sm bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-1 text-muted-foreground">
              <button className="p-1 rounded hover:bg-muted transition-colors text-lg leading-none">😊</button>
              <button className="p-1.5 rounded hover:bg-muted transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageRow({ msg }: { msg: SlackMessage }) {
  return (
    <div className="flex items-start gap-3 group">
      <div className={cn(
        'h-8 w-8 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5',
        msg.avatarColor
      )}>
        {msg.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-foreground">{msg.author}</span>
          <span className="text-[11px] text-muted-foreground">{msg.time}</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{msg.body}</p>
        {msg.reactions && msg.reactions.length > 0 && (
          <div className="flex gap-1.5 mt-1.5">
            {msg.reactions.map((r, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-muted hover:bg-muted/80 border border-border rounded-full px-2 py-0.5 text-xs cursor-pointer transition-colors"
              >
                <span>{r.emoji}</span>
                <span className="text-muted-foreground font-medium">{r.count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
