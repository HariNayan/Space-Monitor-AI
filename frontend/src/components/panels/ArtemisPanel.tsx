'use client';
import { useEffect, useState } from 'react';

export default function ArtemisPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 100);
    return () => clearInterval(t);
  }, []);

  const phases = [
    { label: 'TLI BURN', status: 'COMPLETE', color: '#4a5070' },
    { label: 'COAST PHASE', status: 'ACTIVE', color: '#00ff88' },
    { label: 'NRHO INSERT', status: 'PENDING', color: '#ffaa00' }
  ];

  return (
    <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: '"Courier New", monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '8px', color: '#8899aa', fontWeight: 'bold' }}>ORION CSM</span>
        <span style={{ fontSize: '8px', color: '#fff' }}>V: {(1.02 + Math.sin(tick*0.05)*0.01).toFixed(3)} km/s</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {phases.map((p, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#0a0c14', padding: '4px 6px', borderLeft: `2px solid ${p.color}` }}>
            <span style={{ fontSize: '8px', color: p.color }}>{p.label}</span>
            <span style={{ fontSize: '7px', color: '#fff' }}>{p.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
