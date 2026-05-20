import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "https://esm.sh/three@0.175.0";

type Venture = {
  id: string;
  name: string;
  subtitle: string;
  summary: string;
  tag: string;
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  roof: number;
  body: string;
  trim: string;
};

const VENTURES: Venture[] = [
  {
    id: "book",
    name: "book",
    subtitle: "Knowledge base headquarters",
    summary: "Living archive, daily heartbeat, and command center for the whole vault.",
    tag: "HQ",
    x: 0,
    z: 0,
    w: 12,
    d: 12,
    h: 18,
    roof: 2.4,
    body: "#64748b",
    trim: "#f8fafc",
  },
  {
    id: "wazoo",
    name: "Wazoo",
    subtitle: "World-models as a service",
    summary: "AI startup building structured knowledge bases and persistent memory for agents.",
    tag: "Research",
    x: 0,
    z: -30,
    w: 10,
    d: 10,
    h: 18,
    roof: 2.0,
    body: "#f97316",
    trim: "#fed7aa",
  },
  {
    id: "fartlabs",
    name: "FartLabs",
    subtitle: "Open-source collective",
    summary: "TypeScript research lab and community pushing the boundaries of web tooling.",
    tag: "OSS",
    x: -22,
    z: -22,
    w: 10,
    d: 10,
    h: 16,
    roof: 1.8,
    body: "#a855f7",
    trim: "#ddd6fe",
  },
  {
    id: "zo-ambassador",
    name: "Zo ambassador",
    subtitle: "Community and OSS credibility",
    summary: "The technical ambassador lane for showing useful work, writing, and visible contributions.",
    tag: "Community",
    x: 30,
    z: 0,
    w: 10,
    d: 10,
    h: 15,
    roof: 1.8,
    body: "#06b6d4",
    trim: "#cffafe",
  },
  {
    id: "zo-computer",
    name: "Zo Computer",
    subtitle: "Personal AI workstation",
    summary: "The home server, chat surface, and automation layer that powers the rest of the system.",
    tag: "Platform",
    x: 22,
    z: -22,
    w: 9,
    d: 9,
    h: 14,
    roof: 1.6,
    body: "#0ea5e9",
    trim: "#dbeafe",
  },
  {
    id: "studio-wazoo",
    name: "Studio Wazoo",
    subtitle: "Web design + archive services",
    summary: "Agent-native web design, AI integration, and personal library services for preserving information.",
    tag: "Studio",
    x: 22,
    z: 22,
    w: 10,
    d: 10,
    h: 15,
    roof: 1.8,
    body: "#ec4899",
    trim: "#fce7f3",
  },
  {
    id: "computer-lane",
    name: "Computer Lane",
    subtitle: "Coworking and physical hub",
    summary: "The Huntington Beach coworking and maker-space pivot for operator-led community growth.",
    tag: "Space",
    x: 0,
    z: 30,
    w: 12,
    d: 12,
    h: 19,
    roof: 2.0,
    body: "#22c55e",
    trim: "#dcfce7",
  },
  {
    id: "etok-me",
    name: "etok.me",
    subtitle: "Personal brand and portfolio",
    summary: "A rework-in-progress personal site that should become a clearer, more intentional home.",
    tag: "Brand",
    x: -22,
    z: 22,
    w: 9,
    d: 9,
    h: 13,
    roof: 1.6,
    body: "#f59e0b",
    trim: "#fef3c7",
  },
  {
    id: "global-art-project",
    name: "Global art project",
    subtitle: "24-hour hybrid event",
    summary: "Zo Day / Zotopia / Zoella style global art activation for ambassadors and schools.",
    tag: "Event",
    x: -30,
    z: 0,
    w: 10,
    d: 10,
    h: 15,
    roof: 1.8,
    body: "#8b5cf6",
    trim: "#ede9fe",
  },
];

const MOVE_SPEED = 11.5;
const RUN_MULTIPLIER = 1.65;
const CAMERA_HEIGHT = 7.5;
const CAMERA_DISTANCE = 11.5;
const CAMERA_SMOOTH = 0.09;
const PLAYER_RADIUS = 1.1;

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && ctx.measureText(next).width > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function createTexture(width: number, height: number, paint: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to create canvas context");
  paint(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makeFacadeTexture(venture: Venture) {
  return createTexture(512, 512, (ctx) => {
    const bg = ctx.createLinearGradient(0, 0, 512, 512);
    bg.addColorStop(0, venture.body);
    bg.addColorStop(0.45, "#111827");
    bg.addColorStop(1, venture.trim);
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = "rgba(2,6,23,0.45)";
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = "rgba(15,23,42,0.82)";
    ctx.fillRect(38, 40, 436, 118);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 52px sans-serif";
    ctx.fillText(venture.name, 54, 96);

    ctx.fillStyle = venture.trim;
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(venture.tag, 56, 132);

    ctx.fillStyle = venture.body;
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(52, 176 + i * 42, 408, 14);
    }

    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "22px sans-serif";
    const lines = wrapText(ctx, venture.subtitle, 380);
    lines.slice(0, 2).forEach((line, index) => ctx.fillText(line, 54, 220 + index * 28));

    ctx.fillStyle = "rgba(255,255,255,0.72)";
    ctx.font = "18px sans-serif";
    const summary = wrapText(ctx, venture.summary, 390);
    summary.slice(0, 4).forEach((line, index) => ctx.fillText(line, 54, 306 + index * 24));
  });
}

function makeBaseTexture(venture: Venture) {
  return createTexture(256, 256, (ctx) => {
    const grad = ctx.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, venture.body);
    grad.addColorStop(1, venture.trim);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    ctx.fillStyle = "rgba(0,0,0,0.24)";
    ctx.fillRect(0, 0, 256, 256);

    ctx.fillStyle = "rgba(15,23,42,0.55)";
    ctx.fillRect(34, 26, 188, 204);

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 3; col++) {
        ctx.fillStyle = row % 2 === 0 ? "rgba(248,250,252,0.74)" : "rgba(56,189,248,0.52)";
        ctx.fillRect(58 + col * 52, 54 + row * 44, 22, 28);
      }
    }

    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.fillRect(106, 168, 44, 62);
    ctx.fillStyle = "rgba(15,23,42,0.9)";
    ctx.fillRect(74, 20, 108, 22);
    ctx.fillStyle = venture.trim;
    ctx.font = "bold 16px sans-serif";
    ctx.fillText(venture.tag.toUpperCase(), 88, 37);
  });
}

function makeGroundTexture() {
  return createTexture(1024, 1024, (ctx) => {
    ctx.fillStyle = "#3d7e51";
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (let y = 0; y < 1024; y += 32) {
      for (let x = 0; x < 1024; x += 32) {
        if ((x / 32 + y / 32) % 2 === 0) ctx.fillRect(x, y, 32, 32);
      }
    }
    ctx.fillStyle = "rgba(15,23,42,0.16)";
    ctx.fillRect(372, 372, 280, 280);
    ctx.fillStyle = "rgba(148,163,184,0.22)";
    ctx.fillRect(336, 336, 352, 352);
  });
}

function createLampPost() {
  const group = new THREE.Group();
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.16, 4.6, 10),
    new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 }),
  );
  post.position.y = 2.3;
  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.12, 0.12),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 }),
  );
  arm.position.set(0.4, 4.2, 0);
  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.22, 16, 16),
    new THREE.MeshStandardMaterial({ color: 0xfde68a, emissive: 0xf59e0b, emissiveIntensity: 1.2 }),
  );
  lamp.position.set(0.85, 4.18, 0);
  group.add(post, arm, lamp);
  return group;
}

function createTree() {
  const group = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.22, 1.8, 10),
    new THREE.MeshStandardMaterial({ color: 0x7c4a1d, roughness: 1 }),
  );
  trunk.position.y = 0.9;
  const canopy = new THREE.Mesh(
    new THREE.SphereGeometry(1.05, 14, 12),
    new THREE.MeshStandardMaterial({ color: 0x2f855a, roughness: 1 }),
  );
  canopy.position.y = 2.35;
  group.add(trunk, canopy);
  return group;
}

function createFountain() {
  const group = new THREE.Group();
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(3.8, 4.2, 0.7, 24),
    new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.95 }),
  );
  const bowl = new THREE.Mesh(
    new THREE.CylinderGeometry(2.4, 2.8, 0.55, 24),
    new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.9 }),
  );
  bowl.position.y = 0.7;
  const water = new THREE.Mesh(
    new THREE.CylinderGeometry(2.05, 2.05, 0.18, 24),
    new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0ea5e9, emissiveIntensity: 0.2, transparent: true, opacity: 0.84 }),
  );
  water.position.y = 1.05;
  const spire = new THREE.Mesh(
    new THREE.CylinderGeometry(0.4, 0.6, 1.8, 16),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 }),
  );
  spire.position.y = 1.9;
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 18, 18),
    new THREE.MeshStandardMaterial({ color: 0x7dd3fc, emissive: 0x38bdf8, emissiveIntensity: 0.4 }),
  );
  orb.position.y = 2.9;
  group.add(base, bowl, water, spire, orb);
  return group;
}

function createPlayerAvatar() {
  const group = new THREE.Group();
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(1.05, 24),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28 }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.65, 1.0, 6, 10),
    new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.65, metalness: 0.05 }),
  );
  body.position.y = 1.55;
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.46, 18, 18),
    new THREE.MeshStandardMaterial({ color: 0xf8d7c4, roughness: 0.8 }),
  );
  head.position.y = 2.7;
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 18, 18, 0, Math.PI * 2, 0, Math.PI * 0.5),
    new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 }),
  );
  hair.position.y = 2.86;
  const backpack = new THREE.Mesh(
    new THREE.BoxGeometry(0.45, 0.7, 0.25),
    new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9 }),
  );
  backpack.position.set(0, 1.55, -0.38);
  group.add(shadow, body, head, hair, backpack);
  return group;
}

function makeBuilding(venture: Venture) {
  const group = new THREE.Group();
  group.position.set(venture.x, 0, venture.z);
  group.rotation.y = Math.atan2(-venture.x, -venture.z);

  const frontMap = makeFacadeTexture(venture);
  const backMap = makeBaseTexture(venture);

  const bodyMaterial = new THREE.MeshStandardMaterial({ color: venture.body, roughness: 0.9, metalness: 0.03 });
  const roofMaterial = new THREE.MeshStandardMaterial({ color: venture.trim, roughness: 0.78, metalness: 0.03 });
  const frontMaterial = new THREE.MeshStandardMaterial({ map: frontMap, roughness: 0.86, metalness: 0.02 });
  const backMaterial = new THREE.MeshStandardMaterial({ map: backMap, roughness: 0.94, metalness: 0.02 });

  const building = new THREE.Mesh(
    new THREE.BoxGeometry(venture.w, venture.h, venture.d),
    [bodyMaterial, bodyMaterial, roofMaterial, roofMaterial, frontMaterial, backMaterial],
  );
  building.position.y = venture.h / 2;
  building.castShadow = true;
  building.receiveShadow = true;
  building.userData = { ventureId: venture.id };
  group.add(building);

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(venture.w * 0.88, venture.roof, venture.d * 0.88),
    new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.82 }),
  );
  roof.position.y = venture.h + venture.roof / 2 - 0.1;
  group.add(roof);

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(venture.w * 0.18, venture.h * 0.22, 0.22),
    new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.9 }),
  );
  door.position.set(0, venture.h * 0.18, venture.d / 2 + 0.13);
  group.add(door);

  const awning = new THREE.Mesh(
    new THREE.BoxGeometry(venture.w * 0.45, 0.32, 0.45),
    new THREE.MeshStandardMaterial({ color: venture.trim, roughness: 0.6 }),
  );
  awning.position.set(0, venture.h * 0.48, venture.d / 2 + 0.03);
  group.add(awning);

  const sign = new THREE.Mesh(
    new THREE.PlaneGeometry(venture.w * 0.86, venture.h * 0.34),
    new THREE.MeshBasicMaterial({ map: frontMap, transparent: true, opacity: 0.98 }),
  );
  sign.position.set(0, venture.h * 0.92, venture.d / 2 + 0.15);
  group.add(sign);

  return group;
}

export default function VentureTown() {
  const mountRef = useRef<HTMLDivElement>(null);
  const keysRef = useRef(new Set<string>());
  const draggingRef = useRef(false);
  const dragRef = useRef({ x: 0, y: 0 });
  const yawRef = useRef(Math.PI);
  const selectedRef = useRef("book");
  const hoveredRef = useRef<string | null>(null);
  const playerRef = useRef<THREE.Group | null>(null);
  const buildingsRef = useRef<THREE.Mesh[]>([]);

  const [selectedId, setSelectedId] = useState("book");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [nearbyId, setNearbyId] = useState<string | null>(null);

  useEffect(() => {
    selectedRef.current = selectedId;
  }, [selectedId]);

  const selected = useMemo(() => VENTURES.find((v) => v.id === selectedId) ?? VENTURES[0], [selectedId]);
  const hovered = useMemo(() => VENTURES.find((v) => v.id === hoveredId) ?? null, [hoveredId]);
  const nearby = useMemo(() => VENTURES.find((v) => v.id === nearbyId) ?? null, [nearbyId]);
  const active = hovered ?? nearby ?? selected;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x9ed8ff);
    scene.fog = new THREE.Fog(0x9ed8ff, 35, 150);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 300);
    camera.position.set(0, CAMERA_HEIGHT, CAMERA_DISTANCE);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.touchAction = "none";
    renderer.domElement.style.cursor = "grab";
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.HemisphereLight(0xf8fbff, 0x2f4f4f, 2.4);
    scene.add(ambient);
    const sun = new THREE.DirectionalLight(0xffffff, 2.4);
    sun.position.set(-18, 32, 20);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    scene.add(sun);
    const warm = new THREE.PointLight(0xffddaa, 1.2, 80, 2);
    warm.position.set(0, 12, 0);
    scene.add(warm);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(120, 120),
      new THREE.MeshStandardMaterial({ map: makeGroundTexture(), roughness: 1 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 1 });
    const plazaMaterial = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.96 });
    const roadNorthSouth = new THREE.Mesh(new THREE.BoxGeometry(16, 0.12, 74), roadMaterial);
    roadNorthSouth.position.y = 0.06;
    scene.add(roadNorthSouth);
    const roadEastWest = new THREE.Mesh(new THREE.BoxGeometry(74, 0.12, 16), roadMaterial);
    roadEastWest.position.y = 0.06;
    scene.add(roadEastWest);
    const plaza = new THREE.Mesh(new THREE.BoxGeometry(28, 0.14, 28), plazaMaterial);
    plaza.position.y = 0.07;
    scene.add(plaza);
    scene.add(createFountain());

    const player = createPlayerAvatar();
    player.position.set(0, 0, 34);
    player.rotation.y = Math.PI;
    playerRef.current = player;
    scene.add(player);

    const collisionBoxes = VENTURES.map((venture) => ({
      id: venture.id,
      x: venture.x,
      z: venture.z,
      w: venture.w + 1.8,
      d: venture.d + 1.8,
    }));

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const allBuildings = VENTURES.map((venture) => {
      const building = makeBuilding(venture);
      scene.add(building);
      const mesh = building.children.find(
        (child): child is THREE.Mesh => child instanceof THREE.Mesh && child.geometry instanceof THREE.BoxGeometry,
      );
      if (mesh) {
        buildingsRef.current.push(mesh);
      }
      return building;
    });

    const lights = [
      [-12, 12], [12, 12], [-12, -12], [12, -12],
      [0, 18], [18, 0], [0, -18], [-18, 0],
    ] as const;
    lights.forEach(([x, z]) => {
      const lamp = createLampPost();
      lamp.position.set(x, 0, z);
      scene.add(lamp);
    });

    const trees = [
      [-40, -34], [40, -34], [-40, 34], [40, 34],
      [-34, -40], [34, -40], [-34, 40], [34, 40],
    ] as const;
    trees.forEach(([x, z]) => {
      const tree = createTree();
      tree.position.set(x, 0, z);
      scene.add(tree);
    });

    const getPointer = (event: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };

    const syncHover = (event: PointerEvent) => {
      getPointer(event);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(buildingsRef.current, false)[0];
      const next = (hit?.object.userData?.ventureId as string | undefined) ?? null;
      hoveredRef.current = next;
      setHoveredId(next);
      renderer.domElement.style.cursor = next ? "pointer" : draggingRef.current ? "grabbing" : "grab";
    };

    const onPointerDown = (event: PointerEvent) => {
      dragRef.current = { x: event.clientX, y: event.clientY };
      draggingRef.current = true;
      renderer.domElement.setPointerCapture(event.pointerId);
      syncHover(event);
    };

    const onPointerMove = (event: PointerEvent) => {
      if (draggingRef.current) {
        const dx = event.clientX - dragRef.current.x;
        yawRef.current -= dx * 0.0055;
        dragRef.current = { x: event.clientX, y: event.clientY };
      }
      syncHover(event);
    };

    const onPointerUp = (event: PointerEvent) => {
      const moved = Math.abs(event.clientX - dragRef.current.x) + Math.abs(event.clientY - dragRef.current.y);
      draggingRef.current = false;
      renderer.domElement.style.cursor = hoveredRef.current ? "pointer" : "grab";
      if (moved < 10 && hoveredRef.current) {
        selectedRef.current = hoveredRef.current;
        setSelectedId(hoveredRef.current);
      }
      renderer.domElement.releasePointerCapture(event.pointerId);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright", "shift", "e"].includes(key)) {
        event.preventDefault();
      }
      keysRef.current.add(key);
      if (key === "e" && nearbyId) {
        selectedRef.current = nearbyId;
        setSelectedId(nearbyId);
      }
    };

    const onKeyUp = (event: KeyboardEvent) => {
      keysRef.current.delete(event.key.toLowerCase());
    };

    const onResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    renderer.domElement.addEventListener("pointermove", onPointerMove);
    renderer.domElement.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("resize", onResize);

    let raf = 0;
    let last = performance.now();
    let walkClock = 0;

    const updateNearby = () => {
      let best: Venture | null = null;
      let bestDist = Number.POSITIVE_INFINITY;
      for (const venture of VENTURES) {
        const dx = player.position.x - venture.x;
        const dz = player.position.z - venture.z;
        const dist = Math.sqrt(dx * dx + dz * dz);
        if (dist < bestDist) {
          best = venture;
          bestDist = dist;
        }
      }
      setNearbyId(best && bestDist < 16 ? best.id : null);
    };

    const resolveCollision = (next: THREE.Vector3) => {
      const resolved = next.clone();
      for (const box of collisionBoxes) {
        const dx = resolved.x - box.x;
        const dz = resolved.z - box.z;
        const overlapX = box.w / 2 + PLAYER_RADIUS - Math.abs(dx);
        const overlapZ = box.d / 2 + PLAYER_RADIUS - Math.abs(dz);
        if (overlapX > 0 && overlapZ > 0) {
          if (overlapX < overlapZ) resolved.x += dx > 0 ? overlapX : -overlapX;
          else resolved.z += dz > 0 ? overlapZ : -overlapZ;
        }
      }
      resolved.x = THREE.MathUtils.clamp(resolved.x, -42, 42);
      resolved.z = THREE.MathUtils.clamp(resolved.z, -42, 42);
      return resolved;
    };

    const animate = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;

      const forward = new THREE.Vector3(Math.sin(yawRef.current), 0, Math.cos(yawRef.current));
      const right = new THREE.Vector3(forward.z, 0, -forward.x);
      const input = new THREE.Vector3();

      if (keysRef.current.has("w") || keysRef.current.has("arrowup")) input.add(forward);
      if (keysRef.current.has("s") || keysRef.current.has("arrowdown")) input.sub(forward);
      if (keysRef.current.has("d") || keysRef.current.has("arrowright")) input.add(right);
      if (keysRef.current.has("a") || keysRef.current.has("arrowleft")) input.sub(right);

      if (input.lengthSq() > 0) {
        input.normalize();
        const speed = MOVE_SPEED * (keysRef.current.has("shift") ? RUN_MULTIPLIER : 1);
        const next = player.position.clone().addScaledVector(input, speed * dt);
        player.position.copy(resolveCollision(next));
        player.rotation.y = Math.atan2(input.x, input.z);
        walkClock += dt * 8;
      }

      const offset = new THREE.Vector3(
        Math.sin(yawRef.current) * -CAMERA_DISTANCE,
        CAMERA_HEIGHT,
        Math.cos(yawRef.current) * -CAMERA_DISTANCE,
      );
      const target = player.position.clone().add(offset);
      camera.position.lerp(target, CAMERA_SMOOTH);
      camera.lookAt(player.position.x, player.position.y + 2.2, player.position.z);

      const bob = Math.sin(walkClock) * 0.04;
      if (player.children[1]) (player.children[1] as THREE.Mesh).position.y = 1.55 + bob;
      if (player.children[2]) (player.children[2] as THREE.Mesh).position.y = 2.7 + bob;
      if (player.children[3]) (player.children[3] as THREE.Mesh).position.y = 2.86 + bob;

      allBuildings.forEach((building) => {
        const id = building.children.find((child) => child.userData?.ventureId)?.userData?.ventureId as string | undefined;
        const hot = id === selectedRef.current || id === hoveredRef.current;
        const scale = hot ? 1.04 : 1;
        building.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.12);
      });

      updateNearby();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      renderer.domElement.removeEventListener("pointermove", onPointerMove);
      renderer.domElement.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      mount.innerHTML = "";
    };
  }, [nearbyId]);

  return (
    <div className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(148,163,184,0.18),_transparent_35%)]" />
      <div ref={mountRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute left-4 top-4 max-w-xl rounded-2xl border border-white/10 bg-slate-950/65 p-4 backdrop-blur-xl shadow-2xl">
        <div className="text-[11px] uppercase tracking-[0.35em] text-cyan-200/70">SPARQL-derived venture town</div>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Office Square</h1>
        <p className="mt-2 text-sm text-slate-300/80">
          Walk the square in third person. Each office building represents one of your venture dashboards pulled from the book graph.
        </p>
        <p className="mt-3 text-xs text-slate-400">
          Use WASD or arrows to move · drag to rotate the camera · E or click to inspect a building
        </p>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 w-[24rem] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/10 bg-slate-950/70 p-4 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.3em] text-emerald-200/70">Current building</div>
            <div className="mt-1 text-2xl font-semibold">{active.name}</div>
          </div>
          <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200/80">{active.tag}</div>
        </div>
        <div className="mt-3 text-sm text-slate-300/80">{active.subtitle}</div>
        <div className="mt-2 text-sm leading-6 text-slate-200/80">{active.summary}</div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300/80">
          {VENTURES.map((venture) => (
            <button
              key={venture.id}
              type="button"
              className={`rounded-lg border px-3 py-2 text-left transition ${selectedId === venture.id ? "border-white/25 bg-white/10" : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"}`}
              onClick={() => setSelectedId(venture.id)}
            >
              <div className="font-medium text-white">{venture.name}</div>
              <div className="mt-0.5 text-[11px] text-slate-400">{venture.tag}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-4 left-4 right-4 flex flex-wrap items-center gap-3">
        <div className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs text-slate-200/80 backdrop-blur-xl">Selected: {selected.name}</div>
        <div className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs text-slate-200/80 backdrop-blur-xl">Nearest: {nearby?.name ?? "none"}</div>
        <div className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs text-slate-200/80 backdrop-blur-xl">Source: SPARQL query over the book vault</div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center">
        <div className="rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-xs text-slate-200/80 backdrop-blur-xl">
          {active.name} · {active.subtitle}
        </div>
      </div>
    </div>
  );
}
