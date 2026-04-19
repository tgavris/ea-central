'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { useTheme } from 'next-themes'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Mail, 
  Paperclip, 
  Users, 
  Settings,
  Boxes,
  ChevronRight,
  MessageSquare,
  Moon,
  Sun,
} from 'lucide-react'
import { colleagues } from '@/lib/data/colleagues'
import { getNeedsAttentionCountByColleague, insights, isNeedsAttention } from '@/lib/data/insights'
import { cn } from '@/lib/utils'

const otherNavItems = [
  { label: 'Clippings', href: '/clippings', icon: Paperclip },
  { label: 'Contacts', href: '/contacts', icon: Users },
  { label: 'Preferences', href: '/preferences', icon: Settings },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const totalAttentionCount = insights.filter(isNeedsAttention).length
  
  const isInsightsActive = pathname.startsWith('/insights') || pathname.startsWith('/todo')
  const isInboxActive = pathname.startsWith('/inbox')
  const [inboxOpen, setInboxOpen] = useState(isInboxActive)

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="px-4 py-5">
        <Link href="/insights" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-accent">
            <Boxes className="h-4 w-4 text-sidebar-primary" />
          </div>
          <span className="text-base font-semibold text-sidebar-primary">EA Central</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Navigation Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Inbox — collapsible with sub-items */}
              <Collapsible open={inboxOpen} onOpenChange={setInboxOpen} asChild>
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      isActive={isInboxActive}
                      className={cn(
                        'px-4 py-2 text-sm',
                        isInboxActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                      )}
                    >
                      <Mail className="h-4 w-4" />
                      <span className="flex-1">Inbox</span>
                      <ChevronRight className={cn('h-3.5 w-3.5 transition-transform', inboxOpen && 'rotate-90')} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === '/inbox'}
                        >
                          <Link href="/inbox">
                            <Mail className="h-3.5 w-3.5" />
                            <span>Email</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathname === '/inbox/slack'}
                        >
                          <Link href="/inbox/slack">
                            <MessageSquare className="h-3.5 w-3.5" />
                            <span>Slack</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Other nav items */}
              {otherNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        'px-4 py-2 text-sm',
                        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Insights Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#757575] text-xs font-medium uppercase tracking-wider px-4">
            Focus
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* All Insights */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/insights'}
                  className={cn(
                    'px-4 py-2 text-sm',
                    pathname === '/insights' && 'bg-sidebar-accent text-sidebar-accent-foreground'
                  )}
                >
                  <Link href="/insights">
                    <span className="flex-1">Everything</span>
                    <span className="text-xs text-sidebar-muted">{totalAttentionCount}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Colleagues */}
              {colleagues.map((colleague) => {
                const count = getNeedsAttentionCountByColleague(colleague.id)
                const isActive = pathname === `/insights/${colleague.id}` || pathname.startsWith(`/insights/${colleague.id}/`)

                return (
                  <SidebarMenuItem key={colleague.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        'px-4 py-2 text-sm',
                        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                      )}
                    >
                      <Link href={`/insights/${colleague.id}`}>
                        <span className={cn(
                          'flex-1 truncate',
                          isActive && 'font-medium'
                        )}>
                          {colleague.name}
                        </span>
                        <span className="text-xs text-sidebar-muted">{count}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Apps Section */}
        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-sidebar-muted text-xs font-medium uppercase tracking-wider px-4">
            Apps
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-4 py-2 text-sm text-sidebar-muted">
              No apps connected
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
              RW
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Ryan West</p>
          </div>
          <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-sidebar-muted" />
              ) : (
                <Moon className="h-4 w-4 text-sidebar-muted" />
              )}
            </button>
            <Link
              href="/settings"
              className={cn(
                'p-1.5 rounded-md hover:bg-sidebar-accent transition-colors',
                pathname === '/settings' && 'bg-sidebar-accent'
              )}
              title="Settings"
            >
              <Settings className="h-4 w-4 text-sidebar-muted" />
            </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
