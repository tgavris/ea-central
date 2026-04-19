'use client'

import { useEffect } from 'react'
import { useTodo } from '@/lib/todo-context'

export function InsightsPageClient({ children }: { children: React.ReactNode }) {
  const { clearUndoNotifications } = useTodo()

  useEffect(() => {
    // Clear any lingering undo notifications when entering insights tab
    clearUndoNotifications()
  }, [clearUndoNotifications])

  return <>{children}</>
}
