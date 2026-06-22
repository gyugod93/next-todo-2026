import Link from 'next/link'
import { deepTopics } from '@/data/deep-topics'

const categoryColors: Record<string, string> = {
  '상태 관리': 'text-violet-400 bg-violet-400/10 border-violet-400/20',
  '데이터 통신': 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  'CSS 레이아웃': 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
}

export default function DeepPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 space-y-10">
      {/* 헤더 */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">실전 사고력 훈련</span>
        </div>
        <h1 className="text-3xl font-bold text-white">언제 뭘 쓰는지 알아야 진짜다</h1>
        <p className="text-gray-400 leading-relaxed">
          기획서 보고 막히는 이유는 개념을 몰라서가 아니라 <span className="text-white font-medium">판단 기준</span>이 없어서다.
          실제 상황에서 왜 그 선택을 하는지 내 말로 설명할 수 있을 때까지.
        </p>
      </div>

      {/* 토픽 목록 */}
      <div className="space-y-4">
        {deepTopics.map((topic, i) => (
          <Link
            key={topic.id}
            href={`/deep/${topic.id}`}
            className="group block bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-indigo-500/40 hover:bg-gray-900/80 transition-all"
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl mt-0.5">{topic.emoji}</span>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${categoryColors[topic.category] ?? 'text-gray-400 bg-gray-800 border-gray-700'}`}>
                    {topic.category}
                  </span>
                  <span className="text-xs text-gray-600">#{i + 1}</span>
                </div>
                <h2 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {topic.title}
                </h2>
                <p className="text-sm text-gray-500">{topic.subtitle}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {topic.tags.map((tag) => (
                    <span key={tag} className="text-xs text-gray-600 bg-gray-800 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-gray-700 group-hover:text-indigo-400 transition-colors text-xl mt-1">→</span>
            </div>
          </Link>
        ))}
      </div>

      <p className="text-xs text-gray-700 text-center">계속 추가됩니다</p>
    </div>
  )
}
