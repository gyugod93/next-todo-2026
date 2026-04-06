import { javascriptProblems } from './javascript'
import { reactProblems } from './react'
import { nextjsProblems } from './nextjs'
import type { Problem, Category } from '@/types'

export const allProblems: Problem[] = [
  ...javascriptProblems,
  ...reactProblems,
  ...nextjsProblems,
]

export const problemsByCategory: Record<Category, Problem[]> = {
  javascript: javascriptProblems,
  react: reactProblems,
  nextjs: nextjsProblems,
}

export const categoryMeta: Record<
  Category,
  { label: string; description: string; color: string; emoji: string }
> = {
  javascript: {
    label: 'JavaScript',
    description: '클로저, 이벤트 루프, this 바인딩, 비동기, 프로토타입',
    color: 'bg-yellow-400 text-yellow-900',
    emoji: '⚡',
  },
  react: {
    label: 'React',
    description: 'Hooks, 렌더링 최적화, 커스텀 훅, 상태 관리',
    color: 'bg-cyan-400 text-cyan-900',
    emoji: '⚛️',
  },
  nextjs: {
    label: 'Next.js',
    description: 'App Router, SSR/SSG/ISR, Server Actions, Middleware',
    color: 'bg-gray-800 text-white',
    emoji: '▲',
  },
}

export function getProblemById(id: string): Problem | undefined {
  return allProblems.find((p) => p.id === id)
}

export function getProblemsByCategory(category: Category): Problem[] {
  return problemsByCategory[category] ?? []
}

export { javascriptProblems, reactProblems, nextjsProblems }
