'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getProblemById } from '@/data/problems'
import { useUserStore } from '@/store/userStore'

interface Props {
  correct: boolean
  explanation: string
  deepDive?: string
  relatedProblemIds?: string[]
  problemId?: string
  onRetry?: () => void
}

export default function Explanation({
  correct,
  explanation,
  deepDive,
  relatedProblemIds,
  problemId,
  onRetry,
}: Props) {
  const [retryAdded, setRetryAdded] = useState(false)
  const { addToRetry, retryQueue } = useUserStore()

  const relatedProblems = relatedProblemIds
    ?.map((id) => getProblemById(id))
    .filter(Boolean)

  const alreadyInQueue = problemId ? retryQueue.includes(problemId) : false

  const handleAddToRetry = () => {
    if (problemId) {
      addToRetry(problemId)
      setRetryAdded(true)
    }
  }

  return (
    <div
      className={`rounded-xl border p-5 space-y-4 ${
        correct
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-red-500/30 bg-red-500/5'
      }`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{correct ? '✅' : '❌'}</span>
          <span
            className={`font-semibold ${correct ? 'text-green-400' : 'text-red-400'}`}
          >
            {correct ? '정답입니다!' : '오답입니다'}
          </span>
        </div>

        {/* 오답 액션 버튼 */}
        {!correct && (
          <div className="flex items-center gap-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="text-xs px-3 py-1.5 rounded-lg border border-blue-500/50 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <span>🔄</span>
                <span>바로 다시 풀기</span>
              </button>
            )}
            {problemId && (
              <button
                onClick={handleAddToRetry}
                disabled={alreadyInQueue || retryAdded}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 ${
                  alreadyInQueue || retryAdded
                    ? 'border-orange-500/30 bg-orange-500/10 text-orange-400 cursor-default'
                    : 'border-gray-700 hover:border-orange-500/50 hover:bg-orange-500/10 text-gray-400 hover:text-orange-400'
                }`}
              >
                <span>📌</span>
                <span>{alreadyInQueue || retryAdded ? '목록에 추가됨' : '나중에 다시 풀기'}</span>
              </button>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-gray-800 pt-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          해설
        </p>
        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
          {explanation}
        </pre>
      </div>

      {!correct && deepDive && (
        <div className="border-t border-gray-800 pt-4 space-y-2">
          <p className="text-xs text-blue-400 uppercase tracking-wider font-semibold">
            📚 심화 학습
          </p>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
            {deepDive}
          </pre>
        </div>
      )}

      {!correct && relatedProblems && relatedProblems.length > 0 && (
        <div className="border-t border-gray-800 pt-4 space-y-2">
          <p className="text-xs text-purple-400 uppercase tracking-wider font-semibold">
            🔗 연관 문제로 개념 다지기
          </p>
          <div className="flex flex-col gap-2">
            {relatedProblems.map((rp) => (
              <Link
                key={rp!.id}
                href={`/problems/${rp!.id}`}
                className="text-sm text-purple-300 hover:text-purple-200 bg-purple-500/5 border border-purple-500/20 rounded-lg px-4 py-2.5 transition-colors hover:bg-purple-500/10 flex items-center justify-between group"
              >
                <span>{rp!.title}</span>
                <span className="text-purple-500 group-hover:translate-x-0.5 transition-transform">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
