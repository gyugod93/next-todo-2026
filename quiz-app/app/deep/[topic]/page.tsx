'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { getDeepTopicById, deepTopics } from '@/data/deep-topics'
import CodeBlock from '@/components/CodeBlock'
import type { EvaluateResult } from '@/app/api/evaluate/route'

type Phase = 'reading' | 'writing' | 'evaluating' | 'done'

export default function DeepTopicPage() {
  const { topic } = useParams<{ topic: string }>()
  const router = useRouter()
  const data = getDeepTopicById(topic)

  const [phase, setPhase] = useState<Phase>('reading')
  const [answer, setAnswer] = useState('')
  const [aiResult, setAiResult] = useState<EvaluateResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [openExample, setOpenExample] = useState<number | null>(0)

  if (!data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">토픽을 찾을 수 없습니다</p>
        <Link href="/deep" className="text-indigo-400 text-sm hover:underline mt-2 inline-block">돌아가기</Link>
      </div>
    )
  }

  const currentIndex = deepTopics.findIndex((t) => t.id === topic)
  const prevTopic = deepTopics[currentIndex - 1]
  const nextTopic = deepTopics[currentIndex + 1]

  const handleEvaluate = async () => {
    if (!answer.trim()) return
    setPhase('evaluating')
    setError(null)

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: data.title,
          description: data.question,
          correctAnswer: data.referenceAnswer,
          explanation: data.referenceAnswer,
          userAnswer: answer.trim(),
        }),
      })
      const result = await res.json()
      if (!res.ok) throw new Error(result.error ?? '서버 오류')
      setAiResult(result)
      setPhase('done')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'AI 채점 실패')
      setPhase('writing')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* 뒤로가기 */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/deep" className="hover:text-gray-300 transition-colors">← 목록</Link>
        <span>/</span>
        <span className="text-gray-400">{data.title}</span>
      </div>

      {/* 헤더 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{data.emoji}</span>
          <span className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">{data.category}</span>
        </div>
        <h1 className="text-2xl font-bold text-white">{data.title}</h1>
        <p className="text-gray-500 text-sm">{data.subtitle}</p>
      </div>

      {/* 1. 상황 */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">상황</span>
        </div>
        <p className="text-gray-300 leading-relaxed">{data.scenario}</p>
        {data.scenarioCode && (
          <CodeBlock code={data.scenarioCode} />
        )}
      </section>

      {/* 2. 왜 이게 문제야? */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
        <span className="text-xs font-bold text-red-400 uppercase tracking-wider">왜 이게 문제야?</span>
        <p className="text-gray-300 leading-relaxed">{data.whyItMatters}</p>
      </section>

      {/* 3. 핵심 개념 */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">핵심 개념</span>
        <p className="text-gray-300 leading-relaxed">{data.concept}</p>
      </section>

      {/* 4. 예제 */}
      <section className="space-y-3">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider px-1">실무에서 이렇게 써</span>
        {data.examples.map((ex, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <button
              onClick={() => setOpenExample(openExample === i ? null : i)}
              className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-200">{ex.label}</span>
              <span className="text-gray-600 text-sm">{openExample === i ? '▲' : '▼'}</span>
            </button>
            {openExample === i && (
              <div className="px-6 pb-6 space-y-3">
                <CodeBlock code={ex.code} />
                <p className="text-sm text-gray-400 bg-gray-800/50 rounded-lg px-4 py-2.5">{ex.note}</p>
              </div>
            )}
          </div>
        ))}
      </section>

      {/* 5. 판단 기준 */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <span className="text-xs font-bold text-violet-400 uppercase tracking-wider">판단 기준</span>
        <div className="space-y-2">
          {data.decisionGuide.map((g, i) => (
            <div key={i} className="flex items-start gap-3 text-sm">
              <span className="text-gray-600 shrink-0 mt-0.5">→</span>
              <span className="text-gray-400 flex-1">{g.condition}</span>
              <span className="text-white font-medium shrink-0 bg-gray-800 px-2 py-0.5 rounded text-xs">{g.answer}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. 이제 설명해봐 */}
      <section className="bg-indigo-950/30 border border-indigo-500/20 rounded-2xl p-6 space-y-4">
        <div>
          <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">이제 설명해봐</span>
          <p className="text-gray-200 mt-3 leading-relaxed">{data.question}</p>
        </div>

        {phase === 'reading' && (
          <button
            onClick={() => setPhase('writing')}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-colors"
          >
            답변 작성하기
          </button>
        )}

        {phase === 'writing' && (
          <div className="space-y-3">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="내 말로 자유롭게 설명해봐. 완벽하지 않아도 괜찮아."
              className="w-full h-40 bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-indigo-500 leading-relaxed"
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleEvaluate}
              disabled={!answer.trim()}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-semibold rounded-xl transition-colors"
            >
              AI 채점 받기
            </button>
          </div>
        )}

        {phase === 'evaluating' && (
          <div className="flex flex-col items-center py-10 gap-3">
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm">분석 중...</p>
          </div>
        )}

        {phase === 'done' && aiResult && (
          <div className="space-y-5">
            {/* 채점 결과 */}
            <div className={`rounded-xl border p-5 space-y-4 ${aiResult.passed ? 'border-green-500/30 bg-green-500/5' : 'border-orange-500/30 bg-orange-500/5'}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{aiResult.passed ? '✅' : '🔄'}</span>
                  <div>
                    <p className={`font-semibold ${aiResult.passed ? 'text-green-400' : 'text-orange-400'}`}>
                      {aiResult.passed ? '판단 기준 잡혔다' : '조금 더 생각해보자'}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">AI 채점</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-bold ${aiResult.passed ? 'text-green-400' : 'text-orange-400'}`}>{aiResult.score}</p>
                  <p className="text-xs text-gray-600">/ 100</p>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-3">
                <p className="text-sm text-gray-300 leading-relaxed">{aiResult.feedback}</p>
              </div>

              {aiResult.goodPoints.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-green-400 font-semibold uppercase tracking-wider">잘 짚은 부분</p>
                  {aiResult.goodPoints.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-green-500 shrink-0">✓</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              )}

              {aiResult.missedPoints.length > 0 && (
                <div className="space-y-1.5">
                  <p className="text-xs text-orange-400 font-semibold uppercase tracking-wider">보완할 부분</p>
                  {aiResult.missedPoints.map((p, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className="text-orange-400 shrink-0">→</span>
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 모범 답안 */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">모범 답안</p>
              <div className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                {data.referenceAnswer}
              </div>
            </div>

            {/* 핵심 포인트 */}
            <div className="bg-indigo-950/30 border border-indigo-500/20 rounded-xl p-4 space-y-2">
              <p className="text-xs text-indigo-400 font-semibold">핵심 포인트</p>
              {data.keyPoints.map((kp, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="text-indigo-400 shrink-0">•</span>
                  <span>{kp}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setPhase('writing'); setAnswer(''); setAiResult(null) }}
              className="text-xs px-3 py-1.5 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 rounded-lg transition-colors"
            >
              다시 써보기
            </button>
          </div>
        )}
      </section>

      {/* 이전/다음 */}
      <div className="flex gap-3">
        {prevTopic ? (
          <Link href={`/deep/${prevTopic.id}`} className="flex-1 text-center py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-xl transition-colors">
            ← {prevTopic.title}
          </Link>
        ) : <div className="flex-1" />}
        <Link href="/deep" className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-xl transition-colors">
          목록
        </Link>
        {nextTopic ? (
          <Link href={`/deep/${nextTopic.id}`} className="flex-1 text-center py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm rounded-xl transition-colors">
            {nextTopic.title} →
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </div>
  )
}
