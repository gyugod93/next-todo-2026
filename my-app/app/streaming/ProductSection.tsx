import { delay } from "@/app/_lib/utils";
import { getProductSlice } from "@/app/_lib/mock-data";
import ProductCard from "@/app/_components/ProductCard";
import SectionTimer from "@/app/_components/SectionTimer";

interface Props {
  title: string;
  start: number;
  end: number;
  delayMs: number;
  sectionIndex: number;
}

export default async function ProductSection({
  title,
  start,
  end,
  delayMs,
  sectionIndex,
}: Props) {
  // 각 섹션이 독립적으로 데이터를 가져옴 → Suspense 경계 안에서 스트리밍
  await delay(delayMs);
  const products = getProductSlice(start, end);

  const dotColors = ["bg-green-400", "bg-green-500", "bg-green-600"];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span
          className={`w-2.5 h-2.5 rounded-full ${dotColors[sectionIndex]}`}
        />
        <h2 className="text-base font-semibold text-gray-200">{title}</h2>
        <SectionTimer label={`섹션 ${sectionIndex + 1}`} />
        <span className="text-xs text-gray-600 ml-auto">
          서버 딜레이: {delayMs}ms
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
