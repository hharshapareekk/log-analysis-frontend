'use client';
import { useState } from 'react';

const FILES = [
  { name: 'email_gateway_2025-07-03.jsonl', size: '42 KB',  type: 'JSONL', tc: 'badge-blue',  src: 'email',    status: 'ready',    sc: 'badge-green' },
  { name: 'webserver_access_2025-07-03.log', size: '1.2 MB', type: 'LOG',   tc: 'badge-gray',  src: 'web',      status: 'ready',    sc: 'badge-green' },
  { name: 'firewall_2025-07-03.csv',          size: '280 KB', type: 'CSV',   tc: 'badge-amber', src: 'firewall', status: 'ready',    sc: 'badge-green' },
  { name: 'vpn_2025-07-03.csv',               size: '54 KB',  type: 'CSV',   tc: 'badge-amber', src: 'vpn',      status: 'parsing…', sc: 'badge-amber' },
  { name: 'idp_audit_2025-07-03.jsonl',       size: '38 KB',  type: 'JSONL', tc: 'badge-blue',  src: 'idp',      status: 'queued',   sc: 'badge-gray' },
  { name: 'windows_sec_2025-07-03.evtx.jsonl', size: '91 KB', type: 'JSONL', tc: 'badge-blue',  src: 'os',       status: 'queued',   sc: 'badge-gray' },
];

const LOGS = [
  { color: 'var(--accent)',  text: '[✓] email_gateway: 18/18 parsed → CES' },
  { color: 'var(--accent)',  text: '[✓] webserver: 54/54 parsed → CES' },
  { color: 'var(--accent)',  text: '[✓] firewall: 28/29 parsed (1 quarantined)' },
  { color: 'var(--accent2)', text: '[~] vpn: parsing in progress... 7/11' },
  { color: 'var(--muted)',   text: '[·] idp_audit: queued' },
  { color: 'var(--muted)',   text: '[·] windows_sec: queued' },
];

export default function IngestPage() {
  const [bundleId, setBundleId] = useState('incident_bundle_001');
  const [tz, setTz] = useState('UTC');
  const [env, setEnv] = useState('');
  const [skew, setSkew] = useState('15');

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="page-title">Ingest Logs</span>
          <span className="breadcrumb">/ new bundle</span>
        </div>
      </div>

      <div className="content">
        <div className="grid-2">
          {/* Left column */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header"><span className="card-title">Upload Files</span></div>
              <div className="drop-zone">
                <div className="drop-zone-icon">⬆</div>
                <div className="drop-zone-title">Drop log files here</div>
                <div className="drop-zone-sub">CSV · JSONL · .log · CEF/LEEF · EVTX-JSON</div>
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Bundle Metadata</span></div>

              <div className="inspector-field">
                <div className="inspector-label">Bundle ID</div>
                <input className="input-field" style={{ width: '100%' }} value={bundleId} onChange={e => setBundleId(e.target.value)} />
              </div>

              <div className="inspector-field">
                <div className="inspector-label">Default Timezone Hint</div>
                <select className="input-field" style={{ width: '100%' }} value={tz} onChange={e => setTz(e.target.value)}>
                  <option>UTC</option>
                  <option>+05:30 (IST)</option>
                  <option>-05:00 (EST)</option>
                  <option>Auto-detect</option>
                </select>
              </div>

              <div className="inspector-field">
                <div className="inspector-label">Environment</div>
                <input className="input-field" style={{ width: '100%' }} placeholder="production / staging / lab" value={env} onChange={e => setEnv(e.target.value)} />
              </div>

              <div className="inspector-field">
                <div className="inspector-label">Clock Skew Window (Δt minutes)</div>
                <input className="input-field" style={{ width: '100%' }} type="number" value={skew} onChange={e => setSkew(e.target.value)} />
              </div>

              {/* TODO: wire to POST /ingest */}
              <button className="btn btn-primary" style={{ width: '100%', marginTop: 4 }}>
                Run Ingestion Pipeline
              </button>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="card" style={{ marginBottom: 16 }}>
              <div className="card-header"><span className="card-title">File Queue</span></div>
              {FILES.map((f, i) => (
                <div key={i} className="file-row">
                  <div className="file-info">
                    <span className={`badge ${f.tc}`} style={{ fontSize: 9 }}>{f.type}</span>
                    <div>
                      <div className="file-name">{f.name}</div>
                      <div className="file-size">{f.size} · src: {f.src}</div>
                    </div>
                  </div>
                  <span className={`badge ${f.sc}`}>{f.status}</span>
                </div>
              ))}
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '68%' }} />
              </div>
            </div>

            <div className="card">
              <div className="card-header"><span className="card-title">Parser Log</span></div>
              <pre style={{ maxHeight: 220, overflowY: 'auto' }}>
                {LOGS.map((l, i) => (
                  <div key={i} style={{ color: l.color }}>{l.text}</div>
                ))}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
