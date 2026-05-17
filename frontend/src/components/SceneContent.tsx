'use client';

import { useEffect, useRef, useState, useCallback, memo } from 'react';

import { useSpaceStore } from '@/store/spaceStore';

interface PlanetConfig {
  name: string;
  textureKey: string;
  fallbackColor: number;
  emissive: number;
  size: number;
  orbitRadius: number;
  speed: number;
  nasaId: string;
  shininess?: number;
  atmosphere?: number;
  hasSaturnRings?: boolean;
  cloudsKey?: string;
  banded?: boolean;
}

const PLANET_DATA: PlanetConfig[] = [
  { name: 'Mercury', textureKey: 'mercury', fallbackColor: 0xa09088, emissive: 0x100a00, size: 0.35, orbitRadius: 5.0,  speed: 0.0172, nasaId: '199', shininess: 15 },
  { name: 'Venus',   textureKey: 'venus',   fallbackColor: 0xe8d070, emissive: 0x604000, size: 0.75, orbitRadius: 7.8,  speed: 0.0125, nasaId: '299', shininess: 50, atmosphere: 0xffa040 },
  { name: 'Earth',   textureKey: 'earth',   fallbackColor: 0x3a8fd0, emissive: 0x001840, size: 0.85, orbitRadius: 11.0, speed: 0.0100, nasaId: '399', shininess: 80, atmosphere: 0x4488ff, cloudsKey: 'earth_clouds' },
  { name: 'Mars',    textureKey: 'mars',    fallbackColor: 0xc84020, emissive: 0x500800, size: 0.55, orbitRadius: 15.0, speed: 0.0081, nasaId: '499', shininess: 20, atmosphere: 0xff4400 },
  { name: 'Jupiter', textureKey: 'jupiter', fallbackColor: 0xc89050, emissive: 0x301800, size: 2.20, orbitRadius: 21.0, speed: 0.0044, nasaId: '599', shininess: 30 },
  { name: 'Saturn',  textureKey: 'saturn',  fallbackColor: 0xe0d080, emissive: 0x302000, size: 1.90, orbitRadius: 27.0, speed: 0.0034, nasaId: '699', shininess: 40, hasSaturnRings: true },
  { name: 'Uranus',  textureKey: 'uranus',  fallbackColor: 0x70dce0, emissive: 0x003030, size: 1.40, orbitRadius: 32.5, speed: 0.0020, nasaId: '799', shininess: 60, atmosphere: 0x00eeff },
  { name: 'Neptune', textureKey: 'neptune', fallbackColor: 0x4060e8, emissive: 0x001040, size: 1.30, orbitRadius: 37.0, speed: 0.0010, nasaId: '899', shininess: 70, atmosphere: 0x2255ff },
];

export default memo(function SceneContent() {
  const selectedPlanet = useSpaceStore((state) => state.currentCameraTarget);
  const lastAction = useSpaceStore((state) => state.lastCameraAction);
  const setCameraTarget = useSpaceStore((state) => state.setCameraTarget);
  const zoomToSelected = lastAction?.action === 'zoom';

  const mountRef        = useRef<HTMLDivElement>(null);
  const labelRef        = useRef<HTMLDivElement>(null);
  const rendererRef     = useRef<any>(null);
  const sceneRef        = useRef<any>(null);
  const cameraRef       = useRef<any>(null);
  const controlsRef     = useRef<any>(null);
  const planetMeshesRef = useRef<Map<string, any>>(new Map());
  const anglesRef       = useRef<Map<string, number>>(
    new Map(PLANET_DATA.map(p => [p.name, Math.random() * Math.PI * 2]))
  );
  const targetAnglesRef = useRef<Map<string, number | null>>(
    new Map(PLANET_DATA.map(p => [p.name, null]))
  );
  const animFrameRef = useRef<number>(0);
  const sunMeshRef   = useRef<any>(null);
  const sunLightRef  = useRef<any>(null);
  const elapsedRef   = useRef<number>(0);
  const lastTimeRef  = useRef<number>(0);
  
  // Mutable refs for useFrame equivalent in Vanilla JS
  const selectedRef  = useRef<string>(selectedPlanet);
  const zoomToSelectedRef = useRef(zoomToSelected);
  const camTargetPosRef = useRef<{ x: number; y: number; z: number } | null>(null);

  useEffect(() => { selectedRef.current = selectedPlanet; }, [selectedPlanet]);
  useEffect(() => { zoomToSelectedRef.current = zoomToSelected; }, [zoomToSelected]);

  // Pass setCameraTarget to onClickRef so the canvas click triggers the store directly
  const onClickRef   = useRef((name: string) => setCameraTarget(name, 'focus'));
  useEffect(() => { onClickRef.current = (name: string) => setCameraTarget(name, 'focus'); }, [setCameraTarget]);

  const [nasaStatus, setNasaStatus] = useState<'loading' | 'live' | 'error'>('loading');

  // ── NASA Horizons ──────────────────────────────────────────────────────
  const fetchNASA = useCallback(async () => {
    try {
      const now = new Date();
      const p2 = (n: number) => String(n).padStart(2, '0');
      const dateStr = `${now.getFullYear()}-${p2(now.getMonth()+1)}-${p2(now.getDate())}`;
      const timeStr = `${p2(now.getHours())}:${p2(now.getMinutes())}`;
      const results = await Promise.all(PLANET_DATA.map(async p => {
        try {
          const params = new URLSearchParams({ nasaId: p.nasaId, dateStr, timeStr });
          const res = await fetch(`/api/nasa-horizons?${params}`);
          if (!res.ok) return null;
          const data = await res.json();
          if (data.x !== undefined) return { name: p.name, angle: Math.atan2(data.y, data.x) };
        } catch {}
        return null;
      }));
      let any = false;
      results.forEach(r => { if (r) { targetAnglesRef.current.set(r.name, r.angle); any = true; } });
      setNasaStatus(any ? 'live' : 'error');
    } catch { setNasaStatus('error'); }
  }, []);

  useEffect(() => {
    fetchNASA();
    const iv = setInterval(fetchNASA, 60_000);
    return () => clearInterval(iv);
  }, [fetchNASA]);

  // ── Three.js init ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!mountRef.current) return;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import('three');
      const { OrbitControls } = await import(
        /* webpackChunkName:"orbit" */ 'three/examples/jsm/controls/OrbitControls.js'
      );

      const mount = mountRef.current!;
      if (!mount) return;
      const w = mount.clientWidth || 800;
      const h = mount.clientHeight || 500;

      // ── Renderer ────────────────────────────────────────────────────────
      const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(w, h);
      renderer.setClearColor(0x000005);
      renderer.toneMapping  = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.85;
      mount.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // ── Camera — low orbital-plane angle ────────────────────────────────
      const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
      camera.position.set(0, 12, 55);
      camera.lookAt(5, 0, 0);
      cameraRef.current = camera;

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.minDistance   = 3;
      controls.maxDistance   = 150;
      controls.enablePan     = false;
      controls.target.set(5, 0, 0);
      controls.update();
      controlsRef.current = controls;

      // ── Texture loader with graceful fallback ────────────────────────────
      const loader = new THREE.TextureLoader();
      const loadTex = (path: string): Promise<any> =>
        new Promise(resolve => loader.load(path, tex => {
          tex.colorSpace = THREE.SRGBColorSpace;
          resolve(tex);
        }, undefined, () => resolve(null)));

      // Load all textures in parallel
      const [
        sunTex, mercuryTex, venusTex, earthTex, cloudsTex,
        marsTex, jupiterTex, saturnTex, saturnRingTex, uranusTex, neptuneTex,
      ] = await Promise.all([
        loadTex('/textures/sun.jpg'),
        loadTex('/textures/mercury.jpg'),
        loadTex('/textures/venus.jpg'),
        loadTex('/textures/earth.jpg'),
        loadTex('/textures/earth_clouds.jpg'),
        loadTex('/textures/mars.jpg'),
        loadTex('/textures/jupiter.jpg'),
        loadTex('/textures/saturn.jpg'),
        loadTex('/textures/saturn_ring.png'),
        loadTex('/textures/uranus.jpg'),
        loadTex('/textures/neptune.jpg'),
      ]);

      const texMap: Record<string, any> = {
        mercury: mercuryTex, venus: venusTex, earth: earthTex,
        mars: marsTex, jupiter: jupiterTex, saturn: saturnTex,
        uranus: uranusTex, neptune: neptuneTex,
      };

      // ── Starfield (procedural — stars.jpg not downloaded) ───────────────
      const addStars = (count: number, rMin: number, rMax: number, bandFactor: number, col: [number,number,number]) => {
        const pos = new Float32Array(count * 3);
        const cols = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
          const r = rMin + Math.random() * (rMax - rMin);
          const theta = Math.random() * Math.PI * 2;
          const phi   = Math.acos(2 * Math.random() - 1);
          pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
          pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * (1 - bandFactor * 0.85);
          pos[i*3+2] = r * Math.cos(phi);
          const br = 0.5 + Math.random() * 0.5;
          cols[i*3]   = col[0] * br;
          cols[i*3+1] = col[1] * br;
          cols[i*3+2] = col[2] * br;
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        g.setAttribute('color',    new THREE.BufferAttribute(cols, 3));
        scene.add(new THREE.Points(g, new THREE.PointsMaterial({ size: 0.4, sizeAttenuation: true, vertexColors: true, transparent: true, opacity: 0.95 })));
      };
      addStars(7000, 180, 360, 0.0, [0.95,0.95,1.0]);   // background
      addStars(4000, 160, 300, 0.9, [1.0, 0.96,0.88]);  // Milky Way band
      addStars(1500, 200, 350, 0.0, [0.7, 0.8, 1.0]);   // blue-tinted
      addStars(300,  150, 250, 0.0, [1.0, 0.9, 0.5]);   // golden bright

      // ── Lighting ────────────────────────────────────────────────────────
      scene.add(new THREE.HemisphereLight(0x1a2840, 0x080408, 0.8));
      scene.add(new THREE.AmbientLight(0x334466, 1.2));
      // In modern Three.js (physically correct lighting), point lights decay via inverse square law.
      // A distance of 40 units requires an intensity in the thousands to be visible.
      const sunLight = new THREE.PointLight(0xfff5dd, 4000, 0, 2);
      scene.add(sunLight);
      sunLightRef.current = sunLight;

      // ── Sun ─────────────────────────────────────────────────────────────
      const sunGeom = new THREE.SphereGeometry(2.1, 64, 64);
      const sunMat  = new THREE.MeshStandardMaterial({
        map: sunTex ?? undefined,
        color: sunTex ? 0xffffff : 0xffe060,
        emissive:           new THREE.Color(0xffaa00),
        emissiveMap:        sunTex ?? undefined,
        emissiveIntensity:  sunTex ? 1.2 : 2.8,
        roughness: 1, metalness: 0,
      });
      const sunMesh = new THREE.Mesh(sunGeom, sunMat);
      sunMesh.userData = { name: 'Sun' };
      scene.add(sunMesh);
      sunMeshRef.current = sunMesh;

      // Sun glow layers
      [{ r:2.8, o:0.10, c:0xffcc44 }, { r:4.2, o:0.05, c:0xff8800 }, { r:6.0, o:0.02, c:0xff5500 }].forEach(g =>
        scene.add(new THREE.Mesh(
          new THREE.SphereGeometry(g.r, 24, 24),
          new THREE.MeshBasicMaterial({ color: g.c, transparent: true, opacity: g.o, side: THREE.BackSide })
        ))
      );

      // ── Orbit rings + planets ────────────────────────────────────────────
      for (const p of PLANET_DATA) {
        // Orbit ring
        const pts: any[] = [];
        for (let i = 0; i <= 320; i++) {
          const a = (i / 320) * Math.PI * 2;
          pts.push(new THREE.Vector3(Math.cos(a) * p.orbitRadius, 0, Math.sin(a) * p.orbitRadius));
        }
        scene.add(new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(pts),
          new THREE.LineBasicMaterial({ color: 0x334466, transparent: true, opacity: 0.55 })
        ));

        // Planet mesh
        const tex = texMap[p.textureKey] ?? null;
        const mat = new THREE.MeshStandardMaterial({
          map:      tex,
          color:    tex ? 0xffffff : p.fallbackColor,
          emissive: new THREE.Color(p.emissive),
          roughness: p.banded ? 0.4 : 0.8, // Gas giants slightly smoother
          metalness: 0.1,
        });

        const mesh = new THREE.Mesh(new THREE.SphereGeometry(p.size, 64, 64), mat);
        mesh.userData = { name: p.name, cfg: p };
        const angle = anglesRef.current.get(p.name) ?? 0;
        mesh.position.set(Math.cos(angle) * p.orbitRadius, 0, Math.sin(angle) * p.orbitRadius);
        scene.add(mesh);
        planetMeshesRef.current.set(p.name, mesh);

        // Earth cloud layer
        if (p.cloudsKey && cloudsTex) {
          const cloudMesh = new THREE.Mesh(
            new THREE.SphereGeometry(p.size * 1.015, 64, 64),
            new THREE.MeshStandardMaterial({
              map: cloudsTex, transparent: true, opacity: 0.8,
              roughness: 0.9, depthWrite: false,
            })
          );
          mesh.add(cloudMesh);
          // Clouds rotate slightly faster than planet
          (cloudMesh as any).userData.isCloud = true;
        }

        // Atmosphere glow
        if (p.atmosphere) {
          mesh.add(new THREE.Mesh(
            new THREE.SphereGeometry(p.size * 1.22, 24, 24),
            new THREE.MeshBasicMaterial({ color: p.atmosphere, transparent: true, opacity: 0.08, side: THREE.BackSide })
          ));
        }

        // Saturn ring system
        if (p.hasSaturnRings) {
          // Use real ring texture if available, else fallback color
          const ringMat1 = new THREE.MeshBasicMaterial({
            map:         saturnRingTex ?? undefined,
            alphaMap:    saturnRingTex ?? undefined,
            color:       saturnRingTex ? 0xffffff : 0xd4b870,
            side:        THREE.DoubleSide,
            transparent: true,
            opacity:     saturnRingTex ? 1.0 : 0.75,
          });
          const ringGeom = new THREE.RingGeometry(p.size * 1.35, p.size * 2.8, 128);
          
          // Re-map UVs radially so a 1D strip texture curls around the ring correctly
          const pos = ringGeom.attributes.position;
          const uvs = ringGeom.attributes.uv;
          for (let i = 0; i < uvs.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const radius = Math.sqrt(x * x + y * y);
            // Map u from 0 (inner) to 1 (outer)
            uvs.setX(i, (radius - p.size * 1.35) / (p.size * 2.8 - p.size * 1.35));
            uvs.setY(i, 0.5);
          }

          const rInner = new THREE.Mesh(ringGeom, ringMat1);
          rInner.rotation.x = Math.PI / 2 - 0.45;
          rInner.rotation.y = 0.2;
          mesh.add(rInner);

          if (!saturnRingTex) {
            // Fallback: add second faded ring band
            const rOuter = new THREE.Mesh(
              new THREE.RingGeometry(p.size * 2.85, p.size * 3.2, 80),
              new THREE.MeshBasicMaterial({ color: 0xb89840, side: THREE.DoubleSide, transparent: true, opacity: 0.35 })
            );
            rOuter.rotation.x = Math.PI / 2 - 0.45;
            rOuter.rotation.y = 0.2;
            mesh.add(rOuter);
          }
        }
      }

      // ── Raycaster / click / hover ──────────────────────────────────────
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let mdX = 0, mdY = 0;

      const onMouseDown = (e: MouseEvent) => { mdX = e.clientX; mdY = e.clientY; };
      const onClick = (e: MouseEvent) => {
        if (Math.hypot(e.clientX-mdX, e.clientY-mdY) > 6) return;
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
        mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects([sunMesh, ...planetMeshesRef.current.values()], true);
        if (!hits.length) return;
        let obj: any = hits[0].object;
        while (obj && !obj.userData?.name) obj = obj.parent;
        if (obj?.userData?.name) onClickRef.current(obj.userData.name);
      };
      const onMouseMove = (e: MouseEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
        mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);
        const hits = raycaster.intersectObjects([sunMesh, ...planetMeshesRef.current.values()], true);
        renderer.domElement.style.cursor = hits.length ? 'pointer' : 'grab';
      };
      renderer.domElement.addEventListener('mousedown', onMouseDown);
      renderer.domElement.addEventListener('click',     onClick);
      renderer.domElement.addEventListener('mousemove', onMouseMove);

      // ── Resize ────────────────────────────────────────────────────────
      const onResize = () => {
        const el = mountRef.current; if (!el) return;
        renderer.setSize(el.clientWidth, el.clientHeight);
        camera.aspect = el.clientWidth / el.clientHeight;
        camera.updateProjectionMatrix();
      };
      const ro = new ResizeObserver(onResize);
      ro.observe(mount);

      // ── Animation loop ────────────────────────────────────────────────
      const animate = (ts: number) => {
        animFrameRef.current = requestAnimationFrame(animate);
        const delta = Math.min((ts - (lastTimeRef.current || ts)) / 1000, 0.05);
        lastTimeRef.current  = ts;
        elapsedRef.current  += delta;
        const t = elapsedRef.current;

        for (const p of PLANET_DATA) {
          const mesh = planetMeshesRef.current.get(p.name); if (!mesh) continue;
          let angle = anglesRef.current.get(p.name) ?? 0;
          angle += p.speed * delta;
          const tgt = targetAnglesRef.current.get(p.name);
          if (tgt !== null && tgt !== undefined) {
            angle += (((tgt - angle + Math.PI) % (Math.PI * 2)) - Math.PI) * 0.0008;
          }
          anglesRef.current.set(p.name, angle);
          mesh.position.set(Math.cos(angle) * p.orbitRadius, 0, Math.sin(angle) * p.orbitRadius);

          // Planet self-rotation
          const spinSpeed = p.name === 'Jupiter' ? 0.55 : p.name === 'Saturn' ? 0.22 : 0.32;
          mesh.rotation.y += delta * spinSpeed;

          // Cloud layer rotation (slightly faster)
          mesh.children.forEach((child: any) => {
            if (child.userData?.isCloud) child.rotation.y += delta * 0.45;
          });
        }

        // Sun animation
        if (sunMeshRef.current) {
          sunMeshRef.current.rotation.y += delta * 0.04;
          if (sunTex) {
            sunMeshRef.current.material.emissiveIntensity = 1.2 + Math.sin(t * 1.4) * 0.15;
          } else {
            sunMeshRef.current.material.emissiveIntensity = 2.8 + Math.sin(t * 1.4) * 0.4;
          }
        }
        if (sunLightRef.current) {
          sunLightRef.current.intensity = 4000 + Math.sin(t * 0.8) * 400;
        }

        // Selected planet emissive pulse
        const sel = selectedRef.current;
        for (const p of PLANET_DATA) {
          const mesh = planetMeshesRef.current.get(p.name); if (!mesh) continue;
          if (sel === p.name) {
            const f = 1 + Math.sin(t * 2.5) * 0.3;
            const r = ((p.emissive >> 16) & 0xff) / 255;
            const g = ((p.emissive >> 8)  & 0xff) / 255;
            const b = (p.emissive         & 0xff) / 255;
            mesh.material.emissive.setRGB(Math.min(r*f+0.08,1), Math.min(g*f+0.08,1), Math.min(b*f+0.08,1));
          } else {
            mesh.material.emissive.setHex(p.emissive);
          }
        }

        // Smooth camera target → selected planet
        const selMesh = sel === 'Sun' ? sunMeshRef.current : planetMeshesRef.current.get(sel);
        if (selMesh && controlsRef.current) {
          const ct = controlsRef.current.target;
          ct.x += (selMesh.position.x - ct.x) * 0.04;
          ct.y += (selMesh.position.y - ct.y) * 0.04;
          ct.z += (selMesh.position.z - ct.z) * 0.04;
        }

        // Fly camera close to planet when zoomToSelected is true
        if (zoomToSelectedRef.current && selMesh && cameraRef.current) {
          const cfg = PLANET_DATA.find(p => p.name === sel);
          const closeD = cfg ? cfg.size * 5 + 3 : 8;
          const tgt = selMesh.position;
          const desired = {
            x: tgt.x + closeD * 0.6,
            y: tgt.y + closeD * 0.4,
            z: tgt.z + closeD,
          };
          const cam = cameraRef.current;
          cam.position.x += (desired.x - cam.position.x) * 0.025;
          cam.position.y += (desired.y - cam.position.y) * 0.025;
          cam.position.z += (desired.z - cam.position.z) * 0.025;
        }

        // Floating label: update position via DOM ref without React re-render
        if (labelRef.current && selMesh && mountRef.current) {
          const vec = selMesh.position.clone().project(camera);
          const mw  = mountRef.current.clientWidth;
          const mh  = mountRef.current.clientHeight;
          labelRef.current.style.left    = `${(vec.x + 1) / 2 * mw}px`;
          labelRef.current.style.top     = `${-(vec.y - 1) / 2 * mh - (selMesh.userData.cfg?.size ?? 1) * 28 - 16}px`;
          labelRef.current.style.opacity = '1';
          if (labelRef.current.textContent !== sel) labelRef.current.textContent = sel.toUpperCase();
        }

        controls.update();
        renderer.render(scene, camera);
      };
      animFrameRef.current = requestAnimationFrame(animate);

      cleanup = () => {
        cancelAnimationFrame(animFrameRef.current);
        ro.disconnect();
        renderer.domElement.removeEventListener('mousedown', onMouseDown);
        renderer.domElement.removeEventListener('click',     onClick);
        renderer.domElement.removeEventListener('mousemove', onMouseMove);
        renderer.dispose();
        if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
        planetMeshesRef.current.clear();
        rendererRef.current = cameraRef.current = controlsRef.current = sceneRef.current = null;
      };
    })();

    return () => cleanup?.();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%', background: '#000005', position: 'relative' }}>
      {/* Floating planet name label */}
      <div
        ref={labelRef}
        style={{
          position: 'absolute',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          opacity: 0,
          transition: 'opacity 0.25s',
          fontFamily: "'Courier New', monospace",
          fontSize: '11px',
          fontWeight: 'bold',
          color: '#e8d5a3',
          letterSpacing: '0.14em',
          textShadow: '0 0 8px rgba(232,213,163,0.9), 0 0 20px rgba(232,213,163,0.5)',
          background: 'rgba(2,4,8,0.65)',
          border: '1px solid rgba(232,213,163,0.3)',
          borderRadius: '2px',
          padding: '2px 8px',
          whiteSpace: 'nowrap',
          zIndex: 10,
        }}
      />
      {/* NASA status */}
      <div style={{
        position: 'absolute', bottom: 6, left: 8, zIndex: 5, pointerEvents: 'none',
        fontFamily: "'Courier New', monospace", fontSize: '8px', letterSpacing: '.06em', textTransform: 'uppercase',
        color: nasaStatus === 'live' ? '#4a8c6f' : nasaStatus === 'error' ? '#c0473a' : '#c8a840',
      }}>
        {nasaStatus === 'live' ? '● NASA HORIZONS — LIVE' : nasaStatus === 'error' ? '● SIMULATED ORBITS' : '● SYNCING...'}
      </div>
      {/* Controls hint */}
      <div style={{
        position: 'absolute', bottom: 6, right: 8, zIndex: 5, pointerEvents: 'none',
        fontFamily: "'Courier New', monospace", fontSize: '7px', letterSpacing: '.06em', color: '#2a3050',
      }}>
        DRAG · SCROLL · CLICK PLANET
      </div>
    </div>
  );
});