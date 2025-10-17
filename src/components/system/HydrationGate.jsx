// src/components/system/HydrationGate.jsx
// 초기 깜빡임 방지
import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';

export default function HydrationGate({ fallback = null, children }) {
  const hydrated = useAuthStore(s => s.hydrated);
  if (!hydrated) return fallback;
  return children;
}
