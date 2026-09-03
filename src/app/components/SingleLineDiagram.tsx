import { GeneratorData, LoadData } from "../App";

interface Props {
  generators: GeneratorData[];
  loads: LoadData[];
  busEnergized: boolean;
}

// ─── Layout constants ────────────────────────────────────────────────────────
const VB_W = 700;
const VB_H = 510;

// Column x-centers (load columns align with generator columns)
const L1_X = 130; // Load 1 / G1 / primary bus tie
const L2_X = 350; // Load 2 / G2 (G2 routes through G1 feeder)
const L3_X = 570; // Load 3 / G3

// Load side
const METER_TOP = 12;
const METER_H = 68;
const METER_W = 124;
const METER_BOTTOM = METER_TOP + METER_H; // 80

const LC_CY = 148;   // load contactor center-y
const LC_HALF = 15;

// Bus
const BUS_Y = 210;
const BUS_H = 12;
const BUS_BOT = BUS_Y + BUS_H; // 222
const BUS_X1 = 48;
const BUS_X2 = 652;

// Generator side (vertical contactors on G1 and G3)
const GC_HALF = 15;
const GC1_CY = 282; // G1 contactor — shared gateway for G1+G2
const GC3_CY = 282; // G3 contactor

// G2 topology: rises vertically, then routes LEFT through GC-2 (horizontal)
// to a T-junction on G1's feeder, below GC-1.
const JUNCTION_Y = 338; // T-junction on G1 feeder where G2 taps in
const GC2_CX = 240;    // x center of horizontal contactor GC-2
const GC2_CY = JUNCTION_Y;
const GC2_HALF = 15;

// Generator boxes
const GEN_BOX_TOP = 382;
const GEN_BOX_H = 102;
const GEN_BOX_W = 120;
const GEN_BOX_BOT = GEN_BOX_TOP + GEN_BOX_H; // 484

const FAN_Y_OFF = 61; // fan center offset from GEN_BOX_TOP
const FAN_R = 26;

// ─── Colors ──────────────────────────────────────────────────────────────────
const GREEN = "#22c55e";
const GREEN_DIM = "#166534";
const GRAY = "#6b7280";
const CABLE_BG = "#334155";
const CABLE_ON_BG = "#14532d";

// ─── Helpers ─────────────────────────────────────────────────────────────────
type Dir = "down" | "up" | "left";

function VertCable({
  cx, y1, y2, on, dir = "up",
}: {
  cx: number; y1: number; y2: number; on: boolean; dir?: Dir;
}) {
  return (
    <g>
      <line x1={cx} y1={y1} x2={cx} y2={y2}
            stroke={on ? CABLE_ON_BG : CABLE_BG} strokeWidth={3} />
      {on && (
        <line x1={cx} y1={y1} x2={cx} y2={y2}
              stroke={GREEN} strokeWidth={2.5}
              className={dir === "down" ? "cable-down" : "cable-up"}
              style={{ filter: "drop-shadow(0 0 3px #22c55e)" }} />
      )}
    </g>
  );
}

function HorizCable({
  x1, y, x2, on,
}: {
  x1: number; y: number; x2: number; on: boolean;
}) {
  // draw x1→x2; "cable-down" flows in path direction (left when x1>x2)
  return (
    <g>
      <line x1={x1} y1={y} x2={x2} y2={y}
            stroke={on ? CABLE_ON_BG : CABLE_BG} strokeWidth={3} />
      {on && (
        <line x1={x1} y1={y} x2={x2} y2={y}
              stroke={GREEN} strokeWidth={2.5}
              className="cable-down"
              style={{ filter: "drop-shadow(0 0 3px #22c55e)" }} />
      )}
    </g>
  );
}

// Vertical switch contactor (for GC-1, GC-3, and load contactors)
function VContactor({
  cx, cy, closed, energized, label,
}: {
  cx: number; cy: number; closed: boolean; energized: boolean; label: string;
}) {
  const color = closed ? GREEN : GRAY;
  const t1y = cy - GC_HALF;
  const t2y = cy + GC_HALF;
  // Blade: closed = straight, open = angled right
  const bex = closed ? cx : cx + 18;
  const bey = closed ? t2y : cy + 4;

  return (
    <g filter={closed && energized ? "url(#greenGlow)" : undefined}>
      <circle cx={cx} cy={t1y} r={4.5} fill={color} />
      <circle cx={cx} cy={t2y} r={4.5} fill={color} />
      <line x1={cx} y1={t1y} x2={bex} y2={bey}
            stroke={color} strokeWidth={3} strokeLinecap="round" />
      <text x={cx + 24} y={cy + 4} fill="#475569"
            fontSize={9} letterSpacing={0.5}>{label}</text>
    </g>
  );
}

// Horizontal switch contactor (for GC-2 on G2's horizontal feeder)
function HContactor({
  cx, cy, closed, energized, label,
}: {
  cx: number; cy: number; closed: boolean; energized: boolean; label: string;
}) {
  const color = closed ? GREEN : GRAY;
  const t1x = cx - GC2_HALF;
  const t2x = cx + GC2_HALF;
  // Blade: closed = straight, open = angled down from left terminal
  const bex = closed ? t2x : t1x + 12;
  const bey = closed ? cy : cy + 14;

  return (
    <g filter={closed && energized ? "url(#greenGlow)" : undefined}>
      <circle cx={t1x} cy={cy} r={4.5} fill={color} />
      <circle cx={t2x} cy={cy} r={4.5} fill={color} />
      <line x1={t1x} y1={cy} x2={bex} y2={bey}
            stroke={color} strokeWidth={3} strokeLinecap="round" />
      {/* Label above */}
      <text x={cx} y={cy - 12} fill="#475569"
            fontSize={9} textAnchor="middle" letterSpacing={0.5}>{label}</text>
    </g>
  );
}

// Fan icon in generator box
function FanIcon({
  cx, cy, running, r,
}: {
  cx: number; cy: number; running: boolean; r: number;
}) {
  const blade = running ? GREEN : "#4b5563";
  return (
    <g transform={`translate(${cx},${cy})`}>
      <circle r={r} fill="#0a1628"
              stroke={running ? GREEN_DIM : "#1e293b"} strokeWidth={1.5}
              filter={running ? "url(#greenGlowSoft)" : undefined} />
      <g className={running ? "fan-spin" : ""}>
        <ellipse cx={0} cy={-r * 0.4} rx={r * 0.22} ry={r * 0.44} fill={blade} opacity={0.9} />
        <ellipse cx={r * 0.4} cy={0} rx={r * 0.44} ry={r * 0.22} fill={blade} opacity={0.9} />
        <ellipse cx={0} cy={r * 0.4} rx={r * 0.22} ry={r * 0.44} fill={blade} opacity={0.9} />
        <ellipse cx={-r * 0.4} cy={0} rx={r * 0.44} ry={r * 0.22} fill={blade} opacity={0.9} />
        <circle r={r * 0.15} fill="#0f172a" stroke={blade} strokeWidth={1.5} />
      </g>
    </g>
  );
}

// Load digital meter
function LoadMeter({
  cx, load, busOn,
}: {
  cx: number; load: LoadData; busOn: boolean;
}) {
  const on = load.contactorClosed && busOn;
  const border = on ? GREEN : "#334155";
  const val = on ? GREEN : "#374151";
  const dim = on ? "#86efac" : "#374151";
  const bx = cx - METER_W / 2;

  return (
    <g filter={on ? "url(#greenGlowSoft)" : undefined}>
      <rect x={bx} y={METER_TOP} width={METER_W} height={METER_H}
            rx={7} fill="#0a1628" stroke={border} strokeWidth={1.5} />
      <rect x={bx + 4} y={METER_TOP + 30} width={METER_W - 8} height={35}
            rx={4} fill="#060e1a"
            stroke={on ? "#14532d" : "#1e293b"} strokeWidth={1} />
      {/* Name */}
      <text x={bx + 8} y={METER_TOP + 18} fill="#94a3b8"
            fontSize={9.5} fontWeight={700} letterSpacing={2}>{load.name}</text>
      {/* LED */}
      <circle cx={bx + METER_W - 12} cy={METER_TOP + 14} r={5}
              fill={on ? GREEN : "#374151"}
              filter={on ? "url(#greenGlow)" : undefined} />
      {/* Power */}
      <text x={cx - 14} y={METER_TOP + 53} fill={val} fontSize={21} fontWeight={800}
            textAnchor="end" fontFamily="'Courier New',Courier,monospace"
            style={{ filter: on ? "drop-shadow(0 0 5px #22c55e)" : "none" }}>
        {load.power.toFixed(2)}
      </text>
      <text x={cx - 13} y={METER_TOP + 62} fill={dim} fontSize={9} fontWeight={700}>kW</text>
      {/* Current */}
      <text x={cx + 40} y={METER_TOP + 50} fill={dim} fontSize={11}
            textAnchor="end" fontFamily="'Courier New',Courier,monospace">
        {load.current.toFixed(2)}
      </text>
      <text x={cx + 40} y={METER_TOP + 62} fill={on ? "#475569" : "#2d3748"}
            fontSize={9} textAnchor="end">A</text>
    </g>
  );
}

// Generator panel box
function GenBox({ cx, gen }: { cx: number; gen: GeneratorData }) {
  const run = gen.running;
  const bx = cx - GEN_BOX_W / 2;
  const fanCy = GEN_BOX_TOP + FAN_Y_OFF;

  return (
    <g filter={run ? "url(#greenGlowSoft)" : undefined}>
      <rect x={bx} y={GEN_BOX_TOP} width={GEN_BOX_W} height={GEN_BOX_H}
            rx={9} fill="#0a1628"
            stroke={run ? GREEN : "#334155"} strokeWidth={run ? 1.5 : 1} />
      {/* Top accent */}
      <rect x={bx + 8} y={GEN_BOX_TOP + 5} width={GEN_BOX_W - 16} height={3}
            rx={1.5} fill={run ? "#166534" : "#1e293b"} />
      {/* ID label */}
      <text x={cx} y={GEN_BOX_TOP + 24} fill={run ? GREEN : "#6b7280"}
            fontSize={13} fontWeight={800} textAnchor="middle" letterSpacing={1}>
        G{gen.id}
      </text>
      {/* Rating */}
      <text x={cx} y={GEN_BOX_TOP + 36} fill="#475569"
            fontSize={8} textAnchor="middle">{gen.ratedPower} kW</text>
      {/* Status LED */}
      <circle cx={bx + GEN_BOX_W - 13} cy={GEN_BOX_TOP + 16} r={5}
              fill={run ? GREEN : "#374151"}
              filter={run ? "url(#greenGlow)" : undefined} />
      {/* Fan */}
      <FanIcon cx={cx} cy={fanCy} running={run} r={FAN_R} />
      {/* Status text */}
      <text x={cx} y={GEN_BOX_BOT - 9} fill={run ? GREEN : "#4b5563"}
            fontSize={8} fontWeight={800} textAnchor="middle" letterSpacing={2.5}>
        {run ? "RUNNING" : "STOPPED"}
      </text>
    </g>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function SingleLineDiagram({ generators, loads, busEnergized }: Props) {
  const gen0 = generators[0]; // G1 – primary, direct bus connection via GC-1
  const gen1 = generators[1]; // G2 – routes through G1 feeder via GC-2
  const gen2 = generators[2]; // G3 – independent direct bus connection via GC-3

  // ─ Energization logic (reflects actual electrical topology) ─
  // GC-2 state: controls G2's sub-feeder
  const gc2Closed = gen1.contactorClosed;
  const gc2On = gen1.running && gen1.contactorClosed;

  // T-junction (where G2's horizontal feeder meets G1's vertical feeder)
  const junctionOn = gen0.running || (gen1.running && gen1.contactorClosed);

  // GC-1 state: controls combined G1+G2 path to bus
  const gc1Closed = gen0.contactorClosed;
  const gc1On = junctionOn && gen0.contactorClosed;

  // GC-3 state: controls G3's direct path to bus
  const gc3Closed = gen2.contactorClosed;
  const gc3On = gen2.running && gen2.contactorClosed;

  // Per-segment cable energization
  const seg = {
    // G1: box top → T-junction
    g1BoxJunction: gen0.running,
    // G1: T-junction → GC-1
    junctionGC1: junctionOn,
    // GC-1 → bus
    gc1Bus: gc1On,
    // G2: box top → horizontal turn (vertical section)
    g2Vert: gen1.running,
    // G2: horizontal G2-side (from turn to GC-2 right terminal)
    g2HorizG2: gen1.running,
    // G2: horizontal G1-side (from GC-2 left terminal to junction)
    g2HorizG1: gc2On,
    // G3: box top → GC-3
    g3GC3: gen2.running,
    // GC-3 → bus
    gc3Bus: gc3On,
    // Load cables energized by bus
    l1On: loads[0].contactorClosed && busEnergized,
    l2On: loads[1].contactorClosed && busEnergized,
    l3On: loads[2].contactorClosed && busEnergized,
  };

  return (
    <svg viewBox={`0 0 ${VB_W} ${VB_H}`} width="100%" height="100%"
         preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
      <defs>
        <filter id="greenGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feFlood floodColor="#22c55e" floodOpacity="0.7" result="c" />
          <feComposite in="c" in2="blur" operator="in" result="g" />
          <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="greenGlowSoft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="#22c55e" floodOpacity="0.22" result="c" />
          <feComposite in="c" in2="blur" operator="in" result="g" />
          <feMerge><feMergeNode in="g" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ═══ LOAD METERS ═══ */}
      <LoadMeter cx={L1_X} load={loads[0]} busOn={busEnergized} />
      <LoadMeter cx={L2_X} load={loads[1]} busOn={busEnergized} />
      <LoadMeter cx={L3_X} load={loads[2]} busOn={busEnergized} />

      {/* ═══ LOAD FEEDERS (meter → LC → bus) ═══ */}
      {/* L1 */}
      <VertCable cx={L1_X} y1={METER_BOTTOM} y2={LC_CY - LC_HALF} on={seg.l1On} dir="down" />
      <VContactor cx={L1_X} cy={LC_CY} closed={loads[0].contactorClosed}
                  energized={seg.l1On} label="LC-1" />
      <VertCable cx={L1_X} y1={LC_CY + LC_HALF} y2={BUS_Y} on={seg.l1On} dir="down" />
      {/* L2 */}
      <VertCable cx={L2_X} y1={METER_BOTTOM} y2={LC_CY - LC_HALF} on={seg.l2On} dir="down" />
      <VContactor cx={L2_X} cy={LC_CY} closed={loads[1].contactorClosed}
                  energized={seg.l2On} label="LC-2" />
      <VertCable cx={L2_X} y1={LC_CY + LC_HALF} y2={BUS_Y} on={seg.l2On} dir="down" />
      {/* L3 */}
      <VertCable cx={L3_X} y1={METER_BOTTOM} y2={LC_CY - LC_HALF} on={seg.l3On} dir="down" />
      <VContactor cx={L3_X} cy={LC_CY} closed={loads[2].contactorClosed}
                  energized={seg.l3On} label="LC-3" />
      <VertCable cx={L3_X} y1={LC_CY + LC_HALF} y2={BUS_Y} on={seg.l3On} dir="down" />

      {/* ═══ AC BUS BAR ═══ */}
      <text x={(BUS_X1 + BUS_X2) / 2} y={BUS_Y - 8} fill="#475569" fontSize={9.5}
            textAnchor="middle" letterSpacing={1.5} fontWeight={600}>
        AC BUS  400 V / 50 Hz / 3φ
      </text>
      <rect x={BUS_X1} y={BUS_Y} width={BUS_X2 - BUS_X1} height={BUS_H}
            rx={5} fill={busEnergized ? "#14532d" : "#334155"}
            filter={busEnergized ? "url(#greenGlowSoft)" : undefined} />
      {busEnergized && (
        <line x1={BUS_X1 + 6} y1={BUS_Y + BUS_H / 2}
              x2={BUS_X2 - 6} y2={BUS_Y + BUS_H / 2}
              stroke={GREEN} strokeWidth={4} className="bus-flow"
              style={{ filter: "drop-shadow(0 0 5px #22c55e)" }} />
      )}
      {/* Bus end caps */}
      {[BUS_X1, BUS_X2].map((bx, i) => (
        <rect key={i} x={bx - 6} y={BUS_Y - 6} width={12} height={BUS_H + 12}
              rx={3} fill={busEnergized ? GREEN : "#4b5563"}
              filter={busEnergized ? "url(#greenGlow)" : undefined} />
      ))}

      {/* ═══ G1 FEEDER: GC-1 → Bus ═══ */}
      <VertCable cx={L1_X} y1={BUS_BOT} y2={GC1_CY - GC_HALF} on={seg.gc1Bus} />
      <VContactor cx={L1_X} cy={GC1_CY} closed={gc1Closed}
                  energized={gc1On} label="GC-1" />

      {/* G1 FEEDER: T-junction → GC-1 */}
      <VertCable cx={L1_X} y1={GC1_CY + GC_HALF} y2={JUNCTION_Y} on={seg.junctionGC1} />

      {/* T-JUNCTION DOT at (L1_X, JUNCTION_Y) */}
      <circle cx={L1_X} cy={JUNCTION_Y} r={5}
              fill={junctionOn ? GREEN : "#4b5563"}
              filter={junctionOn ? "url(#greenGlow)" : undefined} />

      {/* G1 FEEDER: G1 box top → T-junction */}
      <VertCable cx={L1_X} y1={JUNCTION_Y} y2={GEN_BOX_TOP} on={seg.g1BoxJunction} />

      {/* ═══ G2 FEEDER: vertical from G2 box top → horizontal turn ═══ */}
      <VertCable cx={L2_X} y1={JUNCTION_Y} y2={GEN_BOX_TOP} on={seg.g2Vert} />
      {/* Corner dot at G2's turn (not a T-junction, just a corner) */}
      <circle cx={L2_X} cy={JUNCTION_Y} r={3.5}
              fill={gen1.running ? GREEN_DIM : "#4b5563"} />

      {/* ═══ G2 HORIZONTAL FEEDER ═══
          Runs from G2 column (x=350) LEFT through GC-2 to G1 feeder (x=130).
          Drawn RIGHT-to-LEFT so cable-down animation flows leftward.          */}

      {/* Section A: G2-side of GC-2 (from G2 corner x=350 to GC-2 right terminal) */}
      <HorizCable x1={L2_X} y={JUNCTION_Y} x2={GC2_CX + GC2_HALF} on={seg.g2HorizG2} />

      {/* GC-2 — horizontal contactor */}
      <HContactor cx={GC2_CX} cy={GC2_CY} closed={gc2Closed}
                  energized={gc2On} label="GC-2" />

      {/* Section B: G1-feeder-side of GC-2 (from GC-2 left terminal to T-junction) */}
      <HorizCable x1={GC2_CX - GC2_HALF} y={JUNCTION_Y} x2={L1_X} on={seg.g2HorizG1} />

      {/* ═══ G3 FEEDER: G3 box top → GC-3 → Bus ═══ */}
      <VertCable cx={L3_X} y1={BUS_BOT} y2={GC3_CY - GC_HALF} on={seg.gc3Bus} />
      <VContactor cx={L3_X} cy={GC3_CY} closed={gc3Closed}
                  energized={gc3On} label="GC-3" />
      <VertCable cx={L3_X} y1={GC3_CY + GC_HALF} y2={GEN_BOX_TOP} on={seg.g3GC3} />

      {/* ═══ GENERATOR BOXES ═══ */}
      <GenBox cx={L1_X} gen={gen0} />
      <GenBox cx={L2_X} gen={gen1} />
      <GenBox cx={L3_X} gen={gen2} />

      {/* ═══ RATED LABELS ═══ */}
      {generators.map((g, i) => (
        <text key={i} x={[L1_X, L2_X, L3_X][i]} y={GEN_BOX_BOT + 14}
              fill="#334155" fontSize={8} textAnchor="middle" letterSpacing={1}>
          {g.ratedPower} kW RATED
        </text>
      ))}
    </svg>
  );
}
