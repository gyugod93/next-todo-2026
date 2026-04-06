interface Props {
  correct: boolean
  explanation: string
}

export default function Explanation({ correct, explanation }: Props) {
  return (
    <div
      className={`rounded-xl border p-5 space-y-3 ${
        correct
          ? 'border-green-500/30 bg-green-500/5'
          : 'border-red-500/30 bg-red-500/5'
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{correct ? '✅' : '❌'}</span>
        <span
          className={`font-semibold ${correct ? 'text-green-400' : 'text-red-400'}`}
        >
          {correct ? '정답입니다!' : '오답입니다'}
        </span>
      </div>

      <div className="border-t border-gray-800 pt-3">
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          해설
        </p>
        <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans leading-relaxed">
          {explanation}
        </pre>
      </div>
    </div>
  )
}
