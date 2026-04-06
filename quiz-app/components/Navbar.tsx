'use client'

import Link from 'next/link'
import { useUserStore } from '@/store/userStore'

export default function Navbar() {
  const { username, logout } = useUserStore()

  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-white hover:text-blue-400 transition-colors">
          <span className="text-xl">🧠</span>
          <span>Dev Quiz</span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            href="/problems"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            문제 목록
          </Link>
          <Link
            href="/leaderboard"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            리더보드
          </Link>
          {username && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-300">
                <span className="text-gray-500">@</span>
                {username}
              </span>
              <button
                onClick={logout}
                className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
