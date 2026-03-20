"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/app/_components/ProductCard";
import SkeletonGrid from "@/app/_components/SkeletonGrid";
import MetricsPanel from "@/app/_components/MetricsPanel";
import type { Product } from "@/app/_lib/mock-data";

export default function CSRContent({ delayMs }: { delayMs: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchTime, setFetchTime] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const start = performance.now();
    fetch(`/api/products?delay=${delayMs}`)
      .then((res) => res.json())
      .then((data: Product[]) => {
        setProducts(data);
        setFetchTime(Math.round(performance.now() - start));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, [delayMs]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← 홈
          </a>
          <div className="flex items-center gap-2">
            <span
              className={`w-3 h-3 rounded-full bg-orange-500 ${loading ? "animate-pulse" : ""}`}
            />
            <h1 className="text-2xl font-bold">CSR</h1>
            <span className="text-gray-400 text-sm">Client-Side Rendering</span>
          </div>
          <span className="ml-auto text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
            딜레이: {delayMs}ms
          </span>
        </div>

        {/* Info banner */}
        <div className="bg-orange-950 border border-orange-800 rounded-xl p-4 mb-6 text-sm text-orange-200 leading-relaxed">
          <p>
            <strong className="text-orange-400">CSR 방식:</strong> 브라우저가
            빈 HTML을 즉시 받고, JavaScript가 실행된 후{" "}
            <code className="text-orange-300 text-xs bg-orange-900/50 px-1 rounded">
              /api/products
            </code>
            에서 데이터를 직접 가져옵니다.
            {fetchTime !== null && (
              <>
                {" "}
                클라이언트 fetch 소요시간:{" "}
                <strong>{fetchTime}ms</strong>
              </>
            )}
            {loading && (
              <span className="text-orange-300"> 데이터 가져오는 중...</span>
            )}
          </p>
          <p className="text-orange-300 mt-1 text-xs">
            💡 TTFB는 매우 빠르지만, 실제 콘텐츠는 JS 실행 + API 응답 후에
            나타납니다. SEO에 불리하고 초기 콘텐츠가 늦게 보입니다.
          </p>
        </div>

        {/* Performance Metrics */}
        <MetricsPanel pageType="csr" />

        {/* Content */}
        {error ? (
          <div className="text-red-400 p-4 bg-red-950 rounded-xl border border-red-800">
            오류: {error}
          </div>
        ) : loading ? (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-gray-400">
                /api/products에서 데이터 가져오는 중... ({delayMs}ms 딜레이)
              </span>
            </div>
            <SkeletonGrid count={30} />
          </div>
        ) : (
          <div>
            <h2 className="text-base font-semibold text-gray-300 mb-4">
              상품 목록{" "}
              <span className="text-gray-500 font-normal">
                ({products.length}개)
              </span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
