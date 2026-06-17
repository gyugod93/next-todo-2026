'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface Props {
  fallback?: string
}

export default function BackButton({ fallback = '/problems' }: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from')

  const handleBack = () => {
    if (from) {
      router.push(from)
    } else {
      router.back()
    }
  }

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 transition-colors"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 5l-7 7 7 7" />
      </svg>
      뒤로
    </button>
  )
}
