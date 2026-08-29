import { Card, InfoRow, MapPlaceholder, ResponderTimeline, StatusBadge, ConfirmationModal, PrimaryButton, SectionLabel, SCREEN } from '../components/ui';
import type { SosState } from '../types';

const TIMELINE_STEPS = {
  active: [
    { label: 'SOS Activated', sublabel: 'Alert sent', done: true },
    { label: 'Responder Notified', sublabel: 'Awaiting acknowledgement', done: false, active: true },
    { label: 'Acknowledged', sublabel: 'Waiting', done: false },
    { label: 'Assistance', sublabel: 'Pending', done: false },
    { label: 'Resolved', sublabel: 'Not started', done: false },
  ],
  ack: [
    { label: 'SOS Activated', sublabel: 'Alert sent', done: true },
    { label: 'Responder Notified', sublabel: 'Responder notified', done: true },
    { label: 'Acknowledged', sublabel: 'Responder acknowledged', done: true },
    { label: 'Assistance', sublabel: 'In progress', done: false, active: true },
    { label: 'Resolved', sublabel: 'Not started', done: false },
  ],
  assistance: [
    { label: 'SOS Activated', sublabel: 'Alert sent', done: true },
    { label: 'Responder Notified', sublabel: 'Responder notified', done: true },
    { label: 'Acknowledged', sublabel: 'Responder acknowledged', done: true },
    { label: 'Assistance', sublabel: 'Assistance in progress', done: true },
    { label: 'Resolved', sublabel: 'Pending', done: false, active: true },
  ],
};

interface SOSActiveScreenProps {
  sosState: SosState;
  showCancelModal: boolean;
  onCancelRequest: () => void;
  onCancelConfirm: () => void;
  onCancelDismiss: () => void;
  onAcknowledge?: () => void;
  onAssistance?: () => void;
  onResolve?: () => void;
}

export default function SOSActiveScreen({
  sosState, showCancelModal,
  onCancelRequest, onCancelConfirm, onCancelDismiss,
  onAcknowledge, onAssistance, onResolve,
}: SOSActiveScreenProps) {
  const steps = TIMELINE_STEPS[sosState as 'active' | 'ack' | 'assistance'] ?? TIMELINE_STEPS.active;

  const stateLabel =
    sosState === 'ack' ? 'ACKNOWLEDGED'
    : sosState === 'assistance' ? 'ASSISTANCE IN PROGRESS'
    : 'SOS ACTIVE';

  return (
    <div className={SCREEN} style={{ background: '#f5f5f7' }}>

      {/* Emergency header */}
      <div className="flex-shrink-0" style={{ background: '#DC2626', padding: '20px 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase' as const }}>
            {stateLabel}
          </span>
          <StatusBadge variant="active" label="LIVE" />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, lineHeight: 1.14, letterSpacing: '0.196px', color: '#ffffff' }}>
          Your safety alert has been sent to authorized responders.
        </h1>
        <p className="type-caption mt-[8px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
          Started 10:32 AM
        </p>
      </div>

      <div style={{ padding: '24px 24px 0' }}>

        {/* Status tiles — 3 columns */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 17 }}>
          {[
            { label: 'ALERT', value: 'Sent', color: '#DC2626' },
            { label: 'LOCATION', value: 'Sharing', color: '#0066cc' },
            {
              label: 'STATUS',
              value: sosState === 'ack' ? 'Acknowledged' : sosState === 'assistance' ? 'In Progress' : 'Waiting',
              color: sosState === 'assistance' ? '#16A34A' : sosState === 'ack' ? '#0066cc' : '#D97706',
            },
          ].map(item => (
            <div
              key={item.label}
              className="bg-canvas border border-hairline text-center"
              style={{ borderRadius: 11, padding: '12px 8px' }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: '#7a7a7a', textTransform: 'uppercase' as const, marginBottom: 4 }}>
                {item.label}
              </p>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: 600, letterSpacing: '-0.224px', color: item.color }}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Desktop: map + timeline side by side */}
        <div className="grid grid-cols-1 min-[834px]:grid-cols-2 gap-[17px] mb-[17px]">

          {/* Location card */}
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <SectionLabel>Your Location</SectionLabel>
              <StatusBadge variant="active" label="Active" />
            </div>
            <MapPlaceholder active />
            <div style={{ marginTop: 12 }}>
              <InfoRow label="Last updated" value="Just now" />
              <InfoRow label="Location sharing" value="Active during SOS" accent />
            </div>
          </Card>

          {/* Responder timeline */}
          <Card>
            <SectionLabel>Responder Status</SectionLabel>
            <ResponderTimeline steps={steps} />
          </Card>

        </div>

        {/* Demo state advancers */}
        <div style={{ background: '#f5f5f7', border: '1px solid #e0e0e0', borderRadius: 11, padding: '12px 16px', marginBottom: 17 }}>
          <p className="type-caption text-ink-48 mb-[8px]">Preview — advance responder state:</p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
            {sosState === 'active' && onAcknowledge && (
              <button onClick={onAcknowledge} className="type-caption transition-opacity active:opacity-60" style={{ background: '#0066cc', color: '#ffffff', border: 'none', borderRadius: 9999, padding: '6px 14px', cursor: 'pointer' }}>
                → Acknowledged
              </button>
            )}
            {sosState === 'ack' && onAssistance && (
              <button onClick={onAssistance} className="type-caption transition-opacity active:opacity-60" style={{ background: '#0066cc', color: '#ffffff', border: 'none', borderRadius: 9999, padding: '6px 14px', cursor: 'pointer' }}>
                → Assistance In Progress
              </button>
            )}
            {sosState === 'assistance' && onResolve && (
              <button onClick={onResolve} className="type-caption transition-opacity active:opacity-60" style={{ background: '#16A34A', color: '#ffffff', border: 'none', borderRadius: 9999, padding: '6px 14px', cursor: 'pointer' }}>
                → Mark Resolved
              </button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
          <PrimaryButton fullWidth onClick={() => {}}>Update Location</PrimaryButton>
          <PrimaryButton fullWidth ghost destructive onClick={onCancelRequest}>Cancel SOS</PrimaryButton>
        </div>

      </div>

      {showCancelModal && (
        <ConfirmationModal
          title="Cancel SOS?"
          body="This will notify authorized responders that the emergency alert has been cancelled. Only cancel if the situation is no longer an emergency."
          cancelLabel="Keep SOS Active"
          confirmLabel="Cancel SOS"
          confirmDestructive
          onCancel={onCancelDismiss}
          onConfirm={onCancelConfirm}
        />
      )}
    </div>
  );
}
