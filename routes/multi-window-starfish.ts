import { useEffect, useRef, useState } from "react";

type WindowSnapshot = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  updatedAt: number;
};

type SceneSnapshot = {
  seed: number;
  hue: number;
  pulseAt: number;
  pulsePower: number;
};

const LAYOUT_KEY = "zo:multi-window-starfish:layout";
const SCENE_KEY = "zo:multi-window-starfish:scene";
const WINDOW_TTL_MS = 4000;

function makeDefaultScene(): SceneSnapshot {
  return {
    seed: 1729,
    hue: 18,
    pulseAt: Date.now(),
    pulsePower: 0.6,
  };
}

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function hash(seed: number) {
  return (value: number) => {
    const raw = Math.sin(seed * 97.13 + value * 12.9898) * 43758.5453;
    return raw - Math.floor(raw);
  };
}

export default function MultiWindowStarfish() {
  const mountRef = useRef<HTMLDivElement>(null);
  const windowIdRef = useRef("");
  const layoutRef = useRef<WindowSnapshot[]>([]);
  const sceneRef = useRef<SceneSnapshot>(makeDefaultScene());
  const sceneVersionRef = useRef(0);
  const [windowCount, setWindowCount] = useState(1);
  const [isChild, setIsChild] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);

  useEffect(() => {
    setIsChild(new URLSearchParams(window.location.search).has("child"));
  }, []);

  useEffect(() => {
    const initialScene = readJson<SceneSnapshot>(SCENE_KEY, makeDefaultScene());
    sceneRef.current = initialScene;
    if (!window.localStorage.getItem(SCENE_KEY)) {
      writeJson(SCENE_KEY, initialScene);
    }

    const id = window.crypto?.randomUUID?.() ?? `starfish-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    windowIdRef.current = id;

    const measureWindow = (): WindowSnapshot => ({
      id,
      x: window.screenX ?? (window as Window & { screenLeft?: number }).screenLeft ?? 0,
      y: window.screenY ?? (window as Window & { screenTop?: number }).screenTop ?? 0,
      width: window.outerWidth || window.innerWidth,
      height: window.outerHeight || window.innerHeight,
      updatedAt: Date.now(),
    });

    const persistSelf = () => {
      const now = Date.now();
      const next = readJson<WindowSnapshot[]>(LAYOUT_KEY, [])
        .filter((entry) => now - entry.updatedAt < WINDOW_TTL_MS && entry.id !== id)
        .concat(measureWindow());
      layoutRef.current = next;
      writeJson(LAYOUT_KEY, next);
      setWindowCount(next.length);
      const index = next.findIndex((entry) => entry.id === id);
      document.title = `Starfish Sea ${index >= 0 ? `· Window ${index + 1}` : ""}`;
    };

    const removeSelf = () => {
      const next = readJson<WindowSnapshot[]>(LAYOUT_KEY, []).filter((entry) => entry.id !== id);
      layoutRef.current = next;
      writeJson(LAYOUT_KEY, next);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === LAYOUT_KEY) {
        const next = readJson<WindowSnapshot[]>(LAYOUT_KEY, []).filter((entry) => Date.now() - entry.updatedAt < WINDOW_TTL_MS);
        layoutRef.current = next;
        setWindowCount(Math.max(next.length, 1));
      }
      if (event.key === SCENE_KEY) {
        sceneRef.current = readJson<SceneSnapshot>(SCENE_KEY, makeDefaultScene());
        sceneVersionRef.current += 1;
      }
    };

    persistSelf();
    const heartbeat = window.setInterval(persistSelf, 900);
    window.addEventListener("storage", onStorage);
    window.addEventListener("resize", persistSelf);
    window.addEventListener("beforeunload", removeSelf);
    window.addEventListener("pagehide", removeSelf);

    return () => {
      window.clearInterval(heartbeat);
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("resize", persistSelf);
      window.removeEventListener("beforeunload", removeSelf);
      window.removeEventListener("pagehide", removeSelf);
      removeSelf();
    };
  }, []);

  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      const THREE = await import("https://esm.sh/three@0.160.1");
      if (disposed || !mountRef.current) return;

      const mount = mountRef.current;
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      mount.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 2.9, 8.8);

      const hemi = new THREE.HemisphereLight(0xd5f5ff, 0xf7ba73, 2.4);
      scene.add(hemi);

      const sun = new THREE.DirectionalLight(0xfff2c2, 2.7);
      sun.position.set(4, 7, 5);
      scene.add(sun);

      const fill = new THREE.PointLight(0x7ad9ff, 20, 24, 2);
      fill.position.set(-5, 3, 6);
      scene.add(fill);

      const sand = new THREE.Mesh(
        new THREE.CylinderGeometry(8.6, 10.4, 0.8, 72, 1, false),
        new THREE.MeshStandardMaterial({ color: "#e4b06b", roughness: 0.96, metalness: 0 })
      );
      sand.position.y = -2.4;
      scene.add(sand);

      const water = new THREE.Mesh(
        new THREE.CircleGeometry(8.4, 96),
        new THREE.MeshPhysicalMaterial({
          color: "#6dd8ef",
          transparent: true,
          opacity: 0.24,
          transmission: 0.4,
          roughness: 0.18,
          metalness: 0,
          ior: 1.2,
        })
      );
      water.rotation.x = -Math.PI / 2;
      water.position.y = 0.35;
      scene.add(water);

      const bubbles = new THREE.Points(
        new THREE.BufferGeometry(),
        new THREE.PointsMaterial({ color: "#dbf7ff", size: 0.08, transparent: true, opacity: 0.75 })
      );
      const bubblePositions = new Float32Array(120 * 3);
      for (let i = 0; i < 120; i += 1) {
        bubblePositions[i * 3] = (Math.random() - 0.5) * 10;
        bubblePositions[i * 3 + 1] = Math.random() * 7 - 2;
        bubblePositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
      bubbles.geometry.setAttribute("position", new THREE.BufferAttribute(bubblePositions, 3));
      scene.add(bubbles);

      const starfishGroup = new THREE.Group();
      scene.add(starfishGroup);

      const createStarfish = () => {
        const shape = new THREE.Shape();
        const spikes = 5;
        const outer = 1.05;
        const inner = 0.42;
        for (let i = 0; i < spikes * 2; i += 1) {
          const radius = i % 2 === 0 ? outer : inner;
          const angle = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) shape.moveTo(x, y);
          else shape.lineTo(x, y);
        }
        shape.closePath();
        const geometry = new THREE.ExtrudeGeometry(shape, {
          depth: 0.22,
          bevelEnabled: true,
          bevelSegments: 2,
          bevelSize: 0.08,
          bevelThickness: 0.05,
          curveSegments: 20,
        });
        geometry.center();
        return geometry;
      };

      const starGeometry = createStarfish();
      const starEntries: Array<{
        mesh: any;
        material: any;
        orbit: number;
        height: number;
        speed: number;
        spin: number;
        scale: number;
        phase: number;
      }> = [];

      for (let i = 0; i < 9; i += 1) {
        const material = new THREE.MeshStandardMaterial({
          color: "#ff8455",
          roughness: 0.88,
          metalness: 0.02,
          emissive: "#2d1008",
          emissiveIntensity: 0.08,
        });
        const mesh = new THREE.Mesh(starGeometry, material);
        mesh.rotation.x = -1.2;
        starfishGroup.add(mesh);
        starEntries.push({
          mesh,
          material,
          orbit: 2.2,
          height: 0,
          speed: 1,
          spin: 1,
          scale: 1,
          phase: 0,
        });
      }

      const applyScene = () => {
        const current = sceneRef.current;
        const random = hash(current.seed);
        scene.background = new THREE.Color().setHSL(0.54, 0.72, 0.73);
        starEntries.forEach((entry, index) => {
          const orbit = 1.4 + random(index + 1) * 3.6;
          const angle = random(index + 11) * Math.PI * 2;
          const height = -1.7 + random(index + 21) * 1.8;
          const scale = 0.42 + random(index + 31) * 0.85;
          const hue = ((current.hue + index * 19 + random(index + 41) * 24) % 360) / 360;
          entry.orbit = orbit;
          entry.phase = angle;
          entry.height = height;
          entry.scale = scale;
          entry.speed = 0.35 + random(index + 51) * 0.6;
          entry.spin = 0.25 + random(index + 61) * 0.7;
          entry.material.color.setHSL(hue, 0.86, 0.61);
          entry.material.emissive.setHSL(hue, 0.72, 0.15);
          entry.mesh.scale.setScalar(scale);
        });
      };

      applyScene();
      let appliedVersion = sceneVersionRef.current;

      const resize = () => {
        const width = mount.clientWidth || 1;
        const height = mount.clientHeight || 1;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const updateViewOffset = () => {
        const layout = layoutRef.current.filter((entry) => Date.now() - entry.updatedAt < WINDOW_TTL_MS);
        const self = layout.find((entry) => entry.id === windowIdRef.current);
        if (!self || layout.length <= 1) {
          camera.clearViewOffset();
          return;
        }
        const minX = Math.min(...layout.map((entry) => entry.x));
        const minY = Math.min(...layout.map((entry) => entry.y));
        const maxX = Math.max(...layout.map((entry) => entry.x + entry.width));
        const maxY = Math.max(...layout.map((entry) => entry.y + entry.height));
        const totalWidth = Math.max(1, maxX - minX);
        const totalHeight = Math.max(1, maxY - minY);
        camera.setViewOffset(totalWidth, totalHeight, self.x - minX, self.y - minY, self.width, self.height);
        camera.updateProjectionMatrix();
      };

      const clock = new THREE.Clock();
      let frameId = 0;

      const render = () => {
        const elapsed = clock.getElapsedTime();
        if (appliedVersion !== sceneVersionRef.current) {
          appliedVersion = sceneVersionRef.current;
          applyScene();
        }
        updateViewOffset();

        const pulseAge = (Date.now() - sceneRef.current.pulseAt) / 1000;
        const pulse = pulseAge < 2.5 ? Math.sin(pulseAge * 10) * Math.exp(-pulseAge * 1.8) * sceneRef.current.pulsePower : 0;

        starEntries.forEach((entry, index) => {
          const orbitAngle = elapsed * entry.speed + entry.phase;
          entry.mesh.position.set(
            Math.cos(orbitAngle) * entry.orbit,
            entry.height + Math.sin(elapsed * (0.8 + index * 0.05)) * 0.18,
            Math.sin(orbitAngle) * entry.orbit * 0.72
          );
          entry.mesh.rotation.z = orbitAngle * entry.spin;
          entry.mesh.rotation.y = Math.sin(elapsed * 0.7 + index) * 0.3;
          const pulseScale = 1 + pulse * (0.05 + index * 0.008);
          entry.mesh.scale.setScalar(entry.scale * pulseScale);
        });

        water.rotation.z = elapsed * 0.025;
        water.position.y = 0.35 + Math.sin(elapsed * 1.3) * 0.06;
        sand.rotation.y = elapsed * 0.035;
        bubbles.rotation.y = elapsed * 0.03;
        bubbles.position.y = Math.sin(elapsed * 0.6) * 0.2;

        renderer.render(scene, camera);
        frameId = window.requestAnimationFrame(render);
      };

      resize();
      render();
      window.addEventListener("resize", resize);

      cleanup = () => {
        window.cancelAnimationFrame(frameId);
        window.removeEventListener("resize", resize);
        starGeometry.dispose();
        sand.geometry.dispose();
        (sand.material as any).dispose();
        water.geometry.dispose();
        (water.material as any).dispose();
        bubbles.geometry.dispose();
        (bubbles.material as any).dispose();
        starEntries.forEach((entry) => entry.material.dispose());
        renderer.dispose();
        mount.innerHTML = "";
      };
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  const openWindow = () => {
    const index = windowCount + 1;
    const left = 70 + ((index - 1) % 4) * 80;
    const top = 70 + ((index - 1) % 3) * 70;
    const child = window.open(`${window.location.pathname}?child=1&slot=${index}`, "_blank", `popup=yes,width=620,height=420,left=${left},top=${top}`);
    setPopupBlocked(!child);
    child?.focus();
  };

  const randomizeShoal = () => {
    const next: SceneSnapshot = {
      seed: Math.floor(Math.random() * 100000),
      hue: Math.floor(Math.random() * 360),
      pulseAt: Date.now(),
      pulsePower: 0.9,
    };
    sceneRef.current = next;
    sceneVersionRef.current += 1;
    writeJson(SCENE_KEY, next);
  };

  const sendPulse = () => {
    const next: SceneSnapshot = {
      ...sceneRef.current,
      pulseAt: Date.now(),
      pulsePower: 0.8 + Math.random() * 0.7,
    };
    sceneRef.current = next;
    sceneVersionRef.current += 1;
    writeJson(SCENE_KEY, next);
  };

  const resetLayout = () => {
    window.localStorage.removeItem(LAYOUT_KEY);
    const next = makeDefaultScene();
    sceneRef.current = next;
    sceneVersionRef.current += 1;
    writeJson(SCENE_KEY, next);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#7fd9ff_0%,#92e7f8_20%,#b7f6ff_38%,#ffe4aa_70%,#ffb96d_100%)] text-[#11354a]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.75),transparent_34%),radial-gradient(circle_at_20%_65%,rgba(255,255,255,0.24),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.3),transparent_22%)]" />
      <div className="absolute inset-x-0 bottom-0 h-[38vh] bg-[radial-gradient(circle_at_50%_0%,rgba(255,243,214,0.55),rgba(255,185,109,0.88)_58%,rgba(231,132,73,0.96)_100%)]" />
      <main className="relative flex min-h-screen flex-col">
        <section className={`px-5 ${isChild ? "pt-4" : "pt-6"} sm:px-8`}>
          <div className="mx-auto flex max-w-6xl flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded-full border border-white/50 bg-white/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#0e5777] backdrop-blur">
                localStorage shared viewport demo
              </div>
              <h1 className={`mt-3 font-black tracking-[-0.05em] text-[#0b3d56] ${isChild ? "text-4xl sm:text-5xl" : "text-5xl sm:text-6xl lg:text-7xl"}`}>
                Starfish Sea
              </h1>
              {!isChild && (
                <p className="mt-3 max-w-xl text-sm leading-6 text-[#15506e] sm:text-base">
                  Open a few windows and drag them around. Each one writes its bounds into <code>localStorage</code>, so the same Three.js reef stretches across the full group like one broken-apart aquarium wall.
                </p>
              )}
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:w-[420px]">
              <button onClick={openWindow} className="rounded-2xl bg-[#0d5877] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(13,88,119,0.28)] transition hover:-translate-y-0.5 hover:bg-[#0b4861]">
                Open another window
              </button>
              <button onClick={sendPulse} className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold text-[#0d5877] shadow-[0_18px_50px_rgba(255,255,255,0.25)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white">
                Send ripple
              </button>
              <button onClick={randomizeShoal} className="rounded-2xl bg-white/80 px-4 py-3 text-sm font-semibold text-[#0d5877] shadow-[0_18px_50px_rgba(255,255,255,0.25)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white">
                Randomize shoal
              </button>
              <button onClick={resetLayout} className="rounded-2xl bg-[#f58658] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_50px_rgba(245,134,88,0.3)] transition hover:-translate-y-0.5 hover:bg-[#eb6f43]">
                Reset shared state
              </button>
            </div>
          </div>
          <div className="mx-auto mt-4 flex max-w-6xl flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#1d6789]/80">
            <span>{windowCount} active window{windowCount === 1 ? "" : "s"}</span>
            <span>{isChild ? "child viewport" : "control window"}</span>
            {popupBlocked ? <span>popup blocked</span> : null}
          </div>
        </section>

        <section className="relative flex-1 px-4 pb-5 pt-4 sm:px-8 sm:pb-8">
          <div className="mx-auto h-[58vh] min-h-[420px] max-w-6xl overflow-hidden rounded-[2rem] border border-white/55 bg-white/18 shadow-[0_30px_120px_rgba(15,78,111,0.24)] backdrop-blur-md">
            <div ref={mountRef} className="h-full w-full" onClick={sendPulse} />
          </div>
          {!isChild && (
            <div className="mx-auto mt-4 max-w-6xl text-sm leading-6 text-[#15506e]">
              Best effect: click <strong>Open another window</strong> two or three times, then arrange the windows side by side. The scene stays in sync with no server and no websocket layer, just browser storage events and periodic window-bound updates.
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
