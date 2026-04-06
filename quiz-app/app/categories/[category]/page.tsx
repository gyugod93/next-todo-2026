'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useUserStore } from '@/store/userStore'
import { getProblemsByCategory, categoryMeta } from '@/data/problems'
import ProblemCard from '@/components/ProblemCard'
import ProgressBar from '@/components/ProgressBar'
import UserSetup from '@/components/UserSetup'
import type { Category } from '@/types'

export default function CategoryPage() {
  const params = useParams()
  const category = params.category as Category

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

  const meta = categoryMeta[category]
  const problems = getProblemsByCategory(category)
  const solvedProblems = progress?.solvedProblems ?? {}

  if (!meta) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">카테고리를 찾을 수 없습니다</p>
        <Link href="/" className="text-blue-400 hover:underline text-sm mt-2 inline-block">
          홈으로
        </Link>
      </div>
    )
  }

  const solved = problems.filter((p) => solvedProblems[p.id])
  const correct = problems.filter((p) => solvedProblems[p.id]?.correct)

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-gray-300 transition-colors">홈</Link>
        <span>/</span>
        <span className="text-gray-400">{meta.label}</span>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{meta.emoji}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-white mb-1">{meta.label}</h1>
            <p className="text-gray-400 text-sm">{meta.description}</p>
          </div>
        </div>
        <ProgressBar
          total={problems.length}
          solved={solved.length}
          correct={correct.length}
        />
      </div>

      <div>
        <h2 className="font-semibold text-white mb-4">
          문제 목록 <span className="text-gray-500 font-normal text-sm">({problems.length}개)</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {problems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              solvedResult={solvedProblems[problem.id]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
