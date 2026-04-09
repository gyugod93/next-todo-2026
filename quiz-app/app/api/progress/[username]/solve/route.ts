import type { NextRequest } from 'next/server'
import { supabase } from '@/lib/supabase'
import type { SolvedResult } from '@/types'

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params
  const result: SolvedResult = await req.json()

  // 유저 upsert (첫 풀이면 users 테이블에 추가)
  const { error: userError } = await supabase
    .from('users')
    .upsert({ username }, { onConflict: 'username' })

  if (userError) return Response.json({ error: userError.message }, { status: 500 })

  // 풀이 결과 upsert
  const { error } = await supabase.from('solved_results').upsert(
    {
      username,
      problem_id: result.problemId,
      correct: result.correct,
      attempts: result.attempts,
      solved_at: result.solvedAt,
      user_answer: String(result.userAnswer),
    },
    { onConflict: 'username,problem_id' },
  )

  if (error) return Response.json({ error: error.message }, { status: 500 })

  return Response.json({ ok: true })
}
