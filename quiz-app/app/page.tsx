'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { useUserStore } from '@/store/userStore'
import { categoryMeta, allProblems } from '@/data/problems'
import ProgressBar from '@/components/ProgressBar'
import UserSetup from '@/components/UserSetup'
import type { Category } from '@/types'

export default function HomePage() {
  const { username, progress, isLoaded, refreshProgress } = useUserStore()

  useEffect(() => {
    refreshProgress()
  }, [refreshProgress])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!username) return <UserSetup />

  const solved = Object.values(progress?.solvedProblems ?? {})
  const totalSolved = solved.length
  const correctCount = solved.filter((s) => s.correct).length
  const totalProblems = allProblems.length

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">
          안녕하세요, <span className="text-blue-400">{username}</span>님 👋
        </h1>
        <p className="text-gray-400">
          오늘도 한 문제 풀어볼까요? 개념은 직접 풀어야 머리에 남습니다.
        </p>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-white">전체 진행률</h2>
          <span className="text-2xl font-bold text-white">
            {correctCount * 10}
            <span className="text-sm text-gray-400 font-normal"> 점</span>
          </span>
        </div>
        <ProgressBar
          total={totalProblems}
          solved={totalSolved}
          correct={correctCount}
        />
      </div>

      <div>
        <h2 className="font-semibold text-white mb-4">카테고리</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(Object.keys(categoryMeta) as Category[]).map((category) => {
            const meta = categoryMeta[category]
            const categoryProblems = allProblems.filter(
              (p) => p.category === category,
            )
            const categorySolved = solved.filter((s) =>
              categoryProblems.some((p) => p.id === s.problemId),
            )
            const categoryCorrect = categorySolved.filter((s) => s.correct)

            return (
              <Link key={category} href={`/categories/${category}`}>
                <div className="bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-2xl p-6 transition-all hover:-translate-y-0.5 cursor-pointer group">
                  <div className="text-3xl mb-3">{meta.emoji}</div>
                  <h3 className="font-bold text-white text-lg mb-1 group-hover:text-blue-400 transition-colors">
                    {meta.label}
                  </h3>
                  <p className="text-gray-500 text-xs mb-4">{meta.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">
                      {categorySolved.length}/{categoryProblems.length} 풀이
                    </span>
                    <span className="text-green-400">
                      {categoryCorrect.length} 정답
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className="bg-blue-500 h-full rounded-full transition-all"
                      style={{
                        width:
                          categoryProblems.length > 0
                            ? `${(categorySolved.length / categoryProblems.length) * 100}%`
                            : '0%',
                      }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="flex gap-3">
        <Link
          href="/problems"
          className="flex-1 text-center py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-colors"
        >
          전체 문제 보기
        </Link>
        <Link
          href="/leaderboard"
          className="flex-1 text-center py-3 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition-colors"
        >
          리더보드
        </Link>
      </div>
    </div>
  )
}
