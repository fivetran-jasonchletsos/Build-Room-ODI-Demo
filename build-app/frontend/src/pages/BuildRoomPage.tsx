import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dataUrl } from '../types';
import type { Agent, AgentId, BuildEvent, Scenario } from '../types';
import AgentAvatar from '../components/AgentAvatar';

// Timing constants. The "code" channel types fast; the narration types at a
// readable cadence. Both scale by the speed control.
const NARR_TYPE_MS = 12;           // ms per char of narration
const CODE_TYPE_MS = 4;            // ms per char of SQL/YAML
const POST_NARR_DELAY_MS = 550;    // gap after narration finishes (before code starts or next event)
const POST_CODE_DELAY_MS = 350;    // gap after a code chunk finishes typing
const SPEEDS = [1, 2, 4] as const;

interface RevealState {
  // index into events array
  cursor: number;
  // chars typed of current event's narration
  narrTyped: number;
  // chars typed of current event's code_append (if any)
  codeTyped: number;
  // accumulated full SQL string (only the parts already revealed)
  sqlSoFar: string;
  // accumulated full YAML string (only the parts already revealed)
  yamlSoFar: string;
  // ordered side effects revealed so far (most-recent first when rendered)
  sideEffects: string[];
}

const INITIAL: RevealState = {
  cursor: 0,
  narrTyped: 0,
  codeTyped: 0,
  sqlSoFar: '',
  yamlSoFar: '',
  sideEffects: [],
};

export default function BuildRoomPage() {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [events, setEvents] = useState<BuildEvent[]>([]);
  const [state, setState] = useState<RevealState>(INITIAL);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState<typeof SPEEDS[number]>(1);
  const [complete, setComplete] = useState(false);

  const narrBottomRef = useRef<HTMLDivElement | null>(null);
  const codeBottomRef = useRef<HTMLDivElement | null>(null);
  const yamlBottomRef = useRef<HTMLDivElement | null>(null);

  // Load data
  useEffect(() => {
    Promise.all([
      fetch(dataUrl('agents.json')).then(r => r.json()),
      fetch(dataUrl('scenario.json')).then(r => r.json()),
      fetch(dataUrl('build_script.json')).then(r => r.json()),
    ]).then(([a, s, b]) => {
      setAgents(a.agents);
      setScenario(s);
      setEvents(b.events);
    });
  }, []);

  const agentById = useMemo(() => {
    const m: Record<string, Agent> = {};
    for (const a of agents) m[a.id] = a;
    return m;
  }, [agents]);

  const currentEvent: BuildEvent | undefined = events[state.cursor];
  const totalSteps = useMemo(() => {
    if (events.length === 0) return 6;
    return Math.max(...events.map(e => e.step));
  }, [events]);

  // Phase machine: type narration → (optional) type code → next event.
  useEffect(() => {
    if (!playing || !currentEvent) {
      if (events.length > 0 && state.cursor >= events.length && !complete) {
        setComplete(true);
      }
      return;
    }
    // Phase 1: type narration
    if (state.narrTyped < currentEvent.body.length) {
      const id = setTimeout(() => {
        setState(s => ({ ...s, narrTyped: s.narrTyped + 1 }));
      }, Math.max(2, Math.floor(NARR_TYPE_MS / speed)));
      return () => clearTimeout(id);
    }
    // Phase 2: type code if any
    const code = currentEvent.code_append ?? '';
    if (code.length > 0 && state.codeTyped < code.length) {
      const id = setTimeout(() => {
        setState(s => {
          const nextTyped = s.codeTyped + 1;
          const charsToAdd = code.slice(s.codeTyped, nextTyped);
          if (currentEvent.code_target === 'yaml') {
            return { ...s, codeTyped: nextTyped, yamlSoFar: s.yamlSoFar + charsToAdd };
          }
          return { ...s, codeTyped: nextTyped, sqlSoFar: s.sqlSoFar + charsToAdd };
        });
      }, Math.max(1, Math.floor(CODE_TYPE_MS / speed)));
      return () => clearTimeout(id);
    }
    // Phase 3: commit side effect + advance
    const postDelay = code.length > 0 ? POST_CODE_DELAY_MS : POST_NARR_DELAY_MS;
    const id = setTimeout(() => {
      setState(s => {
        const next: RevealState = {
          ...s,
          cursor: s.cursor + 1,
          narrTyped: 0,
          codeTyped: 0,
        };
        if (currentEvent.side_effect) {
          next.sideEffects = [currentEvent.side_effect, ...s.sideEffects].slice(0, 8);
        }
        return next;
      });
    }, Math.max(80, Math.floor(postDelay / speed)));
    return () => clearTimeout(id);
  }, [playing, speed, currentEvent, state.narrTyped, state.codeTyped, state.cursor, events.length, complete]);

  // Autoscroll
  useEffect(() => {
    narrBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [state.cursor, state.narrTyped]);
  useEffect(() => {
    codeBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [state.sqlSoFar]);
  useEffect(() => {
    yamlBottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [state.yamlSoFar]);

  const reset = () => {
    setState(INITIAL);
    setComplete(false);
    setPlaying(true);
  };

  const cycleSpeed = () => {
    const i = SPEEDS.indexOf(speed);
    setSpeed(SPEEDS[(i + 1) % SPEEDS.length]);
  };

  if (!scenario || agents.length === 0 || events.length === 0) {
    return <div className="mx-auto max-w-7xl px-4 py-12 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>Spawning build room…</div>;
  }

  const currentStep = currentEvent?.step ?? totalSteps;
  const currentStepLabel = currentEvent?.step_label ?? 'Materialization';
  const activeAgentId: AgentId | undefined = currentEvent && state.narrTyped < currentEvent.body.length ? currentEvent.from : undefined;

  // Build the visible narration list (current event being typed, all prior shown in full)
  const visibleNarr = events.slice(0, Math.min(state.cursor + 1, events.length)).map((e, idx) => {
    const isCurrent = idx === state.cursor;
    const body = isCurrent ? e.body.slice(0, state.narrTyped) : e.body;
    return { e, body, isCurrent };
  });

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-6 sm:px-6 lg:px-8">
      {/* Control bar */}
      <div className="panel p-3 mb-4 flex flex-wrap items-center justify-between gap-3 sticky top-16 z-20" style={{ borderLeft: '4px solid var(--system)' }}>
        <div className="flex items-center gap-3 flex-wrap">
          <span className="chip chip-system">
            <span className="pulse-dot" style={{ background: 'var(--system)' }} />
            Build Active
          </span>
          <span className="eyebrow">{scenario.request_id}</span>
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
            Step <span style={{ color: 'var(--system)', fontWeight: 700 }}>{currentStep}/{totalSteps}</span>
            <span className="mx-2" style={{ color: 'var(--text-dim)' }}>·</span>
            <span style={{ color: 'var(--text)' }}>{currentStepLabel}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn" onClick={() => setPlaying(p => !p)} disabled={complete}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button className="btn" onClick={cycleSpeed}>{speed}x</button>
          <button className="btn" onClick={reset}>Restart</button>
          <Link to="/scenario" className="btn">Back</Link>
        </div>
      </div>

      {/* Step rail */}
      <div className="panel p-3 mb-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
          {STEP_DEFS.map((s, idx) => {
            const num = idx + 1;
            const done = currentStep > num || (currentStep === num && complete);
            const active = currentStep === num && !complete;
            return (
              <div key={s.label} className="panel p-2.5 relative" style={{
                borderLeft: `3px solid ${active ? 'var(--system)' : done ? 'var(--resolved)' : 'var(--line)'}`,
                background: active ? 'rgba(59,158,255,0.08)' : done ? 'rgba(34,197,94,0.06)' : 'var(--surface-1)'
              }}>
                <div className="font-mono text-[10px]" style={{ color: active ? 'var(--system)' : done ? 'var(--resolved)' : 'var(--text-soft)' }}>
                  STEP {String(num).padStart(2, '0')} · {done ? 'DONE' : active ? 'NOW' : 'WAITING'}
                </div>
                <div className="font-semibold text-sm mt-0.5" style={{ color: 'var(--text)' }}>{s.label}</div>
                <div className="font-mono text-[10px]" style={{ color: 'var(--text-muted)' }}>{s.who} · {s.tools}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* LEFT: Sub-agent narration */}
        <section className="lg:col-span-5 panel" style={{ minHeight: 600 }}>
          <header className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
            <div>
              <div className="eyebrow">Sub-agent narration</div>
              <div className="font-mono text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {scenario.company} · dbt-wizard live build
              </div>
            </div>
            <div className="flex items-center gap-2">
              {agents.map(a => (
                <span key={a.id} style={{ color: a.color }} className="relative">
                  <AgentAvatar agent={a} active={activeAgentId === a.id} size={32} />
                </span>
              ))}
            </div>
          </header>

          <div className="px-5 py-4 max-h-[68vh] overflow-y-auto" style={{ background: 'var(--surface-0)' }}>
            {visibleNarr.map((m, idx) => {
              const a = agentById[m.e.from];
              const color = a?.color ?? '#0073EA';
              return (
                <div key={idx} className="chat-row flex gap-3" style={{ borderLeft: `3px solid ${color}`, paddingLeft: 12, background: 'var(--surface-1)', borderTopRightRadius: 4, borderBottomRightRadius: 4, marginBottom: 8, borderTop: '1px solid var(--line-soft)', borderRight: '1px solid var(--line-soft)', borderBottom: '1px solid var(--line-soft)' }}>
                  <div style={{ color }} className="pt-3 pl-1">
                    <AgentAvatar agent={a} active={m.isCurrent && playing} size={36} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="font-mono text-xs font-semibold" style={{ color }}>
                        {a?.name ?? m.e.from}
                      </span>
                      <span className="chip chip-system" style={{ fontSize: 9, padding: '2px 6px' }}>STEP {m.e.step}</span>
                      <span className="font-mono text-[10px]" style={{ color: 'var(--text-dim)' }}>{m.e.step_label}</span>
                    </div>
                    <div className={`chat-bubble ${m.isCurrent && state.narrTyped < m.e.body.length ? 'chat-cursor' : ''}`} style={{ color: 'var(--text)' }}>
                      {m.body}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={narrBottomRef} />
          </div>
        </section>

        {/* RIGHT: Live code panel */}
        <section className="lg:col-span-7 space-y-4">
          {/* SQL panel */}
          <div className="panel">
            <header className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-3">
                <div className="eyebrow">models/gold/phantom_oos_by_cluster.sql</div>
                <span className="chip" style={{ color: '#be185d', background: 'rgba(190,24,93,0.08)', borderColor: '#be185d' }}>
                  Worker authoring
                </span>
              </div>
              <span className="font-mono text-[11px]" style={{ color: 'var(--text-soft)' }}>{state.sqlSoFar.length.toLocaleString()} chars</span>
            </header>
            <pre
              className="code-panel m-0 p-5 overflow-x-auto overflow-y-auto"
              style={{ minHeight: 360, maxHeight: '50vh' }}
            >
              {state.sqlSoFar.length === 0 ? (
                <span style={{ color: 'var(--text-soft)' }}>{'-- waiting for Worker to begin authoring...'}</span>
              ) : (
                <SyntaxSql text={state.sqlSoFar} cursor={currentEvent?.code_target === 'sql' && state.codeTyped > 0 && state.codeTyped < (currentEvent.code_append?.length ?? 0)} />
              )}
              <div ref={codeBottomRef} />
            </pre>
          </div>

          {/* YAML panel */}
          <div className="panel">
            <header className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--line)' }}>
              <div className="flex items-center gap-3">
                <div className="eyebrow">models/gold/phantom_oos_by_cluster.yml</div>
                <span className="chip" style={{ color: '#15803d', background: 'rgba(21,128,61,0.08)', borderColor: '#15803d' }}>
                  Verification authoring
                </span>
              </div>
              <span className="font-mono text-[11px]" style={{ color: 'var(--text-soft)' }}>{state.yamlSoFar.length.toLocaleString()} chars</span>
            </header>
            <pre
              className="code-panel m-0 p-5 overflow-x-auto overflow-y-auto"
              style={{ minHeight: 200, maxHeight: '40vh' }}
            >
              {state.yamlSoFar.length === 0 ? (
                <span style={{ color: 'var(--text-soft)' }}>{'# waiting for Verification (step 5)...'}</span>
              ) : (
                <SyntaxYaml text={state.yamlSoFar} cursor={currentEvent?.code_target === 'yaml' && state.codeTyped > 0 && state.codeTyped < (currentEvent.code_append?.length ?? 0)} />
              )}
              <div ref={yamlBottomRef} />
            </pre>
          </div>

          {/* Tool side effects ticker */}
          <div className="panel p-4">
            <div className="eyebrow mb-2">dbt-wizard tool calls · live</div>
            {state.sideEffects.length === 0 ? (
              <div className="font-mono text-xs" style={{ color: 'var(--text-soft)' }}>Awaiting first tool call…</div>
            ) : (
              <ul className="space-y-1.5">
                {state.sideEffects.map((s, i) => (
                  <li key={`${s}-${i}`} className="flex items-start gap-2 font-mono text-[11px]" style={{ color: 'var(--text)' }}>
                    <span className="pulse-dot mt-1" style={{ background: i === 0 ? 'var(--system)' : 'var(--text-dim)' }} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>

      {/* Build complete badge */}
      {complete && (
        <div className="mt-6 panel p-6 relative overflow-hidden" style={{ borderLeft: '5px solid var(--resolved)', background: 'rgba(34,197,94,0.06)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center">
            <div className="lg:col-span-1">
              <div className="chip chip-resolved mb-2">Build Complete</div>
              <div className="font-display text-3xl" style={{ color: 'var(--resolved)' }}>87.4s</div>
              <div className="font-mono text-xs mt-1" style={{ color: 'var(--text-muted)' }}>question → materialized</div>
            </div>
            <div className="lg:col-span-2">
              <div className="eyebrow mb-1">New asset</div>
              <div className="font-mono text-base font-semibold" style={{ color: 'var(--text)' }}>gold.phantom_oos_by_cluster</div>
              <div className="font-mono text-xs mt-1" style={{ color: 'var(--text-muted)' }}>
                18 rows · 6 column tests · 1 combination test · schema contract enforced · lineage updated
              </div>
            </div>
            <div className="lg:col-span-1 flex justify-start lg:justify-end">
              <button onClick={() => navigate('/outcome')} className="btn btn-resolved text-base px-6 py-3">
                View in lineage
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const STEP_DEFS = [
  { label: 'Discovery',            who: 'Explorer',     tools: 'status, search' },
  { label: 'Schema Understanding', who: 'Summary',      tools: 'describe, lineage' },
  { label: 'Data Inspection',      who: 'Worker',       tools: 'warehouse, dbt_show' },
  { label: 'Model Creation',       who: 'Worker',       tools: 'file edits, model gen' },
  { label: 'Test Authoring',       who: 'Verification', tools: 'describe, dbt_show' },
  { label: 'Materialization',      who: 'Worker + Ver', tools: 'dbt_run, lineage' },
];

/* ---------------- Syntax highlighting (light, regex-based) ---------------- */

const SQL_KEYWORDS = new Set([
  'with', 'as', 'select', 'from', 'where', 'and', 'or', 'on', 'left', 'right',
  'inner', 'outer', 'join', 'group', 'by', 'order', 'desc', 'asc', 'when', 'then',
  'else', 'end', 'case', 'true', 'false', 'null', 'distinct', 'nullif', 'count',
  'sum', 'max', 'min', 'avg', 'dateadd', 'current_date', 'is', 'not'
]);

function SyntaxSql({ text, cursor }: { text: string; cursor: boolean }) {
  // Tokenize line-by-line so comments work cleanly.
  const lines = text.split('\n');
  const out: React.ReactNode[] = [];
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    out.push(<span key={`L${li}`}>{tokenizeSqlLine(line)}{li < lines.length - 1 && '\n'}</span>);
  }
  return (
    <>
      {out}
      {cursor && <span className="code-cursor" />}
    </>
  );
}

function tokenizeSqlLine(line: string): React.ReactNode[] {
  const trimmed = line.trimStart();
  if (trimmed.startsWith('--')) {
    return [<span key="c" className="tok-com">{line}</span>];
  }
  // Match jinja {{ ... }} blocks first.
  const parts: React.ReactNode[] = [];
  const re = /(\{\{[^}]*\}\})|('[^']*')|(\b\d+(?:\.\d+)?\b)|(\b[a-zA-Z_][a-zA-Z0-9_]*\b)|(\s+)|([^\s'\w{]+)/g;
  let m: RegExpExecArray | null;
  let idx = 0;
  let key = 0;
  while ((m = re.exec(line)) !== null) {
    if (m.index > idx) parts.push(line.slice(idx, m.index));
    if (m[1]) {
      parts.push(<span key={key++} className="tok-jinja">{m[1]}</span>);
    } else if (m[2]) {
      parts.push(<span key={key++} className="tok-str">{m[2]}</span>);
    } else if (m[3]) {
      parts.push(<span key={key++} className="tok-num">{m[3]}</span>);
    } else if (m[4]) {
      const word = m[4];
      if (SQL_KEYWORDS.has(word.toLowerCase())) {
        parts.push(<span key={key++} className="tok-kw">{word}</span>);
      } else {
        parts.push(word);
      }
    } else if (m[5]) {
      parts.push(m[5]);
    } else if (m[6]) {
      parts.push(m[6]);
    }
    idx = re.lastIndex;
  }
  if (idx < line.length) parts.push(line.slice(idx));
  return parts;
}

function SyntaxYaml({ text, cursor }: { text: string; cursor: boolean }) {
  const lines = text.split('\n');
  return (
    <>
      {lines.map((line, i) => {
        const isComment = line.trimStart().startsWith('#');
        if (isComment) return <span key={i} className="tok-com">{line}{i < lines.length - 1 && '\n'}</span>;
        // Color the key portion (before colon) blue.
        const colonIdx = line.indexOf(':');
        if (colonIdx > 0 && !line.trimStart().startsWith('-')) {
          const indent = line.slice(0, line.length - line.trimStart().length);
          const key = line.slice(indent.length, colonIdx);
          const rest = line.slice(colonIdx);
          return (
            <span key={i}>
              {indent}
              <span className="tok-kw">{key}</span>
              {rest}
              {i < lines.length - 1 && '\n'}
            </span>
          );
        }
        return <span key={i}>{line}{i < lines.length - 1 && '\n'}</span>;
      })}
      {cursor && <span className="code-cursor" />}
    </>
  );
}
