import { delay } from "@/app/_lib/utils";
import { getAllProducts } from "@/app/_lib/mock-data";
import ProductCard from "@/app/_components/ProductCard";
import MetricsPanel from "@/app/_components/MetricsPanel";

export default async function SSRPage({
  searchParams,
}: {
  searchParams: Promise<{ delay?: string }>;
}) {
  const { delay: delayParam } = await searchParams;
  const delayMs = Math.min(Math.max(Number(delayParam) || 1500, 0), 5000);

  // 🔴 SSR 핵심: 모든 데이터가 준비될 때까지 HTML 전송 차단
  const serverStart = Date.now();
  await delay(delayMs);
  const products = getAllProducts();
  const serverTime = Date.now() - serverStart;

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
            <span className="w-3 h-3 rounded-full bg-blue-500" />
            <h1 className="text-2xl font-bold">SSR</h1>
            <span className="text-gray-400 text-sm">Server-Side Rendering</span>
          </div>
          <span className="ml-auto text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
            딜레이: {delayMs}ms
          </span>
        </div>

        {/* Info banner */}
        <div className="bg-blue-950 border border-blue-800 rounded-xl p-4 mb-6 text-sm text-blue-200 leading-relaxed">
          <p>
            <strong className="text-blue-400">SSR 방식:</strong> 서버에서{" "}
            <strong>{delayMs}ms</strong> 동안 상품 데이터를 가져온 뒤 완성된
            HTML을 한 번에 전송했습니다. 실제 서버 처리 시간:{" "}
            <strong>{serverTime}ms</strong>
          </p>
          <p className="text-blue-300 mt-1 text-xs">
            💡 딜레이 동안 브라우저는 완전히 빈 화면을 보여줍니다. TTFB가
            딜레이만큼 증가하는 것을 아래 메트릭에서 확인하세요.
          </p>
        </div>

        {/* Performance Metrics */}
        <MetricsPanel pageType="ssr" />

        {/* Product Grid */}
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
      </div>
    </div>
  );
}
