'use client';

export default function PulsarPanel() {
  return (
    <div style={{ padding: '8px', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden', fontFamily: '"Courier New", monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', zIndex: 2 }}>
        <span style={{ fontSize: '9px', color: '#00eeff', fontWeight: 'bold' }}>CRAB PULSAR</span>
        <span style={{ fontSize: '9px', color: '#8899aa' }}>30 Hz</span>
      </div>
      <div style={{ flex: 1, position: 'relative', margin: '4px 0', borderBottom: '1px solid #161a26', zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: '#00eeff44' }} />
        <div style={{ position: 'absolute', top: '10%', bottom: '10%', left: '50%', width: '2px', background: '#00eeff', boxShadow: '0 0 8px #00eeff', animation: 'scan 1s linear infinite' }} />
      </div>
      <div style={{ fontSize: '7px', color: '#4a5070', textAlign: 'right', zIndex: 2 }}>X-RAY TIMING</div>
      <style>{`
        @keyframes scan {
          0% { left: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
}
