"use client";

import MainScreen from './MainScreen';
import SOSActiveScreen from './SOSActiveScreen';
import SOSResolvedScreen from './SOSResolvedScreen';
import { useSosSession } from './SosSessionContext';

export default function SosHomeScreen() {
  const { sosState } = useSosSession();

  if (sosState === 'active' || sosState === 'ack' || sosState === 'assistance') {
    return <SOSActiveScreen />;
  }
  if (sosState === 'resolved') {
    return <SOSResolvedScreen />;
  }
  return <MainScreen />;
}
