"use client";

import React, { useEffect, useRef, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

interface KanbanCardProps {
  title: string;
  priority: "high" | "medium" | "low" | "critical";
  assignee?: string;
  assigneeColor?: string;
  dueDate?: string;
  overdue?: boolean;
  borderColor?: string;
  delay: number;
  opacity?: number;
}

interface RtTask {
  id: string;
  name: string;
  status: string;
  statusClass: string;
  assignee: string;
  assigneeColor: string;
}

// ── Constants ────────────────────────────────────────────────────────────────

const SUPABASE_URL = "https://aeedlewstzxreztohtpl.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlZWRsZXdzdHp4cmV6dG9odHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MzIyNDksImV4cCI6MjA5MzMwODI0OX0.OWph-E85wEV65LWzwIRnXoAW7jYCH6n129YxAHzHZhY";

const TICKER_ITEMS = [
  "Kanban board",
  "Real-time updates",
  "Role-based access control",
  "Admin & Member roles",
  "Supabase Realtime",
  "In-app notifications",
  "Global search",
  "Overdue tracking",
  "Next.js 15 App Router",
  "Railway deployment",
];

const RT_UPDATES = [
  { id: "rt1", cls: "rs-prog", txt: "In progress", log: 'AK moved "CI/CD pipeline" → In progress' },
  { id: "rt3", cls: "rs-done", txt: "Done", log: 'NP moved "DB schema design" → Done' },
  { id: "rt2", cls: "rs-review", txt: "In review", log: 'SR moved "Auth integration" → In review' },
  { id: "rt1", cls: "rs-review", txt: "In review", log: 'AK moved "CI/CD pipeline" → In review' },
  { id: "rt2", cls: "rs-done", txt: "Done", log: 'SR moved "Auth integration" → Done' },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function GridIcon({ size = 16, strokeWidth = 2.5 }: { size?: number; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function NavLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: "linear-gradient(135deg,#00BFA5,#00A896)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 0 16px rgba(0,191,165,0.4)",
        color: "#fff",
      }}>
        <GridIcon size={16} />
      </div>
      <span style={{ fontSize: 14, fontWeight: 500, color: "#E8E8F0", letterSpacing: "-0.3px" }}>TaskFlow</span>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: KanbanCardProps["priority"] }) {
  const map = {
    high: { bg: "rgba(248,113,113,0.15)", color: "#F87171", label: "High" },
    medium: { bg: "rgba(251,177,60,0.15)", color: "#FBB13C", label: "Medium" },
    low: { bg: "rgba(52,211,153,0.15)", color: "#34D399", label: "Low" },
    critical: { bg: "rgba(0,229,204,0.15)", color: "#00E5CC", label: "Critical" },
  };
  const s = map[priority];
  return (
    <span style={{ fontSize: 7, padding: "1px 5px", borderRadius: 3, fontWeight: 500, background: s.bg, color: s.color }}>
      {s.label}
    </span>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <div style={{
      width: 15, height: 15, borderRadius: "50%", fontSize: 6, fontWeight: 500,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", background: color, flexShrink: 0,
    }}>
      {initials}
    </div>
  );
}

function KanbanCard({ title, priority, assignee, assigneeColor, dueDate, overdue, borderColor, delay, opacity = 1 }: KanbanCardProps) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)", border: `0.5px solid rgba(255,255,255,0.07)`,
      borderLeft: borderColor ? `1.5px solid ${borderColor}` : undefined,
      borderRadius: 7, padding: 7, marginBottom: 5, opacity,
      animation: `slideIn 0.5s ${delay}s both`,
    }}>
      <div style={{ fontSize: 9, fontWeight: 500, color: "#E8E8F0", marginBottom: 4, lineHeight: 1.3 }}>{title}</div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <PriorityBadge priority={priority} />
        {assignee && assigneeColor ? (
          <Avatar initials={assignee} color={assigneeColor} />
        ) : dueDate ? (
          <span style={{ fontSize: 7, color: "rgba(232,232,240,0.35)" }}>{dueDate}</span>
        ) : overdue ? (
          <span style={{ fontSize: 7, color: "#F87171", fontWeight: 500 }}>Overdue</span>
        ) : null}
      </div>
    </div>
  );
}

function HeroMockup() {
  return (
    <div style={{
      animation: "scaleIn 0.9s 0.4s ease both",
      borderRadius: 16, border: "0.5px solid rgba(255,255,255,0.08)",
      overflow: "hidden", maxWidth: 640, margin: "0 auto",
      background: "#111118",
      boxShadow: "0 40px 100px rgba(0,0,0,0.7),0 0 0 0.5px rgba(255,255,255,0.05)",
    }}>
      {/* Window bar */}
      <div style={{
        background: "#0E0E16", borderBottom: "0.5px solid rgba(255,255,255,0.06)",
        padding: "10px 16px", display: "flex", alignItems: "center", gap: 8,
      }}>
        {(["#FF5F56", "#FFBD2E", "#27C93F"] as const).map((c) => (
          <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
        ))}
        <div style={{
          flex: 1, background: "rgba(255,255,255,0.05)", borderRadius: 6,
          padding: "4px 12px", fontSize: 11, color: "rgba(232,232,240,0.35)",
          border: "0.5px solid rgba(255,255,255,0.06)", textAlign: "center",
        }}>
          app.taskflow.io/dashboard/projects/alpha/board
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", minHeight: 300 }}>
        {/* Sidebar */}
        <div style={{
          width: 136, background: "#0E0E16",
          borderRight: "0.5px solid rgba(255,255,255,0.06)", padding: "14px 10px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <div style={{ width: 20, height: 20, borderRadius: 5, background: "linear-gradient(135deg,#00BFA5,#00A896)" }} />
            <span style={{ fontSize: 11, fontWeight: 500, color: "#E8E8F0" }}>TaskFlow</span>
          </div>
          {[
            { label: "Dashboard", active: true },
            { label: "Projects" },
            { label: "My Tasks" },
            { label: "Team" },
            { label: "Settings" },
          ].map(({ label, active }) => (
            <div key={label} style={{
              padding: "6px 8px", borderRadius: 6, fontSize: 10, marginBottom: 2,
              display: "flex", alignItems: "center", gap: 6,
              background: active ? "rgba(0,191,165,0.15)" : "transparent",
              color: active ? "#26D0B8" : "rgba(232,232,240,0.4)",
              fontWeight: active ? 500 : 400,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
              {label}
            </div>
          ))}
        </div>

        {/* Main */}
        <div style={{ flex: 1, padding: 14, overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "#E8E8F0" }}>Alpha Launch</span>
            <span style={{ fontSize: 9, padding: "2px 8px", borderRadius: 100, background: "rgba(0,191,165,0.15)", color: "#26D0B8" }}>Board view</span>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
            {[
              { label: "Total", value: "24", color: "#26D0B8" },
              { label: "Done", value: "9", color: "#34D399" },
              { label: "Today", value: "4", color: "#FBB13C" },
              { label: "Late", value: "2", color: "#F87171" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                flex: 1, background: "rgba(255,255,255,0.03)",
                border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 8, padding: 8,
              }}>
                <div style={{ fontSize: 8, color: "rgba(232,232,240,0.4)", marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 17, fontWeight: 500, lineHeight: 1, color }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Kanban cols */}
          <div style={{ display: "flex", gap: 6 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 8, fontWeight: 500, color: "rgba(232,232,240,0.35)", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>To Do (5)</div>
              <KanbanCard title="Set up CI/CD pipeline" priority="high" assignee="AK" assigneeColor="#00BFA5" delay={0.8} />
              <KanbanCard title="Write API docs" priority="low" dueDate="May 10" delay={0.9} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 8, fontWeight: 500, color: "rgba(232,232,240,0.35)", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>In Progress (4)</div>
              <KanbanCard title="Auth integration" priority="critical" assignee="SR" assigneeColor="#00A896" borderColor="#FBB13C" delay={1.0} />
              <KanbanCard title="Dashboard UI" priority="medium" overdue delay={1.1} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 8, fontWeight: 500, color: "rgba(232,232,240,0.35)", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>In Review (3)</div>
              <KanbanCard title="DB schema design" priority="high" assignee="NP" assigneeColor="#EC4899" borderColor="#00BFA5" delay={1.2} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 8, fontWeight: 500, color: "rgba(232,232,240,0.35)", marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.5 }}>Done (9)</div>
              <KanbanCard title="Project setup" priority="low" assignee="JS" assigneeColor="#34D399" delay={1.3} opacity={0.45} />
              <KanbanCard title="Supabase config" priority="medium" assignee="KR" assigneeColor="#F97316" delay={1.4} opacity={0.45} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{
      overflow: "hidden",
      borderTop: "0.5px solid rgba(255,255,255,0.06)",
      borderBottom: "0.5px solid rgba(255,255,255,0.06)",
      padding: "11px 0", background: "#0D0D14",
    }}>
      <div style={{ display: "flex", width: "max-content", animation: "ticker 24s linear infinite" }}>
        {doubled.map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 8, padding: "0 28px",
            fontSize: 11, color: "rgba(232,232,240,0.35)", whiteSpace: "nowrap",
          }}>
            {item}
            <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({
  icon, title, description, iconBg, iconColor, delay,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
  delay: number;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#111118",
        border: `0.5px solid ${hovered ? "rgba(0,191,165,0.25)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 14, padding: 24,
        transform: hovered ? "translateY(-3px)" : "translateY(0)",
        transition: "all 0.25s", position: "relative", overflow: "hidden",
        animation: `fadeUp 0.6s ${delay}s ease both`,
      }}
    >
      {hovered && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 14,
          background: "linear-gradient(135deg,rgba(0,191,165,0.06),rgba(0,168,150,0.04))",
          pointerEvents: "none",
        }} />
      )}
      <div style={{
        width: 40, height: 40, borderRadius: 10, marginBottom: 16,
        display: "flex", alignItems: "center", justifyContent: "center",
        background: iconBg,
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2}>
          {icon}
        </svg>
      </div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "#E8E8F0", marginBottom: 8 }}>{title}</div>
      <div style={{ fontSize: 13, color: "rgba(232,232,240,0.45)", lineHeight: 1.6 }}>{description}</div>
    </div>
  );
}

function RtDemo() {
  const [tasks, setTasks] = useState<RtTask[]>([
    { id: "rt1", name: "Set up CI/CD pipeline", status: "To do", statusClass: "rs-todo", assignee: "AK", assigneeColor: "#00BFA5" },
    { id: "rt2", name: "Auth integration", status: "In progress", statusClass: "rs-prog", assignee: "SR", assigneeColor: "#00A896" },
    { id: "rt3", name: "DB schema design", status: "In review", statusClass: "rs-review", assignee: "NP", assigneeColor: "#EC4899" },
    { id: "rt4", name: "Project setup", status: "Done", statusClass: "rs-done", assignee: "JS", assigneeColor: "#34D399" },
  ]);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [log, setLog] = useState("Watching for updates...");
  const updateIndexRef = useRef(0);

  useEffect(() => {
    const statusStyles: Record<string, { bg: string; color: string }> = {
      "rs-todo": { bg: "rgba(255,255,255,0.05)", color: "rgba(232,232,240,0.45)" },
      "rs-prog": { bg: "rgba(251,177,60,0.12)", color: "#FBB13C" },
      "rs-review": { bg: "rgba(0,191,165,0.15)", color: "#26D0B8" },
      "rs-done": { bg: "rgba(52,211,153,0.12)", color: "#34D399" },
    };

    const interval = setInterval(() => {
      const u = RT_UPDATES[updateIndexRef.current % RT_UPDATES.length];
      updateIndexRef.current++;
      setTasks((prev) => prev.map((t) => t.id === u.id ? { ...t, status: u.txt, statusClass: u.cls } : t));
      setHighlighted(u.id);
      setLog(u.log);
      setTimeout(() => setHighlighted(null), 1400);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const statusMap: Record<string, React.CSSProperties> = {
    "rs-todo": { background: "rgba(255,255,255,0.05)", color: "rgba(232,232,240,0.45)", border: "0.5px solid rgba(255,255,255,0.1)" },
    "rs-prog": { background: "rgba(251,177,60,0.12)", color: "#FBB13C" },
    "rs-review": { background: "rgba(0,191,165,0.15)", color: "#26D0B8" },
    "rs-done": { background: "rgba(52,211,153,0.12)", color: "#34D399" },
  };

  return (
    <div style={{
      maxWidth: 540, margin: "0 auto",
      background: "#111118", border: "0.5px solid rgba(255,255,255,0.08)",
      borderRadius: 16, overflow: "hidden",
      boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
    }}>
      <div style={{
        padding: "12px 20px", borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: "#E8E8F0" }}>Alpha Launch — Board</span>
        <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, color: "#34D399", fontWeight: 500 }}>
          <span style={{ width: 5, height: 5, background: "#34D399", borderRadius: "50%", animation: "pulse 1.5s infinite", boxShadow: "0 0 6px #34D399", display: "inline-block" }} />
          3 members online
        </span>
      </div>
      <div style={{ padding: 14 }}>
        {tasks.map((task) => (
          <div key={task.id} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "9px 12px", borderRadius: 8, marginBottom: 7,
            background: highlighted === task.id ? "rgba(0,191,165,0.08)" : "rgba(255,255,255,0.03)",
            border: `0.5px solid ${highlighted === task.id ? "rgba(0,191,165,0.4)" : "rgba(255,255,255,0.07)"}`,
            transition: "all 0.4s",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%", fontSize: 8, fontWeight: 500,
              color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
              background: task.assigneeColor, flexShrink: 0,
            }}>
              {task.assignee}
            </div>
            <span style={{ flex: 1, fontSize: 11, fontWeight: 500, color: "#E8E8F0" }}>{task.name}</span>
            <span style={{
              fontSize: 9, padding: "3px 8px", borderRadius: 100, fontWeight: 500,
              transition: "all 0.4s",
              ...statusMap[task.statusClass],
            }}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
      <div style={{ padding: "10px 16px", borderTop: "0.5px solid rgba(255,255,255,0.06)", fontSize: 10, color: "rgba(232,232,240,0.3)" }}>
        {log}
      </div>
    </div>
  );
}

function useCountUp(target: number, active: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let c = 0;
    const step = Math.ceil(target / 38);
    const t = setInterval(() => {
      c = Math.min(c + step, target);
      setValue(c);
      if (c >= target) clearInterval(t);
    }, 30);
    return () => clearInterval(t);
  }, [active, target]);
  return value;
}

function useProgUp(target: number, active: boolean, delay = 0) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    const timeout = setTimeout(() => {
      let c = 0;
      const t = setInterval(() => {
        c = Math.min(c + 2, target);
        setValue(c);
        if (c >= target) clearInterval(t);
      }, 28);
    }, delay);
    return () => clearTimeout(timeout);
  }, [active, target, delay]);
  return value;
}

function Stats() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const c1 = useCountUp(18, visible);
  const c2 = useCountUp(7, visible);
  const c3 = useCountUp(14, visible);
  const c4 = useCountUp(12, visible);
  const p1 = useProgUp(88, visible, 400);
  const p2 = useProgUp(92, visible, 400);
  const p3 = useProgUp(100, visible, 400);

  return (
    <section ref={sectionRef} style={{ padding: "72px 40px", background: "#0A0A0F" }}>
      <h2 style={{ fontSize: 36, fontWeight: 500, textAlign: "center", letterSpacing: "-1.2px", lineHeight: 1.15, marginBottom: 48, color: "#F0F0FA" }}>
        Numbers that matter
      </h2>
      <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap", marginBottom: 52 }}>
        {[
          { value: c1, label: "API endpoints" },
          { value: c2, label: "DB tables & views" },
          { value: c3, label: "RLS policies" },
          { value: c4, label: "Hours to ship" },
        ].map(({ value, label }) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div style={{
              fontSize: 48, fontWeight: 500, letterSpacing: "-2px",
              background: "linear-gradient(135deg,#00BFA5,#00E5CC)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>
              {value}
            </div>
            <div style={{ fontSize: 13, color: "rgba(232,232,240,0.4)", marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 500, margin: "0 auto" }}>
        {[
          { name: "Lighthouse performance", value: p1, gradient: "linear-gradient(90deg,#00BFA5,#26D0B8)" },
          { name: "Lighthouse accessibility", value: p2, gradient: "linear-gradient(90deg,#34D399,#6EE7B7)" },
          { name: "TypeScript coverage", value: p3, gradient: "linear-gradient(90deg,#00E5CC,#4DD0C4)" },
        ].map(({ name, value, gradient }) => (
          <div key={name} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "rgba(232,232,240,0.45)" }}>{name}</span>
              <span style={{ fontSize: 12, fontWeight: 500, color: "#E8E8F0" }}>{value}%</span>
            </div>
            <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 2, width: `${value}%`, background: gradient, transition: "width 2s ease" }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── CSS-in-JS keyframes injection ────────────────────────────────────────────

const GLOBAL_STYLES = `
  @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-16px);} to{opacity:1;transform:translateX(0);} }
  @keyframes ticker { 0%{transform:translateX(0);} 100%{transform:translateX(-50%);} }
  @keyframes scaleIn { from{opacity:0;transform:scale(0.9);} to{opacity:1;transform:scale(1);} }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #0A0A0F; color: #E8E8F0; overflow-x: hidden; }
`;

// ── Main Component ───────────────────────────────────────────────────────────

export default function TaskFlowLanding() {
  // Auth check
  useEffect(() => {
    async function checkAuth() {
      try {
        // Dynamic import of supabase to avoid SSR issues
        const { createClient } = await import("@supabase/supabase-js");
        const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        const { data: { session } } = await client.auth.getSession();
        if (session) window.location.href = "/dashboard";
      } catch {
        // Supabase not available in this context
      }
    }
    checkAuth();
  }, []);

  const handleNav = (path: string) => () => { window.location.href = path; };
  const handleGitHub = () => window.open("https://github.com/yourusername/taskflow", "_blank");
  const handleDemo = () => alert('Demo coming soon! Click "Get started" to try the app.');

  const features = [
    {
      icon: <><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" /></>,
      title: "Task management", description: "Create tasks with priority, assignee, and due date. Drag between Kanban columns seamlessly.",
      iconBg: "rgba(0,191,165,0.12)", iconColor: "#26D0B8", delay: 0.1,
    },
    {
      icon: <><circle cx="12" cy="12" r="10" /><polyline points="12,6 12,12 16,14" /></>,
      title: "Real-time sync", description: "Task changes propagate instantly to all team members via Supabase Realtime — no refresh needed.",
      iconBg: "rgba(52,211,153,0.1)", iconColor: "#34D399", delay: 0.2,
    },
    {
      icon: <><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></>,
      title: "Team & roles", description: "Invite by email. Assign Admin or Member roles enforced by Supabase Row Level Security.",
      iconBg: "rgba(251,177,60,0.1)", iconColor: "#FBB13C", delay: 0.3,
    },
    {
      icon: <><path d="M18 8h1a4 4 0 010 8h-1" /><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" /><line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" /></>,
      title: "Notifications", description: "Instant alerts when you're assigned a task, a comment is added, or a status changes.",
      iconBg: "rgba(244,114,182,0.1)", iconColor: "#F472B6", delay: 0.3,
    },
    {
      icon: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
      title: "Global search", description: "Find any task or project instantly via PostgreSQL full-text search — results in under 300 ms.",
      iconBg: "rgba(34,211,238,0.1)", iconColor: "#22D3EE", delay: 0.4,
    },
    {
      icon: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
      title: "Dashboard analytics", description: "Overdue tasks, today's deadlines, project progress — all on one glanceable dashboard.",
      iconBg: "rgba(0,229,204,0.1)", iconColor: "#00E5CC", delay: 0.5,
    },
  ];

  const techStack = [
    { label: "Next.js 15", color: "#E8E8F0" },
    { label: "Supabase", color: "#34D399" },
    { label: "TypeScript 5", color: "#60A5FA" },
    { label: "Tailwind CSS", color: "#22D3EE" },
    { label: "shadcn/ui", color: "#26D0B8" },
    { label: "React Query", color: "#F97316" },
    { label: "Zod", color: "#F472B6" },
    { label: "Railway", color: "#EF4444" },
  ];

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif", background: "#0A0A0F", color: "#E8E8F0", overflowX: "hidden" }}>

        {/* NAV */}
        <nav style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "16px 40px",
          borderBottom: "0.5px solid rgba(255,255,255,0.06)",
          position: "sticky", top: 0, zIndex: 100,
          background: "rgba(10,10,15,0.85)",
          backdropFilter: "blur(16px)",
          animation: "fadeIn 0.5s ease both",
        }}>
          <NavLogo />
          <div style={{ display: "flex", gap: 28 }}>
            {["Features", "How it works", "Roles", "Stack"].map((l) => (
              <a key={l} href="#" style={{ fontSize: 13, color: "rgba(232,232,240,0.5)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={handleNav("/login")} style={{
              padding: "7px 16px", fontSize: 13, borderRadius: 8,
              border: "0.5px solid rgba(255,255,255,0.12)",
              background: "transparent", color: "#E8E8F0", cursor: "pointer",
            }}>Sign in</button>
            <button onClick={handleNav("/signup")} style={{
              padding: "7px 18px", fontSize: 13, borderRadius: 8,
              background: "linear-gradient(135deg,#00BFA5,#00A896)",
              color: "#fff", border: "none", cursor: "pointer", fontWeight: 500,
              boxShadow: "0 4px 16px rgba(0,191,165,0.35)",
            }}>Get started</button>
          </div>
        </nav>

        {/* HERO */}
        <section style={{ padding: "64px 40px 52px", textAlign: "center", position: "relative", overflow: "hidden", background: "#0A0A0F" }}>
          <div style={{ position: "absolute", top: -80, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: "radial-gradient(ellipse,rgba(0,191,165,0.15) 0%,transparent 65%)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: "20%", width: 300, height: 300, background: "radial-gradient(ellipse,rgba(0,168,150,0.08) 0%,transparent 70%)", pointerEvents: "none" }} />

          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 14px", borderRadius: 100, background: "rgba(0,191,165,0.12)", border: "0.5px solid rgba(0,191,165,0.3)", color: "#80E8DC", fontSize: 12, fontWeight: 500, marginBottom: 24, animation: "fadeUp 0.6s 0.05s ease both" }}>
            <span style={{ width: 5, height: 5, background: "#00BFA5", borderRadius: "50%", animation: "pulse 2s infinite", boxShadow: "0 0 6px #00BFA5", display: "inline-block" }} />
            Next.js 15 + Supabase + Railway
          </div>

          <h1 style={{ fontSize: 54, fontWeight: 500, lineHeight: 1.1, letterSpacing: "-2px", marginBottom: 20, animation: "fadeUp 0.7s 0.12s ease both", maxWidth: 580, marginLeft: "auto", marginRight: "auto", color: "#F0F0FA" }}>
            Your team. Your tasks.<br />
            <span style={{ background: "linear-gradient(135deg,#00BFA5 0%,#00E5CC 45%,#26D0B8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Zero chaos.
            </span>
          </h1>

          <p style={{ fontSize: 16, color: "rgba(232,232,240,0.55)", lineHeight: 1.65, maxWidth: 440, margin: "0 auto 36px", animation: "fadeUp 0.7s 0.2s ease both" }}>
            Create projects, assign tasks, and ship faster — with role-based access enforced at the database level.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", animation: "fadeUp 0.7s 0.3s ease both", marginBottom: 52 }}>
            <button onClick={handleNav("/signup")} style={{
              padding: "13px 26px", fontSize: 14, borderRadius: 10,
              background: "linear-gradient(135deg,#00BFA5,#00A896)", color: "#fff", border: "none",
              cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 8px 32px rgba(0,191,165,0.4)",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              Start for free
            </button>
            <button onClick={handleDemo} style={{
              padding: "13px 26px", fontSize: 14, borderRadius: 10,
              background: "rgba(255,255,255,0.04)", color: "#E8E8F0",
              border: "0.5px solid rgba(255,255,255,0.12)", cursor: "pointer",
              fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><polygon points="10,8 16,12 10,16" /></svg>
              Watch demo
            </button>
          </div>

          <HeroMockup />
        </section>

        <Ticker />

        {/* FEATURES */}
        <section style={{ padding: "72px 40px", background: "#0A0A0F" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#26D0B8", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>Everything you need</div>
          <h2 style={{ fontSize: 36, fontWeight: 500, textAlign: "center", letterSpacing: "-1.2px", lineHeight: 1.15, marginBottom: 12, color: "#F0F0FA" }}>Built for teams that ship</h2>
          <p style={{ fontSize: 15, color: "rgba(232,232,240,0.45)", textAlign: "center", maxWidth: 440, margin: "0 auto 48px", lineHeight: 1.65 }}>
            Every feature your team needs — clean interface, real-time sync, and permissions that actually hold.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </section>

        {/* REALTIME */}
        <section style={{ padding: "60px 40px", background: "#0D0D14" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#26D0B8", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>Live collaboration</div>
          <h2 style={{ fontSize: 36, fontWeight: 500, textAlign: "center", letterSpacing: "-1.2px", lineHeight: 1.15, marginBottom: 12, color: "#F0F0FA" }}>Changes land in real time</h2>
          <p style={{ fontSize: 15, color: "rgba(232,232,240,0.45)", textAlign: "center", maxWidth: 440, margin: "0 auto 48px", lineHeight: 1.65 }}>
            Every move, every status update, synced across all open sessions — powered by Supabase Realtime.
          </p>
          <RtDemo />
        </section>

        {/* ROLES */}
        <section style={{ padding: "72px 40px", background: "#0A0A0F" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#26D0B8", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>Role-based access</div>
          <h2 style={{ fontSize: 36, fontWeight: 500, textAlign: "center", letterSpacing: "-1.2px", lineHeight: 1.15, marginBottom: 12, color: "#F0F0FA" }}>Right access for every person</h2>
          <p style={{ fontSize: 15, color: "rgba(232,232,240,0.45)", textAlign: "center", maxWidth: 440, margin: "0 auto 48px", lineHeight: 1.65 }}>
            Two roles, clear permissions — locked at the database level with Supabase RLS policies.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 580, margin: "0 auto" }}>
            {[
              {
                role: "Admin", color: "#26D0B8", badgeBg: "rgba(0,191,165,0.15)", borderColor: "rgba(0,191,165,0.15)",
                title: "Full control",
                perms: ["Create & delete projects", "Create, edit & delete tasks", "Invite & remove members", "Assign roles to members", "Update any task status", "Moderate comments"],
              },
              {
                role: "Member", color: "#34D399", badgeBg: "rgba(52,211,153,0.12)", borderColor: "rgba(52,211,153,0.12)",
                title: "Focused access",
                perms: ["View all project tasks", "Update own task status", "Comment on any task", "Edit own comments", "Search projects & tasks", "View team members"],
              },
            ].map(({ role, color, badgeBg, borderColor, title, perms }) => (
              <div key={role} style={{ background: "#111118", border: `0.5px solid ${borderColor}`, borderRadius: 14, padding: 28 }}>
                <div style={{ display: "inline-flex", padding: "4px 12px", borderRadius: 100, fontSize: 11, fontWeight: 500, marginBottom: 16, background: badgeBg, color }}>{role}</div>
                <div style={{ fontSize: 15, fontWeight: 500, color: "#E8E8F0", marginBottom: 12 }}>{title}</div>
                <ul style={{ listStyle: "none" }}>
                  {perms.map((p) => (
                    <li key={p} style={{ fontSize: 12, color: "rgba(232,232,240,0.5)", padding: "5px 0", display: "flex", alignItems: "flex-start", gap: 8, lineHeight: 1.5 }}>
                      <span style={{ color, flexShrink: 0, fontSize: 12, marginTop: 1 }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* TECH STACK */}
        <section style={{ padding: "60px 40px", background: "#0D0D14" }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "#26D0B8", letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 12, textAlign: "center" }}>Tech stack</div>
          <h2 style={{ fontSize: 36, fontWeight: 500, textAlign: "center", letterSpacing: "-1.2px", lineHeight: 1.15, marginBottom: 12, color: "#F0F0FA" }}>Modern. Fast. Production-ready.</h2>
          <p style={{ fontSize: 15, color: "rgba(232,232,240,0.45)", textAlign: "center", maxWidth: 440, margin: "0 auto", lineHeight: 1.65 }}>
            Every choice deliberate — optimised for performance, DX, and scale from day one.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginTop: 40 }}>
            {techStack.map(({ label, color }) => (
              <div key={label} style={{
                padding: "9px 18px", borderRadius: 100,
                border: "0.5px solid rgba(255,255,255,0.08)", background: "#111118",
                fontSize: 13, fontWeight: 500, color: "#C4C4D4",
                display: "flex", alignItems: "center", gap: 8, cursor: "default",
              }}>
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, display: "inline-block" }} />
                {label}
              </div>
            ))}
          </div>
        </section>

        <Stats />

        {/* CTA */}
        <section style={{ padding: "80px 40px", textAlign: "center", position: "relative", overflow: "hidden", background: "#0D0D14" }}>
          <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 500, height: 300, background: "radial-gradient(ellipse,rgba(0,191,165,0.12) 0%,transparent 70%)", pointerEvents: "none" }} />
          <h2 style={{ fontSize: 36, fontWeight: 500, letterSpacing: "-1px", marginBottom: 14, color: "#F0F0FA" }}>
            Ready to bring your<br />team into focus?
          </h2>
          <p style={{ fontSize: 15, color: "rgba(232,232,240,0.45)", marginBottom: 32 }}>
            Deploy in minutes on Railway. No credit card. Production-ready from day one.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button onClick={handleNav("/signup")} style={{
              padding: "13px 26px", fontSize: 14, borderRadius: 10,
              background: "linear-gradient(135deg,#00BFA5,#00A896)", color: "#fff", border: "none",
              cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
              boxShadow: "0 8px 32px rgba(0,191,165,0.4)",
            }}>
              Get started free
            </button>
            <button onClick={handleGitHub} style={{
              padding: "13px 26px", fontSize: 14, borderRadius: 10,
              background: "rgba(255,255,255,0.04)", color: "#E8E8F0",
              border: "0.5px solid rgba(255,255,255,0.12)", cursor: "pointer",
              fontWeight: 500, display: "flex", alignItems: "center", gap: 8,
            }}>
              View on GitHub
            </button>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          padding: "28px 40px", borderTop: "0.5px solid rgba(255,255,255,0.06)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "#0A0A0F",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: "linear-gradient(135deg,#00BFA5,#00A896)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
              <GridIcon size={12} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: 12, color: "rgba(232,232,240,0.3)" }}>TaskFlow — Team Task Manager</span>
          </div>
          <div style={{ display: "flex", gap: 20 }}>
            {["GitHub", "Live demo", "Docs"].map((l) => (
              <a key={l} href="#" style={{ fontSize: 12, color: "rgba(232,232,240,0.3)", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
          <span style={{ fontSize: 12, color: "rgba(232,232,240,0.3)" }}>Next.js 15 + Supabase + Railway</span>
        </footer>

      </div>
    </>
  );
}