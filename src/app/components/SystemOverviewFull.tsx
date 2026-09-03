import React, { useState, useEffect, useRef } from "react";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";
import { GeneratorData, LoadData, LoadGroup } from "../App";
import { SingleLineDiagram } from "./SingleLineDiagram";

interface Props {
  generators: GeneratorData[];
  loads: LoadData[];
  loadGroups: LoadGroup[];
  busEnergized: boolean;
  totalLoad: number;
  systemLoadPercent: number;
  totalCapacity: number;
}

// ─── Station KPI bar ────────────────────────────────────────────────────────

function KPIBar({ generators, totalLoad, systemLoadPercent, totalCapacity }: {
  generators: GeneratorData[];
  totalLoad: number;
  systemLoadPercent: number;
  totalCapacity: number;
}) {
  const runningCount = generators.filter((g) => g.running).length;
  const avgFreq =
    runningCount > 0
      ? generators.filter((g) => g.running).reduce((s, g) => s + g.freqA, 0) / runningCount
      : 0;
  const avgVolt =
    runningCount > 0
      ? Math.round(generators.filter((g) => g.running).reduce((s, g) => s + g.voltage, 0) / runningCount)
      : 0;
  const totalPower = generators.reduce((s, g) => s + (g.running ? (g.activePower ?? 0) : 0), 0);
  const loadColor = systemLoadPercent > 90 ? "#ef4444" : systemLoadPercent > 75 ? "#eab308" : "#22c55e";

  const kpis = [
    { lbl: "Total Output",  val: totalPower.toFixed(2),                            unit: "kW",  col: "#38bdf8" },
    { lbl: "System Load",   val: systemLoadPercent.toFixed(1),                     unit: "%",   col: loadColor },
    { lbl: "Bus Frequency", val: runningCount > 0 ? avgFreq.toFixed(2) : "—",     unit: "Hz",  col: "#a78bfa" },
    { lbl: "Bus Voltage",   val: runningCount > 0 ? String(avgVolt) : "—",         unit: "V",   col: "#22c55e" },
    { lbl: "Generators",    val: `${runningCount} / ${generators.length}`,         unit: "ON",  col: runningCount > 0 ? "#22c55e" : "#6b7280" },
    { lbl: "Capacity",      val: totalCapacity.toFixed(1),                         unit: "kW",  col: "#64748b" },
  ];

  return (
    <div className="flex items-stretch" style={{ height: 64, borderBottom: "1px solid #1e293b", flexShrink: 0 }}>
      {kpis.map((k, i) => (
        <div
          key={k.lbl}
          className="flex flex-col justify-center px-5"
          style={{ flex: 1, borderRight: i < kpis.length - 1 ? "1px solid #1e293b" : "none" }}
        >
          <div style={{ color: "#334155", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>
            {k.lbl}
          </div>
          <div className="flex items-end gap-1">
            <span className="value-transition" style={{ color: k.col, fontSize: 20, fontWeight: 800, fontFamily: "'Courier New', Courier, monospace", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {k.val}
            </span>
            <span style={{ color: "#334155", fontSize: 10, fontWeight: 600, marginBottom: 1 }}>{k.unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Load summary panel ─────────────────────────────────────────────────────

function LoadSummaryPanel({ loadGroups }: { loadGroups: LoadGroup[] }) {
  const levelColors: Record<number, string> = { 1: "#22c55e", 2: "#38bdf8", 3: "#a78bfa" };

  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: 10,
        padding: "10px 14px",
        flexShrink: 0,
      }}
    >
      <div style={{ color: "#475569", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 10 }}>
        Load Summary
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {loadGroups.map((lg) => {
          const col = levelColors[lg.level] ?? "#64748b";
          const pct = lg.ratedPower > 0 ? Math.min(100, (lg.currentPower / lg.ratedPower) * 100) : 0;
          return (
            <div key={lg.id}>
              {/* Label row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 5 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: col, boxShadow: `0 0 4px ${col}`, flexShrink: 0 }} />
                  <span style={{ color: col, fontSize: 9.5, fontWeight: 700, letterSpacing: "0.08em" }}>
                    LVL {lg.level}
                  </span>
                  <span style={{ color: "#64748b", fontSize: 9.5 }}>{lg.name}</span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700, fontFamily: "'Courier New', monospace", fontVariantNumeric: "tabular-nums" }}>
                    {lg.currentPower.toFixed(2)}
                  </span>
                  <span style={{ color: "#475569", fontSize: 9 }}>kW</span>
                  <span style={{ color: "#334155", fontSize: 9, marginLeft: 4 }}>/ {lg.ratedPower.toFixed(2)} kW</span>
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ background: "#0d1b2a", borderRadius: 4, height: 6, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${pct}%`,
                    height: "100%",
                    background: `linear-gradient(90deg, ${col}66, ${col})`,
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
              {/* Percent label */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}>
                <span style={{ color: "#334155", fontSize: 8.5, fontFamily: "'Courier New', monospace" }}>{pct.toFixed(0)}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Overview trends (vertical stack) ───────────────────────────────────────

interface TrendPoint { t: number; total: number; gen1: number; gen2: number }

const TIME_RANGES = [
  { label: "1m" },
  { label: "10m" },
  { label: "1h" },
  { label: "24h" },
];

const ZOOM_LEVELS = [1, 2, 4, 8];

function zoomedDomain(
  history: TrendPoint[],
  key: keyof TrendPoint,
  zoom: number
): [number, number] {
  const vals = history.map((p) => p[key] as number);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const center = (min + max) / 2;
  const halfRange = Math.max((max - min) / 2, 0.05);
  const zoomed = halfRange / zoom;
  return [
    parseFloat((center - zoomed * 1.3).toFixed(3)),
    parseFloat((center + zoomed * 1.3).toFixed(3)),
  ];
}

const ZOOM_BTN: React.CSSProperties = {
  background: "transparent",
  border: "1px solid #33415566",
  borderRadius: 3,
  padding: "0 4px",
  color: "#475569",
  fontSize: 10,
  fontWeight: 700,
  cursor: "pointer",
  lineHeight: "14px",
  height: 14,
  display: "inline-flex",
  alignItems: "center",
};

const ZOOM_BTN_DIM: React.CSSProperties = {
  ...ZOOM_BTN,
  opacity: 0.3,
  cursor: "default",
};

function OverviewTrends({ generators }: { generators: GeneratorData[] }) {
  const [range, setRange] = useState(0);
  const [history, setHistory] = useState<TrendPoint[]>(() =>
    Array.from({ length: 60 }, (_, i) => ({
      t: i,
      total: 6.5 + (Math.random() - 0.5) * 0.4,
      gen1: 3.4 + (Math.random() - 0.5) * 0.2,
      gen2: 3.1 + (Math.random() - 0.5) * 0.2,
    }))
  );
  const [yZooms, setYZooms] = useState<number[]>([0, 0, 0]); // index into ZOOM_LEVELS
  const genRef = useRef(generators);
  useEffect(() => { genRef.current = generators; }, [generators]);

  useEffect(() => {
    const id = setInterval(() => {
      const g = genRef.current;
      const total = g.reduce((s, gen) => s + (gen.running ? (gen.activePower ?? 0) : 0), 0);
      setHistory((prev) =>
        [...prev.slice(1), {
          t: 59,
          total,
          gen1: g[0].running ? (g[0].activePower ?? 0) : 0,
          gen2: g[1].running ? (g[1].activePower ?? 0) : 0,
        }].map((p, i) => ({ ...p, t: i }))
      );
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const charts: { dataKey: keyof TrendPoint; label: string; color: string; gradId: string }[] = [
    { dataKey: "total", label: "Total Output", color: "#38bdf8", gradId: "ot-grad-total" },
    { dataKey: "gen1",  label: "GEN 1 kW",     color: "#22c55e", gradId: "ot-grad-gen1"  },
    { dataKey: "gen2",  label: "GEN 2 kW",     color: "#a78bfa", gradId: "ot-grad-gen2"  },
  ];

  function adjustZoom(ci: number, delta: number) {
    setYZooms((prev) => {
      const next = [...prev];
      next[ci] = Math.max(0, Math.min(ZOOM_LEVELS.length - 1, next[ci] + delta));
      return next;
    });
  }

  return (
    <div
      style={{
        background: "#1e293b",
        border: "1px solid #334155",
        borderRadius: 10,
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-3 py-2 border-b"
        style={{ borderColor: "#334155" }}
      >
        <span style={{ color: "#475569", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Power Trends
        </span>
        <div className="flex gap-1 ml-auto">
          {TIME_RANGES.map((tr, i) => (
            <button
              key={tr.label}
              onClick={() => setRange(i)}
              style={{
                background: range === i ? "rgba(56,189,248,0.15)" : "transparent",
                border: `1px solid ${range === i ? "#38bdf8" : "#334155"}44`,
                borderRadius: 4,
                padding: "1px 5px",
                color: range === i ? "#38bdf8" : "#475569",
                fontSize: 8.5,
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {tr.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3 charts stacked vertically */}
      <div style={{ padding: "6px 10px 8px" }}>
        {charts.map((ch, ci) => {
          const zIdx = yZooms[ci];
          const zFactor = ZOOM_LEVELS[zIdx];
          const domain = zoomedDomain(history, ch.dataKey, zFactor);
          const canZoomIn  = zIdx < ZOOM_LEVELS.length - 1;
          const canZoomOut = zIdx > 0;

          return (
            <div
              key={ch.dataKey}
              style={{
                borderTop: ci > 0 ? "1px solid #1e293b" : "none",
                paddingTop: ci > 0 ? 6 : 0,
                marginTop: ci > 0 ? 6 : 0,
              }}
            >
              {/* Chart label row */}
              <div className="flex items-center gap-2 mb-1">
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: ch.color, flexShrink: 0 }} />
                <span style={{ color: ch.color, fontSize: 8.5, fontWeight: 700 }}>{ch.label}</span>
                <span style={{ color: "#334155", fontSize: 8.5, fontFamily: "'Courier New', monospace" }}>kW</span>
                {/* Y-axis zoom controls */}
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 3 }}>
                  <button
                    onClick={() => adjustZoom(ci, -1)}
                    style={canZoomOut ? ZOOM_BTN : ZOOM_BTN_DIM}
                    disabled={!canZoomOut}
                    title="Zoom out Y-axis"
                  >
                    −
                  </button>
                  <span style={{ color: "#475569", fontSize: 8, fontWeight: 700, fontFamily: "'Courier New', monospace", minWidth: 14, textAlign: "center" }}>
                    {zFactor}x
                  </span>
                  <button
                    onClick={() => adjustZoom(ci, 1)}
                    style={canZoomIn ? ZOOM_BTN : ZOOM_BTN_DIM}
                    disabled={!canZoomIn}
                    title="Zoom in Y-axis"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Chart */}
              <ResponsiveContainer key={`rc-${ch.dataKey}`} width="100%" aspect={5}>
                <AreaChart data={history} margin={{ top: 2, right: 2, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id={ch.gradId} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor={ch.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={ch.color} stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <YAxis key={`yaxis-${ci}`} hide domain={domain} />
                  <Area
                    key="area"
                    type="monotone"
                    dataKey={ch.dataKey as string}
                    stroke={ch.color}
                    strokeWidth={1.5}
                    fill={`url(#${ch.gradId})`}
                    isAnimationActive={false}
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main export ────────────────────────────────────────────────────────────

export function SystemOverviewFull({
  generators,
  loads,
  loadGroups,
  busEnergized,
  totalLoad,
  systemLoadPercent,
  totalCapacity,
}: Props) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* KPI bar */}
      <KPIBar
        generators={generators}
        totalLoad={totalLoad}
        systemLoadPercent={systemLoadPercent}
        totalCapacity={totalCapacity}
      />

      {/* Main body */}
      <div className="flex flex-1 overflow-hidden" style={{ gap: 0 }}>
        {/* Left: SLD — 43% */}
        <div style={{ flex: "0 0 43%", display: "flex", flexDirection: "column", borderRight: "1px solid #1e293b", overflow: "hidden" }}>
          <SingleLineDiagram
            generators={generators}
            loads={loads}
            busEnergized={busEnergized}
          />
        </div>

        {/* Right panels — 57% */}
        <div
          style={{
            flex: "0 0 57%",
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            overflowX: "hidden",
            padding: "10px",
            gap: 10,
          }}
        >
          {/* Load summary */}
          <LoadSummaryPanel loadGroups={loadGroups} />

          {/* Power trends — 3 charts stacked vertically */}
          <OverviewTrends generators={generators} />
        </div>
      </div>
    </div>
  );
}
