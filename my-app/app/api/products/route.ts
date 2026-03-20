import { NextRequest, NextResponse } from "next/server";
import { getAllProducts } from "@/app/_lib/mock-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const delayMs = Math.min(Math.max(Number(searchParams.get("delay")) || 0, 0), 5000);

  if (delayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  const products = getAllProducts();
  return NextResponse.json(products);
}
