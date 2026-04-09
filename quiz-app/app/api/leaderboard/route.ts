import { supabase } from '@/lib/supabase'
import type { LeaderboardEntry } from '@/types'

export async function GET() {
  const { data, error } = await supabase
    .from('solved_results')
    .select('username, correct')

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const userMap: Record<string, { totalSolved: number; correctCount: number }> = {}
  for (const row of data) {
    if (!userMap[row.username]) {
      userMap[row.username] = { totalSolved: 0, correctCount: 0 }
    }
    userMap[row.username].totalSolved++
    if (row.correct) userMap[row.username].correctCount++
  }

  const entries: LeaderboardEntry[] = Object.entries(userMap).map(
    ([username, stats]) => ({
      username,
      totalSolved: stats.totalSolved,
      correctCount: stats.correctCount,
      score: stats.correctCount * 10 - (stats.totalSolved - stats.correctCount) * 2,
    }),
  )

  entries.sort((a, b) => b.score - a.score || b.correctCount - a.correctCount)

  return Response.json(entries)
}
