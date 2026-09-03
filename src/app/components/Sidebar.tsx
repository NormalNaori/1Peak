import React, { useState } from "react";
import {
  LayoutDashboard,
  Cpu,
  BellRing,
  ChevronRight,
  ChevronDown,
  Activity,
  Layers,
  Zap,
} from "lucide-react";

interface SidebarProps {
  activeNav: string;
  onNavChange: (id: string) => void;
}

interface NavItemProps {
  id: string;
  label: string;
  icon: React.ElementType;
  activeNav: string;
  onNavChange: (id: string) => void;
  indent?: boolean;
  accent?: string;
}

function NavItem({ id, label, icon: Icon, activeNav, onNavChange, indent, accent = "#38bdf8" }: NavItemProps) {
  const isActive = id === activeNav;
  return (
    <button
      onClick={() => onNavChange(id)}
      className="flex items-center gap-2.5 py-2 rounded-lg text-left transition-all w-full"
      style={{
        paddingLeft: indent ? 28 : 10,
        paddingRight: 10,
        background: isActive ? `rgba(14,165,233,0.12)` : "transparent",
        border: isActive ? `1px solid rgba(14,165,233,0.25)` : "1px solid transparent",
        color: isActive ? accent : "#64748b",
        cursor: "pointer",
      }}
    >
      <Icon size={13} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 12.5, fontWeight: isActive ? 600 : 500, flex: 1 }}>{label}</span>
      {isActive && <ChevronRight size={11} />}
    </button>
  );
}

export function Sidebar({ activeNav, onNavChange }: SidebarProps) {
  const [genExpanded, setGenExpanded] = useState(true);

  return (
    <aside
      className="flex flex-col py-3 px-2 overflow-y-auto"
      style={{
        width: "200px",
        flexShrink: 0,
        background: "#1e293b",
        borderRight: "1px solid #334155",
      }}
    >
      {/* Section label */}
      <div className="px-2 mb-2">
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: "#334155", fontSize: 9 }}
        >
          Power Station
        </span>
      </div>

      <nav className="flex flex-col gap-0.5">
        {/* System Overview */}
        <NavItem
          id="overview"
          label="System Overview"
          icon={LayoutDashboard}
          activeNav={activeNav}
          onNavChange={onNavChange}
        />

        {/* Generators group */}
        <div>
          <button
            onClick={() => setGenExpanded((v) => !v)}
            className="flex items-center gap-2.5 w-full py-2 px-2.5 rounded-lg transition-all"
            style={{
              background: "transparent",
              border: "1px solid transparent",
              color: "#475569",
              cursor: "pointer",
            }}
          >
            <Cpu size={13} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, fontWeight: 500, flex: 1, textAlign: "left" }}>
              Generators
            </span>
            {genExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          </button>

          {genExpanded && (
            <div className="flex flex-col gap-0.5 mt-0.5">
              <NavItem
                id="gen1"
                label="Generator 1"
                icon={Zap}
                activeNav={activeNav}
                onNavChange={onNavChange}
                indent
              />
              <NavItem
                id="gen2"
                label="Generator 2"
                icon={Zap}
                activeNav={activeNav}
                onNavChange={onNavChange}
                indent
              />
              <NavItem
                id="gen3"
                label="Generator 3"
                icon={Zap}
                activeNav={activeNav}
                onNavChange={onNavChange}
                indent
              />
            </div>
          )}
        </div>

        {/* Load Management */}
        <NavItem
          id="loads"
          label="Load Management"
          icon={Layers}
          activeNav={activeNav}
          onNavChange={onNavChange}
        />

        {/* Alarms & Events */}
        <NavItem
          id="alarms"
          label="Alarms & Events"
          icon={BellRing}
          activeNav={activeNav}
          onNavChange={onNavChange}
          accent="#ef4444"
        />
      </nav>

      <div
        className="mt-auto pt-3 mx-2 border-t"
        style={{ borderColor: "#1e3a5f" }}
      >
        <div className="flex items-center gap-2 px-1 mb-1">
          <Activity size={10} color="#22c55e" />
          <span className="text-xs font-semibold" style={{ color: "#334155", fontSize: 10 }}>
            PMS v2.4.1
          </span>
        </div>
        <div style={{ color: "#1e3a5f", fontSize: 9, paddingLeft: 4 }}>
          © 2026 Industrial SCADA
        </div>
      </div>
    </aside>
  );
}
