'use client';
import { useEffect, useState } from 'react';

export default function VoyagerPanel() {
  const [distV1, setDistV1] = useState(24350000000);
  const [distV2, setDistV2] = useState(20280000000);
  
  useEffect(() => {
    const t = setInterval(() => {
       setDistV1(v => v + 17.04);
       setDistV2(v => v + 15.34);
    }, 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ padding: '8px 12px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '8px', fontFamily: '"Courier New", monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#ffaa00', fontWeight: 'bold' }}>VOYAGER 1</div>
          <div style={{ fontSize: '7px', color: '#8899aa' }}>INTERSTELLAR SPACE</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#fff' }}>{Math.floor(distV1).toLocaleString()} KM</div>
          <div style={{ fontSize: '7px', color: '#4a9fd8' }}>+17.04 km/s</div>
        </div>
      </div>
      
      <div style={{ height: '1px', background: '#161a26' }} />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#ffaa00', fontWeight: 'bold' }}>VOYAGER 2</div>
          <div style={{ fontSize: '7px', color: '#8899aa' }}>INTERSTELLAR SPACE</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', color: '#fff' }}>{Math.floor(distV2).toLocaleString()} KM</div>
          <div style={{ fontSize: '7px', color: '#4a9fd8' }}>+15.34 km/s</div>
        </div>
      </div>
    </div>
  );
}
