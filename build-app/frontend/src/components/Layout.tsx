import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

const NAV: [string, string][] = [
  ['/', 'Home'],
  ['/about', 'About'],
  ['/architecture', 'Architecture'],
  ['/odi-dbt', 'ODI + dbt-wizard'],
  ['/agents', 'Sub-Agents'],
  ['/scenario', 'Scenario'],
  ['/build', 'Build Room'],
  ['/outcome', 'Outcome'],
  ['/policy', 'Policy'],
];

const DEMOS = [
  { key: 'build-room',     name: 'The Build Room',       industry: 'CPG · dbt-wizard live model build',   url: 'https://fivetran-jasonchletsos.github.io/Build-Room-ODI-Demo/', accent: '#0073EA' },
  { key: 'crisis-room',    name: 'The Crisis Room',      industry: 'CPG · Multi-agent supply-chain ops',  url: 'https://fivetran-jasonchletsos.github.io/Crisis-Room-ODI-Demo/', accent: '#dc2626' },
  { key: 'tax-assessment', name: 'Allegheny County Tax', industry: 'Public sector · Property assessment', url: 'https://fivetran-jasonchletsos.github.io/tax-assessment-databricks-demo/', accent: '#ea580c' },
  { key: 'healthcare',     name: 'Epic Clarity',         industry: 'Healthcare · Clinical analytics',     url: 'https://fivetran-jasonchletsos.github.io/Healthcare-EPIC-Snowflake-Demo/', accent: '#0d9488' },
  { key: 'finserv',        name: 'Meridian Capital',     industry: 'Financial Services',                  url: 'https://fivetran-jasonchletsos.github.io/FinServ-ODI-Demo/', accent: '#1d4ed8' },
  { key: 'insurance',      name: 'Atlas Risk',           industry: 'Insurance',                           url: 'https://fivetran-jasonchletsos.github.io/Insurance-ODI-Demo/', accent: '#0369a1' },
  { key: 'media',          name: 'Lighthouse Media',     industry: 'Media · Audience intelligence',       url: 'https://fivetran-jasonchletsos.github.io/Media-ODI-Demo/', accent: '#7c3aed' },
  { key: 'retail',         name: 'Storefront Analytics', industry: 'Retail & e-commerce',                  url: 'https://fivetran-jasonchletsos.github.io/RetailEcom-ODI-Demo/', accent: '#ea580c' },
  { key: 'techsaas',       name: 'SaaS Pulse',           industry: 'Tech · SaaS analytics',                url: 'https://fivetran-jasonchletsos.github.io/TechSaaS-ODI-Demo/', accent: '#059669' },
  { key: 'supplychain',    name: 'Manifest',             industry: 'Supply chain · Logistics',             url: 'https://fivetran-jasonchletsos.github.io/SupplyChain-ODI-Demo/', accent: '#0891b2' },
  { key: 'lifesci',        name: 'Cohort',               industry: 'Life sciences · Clinical research',    url: 'https://fivetran-jasonchletsos.github.io/LifeSci-ODI-Demo/', accent: '#be185d' },
  { key: 'mission-control', name: 'Mission Control',     industry: 'Admin · Governance + observability',   url: 'https://fivetran-jasonchletsos.github.io/ODI-Mission-Control/', accent: '#22d3ee' },
];
const CURRENT_DEMO = 'build-room';

export default function Layout() {
  const location = useLocation();
  const [now, setNow] = useState(new Date());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <div className="min-h-full flex flex-col" style={{ background: 'var(--ink)' }}>
      <header className="sticky top-0 z-30" style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'saturate(180%) blur(10px)', WebkitBackdropFilter: 'saturate(180%) blur(10px)', borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <Link to="/" className="flex items-center gap-3 shrink-0 min-w-0">
              <BuildMark className="h-8 w-8" />
              <div className="leading-tight min-w-0">
                <div className="font-display text-lg tracking-tight truncate" style={{ color: 'var(--text)' }}>
                  The ODI Build Room
                </div>
                <div className="eyebrow mt-0.5" style={{ color: 'var(--system)' }}>
                  Cardinal Provisions · dbt-wizard Live Build
                </div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV.map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 font-mono text-[11px]" style={{ color: 'var(--text-muted)' }}>
                <span className="pulse-dot" style={{ background: 'var(--resolved)' }} />
                <span>LIVE · {now.toLocaleTimeString('en-US', { hour12: false })}</span>
              </div>
              <DemoSwitcher />
              <button
                type="button"
                onClick={() => setMobileOpen(o => !o)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="lg:hidden h-9 w-9 inline-flex items-center justify-center rounded-sm"
                style={{ color: 'var(--text-muted)', border: '1px solid var(--line)' }}
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                  {mobileOpen ? <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" /> : <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />}
                </svg>
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="lg:hidden pb-4 pt-3 border-t" style={{ borderColor: 'var(--line)' }}>
              <nav className="grid grid-cols-2 gap-1">
                {NAV.map(([to, label]) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) => `nav-link text-center ${isActive ? 'active' : ''}`}
                  >
                    {label}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="mt-16" style={{ background: 'var(--paper-deep)', borderTop: '1px solid var(--line)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BuildMark className="h-6 w-6" />
              <div className="font-display text-lg tracking-tight" style={{ color: 'var(--text)' }}>The Build Room</div>
            </div>
            <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Snowflake Summit demo. Four dbt-wizard sub-agents build a new dbt gold model live on the open lake
              in ninety seconds. Synthetic data — Cardinal Provisions is a fictional CPG.
            </p>
          </div>
          <div>
            <div className="eyebrow mb-2">Build-time AI partner</div>
            <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              dbt Labs and dbt-wizard. Sub-agents author SQL, YAML, tests, and lineage entries into the medallion
              project. Snowflake materializes them onto Iceberg on S3. Cortex reads the result the moment it lands.
            </p>
          </div>
          <div>
            <div className="eyebrow mb-2">The four sub-agents</div>
            <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              Explorer, Summary, Worker, Verification. Each owns a slice of the dbt-wizard tool surface:
              status, search, describe, lineage, warehouse, dbt_show, file edits, model generation.
            </p>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--line)' }}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 text-[11px] flex flex-col sm:flex-row gap-1 sm:items-center sm:justify-between" style={{ color: 'var(--text-soft)' }}>
            <div className="font-mono">© 2026 Build Room ODI Demo · Fivetran Open Data Infrastructure</div>
            <div className="font-mono">{now.toISOString()}</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DemoSwitcher() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className="relative hidden sm:block">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex items-center gap-1.5 rounded-sm px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider border transition-colors"
        style={{
          color: 'var(--system)',
          background: 'rgba(0, 115, 234, 0.08)',
          borderColor: 'rgba(0, 115, 234, 0.35)',
        }}
      >
        <span className="pulse-dot" style={{ background: 'var(--system)' }} />
        Switch demo
        <svg viewBox="0 0 24 24" className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full mt-2 w-[300px] rounded-sm shadow-xl z-40 overflow-hidden" style={{ background: 'var(--ink-elev)', border: '1px solid var(--line)' }}>
          <div className="px-3 pt-3 pb-2 eyebrow border-b" style={{ borderColor: 'var(--line)' }}>
            ODI Demo Catalog
          </div>
          <div className="py-1 max-h-[60vh] overflow-y-auto">
            {DEMOS.map(d => {
              const current = d.key === CURRENT_DEMO;
              const inner = (
                <div className="flex items-center gap-2.5 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: d.accent }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate" style={{ color: 'var(--text)' }}>{d.name}</div>
                    <div className="text-[11px] truncate" style={{ color: 'var(--text-muted)' }}>{d.industry}</div>
                  </div>
                  {current && (
                    <span className="text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,115,234,0.10)', color: 'var(--system)', border: '1px solid rgba(0,115,234,0.35)' }}>
                      Current
                    </span>
                  )}
                </div>
              );
              return current ? (
                <div key={d.key} className="opacity-70 cursor-default">{inner}</div>
              ) : (
                <a key={d.key} href={d.url} className="block transition-colors" style={{ background: 'transparent' }} onClick={() => setOpen(false)}
                   onMouseEnter={e => (e.currentTarget.style.background = 'var(--ink-elev-2)')}
                   onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {inner}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function BuildMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect x="0.5" y="0.5" width="31" height="31" rx="6" fill="#ffffff" stroke="#0073EA" strokeWidth="1.5" />
      <path d="M7 22 L7 10 L12 10 Q16 10 16 16 Q16 22 12 22 Z" fill="#0073EA" />
      <circle cx="22" cy="11" r="2" fill="#be185d" />
      <circle cx="22" cy="16" r="2" fill="#b45309" />
      <circle cx="22" cy="21" r="2" fill="#15803d" />
    </svg>
  );
}
