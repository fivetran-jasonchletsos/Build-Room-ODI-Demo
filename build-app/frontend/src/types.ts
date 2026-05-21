export type AgentId = 'explorer' | 'summary' | 'worker' | 'verification' | 'system';

export interface Agent {
  id: Exclude<AgentId, 'system'>;
  name: string;
  code: string;
  color: string;
  role: string;
  tools: string[];
  sample_input: string;
  responsibilities: string[];
}

export type CodeTarget = 'sql' | 'yaml';

export interface BuildEvent {
  from: AgentId;
  step: number;
  step_label: string;
  body: string;
  side_effect?: string;
  code_target?: CodeTarget;
  code_append?: string;
}

export interface ScenarioUpstream {
  model: string;
  layer: string;
  grain: string;
  description: string;
}

export interface Scenario {
  company: string;
  request_id: string;
  requested_by: string;
  requested_at: string;
  timezone_label: string;
  question: string;
  metric_label: string;
  metric_code: string;
  sop_meeting_at: string;
  sop_meeting_label: string;
  target_schema: string;
  target_model: string;
  target_grain: string;
  prior_crisis_id: string;
  retailer: string;
  dma: string;
  upstream_models: ScenarioUpstream[];
  manual_time_days: string;
  build_room_seconds: number;
}

export interface OutcomeMetric { label: string; value: string }
export interface OutcomeColumn {
  label: string;
  summary: string;
  metrics: OutcomeMetric[];
  narrative: string[];
}
export interface LineageNode { id: string; name: string; layer: string; built: boolean; new?: boolean }
export interface LineageEdge { from: string; to: string }
export interface Outcome {
  before: { nodes: LineageNode[]; edges: LineageEdge[] };
  after: { nodes: LineageNode[]; edges: LineageEdge[] };
  without_wizard: OutcomeColumn;
  with_wizard: OutcomeColumn;
  governance: { label: string; value: string }[];
  hero: { label: string; value: string; note: string };
}

export function dataUrl(path: string): string {
  const base = (import.meta as unknown as { env: { BASE_URL: string } }).env.BASE_URL || '/';
  return `${base.replace(/\/$/, '')}/data/${path}`;
}
