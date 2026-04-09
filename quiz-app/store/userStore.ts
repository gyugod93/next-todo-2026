'use client'

import { create } from 'zustand'
import {
  getCurrentUser,
  setCurrentUser,
  clearCurrentUser,
  getUserProgress,
  saveSolvedResult,
  getUserStats,
} from '@/lib/storage'
import type { SolvedResult, UserProgress } from '@/types'

interface UserStore {
  username: string | null
  progress: UserProgress | null
  isLoaded: boolean

  login: (username: string) => Promise<void>
  logout: () => void
  submitAnswer: (result: Omit<SolvedResult, 'attempts'>) => Promise<void>
  refreshProgress: () => Promise<void>
}

export const useUserStore = create<UserStore>((set, get) => ({
  username: null,
  progress: null,
  isLoaded: false,

  login: async (username: string) => {
    setCurrentUser(username)
    const progress = await getUserProgress(username)
    set({ username, progress, isLoaded: true })
  },

  logout: () => {
    clearCurrentUser()
    set({ username: null, progress: null })
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
    set({ progress: updatedProgress })
  },

  refreshProgress: async () => {
    const username = getCurrentUser()
    if (!username) {
      set({ isLoaded: true })
      return
    }
    const progress = await getUserProgress(username)
    set({ username, progress, isLoaded: true })
  },
}))

export { getUserStats }
