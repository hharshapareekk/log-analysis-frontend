'use client';
import { useState } from 'react';

const EVENTS = [
  {
    ts: '2025-07-03T02:40:15Z', tsOrig: '+05:30 original',
    dot: 'var(--info)', title: 'Phishing email delivered', sev: '7', sevc: 'badge-amber',
    meta: 'src: email · sender: phish@evil.com → user@corp.com · url: payroll-corp[.]com/update',
    iocs: [{ cls: 'domain', label: 'payroll-corp.com' }],
    src: 'email', srcC: 'badge-blue',
  },
  {
    ts: '2025-07-03T03:12:11Z', tsOrig: '',
    dot: 'var(--accent)', title: 'Login page accessed', sev: '3', sevc: 'badge-gray',
    meta: 'src: web · GET /login?user=user@corp.com · IP: 203.0.113.45 · 200 OK',
    iocs: [],
    src: 'web', srcC: 'badge-green',
  },
  {
    ts: '2025-07-03T03:14:05Z', tsOrig: '',
    dot: 'var(--muted)', title: 'Firewall allow TCP:443', sev: '2', sevc: 'badge-gray',
    meta: 'src: firewall · 203.0.113.45 → 10.0.2.5 · rule: wan_to_web',
    iocs: [{ cls: 'ip', label: '203.0.113.45' }],
    src: 'firewall', srcC: 'badge-gray',
  },
  {
    ts: '2025-07-03T03:17:19Z', tsOrig: '',
    dot: 'var(--accent2)', title: 'VPN login success', sev: '6', sevc: 'badge-amber',
    meta: 'src: vpn · user: user@corp.com · ip: 203.0.113.45 · device: unknown',
    iocs: [],
    src: 'vpn', srcC: 'badge-amber',
  },
  {
    ts: '2025-07-03T03:18:02Z', tsOrig: '',
    dot: 'var(--danger)', title: 'Privilege escalation via MFA-bypass', sev: '9', sevc: 'badge-red',
    meta: 'src: idp · actor: user@corp.com · app: admin-portal · result: success',
    iocs: [{ cls: 'user', label: 'user@corp.com' }],
    src: 'idp', srcC: 'badge-red',
  },
  {
    ts: '2025-07-03T03:21:22Z', tsOrig: '',
    dot: 'var(--purple)', title: 'Local policy changed (EventID 4739)', sev: '9', sevc: 'badge-red',
    meta: 'src: os · host: WEB01 · user: user@corp.com · object: Local policy',
    iocs: [],
    src: 'os', srcC: 'badge-gray',
  },
];

export default function TimelinePage() {
  const [srcFilter, setSrcFilter] = useState('All Sources');
  const [sevFilter, setSevFilter] = useState('All Severity');

  const filtered = EVENTS.filter(e => {
    if (srcFilter !== 'All Sources' && e.src !== srcFilter) return false;
    if (sevFilter === 'High (7–10)' && parseInt(e.sev) < 7) return false;
    if (sevFilter === 'Medium (4–6)' && (parseInt(e.sev) < 4 || parseInt(e.sev) > 6)) return false;
    if (sevFilter === 'Low (1–3)' && parseInt(e.sev) > 3) return false;
    return true;
  });

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="page-title">Timeline</span>
          <span className="badge badge-gray">{EVENTS.length} events</span>
        </div>
        <div className="topbar-right">
          {/* TODO: wire to GET /timeline export */}
          <button className="btn">Export CSV</button>
        </div>
      </div>

      <div className="content">
        <div className="filter-bar">
          <span className="filter-label">Filter:</span>
          <select className="input-field" value={srcFilter} onChange={e => setSrcFilter(e.target.value)}>
            {['All Sources', 'email', 'web', 'firewall', 'vpn', 'idp', 'os'].map(o => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <select className="input-field">
            <option>All Entities</option>
            <option>user@corp.com</option>
            <option>203.0.113.45</option>
            <option>WEB01</option>
          </select>
          <select className="input-field" value={sevFilter} onChange={e => setSevFilter(e.target.value)}>
            {['All Severity', 'High (7–10)', 'Medium (4–6)', 'Low (1–3)'].map(o => (
              <option key={o}>{o}</option>
            ))}
          </select>
          <input className="input-field" placeholder="Time from..." style={{ width: 150 }} />
          <input className="input-field" placeholder="Time to..." style={{ width: 150 }} />
        </div>

        <div className="card">
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 12 }}>
              No events match the current filters.
            </div>
          )}
          {filtered.map((e, i) => (
            <div key={i} className="timeline-item">
              <div className="tl-time">
                {e.ts}
                {e.tsOrig && <><br /><span style={{ color: 'var(--muted)', fontSize: 9 }}>{e.tsOrig}</span></>}
              </div>
              <div className="tl-dot" style={{ background: e.dot }} />
              <div className="tl-body">
                <div className="tl-title">
                  {e.title}{' '}
                  <span className={`badge ${e.sevc}`} style={{ marginLeft: 6 }}>sev {e.sev}</span>
                </div>
                <div className="tl-meta">{e.meta}</div>
                {e.iocs.length > 0 && (
                  <div style={{ marginTop: 4, fontSize: 11, color: 'var(--muted)' }}>
                    IOC:{' '}
                    {e.iocs.map((ioc, j) => (
                      <span key={j} className={`ioc-tag ${ioc.cls}`}>{ioc.label}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="tl-source">
                <span className={`badge ${e.srcC}`}>{e.src}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
