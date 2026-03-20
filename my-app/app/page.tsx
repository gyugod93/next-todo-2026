import DelaySlider from "./_components/DelaySlider";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight mb-3">
            렌더링 방식 성능 비교
          </h1>
          <p className="text-gray-400 text-lg">
            SSR · Streaming SSR · CSR 의 로딩 성능을 직접 체험하고 비교해보세요
          </p>
          <p className="text-gray-600 text-sm mt-2">
            상품 카드 30개 + 고해상도 이미지(800×600) 사용
          </p>
        </div>

        {/* Delay control + Links */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-8 border border-gray-800">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            ⚙️ 서버 딜레이 설정
          </h2>
          <DelaySlider />
        </div>

        {/* Explanation cards */}
        <div className="space-y-3">
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex gap-3">
              <span className="text-blue-400 text-xl mt-0.5">🖥️</span>
              <div>
                <p className="font-semibold text-white mb-1">
                  SSR — Server-Side Rendering
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  서버가 모든 데이터를 받아올 때까지 기다린 뒤 완성된 HTML을
                  한 번에 전송합니다. 딜레이 동안 브라우저는 빈 화면을
                  보여줍니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex gap-3">
              <span className="text-green-400 text-xl mt-0.5">⚡</span>
              <div>
                <p className="font-semibold text-white mb-1">
                  Streaming SSR — Progressive Streaming
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  섹션마다 다른 딜레이로 준비되는 순서대로 HTML을 전송합니다.
                  사용자는 스켈레톤이 실제 콘텐츠로 교체되는 과정을 볼 수
                  있습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex gap-3">
              <span className="text-orange-400 text-xl mt-0.5">💻</span>
              <div>
                <p className="font-semibold text-white mb-1">
                  CSR — Client-Side Rendering
                </p>
                <p className="text-sm text-gray-400 leading-relaxed">
                  브라우저가 빈 HTML을 즉시 받고, JavaScript 실행 후 API에서
                  데이터를 직접 가져옵니다. TTFB는 빠르지만 콘텐츠가 늦게
                  나타납니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
