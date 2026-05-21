import type { Agent, AgentId } from '../types';

interface Props {
  agent?: Agent;
  systemColor?: string;
  active?: boolean;
  size?: number;
  from?: AgentId;
}

export default function AgentAvatar({ agent, systemColor = '#0073EA', active = false, size = 40, from }: Props) {
  const color = agent?.color ?? systemColor;
  const code = agent?.code ?? (from === 'system' ? 'SYS' : '??');
  return (
    <span
      className={`agent-avatar ${active ? 'active' : ''}`}
      style={{
        color,
        height: size,
        width: size,
        fontSize: Math.max(10, size * 0.32),
      }}
      title={agent?.name ?? 'System'}
    >
      {code}
    </span>
  );
}
