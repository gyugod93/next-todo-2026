import Image from "next/image";
import { Product } from "@/app/_lib/mock-data";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
        />
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full w-fit">
          {product.category}
        </span>
        <h3 className="text-sm font-semibold text-gray-900 leading-tight line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-1">
          <span className="text-yellow-500 text-xs">★</span>
          <span className="text-xs text-gray-600">{product.rating}</span>
          <span className="text-xs text-gray-400">
            ({product.reviews.toLocaleString()})
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="text-base font-bold text-gray-900">
            ${product.price}
          </span>
          <button className="text-xs bg-gray-900 text-white px-3 py-1.5 rounded-lg hover:bg-gray-700 transition-colors">
            담기
          </button>
        </div>
      </div>
    </div>
  );
}
