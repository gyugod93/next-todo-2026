'use client'

import { useState } from 'react'

interface Props {
  code: string
  language?: string
}

export default function CodeBlock({ code, language = 'javascript' }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group rounded-lg overflow-hidden border border-gray-700 bg-[#1e1e1e]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700/50 bg-gray-800/50">
        <span className="text-xs text-gray-500 font-mono">{language}</span>
        <button
          onClick={handleCopy}
          className="text-xs text-gray-600 hover:text-gray-300 transition-colors"
        >
          {copied ? '✓ 복사됨' : '복사'}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-200 font-mono leading-relaxed overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}
