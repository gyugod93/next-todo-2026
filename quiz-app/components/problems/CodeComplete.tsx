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
}

export default function CodeComplete({ problem, onSubmit, initialAnswer }: Props) {
  const [code, setCode] = useState(initialAnswer ?? problem.code ?? '')
  const [submitted, setSubmitted] = useState(!!initialAnswer)
  const [showHints, setShowHints] = useState(false)

  const correctAnswer = problem.correctAnswer as string

  const handleSubmit = () => {
    const trimmed = code.trim()
    const correct = normalizeCode(trimmed) === normalizeCode(correctAnswer)
    setSubmitted(true)
    onSubmit(trimmed, correct)
  }

  const handleReset = () => {
    setCode(problem.code ?? '')
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-400">코드를 완성하세요</p>
          {!submitted && (
            <button
              onClick={handleReset}
              className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              초기화
            </button>
          )}
        </div>
        <div className="rounded-lg overflow-hidden border border-gray-700">
          <MonacoEditor
            height="320px"
            language="javascript"
            theme="vs-dark"
            value={code}
            onChange={(val) => setCode(val ?? '')}
            options={{
              minimap: { enabled: false },
              fontSize: 13,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              readOnly: submitted,
              padding: { top: 12, bottom: 12 },
            }}
          />
        </div>
      </div>

      {problem.hints && problem.hints.length > 0 && !submitted && (
        <button
          onClick={() => setShowHints(!showHints)}
          className="text-sm text-gray-500 hover:text-yellow-400 transition-colors flex items-center gap-1"
        >
          💡 {showHints ? '힌트 숨기기' : '힌트 보기'}
        </button>
      )}

      {showHints && problem.hints && (
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4 space-y-1">
          {problem.hints.map((hint, i) => (
            <p key={i} className="text-yellow-400 text-sm">
              {i + 1}. {hint}
            </p>
          ))}
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!code.trim()}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          제출하기
        </button>
      )}

      {submitted && (
        <>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
              모범 답안
            </p>
            <CodeBlock code={correctAnswer} />
          </div>
          <Explanation
            correct={normalizeCode(code.trim()) === normalizeCode(correctAnswer)}
            explanation={problem.explanation}
          />
        </>
      )}
    </div>
  )
}

function normalizeCode(code: string): string {
  return code.replace(/\s+/g, ' ').trim()
}
