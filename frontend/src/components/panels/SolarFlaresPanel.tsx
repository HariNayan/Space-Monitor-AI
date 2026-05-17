'use client';
import { useEffect, useState } from 'react';

export default function SolarFlaresPanel() {
  const [flares, setFlares] = useState<any[]>([]);
  
  useEffect(() => {
    let isMounted = true;
    const fetchFlares = async () => {
      try {
        const end = new Date();
        const start = new Date();
        start.setDate(end.getDate() - 30);
        const startStr = start.toISOString().split('T')[0];
        const endStr = end.toISOString().split('T')[0];
        const apiKey = process.env.NEXT_PUBLIC_NASA_API_KEY || 'DEMO_KEY';
        
        const r = await fetch(`https://api.nasa.gov/DONKI/FLR?startDate=${startStr}&endDate=${endStr}&api_key=${apiKey}`);
        if (!r.ok) throw new Error('API limit');
        const data = await r.json();
        if (isMounted && Array.isArray(data)) {
          setFlares(data.reverse().slice(0, 4));
        }
      } catch (err) {
        // Safe fail
      }
    };
    fetchFlares();
    return () => { isMounted = false; };
  }, []);

  return (
    <div style={{ padding: '8px', overflowY: 'auto', height: '100%' }}>
      {flares.length === 0 ? (
        <div style={{ color: '#4a5070', fontSize: '9px', fontFamily: '"Courier New", monospace' }}>Scanning for solar events...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {flares.map((f, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #161a26', paddingBottom: '4px' }}>
              <div>
                <div style={{ color: f?.classType?.startsWith('X') ? '#ff0000' : (f?.classType?.startsWith('M') ? '#ffaa00' : '#4a9fd8'), fontWeight: 'bold', fontSize: '10px', fontFamily: '"Courier New", monospace' }}>
                  CLASS {f?.classType ?? 'UNK'}
                </div>
                <div style={{ color: '#8a9070', fontSize: '7px', fontFamily: '"Courier New", monospace' }}>
                  {f?.beginTime?.replace('T', ' ')?.replace('Z', '') ?? '--'}
                </div>
              </div>
              <div style={{ color: '#4a5070', fontSize: '8px', fontFamily: '"Courier New", monospace', textAlign: 'right' }}>
                AR: {f?.activeRegionNum ?? 'N/A'}
               <br/>
               {f?.sourceLocation ?? '--'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
