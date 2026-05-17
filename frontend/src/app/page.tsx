'use client';

import { memo, Suspense, useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
const SceneContent = dynamic(() => import('@/components/SceneContent'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#020408',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '9px',
          color: '#4a5070',
          letterSpacing: '.08em',
        }}
      >
        Loading Space Simulation...
      </span>
    </div>
  ),
});

import ChatPanel from '@/components/UI/ChatPanel';
import LiveDataPanel from '@/components/UI/LiveDataPanel';
import StatusBar from '@/components/UI/StatusBar';
import NewsPanel from '@/components/NewsPanel';
import ISSTracker from '@/components/ISSTracker';
import AsteroidPanel from '@/components/AsteroidPanel';
import LaunchPanel from '@/components/LaunchPanel';
import PlanetInfoPanel from '@/components/UI/PlanetInfoPanel';
import SolarFlaresPanel from '@/components/panels/SolarFlaresPanel';
import MarsRoverPanel from '@/components/panels/MarsRoverPanel';
import DeepSpaceNetworkPanel from '@/components/panels/DeepSpaceNetworkPanel';
import JWSTPanel from '@/components/panels/JWSTPanel';
import ExoplanetPanel from '@/components/panels/ExoplanetPanel';
import ArtemisPanel from '@/components/panels/ArtemisPanel';
import VoyagerPanel from '@/components/panels/VoyagerPanel';
import PulsarPanel from '@/components/panels/PulsarPanel';
import { useSpaceStore } from '@/store/spaceStore';

/** Completely isolated overlay — reads store, never causes Home to re-render */
const PlanetInfoOverlay = memo(function PlanetInfoOverlay() {
  const show = useSpaceStore((state) => state.showInfoPanel);
  const planet = useSpaceStore((state) => state.currentCameraTarget);
  const closeInfoPanel = useSpaceStore((state) => state.closeInfoPanel);
  if (!show) return null;
  return <PlanetInfoPanel planet={planet} onClose={closeInfoPanel} />;
});

const PanelHeader = memo(function PanelHeader({
  title, status, statusColor = '#4a8c6f', locked = false
}: {
  title: string; status?: string; statusColor?: string; locked?: boolean;
}) {
  return (
    <div style={{
      height: '18px', padding: '0 6px',
      borderBottom: '1px solid #161a26', background: '#0a0c14',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        {locked && <span style={{ fontSize: '8px' }}>🔒</span>}
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '7px', color: '#6a7090', textTransform: 'uppercase', letterSpacing: '.05em', fontWeight: 600 }}>{title}</span>
      </div>
      {status && (
        <span style={{ fontFamily: "'Courier New', monospace", fontSize: '7px', color: statusColor }}>{status}</span>
      )}
    </div>
  );
});

const Panel = memo(function Panel({ children, header }: { children: React.ReactNode; header?: { title: string; status?: string; statusColor?: string; locked?: boolean } }) {
  return (
    <div style={{ background: '#0a0c14', display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
      {header && <PanelHeader {...header} />}
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative' }}>{children}</div>
    </div>
  );
});

const LockedPanel = memo(function LockedPanel({ title, category }: { title: string, category: string }) {
  return (
    <Panel header={{ title, status: category, statusColor: '#333', locked: true }}>
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.25 }}>
        <span style={{ fontSize: '10px', marginBottom: '6px' }}>🔒</span>
        <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '7px', color: '#a0a0a0', textTransform: 'uppercase' }}>Sign in to unlock</span>
        <button style={{ marginTop: '8px', background: '#cca022', border: 'none', color: '#000', fontSize: '7px', padding: '3px 8px', cursor: 'pointer', fontFamily: "'Courier New', monospace", fontWeight: 'bold' }}>
          AUTHORIZE
        </button>
      </div>
    </Panel>
  );
});

const EmbedFallback = memo(function EmbedFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: '#020408',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '9px',
          color: '#4a5070',
          letterSpacing: '.08em',
        }}
      >
        Loading Solar System...
      </span>
    </div>
  );
});

const Ticker = memo(function Ticker() {
  const [headlines, setHeadlines] = useState<string[]>([]);

  useEffect(() => {
    fetch('https://api.spaceflightnewsapi.net/v4/articles/?limit=5')
      .then((r) => r.json())
      .then((data) => {
        const titles = (data.results ?? []).map((a: { title: string }) => a.title);
        setHeadlines(titles);
      })
      .catch(() => { });
  }, []);

  const text = headlines.join('  ///  ');

  return (
    <div
      style={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        flex: 1,
        margin: '0 20px',
      }}
    >
      <span
        style={{
          display: 'inline-block',
          fontFamily: "'Courier New', monospace",
          fontSize: '8px',
          color: '#4a5070',
          textTransform: 'uppercase',
          animation: text ? 'scroll 30s linear infinite' : 'none',
        }}
      >
        {text || 'Scanning feeds...'}
      </span>
    </div>
  );
});

const ServerTime = memo(function ServerTime() {
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
    <span
      style={{
        fontFamily: "'Courier New', monospace",
        fontSize: '8px',
        color: '#4a5070',
      }}
    >
      UTC {time}
    </span>
  );
});

const TargetDisplay = memo(function TargetDisplay() {
  const target = useSpaceStore((state) => state.currentCameraTarget);
  return (
    <span style={{ fontFamily: "'Courier New', monospace", fontSize: '8px', color: '#e8d5a3' }}>
      Target: {target}
    </span>
  );
});

const Home = memo(function Home() {

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        height: '100%',
        overflowY: 'scroll',
        background: '#060810',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          height: '28px',
          background: '#040608',
          borderBottom: '1px solid #161a26',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
        }}
      >
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: '10px',
            color: '#e8d5a3',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
          }}
        >
          SPACE MONITOR v3.0
        </span>
        <Ticker />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            whiteSpace: 'nowrap',
          }}
        >
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '8px',
              color: '#4a8c6f',
            }}
          >
            ● AGENTIC AI: ONLINE
          </span>
          <TargetDisplay />
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: '8px',
              color: '#4a5070',
            }}
          >
            Latency: 45ms
          </span>
          <ServerTime />
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minHeight: 0 }}>
        {/* Global Overview Hero (40vh) */}
        <div style={{ height: '40vh', flexShrink: 0, borderBottom: '1px solid #161a26', display: 'flex', flexDirection: 'column' }}>
          <Panel
            header={{
              title: 'GLOBAL SITUATION // SOLAR SYSTEM MODEL',
              status: '● TELEMETRY',
              statusColor: '#00ff88',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <Suspense fallback={<EmbedFallback />}>
                <SceneContent />
              </Suspense>
              <PlanetInfoOverlay />
            </div>
          </Panel>
        </div>

        {/* Ultra-dense 6-Column Grid */}
        <div
          style={{
            flex: 1, overflowY: 'auto', display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridAutoRows: 'minmax(200px, 240px)',
            gap: '1px', background: '#161a26'
          }}
        >
          {/* Row 1 */}
          <div style={{ gridColumn: 'span 2' }}>
            <Panel header={{ title: 'LIVE FEED // NASA', status: '● REC', statusColor: '#ff0000' }}>
              <iframe
                width="100%" height="100%"
                src="https://www.youtube.com/embed/3F0XlKxaqbk?autoplay=1&mute=1"
                title="NASA Live Stream" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen style={{ border: 'none' }}
              />
            </Panel>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <Panel header={{ title: 'AI ANALYSIS // INTELLIGENCE', status: 'LIVE', statusColor: '#00ff00' }}>
              <ChatPanel />
            </Panel>
          </div>
          <div style={{ gridColumn: 'span 1' }}>
            <Panel header={{ title: 'ISS TRACKER // LEO', status: 'SECURE', statusColor: '#4a8c6f' }}>
              <ISSTracker />
            </Panel>
          </div>
          <div style={{ gridColumn: 'span 1' }}>
            <Panel header={{ title: 'LIVE LAUNCH FEED', status: '● REC', statusColor: '#ff0000' }}>
              <iframe
                width="100%" height="100%"
                src="https://www.youtube.com/embed/wbSwFU6tY1c?autoplay=1&mute=1&loop=1"
                title="Launch Live Stream" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen style={{ border: 'none' }}
              />
            </Panel>
          </div>

          {/* Row 2 */}
          <div style={{ gridColumn: 'span 1' }}>
            <Panel header={{ title: 'SPACE NEWS // GLOBAL FEED' }}>
              <NewsPanel />
            </Panel>
          </div>
          <div style={{ gridColumn: 'span 1' }}>
            <Panel header={{ title: 'NEO // ASTEROIDS' }}>
              <AsteroidPanel />
            </Panel>
          </div>
          <div style={{ gridColumn: 'span 1' }}>
            <Panel header={{ title: 'UPCOMING LAUNCHES' }}>
              <LaunchPanel />
            </Panel>
          </div>
          <div style={{ gridColumn: 'span 1' }}>
            <Panel header={{ title: 'SOLAR FLARES', status: 'NOAA SPACE WX', statusColor: '#ff0000' }}>
              <SolarFlaresPanel />
            </Panel>
          </div>
          <div style={{ gridColumn: 'span 1' }}>
            <Panel header={{ title: 'DEEP SPACE NETWORK', status: 'DSN LIVE', statusColor: '#00ff88' }}>
              <DeepSpaceNetworkPanel />
            </Panel>
          </div>
          <div style={{ gridColumn: 'span 1' }}>
            <Panel header={{ title: 'JAMES WEBB TELEMETRY', status: 'JWST OPS', statusColor: '#00ff88' }}>
              <JWSTPanel />
            </Panel>
          </div>

          <div style={{ gridColumn: 'span 1' }}>
            <Panel header={{ title: 'MARS PERSEVERANCE', status: 'MRO RELAY', statusColor: '#ffaa00' }}>
              <MarsRoverPanel />
            </Panel>
          </div>
          <div style={{ gridColumn: 'span 1' }}>
            <Panel header={{ title: 'EXOPLANETS', status: 'TESS MOC', statusColor: '#4a9fd8' }}>
              <ExoplanetPanel />
            </Panel>
          </div>
          <div style={{ gridColumn: 'span 1' }}>
            <Panel header={{ title: 'ARTEMIS OPS', status: 'LUNAR GATEWAY', statusColor: '#00ff88' }}>
              <ArtemisPanel />
            </Panel>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <Panel header={{ title: 'VOYAGER INTERSTELLAR', status: 'VGR-1 / VGR-2', statusColor: '#fff' }}>
              <VoyagerPanel />
            </Panel>
          </div>
          <div style={{ gridColumn: 'span 1' }}>
            <Panel header={{ title: 'PULSAR TIMING', status: 'CHANDRA X-RAY', statusColor: '#00eeff' }}>
              <PulsarPanel />
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
});

export default Home;