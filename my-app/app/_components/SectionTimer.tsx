"use client";

import { useEffect, useState } from "react";

export default function SectionTimer({ label }: { label: string }) {
  const [time, setTime] = useState<number | null>(null);

  useEffect(() => {
    setTime(Math.round(performance.now()));
  }, []);

  return (
    <span className="text-xs text-gray-500 font-normal">
      {time !== null ? (
        <>
          {label} —{" "}
          <span className="text-green-400 font-mono font-semibold">
            {time}ms
          </span>{" "}
          에 도착
        </>
      ) : (
        "측정 중..."
      )}
    </span>
  );
}
