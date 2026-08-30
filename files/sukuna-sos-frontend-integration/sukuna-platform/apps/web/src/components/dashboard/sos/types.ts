/**
 * SOS & Safety — shared types.
 *
 * `SosState` intentionally separates "acknowledged" / "assistance" from a
 * plain boolean so the UI can show real responder-side progress once a
 * backend exists. Today, only `idle -> holding -> countdown -> active` and
 * `active -> resolved` (via cancel) are reachable from the client — a
 * student cannot self-report "acknowledged" or "assistance in progress";
 * those transitions must come from a responder/backend integration.
 */
export type SosState =
  | 'idle'
  | 'holding'
  | 'countdown'
  | 'active'
  | 'ack'
  | 'assistance'
  | 'resolved';

export type SosEventStatus = 'resolved' | 'cancelled' | 'active';

export interface SosEvent {
  id: string;
  date: string;
  time: string;
  status: SosEventStatus;
  duration?: string;
  resolvedTime?: string;
}

export interface ResponderTimelineStep {
  label: string;
  sublabel?: string;
  done: boolean;
  active?: boolean;
}
