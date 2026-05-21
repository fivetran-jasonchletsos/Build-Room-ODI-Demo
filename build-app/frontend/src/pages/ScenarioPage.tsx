import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dataUrl } from '../types';
import type { Scenario } from '../types';

export default function ScenarioPage() {
  const [s, setS] = useState<Scenario | null>(null);
  const [tMinus, setTMinus] = useState('T-13:46:00');

  useEffect(() => {
    fetch(dataUrl('scenario.json')).then(r => r.json()).then(setS);
  }, []);

  useEffect(() => {
    let h = 13.75;
    const id = setInterval(() => {
      h = Math.max(0, h - 1 / 3600);
      const totalSec = Math.max(0, Math.floor(h * 3600));
      const hh = Math.floor(totalSec / 3600);
      const mm = Math.floor((totalSec % 3600) / 60);
      const ss = totalSec % 60;
      setTMinus(`T-${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  if (!s) return <div className="mx-auto max-w-7xl px-4 py-12 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>Loading scenario…</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-3 flex-wrap">
          <span className="chip chip-crisis">
            <span className="pulse-dot" style={{ background: 'var(--crisis-bright)' }} />
            Gap · Active
          </span>
          <span className="eyebrow">{s.request_id}</span>
          <span className="eyebrow">Follows {s.prior_crisis_id}</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight" style={{ color: 'var(--text)' }}>
          {s.timezone_label}. <span style={{ color: 'var(--crisis-bright)' }}>{s.requested_by}.</span>
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed text-lg" style={{ color: 'var(--text-muted)' }}>
          The Crisis Room resolved phantom OOS at {s.retailer} {s.dma} DMA yesterday. The follow-up question
          arrives the next afternoon. There is no gold table behind it.
        </p>
        <div className="mt-5 panel p-5" style={{ borderLeft: '4px solid var(--crisis)', background: 'rgba(220,38,38,0.04)' }}>
          <div className="eyebrow mb-2" style={{ color: 'var(--crisis)' }}>The CSCO's question</div>
          <p className="font-display text-2xl leading-tight" style={{ color: 'var(--text)' }}>
            "{s.question}"
          </p>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <KpiTile label="S&OP meeting"      value={tMinus}                                unit={s.sop_meeting_label}    tone="var(--crisis)" />
        <KpiTile label="Metric requested"  value="NEW"                                   unit={s.metric_label}         tone="var(--crisis)" />
        <KpiTile label="Manual ETA"        value={s.manual_time_days}                    unit="data engineering"       tone="var(--alert)" />
        <KpiTile label="Build Room ETA"    value={`${s.build_room_seconds}s`}             unit="dbt-wizard sub-agents"  tone="var(--system)" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-10">
        <div className="lg:col-span-2 panel-deep p-5 relative overflow-hidden">
          <div className="absolute inset-0 grid-overlay opacity-30 pointer-events-none" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="eyebrow">Upstream models available</div>
                <div className="font-display text-xl mt-1" style={{ color: 'var(--text)' }}>Four signals. Already in the lake.</div>
              </div>
              <span className="chip chip-system">4 of 4</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {s.upstream_models.map(u => (
                <div key={u.model} className="panel p-4 relative">
                  <div className="absolute top-0 left-0 h-full w-1" style={{ background: 'var(--system)' }} />
                  <div className="font-mono text-xs" style={{ color: 'var(--system)' }}>{u.layer}</div>
                  <div className="font-mono text-sm font-semibold mt-1" style={{ color: 'var(--text)' }}>{u.model}</div>
                  <div className="font-mono text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>grain · {u.grain}</div>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: 'var(--text-muted)' }}>{u.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="panel p-5">
          <div className="eyebrow mb-3">State of the world</div>
          <dl className="space-y-3 text-sm">
            <Row k="Question requested by" v={s.requested_by} />
            <Row k="Requested at" v={<span className="font-mono">{s.timezone_label}</span>} />
            <Row k="Target schema" v={<span className="font-mono">{s.target_schema}</span>} />
            <Row k="Target model" v={<span className="font-mono">{s.target_model}</span>} />
            <Row k="Target grain" v={<span className="font-mono text-xs">{s.target_grain}</span>} />
            <Row k="Lookback window" v={<span className="font-mono">trailing 90 days</span>} />
            <Row k="Prior incident" v={<span className="font-mono">{s.prior_crisis_id}</span>} />
            <Row k="S&OP next" v={<span className="font-mono" style={{ color: 'var(--crisis-bright)' }}>{s.sop_meeting_label}</span>} />
          </dl>
        </div>
      </div>

      <div className="panel p-5 mb-8" style={{ borderLeft: '4px solid var(--system)' }}>
        <div className="eyebrow mb-2" style={{ color: 'var(--system)' }}>The path through the six steps</div>
        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex gap-3">
              <span className="font-mono text-xs shrink-0" style={{ color: s.color }}>{String(i + 1).padStart(2, '0')}</span>
              <div>
                <div className="font-semibold" style={{ color: 'var(--text)' }}>{s.title}</div>
                <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{s.who} · {s.tools}</div>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between panel p-5">
        <div>
          <div className="font-display text-2xl" style={{ color: 'var(--text)' }}>Ready to open the Build Room?</div>
          <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Four sub-agents will be paged. The new model gets written character-by-character.</div>
        </div>
        <Link to="/build" className="btn btn-primary text-base px-6 py-4">
          Run the Build Room
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
        </Link>
      </div>
    </div>
  );
}

const STEPS = [
  { title: 'Discovery',           who: 'Explorer',     tools: 'status, search',         color: '#0073EA' },
  { title: 'Schema Understanding', who: 'Summary',      tools: 'describe, lineage',      color: '#b45309' },
  { title: 'Data Inspection',      who: 'Worker',       tools: 'warehouse, dbt_show',    color: '#be185d' },
  { title: 'Model Creation',       who: 'Worker',       tools: 'file edits, model gen',  color: '#be185d' },
  { title: 'Test Authoring',       who: 'Verification', tools: 'describe, dbt_show',     color: '#15803d' },
  { title: 'Materialization',      who: 'Worker + Ver', tools: 'dbt_run, lineage',       color: '#15803d' },
];

function KpiTile({ label, value, unit, tone }: { label: string; value: string; unit: string; tone: string }) {
  return (
    <div className="panel p-5 relative overflow-hidden" style={{ borderLeft: `4px solid ${tone}` }}>
      <div className="eyebrow mb-2">{label}</div>
      <div className="font-display text-3xl tracking-tight tabular-nums" style={{ color: tone }}>{value}</div>
      <div className="text-xs mt-2 font-mono" style={{ color: 'var(--text-soft)' }}>{unit}</div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>{k}</dt>
      <dd className="text-right" style={{ color: 'var(--text)' }}>{v}</dd>
    </div>
  );
}
