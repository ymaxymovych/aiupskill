"use client";

import { useEffect, useState } from "react";

export function useCountUp(target: number, duration = 2000, active = false) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;

    let start: number | null = null;
    let rafId: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, active]);

  return value;
}
