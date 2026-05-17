'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

const PLANETS = [
  { name: 'Mercury', color: '#b5b5b5', size: 4, orbitRadius: 70, speed: 4.15, nasaId: '199' },
  { name: 'Venus', color: '#e8b84b', size: 7, orbitRadius: 110, speed: 1.62, nasaId: '299' },
  { name: 'Earth', color: '#4a9fd8', size: 8, orbitRadius: 150, speed: 1.0, nasaId: '399' },
  { name: 'Mars', color: '#c1440e', size: 5, orbitRadius: 195, speed: 0.53, nasaId: '499' },
  { name: 'Jupiter', color: '#c88b3a', size: 18, orbitRadius: 250, speed: 0.084, nasaId: '599' },
  { name: 'Saturn', color: '#e4d191', size: 14, orbitRadius: 295, speed: 0.034, nasaId: '699' },
  { name: 'Uranus', color: '#7de8e8', size: 10, orbitRadius: 332, speed: 0.012, nasaId: '799' },
  { name: 'Neptune', color: '#3f54ba', size: 10, orbitRadius: 365, speed: 0.006, nasaId: '899' },
];

interface PlanetState {
  name: string;
  angle: number;
  nasaAngle: number | null;
  color: string;
  size: number;
  orbitRadius: number;
  speed: number;
}

interface Props {
  selectedPlanet: string;
  onPlanetClick: (name: string) => void;
}

export default function SolarSystem({ selectedPlanet, onPlanetClick }: Props) {
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const [planets, setPlanets] = useState<PlanetState[]>(
    PLANETS.map((p) => ({
      ...p,
      angle: Math.random() * Math.PI * 2,
      nasaAngle: null,
    }))
  );
  const [nasaStatus, setNasaStatus] = useState<'loading' | 'live' | 'error'>('loading');
  const [tooltip, setTooltip] = useState<{
    name: string;
    x: number;
    y: number;
  } | null>(null);
  const planetsRef = useRef(planets);
  planetsRef.current = planets;

  const fetchNASAPositions = useCallback(async () => {
    try {
      const now = new Date();
      const pad = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
      const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

      const updates: Partial<Record<string, number>> = {};

      await Promise.all(
        PLANETS.map(async (planet) => {
          try {
            const url =
              `https://ssd.jpl.nasa.gov/api/horizons.api?` +
              `format=json&COMMAND='${planet.nasaId}'&OBJ_DATA='NO'` +
              `&MAKE_EPHEM='YES'&EPHEM_TYPE='VECTORS'&CENTER='500@0'` +
              `&START_TIME='${dateStr} ${timeStr}'` +
              `&STOP_TIME='${dateStr} ${timeStr}'&STEP_SIZE='1m'` +
              `&VEC_TABLE='2'`;

            const res = await fetch(url);
            const data = await res.json();
            const result = data.result as string;

            const match = result.match(/X =\s*([-\d.E+]+)\s*Y =\s*([-\d.E+]+)/);
            if (match) {
              const x = parseFloat(match[1]);
              const y = parseFloat(match[2]);
              updates[planet.name] = Math.atan2(y, x);
            }
          } catch {
            // Skip failed requests
          }
        })
      );

      if (Object.keys(updates).length > 0) {
        setPlanets((prev) =>
          prev.map((p) =>
            updates[p.name] !== undefined
              ? { ...p, nasaAngle: updates[p.name]! }
              : p
          )
        );
        setNasaStatus('live');
      }
    } catch {
      setNasaStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchNASAPositions();
    const interval = setInterval(fetchNASAPositions, 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchNASAPositions]);

  useEffect(() => {
    const animate = (timestamp: number) => {
      const delta = Math.min((timestamp - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = timestamp;

      setPlanets((prev) =>
        prev.map((p) => {
          let newAngle = p.angle + p.speed * delta * 0.3;

          if (p.nasaAngle !== null) {
            const diff = p.nasaAngle - newAngle;
            const wrapped = ((diff + Math.PI) % (Math.PI * 2)) - Math.PI;
            newAngle += wrapped * 0.001;
          }

          return { ...p, angle: newAngle };
        })
      );

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, []);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        background: '#020408',
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1000 600"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        {/* Stars */}
        {Array.from({ length: 120 }, (_, i) => (
          <circle
            key={`star-${i}`}
            cx={(i * 137.5) % 1000}
            cy={(i * 97.3) % 600}
            r={i % 7 === 0 ? 1.2 : 0.7}
            fill="#ffffff"
            opacity={0.2 + (i % 5) * 0.08}
          />
        ))}

        {/* Orbit rings */}
        {planets.map(p => (
          <circle
            key={`orbit-${p.name}`}
            cx={500}
            cy={300}
            r={p.orbitRadius}
            fill="none"
            stroke={
              selectedPlanet.toLowerCase() === p.name.toLowerCase()
                ? '#e8d5a3'
                : '#1c2030'
            }
            strokeWidth="0.5"
          />
        ))}

        {/* Sun glow */}
        <circle
          cx={500}
          cy={300}
          r={22}
          fill="none"
          stroke="rgba(245,200,66,0.15)"
          strokeWidth="6"
        />

        {/* Sun */}
        <circle
          cx={500}
          cy={300}
          r={16}
          fill="#f5c842"
          style={{ cursor: 'pointer' }}
          onClick={() => onPlanetClick('Sun')}
        />

        {/* Planets */}
        {planets.map(p => {
          const x = 500 + Math.cos(p.angle) * p.orbitRadius;
          const y = 300 + Math.sin(p.angle) * p.orbitRadius;
          const isSelected = selectedPlanet.toLowerCase() === p.name.toLowerCase();

          return (
            <g key={p.name}>
              {/* Saturn rings */}
              {p.name === 'Saturn' && (
                <ellipse
                  cx={x}
                  cy={y}
                  rx={p.size * 2.2}
                  ry={p.size * 0.6}
                  fill="none"
                  stroke="rgba(228,209,145,0.5)"
                  strokeWidth="2"
                />
              )}
              {/* Planet circle */}
              <circle
                cx={x}
                cy={y}
                r={p.size}
                fill={p.color}
                style={{ cursor: 'pointer' }}
                stroke={isSelected ? '#e8d5a3' : 'none'}
                strokeWidth={isSelected ? 2 : 0}
                onClick={() => onPlanetClick(p.name)}
                onMouseEnter={() =>
                  setTooltip({ name: p.name, x, y: y - p.size - 6 })
                }
                onMouseLeave={() => setTooltip(null)}
              />
            </g>
          );
        })}

        {/* Tooltip */}
        {tooltip && (
          <g>
            <rect
              x={tooltip.x - 30}
              y={tooltip.y - 14}
              width={60}
              height={14}
              fill="rgba(6,8,16,0.9)"
              stroke="#1c2030"
              strokeWidth="0.5"
            />
            <text
              x={tooltip.x}
              y={tooltip.y - 4}
              textAnchor="middle"
              fontSize="8"
              fill="#e8d5a3"
              fontFamily="'Courier New', monospace"
            >
              {tooltip.name.toUpperCase()}
            </text>
          </g>
        )}
      </svg>

      {/* NASA status */}
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          left: 8,
          fontFamily: "'Courier New', monospace",
          fontSize: '8px',
          color:
            nasaStatus === 'live'
              ? '#4a8c6f'
              : nasaStatus === 'error'
              ? '#c0473a'
              : '#c8a840',
          letterSpacing: '.06em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}
      >
        {nasaStatus === 'live'
          ? '● NASA HORIZONS — LIVE'
          : nasaStatus === 'error'
          ? '● NASA — OFFLINE (SIMULATED)'
          : '● SYNCING NASA DATA...'}
      </div>
    </div>
  );
}