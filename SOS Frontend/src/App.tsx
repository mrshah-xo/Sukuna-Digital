import { useState, useRef, useEffect, useCallback } from 'react';
import type { SosState, ActiveTab } from './types';

import { BottomNav } from './components/ui';
import MainScreen from './screens/MainScreen';
import SOSActiveScreen from './screens/SOSActiveScreen';
import SOSResolvedScreen from './screens/SOSResolvedScreen';
import HistoryScreen from './screens/HistoryScreen';
import SafetyCheckScreen from './screens/SafetyCheckScreen';
import LocationScreen from './screens/LocationScreen';

const HOLD_DURATION = 2500;

// Desktop sidebar nav items (mirrors BottomNav)
const SIDEBAR_NAV: { id: ActiveTab; label: string; icon: JSX.Element }[] = [
  {
    id: 'sos',
    label: 'SOS',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'History',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
        <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'safety',
    label: 'Safety Check',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'location',
    label: 'Location',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.6"/>
      </svg>
    ),
  },
];

export default function App() {
  const [sosState, setSosState] = useState<SosState>('idle');
  const [activeTab, setActiveTab] = useState<ActiveTab>('sos');
  const [holdProgress, setHoldProgress] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [locationActive, setLocationActive] = useState(false);
  const [safetyDone, setSafetyDone] = useState(false);
  const [historySelected, setHistorySelected] = useState<string | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const holdTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const holdStartRef = useRef<number>(0);

  const startHold = useCallback(() => {
    if (sosState !== 'idle') return;
    holdStartRef.current = Date.now();
    setSosState('holding');
    holdTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - holdStartRef.current;
      const progress = Math.min(elapsed / HOLD_DURATION, 1);
      setHoldProgress(progress);
      if (progress >= 1) {
        clearInterval(holdTimerRef.current!);
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
    if (countdown <= 0) { setSosState('active'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [sosState, countdown]);

  const cancelCountdown = useCallback(() => { setSosState('idle'); setCountdown(3); }, []);
  const cancelSOS = useCallback(() => { setSosState('idle'); setShowCancelModal(false); }, []);
  const resolveSOS = useCallback(() => { setSosState('resolved'); setShowCancelModal(false); }, []);
  const backToSafety = useCallback(() => { setSosState('idle'); setActiveTab('sos'); }, []);

  const handleTabChange = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
    setHistorySelected(null);
    setShowPrivacy(false);
  }, []);

  const isSosActive = sosState === 'active' || sosState === 'ack' || sosState === 'assistance';

  const renderContent = () => {
    if (activeTab === 'sos') {
      if (sosState === 'resolved') return <SOSResolvedScreen onBack={backToSafety} />;
      if (isSosActive) return (
        <SOSActiveScreen
          sosState={sosState}
          showCancelModal={showCancelModal}
          onCancelRequest={() => setShowCancelModal(true)}
          onCancelConfirm={cancelSOS}
          onCancelDismiss={() => setShowCancelModal(false)}
          onAcknowledge={() => setSosState('ack')}
          onAssistance={() => setSosState('assistance')}
          onResolve={resolveSOS}
        />
      );
      return (
        <MainScreen
          sosState={sosState} holdProgress={holdProgress} countdown={countdown}
          onHoldStart={startHold} onHoldEnd={cancelHold}
          onCancelCountdown={cancelCountdown} onTabChange={handleTabChange}
        />
      );
    }
    if (activeTab === 'history') return (
      <HistoryScreen selected={historySelected} onSelect={setHistorySelected} onBack={() => setHistorySelected(null)} />
    );
    if (activeTab === 'safety') return (
      <SafetyCheckScreen done={safetyDone} onActivate={() => setSafetyDone(true)} onReset={() => setSafetyDone(false)} />
    );
    if (activeTab === 'location') return (
      <LocationScreen
        active={locationActive} showPrivacy={showPrivacy}
        onToggle={() => setLocationActive(v => !v)}
        onShowPrivacy={() => setShowPrivacy(true)}
        onHidePrivacy={() => setShowPrivacy(false)}
      />
    );
    return null;
  };

  const safetyLabel = isSosActive
    ? { text: 'SOS Active', color: '#DC2626' }
    : sosState === 'resolved'
      ? { text: 'Resolved', color: '#16A34A' }
      : { text: 'No active SOS', color: '#2997ff' };

  return (
    <div className="h-full flex flex-col" style={{ background: '#000000' }}>

      {/* ── Sukuna global nav ── full-width, always visible, 44px */}
      <header
        className="flex-shrink-0 flex items-center"
        style={{ height: 44, background: '#000000', padding: '0 24px' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="white" fillOpacity="0.9"/>
          </svg>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 400, letterSpacing: '-0.12px', color: '#ffffff' }}>
            Sukuna Digital
          </span>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#272729', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.5"/>
              <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>
      </header>

      {/* ── Body: sidebar + content ── */}
      <div className="flex-1 min-h-0 flex overflow-hidden">

        {/* Desktop sidebar — hidden below 834px */}
        <aside
          className="hidden min-[834px]:flex flex-col flex-shrink-0"
          style={{ width: 220, background: '#000000', borderRight: '1px solid #272729', overflowY: 'auto' }}
        >
          {/* Section heading */}
          <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #1a1a1a' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 400, letterSpacing: '0.08em', color: '#7a7a7a', textTransform: 'uppercase' }}>
              SOS & Safety
            </p>
          </div>

          {/* Nav items */}
          <nav style={{ flex: 1, padding: '8px 0' }}>
            {SIDEBAR_NAV.map(item => {
              const isActive = activeTab === item.id;
              const color = isActive ? '#2997ff' : '#7a7a7a';
              const showDot = item.id === 'sos' && isSosActive;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabChange(item.id)}
                  className="w-full flex items-center gap-[12px] transition-opacity active:opacity-70"
                  style={{
                    padding: '12px 24px',
                    background: isActive ? 'rgba(41, 151, 255, 0.08)' : 'transparent',
                    border: 'none',
                    borderLeft: `3px solid ${isActive ? '#2997ff' : 'transparent'}`,
                    cursor: 'pointer',
                    color,
                    minHeight: 44,
                    textAlign: 'left',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span style={{ color, flexShrink: 0 }}>{item.icon}</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, fontWeight: isActive ? 600 : 400, letterSpacing: '-0.224px', color }}>
                    {item.label}
                  </span>
                  {showDot && (
                    <span className="live-dot ml-auto" style={{ width: 6, height: 6, borderRadius: '50%', background: '#DC2626', flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Safety status widget */}
          <div style={{ padding: '16px 24px', borderTop: '1px solid #1a1a1a' }}>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, fontWeight: 400, letterSpacing: '-0.12px', color: '#7a7a7a', marginBottom: 4 }}>
              Safety Status
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, fontWeight: 600, letterSpacing: '-0.12px', color: safetyLabel.color }}>
              {safetyLabel.text}
            </p>
          </div>
        </aside>

        {/* ── Main content column ── */}
        <div className="flex-1 min-h-0 flex flex-col" style={{ background: '#f5f5f7' }}>

          {/* Scrollable content area
              Mobile: overflow-hidden (screen manages its own scroll)
              Desktop: overflow-y-auto (content area scrolls, screen flows naturally) */}
          <div className="flex-1 min-h-0 overflow-hidden min-[834px]:overflow-y-auto">
            {/* Width constraint on desktop; full-height passthrough on mobile */}
            <div className="h-full min-[834px]:h-auto min-[834px]:min-h-full min-[834px]:max-w-[660px] min-[834px]:mx-auto">
              {renderContent()}
            </div>
          </div>

          {/* Bottom nav — mobile only (hidden at 834px+) */}
          <div className="min-[834px]:hidden flex-shrink-0">
            <BottomNav active={activeTab} onChange={handleTabChange} sosState={sosState} />
          </div>

        </div>
      </div>
    </div>
  );
}
