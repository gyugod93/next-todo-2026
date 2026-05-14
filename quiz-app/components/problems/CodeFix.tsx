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

/** 핵심 패턴들이 수정된 코드에 포함되어 있는지 확인
 *  correctAnswer를 줄 단위로 쪼개 각 줄이 핵심 패턴인지 판별 */
function evaluate(userCode: string, correctAnswer: string): boolean {
  const normalize = (s: string) => s.replace(/\s+/g, ' ').trim()
  const userNorm = normalize(userCode)

  // correctAnswer가 짧으면(핵심 패턴) 포함 여부로 판단
  if (correctAnswer.length <= 120) {
    return userNorm.includes(normalize(correctAnswer))
  }

  // 길면 각 줄 중 "핵심 줄"(비어있지 않고 주석 아닌 것)의 80% 이상 포함
  const keyLines = correctAnswer
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 4 && !l.startsWith('//') && !l.startsWith('*'))
  if (keyLines.length === 0) return false
  const matched = keyLines.filter((l) => userNorm.includes(normalize(l)))
  return matched.length / keyLines.length >= 0.75
}

export default function CodeFix({ problem, onSubmit, initialAnswer, onRetry }: Props) {
  const [code, setCode] = useState(initialAnswer ?? problem.code ?? '')
  const [submitted, setSubmitted] = useState(!!initialAnswer)
  const [showHints, setShowHints] = useState(false)

  const correctAnswer = problem.correctAnswer as string

  const handleSubmit = () => {
    const trimmed = code.trim()
    const correct = evaluate(trimmed, correctAnswer)
    setSubmitted(true)
    onSubmit(trimmed, correct)
  }

  const handleReset = () => setCode(problem.code ?? '')

  return (
    <div className="space-y-5">
      {/* 수정 대상 코드 — 읽기 전용 표시 */}
      <div>
        <p className="text-xs text-red-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span>🐛</span> 버그가 있는 코드
        </p>
        <CodeBlock code={problem.code!} />
      </div>

      {/* 직접 수정하는 에디터 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400">
            위 코드를 수정하세요
          </p>
          {!submitted && (
            <button
              onClick={handleReset}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              원본으로 초기화
            </button>
          )}
        </div>
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <MonacoEditor
            height="300px"
            language="typescript"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val ?? '')}
            loading={<div className="h-[300px] bg-[#1e1e1e] flex items-center justify-center text-gray-600 text-sm">에디터 로딩 중...</div>}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              readOnly: submitted,
              padding: { top: 12, bottom: 12 },
              renderLineHighlight: 'line',
              cursorBlinking: 'smooth',
            }}
          />
        </div>
      </div>

      {/* 힌트 */}
      {problem.hints && problem.hints.length > 0 && !submitted && (
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

      {/* 제출 */}
      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!code.trim()}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          수정 완료 — 제출하기
        </button>
      )}

      {/* 결과 */}
      {submitted && (
        <>
          <div>
            <p className="text-xs text-green-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span>✅</span> 정답 코드
            </p>
            <CodeBlock code={correctAnswer} />
          </div>
          <Explanation
            correct={evaluate(code.trim(), correctAnswer)}
            explanation={problem.explanation}
            deepDive={problem.deepDive}
            relatedProblemIds={problem.relatedProblems}
            problemId={problem.id}
            onRetry={onRetry}
          />
        </>
      )}
    </div>
  )
}
