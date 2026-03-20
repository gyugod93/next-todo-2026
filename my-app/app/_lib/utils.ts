export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatMs(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) return "-";
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

export function getMetricColor(ms: number | null | undefined): string {
  if (ms === null || ms === undefined) return "text-gray-500";
  if (ms < 200) return "text-green-400";
  if (ms < 1000) return "text-yellow-400";
  return "text-red-400";
}
