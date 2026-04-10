export default function RCAPage() {
  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="page-title">RCA Report</span>
          <span className="badge badge-red">CRITICAL · Risk 9.1</span>
        </div>
        <div className="topbar-right">
          {/* TODO: wire to POST /report */}
          <button className="btn">Export HTML</button>
          <button className="btn btn-primary">Export PDF</button>
        </div>
      </div>

      <div className="content">
        <div style={{ maxWidth: 860 }}>

          {/* Header */}
          <div className="rca-section">
            <div style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)', marginBottom: 4 }}>
              Vulnuris Unified Log RCA Platform (Student Edition)
            </div>
            <div style={{ fontSize: 20, fontWeight: 300, marginBottom: 6 }}>
              Incident Report — credential_theft_via_phishing
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
              Bundle: incident_bundle_001 · Generated: 2025-07-03T04:00:00Z · Analyst: [team]
            </div>
          </div>

          <div className="divider" />

          {/* 1. Executive Summary */}
          <div className="rca-section">
            <div className="rca-section-title">1. Executive Summary</div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.8, marginBottom: 16 }}>
              A phishing email delivered to{' '}
              <span style={{ color: 'var(--text)', fontFamily: 'var(--mono)' }}>user@corp.com</span>{' '}
              contained a credential-harvesting link to{' '}
              <span style={{ color: 'var(--accent2)', fontFamily: 'var(--mono)' }}>payroll-corp.com</span>.
              The attacker used harvested credentials to authenticate via VPN and bypass MFA, subsequently
              escalating privileges on the admin portal and altering local security policy on host WEB01.
            </p>
            <div className="stat-row">
              {[
                { label: 'Root Cause',     value: 'credential_theft_via_phishing', vc: 'var(--danger)' },
                { label: 'Duration',       value: '~41 minutes' },
                { label: 'Risk Score',     value: '9.1 / 10', vc: 'var(--danger)' },
                { label: 'Hosts Affected', value: 'WEB01' },
              ].map(s => (
                <div key={s.label} className="stat-box">
                  <div className="stat-box-label">{s.label}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: s.vc || 'var(--text)' }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Attack Narrative */}
          <div className="rca-section">
            <div className="rca-section-title">2. Attack Narrative</div>
            {[
              { ts: '02:40:15 UTC', dot: 'var(--info)',    title: 'Phishing email delivered',    desc: 'sender phish@evil.com, link to payroll-corp[.]com/update' },
              { ts: '03:12:11 UTC', dot: 'var(--accent)',  title: 'Credential harvesting',       desc: 'user clicked link; credentials submitted to attacker' },
              { ts: '03:17:19 UTC', dot: 'var(--accent2)', title: 'VPN login',                   desc: 'attacker authenticated from 203.0.113.45 with unknown device' },
              { ts: '03:18:02 UTC', dot: 'var(--danger)',  title: 'Privilege escalation',        desc: 'MFA bypass on admin-portal; elevation succeeded' },
              { ts: '03:21:22 UTC', dot: 'var(--purple)',  title: 'Policy change',               desc: 'EventID 4739 on WEB01; local policy modified' },
            ].map((s, i, arr) => (
              <div key={i} style={{ display: 'flex', gap: 16, padding: '10px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', minWidth: 100, paddingTop: 2 }}>{s.ts}</div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: s.dot, marginTop: 4, flexShrink: 0 }} />
                <div style={{ fontSize: 12 }}>
                  <strong style={{ fontWeight: 500 }}>{s.title}</strong> — {s.desc}
                </div>
              </div>
            ))}
          </div>

          {/* 3. Impact Summary */}
          <div className="rca-section">
            <div className="rca-section-title">3. Impact Summary</div>
            <table className="table">
              <thead><tr><th>Category</th><th>Affected</th><th>Detail</th></tr></thead>
              <tbody>
                <tr><td>Users</td><td className="mono">user@corp.com</td><td style={{ fontSize: 12, color: 'var(--muted)' }}>Credentials compromised; account used for lateral movement</td></tr>
                <tr><td>Hosts</td><td className="mono">WEB01</td><td style={{ fontSize: 12, color: 'var(--muted)' }}>Local security policy altered</td></tr>
                <tr><td>Services</td><td className="mono">admin-portal, VPN</td><td style={{ fontSize: 12, color: 'var(--muted)' }}>Privileged session established</td></tr>
              </tbody>
            </table>
          </div>

          {/* 4. IOCs */}
          <div className="rca-section">
            <div className="rca-section-title">4. Indicators of Compromise</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', marginBottom: 6 }}>IPs</div>
              <span className="ioc-tag ip">203.0.113.45</span>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', marginBottom: 6 }}>Domains</div>
              <span className="ioc-tag domain">payroll-corp.com</span>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)', marginBottom: 6 }}>Users</div>
              <span className="ioc-tag user">user@corp.com</span>
            </div>
          </div>

          {/* 5. Detection Gaps */}
          <div className="rca-section">
            <div className="rca-section-title">5. Detection &amp; Response Gaps</div>
            <table className="table">
              <thead><tr><th>Gap</th><th>Type</th><th>Impact</th></tr></thead>
              <tbody>
                {[
                  { gap: 'MFA not enforced on VPN auth path',      type: 'misconfig',    tc: 'badge-red',   impact: 'Allowed bypass' },
                  { gap: 'No alert on MFA-bypass event in IdP',    type: 'missed alert', tc: 'badge-amber', impact: '48-min detection delay' },
                  { gap: 'Lookalike domain not blocked',            type: 'misconfig',    tc: 'badge-amber', impact: 'Email delivered' },
                  { gap: 'Unknown device VPN login not flagged',   type: 'missed alert', tc: 'badge-gray',  impact: 'No SOC notification' },
                ].map((g, i) => (
                  <tr key={i}>
                    <td>{g.gap}</td>
                    <td><span className={`badge ${g.tc}`}>{g.type}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--muted)' }}>{g.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 6. Recommendations */}
          <div className="rca-section">
            <div className="rca-section-title">6. Recommendations (Prioritized)</div>
            {[
              { n: '#1', text: 'Enforce MFA for all VPN and privileged-role authentication. Disable MFA bypass methods on admin-portal.', owner: 'IAM team · ETA: immediate', p: 'P0', pc: 'badge-red' },
              { n: '#2', text: 'Enable DMARC/DKIM/SPF enforcement; add payroll-corp.com and lookalike domains to blocklist.', owner: 'Email security team · ETA: 48h', p: 'P1', pc: 'badge-amber' },
              { n: '#3', text: 'Create SIEM alert for IdP elevation events from unknown devices and impossible-travel scenarios.', owner: 'SOC · ETA: 1 week', p: 'P1', pc: 'badge-amber' },
              { n: '#4', text: 'Implement immutable audit logging and protected config-change workflows on all servers.', owner: 'Infra team · ETA: 2 weeks', p: 'P2', pc: 'badge-gray' },
            ].map(r => (
              <div key={r.n} className="reco-item">
                <div className="reco-num">{r.n}</div>
                <div style={{ flex: 1 }}>
                  <div className="reco-text">{r.text}</div>
                  <div className="reco-owner">Owner: {r.owner}</div>
                </div>
                <span className={`badge ${r.pc}`} style={{ flexShrink: 0 }}>{r.p}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid var(--border)', fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>
            Built for educational use; not a production IR tool. · Vulnuris Security Solutions LLP · connect@vulnuris.com
          </div>

        </div>
      </div>
    </>
  );
}
