import React from "react";
import { GeneratorData } from "../App";

interface Props {
  gen: GeneratorData;
}

const mono = { fontFamily: "'Courier New', Courier, monospace", fontVariantNumeric: "tabular-nums" as const };

function MeasCard({
  label,
  value,
  unit,
  run,
  accent = "#22c55e",
}: {
  label: string;
  value: string;
  unit: string;
  run: boolean;
  accent?: string;
}) {
  const col = run ? accent : "#4b5563";
  return (
    <div
      style={{
        background: "#0d1b2a",
        border: `1px solid ${run ? "#1e3a5f" : "#1e293b"}`,
        borderRadius: 8,
        padding: "7px 10px",
        flex: 1,
        minWidth: 0,
      }}
    >
      <div style={{ color: "#475569", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>
        {label}
      </div>
      <div className="flex items-end gap-1">
        <span className="value-transition" style={{ ...mono, color: col, fontSize: 20, fontWeight: 800, lineHeight: 1 }}>
          {value}
        </span>
        <span style={{ color: run ? "#475569" : "#374151", fontSize: 10, fontWeight: 600, marginBottom: 1 }}>{unit}</span>
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
  run,
  liveColor = "#22c55e",
}: {
  title: string;
  children: React.ReactNode;
  run: boolean;
  liveColor?: string;
}) {
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
      <div
        className="flex items-center gap-2 px-3 py-2 border-b"
        style={{ borderColor: "#334155" }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: run ? liveColor : "#334155",
            boxShadow: run ? `0 0 5px ${liveColor}` : "none",
          }}
        />
        <span style={{ color: "#64748b", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
          {title}
        </span>
        {run && (
          <span style={{ marginLeft: "auto", color: liveColor, fontSize: 9, fontWeight: 700, letterSpacing: "0.1em" }}>
            ● LIVE
          </span>
        )}
      </div>
      <div className="p-2.5" style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ value }: { value: "AUTO" | "MANUAL" | "FAULT" }) {
  const colors: Record<string, string> = { AUTO: "#22c55e", MANUAL: "#f59e0b", FAULT: "#ef4444" };
  const col = colors[value] ?? "#64748b";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: `${col}18`,
        border: `1px solid ${col}44`,
        borderRadius: 5,
        padding: "3px 8px",
      }}
    >
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: col, boxShadow: `0 0 4px ${col}` }} />
      <span style={{ ...mono, color: col, fontSize: 10, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", gap: 6 }}>{children}</div>;
}

export function LiveMeasurements({ gen }: Props) {
  const run = gen.running;
  const fmt = (v: number | undefined, d = 1) => (run && v != null ? v.toFixed(d) : "—");
  const fmtI = (v: number | undefined) => (run && v != null ? Math.round(v).toString() : "—");

  return (
    <>
      {/* ─ Generator Info ─ */}
      <div
        style={{
          background: "#1e293b",
          border: `1px solid ${run ? "#166534" : "#334155"}`,
          borderRadius: 10,
          padding: "10px 12px",
          flexShrink: 0,
        }}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: run ? "#22c55e" : "#6b7280",
                boxShadow: run ? "0 0 7px #22c55e" : "none",
              }}
            />
            <span style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              {gen.name}
            </span>
          </div>
          <div
            style={{
              background: run ? "rgba(34,197,94,0.12)" : "rgba(107,114,128,0.12)",
              border: `1px solid ${run ? "#166534" : "#374151"}`,
              color: run ? "#22c55e" : "#6b7280",
              borderRadius: 5,
              padding: "2px 8px",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            {run ? "RUNNING" : "STOPPED"}
          </div>
        </div>
        <div className="flex gap-4">
          {[
            { lbl: "Rated", val: `${gen.ratedPower} kW`, col: "#64748b" },
            { lbl: "Comm", val: gen.communication, col: gen.communication === "ONLINE" ? "#38bdf8" : "#6b7280" },
            { lbl: "Health", val: gen.health, col: gen.health === "Healthy" ? "#22c55e" : gen.health === "Warning" ? "#eab308" : "#ef4444" },
          ].map((s) => (
            <div key={s.lbl}>
              <div style={{ color: "#334155", fontSize: 8, textTransform: "uppercase", letterSpacing: "0.1em" }}>{s.lbl}</div>
              <div style={{ color: s.col, fontSize: 11.5, fontWeight: 700 }}>{s.val}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─ Electrical ─ */}
      <Panel title="Electrical" run={run}>
        {/* Voltage row */}
        <Row>
          <MeasCard label="L1 Volt" value={fmtI(gen.voltageA)} unit="V" run={run} />
          <MeasCard label="L2 Volt" value={fmtI(gen.voltageB)} unit="V" run={run} />
          <MeasCard label="L3 Volt" value={fmtI(gen.voltageC)} unit="V" run={run} />
        </Row>
        {/* Current row */}
        <Row>
          <MeasCard label="L1 Curr" value={fmt(gen.currentA, 2)} unit="A" run={run} accent="#38bdf8" />
          <MeasCard label="L2 Curr" value={fmt(gen.currentB, 2)} unit="A" run={run} accent="#38bdf8" />
          <MeasCard label="L3 Curr" value={fmt(gen.currentC, 2)} unit="A" run={run} accent="#38bdf8" />
        </Row>
        {/* Freq / kW / Load% */}
        <Row>
          <MeasCard label="Freq" value={fmt(gen.freqA, 2)} unit="Hz" run={run} accent="#a78bfa" />
          <MeasCard label="Active Pwr" value={fmt(gen.activePower, 2)} unit="kW" run={run} accent="#f59e0b" />
          <MeasCard label="Load" value={run ? (gen.loadPercent ?? 0).toFixed(0) : "—"} unit="%" run={run} accent={(gen.loadPercent ?? 0) > 90 ? "#ef4444" : "#22c55e"} />
        </Row>
      </Panel>

      {/* ─ Mechanical ─ */}
      <Panel title="Mechanical" run={run} liveColor="#f59e0b">
        <Row>
          <MeasCard label="Speed" value={run && gen.rpm != null ? String(gen.rpm) : "—"} unit="RPM" run={run} accent="#f59e0b" />
          <MeasCard label="Eng Temp" value={fmt(gen.engineTemp, 1)} unit="°C" run={run} accent={(gen.engineTemp ?? 0) > 80 ? "#ef4444" : "#f59e0b"} />
        </Row>
        <Row>
          <MeasCard label="Oil Press" value={fmt(gen.oilPressure, 2)} unit="bar" run={run} accent="#f59e0b" />
          <MeasCard label="Fuel Level" value={(run || (gen.fuelLevel ?? 0) > 0) && gen.fuelLevel != null ? gen.fuelLevel.toFixed(0) : "—"} unit="%" run={run || (gen.fuelLevel ?? 0) > 0} accent={(gen.fuelLevel ?? 100) < 30 ? "#ef4444" : "#22c55e"} />
        </Row>
      </Panel>

      {/* ─ Generator Control ─ */}
      <Panel title="Generator Control" run={run} liveColor="#a78bfa">
        <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#475569", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>
              AVR Status
            </div>
            <StatusBadge value={gen.avrStatus ?? "AUTO"} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#475569", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>
              Governor
            </div>
            <StatusBadge value={gen.governorStatus ?? "AUTO"} />
          </div>
        </div>
        <div style={{ marginTop: 2 }}>
          <div style={{ color: "#475569", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>
            Excitation Current
          </div>
          <div className="flex items-center gap-3">
            <span style={{ ...mono, color: run ? "#22c55e" : "#4b5563", fontSize: 22, fontWeight: 800, lineHeight: 1 }}>
              {run ? gen.excitationCurrent.toFixed(2) : "—"}
            </span>
            <span style={{ color: "#475569", fontSize: 11 }}>A</span>
            {run && (
              <div style={{ flex: 1, background: "#0d1b2a", borderRadius: 4, height: 6, overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.min(100, (gen.excitationCurrent / 5) * 100)}%`,
                    height: "100%",
                    background: "linear-gradient(90deg, #22c55e88, #22c55e)",
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </Panel>
    </>
  );
}
