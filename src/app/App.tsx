import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { StatusBar } from "./components/StatusBar";
import { GeneratorDetailContent } from "./components/GeneratorDetailContent";
import { GenDetailStatusBar } from "./components/GenDetailStatusBar";
import { SystemOverviewFull } from "./components/SystemOverviewFull";
import { LoadManagementPage } from "./components/LoadManagementPage";
import { AlarmsPage } from "./components/AlarmsPage";

export interface GeneratorData {
  id: number;
  name: string;
  ratedPower: number;
  // Summary (overview cards)
  voltage: number;
  frequency: number;
  excitationCurrent: number;
  // Per-phase voltage
  voltageA: number;
  voltageB: number;
  voltageC: number;
  // Per-phase frequency
  freqA: number;
  freqB: number;
  freqC: number;
  // Per-phase current
  currentA: number;
  currentB: number;
  currentC: number;
  // Power output
  activePower: number;
  loadPercent: number;
  // Mechanical
  rpm: number;
  engineTemp: number;
  oilPressure: number;
  fuelLevel: number;
  // Control status
  avrStatus: "AUTO" | "MANUAL" | "FAULT";
  governorStatus: "AUTO" | "MANUAL" | "FAULT";
  // State
  running: boolean;
  contactorClosed: boolean;
  communication: "ONLINE" | "OFFLINE";
  health: "Healthy" | "Warning" | "Fault";
}

export interface LoadData {
  id: number;
  name: string;
  power: number;
  current: number;
  contactorClosed: boolean;
}

export interface SyncData {
  deltaV: number;
  deltaF: number;
  deltaPhi: number;
  phaseSeq: "ABC" | "ACB";
  syncCheckOK: boolean;
  breakerStatus: "OPEN" | "CLOSED";
  syncPermissive: boolean;
  syncReady: boolean;
}

export interface AlarmEvent {
  id: number;
  timestamp: string;
  severity: "ALARM" | "WARNING" | "EVENT";
  device: string;
  description: string;
  status: "ACTIVE" | "ACKNOWLEDGED" | "CLEARED";
}

export interface IndividualLoad {
  name: string;
  ratedPower: number;
  currentPower: number;
  status: "ON" | "OFF" | "SHED";
  priority: 1 | 2 | 3;
  available: boolean;
}

export interface LoadGroup {
  id: number;
  level: 1 | 2 | 3;
  name: string;
  priority: string;
  ratedPower: number;
  currentPower: number;
  loads: IndividualLoad[];
}

const TOTAL_CAPACITY = 8.7;

const initialGenerators: GeneratorData[] = [
  {
    id: 1,
    name: "Generator 1",
    ratedPower: 3.6,
    voltage: 399,
    frequency: 50.0,
    excitationCurrent: 2.3,
    voltageA: 398, voltageB: 400, voltageC: 399,
    freqA: 49.99, freqB: 50.01, freqC: 50.0,
    currentA: 5.95, currentB: 5.85, currentC: 6.05,
    activePower: 3.52, loadPercent: 97.8,
    rpm: 1500, engineTemp: 78.0, oilPressure: 3.20, fuelLevel: 85,
    avrStatus: "AUTO", governorStatus: "AUTO",
    running: true, contactorClosed: true,
    communication: "ONLINE", health: "Healthy",
  },
  {
    id: 2,
    name: "Generator 2",
    ratedPower: 3.6,
    voltage: 399,
    frequency: 50.0,
    excitationCurrent: 2.1,
    voltageA: 399, voltageB: 399, voltageC: 400,
    freqA: 50.0, freqB: 50.01, freqC: 49.99,
    currentA: 5.55, currentB: 5.60, currentC: 5.50,
    activePower: 3.28, loadPercent: 91.1,
    rpm: 1500, engineTemp: 82.0, oilPressure: 3.00, fuelLevel: 72,
    avrStatus: "AUTO", governorStatus: "AUTO",
    running: true, contactorClosed: true,
    communication: "ONLINE", health: "Warning",
  },
  {
    id: 3,
    name: "Generator 3",
    ratedPower: 1.5,
    voltage: 0, frequency: 0, excitationCurrent: 0,
    voltageA: 0, voltageB: 0, voltageC: 0,
    freqA: 0, freqB: 0, freqC: 0,
    currentA: 0, currentB: 0, currentC: 0,
    activePower: 0, loadPercent: 0,
    rpm: 0, engineTemp: 24.0, oilPressure: 0, fuelLevel: 65,
    avrStatus: "AUTO", governorStatus: "AUTO",
    running: false, contactorClosed: false,
    communication: "ONLINE", health: "Healthy",
  },
];

const initialLoads: LoadData[] = [
  { id: 1, name: "LOAD 1", power: 1.25, current: 3.1, contactorClosed: true },
  { id: 2, name: "LOAD 2", power: 2.10, current: 5.2, contactorClosed: true },
  { id: 3, name: "LOAD 3", power: 0.45, current: 1.1, contactorClosed: true },
];

const initialSyncData: SyncData = {
  deltaV: 0.3, deltaF: 0.02, deltaPhi: 2.1,
  phaseSeq: "ABC", syncCheckOK: true,
  breakerStatus: "OPEN", syncPermissive: true, syncReady: true,
};

const initialAlarms: AlarmEvent[] = [
  { id: 9, timestamp: "14:42:07", severity: "WARNING", device: "GEN 2", description: "Fuel level below 75% (72%)", status: "ACTIVE" },
  { id: 8, timestamp: "14:36:18", severity: "EVENT", device: "LOAD", description: "Level 3 loads energised", status: "CLEARED" },
  { id: 7, timestamp: "14:35:30", severity: "EVENT", device: "LOAD", description: "Level 2 loads energised", status: "CLEARED" },
  { id: 6, timestamp: "14:34:15", severity: "EVENT", device: "LOAD", description: "Level 1 loads energised", status: "CLEARED" },
  { id: 5, timestamp: "14:33:02", severity: "WARNING", device: "GEN 2", description: "Engine temperature high (82°C > 80°C)", status: "ACKNOWLEDGED" },
  { id: 4, timestamp: "14:32:20", severity: "EVENT", device: "GEN 1", description: "Load sharing mode activated", status: "CLEARED" },
  { id: 3, timestamp: "14:31:45", severity: "EVENT", device: "GEN 2", description: "Generator 2 started successfully", status: "CLEARED" },
  { id: 2, timestamp: "14:30:12", severity: "EVENT", device: "GEN 1", description: "Generator 1 started successfully", status: "CLEARED" },
  { id: 1, timestamp: "14:28:05", severity: "EVENT", device: "SYSTEM", description: "System startup complete", status: "CLEARED" },
];

const initialLoadGroups: LoadGroup[] = [
  {
    id: 1, level: 1, name: "Essential Loads", priority: "MUST REMAIN POWERED",
    ratedPower: 1.20, currentPower: 1.00,
    loads: [
      { name: "Navigation Lights",  ratedPower: 0.30, currentPower: 0.28, status: "ON", priority: 1, available: true },
      { name: "Emergency Lighting", ratedPower: 0.25, currentPower: 0.22, status: "ON", priority: 1, available: true },
      { name: "Safety Systems",     ratedPower: 0.65, currentPower: 0.50, status: "ON", priority: 1, available: true },
    ],
  },
  {
    id: 2, level: 2, name: "Operational Loads", priority: "REQUIRED FOR OPERATION",
    ratedPower: 3.50, currentPower: 3.00,
    loads: [
      { name: "Main Lighting",      ratedPower: 0.90, currentPower: 0.80, status: "ON", priority: 2, available: true },
      { name: "HVAC — Bridge",      ratedPower: 1.30, currentPower: 1.20, status: "ON", priority: 2, available: true },
      { name: "Communications",     ratedPower: 0.65, currentPower: 0.60, status: "ON", priority: 2, available: true },
      { name: "Navigation Systems", ratedPower: 0.65, currentPower: 0.40, status: "ON", priority: 2, available: true },
    ],
  },
  {
    id: 3, level: 3, name: "Non-essential Loads", priority: "CAN BE SHED",
    ratedPower: 4.00, currentPower: 2.80,
    loads: [
      { name: "Galley Equipment",      ratedPower: 1.60, currentPower: 1.50, status: "ON", priority: 3, available: true },
      { name: "Entertainment Systems", ratedPower: 1.20, currentPower: 0.80, status: "ON", priority: 3, available: true },
      { name: "Workshop Equipment",    ratedPower: 1.20, currentPower: 0.50, status: "ON", priority: 3, available: true },
    ],
  },
];

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}

export default function App() {
  const [generators, setGenerators] = useState<GeneratorData[]>(initialGenerators);
  const [loads, setLoads] = useState<LoadData[]>(initialLoads);
  const [syncData, setSyncData] = useState<SyncData>(initialSyncData);
  const [alarms] = useState<AlarmEvent[]>(initialAlarms);
  const [loadGroups] = useState<LoadGroup[]>(initialLoadGroups);
  const [activeNav, setActiveNav] = useState("overview");

  useEffect(() => {
    const interval = setInterval(() => {
      setGenerators((prev) =>
        prev.map((gen) => {
          if (!gen.running) return gen;
          const va = clamp(Math.round(gen.voltageA + (Math.random() - 0.5) * 4), 385, 415);
          const vb = clamp(Math.round(gen.voltageB + (Math.random() - 0.5) * 4), 385, 415);
          const vc = clamp(Math.round(gen.voltageC + (Math.random() - 0.5) * 4), 385, 415);
          const newPower = parseFloat(
            clamp(gen.activePower + (Math.random() - 0.5) * 0.08, 0, gen.ratedPower).toFixed(2)
          );
          const baseCurrent = (newPower * 1000) / (1.732 * 400 * 0.85);
          return {
            ...gen,
            voltageA: va, voltageB: vb, voltageC: vc,
            voltage: Math.round((va + vb + vc) / 3),
            freqA: parseFloat((50 + (Math.random() - 0.5) * 0.06).toFixed(2)),
            freqB: parseFloat((50 + (Math.random() - 0.5) * 0.06).toFixed(2)),
            freqC: parseFloat((50 + (Math.random() - 0.5) * 0.06).toFixed(2)),
            frequency: parseFloat((50 + (Math.random() - 0.5) * 0.04).toFixed(2)),
            excitationCurrent: parseFloat(
              Math.max(0, gen.excitationCurrent + (Math.random() - 0.5) * 0.15).toFixed(1)
            ),
            currentA: parseFloat(clamp(baseCurrent + (Math.random() - 0.5) * 0.2, 0, 12).toFixed(2)),
            currentB: parseFloat(clamp(baseCurrent + (Math.random() - 0.5) * 0.2, 0, 12).toFixed(2)),
            currentC: parseFloat(clamp(baseCurrent + (Math.random() - 0.5) * 0.2, 0, 12).toFixed(2)),
            activePower: newPower,
            loadPercent: parseFloat(((newPower / gen.ratedPower) * 100).toFixed(1)),
            rpm: Math.round(clamp(gen.rpm + (Math.random() - 0.5) * 6, 1480, 1522)),
            engineTemp: parseFloat(clamp(gen.engineTemp + (Math.random() - 0.5) * 0.3, 20, 110).toFixed(1)),
            oilPressure: parseFloat(clamp(gen.oilPressure + (Math.random() - 0.5) * 0.03, 0, 8).toFixed(2)),
          };
        })
      );
      setLoads((prev) =>
        prev.map((load) => {
          if (!load.contactorClosed) return load;
          return {
            ...load,
            power: parseFloat(Math.max(0, load.power + (Math.random() - 0.5) * 0.08).toFixed(2)),
            current: parseFloat(Math.max(0, load.current + (Math.random() - 0.5) * 0.15).toFixed(2)),
          };
        })
      );
      setSyncData((prev) => ({
        ...prev,
        deltaV: parseFloat(Math.max(0, prev.deltaV + (Math.random() - 0.5) * 0.04).toFixed(2)),
        deltaF: parseFloat(Math.max(0.001, prev.deltaF + (Math.random() - 0.5) * 0.003).toFixed(3)),
        deltaPhi: parseFloat(Math.max(0, prev.deltaPhi + (Math.random() - 0.5) * 0.15).toFixed(1)),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Topology-aware bus energization
  const gc1Closed = generators[0].contactorClosed;
  const junctionOn =
    generators[0].running ||
    (generators[1].running && generators[1].contactorClosed);
  const busFromG1G2 = junctionOn && gc1Closed;
  const busFromG3 = generators[2].running && generators[2].contactorClosed;
  const busEnergized = busFromG1G2 || busFromG3;

  const totalLoad = loads.filter((l) => l.contactorClosed).reduce((s, l) => s + l.power, 0);
  const systemLoadPercent = Math.min(100, (totalLoad / TOTAL_CAPACITY) * 100);

  const genDetailIdx =
    activeNav === "gen1" ? 0 : activeNav === "gen2" ? 1 : activeNav === "gen3" ? 2 : -1;
  const activeGen = genDetailIdx >= 0 ? generators[genDetailIdx] : null;

  return (
    <div
      className="size-full flex flex-col overflow-hidden"
      style={{
        background: "#0F172A",
        color: "#e2e8f0",
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes fanSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes flowDown {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -24; }
        }
        @keyframes flowUp {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: 24; }
        }
        @keyframes flowRight {
          from { stroke-dashoffset: 0; }
          to { stroke-dashoffset: -40; }
        }
        @keyframes alarmPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.2; }
        }
        @keyframes busGlow {
          0%, 100% { filter: drop-shadow(0 0 4px #22c55e); }
          50% { filter: drop-shadow(0 0 10px #22c55e); }
        }
        .fan-spin {
          animation: fanSpin 0.8s linear infinite;
          transform-box: fill-box;
          transform-origin: center;
        }
        .cable-down {
          stroke-dasharray: 8 4;
          animation: flowDown 0.5s linear infinite;
        }
        .cable-up {
          stroke-dasharray: 8 4;
          animation: flowUp 0.5s linear infinite;
        }
        .bus-flow {
          stroke-dasharray: 15 8;
          animation: flowRight 0.65s linear infinite;
        }
        .bus-glow-anim {
          animation: busGlow 2s ease-in-out infinite;
        }
        .value-transition {
          transition: color 0.4s ease;
        }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>

      <Header />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar activeNav={activeNav} onNavChange={setActiveNav} />

        {activeGen ? (
          <GeneratorDetailContent
            key={`gen-detail-${activeGen.id}`}
            gen={activeGen}
          />
        ) : activeNav === "loads" ? (
          <LoadManagementPage
            loadGroups={loadGroups}
            totalCapacity={TOTAL_CAPACITY}
          />
        ) : activeNav === "alarms" ? (
          <AlarmsPage alarms={alarms} />
        ) : (
          <SystemOverviewFull
            generators={generators}
            loads={loads}
            loadGroups={loadGroups}
            busEnergized={busEnergized}
            totalLoad={totalLoad}
            systemLoadPercent={systemLoadPercent}
            totalCapacity={TOTAL_CAPACITY}
          />
        )}
      </div>

      {activeGen ? (
        <GenDetailStatusBar gen={activeGen} />
      ) : (
        <StatusBar
          generators={generators}
          totalLoad={totalLoad}
          systemLoadPercent={systemLoadPercent}
          busEnergized={busEnergized}
        />
      )}
    </div>
  );
}
