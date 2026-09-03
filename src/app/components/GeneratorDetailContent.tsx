import { useState, useEffect, useRef } from "react";
import { GeneratorData } from "../App";
import { LiveMeasurements } from "./LiveMeasurements";
import { TrendCharts } from "./TrendCharts";

export interface HistoryPoint {
  index: number; // 0 = oldest, 59 = newest
  va: number;
  vb: number;
  vc: number;
  fa: number;
  fb: number;
  fc: number;
  ex: number;
}

function initHistory(gen: GeneratorData): HistoryPoint[] {
  return Array.from({ length: 60 }, (_, i) => {
    if (!gen.running) {
      return { index: i, va: 0, vb: 0, vc: 0, fa: 0, fb: 0, fc: 0, ex: 0 };
    }
    const noise = (mag: number) => (Math.random() - 0.5) * mag;
    return {
      index: i,
      va: parseFloat((gen.voltageA + noise(5)).toFixed(1)),
      vb: parseFloat((gen.voltageB + noise(5)).toFixed(1)),
      vc: parseFloat((gen.voltageC + noise(5)).toFixed(1)),
      fa: parseFloat((50 + noise(0.1)).toFixed(2)),
      fb: parseFloat((50 + noise(0.1)).toFixed(2)),
      fc: parseFloat((50 + noise(0.1)).toFixed(2)),
      ex: parseFloat(Math.max(0, gen.excitationCurrent + noise(0.4)).toFixed(2)),
    };
  });
}

interface Props {
  gen: GeneratorData;
}

export function GeneratorDetailContent({ gen }: Props) {
  const [history, setHistory] = useState<HistoryPoint[]>(() => initHistory(gen));
  // Keep a ref to gen so the interval always sees the latest value
  const genRef = useRef(gen);
  useEffect(() => {
    genRef.current = gen;
  }, [gen]);

  // Append new data point every second, shift window left
  useEffect(() => {
    const t = setInterval(() => {
      const g = genRef.current;
      const noise = (mag: number) => (Math.random() - 0.5) * mag;
      const newPt: Omit<HistoryPoint, "index"> = g.running
        ? {
            va: parseFloat((g.voltageA + noise(2)).toFixed(1)),
            vb: parseFloat((g.voltageB + noise(2)).toFixed(1)),
            vc: parseFloat((g.voltageC + noise(2)).toFixed(1)),
            fa: parseFloat((50 + noise(0.06)).toFixed(2)),
            fb: parseFloat((50 + noise(0.06)).toFixed(2)),
            fc: parseFloat((50 + noise(0.06)).toFixed(2)),
            ex: parseFloat(Math.max(0, g.excitationCurrent + noise(0.08)).toFixed(2)),
          }
        : { va: 0, vb: 0, vc: 0, fa: 0, fb: 0, fc: 0, ex: 0 };

      setHistory((prev) =>
        [...prev.slice(1), { index: 59, ...newPt }].map((p, i) => ({ ...p, index: i }))
      );
    }, 1000);
    return () => clearInterval(t);
  }, []); // stable — reads from ref

  const run = gen.running;
  const avgV = run ? Math.round((gen.voltageA + gen.voltageB + gen.voltageC) / 3) : 0;
  const avgF = run ? ((gen.freqA + gen.freqB + gen.freqC) / 3).toFixed(2) : "—";

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Status header — full width */}
      <div
        className="flex items-center gap-6 px-4"
        style={{
          height: 56,
          flexShrink: 0,
          background: "#0d1b2a",
          borderBottom: "1px solid #1e293b",
        }}
      >
        <span
          style={{
            color: "#94a3b8",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {gen.name}
        </span>

        <div
          style={{
            background: run ? "rgba(34,197,94,0.12)" : "rgba(107,114,128,0.12)",
            border: `1px solid ${run ? "#166534" : "#374151"}`,
            color: run ? "#22c55e" : "#6b7280",
            borderRadius: 5,
            padding: "2px 10px",
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
          }}
        >
          {run ? "RUNNING" : "STOPPED"}
        </div>

        <div className="w-px h-7" style={{ background: "#1e293b" }} />

        {[
          { lbl: "AVG VOLTAGE", val: run ? `${avgV} V` : "— V", col: run ? "#e2e8f0" : "#4b5563" },
          { lbl: "FREQUENCY", val: run ? `${avgF} Hz` : "— Hz", col: run ? "#a78bfa" : "#4b5563" },
          { lbl: "ACTIVE POWER", val: run ? `${(gen.activePower ?? 0).toFixed(2)} kW` : "— kW", col: run ? "#f59e0b" : "#4b5563" },
          { lbl: "LOAD", val: run ? `${(gen.loadPercent ?? 0).toFixed(0)}%` : "—", col: run ? ((gen.loadPercent ?? 0) > 90 ? "#ef4444" : "#22c55e") : "#4b5563" },
        ].map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            {i > 0 && <div className="w-px h-7" style={{ background: "#1e293b" }} />}
            <div>
              <div style={{ color: "#334155", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
                {s.lbl}
              </div>
              <div
                className="value-transition"
                style={{
                  color: s.col,
                  fontSize: 16,
                  fontWeight: 800,
                  fontFamily: "'Courier New', Courier, monospace",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: 1.2,
                }}
              >
                {s.val}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main body */}
      <div className="flex flex-1 overflow-hidden p-3 gap-3">
        {/* Left: Live Measurements — 40% */}
        <div
          className="flex flex-col overflow-y-auto overflow-x-hidden"
          style={{ flex: "0 0 40%", gap: "10px" }}
        >
          <LiveMeasurements gen={gen} />
        </div>

        {/* Right: Trend Charts — 60% */}
        <div
          className="flex flex-col overflow-y-auto overflow-x-hidden"
          style={{ flex: "0 0 60%", gap: "10px" }}
        >
          <TrendCharts history={history} running={gen.running} />
        </div>
      </div>
    </div>
  );
}
