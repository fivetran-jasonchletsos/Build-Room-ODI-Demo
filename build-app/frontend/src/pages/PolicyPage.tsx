export default function PolicyPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="eyebrow mb-1">Why this only works on ODI</div>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight" style={{ color: 'var(--text)' }}>
          A SQL generator without a lake is just text.
        </h1>
        <p className="mt-3 text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          dbt-wizard can author SQL all day. What turns its output from a string of characters into a
          production asset is everything underneath it — the medallion, the open table format, the
          customer-owned lake, the engine that materializes against it.
        </p>
      </header>

      <section className="space-y-4 mb-10">
        {ARGS.map(a => (
          <div key={a.title} className="panel p-5">
            <div className="chip chip-system mb-3">{a.tag}</div>
            <h3 className="font-display text-xl mb-2" style={{ color: 'var(--text)' }}>{a.title}</h3>
            <p className="leading-relaxed" style={{ color: 'var(--text-muted)' }}>{a.body}</p>
          </div>
        ))}
      </section>

      <section className="panel-deep p-6 mb-10">
        <div className="eyebrow mb-3">The three pillars</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PILLARS.map(p => (
            <div key={p.title} className="panel p-4">
              <div className="font-display text-2xl mb-1" style={{ color: p.color }}>{p.n}</div>
              <div className="font-semibold mb-1" style={{ color: 'var(--text)' }}>{p.title}</div>
              <div className="text-sm" style={{ color: 'var(--text-muted)' }}>{p.body}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-6 mb-10" style={{ borderLeft: '5px solid var(--system)', background: 'var(--paper-deep)' }}>
        <div className="eyebrow mb-2" style={{ color: 'var(--system)' }}>The loop</div>
        <p className="text-lg leading-relaxed mb-4" style={{ color: 'var(--text)' }}>
          The new gold table is queryable by Snowflake's Cortex agents the moment it materializes — because
          both dbt-wizard and Cortex point at the same Iceberg lake. No publishing step. No notification
          email. No second copy. Open standards are what make build-time AI and run-time AI complementary
          instead of competing.
        </p>
        <p className="text-lg leading-relaxed" style={{ color: 'var(--text)' }}>
          When the Crisis Room runs its next pass, the Demand-Sensing agent will resolve <em>gold.phantom_oos_by_cluster</em>
          in its semantic layer. It does not know — and does not care — that the table did not exist an hour ago.
          That is what the open lake buys you.
        </p>
      </section>

      <section className="panel p-6" style={{ borderLeft: '4px solid var(--system)' }}>
        <div className="eyebrow mb-2" style={{ color: 'var(--system)' }}>The ODI Story</div>
        <p className="leading-relaxed text-lg" style={{ color: 'var(--text)' }}>
          MDS was optimized for human analysts working from a backlog. ODI is designed for sub-agents
          authoring models in parallel and run-time agents reading them seconds later. The same bytes.
          The same governance. Different consumers. The same lake.
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
    </div>
  );
}

const ARGS = [
  {
    tag: 'Build-time AI',
    title: 'dbt-wizard needs a project that runs.',
    body: 'The Worker sub-agent does not write SQL into a void. It writes a model into the medallion, refs upstream models that exist, and materializes via the same adapter every other model uses. Without the dbt project, there is no ref(). Without ref(), there is no governed lineage.',
  },
  {
    tag: 'Open table format',
    title: 'Iceberg is what makes the asset survive vendor choice.',
    body: 'The new gold table is Parquet under the Iceberg spec on customer-owned S3. Any compliant engine can read it. Snowflake reads it today. Trino can read it tomorrow. DuckDB can read it for analytics. The build-time tool is not coupled to the run-time engine.',
  },
  {
    tag: 'Run-time pickup',
    title: 'Cortex sees the new table the same minute it materializes.',
    body: 'Because Cortex agents read Iceberg directly via the Open Catalog, the new gold table is queryable the moment dbt-wizard finishes the dbt_run. No publish step. No catalog refresh ticket. The Crisis Room\'s next pass uses the new asset without anyone telling it to.',
  },
  {
    tag: 'Governance',
    title: 'AI-authored does not mean ungoverned.',
    body: 'Every model dbt-wizard ships gets a schema contract, column tests, declared upstreams, an owner, and an ai_built tag. The CDO can audit every AI-authored model in one query. The CFO can trace every number in S&OP back to a tested asset. Provenance is not optional.',
  },
];

const PILLARS = [
  { n: '01', title: 'Customer-owned storage',  body: 'Cardinal owns the bucket. dbt-wizard writes through dbt. Cardinal reads with any engine.', color: 'var(--system)' },
  { n: '02', title: 'Open table format',        body: 'Apache Iceberg v2. ACID, time-travel, schema evolution. The asset survives the tool that built it.', color: 'var(--alert)' },
  { n: '03', title: 'Build + run on one lake',  body: 'dbt-wizard authors. Cortex consumes. Same Iceberg. Same medallion. Same governance.', color: 'var(--resolved)' },
];
