import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export type ElementType = "water" | "wood" | "fire" | "earth" | "metal";

interface ElementNodeProps {
  element: ElementType;
  position: [number, number, number];
  state: "healthy" | "stressed" | "healing" | "healed";
  onClick?: () => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
  isHeld?: boolean;
}

const ELEMENT_CONFIG: Record<
  ElementType,
  { color: string; emissive: string; stressColor: string; label: string }
> = {
  water: {
    color: "#1a3a6b",
    emissive: "#2563eb",
    stressColor: "#7f1d1d",
    label: "The Battery",
  },
  wood: {
    color: "#166534",
    emissive: "#22c55e",
    stressColor: "#4a1a00",
    label: "The Architect",
  },
  fire: {
    color: "#9f1239",
    emissive: "#f43f5e",
    stressColor: "#ff4500",
    label: "The Amplifier",
  },
  earth: {
    color: "#854d0e",
    emissive: "#eab308",
    stressColor: "#3f3f46",
    label: "The Processor",
  },
  metal: {
    color: "#94a3b8",
    emissive: "#e2e8f0",
    stressColor: "#52525b",
    label: "The Editor",
  },
};

export function ElementNode({
  element,
  position,
  state,
  onClick,
  onPointerDown,
  onPointerUp,
  isHeld,
}: ElementNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const config = ELEMENT_CONFIG[element];

  const geometry = useMemo(() => {
    switch (element) {
      case "water":
        return new THREE.SphereGeometry(0.5, 32, 32);
      case "wood":
        return new THREE.DodecahedronGeometry(0.5, 1);
      case "fire":
        return new THREE.OctahedronGeometry(0.5, 0);
      case "earth":
        return new THREE.SphereGeometry(0.5, 8, 6);
      case "metal":
        return new THREE.IcosahedronGeometry(0.5, 0);
      default:
        return new THREE.SphereGeometry(0.5, 32, 32);
    }
  }, [element]);

  useFrame((_, delta) => {
    if (!meshRef.current || !glowRef.current) return;

    const t = performance.now() * 0.001;
    const isStressed = state === "stressed";
    const isHealing = state === "healing" || isHeld;

    // Rotation
    if (element === "earth") {
      meshRef.current.rotation.y += delta * (isStressed ? 3 : 0.3);
    } else {
      meshRef.current.rotation.y += delta * (isStressed ? 1.5 : 0.5);
      meshRef.current.rotation.x += delta * 0.2;
    }

    // Scale pulsing
    const baseScale = isStressed && element !== "wood" ? 0.7 : 1;
    const pulseAmp = isStressed ? 0.15 : 0.05;
    const pulseSpeed = isStressed ? 4 : 1.5;
    const scale = baseScale + Math.sin(t * pulseSpeed) * pulseAmp;

    // Wood becomes spiky when stressed
    if (element === "wood" && isStressed) {
      meshRef.current.scale.setScalar(1.3);
    } else if (isHealing) {
      meshRef.current.scale.setScalar(
        THREE.MathUtils.lerp(meshRef.current.scale.x, 1, delta * 2)
      );
    } else {
      meshRef.current.scale.setScalar(scale);
    }

    // Metal shrinks when stressed
    if (element === "metal" && isStressed) {
      meshRef.current.scale.setScalar(0.4);
    }

    // Fire flares when stressed
    if (element === "fire" && isStressed) {
      meshRef.current.scale.setScalar(1.4 + Math.sin(t * 8) * 0.3);
    }

    // Glow
    const glowScale = scale * 1.8;
    glowRef.current.scale.setScalar(glowScale);

    // Position wobble
    if (element === "water" && isStressed) {
      meshRef.current.position.y =
        position[1] + Math.sin(t * 6) * 0.1;
    }
  });

  const currentColor =
    state === "stressed" ? config.stressColor : config.color;
  const currentEmissive =
    state === "stressed" ? config.stressColor : config.emissive;
  const emissiveIntensity =
    state === "stressed"
      ? element === "fire"
        ? 3
        : 0.3
      : isHeld
      ? 2
      : 1;

  return (
    <group position={position} onClick={onClick} onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
      {/* Glow */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial
          color={currentEmissive}
          transparent
          opacity={state === "stressed" ? 0.05 : 0.12}
          depthWrite={false}
        />
      </mesh>

      {/* Main node */}
      <mesh ref={meshRef} geometry={geometry} castShadow>
        <meshStandardMaterial
          color={currentColor}
          emissive={currentEmissive}
          emissiveIntensity={emissiveIntensity}
          roughness={element === "metal" ? 0.1 : 0.4}
          metalness={element === "metal" ? 0.9 : 0.2}
          wireframe={state === "stressed" && element === "wood"}
        />
      </mesh>
    </group>
  );
}
