import type { SosEvent } from './types';

/**
 * TODO(backend): replace with a real fetch once an SOS API + Mongoose
 * model exist, e.g. `GET /api/sos/history` scoped to the current student
 * and school (see project report — intentionally not built in this pass).
 *
 * Returns an empty list today rather than mock events, so the UI's
 * existing "No SOS events recorded" empty state is what real users see
 * until a backend is wired up — not fabricated history.
 */
export function useSosHistory(): { events: SosEvent[]; isLoading: boolean } {
  return { events: [], isLoading: false };
}

export function useSosEvent(eventId: string): { event: SosEvent | null; isLoading: boolean } {
  const { events } = useSosHistory();
  return { event: events.find((e) => e.id === eventId) ?? null, isLoading: false };
}
