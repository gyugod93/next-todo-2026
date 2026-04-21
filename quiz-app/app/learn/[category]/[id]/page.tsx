'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getLessonById, getLessonsByCategory } from '@/data/lessons'
import { getProblemById } from '@/data/problems'
import { lessonCategoryMeta } from '@/types'
import { markLessonLearned, isLessonLearned } from '@/lib/storage'
import { useUserStore } from '@/store/userStore'
import type { LessonCategory } from '@/types'

export default function LessonDetailPage() {
  const params = useParams()
  const category = params.category as LessonCategory
  const id = params.id as string
  const { username } = useUserStore()
  const [learned, setLearned] = useState(false)

  const lesson = getLessonById(id)
  const meta = lessonCategoryMeta[category]
  useEffect(() => {
    if (username && id) {
      setLearned(isLessonLearned(username, id))
    }
  }, [username, id])

  // 페이지 진입 3초 후 자동으로 완료 표시
  useEffect(() => {
    if (!username || !id) return
    const timer = setTimeout(() => {
      markLessonLearned(username, id)
      setLearned(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [username, id])

  const allCategoryLessons = getLessonsByCategory(category)
  const currentIndex = allCategoryLessons.findIndex((l) => l.id === id)
  const prevLesson = currentIndex > 0 ? allCategoryLessons[currentIndex - 1] : null
  const nextLesson =
    currentIndex < allCategoryLessons.length - 1
      ? allCategoryLessons[currentIndex + 1]
      : null

  if (!lesson || !meta) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-400">레슨을 찾을 수 없습니다</p>
        <Link href="/learn" className="text-blue-400 hover:underline text-sm mt-2 inline-block">
          학습 홈으로
        </Link>
      </div>
    )
  }

  const relatedProblems = (lesson.relatedProblemIds ?? [])
    .map((pid) => getProblemById(pid))
    .filter(Boolean)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* 브레드크럼 */}
      <div className="flex items-center gap-2 text-sm text-gray-500 flex-wrap">
        <Link href="/learn" className="hover:text-gray-300 transition-colors">학습</Link>
        <span>/</span>
        <Link href={`/learn/${category}`} className="hover:text-gray-300 transition-colors">
          {meta.label}
        </Link>
        <span>/</span>
        <span className="text-gray-400 truncate">{lesson.title}</span>
      </div>

      {/* 헤더 */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{lesson.emoji}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${meta.color}`}>
                {meta.label}
              </span>
              <span className="text-xs text-gray-500">⏱️ {lesson.readingTime}분</span>
              {learned && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-900/50 text-green-400 border border-green-700/50">
                  ✓ 학습 완료
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-white">{lesson.title}</h1>
          </div>
        </div>
        <p className="text-gray-400">{lesson.description}</p>
      </div>

      {/* 섹션 */}
      <div className="space-y-8">
        {lesson.sections.map((section, idx) => (
          <div key={idx} className="space-y-3">
            <h2 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">
              {section.title}
            </h2>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
              {section.content}
            </div>
            {section.code && (
              <div className="relative">
                <div className="flex items-center justify-between bg-gray-800 rounded-t-lg px-4 py-2 border border-gray-700 border-b-0">
                  <span className="text-xs text-gray-400 font-mono">
                    {section.language ?? 'code'}
                  </span>
                </div>
                <pre className="bg-gray-900 border border-gray-700 rounded-b-lg p-4 overflow-x-auto">
                  <code className="text-sm text-gray-200 font-mono leading-relaxed">
                    {section.code}
                  </code>
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 핵심 포인트 */}
      <div className="bg-blue-950/30 border border-blue-800/40 rounded-xl p-5 space-y-3">
        <h2 className="text-base font-semibold text-blue-300 flex items-center gap-2">
          <span>💡</span>
          핵심 포인트
        </h2>
        <ul className="space-y-2">
          {lesson.keyPoints.map((point, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm text-blue-100">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">✓</span>
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* 관련 문제 */}
      {relatedProblems.length > 0 && (
        <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-5 space-y-3">
          <h2 className="text-base font-semibold text-purple-300 flex items-center gap-2">
            <span>🎯</span>
            관련 문제로 실력 확인
          </h2>
          <div className="space-y-2">
            {relatedProblems.map((problem) => (
              <Link
                key={problem!.id}
                href={`/problems/${problem!.id}`}
                className="flex items-center justify-between bg-purple-900/20 rounded-lg px-4 py-2.5 hover:bg-purple-900/40 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-purple-800/50 text-purple-300 px-2 py-0.5 rounded">
                    {problem!.difficulty}
                  </span>
                  <span className="text-sm text-purple-100">{problem!.title}</span>
                </div>
                <span className="text-purple-400 group-hover:text-purple-200 transition-colors">→</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* 이전 / 다음 레슨 */}
      <div className="flex gap-3 pt-2">
        {prevLesson ? (
          <Link
            href={`/learn/${category}/${prevLesson.id}`}
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-all group"
          >
            <p className="text-xs text-gray-500 mb-1">← 이전 레슨</p>
            <p className="text-sm text-white group-hover:text-blue-400 transition-colors font-medium">
              {prevLesson.emoji} {prevLesson.title}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {nextLesson ? (
          <Link
            href={`/learn/${category}/${nextLesson.id}`}
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-all group text-right"
          >
            <p className="text-xs text-gray-500 mb-1">다음 레슨 →</p>
            <p className="text-sm text-white group-hover:text-blue-400 transition-colors font-medium">
              {nextLesson.emoji} {nextLesson.title}
            </p>
          </Link>
        ) : (
          <Link
            href={`/learn/${category}`}
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-all group text-right"
          >
            <p className="text-xs text-gray-500 mb-1">완료</p>
            <p className="text-sm text-white group-hover:text-blue-400 transition-colors font-medium">
              {meta.label} 목록으로 →
            </p>
          </Link>
        )}
      </div>
    </div>
  )
}
