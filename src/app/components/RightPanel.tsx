import { GeneratorData } from "../App";

interface Props {
  generators: GeneratorData[];
  totalLoad: number;
  systemLoadPercent: number;
  totalCapacity: number;
}

function loadColor(pct: number): string {
  if (pct >= 90) return "#ef4444";
  if (pct >= 70) return "#eab308";
  return "#22c55e";
}

function loadBg(pct: number): string {
  if (pct >= 90) return "rgba(239,68,68,0.12)";
  if (pct >= 70) return "rgba(234,179,8,0.12)";
  return "rgba(34,197,94,0.1)";
}

function loadBorder(pct: number): string {
  if (pct >= 90) return "#7f1d1d";
  if (pct >= 70) return "#713f12";
  return "#166534";
}

function HealthBadge({ health }: { health: GeneratorData["health"] }) {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    Healthy: { bg: "rgba(34,197,94,0.12)", text: "#22c55e", border: "#166534" },
    Warning: { bg: "rgba(234,179,8,0.12)", text: "#eab308", border: "#713f12" },
    Fault: { bg: "rgba(239,68,68,0.12)", text: "#ef4444", border: "#7f1d1d" },
  };
  const s = styles[health];
  return (
    <span
      className="text-xs font-bold px-2 py-0.5 rounded"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {health.toUpperCase()}
    </span>
  );
}

function GeneratorFanSVG({ running }: { running: boolean }) {
  const color = running ? "#22c55e" : "#4b5563";
  const ring = running ? "#166534" : "#1e293b";
  return (
    <svg width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="20" fill="#0a1628" stroke={ring} strokeWidth="1.5"
        style={running ? { filter: "drop-shadow(0 0 6px #22c55e)" } : {}}
      />
      <g
        style={
          running
            ? {
                animation: "fanSpin 0.8s linear infinite",
                transformBox: "fill-box",
                transformOrigin: "center",
              }
            : {}
        }
        transform="translate(22,22)"
      >
        <ellipse cx="0" cy="-9" rx="5" ry="9" fill={color} opacity={0.9} />
        <ellipse cx="9" cy="0" rx="9" ry="5" fill={color} opacity={0.9} />
        <ellipse cx="0" cy="9" rx="5" ry="9" fill={color} opacity={0.9} />
        <ellipse cx="-9" cy="0" rx="9" ry="5" fill={color} opacity={0.9} />
        <circle r="3.5" fill="#0f172a" stroke={color} strokeWidth="1.5" />
      </g>
    </svg>
  );
}

function StatusLED({ running }: { running: boolean }) {
  return (
    <div
      className="w-2.5 h-2.5 rounded-full"
      style={{
        background: running ? "#22c55e" : "#6b7280",
        boxShadow: running ? "0 0 8px #22c55e" : "none",
      }}
    />
  );
}

function GeneratorCard({ gen }: { gen: GeneratorData }) {
  const running = gen.running;
  const borderColor = running ? "#166534" : "#334155";
  const statusColor = running ? "#22c55e" : "#6b7280";

  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: "#1e293b",
        border: `1px solid ${borderColor}`,
        boxShadow: running ? "0 0 16px rgba(34,197,94,0.08)" : "none",
        flexShrink: 0,
      }}
    >
      {/* Top row: name + health + LED */}
      <div className="flex items-center gap-2 mb-2">
        <StatusLED running={running} />
        <span
          className="text-xs font-bold tracking-wider uppercase"
          style={{ color: "#94a3b8" }}
        >
          {gen.name}
        </span>
        <div className="ml-auto flex items-center gap-2">
          <HealthBadge health={gen.health} />
        </div>
      </div>

      {/* Status + Fan */}
      <div className="flex items-center gap-3 mb-2.5">
        <GeneratorFanSVG running={running} />
        <div>
          <div
            className="text-base font-extrabold tracking-widest"
            style={{ color: statusColor, letterSpacing: "0.15em" }}
          >
            {running ? "RUNNING" : "STOPPED"}
          </div>
          <div className="text-xs" style={{ color: "#475569" }}>
            Rated: {gen.ratedPower} kW
          </div>
        </div>

        {/* Comm badge */}
        <div className="ml-auto">
          <div
            className="flex items-center gap-1.5 px-2 py-1 rounded"
            style={{
              background:
                gen.communication === "ONLINE"
                  ? "rgba(14,165,233,0.1)"
                  : "rgba(107,114,128,0.1)",
              border: `1px solid ${gen.communication === "ONLINE" ? "#0c4a6e" : "#374151"}`,
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background:
                  gen.communication === "ONLINE" ? "#38bdf8" : "#6b7280",
              }}
            />
            <span
              className="text-xs font-bold"
              style={{
                color:
                  gen.communication === "ONLINE" ? "#38bdf8" : "#6b7280",
              }}
            >
              {gen.communication}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div
        className="grid grid-cols-3 gap-2 pt-2 border-t"
        style={{ borderColor: "#334155" }}
      >
        {[
          { label: "Voltage", value: running ? `${gen.voltage} V` : "— V" },
          {
            label: "Frequency",
            value: running ? `${gen.frequency.toFixed(2)} Hz` : "— Hz",
          },
          {
            label: "Excitation",
            value: running ? `${gen.excitationCurrent.toFixed(1)} A` : "0.0 A",
          },
        ].map((m) => (
          <div key={m.label} className="text-center">
            <div
              className="text-xs font-semibold"
              style={{
                color: running ? "#94a3b8" : "#4b5563",
                fontFamily: "'Courier New', monospace",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {m.value}
            </div>
            <div className="text-xs" style={{ color: "#334155", marginTop: 1 }}>
              {m.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RightPanel({
  generators,
  totalLoad,
  systemLoadPercent,
  totalCapacity,
}: Props) {
  const pct = systemLoadPercent;
  const color = loadColor(pct);
  const bgColor = loadBg(pct);
  const borderColor = loadBorder(pct);

  return (
    <>
      {/* ─── System Load KPI Card ─── */}
      <div
        className="rounded-xl p-4"
        style={{
          background: "#1e293b",
          border: `1px solid ${borderColor}`,
          boxShadow: `0 0 24px ${bgColor}`,
          flexShrink: 0,
        }}
      >
        {/* Title */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <div
              className="text-xs font-bold tracking-widest uppercase"
              style={{ color: "#64748b" }}
            >
              System Load
            </div>
            <div className="text-xs" style={{ color: "#334155" }}>
              Real-time power consumption
            </div>
          </div>
          <div
            className="px-2.5 py-1 rounded text-xs font-bold tracking-wider"
            style={{
              background: bgColor,
              border: `1px solid ${borderColor}`,
              color,
            }}
          >
            {pct >= 90 ? "OVERLOAD" : pct >= 70 ? "HIGH" : "NORMAL"}
          </div>
        </div>

        {/* Big percentage */}
        <div className="flex items-end gap-2 mb-3">
          <div
            style={{
              fontSize: "64px",
              fontWeight: 900,
              color,
              lineHeight: 1,
              textShadow: `0 0 24px ${color}88`,
              fontVariantNumeric: "tabular-nums",
              fontFamily: "'Courier New', monospace",
              transition: "color 0.5s ease",
            }}
          >
            {Math.round(pct)}
          </div>
          <div style={{ color, fontSize: "24px", fontWeight: 700, marginBottom: "6px" }}>
            %
          </div>
        </div>

        {/* Progress bar */}
        <div
          className="relative w-full h-4 rounded-full overflow-hidden mb-2"
          style={{ background: "#0f172a", border: "1px solid #1e293b" }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${color}99, ${color})`,
              boxShadow: `0 0 10px ${color}66`,
              transition: "width 0.8s ease, background 0.5s ease",
            }}
          />
          {/* 70% marker */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: "70%",
              width: "1px",
              background: "#eab30866",
            }}
          />
          {/* 90% marker */}
          <div
            className="absolute top-0 bottom-0"
            style={{
              left: "90%",
              width: "1px",
              background: "#ef444466",
            }}
          />
        </div>

        {/* kW display */}
        <div className="flex items-center justify-between">
          <span
            style={{
              color,
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "'Courier New', monospace",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {totalLoad.toFixed(2)} kW
          </span>
          <span className="text-xs" style={{ color: "#475569" }}>
            /
          </span>
          <span
            className="text-xs font-semibold"
            style={{ color: "#64748b", fontVariantNumeric: "tabular-nums" }}
          >
            {totalCapacity.toFixed(2)} kW
          </span>
        </div>

        {/* Scale labels */}
        <div
          className="flex justify-between text-xs mt-1"
          style={{ color: "#334155" }}
        >
          <span>0%</span>
          <span style={{ color: "#eab30844" }}>70%</span>
          <span style={{ color: "#ef444444" }}>90%</span>
          <span>100%</span>
        </div>
      </div>

      {/* ─── Generator Cards ─── */}
      <div className="flex flex-col gap-2 overflow-y-auto" style={{ flex: 1 }}>
        <div className="flex items-center gap-2 px-1">
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{ color: "#475569" }}
          >
            Generator Summary
          </span>
          <div className="flex-1 h-px" style={{ background: "#334155" }} />
        </div>

        {generators.map((gen) => (
          <GeneratorCard key={gen.id} gen={gen} />
        ))}
      </div>
    </>
  );
}
