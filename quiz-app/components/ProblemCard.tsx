import Link from 'next/link'
import type { Problem } from '@/types'
import type { SolvedResult } from '@/types'

interface Props {
  problem: Problem
  solvedResult?: SolvedResult
}

const difficultyConfig = {
  easy: { label: '쉬움', color: 'text-green-400 bg-green-400/10' },
  medium: { label: '보통', color: 'text-yellow-400 bg-yellow-400/10' },
  hard: { label: '어려움', color: 'text-red-400 bg-red-400/10' },
}

const typeConfig = {
  'multiple-choice': { label: '객관식', icon: '📝' },
  'code-output': { label: '출력 예측', icon: '💻' },
  'bug-find': { label: '버그 찾기', icon: '🐛' },
  'code-complete': { label: '코드 완성', icon: '✏️' },
}

export default function ProblemCard({ problem, solvedResult }: Props) {
  const diff = difficultyConfig[problem.difficulty]
  const type = typeConfig[problem.type]
  const isSolved = !!solvedResult
  const isCorrect = solvedResult?.correct

  return (
    <Link href={`/problems/${problem.id}`}>
      <div
        className={`
          group relative bg-gray-900 border rounded-xl p-5 transition-all duration-200
          hover:border-blue-500 hover:-translate-y-0.5 cursor-pointer
          ${isSolved ? (isCorrect ? 'border-green-800' : 'border-red-800') : 'border-gray-800'}
        `}
      >
        {isSolved && (
          <div
            className={`absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-sm
            ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}
          >
            {isCorrect ? '✓' : '✗'}
          </div>
        )}

        <div className="flex items-start gap-3 mb-3">
          <span className="text-2xl">{type.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white text-sm leading-snug group-hover:text-blue-400 transition-colors truncate">
              {problem.title}
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">{problem.subcategory}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-medium ${diff.color}`}
          >
            {diff.label}
          </span>
          <span className="text-xs text-gray-600">{type.label}</span>
          {solvedResult && (
            <span className="text-xs text-gray-600 ml-auto">
              {solvedResult.attempts}번 시도
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
