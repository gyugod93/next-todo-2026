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

  login: (username: string) => void
  logout: () => void
  submitAnswer: (result: Omit<SolvedResult, 'attempts'>) => void
  refreshProgress: () => void
}

export const useUserStore = create<UserStore>((set, get) => ({
  username: null,
  progress: null,
  isLoaded: false,

  login: (username: string) => {
    setCurrentUser(username)
    const progress = getUserProgress(username)
    set({ username, progress, isLoaded: true })
  },

  logout: () => {
    clearCurrentUser()
    set({ username: null, progress: null })
  },

  submitAnswer: (result: Omit<SolvedResult, 'attempts'>) => {
    const { username } = get()
    if (!username) return

    const fullResult: SolvedResult = { ...result, attempts: 0 }
    saveSolvedResult(username, fullResult)

    const progress = getUserProgress(username)
    set({ progress })
  },

  refreshProgress: () => {
    const username = getCurrentUser()
    if (!username) {
      set({ isLoaded: true })
      return
    }
    const progress = getUserProgress(username)
    set({ username, progress, isLoaded: true })
  },
}))

export { getUserStats }
