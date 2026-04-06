'use client'

import { useEffect, useState } from 'react'
import { useUserStore } from '@/store/userStore'
import { getAllUsernames, getUserStats } from '@/lib/storage'
import { allProblems } from '@/data/problems'
import UserSetup from '@/components/UserSetup'
import type { LeaderboardEntry } from '@/types'

export default function LeaderboardPage() {
  const { username, isLoaded, refreshProgress } = useUserStore()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    refreshProgress()
  }, [refreshProgress])

  useEffect(() => {
    if (!isLoaded) return
    const usernames = getAllUsernames()
    const data: LeaderboardEntry[] = usernames.map((name) => {
      const stats = getUserStats(name)
      return { username: name, ...stats }
    })
    data.sort((a, b) => b.score - a.score || b.correctCount - a.correctCount)
    setEntries(data)
  }, [isLoaded])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!username) return <UserSetup />

  const rankIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-white">리더보드</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-4 px-5 py-3 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-800">
          <span>순위</span>
          <span>닉네임</span>
          <span className="text-center">정답</span>
          <span className="text-right">점수</span>
        </div>

        {entries.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-600">
            <p className="text-3xl mb-2">🏆</p>
            <p className="text-sm">아직 풀린 문제가 없습니다</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {entries.map((entry, index) => {
              const isMe = entry.username === username
              const rank = index + 1

              return (
                <div
                  key={entry.username}
                  className={`grid grid-cols-4 px-5 py-4 items-center transition-colors ${
                    isMe ? 'bg-blue-500/5 border-l-2 border-l-blue-500' : 'hover:bg-gray-800/50'
                  }`}
                >
                  <span className="text-lg">
                    {typeof rankIcon(rank) === 'string'
                      ? rankIcon(rank)
                      : <span className="text-gray-500 text-sm font-mono">{rank}</span>}
                  </span>
                  <span className={`font-medium ${isMe ? 'text-blue-400' : 'text-white'}`}>
                    {entry.username}
                    {isMe && <span className="text-xs text-blue-500 ml-1">(나)</span>}
                  </span>
                  <div className="text-center">
                    <span className="text-green-400 font-semibold">{entry.correctCount}</span>
                    <span className="text-gray-600 text-xs">/{allProblems.length}</span>
                  </div>
                  <span className="text-right font-bold text-white">
                    {entry.score}
                    <span className="text-gray-500 text-xs font-normal">점</span>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-sm text-gray-500">
        <p className="font-medium text-gray-400 mb-1">점수 계산 방식</p>
        <p>정답 +10점 · 오답 -2점 · 같은 문제 재시도 시 처음 결과 기준</p>
      </div>
    </div>
  )
}
