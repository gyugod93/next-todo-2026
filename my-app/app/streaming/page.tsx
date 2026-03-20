import { Suspense } from "react";
import ProductSection from "./ProductSection";
import SkeletonGrid from "@/app/_components/SkeletonGrid";
import MetricsPanel from "@/app/_components/MetricsPanel";

export default async function StreamingPage({
  searchParams,
}: {
  searchParams: Promise<{ delay?: string }>;
}) {
  const { delay: delayParam } = await searchParams;
  const delayMs = Math.min(Math.max(Number(delayParam) || 1500, 0), 5000);

  const section1Delay = Math.round(delayMs * 0.3);
  const section2Delay = Math.round(delayMs * 0.65);
  const section3Delay = delayMs;

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
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <h1 className="text-2xl font-bold">Streaming SSR</h1>
            <span className="text-gray-400 text-sm">Progressive Streaming</span>
          </div>
          <span className="ml-auto text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
            딜레이: {delayMs}ms
          </span>
        </div>

        {/* Info banner */}
        <div className="bg-green-950 border border-green-800 rounded-xl p-4 mb-6 text-sm text-green-200 leading-relaxed">
          <p>
            <strong className="text-green-400">Streaming SSR 방식:</strong> 3개
            섹션이{" "}
            <strong>
              {section1Delay}ms / {section2Delay}ms / {section3Delay}ms
            </strong>{" "}
            딜레이로 독립 스트리밍됩니다. 페이지 HTML은 즉시 도착하고, 각
            섹션이 준비되는 대로 스켈레톤이 실제 콘텐츠로 교체됩니다.
          </p>
          <p className="text-green-300 mt-1 text-xs">
            💡 페이지 접속 즉시 레이아웃과 스켈레톤이 보입니다. SSR과 달리
            첫 화면 자체는 빠르게 나타납니다.
          </p>
        </div>

        {/* Performance Metrics */}
        <MetricsPanel pageType="streaming" />

        {/* Section 1 */}
        <Suspense
          fallback={
            <SectionSkeleton
              title="섹션 1: 추천 상품"
              delayMs={section1Delay}
              index={0}
            />
          }
        >
          <ProductSection
            title="섹션 1: 추천 상품"
            start={0}
            end={10}
            delayMs={section1Delay}
            sectionIndex={0}
          />
        </Suspense>

        {/* Section 2 */}
        <Suspense
          fallback={
            <SectionSkeleton
              title="섹션 2: 인기 상품"
              delayMs={section2Delay}
              index={1}
            />
          }
        >
          <ProductSection
            title="섹션 2: 인기 상품"
            start={10}
            end={20}
            delayMs={section2Delay}
            sectionIndex={1}
          />
        </Suspense>

        {/* Section 3 */}
        <Suspense
          fallback={
            <SectionSkeleton
              title="섹션 3: 신상품"
              delayMs={section3Delay}
              index={2}
            />
          }
        >
          <ProductSection
            title="섹션 3: 신상품"
            start={20}
            end={30}
            delayMs={section3Delay}
            sectionIndex={2}
          />
        </Suspense>
      </div>
    </div>
  );
}

function SectionSkeleton({
  title,
  delayMs,
  index,
}: {
  title: string;
  delayMs: number;
  index: number;
}) {
  const dots = ["bg-gray-600", "bg-gray-600", "bg-gray-600"];
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`w-2.5 h-2.5 rounded-full ${dots[index]} animate-pulse`}
        />
        <h2 className="text-base font-semibold text-gray-500">{title}</h2>
        <span className="text-xs text-gray-600">로딩 중... ({delayMs}ms)</span>
      </div>
      <SkeletonGrid count={10} />
    </div>
  );
}
