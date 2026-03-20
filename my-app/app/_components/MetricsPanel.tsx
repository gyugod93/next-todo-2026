"use client";

import { useEffect, useState } from "react";
import { formatMs, getMetricColor } from "@/app/_lib/utils";

interface Metrics {
  ttfb: number | null;
  fcp: number | null;
  lcp: number | null;
  domLoaded: number | null;
  loadComplete: number | null;
}

const INITIAL: Metrics = {
  ttfb: null,
  fcp: null,
  lcp: null,
  domLoaded: null,
  loadComplete: null,
};

const ITEMS: { key: keyof Metrics; label: string; desc: string }[] = [
  { key: "ttfb", label: "TTFB", desc: "첫 번째 바이트 도착" },
  { key: "fcp", label: "FCP", desc: "첫 콘텐츠 렌더링" },
  { key: "lcp", label: "LCP", desc: "가장 큰 콘텐츠 렌더링" },
  { key: "domLoaded", label: "DOM Ready", desc: "DOM 파싱 완료" },
  { key: "loadComplete", label: "Load", desc: "페이지 완전 로드" },
];

export default function MetricsPanel({
  pageType,
}: {
  pageType: "ssr" | "streaming" | "csr";
}) {
  const [metrics, setMetrics] = useState<Metrics>(INITIAL);

  useEffect(() => {
    // Navigation timing (TTFB, DOM Ready, Load)
    const readNavTiming = () => {
      const entries = performance.getEntriesByType(
        "navigation"
      ) as PerformanceNavigationTiming[];
      if (entries.length > 0) {
        const nav = entries[0];
        setMetrics((prev) => ({
          ...prev,
          ttfb: nav.responseStart - nav.startTime,
          domLoaded: nav.domContentLoadedEventEnd - nav.startTime,
          loadComplete:
            nav.loadEventEnd > 0 ? nav.loadEventEnd - nav.startTime : null,
        }));
      }
    };

    // FCP via PerformanceObserver
    let fcpObserver: PerformanceObserver | null = null;
    try {
      fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === "first-contentful-paint") {
            setMetrics((prev) => ({ ...prev, fcp: entry.startTime }));
          }
        }
      });
      fcpObserver.observe({ type: "paint", buffered: true });
    } catch {
      // fallback: read directly
      const paintEntries = performance.getEntriesByType("paint");
      const fcpEntry = paintEntries.find(
        (e) => e.name === "first-contentful-paint"
      );
      if (fcpEntry) setMetrics((prev) => ({ ...prev, fcp: fcpEntry.startTime }));
    }

    // LCP via PerformanceObserver
    let lcpObserver: PerformanceObserver | null = null;
    try {
      lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        if (last) setMetrics((prev) => ({ ...prev, lcp: last.startTime }));
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch {}

    if (document.readyState === "complete") {
      readNavTiming();
    } else {
      window.addEventListener("load", readNavTiming, { once: true });
    }

    return () => {
      fcpObserver?.disconnect();
      lcpObserver?.disconnect();
    };
  }, []);

  // Persist to localStorage so /compare can read them
  useEffect(() => {
    if (metrics.ttfb !== null) {
      localStorage.setItem(
        `metrics_${pageType}`,
        JSON.stringify({ ...metrics, timestamp: Date.now() })
      );
    }
  }, [metrics, pageType]);

  const accentColor = {
    ssr: "border-blue-800 bg-blue-950/40",
    streaming: "border-green-800 bg-green-950/40",
    csr: "border-orange-800 bg-orange-950/40",
  }[pageType];

  return (
    <div
      className={`border rounded-xl p-4 mb-6 ${accentColor}`}
    >
      <p className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
        ⚡ 성능 측정 (페이지 방문 시 자동 기록됨)
      </p>
      <div className="grid grid-cols-5 gap-2">
        {ITEMS.map(({ key, label, desc }) => (
          <div key={key} className="text-center" title={desc}>
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div
              className={`text-lg font-mono font-bold ${getMetricColor(metrics[key])}`}
            >
              {formatMs(metrics[key])}
            </div>
            <div className="text-xs text-gray-600 mt-0.5 hidden md:block">
              {desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
