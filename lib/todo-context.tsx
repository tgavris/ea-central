'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { TodoItem, TodoStatus } from '@/lib/types'

type TodoContextType = {
  todos: TodoItem[]
  addTodo: (item: Omit<TodoItem, 'id' | 'createdAt'>) => string
  updateTodoStatus: (id: string, status: TodoStatus) => void
  removeTodo: (id: string) => void
  getTodosByStatus: (status: TodoStatus) => TodoItem[]
  getTodosByColleague: (colleagueId: string) => TodoItem[]
  isTodoAdded: (sourceId: string) => boolean
  clearUndoNotifications: () => void
  unreadUndoCount: number
  registerUndo: () => void
  dismissUndo: () => void
}

const TodoContext = createContext<TodoContextType | null>(null)

export function TodoProvider({ children }: { children: ReactNode }) {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [unreadUndoCount, setUnreadUndoCount] = useState(0)

  const addTodo = useCallback((item: Omit<TodoItem, 'id' | 'createdAt'>): string => {
    const id = `todo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const newTodo: TodoItem = {
      ...item,
      id,
      createdAt: new Date(),
    }
    setTodos((prev) => [newTodo, ...prev])
    return id
  }, [])

  const updateTodoStatus = useCallback((id: string, status: TodoStatus) => {
    setTodos((prev) =>
      prev.map((todo) => (todo.id === id ? { ...todo, status } : todo))
    )
  }, [])

  const removeTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }, [])

  const getTodosByStatus = useCallback(
    (status: TodoStatus) => todos.filter((todo) => todo.status === status),
    [todos]
  )

  const getTodosByColleague = useCallback(
    (colleagueId: string) => todos.filter((todo) => todo.colleagueId === colleagueId),
    [todos]
  )

  const isTodoAdded = useCallback(
    (sourceId: string) => todos.some((todo) => todo.sourceId === sourceId),
    [todos]
  )

  const registerUndo = useCallback(() => {
    setUnreadUndoCount((prev) => prev + 1)
  }, [])

  const dismissUndo = useCallback(() => {
    setUnreadUndoCount((prev) => Math.max(0, prev - 1))
  }, [])

  const clearUndoNotifications = useCallback(() => {
    setUnreadUndoCount(0)
  }, [])

  return (
    <TodoContext.Provider
      value={{
        todos,
        addTodo,
        updateTodoStatus,
        removeTodo,
        getTodosByStatus,
        getTodosByColleague,
        isTodoAdded,
        clearUndoNotifications,
        unreadUndoCount,
        registerUndo,
        dismissUndo,
      }}
    >
      {children}
    </TodoContext.Provider>
  )
}

export function useTodo() {
  const context = useContext(TodoContext)
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider')
  }
  return context
}
