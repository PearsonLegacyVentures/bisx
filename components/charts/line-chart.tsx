"use client";

import { createChart, LineData, LineSeries } from "lightweight-charts";
import { useEffect, useRef } from "react";

export function LineChart({
  data,
  label
}: {
  data: { time: string; value: number }[];
  label: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, {
      autoSize: true,
      layout: { background: { color: "#0f1624" }, textColor: "#9aa8bf" },
      grid: { vertLines: { color: "#1f2a3d" }, horzLines: { color: "#1f2a3d" } }
    });
    const series = chart.addSeries(LineSeries, { color: "#3aa0ff", lineWidth: 2 });
    series.setData(data as LineData[]);

    return () => chart.remove();
  }, [data]);

  return (
    <div>
      <p className="mb-2 text-xs text-muted">{label}</p>
      <div ref={ref} className="h-60 w-full" />
    </div>
  );
}
