import { javascriptProblems } from './javascript'
import { reactProblems } from './react'
import { nextjsProblems } from './nextjs'
import { typescriptProblems } from './typescript'
import type { Problem, Category } from '@/types'

export const allProblems: Problem[] = [
  ...javascriptProblems,
  ...reactProblems,
  ...nextjsProblems,
  ...typescriptProblems,
]

export const problemsByCategory: Record<Category, Problem[]> = {
  javascript: javascriptProblems,
  react: reactProblems,
  nextjs: nextjsProblems,
  typescript: typescriptProblems,
}

export const categoryMeta: Record<
  Category,
  { label: string; description: string; color: string; emoji: string }
> = {
  javascript: {
    label: 'JavaScript',
    description: '클로저, 이벤트 루프, 타입 변환, 비동기, 프로토타입',
    color: 'bg-yellow-400 text-yellow-900',
    emoji: '⚡',
  },
  react: {
    label: 'React',
    description: 'Hooks, 렌더링 최적화, Context, Suspense, Concurrent',
    color: 'bg-cyan-400 text-cyan-900',
    emoji: '⚛️',
  },
  nextjs: {
    label: 'Next.js',
    description: 'App Router, 캐싱, Server Actions, Middleware, 메타데이터',
    color: 'bg-gray-100 text-gray-900',
    emoji: '▲',
  },
  typescript: {
    label: 'TypeScript',
    description: '타입 시스템, 제네릭, 유틸리티 타입, 조건부 타입',
    color: 'bg-blue-500 text-white',
    emoji: '🔷',
  },
}

export function getProblemById(id: string): Problem | undefined {
  return allProblems.find((p) => p.id === id)
}

export function getProblemsByCategory(category: Category): Problem[] {
  return problemsByCategory[category] ?? []
}

export { javascriptProblems, reactProblems, nextjsProblems, typescriptProblems }
