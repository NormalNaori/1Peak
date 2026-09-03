import { LoadGroup, IndividualLoad } from "../App";

interface Props {
  loadGroups: LoadGroup[];
  totalCapacity: number;
}

const LEVEL_COLORS: Record<number, { main: string; bg: string; border: string }> = {
  1: { main: "#22c55e", bg: "rgba(34,197,94,0.08)", border: "rgba(34,197,94,0.2)" },
  2: { main: "#38bdf8", bg: "rgba(56,189,248,0.08)", border: "rgba(56,189,248,0.2)" },
  3: { main: "#a78bfa", bg: "rgba(167,139,250,0.08)", border: "rgba(167,139,250,0.2)" },
};

function PBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div style={{ background: "#0d1b2a", borderRadius: 4, height: 4, overflow: "hidden" }}>
      <div
        style={{
          width: `${Math.min(100, pct)}%`,
          height: "100%",
          background: color,
          opacity: 0.75,
          transition: "width 0.8s ease",
        }}
      />
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = { ON: "#22c55e", OFF: "#6b7280", SHED: "#ef4444" };

function LoadCard({ load }: { load: IndividualLoad }) {
  const col = STATUS_COLORS[load.status] ?? "#6b7280";
  const pct = load.ratedPower > 0 ? (load.currentPower / load.ratedPower) * 100 : 0;
  return (
    <div
      style={{
        background: "#0d1b2a",
        border: `1px solid ${load.status === "ON" ? "#1e3a5f" : "#1e293b"}`,
        borderRadius: 8,
        padding: "8px 10px",
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <span style={{ color: "#94a3b8", fontSize: 10.5, fontWeight: 600 }}>{load.name}</span>
        <div
          style={{
            background: `${col}18`,
            border: `1px solid ${col}44`,
            borderRadius: 4,
            padding: "1px 6px",
            color: col,
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: "0.08em",
          }}
        >
          {load.status}
        </div>
      </div>
      <div className="flex items-end justify-between mb-2">
        <span
          style={{
            color: load.status === "ON" ? "#e2e8f0" : "#4b5563",
            fontSize: 17,
            fontWeight: 800,
            fontFamily: "'Courier New', Courier, monospace",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {load.status === "ON" ? load.currentPower.toFixed(2) : "0.00"}
        </span>
        <span style={{ color: "#475569", fontSize: 9.5, marginBottom: 1 }}>
          kW / {load.ratedPower.toFixed(2)} kW rated
        </span>
      </div>
      <PBar pct={load.status === "ON" ? pct : 0} color={col} />
    </div>
  );
}

function LevelColumn({ group }: { group: LoadGroup }) {
  const col = LEVEL_COLORS[group.level] ?? LEVEL_COLORS[3];
  const pct = group.ratedPower > 0 ? (group.currentPower / group.ratedPower) * 100 : 0;

  return (
    <div
      style={{
        background: "#1e293b",
        border: `1px solid #334155`,
        borderRadius: 12,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        flex: 1,
      }}
    >
      {/* Level header */}
      <div
        style={{
          background: col.bg,
          borderBottom: `1px solid ${col.border}`,
          padding: "10px 14px",
          flexShrink: 0,
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: col.main,
                boxShadow: `0 0 6px ${col.main}`,
              }}
            />
            <span style={{ color: col.main, fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Level {group.level} — {group.name}
            </span>
          </div>
        </div>
        <div style={{ color: "#475569", fontSize: 8.5, marginBottom: 6 }}>{group.priority}</div>

        {/* KPI row */}
        <div className="flex gap-4">
          <div>
            <div style={{ color: "#334155", fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Current</div>
            <div style={{ color: col.main, fontSize: 14, fontWeight: 800, fontFamily: "'Courier New', monospace", fontVariantNumeric: "tabular-nums" }}>
              {group.currentPower.toFixed(2)} kW
            </div>
          </div>
          <div>
            <div style={{ color: "#334155", fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Rated</div>
            <div style={{ color: "#64748b", fontSize: 14, fontWeight: 800, fontFamily: "'Courier New', monospace", fontVariantNumeric: "tabular-nums" }}>
              {group.ratedPower.toFixed(2)} kW
            </div>
          </div>
          <div>
            <div style={{ color: "#334155", fontSize: 7.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Load</div>
            <div style={{ color: col.main, fontSize: 14, fontWeight: 800, fontFamily: "'Courier New', monospace", fontVariantNumeric: "tabular-nums" }}>
              {pct.toFixed(0)}%
            </div>
          </div>
        </div>
        <div style={{ marginTop: 8 }}>
          <PBar pct={pct} color={col.main} />
        </div>
      </div>

      {/* Load list */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {group.loads.map((load) => (
          <LoadCard key={load.name} load={load} />
        ))}
      </div>
    </div>
  );
}

export function LoadManagementPage({ loadGroups, totalCapacity }: Props) {
  const totalCurrent = loadGroups.reduce((s, g) => s + g.currentPower, 0);
  const totalRated = loadGroups.reduce((s, g) => s + g.ratedPower, 0);
  const systemPct = totalCapacity > 0 ? (totalCurrent / totalCapacity) * 100 : 0;
  const loadColor = systemPct > 90 ? "#ef4444" : systemPct > 75 ? "#eab308" : "#22c55e";

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Summary bar */}
      <div
        className="flex items-stretch"
        style={{ height: 64, borderBottom: "1px solid #1e293b", flexShrink: 0 }}
      >
        {[
          { lbl: "Total Load", val: `${totalCurrent.toFixed(2)}`, unit: "kW", col: "#38bdf8" },
          { lbl: "Rated Demand", val: `${totalRated.toFixed(2)}`, unit: "kW", col: "#64748b" },
          { lbl: "System Load", val: `${systemPct.toFixed(1)}`, unit: "%", col: loadColor },
          { lbl: "Capacity", val: `${totalCapacity.toFixed(1)}`, unit: "kW", col: "#475569" },
          { lbl: "Load Shedding", val: "INACTIVE", unit: "", col: "#22c55e" },
        ].map((k, i, arr) => (
          <div
            key={k.lbl}
            className="flex flex-col justify-center px-5"
            style={{ flex: 1, borderRight: i < arr.length - 1 ? "1px solid #1e293b" : "none" }}
          >
            <div style={{ color: "#334155", fontSize: 8.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 2 }}>
              {k.lbl}
            </div>
            <div className="flex items-end gap-1">
              <span style={{ color: k.col, fontSize: 20, fontWeight: 800, fontFamily: "'Courier New', Courier, monospace", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
                {k.val}
              </span>
              {k.unit && <span style={{ color: "#334155", fontSize: 10, fontWeight: 600, marginBottom: 1 }}>{k.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      {/* 3-column level layout */}
      <div
        style={{
          flex: 1,
          display: "flex",
          gap: 10,
          padding: 10,
          overflow: "hidden",
        }}
      >
        {loadGroups.map((lg) => (
          <LevelColumn key={lg.id} group={lg} />
        ))}
      </div>

      {/* Load shedding status strip */}
      <div
        className="flex items-center gap-4 px-4"
        style={{ height: 40, borderTop: "1px solid #1e293b", flexShrink: 0, background: "#0d1b2a" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(34,197,94,0.08)",
            border: "1px solid rgba(34,197,94,0.2)",
            borderRadius: 6,
            padding: "3px 10px",
          }}
        >
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 5px #22c55e" }} />
          <span style={{ color: "#22c55e", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em" }}>
            LOAD SHEDDING INACTIVE
          </span>
        </div>
        <span style={{ color: "#334155", fontSize: 9 }}>
          All loads energised — auto-shedding armed at 95% capacity
        </span>
        <div className="flex gap-2 ml-auto">
          {[1, 2, 3].map((lvl) => (
            <div
              key={lvl}
              style={{
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: 4,
                padding: "2px 8px",
                color: "#22c55e",
                fontSize: 8.5,
                fontWeight: 700,
              }}
            >
              LVL {lvl}: ENERGISED
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
