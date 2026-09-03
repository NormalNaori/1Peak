import { useState } from "react";
import { AlarmEvent } from "../App";

interface Props {
  alarms: AlarmEvent[];
}

type TabFilter = "ALL" | "ALARM" | "WARNING" | "EVENT";

const SEV_COLOR: Record<string, string> = {
  ALARM: "#ef4444",
  WARNING: "#eab308",
  EVENT: "#38bdf8",
};

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "#ef4444",
  ACKNOWLEDGED: "#eab308",
  CLEARED: "#22c55e",
};

function SeverityBadge({ severity }: { severity: AlarmEvent["severity"] }) {
  const col = SEV_COLOR[severity] ?? "#64748b";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: `${col}18`,
        border: `1px solid ${col}44`,
        borderRadius: 4,
        padding: "2px 6px",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <div style={{ width: 5, height: 5, borderRadius: "50%", background: col, boxShadow: `0 0 4px ${col}` }} />
      <span style={{ color: col, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em" }}>{severity}</span>
    </div>
  );
}

function StatusBadge({ status }: { status: AlarmEvent["status"] }) {
  const col = STATUS_COLOR[status] ?? "#64748b";
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: `${col}10`,
        border: `1px solid ${col}33`,
        borderRadius: 4,
        padding: "2px 6px",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <span style={{ color: col, fontSize: 9, fontWeight: 700, letterSpacing: "0.06em" }}>{status}</span>
    </div>
  );
}

function TableRow({ alarm, odd }: { alarm: AlarmEvent; odd: boolean }) {
  const isActive = alarm.status === "ACTIVE";
  return (
    <tr
      style={{
        background: isActive
          ? "rgba(239,68,68,0.06)"
          : odd
          ? "rgba(255,255,255,0.015)"
          : "transparent",
        borderBottom: "1px solid #1a2535",
      }}
    >
      <td
        style={{
          padding: "7px 12px",
          color: "#475569",
          fontSize: 10,
          fontFamily: "'Courier New', monospace",
          fontVariantNumeric: "tabular-nums",
          whiteSpace: "nowrap",
          width: 120,
        }}
      >
        {alarm.timestamp}
      </td>
      <td style={{ padding: "7px 8px", width: 100 }}>
        <SeverityBadge severity={alarm.severity} />
      </td>
      <td
        style={{
          padding: "7px 8px",
          color: "#64748b",
          fontSize: 10,
          fontWeight: 600,
          fontFamily: "'Courier New', monospace",
          width: 90,
        }}
      >
        {alarm.device}
      </td>
      <td
        style={{
          padding: "7px 8px",
          color: isActive ? "#e2e8f0" : "#64748b",
          fontSize: 10.5,
          flex: 1,
        }}
      >
        {alarm.description}
      </td>
      <td style={{ padding: "7px 8px", width: 110 }}>
        <StatusBadge status={alarm.status} />
      </td>
    </tr>
  );
}

export function AlarmsPage({ alarms }: Props) {
  const [tab, setTab] = useState<TabFilter>("ALL");

  const counts: Record<TabFilter, number> = {
    ALL: alarms.length,
    ALARM: alarms.filter((a) => a.severity === "ALARM").length,
    WARNING: alarms.filter((a) => a.severity === "WARNING").length,
    EVENT: alarms.filter((a) => a.severity === "EVENT").length,
  };

  const activeCount = alarms.filter((a) => a.status === "ACTIVE").length;
  const visible = tab === "ALL" ? alarms : alarms.filter((a) => a.severity === tab);
  const tabColor: Record<TabFilter, string> = {
    ALL: "#38bdf8",
    ALARM: "#ef4444",
    WARNING: "#eab308",
    EVENT: "#38bdf8",
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Summary bar */}
      <div
        className="flex items-stretch"
        style={{ height: 64, borderBottom: "1px solid #1e293b", flexShrink: 0 }}
      >
        {[
          { lbl: "Total Events", val: String(counts.ALL), col: "#64748b" },
          { lbl: "Active Alarms", val: String(activeCount), col: activeCount > 0 ? "#ef4444" : "#22c55e" },
          { lbl: "Alarms", val: String(counts.ALARM), col: counts.ALARM > 0 ? "#ef4444" : "#334155" },
          { lbl: "Warnings", val: String(counts.WARNING), col: counts.WARNING > 0 ? "#eab308" : "#334155" },
          { lbl: "Events", val: String(counts.EVENT), col: "#38bdf8" },
        ].map((k, i, arr) => (
          <div
            key={k.lbl}
            className="flex flex-col justify-center px-6"
            style={{ flex: 1, borderRight: i < arr.length - 1 ? "1px solid #1e293b" : "none" }}
          >
            <div style={{ color: "#334155", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>
              {k.lbl}
            </div>
            <div style={{ color: k.col, fontSize: 22, fontWeight: 800, fontFamily: "'Courier New', Courier, monospace", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {k.val}
            </div>
          </div>
        ))}
      </div>

      {/* Main panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          padding: 10,
          gap: 10,
        }}
      >
        <div
          style={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            flex: 1,
          }}
        >
          {/* Tab bar */}
          <div
            className="flex items-center gap-2 px-4 py-2.5 border-b"
            style={{ borderColor: "#334155", flexShrink: 0 }}
          >
            <span style={{ color: "#475569", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginRight: 8 }}>
              Alarms & Events
            </span>
            {(["ALL", "ALARM", "WARNING", "EVENT"] as TabFilter[]).map((t) => {
              const isActive = tab === t;
              const col = tabColor[t];
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  style={{
                    background: isActive ? `${col}18` : "transparent",
                    border: `1px solid ${isActive ? col + "44" : "#334155"}`,
                    borderRadius: 6,
                    padding: "3px 10px",
                    color: isActive ? col : "#475569",
                    fontSize: 9.5,
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.06em",
                  }}
                >
                  {t} ({counts[t]})
                </button>
              );
            })}
            {activeCount > 0 && (
              <div
                className="ml-auto flex items-center gap-1.5"
                style={{
                  background: "rgba(239,68,68,0.12)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 6,
                  padding: "3px 10px",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#ef4444",
                    boxShadow: "0 0 5px #ef4444",
                    animation: "alarmPulse 1.5s ease-in-out infinite",
                  }}
                />
                <span style={{ color: "#ef4444", fontSize: 9.5, fontWeight: 700 }}>
                  {activeCount} ACTIVE
                </span>
              </div>
            )}
          </div>

          {/* Table */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead style={{ position: "sticky", top: 0, background: "#0d1b2a", zIndex: 1 }}>
                <tr>
                  {[
                    { lbl: "Timestamp", w: 120 },
                    { lbl: "Severity", w: 100 },
                    { lbl: "Device", w: 90 },
                    { lbl: "Description", w: undefined },
                    { lbl: "Status", w: 110 },
                  ].map((h) => (
                    <th
                      key={h.lbl}
                      style={{
                        padding: "6px 8px 6px 12px",
                        textAlign: "left",
                        color: "#334155",
                        fontSize: 8.5,
                        fontWeight: 700,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        borderBottom: "1px solid #1e293b",
                        width: h.w,
                      }}
                    >
                      {h.lbl}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((a, i) => (
                  <TableRow key={a.id} alarm={a} odd={i % 2 === 1} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer legend */}
          <div
            className="flex items-center gap-4 px-4"
            style={{ height: 36, borderTop: "1px solid #1e293b", flexShrink: 0 }}
          >
            {[
              { lbl: "ALARM", col: "#ef4444" },
              { lbl: "WARNING", col: "#eab308" },
              { lbl: "EVENT", col: "#38bdf8" },
              { lbl: "ACTIVE", col: "#ef4444", status: true },
              { lbl: "ACKNOWLEDGED", col: "#eab308", status: true },
              { lbl: "CLEARED", col: "#22c55e", status: true },
            ].map((l, i, arr) => (
              <div key={l.lbl} className="flex items-center gap-1.5">
                {i === 3 && <div style={{ width: 1, height: 16, background: "#1e293b", marginRight: 4 }} />}
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: l.col }} />
                <span style={{ color: "#334155", fontSize: 8.5, fontWeight: 600 }}>{l.lbl}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
