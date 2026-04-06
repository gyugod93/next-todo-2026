'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserStore } from '@/store/userStore'
import { getProblemById, allProblems, categoryMeta } from '@/data/problems'
import MultipleChoice from '@/components/problems/MultipleChoice'
import CodeOutputQuiz from '@/components/problems/CodeOutputQuiz'
import BugFinder from '@/components/problems/BugFinder'
import CodeComplete from '@/components/problems/CodeComplete'
import UserSetup from '@/components/UserSetup'
import type { SolvedResult } from '@/types'

const difficultyLabel = {
  easy: { text: '쉬움', cls: 'text-green-400 bg-green-400/10' },
  medium: { text: '보통', cls: 'text-yellow-400 bg-yellow-400/10' },
  hard: { text: '어려움', cls: 'text-red-400 bg-red-400/10' },
}

export default function ProblemPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const { username, progress, isLoaded, refreshProgress, submitAnswer } =
    useUserStore()
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    refreshProgress()
  }, [refreshProgress])

  const problem = getProblemById(id)
  const solvedResult: SolvedResult | undefined = progress?.solvedProblems[id]

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!username) return <UserSetup />

  if (!problem) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">문제를 찾을 수 없습니다</p>
        <Link
          href="/problems"
          className="text-blue-400 hover:underline text-sm mt-2 inline-block"
        >
          목록으로
        </Link>
      </div>
    )
  }

  const meta = categoryMeta[problem.category]
  const diff = difficultyLabel[problem.difficulty]

  const currentIndex = allProblems.findIndex((p) => p.id === id)
  const nextProblem = allProblems[currentIndex + 1]
  const prevProblem = allProblems[currentIndex - 1]

  const handleSubmit = (answer: string | number, correct: boolean) => {
    setSubmitted(true)
    submitAnswer({
      problemId: id,
      correct,
      userAnswer: answer,
      solvedAt: Date.now(),
    })
  }

  const sharedProps = {
    problem,
    onSubmit: handleSubmit,
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-300 transition-colors">
          홈
        </Link>
        <span>/</span>
        <Link
          href={`/categories/${problem.category}`}
          className="hover:text-gray-300 transition-colors"
        >
          {meta.label}
        </Link>
        <span>/</span>
        <span className="text-gray-400">{problem.title}</span>
      </div>

      {/* 문제 헤더 */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-lg">{meta.emoji}</span>
          <span className="text-sm text-gray-500">{meta.label}</span>
          <span className="text-gray-700">·</span>
          <span className="text-sm text-gray-500">{problem.subcategory}</span>
          <span
            className={`ml-auto text-xs px-2 py-0.5 rounded-full font-medium ${diff.cls}`}
          >
            {diff.text}
          </span>
          {solvedResult && (
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                solvedResult.correct
                  ? 'text-green-400 bg-green-400/10'
                  : 'text-red-400 bg-red-400/10'
              }`}
            >
              {solvedResult.correct ? '✓ 정답' : '✗ 오답'}
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold text-white">{problem.title}</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          {problem.description}
        </p>
      </div>

      {/* 문제 본문 */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        {problem.type === 'multiple-choice' && (
          <MultipleChoice
            {...sharedProps}
            initialAnswer={
              solvedResult?.userAnswer !== undefined
                ? (solvedResult.userAnswer as number)
                : undefined
            }
          />
        )}
        {problem.type === 'code-output' && (
          <CodeOutputQuiz
            {...sharedProps}
            initialAnswer={
              solvedResult?.userAnswer !== undefined
                ? (solvedResult.userAnswer as number)
                : undefined
            }
          />
        )}
        {problem.type === 'bug-find' && (
          <BugFinder
            {...sharedProps}
            initialAnswer={
              solvedResult?.userAnswer !== undefined
                ? (solvedResult.userAnswer as string)
                : undefined
            }
          />
        )}
        {problem.type === 'code-complete' && (
          <CodeComplete
            {...sharedProps}
            initialAnswer={
              solvedResult?.userAnswer !== undefined
                ? (solvedResult.userAnswer as string)
                : undefined
            }
          />
        )}
      </div>

      {/* 이전/다음 */}
      <div className="flex gap-3">
        {prevProblem ? (
          <Link
            href={`/problems/${prevProblem.id}`}
            className="flex-1 text-center py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-xl transition-colors"
          >
            ← 이전 문제
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        <Link
          href="/problems"
          className="px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-xl transition-colors"
        >
          목록
        </Link>
        {nextProblem ? (
          <Link
            href={`/problems/${nextProblem.id}`}
            className="flex-1 text-center py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded-xl transition-colors"
          >
            다음 문제 →
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  )
}
