export type Difficulty = 'easy' | 'medium' | 'hard'
export type Category =
  | 'javascript'
  | 'react'
  | 'nextjs'
  | 'typescript'
  | 'design-patterns'
  | 'ai-tools'
  | 'cs-basics'
  | 'debugging'
  | 'realworld'
  | 'database'
  | 'backend'
  | 'auth-security'
  | 'infra-basics'
  | 'code-training'
export type ProblemType = 'multiple-choice' | 'code-output' | 'bug-find' | 'code-complete' | 'code-fix' | 'self-check'

export interface Problem {
  id: string
  category: Category
  subcategory: string
  type: ProblemType
  difficulty: Difficulty
  title: string
  description: string
  code?: string
  options?: string[]
  correctAnswer: string | number
  explanation: string
  hints?: string[]
  deepDive?: string
  relatedProblems?: string[]
}

export interface UserProgress {
  username: string
  solvedProblems: Record<string, SolvedResult>
  createdAt: number
  retryQueue?: string[]
}

export interface SolvedResult {
  problemId: string
  correct: boolean
  attempts: number
  solvedAt: number
  userAnswer: string | number
}

export interface LeaderboardEntry {
  username: string
  totalSolved: number
  correctCount: number
  score: number
}

export type LessonCategory = 'ai-tools' | 'cs-basics' | 'design-patterns' | 'debugging' | 'realworld' | 'auth-security'

export interface LessonSection {
  title: string
  content: string
  code?: string
  language?: string
}

export interface Lesson {
  id: string
  category: LessonCategory
  subcategory: string
  title: string
  description: string
  emoji: string
  readingTime: number // minutes
  sections: LessonSection[]
  keyPoints: string[]
  relatedProblemIds?: string[]
  tags?: string[]
}

export const lessonCategoryMeta: Record<
  LessonCategory,
  { label: string; description: string; color: string; emoji: string }
> = {
  'ai-tools': {
    label: 'AI 도구',
    description: 'Claude Code, MCP, AI SDK, Cursor, 프롬프트 엔지니어링',
    color: 'bg-violet-500 text-white',
    emoji: '🤖',
  },
  'cs-basics': {
    label: 'CS 기초',
    description: '이벤트 루프, 브라우저 렌더링, HTTP, 메모리 관리, 알고리즘',
    color: 'bg-emerald-500 text-white',
    emoji: '🧮',
  },
  'design-patterns': {
    label: '디자인 패턴',
    description: 'Compound Component, HOC, Custom Hook, SOLID, 폴더 구조 전략',
    color: 'bg-purple-500 text-white',
    emoji: '🏗️',
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
    emoji: '🏗️',
  },
  'auth-security': {
    label: '인증/보안',
    description: 'JWT, OAuth 2.0, Session, XSS/CSRF, bcrypt, WebAuthn, Passkeys, 생체 인식',
    color: 'bg-red-600 text-white',
    emoji: '🔐',
  },
}
