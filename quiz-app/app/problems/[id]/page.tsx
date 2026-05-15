'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useUserStore } from '@/store/userStore'
import { getProblemById, allProblems, categoryMeta } from '@/data/problems'
import { allLessons } from '@/data/lessons'
import MultipleChoice from '@/components/problems/MultipleChoice'
import CodeOutputQuiz from '@/components/problems/CodeOutputQuiz'
import BugFinder from '@/components/problems/BugFinder'
import CodeComplete from '@/components/problems/CodeComplete'
import CodeFix from '@/components/problems/CodeFix'
import SelfCheck from '@/components/problems/SelfCheck'
import CssVisual from '@/components/problems/CssVisual'
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

  const { username, progress, isLoaded, retryQueue, refreshProgress, submitAnswer } =
    useUserStore()
  const [submitted, setSubmitted] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    refreshProgress()
  }, [refreshProgress])

  // retry 카운트 증가 시 제출 상태 초기화
  useEffect(() => {
    if (retryCount > 0) setSubmitted(false)
  }, [retryCount])

  // 틀린 문제에 재접속하면 자동으로 retry 모드 진입 (초기 로드 시에만 체크)
  useEffect(() => {
    if (isLoaded && progress?.solvedProblems[id]?.correct === false && retryCount === 0) {
      setRetryCount(1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, id])

  const problem = getProblemById(id)
  const solvedResult: SolvedResult | undefined = progress?.solvedProblems[id]
  const isInRetryQueue = retryQueue.includes(id)

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

  // 이 문제를 relatedProblemIds에서 참조하는 학습 카드
  const relatedLessons = allLessons.filter((l) =>
    l.relatedProblemIds?.includes(id)
  )

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

  // retry 모드일 때는 initialAnswer 전달 안 함 → 컴포넌트 신선하게 시작
  const initialAnswer = retryCount > 0 ? undefined : solvedResult?.userAnswer

  const handleRetry = () => setRetryCount((c) => c + 1)
  const sharedProps = { problem, onSubmit: handleSubmit, onRetry: handleRetry }

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

      {/* 다시 풀기 배너 */}
      {isInRetryQueue && retryCount === 0 && (
        <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">📌</span>
            <div>
              <p className="text-orange-300 text-sm font-medium">다시 풀기 목록에 있는 문제</p>
              <p className="text-orange-400/60 text-xs">처음부터 다시 도전해서 개념을 확실히 잡아보세요</p>
            </div>
          </div>
          <button
            onClick={() => setRetryCount((c) => c + 1)}
            className="shrink-0 text-sm bg-orange-500 hover:bg-orange-400 text-white px-4 py-2 rounded-lg transition-colors font-medium"
          >
            다시 도전하기
          </button>
        </div>
      )}

      {/* 다시 도전 중 배너 */}
      {retryCount > 0 && !submitted && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 flex items-center gap-2">
          <span className="text-blue-400 text-sm">🔄</span>
          <p className="text-blue-300 text-sm">다시 도전 중 — 이번엔 맞춰보세요!</p>
        </div>
      )}

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
          {solvedResult && retryCount === 0 && (
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
          {retryCount > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full text-orange-400 bg-orange-400/10">
              재도전
            </span>
          )}
        </div>

        <h1 className="text-xl font-bold text-white">{problem.title}</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          {problem.description}
        </p>

        {/* 관련 학습 카드 */}
        {relatedLessons.length > 0 && (
          <div className="pt-2 flex flex-wrap gap-2">
            {relatedLessons.map((lesson) => (
              <Link
                key={lesson.id}
                href={`/learn/${lesson.category}/${lesson.id}`}
                className="flex items-center gap-1.5 text-xs bg-violet-900/30 text-violet-300 border border-violet-700/40 px-3 py-1.5 rounded-lg hover:bg-violet-900/50 transition-colors"
              >
                <span>📖</span>
                <span>개념 먼저 보기: {lesson.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 문제 본문 */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        {problem.type === 'multiple-choice' && (
          <MultipleChoice
            key={`${id}-${retryCount}`}
            {...sharedProps}
            initialAnswer={
              initialAnswer !== undefined ? (initialAnswer as number) : undefined
            }
          />
        )}
        {problem.type === 'code-output' && (
          <CodeOutputQuiz
            key={`${id}-${retryCount}`}
            {...sharedProps}
            initialAnswer={
              initialAnswer !== undefined ? (initialAnswer as number) : undefined
            }
          />
        )}
        {problem.type === 'bug-find' && problem.options ? (
          // options가 있는 bug-find → 코드+선택지 형태로 렌더링
          <MultipleChoice
            key={`${id}-${retryCount}`}
            {...sharedProps}
            initialAnswer={
              initialAnswer !== undefined ? (initialAnswer as number) : undefined
            }
          />
        ) : problem.type === 'bug-find' && (
          // options 없는 bug-find → 직접 코드 수정 에디터
          <BugFinder
            key={`${id}-${retryCount}`}
            {...sharedProps}
            initialAnswer={
              initialAnswer !== undefined ? (initialAnswer as string) : undefined
            }
          />
        )}
        {problem.type === 'code-complete' && (
          <CodeComplete
            key={`${id}-${retryCount}`}
            {...sharedProps}
            initialAnswer={
              initialAnswer !== undefined ? (initialAnswer as string) : undefined
            }
          />
        )}
        {problem.type === 'code-fix' && (
          <CodeFix
            key={`${id}-${retryCount}`}
            {...sharedProps}
            initialAnswer={
              initialAnswer !== undefined ? (initialAnswer as string) : undefined
            }
          />
        )}
        {problem.type === 'self-check' && (
          <SelfCheck
            key={`${id}-${retryCount}`}
            {...sharedProps}
            initialAnswer={
              initialAnswer !== undefined ? (initialAnswer as string) : undefined
            }
          />
        )}
        {problem.type === 'css-visual' && (
          <CssVisual
            key={`${id}-${retryCount}`}
            {...sharedProps}
            initialAnswer={
              initialAnswer !== undefined ? (initialAnswer as string) : undefined
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
