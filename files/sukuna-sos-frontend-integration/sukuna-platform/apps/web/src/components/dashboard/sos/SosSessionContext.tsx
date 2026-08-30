"use client";

import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import type { SosState } from './types';

const HOLD_DURATION_MS = 2500;

interface SosSessionValue {
  sosState: SosState;
  holdProgress: number;
  countdown: number;
  showCancelModal: boolean;
  startedAt: Date | null;
  resolvedAt: Date | null;
  /** Real timestamp for the "Last updated" label on the active-SOS location card. */
  locationUpdatedAt: Date | null;
  refreshLocationUpdatedAt: () => void;
  /** True while SOS is active/ack/assistance, or the student manually enabled sharing. */
  locationSharing: boolean;
  /** Manual toggle from the Location screen, independent of an active SOS. */
  manualLocationSharing: boolean;
  lastSafetyCheckAt: Date | null;

  startHold: () => void;
  cancelHold: () => void;
  cancelCountdown: () => void;
  requestCancel: () => void;
  dismissCancel: () => void;
  confirmCancel: () => void;
  backToSafetyFromResolved: () => void;
  toggleManualLocationSharing: () => void;
  markSafetyCheckSent: () => void;

  // Reserved for a future responder/backend integration (e.g. driven by a
  // websocket or polling effect). Not wired to any UI control today —
  // a student cannot self-report these states. See project report.
  acknowledge: () => void;
  markAssistance: () => void;
  resolve: () => void;
}

const SosSessionContext = createContext<SosSessionValue | null>(null);

export function SosSessionProvider({ children }: { children: React.ReactNode }) {
  const [sosState, setSosState] = useState<SosState>('idle');
  const [holdProgress, setHoldProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [resolvedAt, setResolvedAt] = useState<Date | null>(null);
  const [locationUpdatedAt, setLocationUpdatedAt] = useState<Date | null>(null);
  const [manualLocationSharing, setManualLocationSharing] = useState(false);
  const [lastSafetyCheckAt, setLastSafetyCheckAt] = useState<Date | null>(null);

  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number>(0);

  const startHold = useCallback(() => {
    if (sosState !== 'idle') return;
    holdStartRef.current = Date.now();
    setSosState('holding');
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(elapsed / HOLD_DURATION_MS, 1);
      setHoldProgress(progress);
      if (progress >= 1) {
        if (holdTimerRef.current) clearInterval(holdTimerRef.current);
        holdTimerRef.current = null;
        setHoldProgress(0);
        setSosState('countdown');
        setCountdown(3);
      }
    }, 16);
  }, [sosState]);

  const cancelHold = useCallback(() => {
    if (sosState !== 'holding') return;
    if (holdTimerRef.current) { clearInterval(holdTimerRef.current); holdTimerRef.current = null; }
    setHoldProgress(0);
    setSosState('idle');
  }, [sosState]);

  useEffect(() => {
    if (sosState !== 'countdown') return;
    if (countdown <= 0) {
      const now = new Date();
      setSosState('active');
      setStartedAt(now);
      setLocationUpdatedAt(now);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [sosState, countdown]);

  useEffect(() => () => {
    if (holdTimerRef.current) clearInterval(holdTimerRef.current);
  }, []);

  const cancelCountdown = useCallback(() => {
    setSosState('idle');
    setCountdown(3);
  }, []);

  const requestCancel = useCallback(() => setShowCancelModal(true), []);
  const dismissCancel = useCallback(() => setShowCancelModal(false), []);

  const confirmCancel = useCallback(() => {
    setSosState('idle');
    setShowCancelModal(false);
    setStartedAt(null);
    setLocationUpdatedAt(null);
  }, []);

  const backToSafetyFromResolved = useCallback(() => {
    setSosState('idle');
    setStartedAt(null);
    setResolvedAt(null);
    setLocationUpdatedAt(null);
  }, []);

  const toggleManualLocationSharing = useCallback(() => {
    setManualLocationSharing((v) => {
      const next = !v;
      if (next) setLocationUpdatedAt(new Date());
      return next;
    });
  }, []);

  const markSafetyCheckSent = useCallback(() => {
    setLastSafetyCheckAt(new Date());
  }, []);

  const refreshLocationUpdatedAt = useCallback(() => {
    setLocationUpdatedAt(new Date());
  }, []);

  const acknowledge = useCallback(() => setSosState('ack'), []);
  const markAssistance = useCallback(() => setSosState('assistance'), []);
  const resolve = useCallback(() => {
    setSosState('resolved');
    setShowCancelModal(false);
    setResolvedAt(new Date());
  }, []);

  const isSosActive = sosState === 'active' || sosState === 'ack' || sosState === 'assistance';

  const value = useMemo<SosSessionValue>(() => ({
    sosState, holdProgress, countdown, showCancelModal, startedAt, resolvedAt,
    locationUpdatedAt, refreshLocationUpdatedAt,
    locationSharing: isSosActive || manualLocationSharing,
    manualLocationSharing,
    lastSafetyCheckAt,
    startHold, cancelHold, cancelCountdown,
    requestCancel, dismissCancel, confirmCancel,
    backToSafetyFromResolved, toggleManualLocationSharing, markSafetyCheckSent,
    acknowledge, markAssistance, resolve,
  }), [
    sosState, holdProgress, countdown, showCancelModal, startedAt, resolvedAt,
    locationUpdatedAt, refreshLocationUpdatedAt,
    isSosActive, manualLocationSharing, lastSafetyCheckAt,
    startHold, cancelHold, cancelCountdown,
    requestCancel, dismissCancel, confirmCancel,
    backToSafetyFromResolved, toggleManualLocationSharing, markSafetyCheckSent,
    acknowledge, markAssistance, resolve,
  ]);

  return <SosSessionContext.Provider value={value}>{children}</SosSessionContext.Provider>;
}

export function useSosSession(): SosSessionValue {
  const ctx = useContext(SosSessionContext);
  if (!ctx) {
    throw new Error('useSosSession must be used within the dashboard shell (SosSessionProvider missing — see app/dashboard/layout.tsx)');
  }
  return ctx;
}
