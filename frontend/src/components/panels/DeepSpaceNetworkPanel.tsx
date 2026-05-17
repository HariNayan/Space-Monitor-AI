'use client';
import { useEffect, useState } from 'react';

export default function DeepSpaceNetworkPanel() {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 200);
    return () => clearInterval(t);
  }, []);

  const dishes = [
    { name: 'GOLDSTONE', active: true, freq: '8.4GHz', bw: '120kbps', target: 'VOYAGER 1' },
    { name: 'MADRID', active: tick % 15 !== 0, freq: '32GHz', bw: '2.1Mbps', target: 'MRO' },
    { name: 'CANBERRA', active: true, freq: '2.2GHz', bw: '8kbps', target: 'NEW HORIZONS' }
  ];

  return (
    <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: '"Courier New", monospace' }}>
      {dishes.map((d, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 8px', background: d.active ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 0, 0, 0.05)', border: `1px solid ${d.active ? '#00ff8844' : '#ff000044'}` }}>
          <div>
            <div style={{ fontSize: '9px', color: d.active ? '#00ff88' : '#ff0000', fontWeight: 'bold' }}>DSN-{i+1} {d.name}</div>
            <div style={{ fontSize: '7px', color: '#8899aa', marginTop: '2px' }}>TRK: {d.target}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '8px', color: d.active ? '#fff' : '#666' }}>{d.active ? `FRQ: ${d.freq} | ${d.bw}` : 'OFLN'}</div>
            <div style={{ fontSize: '7px', color: '#00ff88', opacity: 0.7, marginTop: '2px', letterSpacing: '2px' }}>
              {d.active ? Array.from({length: 8}).map(() => Math.random() > 0.4 ? '1' : '0').join('') : '00000000'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
