'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getLessonsByCategory } from '@/data/lessons'
import { lessonCategoryMeta } from '@/types'
import { getLearnedLessons } from '@/lib/storage'
import { useUserStore } from '@/store/userStore'
import type { LessonCategory } from '@/types'

export default function LearnCategoryPage() {
  const params = useParams()
  const category = params.category as LessonCategory
  const { username } = useUserStore()
  const [learnedIds, setLearnedIds] = useState<string[]>([])

  const meta = lessonCategoryMeta[category]
  const lessons = getLessonsByCategory(category)

  useEffect(() => {
    if (username) setLearnedIds(getLearnedLessons(username))
  }, [username])

  if (!meta) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">카테고리를 찾을 수 없습니다</p>
        <Link href="/learn" className="text-blue-400 hover:underline text-sm mt-2 inline-block">
          학습 홈으로
        </Link>
      </div>
    )
  }

  // subcategory별로 그룹화
  const grouped = lessons.reduce<Record<string, typeof lessons>>((acc, lesson) => {
    if (!acc[lesson.subcategory]) acc[lesson.subcategory] = []
    acc[lesson.subcategory].push(lesson)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/learn" className="hover:text-gray-300 transition-colors">학습</Link>
        <span>/</span>
        <span className="text-gray-400">{meta.label}</span>
      </div>

      {/* 헤더 */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-4xl">{meta.emoji}</span>
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">{meta.label}</h1>
            <p className="text-gray-400 text-sm">{meta.description}</p>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span>📚 {lessons.length}개 레슨</span>
              <span>⏱️ 총 {lessons.reduce((s, l) => s + l.readingTime, 0)}분</span>
            </div>
          </div>
        </div>
      </div>

      {/* 레슨 목록 */}
      {Object.entries(grouped).map(([subcategory, subLessons]) => (
        <div key={subcategory} className="space-y-3">
          <div className="flex items-center justify-between pl-1">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              {subcategory.replace(/-/g, ' ')}
            </h2>
            <span className="text-xs text-gray-600">
              {subLessons.filter((l) => learnedIds.includes(l.id)).length}/{subLessons.length} 완료
            </span>
          </div>
          <div className="space-y-3">
            {subLessons.map((lesson, index) => {
              const isLearned = learnedIds.includes(lesson.id)
              return (
              <Link
                key={lesson.id}
                href={`/learn/${category}/${lesson.id}`}
                className="group flex items-start gap-4 bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 hover:bg-gray-800/50 transition-all"
              >
                <div className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center text-sm font-medium ${isLearned ? 'bg-green-900/40 border-green-700/50 text-green-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                  {isLearned ? '✓' : index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{lesson.emoji}</span>
                      <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {lesson.title}
                      </h3>
                    </div>
                    <span className="flex-shrink-0 text-xs text-gray-500">
                      ⏱️ {lesson.readingTime}분
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">{lesson.description}</p>
                  {lesson.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {lesson.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded border border-gray-700"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span className="flex-shrink-0 text-gray-600 group-hover:text-gray-400 transition-colors text-lg">
                  →
                </span>
              </Link>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
