import type { UserProgress, SolvedResult, LeaderboardEntry } from '@/types'

const STORAGE_PREFIX = 'dev-quiz:'
const CURRENT_USER_KEY = `${STORAGE_PREFIX}current-user`

function retryKey(username: string) {
  return `${STORAGE_PREFIX}retry:${username}`
}

function learnedKey(username: string) {
  return `${STORAGE_PREFIX}learned:${username}`
}

export function getLearnedLessons(username: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(learnedKey(username))
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function markLessonLearned(username: string, lessonId: string): void {
  const learned = getLearnedLessons(username)
  if (!learned.includes(lessonId)) {
    localStorage.setItem(learnedKey(username), JSON.stringify([...learned, lessonId]))
  }
}

export function isLessonLearned(username: string, lessonId: string): boolean {
  return getLearnedLessons(username).includes(lessonId)
}

export function getRetryQueue(username: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(retryKey(username))
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addToRetryQueue(username: string, problemId: string): void {
  const queue = getRetryQueue(username)
  if (!queue.includes(problemId)) {
    localStorage.setItem(retryKey(username), JSON.stringify([...queue, problemId]))
  }
}

export function removeFromRetryQueue(username: string, problemId: string): void {
  const queue = getRetryQueue(username)
  localStorage.setItem(
    retryKey(username),
    JSON.stringify(queue.filter((id) => id !== problemId)),
  )
}

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

export async function getUserProgress(username: string): Promise<UserProgress> {
  try {
    const res = await fetch(`/api/progress/${encodeURIComponent(username)}`)
    if (!res.ok) throw new Error('fetch failed')
    return await res.json()
  } catch {
    return { username, solvedProblems: {}, createdAt: Date.now() }
  }
}

export async function saveSolvedResult(
  username: string,
  result: SolvedResult,
): Promise<void> {
  await fetch(`/api/progress/${encodeURIComponent(username)}/solve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  })
}

export async function getAllUsersLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const res = await fetch('/api/leaderboard')
    if (!res.ok) throw new Error('fetch failed')
    return await res.json()
  } catch {
    return []
  }
}

export function getUserStats(progress: UserProgress) {
  const results = Object.values(progress.solvedProblems)
  const totalSolved = results.length
  const correctCount = results.filter((r) => r.correct).length
  const score = correctCount * 10 - (totalSolved - correctCount) * 2
  return { totalSolved, correctCount, score }
}
