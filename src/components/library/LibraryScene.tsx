import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

interface BookData {
  title: string;
  subtitle: string;
  path: string;
  color: string;
  spineColor: string;
  position: [number, number, number];
}

const BOOKS: BookData[] = [
  { title: "Recipes", subtitle: "Kitchen Formulary", path: "/recipes", color: "#8B4513", spineColor: "#D4A574", position: [-3.6, 1.6, 0] },
  { title: "Remedies", subtitle: "Condition Index", path: "/remedies", color: "#2F4F4F", spineColor: "#8FBC8F", position: [-2.6, 1.6, 0] },
  { title: "Herbs", subtitle: "Materia Medica", path: "/herbs", color: "#556B2F", spineColor: "#9ACD32", position: [-1.6, 1.6, 0] },
  { title: "Oils", subtitle: "Aromatherapy", path: "/oils", color: "#4A235A", spineColor: "#D7BDE2", position: [-0.6, 1.6, 0] },
  { title: "Acupressure", subtitle: "Healing Points", path: "/acupressure", color: "#7B241C", spineColor: "#E6B0AA", position: [0.4, 1.6, 0] },
  { title: "TCM", subtitle: "Five Elements", path: "/tcm", color: "#B7410E", spineColor: "#F4A460", position: [1.4, 1.6, 0] },
  { title: "Prevention", subtitle: "Lifestyle Guide", path: "/prevention", color: "#1B4F72", spineColor: "#85C1E9", position: [-3.6, 0, 0] },
  { title: "Emergency", subtitle: "First Aid", path: "/emergency", color: "#922B21", spineColor: "#F5B7B1", position: [-2.6, 0, 0] },
  { title: "Screening", subtitle: "Lifecycle Care", path: "/screening", color: "#1A5276", spineColor: "#AED6F1", position: [-1.6, 0, 0] },
  { title: "Education", subtitle: "Learning Tools", path: "/educational", color: "#6C3483", spineColor: "#D2B4DE", position: [-0.6, 0, 0] },
  { title: "Narratives", subtitle: "Cultural Stories", path: "/narratives", color: "#784212", spineColor: "#F0B27A", position: [0.4, 0, 0] },
];

function Book({ data, onSelect }: { data: BookData; onSelect: (path: string) => void }) {
  const meshRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [pulled, setPulled] = useState(false);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetZ = hovered ? 0.6 : pulled ? 1.2 : 0;
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, delta * 6);
    const targetRotY = hovered ? -0.1 : 0;
    meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, delta * 6);
  });

  return (
    <group
      ref={meshRef}
      position={data.position}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = "default"; }}
      onClick={(e) => { e.stopPropagation(); setPulled(true); setTimeout(() => onSelect(data.path), 400); }}
    >
      <mesh castShadow>
        <boxGeometry args={[0.8, 1.2, 0.15]} />
        <meshStandardMaterial color={data.color} roughness={0.8} metalness={0.1} />
      </mesh>
      <mesh position={[-0.38, 0, 0]}>
        <boxGeometry args={[0.06, 1.18, 0.14]} />
        <meshStandardMaterial color={data.spineColor} roughness={0.6} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.59, 0]}>
        <boxGeometry args={[0.78, 0.02, 0.14]} />
        <meshStandardMaterial color="#C9A94E" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0, -0.59, 0]}>
        <boxGeometry args={[0.78, 0.02, 0.14]} />
        <meshStandardMaterial color="#C9A94E" roughness={0.3} metalness={0.7} />
      </mesh>
      <mesh position={[0.38, 0, 0]}>
        <boxGeometry args={[0.04, 1.1, 0.12]} />
        <meshStandardMaterial color="#F5E6C8" roughness={0.9} />
      </mesh>
      <Text position={[0, 0.15, 0.08]} fontSize={0.14} color="#F5E6C8" anchorX="center" anchorY="middle" maxWidth={0.7}>
        {data.title}
      </Text>
      <Text position={[0, -0.1, 0.08]} fontSize={0.07} color={data.spineColor} anchorX="center" anchorY="middle" maxWidth={0.7}>
        {data.subtitle}
      </Text>
      <mesh position={[0, -0.3, 0.08]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.06, 0.06]} />
        <meshStandardMaterial color="#C9A94E" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Bookshelf() {
  const shelfColor = "#6D4C41";
  const shelfMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: shelfColor, roughness: 0.75, metalness: 0.05 }),
    []
  );

  return (
    <group>
      {/* Back panel - warm aged wood */}
      <mesh position={[-1.1, 0.8, -0.15]}>
        <boxGeometry args={[7, 4.5, 0.08]} />
        <meshStandardMaterial color="#4E342E" roughness={0.85} />
      </mesh>
      {[-0.8, 0.8, 2.4].map((y, i) => (
        <mesh key={i} position={[-1.1, y, 0]} material={shelfMaterial}>
          <boxGeometry args={[6.8, 0.1, 0.4]} />
        </mesh>
      ))}
      <mesh position={[-4.5, 0.8, 0]} material={shelfMaterial}>
        <boxGeometry args={[0.12, 4.5, 0.4]} />
      </mesh>
      <mesh position={[2.3, 0.8, 0]} material={shelfMaterial}>
        <boxGeometry args={[0.12, 4.5, 0.4]} />
      </mesh>
      {/* Top crown with ornamental trim */}
      <mesh position={[-1.1, 3.05, 0.05]}>
        <boxGeometry args={[7.1, 0.18, 0.5]} />
        <meshStandardMaterial color="#795548" roughness={0.6} metalness={0.15} />
      </mesh>
      <mesh position={[-1.1, 3.16, 0.08]}>
        <boxGeometry args={[7.0, 0.04, 0.35]} />
        <meshStandardMaterial color="#A1887F" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[-1.1, -1.35, 0.05]}>
        <boxGeometry args={[7.1, 0.18, 0.5]} />
        <meshStandardMaterial color="#795548" roughness={0.6} metalness={0.15} />
      </mesh>
    </group>
  );
}

/* Tatami mat floor panels */
function TatamiFloor() {
  const matColor = "#C2A878";
  const borderColor = "#5D4037";
  const mats: [number, number][] = [
    [-4, -1.49], [-2, -1.49], [0, -1.49], [2, -1.49], [4, -1.49],
    [-4, -1.49], [-2, -1.49], [0, -1.49], [2, -1.49], [4, -1.49],
  ];

  return (
    <group>
      {/* Base floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#B8A070" roughness={0.92} />
      </mesh>
      {/* Tatami mat grid lines */}
      {[-3, -1, 1, 3].map((x, i) => (
        <mesh key={`hline-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -1.49, 2]}>
          <planeGeometry args={[0.03, 8]} />
          <meshStandardMaterial color={borderColor} roughness={0.9} />
        </mesh>
      ))}
      {[0, 2, 4].map((z, i) => (
        <mesh key={`vline-${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[-1, -1.49, z]}>
          <planeGeometry args={[8, 0.03]} />
          <meshStandardMaterial color={borderColor} roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* Shoji screen wall panels (translucent rice paper + wood frame) */
function ShojiWall({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[0.08, 4, 0.08]} />
        <meshStandardMaterial color="#8D6E63" roughness={0.7} />
      </mesh>
      {/* Horizontal bars */}
      {[-1.2, -0.2, 0.8, 1.8].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[0.08, 0.04, 3]} />
          <meshStandardMaterial color="#8D6E63" roughness={0.7} />
        </mesh>
      ))}
      {/* Rice paper panels */}
      {[-0.7, 0.3, 1.3].map((y, i) => (
        <mesh key={`panel-${i}`} position={[0.02, y, 0]}>
          <planeGeometry args={[0.01, 0.9]} />
          <meshStandardMaterial color="#F5F0E0" transparent opacity={0.3} roughness={1} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* Hanging scroll decoration */
function HangingScroll({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Top rod */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Scroll paper */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[0.4, 1.1]} />
        <meshStandardMaterial color="#F5ECD7" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* Bottom weight rod */}
      <mesh position={[0, -0.58, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.45, 8]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#5D4037" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Calligraphy mark */}
      <mesh position={[0, 0.1, 0.02]}>
        <planeGeometry args={[0.08, 0.25]} />
        <meshStandardMaterial color="#2C1810" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

/* Incense burner */
function IncenseBurner({ position }: { position: [number, number, number] }) {
  const smokeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!smokeRef.current) return;
    smokeRef.current.position.y = 0.3 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
    smokeRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.3;
  });

  return (
    <group position={position}>
      {/* Bowl */}
      <mesh>
        <cylinderGeometry args={[0.08, 0.06, 0.1, 12]} />
        <meshStandardMaterial color="#4A4A4A" roughness={0.4} metalness={0.6} />
      </mesh>
      {/* Smoke wisp */}
      <mesh ref={smokeRef} position={[0, 0.3, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#D7CCC8" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

function DustParticles() {
  const count = 60;
  const particles = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = Math.random() * 5 - 1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!particles.current) return;
    const time = state.clock.elapsedTime;
    const posArray = particles.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArray[i * 3 + 1] += Math.sin(time + i) * 0.001;
      posArray[i * 3] += Math.cos(time * 0.5 + i) * 0.0005;
    }
    particles.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={particles}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={count} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#D4A574" transparent opacity={0.35} sizeAttenuation />
    </points>
  );
}

function CandleLight({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const flicker = Math.sin(state.clock.elapsedTime * 8) * 0.15 + Math.sin(state.clock.elapsedTime * 13) * 0.1;
    lightRef.current.intensity = 1.0 + flicker;
  });

  return (
    <group position={position}>
      <pointLight ref={lightRef} color="#FF9F43" intensity={1.0} distance={8} decay={2} />
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.03, 0.035, 0.2, 8]} />
        <meshStandardMaterial color="#F5E6C8" roughness={0.8} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshBasicMaterial color="#FFD93D" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

/* Paper lantern light */
function PaperLantern({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    lightRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.2;
  });

  return (
    <group position={position}>
      <pointLight ref={lightRef} color="#FFCC80" intensity={1.5} distance={10} decay={2} />
      {/* Lantern body */}
      <mesh>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshStandardMaterial color="#FFECB3" transparent opacity={0.6} roughness={1} side={THREE.DoubleSide} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.04, 0.06, 0.04, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.6} />
      </mesh>
      {/* Bottom cap */}
      <mesh position={[0, -0.16, 0]}>
        <cylinderGeometry args={[0.06, 0.04, 0.04, 8]} />
        <meshStandardMaterial color="#5D4037" roughness={0.6} />
      </mesh>
      {/* Hanging string */}
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.3, 4]} />
        <meshStandardMaterial color="#8D6E63" />
      </mesh>
    </group>
  );
}

export function LibraryScene({ onSelectBook }: { onSelectBook: (path: string) => void }) {
  return (
    <div className="w-full h-screen bg-[#2C2218]">
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 6], fov: 50 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.6 }}
      >
        <color attach="background" args={["#2C2218"]} />
        <fog attach="fog" args={["#2C2218", 10, 18]} />

        {/* Much brighter ambient + warm fill lights */}
        <ambientLight intensity={0.7} color="#FFE4C4" />
        <directionalLight position={[2, 5, 4]} intensity={0.8} color="#FFF8DC" castShadow />
        <directionalLight position={[-4, 3, 2]} intensity={0.5} color="#FFD7A8" />
        <directionalLight position={[0, 2, 5]} intensity={0.3} color="#FFECD2" />

        {/* Candle lights on shelf */}
        <CandleLight position={[-4.8, 2.8, 0.5]} />
        <CandleLight position={[2.6, 2.8, 0.5]} />
        <CandleLight position={[-1, -0.6, 1.5]} />

        {/* Paper lanterns hanging from ceiling */}
        <PaperLantern position={[-2.5, 3.8, 2]} />
        <PaperLantern position={[1, 4, 2.5]} />
        <PaperLantern position={[-0.5, 3.6, 3]} />

        <Bookshelf />

        {BOOKS.map((book) => (
          <Book key={book.path} data={book} onSelect={onSelectBook} />
        ))}

        {/* Room elements */}
        <TatamiFloor />

        {/* Shoji screen walls on sides */}
        <ShojiWall position={[-5.5, 0.5, 1]} rotation={[0, Math.PI / 6, 0]} />
        <ShojiWall position={[4, 0.5, 1]} rotation={[0, -Math.PI / 6, 0]} />

        {/* Hanging scrolls beside shelf */}
        <HangingScroll position={[-5, 1.5, -0.05]} />
        <HangingScroll position={[3.2, 1.8, -0.05]} />

        {/* Incense burner on floor */}
        <IncenseBurner position={[3, -1.42, 2]} />

        {/* Back wall - warm plaster */}
        <mesh position={[-1.1, 1.5, -1]}>
          <planeGeometry args={[16, 7]} />
          <meshStandardMaterial color="#D7C9A8" roughness={0.95} />
        </mesh>

        {/* Ceiling */}
        <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4.5, 0]}>
          <planeGeometry args={[16, 12]} />
          <meshStandardMaterial color="#A89070" roughness={0.9} />
        </mesh>

        {/* Ceiling beams (exposed wood) */}
        {[-3, 0, 3].map((x, i) => (
          <mesh key={`beam-${i}`} position={[x, 4.4, 1]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.15, 0.12, 10]} />
            <meshStandardMaterial color="#5D4037" roughness={0.75} />
          </mesh>
        ))}

        <DustParticles />

        <OrbitControls
          enableZoom={true}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          minDistance={3.5}
          maxDistance={9}
          target={[-1.1, 0.8, 0]}
          autoRotate={false}
        />
      </Canvas>

      {/* Overlay title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-[#C9A94E] drop-shadow-lg tracking-wide">
          Health & Wellness Bible
        </h1>
        <p className="font-body text-[#D4A574]/80 text-sm md:text-base mt-2 tracking-widest uppercase">
          Select a tome to begin your journey
        </p>
      </div>

      {/* Bottom disclaimer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 max-w-md">
        <p className="text-[10px] text-[#D4A574]/50 font-body">
          For educational purposes only. Always consult a qualified healthcare provider.
        </p>
      </div>
    </div>
  );
}
