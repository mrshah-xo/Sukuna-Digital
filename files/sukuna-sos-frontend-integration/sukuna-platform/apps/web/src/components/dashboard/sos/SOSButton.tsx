"use client";

import { useCallback, useRef } from 'react';
import type { SosState } from './types';

const OUTER_R = 72;
const INNER_R = 58;
const CIRCUMFERENCE = 2 * Math.PI * INNER_R;
const SVG_SIZE = (OUTER_R + 4) * 2;
const CENTER = SVG_SIZE / 2;

interface SOSButtonProps {
  sosState: SosState;
  holdProgress: number;
  onHoldStart: () => void;
  onHoldEnd: () => void;
}

export default function SOSButton({ sosState, holdProgress, onHoldStart, onHoldEnd }: SOSButtonProps) {
  const isIdle = sosState === 'idle';
  const isHolding = sosState === 'holding';
  const isActive = sosState === 'active' || sosState === 'ack' || sosState === 'assistance';
  const isResolved = sosState === 'resolved';

  const pointerDownRef = useRef(false);
  const strokeDashoffset = CIRCUMFERENCE * (1 - holdProgress);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    if (!isIdle) return;
    pointerDownRef.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    onHoldStart();
  }, [isIdle, onHoldStart]);

  const handlePointerUp = useCallback(() => {
    if (!pointerDownRef.current) return;
    pointerDownRef.current = false;
    onHoldEnd();
  }, [onHoldEnd]);

  const btnBg = isActive
    ? '#991B1B'
    : isResolved
      ? '#e0e0e0'
      : isHolding
        ? '#B91C1C'
        : '#DC2626';

  const btnLabel = isIdle ? 'Hold to activate'
    : isHolding ? 'Keep holding…'
    : isActive ? 'Active'
    : isResolved ? 'Resolved'
    : '';

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: SVG_SIZE, height: SVG_SIZE }}>
      {isIdle && (
        <div
          className="sos-ring-pulse absolute inset-0 rounded-full"
          style={{ background: 'rgba(220, 38, 38, 0.1)' }}
          aria-hidden="true"
        />
      )}

      <svg
        className="absolute inset-0"
        width={SVG_SIZE}
        height={SVG_SIZE}
        style={{ transform: 'rotate(-90deg)', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        {(isHolding || holdProgress > 0) && (
          <circle cx={CENTER} cy={CENTER} r={INNER_R} fill="none" stroke="#FECACA" strokeWidth={4} />
        )}
        {holdProgress > 0 && (
          <circle
            cx={CENTER} cy={CENTER} r={INNER_R}
            fill="none"
            stroke="#DC2626"
            strokeWidth={4}
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.05s linear' }}
          />
        )}
      </svg>

      <button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        disabled={isActive || isResolved}
        aria-label={isActive ? 'SOS is currently active' : 'Hold for 2.5 seconds to activate SOS emergency alert'}
        className="relative z-10 flex flex-col items-center justify-center transition-transform focus-visible:outline-2 focus-visible:outline-offset-4"
        style={{
          width: OUTER_R * 2,
          height: OUTER_R * 2,
          borderRadius: '50%',
          background: btnBg,
          cursor: isActive || isResolved ? 'default' : 'pointer',
          transform: isHolding ? 'scale(0.94)' : 'scale(1)',
          transition: 'transform 0.12s ease, background 0.15s ease',
          outlineColor: '#0071e3',
          gap: 2,
          touchAction: 'none',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: '0.12em',
            color: isResolved ? '#7a7a7a' : '#ffffff',
            lineHeight: 1,
          }}
        >
          SOS
        </span>
        {btnLabel && (
          <span
            style={{
              fontFamily: 'var(--font-text)',
              fontSize: 10,
              fontWeight: 400,
              letterSpacing: '-0.08px',
              color: isResolved ? '#7a7a7a' : 'rgba(255,255,255,0.75)',
              lineHeight: 1.2,
              textAlign: 'center',
              maxWidth: 80,
            }}
          >
            {btnLabel}
          </span>
        )}
      </button>
    </div>
  );
}
