import Link from 'next/link';

export default function DashboardPage() {
  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="page-title">Dashboard</span>
          <span className="badge badge-amber">bundle: incident_bundle_001</span>
        </div>
        <div className="topbar-right">
          <button className="btn">Export</button>
          <Link href="/ingest"><button className="btn btn-primary">+ New Bundle</button></Link>
        </div>
      </div>

      <div className="content">
        {/* Metric Cards */}
        <div className="grid-4">
          <div className="metric-card">
            <div className="metric-label">Total Events</div>
            <div className="metric-value">142</div>
            <div className="metric-sub">across 6 sources</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Correlated Edges</div>
            <div className="metric-value">31</div>
            <div className="metric-sub">avg conf: 0.82</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Key IOCs</div>
            <div className="metric-value" style={{ color: 'var(--danger)' }}>8</div>
            <div className="metric-sub">3 IPs · 2 domains · 3 users</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Parse Coverage</div>
            <div className="metric-value" style={{ color: 'var(--accent)' }}>96%</div>
            <div className="metric-sub">136 / 142 records</div>
          </div>
        </div>

        <div className="grid-2">
          {/* Source Breakdown */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Source Breakdown</span>
            </div>
            <table className="table">
              <thead>
                <tr><th>Source</th><th>Events</th><th>Coverage</th><th>Status</th></tr>
              </thead>
              <tbody>
                {[
                  { src: 'email_gateway', n: 18, cov: '100%', s: 'ok' },
                  { src: 'webserver',     n: 54, cov: '100%', s: 'ok' },
                  { src: 'firewall',      n: 29, cov: '96%',  s: 'ok' },
                  { src: 'vpn',           n: 11, cov: '100%', s: 'ok' },
                  { src: 'idp_audit',     n: 14, cov: '100%', s: 'ok' },
                  { src: 'windows_sec',   n: 16, cov: '81%',  s: 'warn' },
                ].map(r => (
                  <tr key={r.src}>
                    <td className="mono">{r.src}</td>
                    <td>{r.n}</td>
                    <td>{r.cov}</td>
                    <td>
                      <span className={`badge ${r.s === 'ok' ? 'badge-green' : 'badge-amber'}`}>
                        {r.s}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Attack Summary */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Attack Summary</span>
              <span className="badge badge-red">CRITICAL</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16, lineHeight: 1.7 }}>
              Root cause identified as{' '}
              <span style={{ color: 'var(--danger)', fontFamily: 'var(--mono)' }}>
                credential_theft_via_phishing
              </span>. Attacker gained access via MFA bypass following credential harvest from phishing email.
            </p>

            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: 8 }}>
              Primary Path
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span className="badge badge-blue">email_delivered</span>
              <span style={{ color: 'var(--muted)' }}>→</span>
              <span className="badge badge-gray">vpn_login</span>
              <span style={{ color: 'var(--muted)' }}>→</span>
              <span className="badge badge-amber">priv_escalation</span>
              <span style={{ color: 'var(--muted)' }}>→</span>
              <span className="badge badge-red">policy_change</span>
            </div>

            <div className="divider" />
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/rca"><button className="btn btn-primary">View RCA Report</button></Link>
              <Link href="/timeline"><button className="btn">View Timeline</button></Link>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-header">
            <span className="card-title">Recent Events</span>
            <Link href="/timeline"><button className="btn">View All →</button></Link>
          </div>
          <table className="table">
            <thead>
              <tr><th>Timestamp (UTC)</th><th>Source</th><th>Action</th><th>User</th><th>Severity</th></tr>
            </thead>
            <tbody>
              {[
                { ts: '2025-07-03T02:40:15Z', src: 'email',    sc: 'badge-blue',  action: 'delivered',          user: 'user@corp.com', sev: '7', sevc: 'badge-amber' },
                { ts: '2025-07-03T03:12:11Z', src: 'web',      sc: 'badge-green', action: 'GET /login',          user: 'user@corp.com', sev: '3', sevc: 'badge-gray' },
                { ts: '2025-07-03T03:14:05Z', src: 'firewall', sc: 'badge-gray',  action: 'allow TCP:443',       user: '—',             sev: '2', sevc: 'badge-gray' },
                { ts: '2025-07-03T03:17:19Z', src: 'vpn',      sc: 'badge-amber', action: 'login_success',       user: 'user@corp.com', sev: '6', sevc: 'badge-amber' },
                { ts: '2025-07-03T03:18:02Z', src: 'idp',      sc: 'badge-red',   action: 'elevation (MFA-bypass)', user: 'user@corp.com', sev: '9', sevc: 'badge-red' },
              ].map((e, i) => (
                <tr key={i}>
                  <td className="mono">{e.ts}</td>
                  <td><span className={`badge ${e.sc}`}>{e.src}</span></td>
                  <td>{e.action}</td>
                  <td className="mono">{e.user}</td>
                  <td><span className={`badge ${e.sevc}`}>{e.sev}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
