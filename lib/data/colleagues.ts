import type { Colleague } from '@/lib/types'

export const colleagues: Colleague[] = [
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    teams: ['Team One CC', 'Team Two CC'],
  },
  {
    id: 'james-whitfield',
    name: 'James Whitfield',
    teams: ['Team One CC', 'Team Two CC'],
  },
  {
    id: 'adelina-atara',
    name: 'Adelina Atara',
  },
  {
    id: 'frederick-blunst',
    name: 'Frederick Blunst',
  },
  {
    id: 'personal',
    name: 'Personal',
  },
]

export function getColleagueById(id: string): Colleague | undefined {
  return colleagues.find((c) => c.id === id)
}

export function getColleagueName(id: string): string {
  return getColleagueById(id)?.name ?? 'Unknown'
}
