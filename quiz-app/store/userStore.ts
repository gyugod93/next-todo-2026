'use client'

import { create } from 'zustand'
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  getUserProgress,
  saveSolvedResult,
  getUserStats,
  getRetryQueue,
  addToRetryQueue,
  removeFromRetryQueue,
} from '@/lib/storage'
import type { SolvedResult, UserProgress } from '@/types'

interface UserStore {
  username: string | null
  progress: UserProgress | null
  isLoaded: boolean
  retryQueue: string[]

  login: (username: string) => Promise<void>
  logout: () => void
  submitAnswer: (result: Omit<SolvedResult, 'attempts'>) => Promise<void>
  refreshProgress: () => Promise<void>
  addToRetry: (problemId: string) => void
  removeFromRetry: (problemId: string) => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  username: null,
  progress: null,
  isLoaded: false,
  retryQueue: [],

  login: async (username: string) => {
    setCurrentUser(username)
    const progress = await getUserProgress(username)
    const retryQueue = getRetryQueue(username)
    set({ username, progress, retryQueue, isLoaded: true })
  },

  logout: () => {
    clearCurrentUser()
    set({ username: null, progress: null, retryQueue: [] })
  },

  submitAnswer: async (result: Omit<SolvedResult, 'attempts'>) => {
    const { username, progress } = get()
    if (!username) return

    const existing = progress?.solvedProblems[result.problemId]
    const fullResult: SolvedResult = {
      ...result,
      attempts: (existing?.attempts ?? 0) + 1,
    }

    await saveSolvedResult(username, fullResult)
    const updatedProgress = await getUserProgress(username)

    // 정답 맞추면 retry queue에서 자동 제거
    if (result.correct) {
      removeFromRetryQueue(username, result.problemId)
    }

    const retryQueue = getRetryQueue(username)
    set({ progress: updatedProgress, retryQueue })
  },

  refreshProgress: async () => {
    const username = getCurrentUser()
    if (!username) {
      set({ isLoaded: true })
      return
    }
    const progress = await getUserProgress(username)
    const retryQueue = getRetryQueue(username)
    set({ username, progress, retryQueue, isLoaded: true })
  },

  addToRetry: (problemId: string) => {
    const { username } = get()
    if (!username) return
    addToRetryQueue(username, problemId)
    set({ retryQueue: getRetryQueue(username) })
  },

  removeFromRetry: (problemId: string) => {
    const { username } = get()
    if (!username) return
    removeFromRetryQueue(username, problemId)
    set({ retryQueue: getRetryQueue(username) })
  },
}))

export { getUserStats }
