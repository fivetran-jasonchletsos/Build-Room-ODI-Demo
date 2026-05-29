import { useEffect, useState } from 'react';
import { dataUrl } from '../types';

interface IcebergTable { name: string; rows: number; partition: string; owner: string }
interface PipelineConnector { name: string; type: string; owner: string; freq: string; rows_per_day: number; destination: string; fivetran_id: string; fivetran_url: string }

export default function ArchitecturePage() {
  const [tables, setTables] = useState<IcebergTable[]>([]);
  const [connectors, setConnectors] = useState<PipelineConnector[]>([]);

  useEffect(() => {
    fetch(dataUrl('iceberg.json')).then(r => { if (!r.ok) throw new Error('iceberg.json'); return r.json(); }).then(d => setTables(d.gold_tables)).catch(() => {});
    fetch(dataUrl('pipeline.json')).then(r => { if (!r.ok) throw new Error('pipeline.json'); return r.json(); }).then(d => setConnectors(d.connectors)).catch(() => {});
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="eyebrow mb-1">ODI Reference Architecture · Cardinal Provisions</div>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight" style={{ color: 'var(--text)' }}>
          Build-time AI and run-time AI on the same lake.
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Fivetran lands every CDC row into Iceberg (MDLS) on S3 in open Apache Iceberg format — one copy of
          the bytes. Snowflake, Athena, and Trino all read the same Iceberg files via external catalogs. No
          copies. No extracts. No drift. Fivetran Transformations triggers dbt Labs the moment the source sync
          finishes, and the bronze → silver → gold medallion stays in Iceberg the whole way.
        </p>
      </header>

      <section className="panel p-6 mb-12 relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-20 pointer-events-none" />
        <div className="relative grid grid-cols-1 lg:grid-cols-11 gap-3 items-stretch">
          <div className="lg:col-span-2">
            <div className="eyebrow mb-3">Sources</div>
            <div className="space-y-2">
              {SOURCES.map(s => (
                <div key={s} className="panel px-3 py-2 text-xs font-mono" style={{ color: 'var(--text)' }}>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <Arrow />

          <div className="lg:col-span-2">
            <div className="eyebrow mb-3">Ingest</div>
            <div className="panel p-3" style={{ borderLeft: '4px solid var(--system)' }}>
              <div className="font-display text-lg" style={{ color: 'var(--system)' }}>Fivetran</div>
              <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>750+ connectors · CDC</div>
              <div className="text-xs font-mono mt-2" style={{ color: 'var(--text-soft)' }}>writes Iceberg to S3</div>
            </div>
          </div>

          <Arrow />

          <div className="lg:col-span-2">
            <div className="eyebrow mb-3">Iceberg (MDLS)</div>
            <div className="panel p-3" style={{ borderLeft: '4px solid #7C3AED' }}>
              <div className="font-display text-lg" style={{ color: '#7C3AED' }}>Iceberg on S3</div>
              <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>cardinal-odi-lake</div>
              <div className="text-xs font-mono mt-2" style={{ color: 'var(--text-soft)' }}>one copy of the bytes · bronze/silver/gold</div>
            </div>
          </div>

          <Arrow />

          <div className="lg:col-span-2">
            <div className="eyebrow mb-3">Multi-engine reads</div>
            <div className="space-y-2">
              <div className="panel p-3">
                <div className="font-display text-sm" style={{ color: 'var(--text)' }}>Snowflake</div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>external catalog</div>
              </div>
              <div className="panel p-3">
                <div className="font-display text-sm" style={{ color: 'var(--text)' }}>Athena</div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Glue catalog</div>
              </div>
              <div className="panel p-3">
                <div className="font-display text-sm" style={{ color: 'var(--text)' }}>Trino</div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>same Iceberg files</div>
              </div>
            </div>
          </div>

          <Arrow />

          <div className="lg:col-span-2">
            <div className="eyebrow mb-3">dbt Labs → React</div>
            <div className="space-y-2">
              <div className="panel p-3" style={{ borderLeft: '4px solid var(--alert)' }}>
                <div className="font-display text-lg" style={{ color: 'var(--alert)' }}>dbt Labs</div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>triggered by Fivetran Transformations</div>
              </div>
              <div className="panel p-3" style={{ borderLeft: '4px solid var(--system)' }}>
                <div className="font-display text-sm" style={{ color: 'var(--system)' }}>dbt-wizard</div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>build-time sub-agents</div>
              </div>
              <div className="panel p-3">
                <div className="font-display text-sm" style={{ color: 'var(--text)' }}>React</div>
                <div className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>this UI · agents read gold</div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mt-6 panel p-4" style={{ borderLeft: '3px solid var(--system)', background: 'rgba(0,115,234,0.04)' }}>
          <div className="eyebrow mb-1" style={{ color: 'var(--system)' }}>Canonical flow</div>
          <div className="font-mono text-xs sm:text-sm" style={{ color: 'var(--text)' }}>
            Source → Fivetran → Iceberg (MDLS) → Snowflake / Athena / Trino → dbt Labs → React
          </div>
          <div className="text-[11px] font-mono mt-2" style={{ color: 'var(--text-muted)' }}>
            Fivetran Transformations triggers dbt Labs the moment the source sync finishes. bronze → silver → gold stays in Iceberg.
          </div>
        </div>

        <div className="relative mt-6">
          <div className="eyebrow mb-3">Run-time agents · read the same gold Iceberg tables</div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {AGENT_BOXES.map(a => (
              <div key={a.name} className="panel p-3" style={{ borderLeft: `4px solid ${a.color}` }}>
                <div className="font-display text-sm" style={{ color: a.color }}>{a.name}</div>
                <div className="text-[10px] font-mono mt-1" style={{ color: 'var(--text-muted)' }}>{a.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12 panel p-6" style={{ borderLeft: '5px solid var(--system)', background: 'rgba(59,158,255,0.06)' }}>
        <div className="eyebrow mb-2" style={{ color: 'var(--system)' }}>The build-time / run-time loop</div>
        <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text)' }}>
          <strong>dbt-wizard</strong> is the build-time companion to Snowflake's Cortex. Cortex acts on what
          dbt-wizard authors. dbt-wizard authors what Cortex will need next. Both point at the same Iceberg
          lake. Both run governed against the same medallion. Neither is locked to the other. When the CSCO
          asks a question that requires a new model, dbt-wizard builds it in eighty-seven seconds —
          materialized to the same gold prefix Cortex reads from a minute later.
        </p>
      </section>

      <section className="mb-12">
        <div className="flex items-center justify-between mb-4 border-b pb-2" style={{ borderColor: 'var(--line)' }}>
          <h2 className="font-display text-2xl" style={{ color: 'var(--text)' }}>Fivetran connectors</h2>
          <a
            href="https://fivetran.com/dashboard/connectors"
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
            style={{ fontSize: 12, padding: '6px 14px' }}
          >
            Open in Fivetran
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
          </a>
        </div>
        <div className="panel overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--paper-deep)' }}>
                {['Source', 'Connector ID', 'Type', 'Cadence', 'Rows / day', 'Destination', ''].map(h => (
                  <th key={h} className="text-left px-4 py-2 eyebrow border-b" style={{ borderColor: 'var(--line)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {connectors.map(c => (
                <tr key={c.name} style={{ borderBottom: '1px solid var(--line-soft)' }}>
                  <td className="px-4 py-3 font-semibold" style={{ color: 'var(--text)' }}>{c.name}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{c.fivetran_id}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{c.type}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{c.freq}</td>
                  <td className="px-4 py-3 font-mono text-xs text-right tabular-nums" style={{ color: 'var(--text)' }}>{c.rows_per_day.toLocaleString()}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{c.destination}</td>
                  <td className="px-4 py-3">
                    <a
                      href={c.fivetran_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded transition-colors"
                      style={{ color: 'var(--system)', background: 'rgba(0,115,234,0.08)', border: '1px solid rgba(0,115,234,0.35)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,115,234,0.18)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,115,234,0.08)'; }}
                    >
                      Open
                      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl mb-4 border-b pb-2" style={{ color: 'var(--text)', borderColor: 'var(--line)' }}>Gold-layer Iceberg tables</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {tables.map(t => {
            const isNew = t.owner.startsWith('BUILT BY');
            return (
              <div key={t.name} className="panel p-4" style={isNew ? { borderLeft: '4px solid var(--system)', background: 'rgba(0,115,234,0.04)' } : undefined}>
                <div className="font-mono text-sm font-semibold" style={{ color: isNew ? 'var(--system)' : 'var(--text)' }}>{t.name}</div>
                <div className="text-xs font-mono mt-1" style={{ color: 'var(--text-muted)' }}>
                  {t.rows.toLocaleString()} rows · part by {t.partition}
                </div>
                <div className="text-[11px] mt-2" style={{ color: isNew ? 'var(--system)' : 'var(--text-soft)' }}>Read by: {t.owner}</div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Arrow() {
  return (
    <div className="hidden lg:flex items-center justify-center">
      <svg viewBox="0 0 40 24" className="h-6 w-10" fill="none" stroke="var(--text-soft)" strokeWidth="1.5" strokeLinecap="round">
        <path d="M2 12 L34 12 M28 6 L34 12 L28 18" />
      </svg>
    </div>
  );
}

const SOURCES = [
  'Walmart Retail Link',
  'Amazon Vendor Central',
  'Target Partners Online',
  'Kroger Vendor Portal',
  'Manhattan WMS',
  'Trade-Promo SoR',
  'SAP store master',
];

const AGENT_BOXES = [
  { name: 'Demand-Sensing',  color: '#0073EA', role: 'POS signal + OOS detection' },
  { name: 'Procurement',     color: '#b45309', role: 'Inventory + replenishment' },
  { name: 'Trade-Promo',     color: '#be185d', role: 'Promo calendar + compliance' },
  { name: 'Transportation',  color: '#15803d', role: 'Carrier OTD + lane rates' },
];
