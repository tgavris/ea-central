'use client'

import { Mail, Calendar, Plane, FileText, GripVertical, MoreHorizontal, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import type { TodoItem } from '@/lib/types'
import { useTodo } from '@/lib/todo-context'
import { getColleagueName } from '@/lib/data/colleagues'
import { formatDistanceToNow } from '@/lib/format-date'

const typeIcons = {
  email: Mail,
  calendar: Calendar,
  travel: Plane,
  document: FileText,
}

interface TodoCardProps {
  todo: TodoItem
  isDragging?: boolean
  onClick?: () => void
}

export function TodoCard({ todo, isDragging, onClick }: TodoCardProps) {
  const { removeTodo } = useTodo()
  const Icon = todo.source === 'insight' 
    ? typeIcons[todo.metadata.type as keyof typeof typeIcons] || FileText
    : Mail
  const colleagueName = getColleagueName(todo.colleagueId)

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative bg-card rounded-lg border p-3 transition-all duration-200',
        'hover:shadow-md hover:border-border/80',
        onClick && 'cursor-pointer',
        isDragging && 'shadow-lg rotate-2 scale-105'
      )}
    >
      {/* Drag Handle */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="pl-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-muted">
              <Icon className="h-3 w-3 text-muted-foreground" />
            </div>
            <Badge variant="secondary" className="text-xs font-normal">
              {colleagueName}
            </Badge>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => removeTodo(todo.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-foreground leading-snug mb-1 line-clamp-2">
          {todo.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
          {todo.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="capitalize">{todo.source}</span>
          <span>{formatDistanceToNow(todo.createdAt)}</span>
        </div>
      </div>
    </div>
  )
}
