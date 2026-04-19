import { colleagues } from '@/lib/data/colleagues'
import { ColleagueArchiveClient } from './colleague-archive-client'

export function generateStaticParams() {
  return colleagues.map((c) => ({ colleagueId: c.id }))
}

interface ColleagueArchivePageProps {
  params: Promise<{ colleagueId: string }>
}

export default async function ColleagueArchivePage({ params }: ColleagueArchivePageProps) {
  const { colleagueId } = await params
  return <ColleagueArchiveClient colleagueId={colleagueId} />
}
