interface Props {
  total: number
  solved: number
  correct: number
}

export default function ProgressBar({ total, solved, correct }: Props) {
  const solvedPct = total > 0 ? Math.round((solved / total) * 100) : 0
  const correctPct = total > 0 ? Math.round((correct / total) * 100) : 0

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-400">
        <span>
          {solved}/{total} 풀이 완료
        </span>
        <span className="text-green-400">{correctPct}% 정답</span>
      </div>

      <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
        <div className="h-full flex">
          <div
            className="bg-green-500 transition-all duration-500"
            style={{ width: `${correctPct}%` }}
          />
          <div
            className="bg-red-500 transition-all duration-500"
            style={{ width: `${solvedPct - correctPct}%` }}
          />
        </div>
      </div>

      <div className="flex gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          정답 {correct}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
          오답 {solved - correct}
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-gray-700" />
          미풀이 {total - solved}
        </span>
      </div>
    </div>
  )
}
