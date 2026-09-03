import { useState, useEffect } from "react";
import { GeneratorData } from "../App";

interface Props {
  gen: GeneratorData;
}

function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color?: string;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs" style={{ color: "#475569" }}>
        {label}:
      </span>
      <span
        className="text-xs font-bold"
        style={{
          color: color ?? "#94a3b8",
          fontFamily: "'Courier New', monospace",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div className="w-px self-stretch my-1" style={{ background: "#334155" }} />
  );
}

export function GenDetailStatusBar({ gen }: Props) {
  const [now, setNow] = useState(new Date());
  const [cpu, setCpu] = useState(3.8);

  useEffect(() => {
    const t = setInterval(() => {
      setNow(new Date());
      setCpu(parseFloat((Math.random() * 5 + 2).toFixed(1)));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const run = gen.running;
  const timeStr = now.toLocaleTimeString("en-GB", { hour12: false });
  const avgV = run ? Math.round((gen.voltageA + gen.voltageB + gen.voltageC) / 3) : 0;
  const avgF = run
    ? parseFloat(((gen.freqA + gen.freqB + gen.freqC) / 3).toFixed(2))
    : 0;

  return (
    <div
      className="flex items-center gap-4 px-4"
      style={{
        height: "36px",
        flexShrink: 0,
        background: "#0f172a",
        borderTop: "1px solid #1e293b",
      }}
    >
      {/* Generator name */}
      <span
        className="text-xs font-bold tracking-wider uppercase"
        style={{ color: "#475569" }}
      >
        {gen.name}
      </span>

      <Divider />

      {/* Status */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: run ? "#22c55e" : "#6b7280",
            boxShadow: run ? "0 0 5px #22c55e" : "none",
          }}
        />
        <span
          className="text-xs font-bold"
          style={{ color: run ? "#22c55e" : "#6b7280" }}
        >
          {run ? "RUNNING" : "STOPPED"}
        </span>
      </div>

      <Divider />

      {/* Communication */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: gen.communication === "ONLINE" ? "#38bdf8" : "#6b7280",
          }}
        />
        <span
          className="text-xs font-semibold"
          style={{ color: "#64748b" }}
        >
          COMM {gen.communication}
        </span>
      </div>

      <Divider />

      <StatItem
        label="AVG VOLTAGE"
        value={run ? `${avgV} V` : "— V"}
        color={run ? "#94a3b8" : "#4b5563"}
      />

      <Divider />

      <StatItem
        label="AVG FREQ"
        value={run ? `${avgF.toFixed(2)} Hz` : "— Hz"}
        color={run ? "#94a3b8" : "#4b5563"}
      />

      <Divider />

      <StatItem
        label="EXCITATION"
        value={`${gen.excitationCurrent.toFixed(2)} A`}
        color={run ? "#22c55e" : "#4b5563"}
      />

      <Divider />

      <StatItem
        label="RATED"
        value={`${gen.ratedPower} kW`}
        color="#64748b"
      />

      <Divider />

      <StatItem
        label="POWER"
        value={run ? `${(gen.activePower ?? 0).toFixed(2)} kW` : "— kW"}
        color={run ? "#38bdf8" : "#4b5563"}
      />

      <Divider />

      <StatItem
        label="LOAD"
        value={run ? `${(gen.loadPercent ?? 0).toFixed(0)}%` : "—"}
        color={run ? ((gen.loadPercent ?? 0) > 90 ? "#ef4444" : "#22c55e") : "#4b5563"}
      />

      <Divider />

      <StatItem label="CPU" value={`${cpu}%`} />

      <Divider />

      <div className="flex items-center gap-1.5 ml-auto">
        <span className="text-xs" style={{ color: "#334155" }}>
          LAST UPDATE
        </span>
        <span
          className="text-xs font-bold"
          style={{
            color: "#475569",
            fontFamily: "'Courier New', monospace",
          }}
        >
          {timeStr}
        </span>
      </div>
    </div>
  );
}
