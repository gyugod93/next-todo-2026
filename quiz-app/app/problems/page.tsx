'use client'

import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { allProblems, categoryMeta } from '@/data/problems'
import ProblemCard from '@/components/ProblemCard'
import UserSetup from '@/components/UserSetup'
import type { Category, Difficulty, ProblemType } from '@/types'

const difficulties: { value: Difficulty | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'easy', label: '쉬움' },
  { value: 'medium', label: '보통' },
  { value: 'hard', label: '어려움' },
]

const types: { value: ProblemType | 'all'; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'multiple-choice', label: '객관식' },
  { value: 'code-output', label: '출력 예측' },
  { value: 'bug-find', label: '버그 찾기' },
  { value: 'code-complete', label: '코드 완성' },
]

export default function ProblemsPage() {
  const { username, progress, isLoaded, refreshProgress } = useUserStore()
  const [category, setCategory] = useState<Category | 'all'>('all')
  const [difficulty, setDifficulty] = useState<Difficulty | 'all'>('all')
  const [type, setType] = useState<ProblemType | 'all'>('all')
  const [showSolved, setShowSolved] = useState(true)

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

  const solvedProblems = progress?.solvedProblems ?? {}

  const filtered = allProblems.filter((p) => {
    if (category !== 'all' && p.category !== category) return false
    if (difficulty !== 'all' && p.difficulty !== difficulty) return false
    if (type !== 'all' && p.type !== type) return false
    if (!showSolved && solvedProblems[p.id]?.correct) return false
    return true
  })

  const filterBtn = (active: boolean) =>
    `px-3 py-1.5 rounded-lg text-sm transition-colors ${
      active
        ? 'bg-blue-600 text-white'
        : 'bg-gray-800 text-gray-400 hover:text-white'
    }`

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">문제 목록</h1>
        <span className="text-gray-500 text-sm">{filtered.length}문제</span>
      </div>

      {/* 필터 */}
      <div className="space-y-3">
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setCategory('all')}
            className={filterBtn(category === 'all')}
          >
            전체
          </button>
          {(Object.keys(categoryMeta) as Category[]).map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={filterBtn(category === c)}
            >
              {categoryMeta[c].emoji} {categoryMeta[c].label}
            </button>
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {difficulties.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value as Difficulty | 'all')}
              className={filterBtn(difficulty === d.value)}
            >
              {d.label}
            </button>
          ))}
          <div className="w-px bg-gray-800 mx-1" />
          {types.map((t) => (
            <button
              key={t.value}
              onClick={() => setType(t.value as ProblemType | 'all')}
              className={filterBtn(type === t.value)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <label className="inline-flex items-center gap-2 text-sm text-gray-400 cursor-pointer">
          <input
            type="checkbox"
            checked={showSolved}
            onChange={(e) => setShowSolved(e.target.checked)}
            className="rounded"
          />
          정답 맞힌 문제 포함
        </label>
      </div>

      {/* 문제 목록 */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-600">
          <p className="text-4xl mb-3">🎯</p>
          <p>조건에 맞는 문제가 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              solvedResult={solvedProblems[problem.id]}
            />
          ))}
        </div>
      )}
    </div>
  )
}
