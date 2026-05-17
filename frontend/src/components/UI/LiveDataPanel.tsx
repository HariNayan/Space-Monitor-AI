'use client';

import { useState, useEffect, memo, useMemo } from 'react';
import { useCameraTargetSelector } from '@/store/spaceStore';

interface CelestialData {
  distance: string;
  diameter: string;
  temperature: string;
  gravity: string;
  moons: string;
  dayLength: string;
  yearLength: string;
  atmosphere: string;
}

const CELESTIAL_DATA: Record<string, CelestialData> = {
  Sun: { distance: '0 km', diameter: '1,392,700 km', temperature: '5,500°C', gravity: '274 m/s²', moons: '0', dayLength: '25 days', yearLength: 'N/A', atmosphere: 'Plasma' },
  Mercury: { distance: '77 million km', diameter: '4,879 km', temperature: '167°C', gravity: '3.7 m/s²', moons: '0', dayLength: '59 days', yearLength: '88 days', atmosphere: 'Minimal' },
  Venus: { distance: '108.2 million km', diameter: '12,104 km', temperature: '465°C', gravity: '8.87 m/s²', moons: '0', dayLength: '243 days', yearLength: '225 days', atmosphere: 'CO₂, N₂' },
  Earth: { distance: '149.6 million km', diameter: '12,742 km', temperature: '15°C', gravity: '9.8 m/s²', moons: '1', dayLength: '24 hours', yearLength: '365 days', atmosphere: 'N₂, O₂' },
  Mars: { distance: '225 million km', diameter: '6,779 km', temperature: '-65°C', gravity: '3.7 m/s²', moons: '2', dayLength: '24h 37m', yearLength: '687 days', atmosphere: 'CO₂, Argon' },
  Jupiter: { distance: '778.5 million km', diameter: '139,820 km', temperature: '-110°C', gravity: '23.1 m/s²', moons: '95', dayLength: '10 hours', yearLength: '12 years', atmosphere: 'H₂, He' },
  Saturn: { distance: '1.4 billion km', diameter: '116,460 km', temperature: '-140°C', gravity: '9.0 m/s²', moons: '146', dayLength: '10.7 hours', yearLength: '29 years', atmosphere: 'H₂, He' },
  Uranus: { distance: '2.9 billion km', diameter: '50,724 km', temperature: '-195°C', gravity: '8.7 m/s²', moons: '28', dayLength: '17 hours', yearLength: '84 years', atmosphere: 'H₂, He, CH₄' },
  Neptune: { distance: '4.5 billion km', diameter: '49,244 km', temperature: '-200°C', gravity: '11.0 m/s²', moons: '16', dayLength: '16 hours', yearLength: '165 years', atmosphere: 'H₂, He, CH₄' },
};

const DataRow = memo(function DataRow({
  label,
  value,
  valueColor = '#c8ccd8',
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        padding: '4px 8px',
        borderBottom: '1px solid #161a26',
      }}
    >
      <span
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '8px',
          color: '#4a5070',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '10px',
          color: valueColor,
        }}
      >
        {value}
      </span>
    </div>
  );
});

export default memo(function LiveDataPanel() {
  const currentTarget = useCameraTargetSelector();
  const data = useMemo(() => CELESTIAL_DATA[currentTarget] || CELESTIAL_DATA['Earth'], [currentTarget]);
  const [time, setTime] = useState('--:--:--');

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toISOString().slice(11, 19));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#0a0c14',
      }}
    >
      <div
        style={{
          height: '22px',
          padding: '0 8px',
          borderBottom: '1px solid #161a26',
          background: '#0a0c14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: '#e8d5a3',
            textTransform: 'uppercase',
            letterSpacing: '.08em',
          }}
        >
          LIVE TELEMETRY
        </span>
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '8px',
            color: '#6a9fd8',
            textTransform: 'uppercase',
          }}
        >
          {currentTarget.toUpperCase()}
        </span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <DataRow label="Diameter" value={data.diameter} valueColor="#e8d5a3" />
        <DataRow label="Distance from Sun" value={data.distance} />
        <DataRow label="Moons" value={data.moons} />
        <DataRow label="Gravity" value={data.gravity} />
        <DataRow label="Day Length" value={data.dayLength} />
        <DataRow label="Year Length" value={data.yearLength} />
        <DataRow label="Surface Temp" value={data.temperature} />
        <DataRow label="Atmosphere" value={data.atmosphere} />
      </div>
      <div
        style={{
          padding: '4px 8px',
          borderTop: '1px solid #161a26',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '8px',
            color: '#4a5070',
            textTransform: 'uppercase',
          }}
        >
          UTC
        </span>
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '8px',
            color: '#4a8c6f',
          }}
        >
          {time}
        </span>
      </div>
    </div>
  );
});