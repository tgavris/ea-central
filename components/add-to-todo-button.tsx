'use client'

import { Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTodo } from '@/lib/todo-context'
import type { Insight, InboxItem } from '@/lib/types'

interface AddToTodoButtonProps {
  insight?: Insight
  inboxItem?: InboxItem
  variant?: 'default' | 'outline' | 'secondary'
  size?: 'default' | 'sm'
}

export function AddToTodoButton({ 
  insight, 
  inboxItem, 
  variant = 'outline',
  size = 'sm' 
}: AddToTodoButtonProps) {
  const { addTodo, isTodoAdded } = useTodo()
  
  const sourceId = insight?.id || inboxItem?.id || ''
  const isAdded = isTodoAdded(sourceId)

  const handleAddTodo = () => {
    if (isAdded) return

    if (insight) {
      addTodo({
        colleagueId: insight.colleagueId,
        title: insight.title,
        description: insight.description,
        source: 'insight',
        sourceId: insight.id,
        status: 'todo',
        speed: 'medium',
        urgency: insight.urgency === 'urgent' ? 'high' : insight.badge ? 'medium' : 'low',
        metadata: {
          type: insight.type,
          rule: insight.rule,
          urgency: insight.urgency,
          badge: insight.badge,
          sources: insight.sources,
        },
      })
    } else if (inboxItem) {
      addTodo({
        colleagueId: inboxItem.colleagueId,
        title: inboxItem.subject,
        description: inboxItem.preview,
        source: 'inbox',
        sourceId: inboxItem.id,
        status: 'todo',
        speed: 'medium',
        urgency: 'medium',
        metadata: {
          from: inboxItem.from,
          timestamp: inboxItem.timestamp,
        },
      })
    }
  }

  return (
    <Button
      variant={isAdded ? 'secondary' : variant}
      size={size}
      onClick={handleAddTodo}
      disabled={isAdded}
    >
      {isAdded ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Added
        </>
      ) : (
        <>
          <Plus className="h-4 w-4 mr-2" />
          To-do
        </>
      )}
    </Button>
  )
}
