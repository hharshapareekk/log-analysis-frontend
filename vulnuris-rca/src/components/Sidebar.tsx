"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { section: "Main" },
  { href: "/dashboard", label: "Dashboard", icon: "⬡" },
  { href: "/ingest", label: "Ingest Logs", icon: "↑" },
  { section: "Analysis" },
  { href: "/timeline", label: "Timeline", icon: "≡" },
  { href: "/graph", label: "Event Graph", icon: "◎" },
  { section: "Reports" },
  { href: "/rca", label: "RCA Report", icon: "⬒" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        VULNURIS / <span>RCA</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) => {
          if ("section" in item) {
            return (
              <div key={i} className="nav-section">
                {item.section}
              </div>
            );
          }
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item${active ? " active" : ""}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        bundle: <span style={{ color: "var(--accent)" }}>incident_001</span>
        <br />
        events: <span style={{ color: "var(--text)" }}>142</span>
      </div>
    </div>
  );
}
