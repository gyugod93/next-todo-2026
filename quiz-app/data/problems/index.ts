import { javascriptProblems } from './javascript'
import { reactProblems } from './react'
import { nextjsProblems } from './nextjs'
import { typescriptProblems } from './typescript'
import { designPatternProblems } from './design-patterns'
import { aiToolsProblems } from './ai-tools'
import { csBasicsProblems } from './cs-basics'
import { debuggingProblems } from './debugging'
import { realworldProblems } from './realworld'
import type { Problem, Category } from '@/types'

export const allProblems: Problem[] = [
  ...javascriptProblems,
  ...reactProblems,
  ...nextjsProblems,
  ...typescriptProblems,
  ...designPatternProblems,
  ...aiToolsProblems,
  ...csBasicsProblems,
  ...debuggingProblems,
  ...realworldProblems,
]

export const problemsByCategory: Record<Category, Problem[]> = {
  javascript: javascriptProblems,
  react: reactProblems,
  nextjs: nextjsProblems,
  typescript: typescriptProblems,
  'design-patterns': designPatternProblems,
  'ai-tools': aiToolsProblems,
  'cs-basics': csBasicsProblems,
  debugging: debuggingProblems,
  realworld: realworldProblems,
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
    description: 'Hooks, 렌더링 최적화, Context, Suspense, Concurrent, React 19',
    color: 'bg-cyan-400 text-cyan-900',
    emoji: '⚛️',
  },
  nextjs: {
    label: 'Next.js',
    description: 'App Router, 캐싱, Server Actions, Middleware, PPR, 인터셉팅 라우트',
    color: 'bg-gray-100 text-gray-900',
    emoji: '▲',
  },
  typescript: {
    label: 'TypeScript',
    description: '타입 시스템, 제네릭, 유틸리티 타입, 조건부 타입, satisfies',
    color: 'bg-blue-500 text-white',
    emoji: '🔷',
  },
  'design-patterns': {
    label: '디자인 패턴',
    description: 'Compound Component, HOC, Custom Hook, SOLID, 폴더 구조 전략',
    color: 'bg-purple-500 text-white',
    emoji: '🏗️',
  },
  'ai-tools': {
    label: 'AI 도구',
    description: 'Claude Code, MCP, AI SDK, 프롬프트 엔지니어링, Cursor',
    color: 'bg-violet-500 text-white',
    emoji: '🤖',
  },
  'cs-basics': {
    label: 'CS 기초',
    description: '이벤트 루프, 브라우저 렌더링, HTTP, 메모리 관리, 알고리즘',
    color: 'bg-emerald-500 text-white',
    emoji: '🧮',
  },
  debugging: {
    label: '디버깅',
    description: 'DevTools, 에러 패턴, React 디버깅, 성능 분석, Next.js 트러블슈팅',
    color: 'bg-rose-500 text-white',
    emoji: '🐛',
  },
  realworld: {
    label: '실전 패턴',
    description: 'TanStack Query, React Hook Form + Zod, Zustand, NextAuth 실제 구현',
    color: 'bg-orange-500 text-white',
    emoji: '🛠️',
  },
}

export function getProblemById(id: string): Problem | undefined {
  return allProblems.find((p) => p.id === id)
}

export function getProblemsByCategory(category: Category): Problem[] {
  return problemsByCategory[category] ?? []
}

export {
  javascriptProblems,
  reactProblems,
  nextjsProblems,
  typescriptProblems,
  designPatternProblems,
  aiToolsProblems,
  csBasicsProblems,
  debuggingProblems,
  realworldProblems,
}
