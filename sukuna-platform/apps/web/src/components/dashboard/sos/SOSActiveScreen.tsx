"use client";

import { Card, InfoRow, MapPlaceholder, ResponderTimeline, StatusBadge, ConfirmationModal, PrimaryButton, SectionLabel, SOS_SCREEN } from './ui';
import { useSosSession } from './SosSessionContext';
import { formatClockTime } from './utils';
import type { ResponderTimelineStep } from './types';

const TIMELINE_STEPS: Record<'active' | 'ack' | 'assistance', ResponderTimelineStep[]> = {
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

export default function SOSActiveScreen() {
  const {
    sosState, showCancelModal, startedAt, locationUpdatedAt,
    requestCancel, confirmCancel, dismissCancel, refreshLocationUpdatedAt,
  } = useSosSession();

  const steps = TIMELINE_STEPS[sosState as 'active' | 'ack' | 'assistance'] ?? TIMELINE_STEPS.active;

  const stateLabel =
    sosState === 'ack' ? 'ACKNOWLEDGED'
    : sosState === 'assistance' ? 'ASSISTANCE IN PROGRESS'
    : 'SOS ACTIVE';

  return (
    <div className={SOS_SCREEN} style={{ background: '#f5f5f7' }}>

      {/* Emergency header */}
      <div className="flex-shrink-0" style={{ background: '#DC2626', padding: '20px 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-text)', fontSize: 11, fontWeight: 600, letterSpacing: '0.14em', color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase' as const }}>
            {stateLabel}
          </span>
          <StatusBadge variant="active" label="LIVE" />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 600, lineHeight: 1.14, letterSpacing: '0.196px', color: '#ffffff' }}>
          Your safety alert has been sent to authorized responders.
        </h1>
        <p className="type-caption mt-[8px]" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {startedAt ? `Started ${formatClockTime(startedAt)}` : 'Starting…'}
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
          ].map((item) => (
            <div
              key={item.label}
              className="bg-canvas border border-hairline text-center"
              style={{ borderRadius: 11, padding: '12px 8px' }}
            >
              <p style={{ fontFamily: 'var(--font-text)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', color: '#7a7a7a', textTransform: 'uppercase' as const, marginBottom: 4 }}>
                {item.label}
              </p>
              <p style={{ fontFamily: 'var(--font-text)', fontSize: 14, fontWeight: 600, letterSpacing: '-0.224px', color: item.color }}>
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
              <InfoRow label="Last updated" value={locationUpdatedAt ? formatClockTime(locationUpdatedAt) : '—'} />
              <InfoRow label="Location sharing" value="Active during SOS" accent />
            </div>
          </Card>

          {/* Responder timeline */}
          <Card>
            <SectionLabel>Responder Status</SectionLabel>
            <ResponderTimeline steps={steps} />
          </Card>

        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 24 }}>
          <PrimaryButton fullWidth onClick={refreshLocationUpdatedAt}>Update Location</PrimaryButton>
          <PrimaryButton fullWidth ghost destructive onClick={requestCancel}>Cancel SOS</PrimaryButton>
        </div>

      </div>

      {showCancelModal && (
        <ConfirmationModal
          title="Cancel SOS?"
          body="This will notify authorized responders that the emergency alert has been cancelled. Only cancel if the situation is no longer an emergency."
          cancelLabel="Keep SOS Active"
          confirmLabel="Cancel SOS"
          confirmDestructive
          onCancel={dismissCancel}
          onConfirm={confirmCancel}
        />
      )}
    </div>
  );
}
