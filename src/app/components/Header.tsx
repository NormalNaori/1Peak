import { useState, useEffect } from "react";
import { Zap, CheckCircle, AlertTriangle, Wifi, Server, Radio } from "lucide-react";

function CommPill({
  label,
  status,
  online,
}: {
  label: string;
  status: string;
  online: boolean;
}) {
  return (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1 rounded"
      style={{
        background: "#0f172a",
        border: `1px solid ${online ? "#166534" : "#7f1d1d"}`,
      }}
    >
      <div
        className="w-1.5 h-1.5 rounded-full"
        style={{
          background: online ? "#22c55e" : "#ef4444",
          boxShadow: online ? "0 0 5px #22c55e" : "0 0 5px #ef4444",
        }}
      />
      <span className="text-xs" style={{ color: "#64748b" }}>
        {label}
      </span>
      <span
        className="text-xs font-bold"
        style={{ color: online ? "#22c55e" : "#ef4444" }}
      >
        {status}
      </span>
    </div>
  );
}

export function Header() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const dateStr = now.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", { hour12: false });

  return (
    <header
      className="flex items-center gap-5 px-4"
      style={{
        height: "58px",
        flexShrink: 0,
        background: "#1e293b",
        borderBottom: "1px solid #334155",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{
            background: "linear-gradient(135deg, #0284c7, #0ea5e9)",
            boxShadow: "0 0 14px rgba(14,165,233,0.45)",
          }}
        >
          <Zap size={18} fill="white" color="white" />
        </div>
        <div>
          <div
            className="text-sm font-extrabold tracking-widest uppercase"
            style={{ color: "#e2e8f0", letterSpacing: "0.16em" }}
          >
            Power Management System
          </div>
          <div className="text-xs" style={{ color: "#475569" }}>
            Industrial SCADA&nbsp;·&nbsp;Rev 2.4.1
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="w-px self-stretch my-2" style={{ background: "#334155" }} />

      {/* Date / Time / Operator */}
      <div className="flex items-center gap-5">
        <div>
          <div className="text-xs uppercase tracking-widest" style={{ color: "#475569" }}>
            Date
          </div>
          <div
            className="text-sm font-semibold"
            style={{ color: "#cbd5e1", fontVariantNumeric: "tabular-nums" }}
          >
            {dateStr}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest" style={{ color: "#475569" }}>
            Time
          </div>
          <div
            style={{
              color: "#38bdf8",
              fontFamily: "'Courier New', monospace",
              fontSize: "20px",
              fontWeight: 700,
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "0.06em",
            }}
          >
            {timeStr}
          </div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-widest" style={{ color: "#475569" }}>
            Operator
          </div>
          <div className="text-sm font-semibold" style={{ color: "#cbd5e1" }}>
            ADM-01
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="w-px self-stretch my-2" style={{ background: "#334155" }} />

      {/* Communication Status */}
      <div className="flex items-center gap-2">
        <Server size={13} color="#475569" />
        <CommPill label="PLC" status="ONLINE" online={true} />
        <Wifi size={13} color="#475569" />
        <CommPill label="MODBUS TCP" status="OK" online={true} />
        <Radio size={13} color="#475569" />
        <CommPill label="WebSocket" status="CONN" online={true} />
      </div>

      {/* Separator */}
      <div className="w-px self-stretch my-2" style={{ background: "#334155" }} />

      {/* System Health + Emergency Alarm */}
      <div className="flex items-center gap-2 ml-auto">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
          style={{
            background: "rgba(34,197,94,0.1)",
            border: "1px solid #166534",
          }}
        >
          <CheckCircle size={14} color="#22c55e" />
          <span
            className="text-xs font-bold tracking-wider"
            style={{ color: "#22c55e" }}
          >
            SYSTEM HEALTHY
          </span>
        </div>

        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg cursor-pointer"
          style={{
            background: "rgba(107,114,128,0.08)",
            border: "1px solid #334155",
          }}
        >
          <AlertTriangle size={14} color="#6b7280" />
          <span
            className="text-xs font-bold tracking-wider"
            style={{ color: "#6b7280" }}
          >
            NO ALARM
          </span>
        </div>
      </div>
    </header>
  );
}
