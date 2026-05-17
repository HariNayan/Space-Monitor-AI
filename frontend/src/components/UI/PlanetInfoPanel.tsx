'use client';

import { memo, useEffect, useState } from 'react';

interface PlanetFact {
  label: string;
  value: string;
}

interface PlanetInfo {
  name: string;
  color: string;
  accentColor: string;
  type: string;
  tagline: string;
  distanceFromSun: string;
  orbitalPeriod: string;
  rotationPeriod: string;
  diameter: string;
  mass: string;
  gravity: string;
  moons: string;
  temperature: string;
  atmosphere: string;
  description: string;
  facts: PlanetFact[];
  emoji: string;
}

const PLANET_INFO: Record<string, PlanetInfo> = {
  Sun: {
    name: 'Sun',
    color: '#f5c842',
    accentColor: '#ff9900',
    type: 'G-Type Main Sequence Star',
    tagline: 'The Heart of Our Solar System',
    distanceFromSun: '0 AU',
    orbitalPeriod: 'N/A',
    rotationPeriod: '~25 days (equator)',
    diameter: '1,392,700 km',
    mass: '1.989 × 10³⁰ kg',
    gravity: '274 m/s²',
    moons: 'N/A',
    temperature: '5,500°C (surface)',
    atmosphere: '73% H, 25% He',
    description:
      'The Sun is the star at the center of our Solar System. It contains 99.86% of all mass in the solar system, driving weather, climate, ocean currents and light for all life on Earth.',
    emoji: '☀️',
    facts: [
      { label: 'Core Temp', value: '15 MK' },
      { label: 'Solar Flare', value: 'X-class detected' },
      { label: 'Age', value: '4.6 Billion yr' },
      { label: 'Energy Output', value: '3.86 × 10²⁶ W' },
    ],
  },
  Mercury: {
    name: 'Mercury',
    color: '#b5ada6',
    accentColor: '#c8bfb5',
    type: 'Terrestrial Planet',
    tagline: 'Closest World to the Sun',
    distanceFromSun: '0.39 AU',
    orbitalPeriod: '87.97 days',
    rotationPeriod: '58.6 days',
    diameter: '4,879 km',
    mass: '3.3 × 10²³ kg',
    gravity: '3.7 m/s²',
    moons: '0',
    temperature: '-180°C to 430°C',
    atmosphere: 'Exosphere (Na, O₂)',
    description:
      'Mercury is the smallest planet and closest to the Sun. Its surface is heavily cratered and has extreme temperature swings — scorching hot in sunlight and frigid cold in shadow.',
    emoji: '🪨',
    facts: [
      { label: 'Orbital Speed', value: '47.9 km/s' },
      { label: 'Largest Crater', value: 'Caloris Basin' },
      { label: 'Iron Core', value: '85% of radius' },
      { label: 'Missions', value: 'MESSENGER, BepiColombo' },
    ],
  },
  Venus: {
    name: 'Venus',
    color: '#e8c87a',
    accentColor: '#ffaa00',
    type: 'Terrestrial Planet',
    tagline: 'Earth\'s Twin — A Toxic Inferno',
    distanceFromSun: '0.72 AU',
    orbitalPeriod: '224.7 days',
    rotationPeriod: '243 days (retrograde)',
    diameter: '12,104 km',
    mass: '4.87 × 10²⁴ kg',
    gravity: '8.87 m/s²',
    moons: '0',
    temperature: '465°C (avg)',
    atmosphere: '96% CO₂, 3.5% N₂',
    description:
      'Venus is the hottest planet in the solar system, despite being farther from the Sun than Mercury. A thick CO₂ atmosphere causes extreme greenhouse effect. Curiously, it rotates backwards.',
    emoji: '🌋',
    facts: [
      { label: 'Pressure', value: '92 × Earth atm' },
      { label: 'Rotation', value: 'Retrograde' },
      { label: 'Sulfuric Clouds', value: '45–70 km altitude' },
      { label: 'Missions', value: 'Magellan, Venera 13' },
    ],
  },
  Earth: {
    name: 'Earth',
    color: '#4a9fd8',
    accentColor: '#00aaff',
    type: 'Terrestrial Planet',
    tagline: 'The Blue Marble — Our Home',
    distanceFromSun: '1.00 AU',
    orbitalPeriod: '365.25 days',
    rotationPeriod: '23h 56m',
    diameter: '12,742 km',
    mass: '5.972 × 10²⁴ kg',
    gravity: '9.81 m/s²',
    moons: '1 (Moon)',
    temperature: '-88°C to 58°C',
    atmosphere: '78% N₂, 21% O₂',
    description:
      'Earth is the only known planet harboring life. It has liquid water oceans covering 71% of its surface, a protective magnetic field, and a delicately balanced atmosphere. The cradle of all civilization.',
    emoji: '🌍',
    facts: [
      { label: 'Surface Water', value: '71%' },
      { label: 'Species Count', value: '~8.7 Million' },
      { label: 'Tectonic Plates', value: '7 major' },
      { label: 'Magnetic Field', value: '25–65 μT' },
    ],
  },
  Mars: {
    name: 'Mars',
    color: '#c1440e',
    accentColor: '#ff6633',
    type: 'Terrestrial Planet',
    tagline: 'The Red Planet — Humanity\'s Next Frontier',
    distanceFromSun: '1.52 AU',
    orbitalPeriod: '687 days',
    rotationPeriod: '24h 37m',
    diameter: '6,779 km',
    mass: '6.39 × 10²³ kg',
    gravity: '3.72 m/s²',
    moons: '2 (Phobos, Deimos)',
    temperature: '-87°C to -5°C',
    atmosphere: '95% CO₂, 3% N₂',
    description:
      'Mars hosts Olympus Mons — the tallest volcano in the solar system at 21 km — and Valles Marineris, a canyon stretching 4,000 km. Evidence of ancient water flows makes it the prime target for human colonization.',
    emoji: '🔴',
    facts: [
      { label: 'Olympus Mons', value: '21 km height' },
      { label: 'Valles Marineris', value: '4,000 km long' },
      { label: 'Dust Storms', value: 'Planet-wide' },
      { label: 'Active Rovers', value: 'Perseverance, Curiosity' },
    ],
  },
  Jupiter: {
    name: 'Jupiter',
    color: '#c88b3a',
    accentColor: '#ffaa44',
    type: 'Gas Giant',
    tagline: 'King of Planets — A World of Storms',
    distanceFromSun: '5.20 AU',
    orbitalPeriod: '11.86 years',
    rotationPeriod: '9h 56m',
    diameter: '139,820 km',
    mass: '1.898 × 10²⁷ kg',
    gravity: '24.8 m/s²',
    moons: '95 moons',
    temperature: '-108°C (cloud top)',
    atmosphere: '89% H₂, 10% He',
    description:
      'Jupiter is the largest planet, with a mass 2.5× all other planets combined. The Great Red Spot is a storm larger than Earth that has raged for over 350 years. Its moon Europa may harbor a subsurface ocean.',
    emoji: '🌀',
    facts: [
      { label: 'Great Red Spot', value: '350+ years old' },
      { label: 'Magnetosphere', value: '20,000× Earth' },
      { label: 'Io Volcanism', value: 'Most volcanic world' },
      { label: 'Europa Ocean', value: '~100 km deep' },
    ],
  },
  Saturn: {
    name: 'Saturn',
    color: '#e4d191',
    accentColor: '#d4b870',
    type: 'Gas Giant',
    tagline: 'Lord of the Rings',
    distanceFromSun: '9.58 AU',
    orbitalPeriod: '29.45 years',
    rotationPeriod: '10h 42m',
    diameter: '116,460 km',
    mass: '5.683 × 10²⁶ kg',
    gravity: '10.44 m/s²',
    moons: '146 moons',
    temperature: '-138°C (cloud top)',
    atmosphere: '96% H₂, 3% He',
    description:
      'Saturn\'s iconic rings are made of ice and rock, spanning up to 282,000 km but only 10 to 1,000 meters thick. Saturn is less dense than water — it would float! Titan, its largest moon, has rivers of liquid methane.',
    emoji: '🪐',
    facts: [
      { label: 'Ring Span', value: '282,000 km' },
      { label: 'Ring Thickness', value: '10–1,000 m' },
      { label: 'Titan Atmosphere', value: 'Thicker than Earth', },
      { label: 'Density', value: '0.687 g/cm³' },
    ],
  },
  Uranus: {
    name: 'Uranus',
    color: '#7de8e8',
    accentColor: '#00eeff',
    type: 'Ice Giant',
    tagline: 'The Sideways Planet',
    distanceFromSun: '19.22 AU',
    orbitalPeriod: '84.01 years',
    rotationPeriod: '17h 14m (retrograde)',
    diameter: '50,724 km',
    mass: '8.68 × 10²⁵ kg',
    gravity: '8.87 m/s²',
    moons: '28 moons',
    temperature: '-195°C',
    atmosphere: '83% H₂, 15% He, 2% CH₄',
    description:
      'Uranus rotates on its side with an axial tilt of 97.77°, causing extreme seasons lasting 21 years each. Its blue-green color comes from methane absorbing red light. It has 13 known rings and 28 moons.',
    emoji: '🔵',
    facts: [
      { label: 'Axial Tilt', value: '97.77°' },
      { label: 'Coldest Planet', value: '-224°C recorded' },
      { label: 'Diamond Rain', value: 'Theoretical' },
      { label: 'Rings', value: '13 known' },
    ],
  },
  Neptune: {
    name: 'Neptune',
    color: '#3f54ba',
    accentColor: '#4488ff',
    type: 'Ice Giant',
    tagline: 'The Windiest World in the Solar System',
    distanceFromSun: '30.05 AU',
    orbitalPeriod: '164.8 years',
    rotationPeriod: '16h 6m',
    diameter: '49,244 km',
    mass: '1.024 × 10²⁶ kg',
    gravity: '11.15 m/s²',
    moons: '16 moons',
    temperature: '-201°C',
    atmosphere: '80% H₂, 19% He, 1.5% CH₄',
    description:
      'Neptune has the fastest winds in the solar system, reaching 2,100 km/h. Despite being farthest from the Sun, it has an internal heat source. Triton, its largest moon, orbits backwards and is slowly spiraling inward.',
    emoji: '🌊',
    facts: [
      { label: 'Wind Speed', value: '2,100 km/h' },
      { label: 'Great Dark Spot', value: 'Transient storms' },
      { label: 'Triton Orbit', value: 'Retrograde' },
      { label: 'Voyager 2', value: 'Only spacecraft visit' },
    ],
  },
};

interface PlanetInfoPanelProps {
  planet: string;
  onClose: () => void;
}

export default memo(function PlanetInfoPanel({ planet, onClose }: PlanetInfoPanelProps) {
  const [visible, setVisible] = useState(false);
  const info = PLANET_INFO[planet];

  useEffect(() => {
    // Trigger slide-in animation
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [planet]);

  if (!info) return null;

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 350);
  };

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '320px',
        height: '100%',
        background: 'rgba(6, 8, 18, 0.97)',
        borderLeft: `1px solid ${info.accentColor}33`,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 50,
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(12px)',
        boxShadow: `-8px 0 32px rgba(0,0,0,0.6), inset 0 0 0 1px ${info.accentColor}11`,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 14px 10px',
          borderBottom: `1px solid ${info.accentColor}22`,
          background: `linear-gradient(135deg, rgba(6,8,18,0.95) 0%, ${info.color}08 100%)`,
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span style={{ fontSize: '20px', lineHeight: 1 }}>{info.emoji}</span>
              <div>
                <div style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: info.color,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  textShadow: `0 0 12px ${info.color}88`,
                }}>
                  {info.name}
                </div>
                <div style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '8px',
                  color: info.accentColor + 'aa',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}>
                  {info.type}
                </div>
              </div>
            </div>
            <div style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '8px',
              color: '#4a5070',
              letterSpacing: '0.06em',
              marginTop: '2px',
            }}>
              {info.tagline}
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              background: 'transparent',
              border: `1px solid #2a2f42`,
              color: '#4a5070',
              fontFamily: "'Courier New', monospace",
              fontSize: '9px',
              padding: '3px 6px',
              cursor: 'pointer',
              flexShrink: 0,
              marginLeft: '8px',
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

        {/* Key stats grid */}
        <div>
          <SectionLabel label="TELEMETRY" color={info.accentColor} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '5px' }}>
            <Stat label="Distance" value={info.distanceFromSun} color={info.accentColor} />
            <Stat label="Orbit Period" value={info.orbitalPeriod} color={info.accentColor} />
            <Stat label="Diameter" value={info.diameter} color={info.accentColor} />
            <Stat label="Mass" value={info.mass} color={info.accentColor} />
            <Stat label="Gravity" value={info.gravity} color={info.accentColor} />
            <Stat label="Moons" value={info.moons} color={info.accentColor} />
            <Stat label="Temperature" value={info.temperature} color={info.accentColor} />
            <Stat label="Day Length" value={info.rotationPeriod} color={info.accentColor} />
          </div>
        </div>

        {/* Atmosphere */}
        <div>
          <SectionLabel label="ATMOSPHERE" color={info.accentColor} />
          <div style={{
            marginTop: '5px',
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: '#8a9070',
            background: '#0a0c14',
            border: `1px solid ${info.accentColor}22`,
            padding: '6px 8px',
            lineHeight: 1.5,
          }}>
            {info.atmosphere}
          </div>
        </div>

        {/* Description */}
        <div>
          <SectionLabel label="ANALYSIS" color={info.accentColor} />
          <p style={{
            marginTop: '5px',
            fontFamily: "'Courier New', monospace",
            fontSize: '9px',
            color: '#8899aa',
            lineHeight: 1.7,
            margin: '5px 0 0',
          }}>
            {info.description}
          </p>
        </div>

        {/* Key Facts */}
        <div>
          <SectionLabel label="HIGHLIGHTS" color={info.accentColor} />
          <div style={{ marginTop: '5px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {info.facts.map((f, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '5px 8px',
                background: '#0a0c14',
                border: `1px solid ${info.accentColor}18`,
                borderLeft: `2px solid ${info.accentColor}66`,
              }}>
                <span style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '8px',
                  color: '#4a5070',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}>
                  {f.label}
                </span>
                <span style={{
                  fontFamily: "'Courier New', monospace",
                  fontSize: '9px',
                  color: info.color,
                  fontWeight: 'bold',
                }}>
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pulse indicator */}
        <div style={{
          marginTop: '4px',
          padding: '6px 8px',
          background: `${info.color}08`,
          border: `1px solid ${info.color}22`,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <span style={{
            width: '6px', height: '6px', borderRadius: '50%',
            background: info.color,
            boxShadow: `0 0 6px ${info.color}`,
            animation: 'pulse-glow 1.5s ease-in-out infinite',
            flexShrink: 0,
          }} />
          <span style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '8px',
            color: info.accentColor + 'aa',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}>
            Telemetry locked · {info.name.toUpperCase()}
          </span>
        </div>
      </div>

      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
});

function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
    }}>
      <div style={{ width: '12px', height: '1px', background: color + '88' }} />
      <span style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '7px',
        color: color + 'aa',
        textTransform: 'uppercase',
        letterSpacing: '0.12em',
        fontWeight: 'bold',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: '1px', background: color + '18' }} />
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{
      background: '#0a0c14',
      border: `1px solid #161a26`,
      padding: '5px 7px',
    }}>
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '7px',
        color: '#2e3448',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        marginBottom: '2px',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '9px',
        color: color + 'cc',
        fontWeight: 'bold',
        lineHeight: 1.2,
      }}>
        {value}
      </div>
    </div>
  );
}
