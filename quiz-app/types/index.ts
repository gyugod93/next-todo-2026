export type Difficulty = 'easy' | 'medium' | 'hard'
export type Category = 'javascript' | 'react' | 'nextjs' | 'typescript'
export type ProblemType = 'multiple-choice' | 'code-output' | 'bug-find' | 'code-complete'

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
}

export interface UserProgress {
  username: string
  solvedProblems: Record<string, SolvedResult>
  createdAt: number
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
