"use client";

import { useState } from "react";

const PRESETS = [0, 500, 1000, 1500, 2000, 3000];

export default function DelaySlider() {
  const [delay, setDelay] = useState(1500);

  return (
    <div className="space-y-5">
      {/* Slider */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">서버 응답 딜레이 (API fetch 시뮬레이션)</span>
          <span className="text-2xl font-mono font-bold text-white tabular-nums">
            {delay}ms
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={3000}
          step={100}
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="w-full accent-blue-500 cursor-pointer"
        />
        <div className="flex gap-2 flex-wrap">
          {PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setDelay(p)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                delay === p
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {p}ms
            </button>
          ))}
        </div>
      </div>

      {/* Demo links — <a> 태그 사용: 하드 네비게이션으로 Performance API 재초기화 */}
      <div className="grid grid-cols-3 gap-3">
        <a
          href={`/ssr?delay=${delay}`}
          className="flex flex-col items-center justify-center gap-2 p-5 bg-blue-700 hover:bg-blue-600 rounded-xl transition-colors text-white font-semibold"
        >
          <span className="text-3xl">🖥️</span>
          <span>SSR</span>
          <span className="text-xs font-normal opacity-75">
            Server-Side Rendering
          </span>
        </a>
        <a
          href={`/streaming?delay=${delay}`}
          className="flex flex-col items-center justify-center gap-2 p-5 bg-green-700 hover:bg-green-600 rounded-xl transition-colors text-white font-semibold"
        >
          <span className="text-3xl">⚡</span>
          <span>Streaming SSR</span>
          <span className="text-xs font-normal opacity-75">
            Progressive Streaming
          </span>
        </a>
        <a
          href={`/csr?delay=${delay}`}
          className="flex flex-col items-center justify-center gap-2 p-5 bg-orange-700 hover:bg-orange-600 rounded-xl transition-colors text-white font-semibold"
        >
          <span className="text-3xl">💻</span>
          <span>CSR</span>
          <span className="text-xs font-normal opacity-75">
            Client-Side Rendering
          </span>
        </a>
      </div>

      <a
        href="/compare"
        className="block w-full text-center p-4 bg-purple-800 hover:bg-purple-700 rounded-xl transition-colors text-white font-semibold"
      >
        📊 성능 비교 대시보드
      </a>
    </div>
  );
}
