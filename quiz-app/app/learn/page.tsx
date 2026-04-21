'use client'

import Link from 'next/link'
import { lessonsByCategory } from '@/data/lessons'
import { lessonCategoryMeta } from '@/types'
import type { LessonCategory } from '@/types'

const categories = Object.keys(lessonCategoryMeta) as LessonCategory[]

export default function LearnPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-white">학습 카드</h1>
        <p className="text-gray-400">
          문제 풀기 전에 개념부터 — 읽고 이해한 뒤 관련 문제로 실력을 확인하세요
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const meta = lessonCategoryMeta[category]
          const lessons = lessonsByCategory[category]
          const totalTime = lessons.reduce((sum, l) => sum + l.readingTime, 0)

          return (
            <Link
              key={category}
              href={`/learn/${category}`}
              className="group bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all hover:bg-gray-800/50"
            >
              <div className="flex items-start gap-4">
                <span className="text-4xl">{meta.emoji}</span>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                      {meta.label}
                    </h2>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${meta.color}`}>
                      {lessons.length}개
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{meta.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-500 pt-1">
                    <span>📚 {lessons.length}개 레슨</span>
                    <span>⏱️ 총 {totalTime}분</span>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {lessons.slice(0, 3).map((lesson) => (
                      <span
                        key={lesson.id}
                        className="text-xs bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full border border-gray-700"
                      >
                        {lesson.emoji} {lesson.title}
                      </span>
                    ))}
                    {lessons.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{lessons.length - 3}개 더
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-semibold text-white">학습 방법</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex gap-3">
            <span className="text-2xl">1️⃣</span>
            <div>
              <p className="text-white font-medium">개념 카드 읽기</p>
              <p className="text-gray-400 mt-0.5">핵심 개념을 예제 코드와 함께 학습</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">2️⃣</span>
            <div>
              <p className="text-white font-medium">핵심 포인트 확인</p>
              <p className="text-gray-400 mt-0.5">기억해야 할 핵심을 정리</p>
            </div>
          </div>
          <div className="flex gap-3">
            <span className="text-2xl">3️⃣</span>
            <div>
              <p className="text-white font-medium">관련 문제 풀기</p>
              <p className="text-gray-400 mt-0.5">학습한 내용을 문제로 검증</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
