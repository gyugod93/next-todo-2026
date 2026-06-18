'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { Problem } from '@/types'
import type { EvaluateResult } from '@/app/api/evaluate/route'
import CodeBlock from '@/components/CodeBlock'
import Link from 'next/link'
import { getProblemById } from '@/data/problems'
import { useUserStore } from '@/store/userStore'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface Props {
  problem: Problem
  onSubmit: (answer: string, correct: boolean) => void
  initialAnswer?: string
  onRetry?: () => void
}

type Phase = 'writing' | 'evaluating' | 'done'

export default function SelfCheck({ problem, onSubmit, initialAnswer, onRetry }: Props) {
  const [code, setCode] = useState(initialAnswer ?? problem.code ?? '')
  const [phase, setPhase] = useState<Phase>(initialAnswer ? 'done' : 'writing')
  const [aiResult, setAiResult] = useState<EvaluateResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showHints, setShowHints] = useState(false)
  const { addToRetry, retryQueue } = useUserStore()
  const [retryAdded, setRetryAdded] = useState(false)

  const relatedProblems = problem.relatedProblems
    ?.map((id) => getProblemById(id))
    .filter(Boolean)
  const alreadyInQueue = problem.id ? retryQueue.includes(problem.id) : false

  const referenceAnswer = problem.correctAnswer as string

  const handleEvaluate = async () => {
    if (!code.trim()) return
    setPhase('evaluating')
    setError(null)

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: problem.title,
          description: problem.description,
          correctAnswer: referenceAnswer,
          explanation: problem.explanation,
          userAnswer: code.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? '서버 오류')
      setAiResult(data)
      setPhase('done')
      onSubmit(code.trim(), data.passed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'AI 채점에 실패했습니다.')
      setPhase('writing')
    }
  }

  return (
    <div className="space-y-5">
      {/* 작성 단계 */}
      {phase === 'writing' && (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">빈칸을 채워 코드를 완성하세요</p>
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded">
                AI가 채점해드립니다
              </span>
            </div>
            <div className="rounded-lg overflow-hidden border border-gray-700">
              <MonacoEditor
                height="320px"
                language="typescript"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val ?? '')}
                loading={
                  <div className="h-[320px] bg-[#1e1e1e] flex items-center justify-center text-gray-600 text-sm">
                    에디터 로딩 중...
                  </div>
                }
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 12, bottom: 12 },
                  cursorBlinking: 'smooth',
                }}
              />
            </div>
          </div>

          {problem.hints && problem.hints.length > 0 && (
            <button
              onClick={() => setShowHints(!showHints)}
              className="text-sm text-gray-500 hover:text-yellow-400 transition-colors flex items-center gap-1.5"
            >
              💡 {showHints ? '힌트 숨기기' : '힌트 보기'}
            </button>
          )}
          {showHints && problem.hints && (
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-1.5">
              {problem.hints.map((hint, i) => (
                <p key={i} className="text-yellow-400 text-sm">
                  {i + 1}. {hint}
                </p>
              ))}
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            onClick={handleEvaluate}
            disabled={!code.trim()}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            AI 채점 받기
          </button>
        </>
      )}

      {/* AI 채점 중 */}
      {phase === 'evaluating' && (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">AI가 코드를 분석하는 중...</p>
        </div>
      )}

      {/* 완료 단계 */}
      {phase === 'done' && aiResult && (
        <div className="space-y-5">
          {/* AI 채점 결과 */}
          <div
            className={`rounded-xl border p-5 space-y-4 ${
              aiResult.passed
                ? 'border-green-500/30 bg-green-500/5'
                : 'border-red-500/30 bg-red-500/5'
            }`}
          >
            {/* 점수 헤더 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{aiResult.passed ? '✅' : '❌'}</span>
                <div>
                  <p className={`font-semibold ${aiResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                    {aiResult.passed ? '핵심 개념 이해함' : '보완이 필요해요'}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">AI 채점 결과</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-bold ${aiResult.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {aiResult.score}
                </p>
                <p className="text-xs text-gray-600">/ 100</p>
              </div>
            </div>

            {/* 전체 피드백 */}
            <div className="border-t border-gray-800 pt-3">
              <p className="text-sm text-gray-300 leading-relaxed">{aiResult.feedback}</p>
            </div>

            {/* 잘한 점 */}
            {aiResult.goodPoints.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-green-400 uppercase tracking-wider font-semibold">잘 이해한 부분</p>
                {aiResult.goodPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            )}

            {/* 놓친 부분 */}
            {aiResult.missedPoints.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-red-400 uppercase tracking-wider font-semibold">놓친 부분</p>
                {aiResult.missedPoints.map((point, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-red-500 mt-0.5 shrink-0">✗</span>
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 모범 답안 */}
          <div>
            <p className="text-xs text-green-400 uppercase tracking-wider mb-2">모범 답안</p>
            <CodeBlock code={referenceAnswer} />
          </div>

          {/* 핵심 개념 정리 — 항상 표시 */}
          {problem.deepDive && (
            <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-5 space-y-3">
              <p className="text-sm font-semibold text-blue-300">📚 이 개념, 이렇게 정리하세요</p>
              <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
                {problem.deepDive}
              </pre>
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex items-center gap-2 flex-wrap">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-xs px-3 py-1.5 rounded-lg border border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all flex items-center gap-1.5"
              >
                🔄 다시 풀기
              </button>
            )}
            <button
              onClick={() => { addToRetry(problem.id); setRetryAdded(true) }}
              disabled={alreadyInQueue || retryAdded}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                alreadyInQueue || retryAdded
                  ? 'border-orange-500/30 bg-orange-500/10 text-orange-400 cursor-default'
                  : 'border-gray-700 hover:border-orange-500/50 hover:bg-orange-500/10 text-gray-400 hover:text-orange-400'
              }`}
            >
              📌 {alreadyInQueue || retryAdded ? '목록에 추가됨' : '나중에 다시 풀기'}
            </button>
          </div>

          {/* 연관 문제 */}
          {relatedProblems && relatedProblems.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold">🔗 연관 문제로 개념 다지기</p>
              <div className="flex flex-col gap-2">
                {relatedProblems.map((rp) => (
                  <Link
                    key={rp!.id}
                    href={`/problems/${rp!.id}`}
                    className="text-sm text-purple-300 hover:text-purple-200 bg-purple-500/5 border border-purple-500/20 rounded-lg px-4 py-2.5 transition-colors hover:bg-purple-500/10 flex items-center justify-between group"
                  >
                    <span>{rp!.title}</span>
                    <span className="text-purple-500 group-hover:translate-x-0.5 transition-transform">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
