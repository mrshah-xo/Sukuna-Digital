export type SosState = 'idle' | 'holding' | 'countdown' | 'active' | 'ack' | 'assistance' | 'resolved';
export type ActiveTab = 'sos' | 'history' | 'safety' | 'location';

export interface SOSEvent {
  id: string;
  date: string;
  time: string;
  status: 'resolved' | 'cancelled' | 'active';
  duration?: string;
  resolvedTime?: string;
}
