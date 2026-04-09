import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { UserProgress, SolvedResult } from '@/types'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params

  const { data: results, error } = await supabase
    .from('solved_results')
    .select('*')
    .eq('username', username)

  if (error) return Response.json({ error: error.message }, { status: 500 })

  const solvedProblems: Record<string, SolvedResult> = {}
  for (const row of results) {
    solvedProblems[row.problem_id] = {
      problemId: row.problem_id,
      correct: row.correct,
      attempts: row.attempts,
      solvedAt: row.solved_at,
      userAnswer: row.user_answer,
    }
  }

  const { data: user } = await supabase
    .from('users')
    .select('created_at')
    .eq('username', username)
    .single()

  const createdAt = user ? new Date(user.created_at).getTime() : Date.now()

  const progress: UserProgress = { username, solvedProblems, createdAt }
  return Response.json(progress)
}
