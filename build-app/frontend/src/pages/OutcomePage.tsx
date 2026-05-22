import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataUrl } from '../types';
import type { Outcome, LineageNode, LineageEdge } from '../types';

const NODE_COLOR: Record<string, string> = {
  staging:      '#0073EA',
  intermediate: '#b45309',
  'marts/dim':  '#7C3AED',
  gold:         '#15803d',
  gap:          '#DC2626',
  consumer:     '#be185d',
};

export default function OutcomePage() {
  const [o, setO] = useState<Outcome | null>(null);

  useEffect(() => {
    fetch(dataUrl('outcome.json')).then(r => r.json()).then(setO);
  }, []);

  if (!o) return <div className="mx-auto max-w-7xl px-4 py-12 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>Modeling outcome…</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <span className="chip chip-resolved">
            <span className="pulse-dot" style={{ background: 'var(--resolved-bright)' }} />
            Build · Materialized
          </span>
          <span className="eyebrow">Lineage updated</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight" style={{ color: 'var(--text)' }}>
          Before and after, on the same lake.
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-lg" style={{ color: 'var(--text-muted)' }}>
          The gap on the left. The asset on the right. The delta is what dbt-wizard built in eighty-seven seconds.
        </p>
      </header>

      {/* Lineage comparison */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
        <LineagePanel title="Before · the gap" subtitle="No gold table tracks the new metric." nodes={o.before.nodes} edges={o.before.edges} tone="crisis" />
        <LineagePanel title="After · the asset" subtitle="Materialized to Iceberg. Downstream consumers attached." nodes={o.after.nodes} edges={o.after.edges} tone="resolved" />
      </section>

      {/* Without vs with dbt-wizard */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
        <Column data={o.without_wizard} tone="crisis" />
        <Column data={o.with_wizard}    tone="resolved" />
      </section>

      {/* Governance posture */}
      <section className="mb-10">
        <h2 className="font-display text-2xl mb-4 border-b pb-2" style={{ color: 'var(--text)', borderColor: 'var(--line)' }}>
          Governance posture on the new asset
        </h2>
        <div className="panel p-5">
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {o.governance.map(g => (
              <div key={g.label}>
                <div className="eyebrow mb-1">{g.label}</div>
                <div className="font-mono text-sm font-semibold" style={{ color: 'var(--text)' }}>{g.value}</div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Hero */}
      <section className="panel p-8 mb-10" style={{ borderLeft: '5px solid var(--resolved)', background: 'rgba(34,197,94,0.06)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div className="sm:col-span-1">
            <div className="eyebrow mb-2">Build Room result</div>
            <div className="font-display text-6xl sm:text-7xl tracking-tight" style={{ color: 'var(--resolved)' }}>{o.hero.value}</div>
            <div className="font-mono text-xs mt-2" style={{ color: 'var(--text-muted)' }}>question to materialized</div>
          </div>
          <div className="sm:col-span-2">
            <div className="font-display text-2xl sm:text-3xl leading-tight" style={{ color: 'var(--text)' }}>{o.hero.label}</div>
            <p className="mt-3 text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>{o.hero.note}</p>
          </div>
        </div>
      </section>

      <div className="flex flex-col sm:flex-row gap-3 panel p-5 items-center justify-between">
        <div>
          <div className="font-display text-2xl" style={{ color: 'var(--text)' }}>Run it again?</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>The pipeline is real. The sub-agents are deterministic.</div>
        </div>
        <div className="flex gap-2">
          <Link to="/build" className="btn">Re-run the build</Link>
          <Link to="/policy" className="btn btn-primary">Why ODI · Read policy</Link>
        </div>
      </div>
    </div>
  );
}

function Column({ data, tone }: { data: Outcome['without_wizard']; tone: 'crisis' | 'resolved' }) {
  const toneColor = tone === 'crisis' ? 'var(--crisis)' : 'var(--resolved)';
  return (
    <div className="panel p-6" style={{ borderLeft: `5px solid ${toneColor}` }}>
      <div className={`chip ${tone === 'crisis' ? 'chip-crisis' : 'chip-resolved'} mb-3`}>{data.label}</div>
      <h2 className="font-display text-2xl mb-2" style={{ color: 'var(--text)' }}>{data.summary}</h2>

      <dl className="space-y-2 my-5 panel-deep p-4">
        {data.metrics.map(m => (
          <div key={m.label} className="flex justify-between gap-3 text-sm">
            <dt className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{m.label}</dt>
            <dd className="font-mono font-semibold" style={{ color: toneColor }}>{m.value}</dd>
          </div>
        ))}
      </dl>

      <div className="eyebrow mb-2">Narrative</div>
      <ol className="space-y-2 text-sm">
        {data.narrative.map((n, i) => (
          <li key={n} className="flex gap-2" style={{ color: 'var(--text-muted)' }}>
            <span className="font-mono text-xs" style={{ color: toneColor }}>{String(i + 1).padStart(2, '0')}</span>
            <span>{n}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function LineagePanel({ title, subtitle, nodes, edges, tone }: { title: string; subtitle: string; nodes: LineageNode[]; edges: LineageEdge[]; tone: 'crisis' | 'resolved' }) {
  const accent = tone === 'crisis' ? 'var(--crisis)' : 'var(--resolved)';

  // Group nodes by layer for a simple staged layout.
  const layers = ['staging', 'intermediate', 'marts/dim', 'gold', 'gap', 'consumer'];
  const grouped: Record<string, LineageNode[]> = {};
  for (const l of layers) grouped[l] = [];
  for (const n of nodes) {
    const key = grouped[n.layer] ? n.layer : 'staging';
    grouped[key].push(n);
  }
  const populated = layers.filter(l => grouped[l].length > 0);

  return (
    <div className="panel p-5" style={{ borderLeft: `4px solid ${accent}` }}>
      <div className={`chip ${tone === 'crisis' ? 'chip-crisis' : 'chip-resolved'} mb-2`}>{title}</div>
      <div className="text-sm mb-4" style={{ color: 'var(--text-muted)' }}>{subtitle}</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3" style={{ minHeight: 320 }}>
        {populated.map(layer => (
          <div key={layer}>
            <div className="eyebrow mb-2" style={{ color: NODE_COLOR[layer] }}>{layer}</div>
            <div className="space-y-1.5">
              {grouped[layer].map(n => {
                const isGap = layer === 'gap';
                const isNew = n.new;
                return (
                  <div
                    key={n.id}
                    className="panel p-2.5"
                    style={{
                      borderLeft: `3px solid ${NODE_COLOR[layer] ?? '#0073EA'}`,
                      background: isGap ? 'rgba(240,77,77,0.08)' : isNew ? 'rgba(34,197,94,0.08)' : 'var(--surface-2)',
                      borderStyle: isGap ? 'dashed' : 'solid'
                    }}
                  >
                    <div className="font-mono text-[11px]" style={{ color: NODE_COLOR[layer] }}>{layer}</div>
                    <div className="font-mono text-xs font-semibold mt-0.5" style={{ color: 'var(--text)' }}>{n.name}</div>
                    {isGap && <div className="font-mono text-[10px] mt-1" style={{ color: 'var(--crisis)' }}>NOT BUILT</div>}
                    {isNew && <div className="font-mono text-[10px] mt-1" style={{ color: 'var(--resolved)' }}>BUILT BY dbt-wizard</div>}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t flex items-center gap-2 font-mono text-[10px]" style={{ borderColor: 'var(--line-soft)', color: 'var(--text-soft)' }}>
        <span>{nodes.length} nodes</span>
        <span>·</span>
        <span>{edges.length} edges</span>
      </div>
    </div>
  );
}
