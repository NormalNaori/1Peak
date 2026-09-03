import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { HistoryPoint } from "./GeneratorDetailContent";

interface Props {
  history: HistoryPoint[];
  running: boolean;
}

// ─── Shared chart tokens ──────────────────────────────────────────────────────
const C = {
  phaseA: "#22c55e",
  phaseB: "#3b82f6",
  phaseC: "#f59e0b",
  excit: "#22c55e",
  grid: "#1e293b",
  axis: "#64748b",
  panel: "#1e293b",
  border: "#334155",
};

const TOOLTIP_STYLE = {
  contentStyle: {
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 8,
    color: "#e2e8f0",
    fontSize: 11,
    padding: "6px 10px",
  },
  labelStyle: { color: "#64748b", fontSize: 10 },
  itemStyle: { padding: "1px 0" },
};

const LEGEND_STYLE = {
  wrapperStyle: {
    paddingTop: 2,
    fontSize: 10,
    color: "#94a3b8",
    lineHeight: "18px",
  },
};

function xTickFormatter(v: number): string {
  if (v === 0)  return "-60s";
  if (v === 15) return "-45s";
  if (v === 30) return "-30s";
  if (v === 45) return "-15s";
  if (v === 59) return "0s";
  return "";
}

// ─── Zoom helpers ─────────────────────────────────────────────────────────────

const ZOOM_LEVELS = [1, 2, 4, 8];

function zoomDomain(center: number, halfRange: number, zoomIdx: number): [number, number] {
  const factor = ZOOM_LEVELS[zoomIdx];
  const z = halfRange / factor;
  return [center - z, center + z];
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

// ─── Panel wrapper ────────────────────────────────────────────────────────────
interface ChartPanelProps {
  title: string;
  children: React.ReactNode;
  offline: boolean;
  liveColor?: string;
  zoomIdx: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

function ChartPanel({ title, children, offline, liveColor = "#22c55e", zoomIdx, onZoomIn, onZoomOut }: ChartPanelProps) {
  const canZoomIn  = zoomIdx < ZOOM_LEVELS.length - 1;
  const canZoomOut = zoomIdx > 0;

  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden"
      style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{ borderColor: C.border, flexShrink: 0 }}
      >
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: offline ? "#6b7280" : liveColor,
            boxShadow: offline ? "none" : `0 0 6px ${liveColor}`,
          }}
        />
        <span
          className="text-xs font-semibold tracking-widest uppercase"
          style={{ color: "#94a3b8" }}
        >
          {title}
        </span>
        <span className="text-xs" style={{ color: "#475569" }}>
          LAST 60s
        </span>
        {/* Y-axis zoom controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
          <button
            onClick={onZoomOut}
            style={canZoomOut ? ZOOM_BTN : ZOOM_BTN_DIM}
            disabled={!canZoomOut}
            title="Zoom out Y-axis"
          >
            −
          </button>
          <span style={{ color: "#475569", fontSize: 8, fontWeight: 700, fontFamily: "'Courier New', monospace", minWidth: 14, textAlign: "center" }}>
            {ZOOM_LEVELS[zoomIdx]}x
          </span>
          <button
            onClick={onZoomIn}
            style={canZoomIn ? ZOOM_BTN : ZOOM_BTN_DIM}
            disabled={!canZoomIn}
            title="Zoom in Y-axis"
          >
            +
          </button>
        </div>
        {offline && (
          <span
            className="text-xs font-bold ml-auto"
            style={{ color: "#6b7280", letterSpacing: "0.1em" }}
          >
            OFFLINE
          </span>
        )}
        {!offline && (
          <span
            className="text-xs font-bold ml-auto"
            style={{ color: "#22c55e", letterSpacing: "0.1em" }}
          >
            ● LIVE
          </span>
        )}
      </div>

      {/* Chart area */}
      <div style={{ padding: "6px 8px 4px 0" }}>
        {children}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function TrendCharts({ history, running }: Props) {
  const offline = !running;
  const [vZoomIdx, setVZoomIdx] = useState(0);
  const [fZoomIdx, setFZoomIdx] = useState(0);
  const [eZoomIdx, setEZoomIdx] = useState(0);

  // Zoom-aware domains
  // Voltage: nominal [385, 415] → center 400, halfRange 15
  const vDomain: [number, number] = offline ? [0, 420] : zoomDomain(400, 15, vZoomIdx);
  // Frequency: nominal [49.5, 50.5] → center 50, halfRange 0.5
  const fDomain: [number, number] = offline ? [0, 52]  : zoomDomain(50, 0.5, fZoomIdx);
  // Excitation: nominal [0, 5] → center 2.5, halfRange 2.5
  const eDomain: [number, number] = zoomDomain(2.5, 2.5, eZoomIdx);

  // Shared x-axis props
  const xAxisProps = {
    dataKey: "index" as const,
    type: "number" as const,
    domain: [0, 59] as [number, number],
    ticks: [0, 15, 30, 45, 59],
    tickFormatter: xTickFormatter,
    tick: { fill: C.axis, fontSize: 9 },
    axisLine: { stroke: C.border },
    tickLine: false as false,
    interval: 0,
    scale: "linear" as const,
  };

  const yAxisProps = {
    tick: { fill: C.axis, fontSize: 9 },
    axisLine: false as false,
    tickLine: false as false,
    width: 42,
  };

  const gridProps = {
    strokeDasharray: "3 3" as string,
    stroke: "#253047",
    vertical: false as false,
  };

  return (
    <>
      {/* ═══ Chart 1: Three-Phase Voltage ═══ */}
      <ChartPanel
        title="Three-Phase Voltage Trend"
        offline={offline}
        liveColor="#22c55e"
        zoomIdx={vZoomIdx}
        onZoomIn={() => setVZoomIdx((z) => Math.min(ZOOM_LEVELS.length - 1, z + 1))}
        onZoomOut={() => setVZoomIdx((z) => Math.max(0, z - 1))}
      >
        <ResponsiveContainer width="100%" aspect={3.5}>
          <LineChart
            data={history}
            margin={{ top: 4, right: 16, bottom: 2, left: 0 }}
          >
            <CartesianGrid key="v-grid" {...gridProps} />
            <XAxis key="v-xaxis" {...xAxisProps} />
            <YAxis
              key="v-yaxis"
              {...yAxisProps}
              domain={vDomain}
              tickFormatter={(v) => `${v}V`}
            />
            <Tooltip
              key="v-tooltip"
              {...TOOLTIP_STYLE}
              formatter={(v: number, name: string) => [`${v.toFixed(1)} V`, name]}
              labelFormatter={() => ""}
            />
            <Legend key="v-legend" {...LEGEND_STYLE} />
            <ReferenceLine
              key="v-refline"
              y={200}
              stroke="transparent"
              label={offline ? {
                value: "GENERATOR OFFLINE",
                position: "center",
                fill: "#334155",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 3,
              } : undefined}
            />
            <Line
              key="v-a"
              type="monotone"
              dataKey="va"
              name="L1 Voltage"
              stroke={C.phaseA}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              strokeOpacity={offline ? 0.15 : 1}
            />
            <Line
              key="v-b"
              type="monotone"
              dataKey="vb"
              name="L2 Voltage"
              stroke={C.phaseB}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              strokeOpacity={offline ? 0.15 : 1}
            />
            <Line
              key="v-c"
              type="monotone"
              dataKey="vc"
              name="L3 Voltage"
              stroke={C.phaseC}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              strokeOpacity={offline ? 0.15 : 1}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartPanel>

      {/* ═══ Chart 2: Three-Phase Frequency ═══ */}
      <ChartPanel
        title="Three-Phase Frequency Trend"
        offline={offline}
        liveColor="#3b82f6"
        zoomIdx={fZoomIdx}
        onZoomIn={() => setFZoomIdx((z) => Math.min(ZOOM_LEVELS.length - 1, z + 1))}
        onZoomOut={() => setFZoomIdx((z) => Math.max(0, z - 1))}
      >
        <ResponsiveContainer width="100%" aspect={3.5}>
          <LineChart
            data={history}
            margin={{ top: 4, right: 16, bottom: 2, left: 0 }}
          >
            <CartesianGrid key="f-grid" {...gridProps} />
            <XAxis key="f-xaxis" {...xAxisProps} />
            <YAxis
              key="f-yaxis"
              {...yAxisProps}
              domain={fDomain}
              tickFormatter={(v) => `${v.toFixed(1)}`}
              tickCount={5}
            />
            <Tooltip
              key="f-tooltip"
              {...TOOLTIP_STYLE}
              formatter={(v: number, name: string) => [`${v.toFixed(2)} Hz`, name]}
              labelFormatter={() => ""}
            />
            <Legend key="f-legend" {...LEGEND_STYLE} />
            <ReferenceLine
              key="f-refline"
              y={26}
              stroke="transparent"
              label={offline ? {
                value: "GENERATOR OFFLINE",
                position: "center",
                fill: "#334155",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 3,
              } : undefined}
            />
            <Line
              key="f-a"
              type="monotone"
              dataKey="fa"
              name="L1 Freq"
              stroke={C.phaseA}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              strokeOpacity={offline ? 0.15 : 1}
            />
            <Line
              key="f-b"
              type="monotone"
              dataKey="fb"
              name="L2 Freq"
              stroke={C.phaseB}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              strokeOpacity={offline ? 0.15 : 1}
            />
            <Line
              key="f-c"
              type="monotone"
              dataKey="fc"
              name="L3 Freq"
              stroke={C.phaseC}
              strokeWidth={1.5}
              dot={false}
              isAnimationActive={false}
              strokeOpacity={offline ? 0.15 : 1}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartPanel>

      {/* ═══ Chart 3: Excitation Current ═══ */}
      <ChartPanel
        title="Excitation Current Trend"
        offline={offline}
        liveColor="#22c55e"
        zoomIdx={eZoomIdx}
        onZoomIn={() => setEZoomIdx((z) => Math.min(ZOOM_LEVELS.length - 1, z + 1))}
        onZoomOut={() => setEZoomIdx((z) => Math.max(0, z - 1))}
      >
        <ResponsiveContainer width="100%" aspect={3.5}>
          <LineChart
            data={history}
            margin={{ top: 4, right: 16, bottom: 2, left: 0 }}
          >
            <CartesianGrid key="e-grid" {...gridProps} />
            <XAxis key="e-xaxis" {...xAxisProps} />
            <YAxis
              key="e-yaxis"
              {...yAxisProps}
              domain={eDomain}
              tickFormatter={(v) => `${v}A`}
              tickCount={6}
            />
            <Tooltip
              key="e-tooltip"
              {...TOOLTIP_STYLE}
              formatter={(v: number, name: string) => [`${v.toFixed(2)} A`, name]}
              labelFormatter={() => ""}
            />
            <Legend key="e-legend" {...LEGEND_STYLE} />
            <ReferenceLine
              key="e-refline"
              y={2.5}
              stroke="transparent"
              label={offline ? {
                value: "GENERATOR OFFLINE",
                position: "center",
                fill: "#334155",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 3,
              } : undefined}
            />
            <Line
              key="e-ex"
              type="monotone"
              dataKey="ex"
              name="Excitation"
              stroke={C.excit}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              strokeOpacity={offline ? 0.15 : 1}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartPanel>
    </>
  );
}
