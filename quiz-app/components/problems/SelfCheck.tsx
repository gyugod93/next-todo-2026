'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import type { Problem } from '@/types'
import CodeBlock from '@/components/CodeBlock'
import Explanation from '@/components/problems/Explanation'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false })

interface Props {
  problem: Problem
  onSubmit: (answer: string, correct: boolean) => void
  initialAnswer?: string
  onRetry?: () => void
}

type Phase = 'writing' | 'comparing' | 'done'

export default function SelfCheck({ problem, onSubmit, initialAnswer, onRetry }: Props) {
  const [code, setCode] = useState(initialAnswer ?? problem.code ?? '')
  const [phase, setPhase] = useState<Phase>(initialAnswer ? 'done' : 'writing')
  const [selfResult, setSelfResult] = useState<boolean | null>(null)
  const [showHints, setShowHints] = useState(false)

  const referenceAnswer = problem.correctAnswer as string

  const handleReveal = () => {
    if (!code.trim()) return
    setPhase('comparing')
  }

  const handleSelfMark = (correct: boolean) => {
    setSelfResult(correct)
    setPhase('done')
    onSubmit(code.trim(), correct)
  }

  return (
    <div className="space-y-5">
      {/* 스타터 코드 (있을 때만) */}
      {problem.code && phase === 'writing' && (
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">참고 코드</p>
          <CodeBlock code={problem.code} />
        </div>
      )}

      {/* 작성 단계 */}
      {phase === 'writing' && (
        <>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">
                직접 코드를 작성해보세요
              </p>
              <span className="text-xs text-gray-600 bg-gray-800 px-2 py-1 rounded">
                자유롭게 — 정답 공개 후 자가 평가
              </span>
            </div>
            <div className="rounded-lg overflow-hidden border border-gray-700">
              <MonacoEditor
                height="320px"
                language="typescript"
                theme="vs-dark"
                value={code}
                onChange={(val) => setCode(val ?? '')}
                loading={<div className="h-[320px] bg-[#1e1e1e] flex items-center justify-center text-gray-600 text-sm">에디터 로딩 중...</div>}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 12, bottom: 12 },
                  cursorBlinking: 'smooth',
                  placeholder: '여기에 코드를 작성하세요...',
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

          <button
            onClick={handleReveal}
            disabled={!code.trim()}
            className="w-full py-3 bg-violet-600 hover:bg-violet-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-semibold rounded-lg transition-colors"
          >
            작성 완료 — 모범 답안 보기
          </button>
        </>
      )}

      {/* 비교 단계 */}
      {phase === 'comparing' && (
        <div className="space-y-5">
          {/* 내 코드 */}
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>📝</span> 내가 작성한 코드
            </p>
            <div className="rounded-lg overflow-hidden border border-blue-500/30">
              <MonacoEditor
                height="240px"
                language="typescript"
                theme="vs-dark"
                value={code}
                loading={<div className="h-[240px] bg-[#1e1e1e] flex items-center justify-center text-gray-600 text-sm">에디터 로딩 중...</div>}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  lineNumbers: 'on',
                  readOnly: true,
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 12, bottom: 12 },
                }}
              />
            </div>
          </div>

          {/* 모범 답안 */}
          <div>
            <p className="text-xs text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>✅</span> 모범 답안
            </p>
            <CodeBlock code={referenceAnswer} />
          </div>

          {/* 해설 먼저 보기 */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 space-y-2">
            <p className="text-sm text-gray-300 font-medium">💬 해설</p>
            <p className="text-sm text-gray-400 leading-relaxed whitespace-pre-wrap">
              {problem.explanation}
            </p>
          </div>

          {/* 자가 평가 */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-5 space-y-3">
            <p className="text-sm text-gray-300 font-medium text-center">
              모범 답안과 비교해서 어떠세요?
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleSelfMark(true)}
                className="py-3 bg-green-600/20 hover:bg-green-600/30 border border-green-500/40 text-green-400 font-semibold rounded-lg transition-colors text-sm"
              >
                ✅ 핵심 개념은 맞게 이해했어요
              </button>
              <button
                onClick={() => handleSelfMark(false)}
                className="py-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-400 font-semibold rounded-lg transition-colors text-sm"
              >
                ❌ 아직 부족한 부분이 있어요
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 완료 단계 */}
      {phase === 'done' && (
        <div className="space-y-5">
          {/* 내 코드 요약 */}
          <div>
            <p className="text-xs text-blue-400 uppercase tracking-wider mb-2">내가 작성한 코드</p>
            <div className="rounded-lg overflow-hidden border border-blue-500/20">
              <MonacoEditor
                height="200px"
                language="typescript"
                theme="vs-dark"
                value={code}
                loading={<div className="h-[200px] bg-[#1e1e1e] flex items-center justify-center text-gray-600 text-sm">에디터 로딩 중...</div>}
                options={{
                  minimap: { enabled: false },
                  fontSize: 13,
                  readOnly: true,
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  wordWrap: 'on',
                  padding: { top: 12, bottom: 12 },
                }}
              />
            </div>
          </div>

          <div>
            <p className="text-xs text-green-400 uppercase tracking-wider mb-2">모범 답안</p>
            <CodeBlock code={referenceAnswer} />
          </div>

          <Explanation
            correct={selfResult ?? false}
            explanation={problem.explanation}
            deepDive={problem.deepDive}
            relatedProblemIds={problem.relatedProblems}
            problemId={problem.id}
            onRetry={onRetry}
          />
        </div>
      )}
    </div>
  )
}
