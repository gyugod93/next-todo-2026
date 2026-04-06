import type { UserProgress, SolvedResult } from '@/types'

const STORAGE_PREFIX = 'dev-quiz:'
const CURRENT_USER_KEY = `${STORAGE_PREFIX}current-user`
const PROGRESS_KEY = (username: string) =>
  `${STORAGE_PREFIX}progress:${username}`

export function getCurrentUser(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(CURRENT_USER_KEY)
}

export function setCurrentUser(username: string): void {
  localStorage.setItem(CURRENT_USER_KEY, username)
}

export function clearCurrentUser(): void {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getUserProgress(username: string): UserProgress {
  if (typeof window === 'undefined') {
    return { username, solvedProblems: {}, createdAt: Date.now() }
  }

  const raw = localStorage.getItem(PROGRESS_KEY(username))
  if (!raw) {
    const fresh: UserProgress = {
      username,
      solvedProblems: {},
      createdAt: Date.now(),
    }
    saveUserProgress(fresh)
    return fresh
  }

  return JSON.parse(raw) as UserProgress
}

export function saveUserProgress(progress: UserProgress): void {
  localStorage.setItem(PROGRESS_KEY(progress.username), JSON.stringify(progress))
}

export function saveSolvedResult(
  username: string,
  result: SolvedResult,
): void {
  const progress = getUserProgress(username)
  const existing = progress.solvedProblems[result.problemId]

  progress.solvedProblems[result.problemId] = {
    ...result,
    attempts: (existing?.attempts ?? 0) + 1,
  }

  saveUserProgress(progress)
}

export function getAllUsernames(): string[] {
  if (typeof window === 'undefined') return []
  const keys = Object.keys(localStorage).filter((k) =>
    k.startsWith(`${STORAGE_PREFIX}progress:`),
  )
  return keys.map((k) => k.replace(`${STORAGE_PREFIX}progress:`, ''))
}

export function getUserStats(username: string) {
  const progress = getUserProgress(username)
  const results = Object.values(progress.solvedProblems)
  const totalSolved = results.length
  const correctCount = results.filter((r) => r.correct).length
  const score = correctCount * 10 - (totalSolved - correctCount) * 2

  return { totalSolved, correctCount, score }
}
