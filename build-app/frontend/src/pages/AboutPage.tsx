export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Canonical ODI Story block — verbatim pattern from FinServ */}
      <section className="panel p-6 mb-10" style={{ borderLeft: '4px solid var(--system)', background: 'rgba(59,158,255,0.06)' }}>
        <div className="eyebrow mb-2" style={{ color: 'var(--system)' }}>The ODI Story</div>
        <h2 className="font-display text-3xl tracking-tight" style={{ color: 'var(--text)' }}>
          Data infrastructure for agents you trust.
        </h2>
        <p className="mt-3 leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          <em>"MDS was optimized for humans. ODI is designed for a future with humans and
          production agents at scale."</em> This demo is one instance of that architecture, end to end:
          <strong style={{ color: 'var(--text)' }}> Source → Fivetran → Iceberg (MDLS) → Snowflake / Athena / Trino → dbt Labs → React</strong>.
          Fivetran lands every CDC row into Iceberg (MDLS) on S3 in open Apache Iceberg format — one copy of the
          bytes. Snowflake, Athena, and Trino read the same Iceberg files via external catalogs. Fivetran
          Transformations triggers dbt Labs the moment the source sync finishes, and bronze → silver → gold
          stays in Iceberg the whole way.
        </p>
        <a
          href="https://fivetran-jasonchletsos.github.io/Fivetran-Demo-Repository/story/"
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex items-center gap-1 text-sm font-semibold hover:underline"
          style={{ color: 'var(--system)' }}
        >
          Read the full ODI Story →
        </a>
      </section>

      <header className="mb-8">
        <div className="eyebrow mb-1">Headline Demo · Snowflake Summit 2026</div>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight" style={{ color: 'var(--text)' }}>About The Build Room</h1>
        <p className="mt-3 leading-relaxed text-lg" style={{ color: 'var(--text-muted)' }}>
          Most demos show what happens when an agent reads a gold table that already exists.
          This one shows what happens when the table does not exist yet — and four sub-agents
          have ninety seconds to build it.
        </p>
      </header>

      <section className="space-y-4 mb-10">
        {WHATS_DIFFERENT.map(p => (
          <div key={p.title} className="panel p-5">
            <div className="chip chip-system mb-3">{p.tag}</div>
            <h3 className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>{p.title}</h3>
            <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>{p.body}</p>
          </div>
        ))}
      </section>

      <section className="mb-10">
        <h2 className="font-display text-2xl border-b pb-2 mb-4" style={{ color: 'var(--text)', borderColor: 'var(--line)' }}>The scenario in one paragraph</h2>
        <div className="panel p-5 font-mono text-sm leading-relaxed" style={{ color: 'var(--text)' }}>
          The Crisis Room resolved phantom OOS at MegaMart Atlanta DMA on Wednesday. On Thursday at 16:14 CST,
          the CSCO asks the follow-up: <em>"track phantom OOS by store cluster over the last 90 days. Show me
          the chronic offenders."</em> No gold table tracks this. The S&amp;OP meeting is in fourteen hours.
          Data engineering says three to five days. dbt-wizard says eighty-seven seconds. Four sub-agents —
          Explorer, Summary, Worker, Verification — surface the four upstream models, confirm the grain,
          author the SQL, write the tests, and materialize the asset to Iceberg. The CSCO walks into S&amp;OP
          with an answer.
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-2xl border-b pb-2 mb-4" style={{ color: 'var(--text)', borderColor: 'var(--line)' }}>The dbt Labs role in the ODI loop</h2>
        <p className="leading-relaxed text-base mb-4" style={{ color: 'var(--text-muted)' }}>
          The Crisis Room shows what Cortex does at <em>run-time</em>. The Build Room shows what dbt Labs and
          dbt-wizard do at <em>build-time</em>. They are the same loop, viewed from opposite ends. Cortex agents
          read the gold layer. dbt-wizard sub-agents author it. Both point at the same Iceberg lake. Neither
          is locked to the other. That is what makes the architecture survive every model swap, every engine
          swap, and every vendor swap that comes next.
        </p>
        <p className="leading-relaxed text-base" style={{ color: 'var(--text-muted)' }}>
          dbt-wizard is not a SQL generator pretending to be a colleague. It is a sub-agent constellation
          that runs the exact tools a senior analytics engineer runs — status, search, describe, lineage,
          warehouse, dbt_show, file edits, model generation — and produces an asset that passes the same
          tests every other model in the project passes. The output is a dbt asset, not a string of text.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-2xl border-b pb-2 mb-4" style={{ color: 'var(--text)', borderColor: 'var(--line)' }}>The build path</h2>
        <p className="text-sm mb-4 font-mono" style={{ color: 'var(--text-muted)' }}>
          Source → Fivetran → Iceberg (MDLS) → Snowflake / Athena / Trino → dbt Labs → React
        </p>
        <div className="panel p-5">
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
            {STACK.map(s => (
              <li key={s.name} className="flex items-start gap-3">
                <div className="chip chip-system shrink-0 mt-0.5">{s.layer}</div>
                <div className="min-w-0">
                  <div className="font-semibold" style={{ color: 'var(--text)' }}>{s.name}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.note}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="panel p-5" style={{ background: 'rgba(245, 158, 11, 0.06)', borderColor: 'rgba(245, 158, 11, 0.35)' }}>
        <div className="eyebrow mb-2" style={{ color: 'var(--alert)' }}>Disclaimer</div>
        <p className="leading-relaxed text-sm" style={{ color: 'var(--text-muted)' }}>
          <strong style={{ color: 'var(--text)' }}>All data shown is synthetic.</strong>{' '}
          Cardinal Provisions is a fictional CPG used across the Fivetran ODI demo catalog. MegaMart and the
          Atlanta DMA are demo entities. The dbt-wizard sub-agent constellation is real. The architecture is real.
        </p>
      </section>
    </div>
  );
}

const WHATS_DIFFERENT = [
  {
    tag: 'Build-time AI',
    title: 'Four sub-agents, one new model.',
    body: 'Explorer, Summary, Worker, Verification. Each owns a slice of the dbt-wizard tool surface. They run their tools in sequence, hand off context, and the new gold table exists when they are done.',
  },
  {
    tag: 'Governed by default',
    title: 'Every model gets tests and lineage.',
    body: 'The output is not a SQL snippet. It is a dbt model with a schema contract, six column-level tests, a combination test, declared upstreams, and an owner. Production-grade in production-grade time.',
  },
  {
    tag: 'Open lake',
    title: 'Cortex reads what dbt-wizard authored.',
    body: 'The new gold table materializes to Iceberg on S3. The Crisis Room Cortex agents resolve it on their next pass — no copy, no export, no notify-the-team email. The loop is the lake.',
  },
];

const STEPS = [
  { layer: 'Source',           name: 'Cardinal sources',                 note: 'Walmart Retail Link, Amazon Vendor Central, Target Partners Online, Kroger Vendor Portal, Manhattan WMS, Trade-Promo SoR, SAP store master.' },
  { layer: 'Fivetran',         name: 'Fivetran CDC + Transformations',   note: 'Lands every CDC row into Iceberg (MDLS) on S3 in open Apache Iceberg format. Fivetran Transformations triggers dbt Labs the moment the source sync finishes.' },
  { layer: 'Iceberg (MDLS)',   name: 'Iceberg on Amazon S3',             note: 'cardinal-odi-lake bucket. Customer-owned. One copy of the bytes. bronze → silver → gold prefixes. Apache Iceberg v2, Parquet, ZSTD. Glue + Snowflake Open Catalog.' },
  { layer: 'Engines',          name: 'Snowflake / Athena / Trino',       note: 'All three read the same Iceberg bytes via external catalogs. No copies, no extracts. Snowflake runs the dbt-wizard warehouse for dbt_show and materialization; Athena and Trino can query the same gold tables side by side.' },
  { layer: 'dbt Labs',         name: 'dbt Labs + dbt-wizard',            note: 'Bronze, silver, gold medallion. 87 models before this build, 88 after. dbt-wizard sub-agents author models inside the medallion using the same tools an engineer uses.' },
  { layer: 'React',            name: 'React 19 + Vite + Tailwind v4',    note: 'Static SPA on GitHub Pages. This UI reads gold Iceberg tables and shows the live dbt-wizard build as an audience-controllable typewriter.' },
];

const STACK = STEPS;
