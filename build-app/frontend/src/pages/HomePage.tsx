import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const DEMO_COUNT_KEY = 'build-room-demo-count';

export default function HomePage() {
  const [count, setCount] = useState(0);
  const [tMinus, setTMinus] = useState(formatHours(13.75));

  useEffect(() => {
    const prev = Number(localStorage.getItem(DEMO_COUNT_KEY) ?? 0);
    const next = prev + 1;
    localStorage.setItem(DEMO_COUNT_KEY, String(next));
    setCount(next);
  }, []);

  // Simulated countdown — anchors to a fictional S&OP at "tomorrow 06:30".
  useEffect(() => {
    let h = 13.75;
    const id = setInterval(() => {
      h = Math.max(0, h - 1 / 3600);
      setTMinus(formatHours(h));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative">
      <section className="relative overflow-hidden" style={{ background: '#ffffff', borderBottom: '1px solid var(--line)' }}>
        <div className="absolute inset-0 grid-overlay opacity-60 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            <span className="chip chip-system">
              <span className="pulse-dot" style={{ background: 'var(--system)' }} />
              Build Active
            </span>
            <span className="chip chip-crisis">
              <span className="pulse-dot" style={{ background: 'var(--crisis)' }} />
              S&amp;OP T-minus
            </span>
            <span className="eyebrow">Request BLD-2026-05-21-0007</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95]" style={{ color: 'var(--text)' }}>
            Sixty seconds.<br />
            <span style={{ color: 'var(--system)' }}>One new gold table.</span><br />
            Production-ready.
          </h1>
          <p className="mt-6 max-w-3xl text-lg sm:text-xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Four dbt-wizard sub-agents build a new dbt model live on the open Iceberg lake — versioned,
            tested, materialized. The Crisis Room next door already resolved the phantom out-of-stock.
            The CSCO has a follow-up question, and there is no gold table for it yet.
          </p>

          <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3">
            {KPIS(tMinus).map(k => (
              <div key={k.label} className="panel p-5 relative overflow-hidden" style={{ borderLeft: `4px solid ${k.tone}` }}>
                <div className="eyebrow mb-2">{k.label}</div>
                <div className="font-display text-4xl sm:text-5xl tracking-tight tabular-nums" style={{ color: k.tone }}>{k.value}</div>
                <div className="text-xs mt-2 font-mono" style={{ color: 'var(--text-soft)' }}>{k.unit}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link to="/scenario" className="btn btn-primary text-base px-6 py-4">
              Open the Build Room
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/about" className="btn">
              Why this matters
            </Link>
          </div>

          <div className="mt-12 pt-6 border-t flex items-center gap-3 text-xs font-mono flex-wrap" style={{ borderColor: 'var(--line)', color: 'var(--text-soft)' }}>
            <span className="pulse-dot" style={{ background: 'var(--system)' }} />
            <span>Local demo run #{String(count).padStart(4, '0')} ·</span>
            <span>This build has been simulated <span style={{ color: 'var(--text)' }}>{count.toLocaleString()}</span> time{count === 1 ? '' : 's'} on this device.</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="eyebrow mb-3">The six-step build</div>
        <h2 className="font-display text-3xl sm:text-4xl mb-8" style={{ color: 'var(--text)' }}>
          Discover. Understand. Inspect. Author. Test. Materialize.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {FLOW.map((step, i) => (
            <div key={step.title} className="panel p-4 relative" style={{ borderLeft: `3px solid ${step.color}` }}>
              <div className="font-mono text-xs mb-2" style={{ color: step.color }}>
                {String(i + 1).padStart(2, '0')} · {step.tag}
              </div>
              <div className="font-display text-lg mb-2" style={{ color: 'var(--text)' }}>{step.title}</div>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{step.body}</p>
              <div className="mt-3 font-mono text-[10px]" style={{ color: 'var(--text-soft)' }}>{step.who}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="panel p-6 sm:p-8" style={{ borderLeft: '5px solid var(--system)', background: 'var(--paper-deep)' }}>
          <div className="eyebrow mb-2" style={{ color: 'var(--system)' }}>The third apex demo</div>
          <p className="font-display text-2xl sm:text-3xl leading-tight" style={{ color: 'var(--text)' }}>
            The Crisis Room runs four Cortex agents on existing gold tables.<br />
            The Brief Room runs Cortex Analyst and Cortex Search in dual modality.<br />
            <span style={{ color: 'var(--system)' }}>The Build Room builds the gold table itself.</span>
          </p>
          <p className="mt-4 text-base leading-relaxed max-w-3xl" style={{ color: 'var(--text-muted)' }}>
            Run-time AI and build-time AI on the same open lake. Cortex acts on what dbt-wizard authors.
            dbt-wizard authors what Cortex will need next. The loop closes on Iceberg.
          </p>
        </div>
      </section>
    </div>
  );
}

function formatHours(h: number): string {
  const totalSec = Math.max(0, Math.floor(h * 3600));
  const hh = Math.floor(totalSec / 3600);
  const mm = Math.floor((totalSec % 3600) / 60);
  const ss = totalSec % 60;
  return `T-${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
}

const KPIS = (tMinus: string) => [
  { label: 'S&OP meeting',          value: tMinus,    unit: 'Friday 06:30 CST',     tone: 'var(--crisis)' },
  { label: 'Metric requested',       value: 'NEW',     unit: 'phantom OOS by cluster', tone: 'var(--crisis)' },
  { label: 'Upstream models ready',  value: '4 / 4',   unit: 'staging + dim',         tone: 'var(--system)' },
  { label: 'Sub-agents on the job',  value: '4 / 4',   unit: 'all wired',             tone: 'var(--system)' },
];

const FLOW = [
  { tag: 'DISCOVERY',            title: 'Find the signals',        body: 'Explorer runs status and search across the project. Returns POS, shelf compliance, promo, cluster.', who: 'Explorer · status, search', color: '#0073EA' },
  { tag: 'SCHEMA',               title: 'Confirm the grain',       body: 'Summary runs describe and lineage. Names the gap and the new grain the gold table has to land on.',  who: 'Summary · describe, lineage', color: '#b45309' },
  { tag: 'INSPECTION',           title: 'Validate the slice',      body: 'Worker runs dbt_show on a 7-day slice. Confirms the phantom-OOS signal aggregates cleanly.',          who: 'Worker · warehouse, dbt_show', color: '#be185d' },
  { tag: 'MODEL CREATION',       title: 'Author the SQL',          body: 'Worker writes gold.phantom_oos_by_cluster.sql — header, CTEs, joins, and final SELECT.',              who: 'Worker · file edits, model generation', color: '#be185d' },
  { tag: 'TEST AUTHORING',       title: 'Lock the contract',       body: 'Verification writes YAML — schema contract, ownership, six column tests, one combination test.',     who: 'Verification · describe, dbt_show', color: '#15803d' },
  { tag: 'MATERIALIZATION',      title: 'Land on Iceberg',         body: 'Worker materializes the table. Verification confirms lineage updated and Cortex can read it.',       who: 'Worker + Verification', color: '#15803d' },
];
