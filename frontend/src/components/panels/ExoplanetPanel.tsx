'use client';
import { useEffect, useState } from 'react';

export default function ExoplanetPanel() {
  const planets = [
    { name: 'Kepler-186f', dist: '582 ly', type: 'Earth-like', esi: '0.61' },
    { name: 'TRAPPIST-1d', dist: '39 ly', type: 'Rocky', esi: '0.90' },
    { name: 'Proxima Cen b', dist: '4.2 ly', type: 'Rocky', esi: '0.87' },
    { name: 'K2-18b', dist: '124 ly', type: 'Super-Earth', esi: '0.73' },
    { name: 'LHS 1140 b', dist: '40 ly', type: 'Super-Earth', esi: '0.68' },
  ];
  
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % planets.length), 4000);
    return () => clearInterval(t);
  }, []);

  const p = planets[index];

  return (
    <div style={{ padding: '12px 8px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', fontFamily: '"Courier New", monospace', background: '#0a0c14', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', zIndex: 2 }}>
        <div>
          <div style={{ fontSize: '11px', color: '#4a9fd8', fontWeight: 'bold', marginBottom: '4px' }}>{p.name}</div>
          <div style={{ fontSize: '8px', color: '#8899aa' }}>TYPE: {p.type}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '8px', color: '#ffaa00' }}>ESI: {p.esi}</div>
          <div style={{ fontSize: '8px', color: '#8899aa', marginTop: '2px' }}>DIST: {p.dist}</div>
        </div>
      </div>
      <div style={{ marginTop: '12px', height: '1px', background: 'linear-gradient(90deg, #4a9fd8, transparent)', zIndex: 2 }} />
      <div style={{ position: 'absolute', right: '-10px', top: '10px', fontSize: '60px', opacity: 0.05, fontWeight: 'bold', color: '#4a9fd8', zIndex: 1 }}>{index+1}</div>
    </div>
  );
}
