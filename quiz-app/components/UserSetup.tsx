'use client'

import { useState } from 'react'
import { useUserStore } from '@/store/userStore'

export default function UserSetup() {
  const [input, setInput] = useState('')
  const [error, setError] = useState('')
  const login = useUserStore((s) => s.login)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const name = input.trim()
    if (!name) {
      setError('이름을 입력해주세요')
      return
    }
    if (name.length < 2) {
      setError('2글자 이상 입력해주세요')
      return
    }
    login(name)
  }

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🧠</div>
          <h1 className="text-2xl font-bold text-white mb-2">Dev Quiz</h1>
          <p className="text-gray-400 text-sm">
            JS · React · Next.js 핵심 개념을 문제로 익혀보세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              닉네임
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value)
                setError('')
              }}
              placeholder="사용할 이름을 입력하세요"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              autoFocus
            />
            {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            시작하기
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          진행상황은 이 브라우저에 저장됩니다
        </p>
      </div>
    </div>
  )
}
