"use client";

import { useState, useEffect } from "react";
import { formatMs } from "@/app/_lib/utils";

interface SavedMetrics {
  ttfb: number | null;
  fcp: number | null;
  lcp: number | null;
  domLoaded: number | null;
  loadComplete: number | null;
  timestamp: number;
}

type PageType = "ssr" | "streaming" | "csr";

const PAGE_CONFIG: Record<
  PageType,
  {
    label: string;
    emoji: string;
    href: string;
    border: string;
    text: string;
    bar: string;
    bg: string;
    hover: string;
    badge: string;
  }
> = {
  ssr: {
    label: "SSR",
    emoji: "🖥️",
    href: "/ssr",
    border: "border-blue-800",
    text: "text-blue-400",
    bar: "bg-blue-500",
    bg: "bg-blue-700",
    hover: "hover:bg-blue-600",
    badge: "bg-blue-900 text-blue-300",
  },
  streaming: {
    label: "Streaming SSR",
    emoji: "⚡",
    href: "/streaming",
    border: "border-green-800",
    text: "text-green-400",
    bar: "bg-green-500",
    bg: "bg-green-700",
    hover: "hover:bg-green-600",
    badge: "bg-green-900 text-green-300",
  },
  csr: {
    label: "CSR",
    emoji: "💻",
    href: "/csr",
    border: "border-orange-800",
    text: "text-orange-400",
    bar: "bg-orange-500",
    bg: "bg-orange-700",
    hover: "hover:bg-orange-600",
    badge: "bg-orange-900 text-orange-300",
  },
};

const METRIC_DEFS: {
  key: keyof Omit<SavedMetrics, "timestamp">;
  label: string;
  desc: string;
}[] = [
  { key: "ttfb", label: "TTFB", desc: "첫 번째 바이트 도착 시간" },
  { key: "fcp", label: "FCP", desc: "첫 콘텐츠 렌더링 시간" },
  { key: "lcp", label: "LCP", desc: "가장 큰 콘텐츠 렌더링 시간" },
  { key: "domLoaded", label: "DOM Ready", desc: "DOM 파싱 완료 시간" },
  { key: "loadComplete", label: "Load", desc: "페이지 완전 로드 시간" },
];

const PAGE_TYPES: PageType[] = ["ssr", "streaming", "csr"];

export default function ComparePage() {
  const [metricsMap, setMetricsMap] = useState<
    Partial<Record<PageType, SavedMetrics>>
  >({});

  const loadMetrics = () => {
    const result: Partial<Record<PageType, SavedMetrics>> = {};
    for (const type of PAGE_TYPES) {
      const saved = localStorage.getItem(`metrics_${type}`);
      if (saved) result[type] = JSON.parse(saved);
    }
    setMetricsMap(result);
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const clearAll = () => {
    for (const type of PAGE_TYPES) {
      localStorage.removeItem(`metrics_${type}`);
    }
    setMetricsMap({});
  };

  const getMin = (key: keyof Omit<SavedMetrics, "timestamp">): number | null => {
    const vals = PAGE_TYPES.map((t) => metricsMap[t]?.[key]).filter(
      (v): v is number => typeof v === "number"
    );
    return vals.length > 0 ? Math.min(...vals) : null;
  };

  const getMax = (key: keyof Omit<SavedMetrics, "timestamp">): number => {
    const vals = PAGE_TYPES.map((t) => metricsMap[t]?.[key]).filter(
      (v): v is number => typeof v === "number"
    );
    return vals.length > 0 ? Math.max(...vals, 1) : 1;
  };

  const measured = PAGE_TYPES.filter((t) => metricsMap[t] !== undefined);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 flex-wrap">
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← 홈
          </a>
          <h1 className="text-2xl font-bold">📊 성능 비교 대시보드</h1>
          <div className="ml-auto flex gap-2">
            <button
              onClick={loadMetrics}
              className="text-sm text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              새로고침
            </button>
            <button
              onClick={clearAll}
              className="text-sm text-gray-400 hover:text-red-400 bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
            >
              초기화
            </button>
          </div>
        </div>

        {/* Status cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {PAGE_TYPES.map((type) => {
            const config = PAGE_CONFIG[type];
            const metrics = metricsMap[type];
            return (
              <div
                key={type}
                className={`bg-gray-900 rounded-xl p-4 border ${metrics ? config.border : "border-gray-800"}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{config.emoji}</span>
                  <span className="font-semibold text-sm">{config.label}</span>
                  {metrics ? (
                    <span className="ml-auto text-xs text-green-400 font-medium">
                      ✓ 측정됨
                    </span>
                  ) : (
                    <span className="ml-auto text-xs text-gray-600">
                      미측정
                    </span>
                  )}
                </div>
                {metrics ? (
                  <p className="text-xs text-gray-600">
                    {new Date(metrics.timestamp).toLocaleTimeString("ko-KR")}에
                    측정
                  </p>
                ) : (
                  <a
                    href={`${config.href}?delay=1500`}
                    className={`text-xs ${config.text} hover:underline`}
                  >
                    → 지금 측정하기
                  </a>
                )}
              </div>
            );
          })}
        </div>

        {/* Comparison charts */}
        {measured.length > 0 ? (
          <div className="space-y-5">
            {METRIC_DEFS.map(({ key, label, desc }) => {
              const maxVal = getMax(key);
              const minVal = getMin(key);
              return (
                <div
                  key={key}
                  className="bg-gray-900 rounded-xl p-5 border border-gray-800"
                >
                  <div className="flex items-baseline gap-2 mb-4">
                    <h3 className="font-bold text-white">{label}</h3>
                    <span className="text-sm text-gray-500">{desc}</span>
                  </div>
                  <div className="space-y-3">
                    {PAGE_TYPES.map((type) => {
                      const config = PAGE_CONFIG[type];
                      const value = metricsMap[type]?.[key] ?? null;
                      const isMin = value !== null && value === minVal;
                      const barWidth =
                        value !== null
                          ? `${Math.max((value / maxVal) * 100, 2)}%`
                          : "0%";

                      return (
                        <div key={type} className="flex items-center gap-3">
                          <span className="text-sm w-32 text-gray-400 shrink-0">
                            {config.emoji} {config.label}
                          </span>
                          <div className="flex-1 bg-gray-800 rounded-full h-7 overflow-hidden">
                            <div
                              className={`h-full ${config.bar} rounded-full transition-all duration-700 flex items-center justify-end px-2 min-w-0`}
                              style={{ width: barWidth }}
                            >
                              {value !== null && value > 300 && (
                                <span className="text-xs text-white font-mono whitespace-nowrap">
                                  {formatMs(value)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 w-24 justify-end shrink-0">
                            <span
                              className={`text-sm font-mono font-bold ${
                                value === null
                                  ? "text-gray-600"
                                  : isMin
                                    ? "text-green-400"
                                    : "text-gray-300"
                              }`}
                            >
                              {formatMs(value)}
                            </span>
                            {isMin && (
                              <span className="text-xs text-green-500">🏆</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Summary */}
            {measured.length === 3 && (
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <h3 className="font-bold text-white mb-4">
                  📝 측정 결과 요약
                </h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {PAGE_TYPES.map((type) => {
                    const config = PAGE_CONFIG[type];
                    const m = metricsMap[type]!;
                    return (
                      <div key={type} className={`rounded-lg p-3 ${config.badge}`}>
                        <p className="font-semibold mb-2">
                          {config.emoji} {config.label}
                        </p>
                        <p>TTFB: <strong>{formatMs(m.ttfb)}</strong></p>
                        <p>FCP: <strong>{formatMs(m.fcp)}</strong></p>
                        <p>LCP: <strong>{formatMs(m.lcp)}</strong></p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-gray-900 rounded-xl p-12 text-center border border-gray-800">
            <div className="text-5xl mb-4">📏</div>
            <h3 className="text-lg font-semibold text-gray-200 mb-2">
              아직 측정된 데이터가 없습니다
            </h3>
            <p className="text-gray-500 mb-6 text-sm">
              각 렌더링 방식 페이지를 방문하면 성능이 자동으로 측정됩니다
            </p>
            <div className="flex gap-3 justify-center">
              {PAGE_TYPES.map((type) => {
                const config = PAGE_CONFIG[type];
                return (
                  <a
                    key={type}
                    href={`${config.href}?delay=1500`}
                    className={`px-4 py-2 rounded-lg ${config.bg} ${config.hover} transition-colors text-sm font-medium text-white`}
                  >
                    {config.emoji} {config.label}
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
