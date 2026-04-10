'use client';
import { useEffect, useRef, useState } from 'react';

const NODES = [
  { id: 'n1', label: 'E01 · email_delivered',    cls: 'node-email', x: 60,  y: 40  },
  { id: 'n3', label: 'E02 · link_click',          cls: 'node-email', x: 260, y: 40  },
  { id: 'n2', label: 'W12 · GET /login',           cls: 'node-web',   x: 260, y: 130 },
  { id: 'n4', label: 'V03 · vpn_login',            cls: 'node-vpn',   x: 200, y: 220 },
  { id: 'n5', label: 'F08 · fw_allow',             cls: 'node-fw',    x: 420, y: 220 },
  { id: 'n6', label: 'I04 · priv_escalation',      cls: 'node-idp',   x: 310, y: 310 },
  { id: 'n7', label: 'O07 · policy_change',        cls: 'node-os',    x: 260, y: 395 },
];

const PAIRS = [['n1','n3'],['n3','n2'],['n2','n4'],['n4','n5'],['n4','n6'],['n6','n7']];

const EDGES = [
  { from: 'E01', to: 'E02', type: 'follows',   reasons: 'same user · same domain URL', conf: 0.88 },
  { from: 'E02', to: 'W12', type: 'caused_by', reasons: 'same IP · URL referrer · temporal', conf: 0.92 },
  { from: 'W12', to: 'V03', type: 'follows',   reasons: 'same user · same src_ip · Δt=5min', conf: 0.85 },
  { from: 'V03', to: 'I04', type: 'caused_by', reasons: 'same user · MFA-bypass · Δt=43s', conf: 0.96 },
  { from: 'I04', to: 'O07', type: 'caused_by', reasons: 'same user · same host · policy obj', conf: 0.91 },
];

export default function GraphPage() {
  const areaRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [minConf, setMinConf] = useState(0.40);

  useEffect(() => {
    const draw = () => {
      const svg = svgRef.current;
      const area = areaRef.current;
      if (!svg || !area) return;
      const cr = area.getBoundingClientRect();
      let paths = '';
      PAIRS.forEach(([a, b]) => {
        const na = nodeRefs.current[a];
        const nb = nodeRefs.current[b];
        if (!na || !nb) return;
        const ar = na.getBoundingClientRect();
        const br = nb.getBoundingClientRect();
        const x1 = ar.left - cr.left + ar.width / 2;
        const y1 = ar.top  - cr.top  + ar.height;
        const x2 = br.left - cr.left + br.width / 2;
        const y2 = br.top  - cr.top;
        const cy = (y1 + y2) / 2;
        paths += `<path d="M${x1},${y1} C${x1},${cy} ${x2},${cy} ${x2},${y2}" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" fill="none" marker-end="url(#arrow)"/>`;
      });
      svg.innerHTML = `<defs><marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="rgba(255,255,255,0.22)"/></marker></defs>${paths}`;
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  const filteredEdges = EDGES.filter(e => e.conf >= minConf);

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <span className="page-title">Event Graph</span>
          <span className="badge badge-gray">{EDGES.length} edges · DAG</span>
        </div>
        <div className="topbar-right">
          <button className="btn">Prune Weak Edges</button>
          {/* TODO: wire to GET /graph export */}
          <button className="btn">Export GraphML</button>
        </div>
      </div>

      <div className="content">
        {/* Legend + conf filter */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div className="legend">
            {[['var(--info)','email'],['var(--accent)','web'],['var(--accent2)','vpn/fw'],['var(--danger)','idp'],['var(--purple)','os']].map(([c,l]) => (
              <div key={l} className="legend-item">
                <div className="legend-dot" style={{ background: c }} />
                {l}
              </div>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontFamily: 'var(--mono)', color: 'var(--muted)' }}>Min confidence:</span>
            <input
              type="range" min={0} max={100} value={Math.round(minConf * 100)}
              onChange={e => setMinConf(parseInt(e.target.value) / 100)}
              style={{ width: 90 }}
            />
            <span style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--text)', minWidth: 32 }}>
              {minConf.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Graph canvas */}
        <div className="graph-area" ref={areaRef} style={{ height: 460 }}>
          <svg className="edges-svg" ref={svgRef} />
          {NODES.map(n => (
            <div
              key={n.id}
              ref={el => { nodeRefs.current[n.id] = el; }}
              className={`graph-node ${n.cls}`}
              style={{ top: n.y, left: n.x }}
            >
              {n.label}
            </div>
          ))}
          <div className="graph-hint">click node to inspect · edges update with slider</div>
        </div>

        {/* Edge table */}
        <div className="card" style={{ marginTop: 16 }}>
          <div className="card-header">
            <span className="card-title">Edge Details (conf ≥ {minConf.toFixed(2)})</span>
          </div>
          <table className="table">
            <thead>
              <tr><th>From</th><th>To</th><th>Type</th><th>Reasons</th><th>Confidence</th></tr>
            </thead>
            <tbody>
              {filteredEdges.map((e, i) => (
                <tr key={i}>
                  <td className="mono">{e.from}</td>
                  <td className="mono">{e.to}</td>
                  <td>
                    <span className={`badge ${e.type === 'caused_by' ? 'badge-red' : 'badge-gray'}`}>
                      {e.type}
                    </span>
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--muted)' }}>{e.reasons}</td>
                  <td style={{ minWidth: 120 }}>
                    <div className="confidence-bar">
                      <div className="conf-track">
                        <div
                          className="conf-fill"
                          style={{
                            width: `${e.conf * 100}%`,
                            background: e.conf > 0.9 ? 'var(--danger)' : 'var(--accent)',
                          }}
                        />
                      </div>
                      <span className="conf-label">{e.conf.toFixed(2)}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredEdges.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', fontFamily: 'var(--mono)', fontSize: 11 }}>No edges above threshold</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
