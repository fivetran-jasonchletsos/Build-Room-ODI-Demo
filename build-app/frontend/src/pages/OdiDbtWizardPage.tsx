import { Link } from 'react-router-dom';

interface Pillar {
  layer: string;
  vendor: string;
  accent: string;
  what: string;
  inBuild: string;
  tag: string;
}

const PILLARS: Pillar[] = [
  {
    layer: 'Ingestion + MDLS',
    vendor: 'Fivetran',
    accent: '#0073EA',
    tag: 'connectors',
    what: '750+ managed connectors plus a custom Connector SDK for the long tail. Lands every source into Managed Data Lake Service as Apache Iceberg, in customer-owned S3.',
    inBuild: 'Seven sources feed Cardinal Provisions: Walmart Retail Link, Amazon Vendor Central, Target Partners Online, Kroger Vendor Portal, Manhattan WMS, Trade-Promo SoR, SAP store master. All land into the same lake, in the same open format, on the same continuous schedule.',
  },
  {
    layer: 'Open Lake',
    vendor: 'Iceberg on S3',
    accent: '#7C3AED',
    tag: 'storage',
    what: 'Open table format. Customer-owned storage. Snapshot isolation, schema evolution, time travel, multi-engine reads. The bytes belong to the customer, not the engine.',
    inBuild: 'When dbt-wizard\'s Worker sub-agent materializes the new gold.phantom_oos_by_cluster table, it writes Parquet files into the same S3 prefix the Crisis Room Cortex agents already read from. No second copy. No publish step. Cortex resolves the new asset on its next pass.',
  },
  {
    layer: 'Medallion + Build-time AI',
    vendor: 'dbt Labs + dbt-wizard',
    accent: '#FF694A',
    tag: 'transform',
    what: 'Bronze, silver, gold transformations with declarative SQL. Lineage, tests, freshness SLAs, semantic models. dbt-wizard adds four sub-agents that author new models into the project using the same tools an analytics engineer uses.',
    inBuild: 'The CSCO asks a follow-up question with no gold model behind it. dbt-wizard\'s Explorer runs status and search, Summary runs describe and lineage, Worker runs warehouse and dbt_show then authors the SQL, Verification writes the YAML and runs the tests. Eighty-seven seconds end-to-end.',
  },
  {
    layer: 'Multi-engine reads',
    vendor: 'Snowflake / Athena / Trino',
    accent: '#29B5E8',
    tag: 'engine',
    what: 'All three read the same Iceberg bytes via external catalogs — Snowflake external tables and Open Catalog, Athena over Glue, Trino over the Iceberg connector. No copies. No extracts. Any engine in the read pool sees the same gold tables.',
    inBuild: 'Snowflake runs the dbt-wizard warehouse for dbt_show and the materialization step — Worker spins up an XS warehouse for a few seconds. Athena and Trino can query gold.phantom_oos_by_cluster the moment it lands, side by side with Snowflake.',
  },
  {
    layer: 'Run-time Agents',
    vendor: 'Cortex',
    accent: '#DB2777',
    tag: 'reasoning',
    what: 'Cortex Analyst translates natural language to SQL over the gold layer. Cortex Agents orchestrate tool calls and message passing. Cortex Search retrieves unstructured context.',
    inBuild: 'The moment dbt-wizard\'s Verification sub-agent confirms the materialization, the new gold table is queryable by the Crisis Room\'s four Cortex agents. Build-time AI feeds run-time AI without an integration handoff.',
  },
];

interface Property {
  title: string;
  claim: string;
  proof: string;
}

const PROPERTIES: Property[] = [
  {
    title: 'Speed',
    claim: 'Ninety seconds from question to production model.',
    proof: 'Manual build of the same model: three to five days. The bottleneck is not SQL — it is the round-trip from question to backlog to scope to author to test to PR. dbt-wizard collapses every step into a single sub-agent chain. The model exists before S&OP starts.',
  },
  {
    title: 'Governance',
    claim: 'Every dbt-wizard model gets tests, lineage, and ownership.',
    proof: 'The output is not a SQL snippet pasted into a notebook. It is a dbt model with a schema contract, six column-level tests, a combination uniqueness test, declared upstreams, an owner, and an ai_built tag. The new table passes the same governance bar every other gold table passes.',
  },
  {
    title: 'Reusability',
    claim: 'The new model is a first-class citizen for every downstream consumer.',
    proof: 'Cortex agents pick it up on the next pass. BI dashboards can pin to it. Other dbt models can ref() it. Iceberg readers — Snowflake, Trino, Spark, DuckDB — can all query it. The model is not stuck inside the tool that built it.',
  },
  {
    title: 'Openness',
    claim: 'The model is Iceberg on S3, queryable by any engine.',
    proof: 'No lock-in on the build-time tool. No lock-in on the run-time engine. The bytes sit in the customer\'s S3 bucket in an open table format. Swap dbt-wizard tomorrow for a different build-time agent and the materialized table still works. Swap Snowflake for Trino and the table still works.',
  },
];

export default function OdiDbtWizardPage() {
  return (
    <div className="relative">
      <section className="relative overflow-hidden hero-glow" style={{ background: 'var(--surface-0)', borderBottom: '1px solid var(--line)' }}>
        <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="flex items-center gap-3 mb-6">
            <span className="chip chip-system">
              <span className="pulse-dot" style={{ background: 'var(--system)' }} />
              The Narrative Anchor
            </span>
            <span className="eyebrow">Why dbt-wizard belongs in the ODI loop</span>
          </div>

          <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-[0.95]" style={{ color: 'var(--text)' }}>
            ODI is the substrate.<br />
            <span style={{ color: 'var(--system)' }}>dbt-wizard builds on it.</span>
          </h1>
          <p className="mt-6 max-w-3xl text-lg sm:text-xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Cortex is the run-time brain. dbt-wizard is the build-time hands. Both operate on the same open
            lake. Both governed by the same medallion. That is the loop.
          </p>

          <div className="mt-10 max-w-4xl panel p-6 sm:p-8" style={{ background: 'var(--surface-1)' }}>
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text)' }}>
              When a stakeholder question outruns the gold layer, the answer is not "wait three days for the
              data engineering team." The answer is four sub-agents that run the same dbt tools an engineer
              runs — status, search, describe, lineage, warehouse, dbt_show, file edits, model generation —
              and produce a tested, lineage-tracked, materialized asset before the next meeting.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="eyebrow mb-2">Section 02 · What each layer contributes</div>
        <h2 className="font-display text-3xl sm:text-5xl tracking-tight mb-3" style={{ color: 'var(--text)' }}>
          Five layers. One loop.
        </h2>
        <p className="max-w-3xl text-base sm:text-lg leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
          Each layer has a clear job. Pull dbt-wizard out and the CSCO's follow-up does not get answered in time.
          Pull Iceberg out and dbt-wizard's output is just text. Pull Cortex out and the new table never gets read.
          The loop only closes when all five hold.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PILLARS.map((p, i) => (
            <div key={p.vendor} className="panel relative flex flex-col" style={{ minHeight: '440px' }}>
              <div className="h-1 w-full" style={{ background: p.accent }} />
              <div className="p-5 flex-1 flex flex-col">
                <div className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-soft)' }}>
                  0{i + 1} · {p.tag}
                </div>
                <div className="eyebrow mb-1" style={{ color: 'var(--text-muted)' }}>{p.layer}</div>
                <div className="font-display text-2xl mb-4" style={{ color: p.accent }}>{p.vendor}</div>

                <div className="text-[11px] font-mono uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-soft)' }}>What it does</div>
                <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text)' }}>{p.what}</p>

                <div className="text-[11px] font-mono uppercase tracking-wider mb-1.5" style={{ color: 'var(--text-soft)' }}>In the Build Room</div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{p.inBuild}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ background: 'var(--surface-1)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="eyebrow mb-2">Section 03 · The four properties</div>
          <h2 className="font-display text-3xl sm:text-5xl tracking-tight mb-3" style={{ color: 'var(--text)' }}>
            What dbt-wizard gives the lake that no other build-time tool can.
          </h2>
          <p className="max-w-3xl text-base sm:text-lg leading-relaxed mb-10" style={{ color: 'var(--text-muted)' }}>
            SQL generators are a dime a dozen. What dbt-wizard ships is a sub-agent constellation that
            produces a governed asset, not a string of text. Four properties carry the load.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {PROPERTIES.map((c, i) => (
              <div key={c.title} className="panel p-6 relative" style={{ borderLeft: '4px solid var(--system)' }}>
                <div className="flex items-baseline gap-3 mb-3">
                  <div className="font-mono text-xs" style={{ color: 'var(--text-soft)' }}>0{i + 1}</div>
                  <div className="font-display text-2xl" style={{ color: 'var(--text)' }}>{c.title}</div>
                </div>
                <div className="text-sm font-semibold mb-3" style={{ color: 'var(--system)' }}>{c.claim}</div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{c.proof}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="eyebrow mb-3">Section 04 · The loop, in one sentence</div>
          <p className="font-display text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-tight" style={{ color: 'var(--text)' }}>
            <span style={{ color: 'var(--text-soft)' }}>Source →</span>{' '}
            <span style={{ color: '#0073EA' }}>Fivetran →</span>{' '}
            <span style={{ color: '#7C3AED' }}>Iceberg (MDLS) →</span>{' '}
            <span style={{ color: '#29B5E8' }}>Snowflake / Athena / Trino →</span>{' '}
            <span style={{ color: '#FF694A' }}>dbt Labs →</span>{' '}
            <span style={{ color: 'var(--text)' }}>React.</span>
          </p>
          <p className="mt-6 max-w-4xl text-base sm:text-lg leading-relaxed font-mono" style={{ color: 'var(--text-muted)' }}>
            One copy of the bytes in Iceberg. Snowflake, Athena, and Trino read the same files via external
            catalogs. Fivetran Transformations triggers dbt Labs the moment the source sync finishes. bronze
            → silver → gold stays in Iceberg.
          </p>
          <p className="mt-8 max-w-4xl text-lg sm:text-xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Build-time AI and run-time AI on the same lake. The Build Room next door shows it live.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <Link to="/scenario" className="btn btn-primary text-base px-6 py-4">
              Open the Build Room
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
            </Link>
            <Link to="/architecture" className="btn">
              Back to the wiring diagram
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
