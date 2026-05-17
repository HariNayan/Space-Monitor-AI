'use client';
import { useEffect, useState } from 'react';

export default function JWSTPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  const instruments = [
    { name: 'NIRCam', temp: 38.6 + (Math.sin(tick) * 0.2) },
    { name: 'MIRI', temp: 6.2 + (Math.cos(tick) * 0.1) },
    { name: 'NIRSpec', temp: 37.9 + (Math.sin(tick * 0.5) * 0.3) },
  ];

  return (
    <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: '"Courier New", monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #161a26', paddingBottom: '4px' }}>
        <span style={{ fontSize: '9px', color: '#ffaa00', fontWeight: 'bold' }}>OBSERVATION</span>
        <span style={{ fontSize: '9px', color: '#fff' }}>TRAPPIST-1e</span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {instruments.map(inst => (
          <div key={inst.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '8px', color: '#8899aa' }}>{inst.name}</span>
            <span style={{ fontSize: '9px', color: '#00ff88', fontWeight: 'bold' }}>{inst.temp.toFixed(2)} K</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <div style={{ height: '4px', flex: 1, background: '#161a26' }}>
          <div style={{ height: '100%', width: `${(tick % 100)}%`, background: '#ffaa00', transition: 'width 1s linear' }} />
        </div>
        <span style={{ fontSize: '8px', color: '#4a5070' }}>EXPOSURE</span>
      </div>
    </div>
  );
}
