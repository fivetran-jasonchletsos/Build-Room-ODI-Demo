import { useEffect, useState } from 'react';
import { dataUrl } from '../types';
import type { Agent } from '../types';
import AgentAvatar from '../components/AgentAvatar';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    fetch(dataUrl('agents.json')).then(r => r.json()).then(d => setAgents(d.agents));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-10">
        <div className="eyebrow mb-1">Cardinal Provisions · dbt-wizard Sub-Agents</div>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight" style={{ color: 'var(--text)' }}>
          Meet the four sub-agents.
        </h1>
        <p className="mt-3 max-w-3xl leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Each sub-agent owns a slice of the dbt-wizard tool surface. They run the same tools a senior
          analytics engineer runs — status, search, describe, lineage, warehouse, dbt_show, file edits,
          model generation. Together they take a stakeholder question and produce a materialized,
          tested, lineage-tracked dbt model.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map(a => (
          <article key={a.id} className="panel p-6 relative overflow-hidden" style={{ borderLeft: `5px solid ${a.color}` }}>
            <div className="flex items-start gap-4 mb-4">
              <AgentAvatar agent={a} active size={48} />
              <div className="min-w-0">
                <div className="font-mono text-xs" style={{ color: a.color }}>{a.code}</div>
                <h2 className="font-display text-2xl" style={{ color: 'var(--text)' }}>{a.name}</h2>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{a.role}</p>
              </div>
            </div>

            <div className="mb-4">
              <div className="eyebrow mb-2">dbt-wizard tools</div>
              <div className="flex flex-wrap gap-1.5">
                {a.tools.map(t => (
                  <span key={t} className="font-mono text-[11px] px-2 py-1 rounded" style={{ background: 'var(--paper-deep)', color: a.color, border: '1px solid var(--line)' }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="eyebrow mb-2">Responsibilities</div>
              <ul className="space-y-1.5 text-sm">
                {a.responsibilities.map(r => (
                  <li key={r} className="flex gap-2" style={{ color: 'var(--text)' }}>
                    <span style={{ color: a.color }}>▸</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="eyebrow mb-2">Sample input</div>
              <div className="panel-deep p-3 font-mono text-xs leading-relaxed italic" style={{ color: 'var(--text)' }}>
                "{a.sample_input}"
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-10 panel p-6" style={{ borderLeft: '4px solid var(--system)', background: 'var(--paper-deep)' }}>
        <div className="eyebrow mb-2" style={{ color: 'var(--system)' }}>The handoff pattern</div>
        <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>
          Explorer hands the candidate models to Summary. Summary hands the validated grain to Worker.
          Worker hands the authored SQL and materialization handle to Verification. Verification confirms
          the contract and lineage. The CSCO gets a queryable asset, not a SQL string.
        </p>
      </section>
    </div>
  );
}
