"use client";

import { useMemo } from "react";
import type { RepoTrendPoint } from "@/types/analytics";

export function WeeklyTrendChart({ trend }: { trend: RepoTrendPoint[] }) {
  const chartHeight = 180;
  const padding = { top: 10, right: 10, bottom: 24, left: 36 };
  const width = 520;
  const innerW = width - padding.left - padding.right;
  const innerH = chartHeight - padding.top - padding.bottom;

  const points = useMemo(() => {
    if (trend.length === 0) return [];
    if (trend.length === 1) {
      return [
        {
          x: padding.left + innerW / 2,
          y: padding.top + innerH * (1 - trend[0].avgCompletionRate),
          week: trend[0].week,
          rate: trend[0].avgCompletionRate,
        },
      ];
    }
    return trend.map((p, i) => ({
      x: padding.left + (innerW * i) / (trend.length - 1),
      y:
        padding.top +
        innerH * (1 - Math.max(0, Math.min(1, p.avgCompletionRate))),
      week: p.week,
      rate: p.avgCompletionRate,
    }));
  }, [trend, innerH, innerW, padding.left, padding.top]);

  const path = points.length
    ? points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ")
    : "";

  return (
    <div className="bg-white border border-gray-200 rounded-xl px-5 py-4">
      <h3 className="text-sm font-semibold text-gray-900">
        Weekly completion rate trend
      </h3>
      <p className="text-xs text-gray-500 mb-3">
        Meaningful signal across{" "}
        {trend.reduce((s, p) => s + p.reviewsCompleted, 0)} cumulative sessions
      </p>
      {trend.length === 0 ? (
        <div className="h-45 flex items-center justify-center text-xs text-gray-400">
          Not enough data yet
        </div>
      ) : (
        <svg viewBox={`0 0 ${width} ${chartHeight}`} className="w-full h-45">
          {[0, 0.5, 0.65, 0.8, 1].map((rate) => {
            const y = padding.top + innerH * (1 - rate);
            return (
              <g key={rate}>
                <line
                  x1={padding.left}
                  x2={width - padding.right}
                  y1={y}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeDasharray="2 4"
                />
                <text
                  x={padding.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-gray-400"
                  fontSize="9"
                >
                  {Math.round(rate * 100)}%
                </text>
              </g>
            );
          })}
          <path
            d={path}
            stroke="#7C3AED"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {points.map((p) => (
            <circle key={p.week} cx={p.x} cy={p.y} r="3.5" fill="#7C3AED" />
          ))}
          {points.map((p) => (
            <text
              key={p.week}
              x={p.x}
              y={chartHeight - 6}
              textAnchor="middle"
              className="fill-gray-400"
              fontSize="9"
            >
              {p.week.replace(/^\d{4}-/, "")}
            </text>
          ))}
        </svg>
      )}
    </div>
  );
}
