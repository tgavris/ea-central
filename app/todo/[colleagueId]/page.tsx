import { colleagues } from '@/lib/data/colleagues'
import { ColleagueTodoClient } from './colleague-todo-client'

export function generateStaticParams() {
  return colleagues.map((c) => ({ colleagueId: c.id }))
}

interface ColleagueTodoPageProps {
  params: Promise<{ colleagueId: string }>
}

export default async function ColleagueTodoPage({ params }: ColleagueTodoPageProps) {
  const { colleagueId } = await params
  return <ColleagueTodoClient colleagueId={colleagueId} />
}
