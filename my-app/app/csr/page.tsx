import CSRContent from "./CSRContent";

export default async function CSRPage({
  searchParams,
}: {
  searchParams: Promise<{ delay?: string }>;
}) {
  const { delay: delayParam } = await searchParams;
  const delayMs = Math.min(Math.max(Number(delayParam) || 1500, 0), 5000);

  return <CSRContent delayMs={delayMs} />;
}
