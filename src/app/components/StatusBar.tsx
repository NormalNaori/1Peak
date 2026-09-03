import { useState, useEffect } from "react";
import { GeneratorData } from "../App";

interface Props {
  generators: GeneratorData[];
  totalLoad: number;
  systemLoadPercent: number;
  busEnergized: boolean;
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
    <div
      className="w-px self-stretch my-1"
      style={{ background: "#334155" }}
    />
  );
}

export function StatusBar({
  generators,
  totalLoad,
  systemLoadPercent,
  busEnergized,
}: Props) {
  const [now, setNow] = useState(new Date());
  const [cpu, setCpu] = useState(4.2);

  useEffect(() => {
    const t = setInterval(() => {
      setNow(new Date());
      setCpu(parseFloat((Math.random() * 5 + 2).toFixed(1)));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString("en-GB", { hour12: false });
  const runningCount = generators.filter((g) => g.running).length;
  const totalGenerated = generators
    .filter((g) => g.running && g.contactorClosed)
    .reduce((sum, g) => sum + g.ratedPower * 0.9, 0);
  const powerBalance = totalGenerated - totalLoad;

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
      {/* PLC Status */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: "#22c55e",
            boxShadow: "0 0 5px #22c55e",
          }}
        />
        <span className="text-xs font-bold" style={{ color: "#22c55e" }}>
          PLC ONLINE
        </span>
      </div>

      <Divider />

      {/* Comm Status */}
      <div className="flex items-center gap-1.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{
            background: "#38bdf8",
            boxShadow: "0 0 4px #38bdf8",
          }}
        />
        <span className="text-xs font-semibold" style={{ color: "#64748b" }}>
          COMM OK
        </span>
      </div>

      <Divider />

      {/* Bus */}
      <StatItem
        label="AC BUS"
        value={busEnergized ? "ENERGIZED" : "DEAD"}
        color={busEnergized ? "#22c55e" : "#6b7280"}
      />

      <Divider />

      {/* Generators running */}
      <StatItem
        label="GEN RUNNING"
        value={`${runningCount} / ${generators.length}`}
        color={runningCount > 0 ? "#22c55e" : "#6b7280"}
      />

      <Divider />

      {/* Total generated */}
      <StatItem
        label="TOTAL GEN"
        value={`${totalGenerated.toFixed(2)} kW`}
        color="#94a3b8"
      />

      <Divider />

      {/* Total load */}
      <StatItem
        label="TOTAL LOAD"
        value={`${totalLoad.toFixed(2)} kW`}
        color="#94a3b8"
      />

      <Divider />

      {/* Power balance */}
      <StatItem
        label="BALANCE"
        value={`${powerBalance >= 0 ? "+" : ""}${powerBalance.toFixed(2)} kW`}
        color={powerBalance >= 0 ? "#22c55e" : "#ef4444"}
      />

      <Divider />

      {/* System load % */}
      <StatItem
        label="SYS LOAD"
        value={`${Math.round(systemLoadPercent)}%`}
        color={
          systemLoadPercent >= 90
            ? "#ef4444"
            : systemLoadPercent >= 70
            ? "#eab308"
            : "#22c55e"
        }
      />

      <Divider />

      {/* CPU */}
      <StatItem label="CPU" value={`${cpu}%`} />

      <Divider />

      {/* Last update */}
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
