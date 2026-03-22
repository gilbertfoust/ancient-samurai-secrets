import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Text, Float, MeshWobbleMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useNavigate } from "react-router-dom";

interface BookData {
  title: string;
  subtitle: string;
  path: string;
  color: string;
  spineColor: string;
  position: [number, number, number];
  rotation?: [number, number, number];
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
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
      onClick={(e) => {
        e.stopPropagation();
        setPulled(true);
        setTimeout(() => onSelect(data.path), 400);
      }}
    >
      {/* Book body */}
      <mesh castShadow>
        <boxGeometry args={[0.8, 1.2, 0.15]} />
        <meshStandardMaterial
          color={data.color}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      {/* Spine accent */}
      <mesh position={[-0.38, 0, 0]}>
        <boxGeometry args={[0.06, 1.18, 0.14]} />
        <meshStandardMaterial color={data.spineColor} roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Gold trim top */}
      <mesh position={[0, 0.59, 0]}>
        <boxGeometry args={[0.78, 0.02, 0.14]} />
        <meshStandardMaterial color="#C9A94E" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Gold trim bottom */}
      <mesh position={[0, -0.59, 0]}>
        <boxGeometry args={[0.78, 0.02, 0.14]} />
        <meshStandardMaterial color="#C9A94E" roughness={0.3} metalness={0.7} />
      </mesh>
      {/* Pages edge */}
      <mesh position={[0.38, 0, 0]}>
        <boxGeometry args={[0.04, 1.1, 0.12]} />
        <meshStandardMaterial color="#F5E6C8" roughness={0.9} />
      </mesh>
      {/* Title text */}
      <Text
        position={[0, 0.15, 0.08]}
        fontSize={0.14}
        color="#F5E6C8"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.7}
      >
        {data.title}
      </Text>
      {/* Subtitle */}
      <Text
        position={[0, -0.1, 0.08]}
        fontSize={0.07}
        color={data.spineColor}
        anchorX="center"
        anchorY="middle"
        maxWidth={0.7}
      >
        {data.subtitle}
      </Text>
      {/* Decorative diamond */}
      <mesh position={[0, -0.3, 0.08]} rotation={[0, 0, Math.PI / 4]}>
        <planeGeometry args={[0.06, 0.06]} />
        <meshStandardMaterial color="#C9A94E" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

function Bookshelf() {
  const shelfColor = "#5D4037";
  const shelfMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: shelfColor, roughness: 0.8, metalness: 0.08 }),
    []
  );

  return (
    <group>
      {/* Back panel */}
      <mesh position={[-1.1, 0.8, -0.15]}>
        <boxGeometry args={[7, 4.5, 0.08]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} />
      </mesh>
      {/* Shelves */}
      {[-0.8, 0.8, 2.4].map((y, i) => (
        <mesh key={i} position={[-1.1, y, 0]} material={shelfMaterial}>
          <boxGeometry args={[6.8, 0.1, 0.4]} />
        </mesh>
      ))}
      {/* Left side */}
      <mesh position={[-4.5, 0.8, 0]} material={shelfMaterial}>
        <boxGeometry args={[0.12, 4.5, 0.4]} />
      </mesh>
      {/* Right side */}
      <mesh position={[2.3, 0.8, 0]} material={shelfMaterial}>
        <boxGeometry args={[0.12, 4.5, 0.4]} />
      </mesh>
      {/* Top crown */}
      <mesh position={[-1.1, 3.05, 0.05]}>
        <boxGeometry args={[7.1, 0.15, 0.5]} />
        <meshStandardMaterial color="#6D4C41" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Bottom base */}
      <mesh position={[-1.1, -1.35, 0.05]}>
        <boxGeometry args={[7.1, 0.15, 0.5]} />
        <meshStandardMaterial color="#6D4C41" roughness={0.7} metalness={0.1} />
      </mesh>
    </group>
  );
}

function DustParticles() {
  const count = 80;
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
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#D4A574" transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

function CandleLight({ position }: { position: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (!lightRef.current) return;
    const flicker = Math.sin(state.clock.elapsedTime * 8) * 0.15 + Math.sin(state.clock.elapsedTime * 13) * 0.1;
    lightRef.current.intensity = 0.8 + flicker;
  });

  return (
    <group position={position}>
      <pointLight ref={lightRef} color="#FF9F43" intensity={0.8} distance={6} decay={2} />
      {/* Candle body */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.03, 0.035, 0.2, 8]} />
        <meshStandardMaterial color="#F5E6C8" roughness={0.8} />
      </mesh>
      {/* Flame glow */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshBasicMaterial color="#FFD93D" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

export function LibraryScene({ onSelectBook }: { onSelectBook: (path: string) => void }) {
  return (
    <div className="w-full h-screen bg-[#1A1410]">
      <Canvas
        shadows
        camera={{ position: [0, 1.2, 6], fov: 50 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <color attach="background" args={["#1A1410"]} />
        <fog attach="fog" args={["#1A1410", 8, 16]} />

        <ambientLight intensity={0.4} color="#FFE4C4" />
        <directionalLight position={[2, 4, 3]} intensity={0.6} color="#FFF8DC" castShadow />
        <directionalLight position={[-3, 2, 2]} intensity={0.3} color="#FFD7A8" />

        <CandleLight position={[-4.8, 2.8, 0.5]} />
        <CandleLight position={[2.6, 2.8, 0.5]} />
        <CandleLight position={[-1, 3.2, 1]} />
        <CandleLight position={[-1, -0.6, 1.5]} />

        <Bookshelf />

        {BOOKS.map((book) => (
          <Book key={book.path} data={book} onSelect={onSelectBook} />
        ))}

        <DustParticles />

        {/* Floor */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#2A1F18" roughness={0.95} />
        </mesh>

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
        <p className="font-body text-[#D4A574]/70 text-sm md:text-base mt-2 tracking-widest uppercase">
          Select a tome to begin your journey
        </p>
      </div>

      {/* Bottom disclaimer */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 max-w-md">
        <p className="text-[10px] text-[#D4A574]/40 font-body">
          For educational purposes only. Always consult a qualified healthcare provider.
        </p>
      </div>
    </div>
  );
}
