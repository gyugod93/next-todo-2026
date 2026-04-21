'use client'

import { useState } from 'react'
import type { Problem } from '@/types'
import CodeBlock from '@/components/CodeBlock'
import Explanation from '@/components/problems/Explanation'

interface Props {
  problem: Problem
  onSubmit: (answer: number, correct: boolean) => void
  initialAnswer?: number
}

export default function MultipleChoice({ problem, onSubmit, initialAnswer }: Props) {
  const [selected, setSelected] = useState<number | null>(
    initialAnswer !== undefined ? initialAnswer : null,
  )
  const [submitted, setSubmitted] = useState(initialAnswer !== undefined)

  const correctIndex = problem.correctAnswer as number

  const handleSubmit = () => {
    if (selected === null) return
    setSubmitted(true)
    onSubmit(selected, selected === correctIndex)
  }

  const optionStyle = (index: number) => {
    if (!submitted) {
      return selected === index
        ? 'border-blue-500 bg-blue-500/10 text-white'
        : 'border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white cursor-pointer'
    }
    if (index === correctIndex) return 'border-green-500 bg-green-500/10 text-green-300'
    if (index === selected) return 'border-red-500 bg-red-500/10 text-red-300'
    return 'border-gray-800 text-gray-600'
  }

  return (
    <div className="space-y-6">
      {problem.code && <CodeBlock code={problem.code} />}

      <div className="space-y-3">
        {problem.options!.map((option, index) => (
          <button
            key={index}
            onClick={() => !submitted && setSelected(index)}
            disabled={submitted}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 text-sm ${optionStyle(index)}`}
          >
            <span className="font-mono text-gray-500 mr-3">
              {String.fromCharCode(65 + index)}.
            </span>
            {option}
          </button>
        ))}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={selected === null}
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 text-white font-semibold rounded-lg transition-colors"
        >
          제출하기
        </button>
      )}

      {submitted && (
        <Explanation
          correct={selected === correctIndex}
          explanation={problem.explanation}
          deepDive={problem.deepDive}
          relatedProblemIds={problem.relatedProblems}
          problemId={problem.id}
        />
      )}
    </div>
  )
}
