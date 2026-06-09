import { javascriptProblems } from './javascript'
import { reactProblems } from './react'
import { nextjsProblems } from './nextjs'
import { typescriptProblems } from './typescript'
import { designPatternProblems } from './design-patterns'
import { aiToolsProblems } from './ai-tools'
import { csBasicsProblems } from './cs-basics'
import { debuggingProblems } from './debugging'
import { realworldProblems } from './realworld'
import { databaseProblems } from './database'
import { backendProblems } from './backend'
import { authSecurityProblems } from './auth-security'
import { infraBasicsProblems } from './infra-basics'
import { codeTrainingProblems } from './code-training'
import { cssProblems } from './css'
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
  ...databaseProblems,
  ...backendProblems,
  ...authSecurityProblems,
  ...infraBasicsProblems,
  ...codeTrainingProblems,
  ...cssProblems,
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
  database: databaseProblems,
  backend: backendProblems,
  'auth-security': authSecurityProblems,
  'infra-basics': infraBasicsProblems,
  'code-training': codeTrainingProblems,
  css: cssProblems,
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
  database: {
    label: '데이터베이스',
    description: 'MongoDB 용어, Mongoose ODM, RDBMS/SQL, Aggregation, 스키마 설계',
    color: 'bg-green-600 text-white',
    emoji: '🗄️',
  },
  backend: {
    label: '백엔드',
    description: 'REST API, HTTP, NestJS 구조, Guard/Pipe/Interceptor, Node.js',
    color: 'bg-indigo-500 text-white',
    emoji: '⚙️',
  },
  'auth-security': {
    label: '인증/보안',
    description: 'JWT, OAuth 2.0, OIDC, Session, XSS, CSRF, bcrypt, CORS',
    color: 'bg-red-600 text-white',
    emoji: '🔐',
  },
  'infra-basics': {
    label: '인프라',
    description: 'Docker, CI/CD, Monolith vs MSA, Blue-Green, CDN, Load Balancer',
    color: 'bg-slate-600 text-white',
    emoji: '🚀',
  },
  'code-training': {
    label: '코딩 훈련',
    description: '직접 버그 수정(code-fix), 코드 설계 후 모범 답안 비교(self-check)',
    color: 'bg-teal-500 text-white',
    emoji: '🏋️',
  },
  css: {
    label: 'CSS 챌린지',
    description: '목표 화면을 보고 CSS를 작성하여 똑같이 만들기 — 피그마→코드 변환 훈련',
    color: 'bg-pink-500 text-white',
    emoji: '🎨',
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
  databaseProblems,
  backendProblems,
  authSecurityProblems,
  infraBasicsProblems,
  codeTrainingProblems,
  cssProblems,
}
