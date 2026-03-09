import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import * as THREE from "three";

interface EnergyBeamProps {
  start: [number, number, number];
  end: [number, number, number];
  color: string;
  active: boolean;
  jagged?: boolean;
}

export function EnergyBeam({ start, end, color, active, jagged }: EnergyBeamProps) {
  const particleRef = useRef<THREE.Points>(null);

  const points = useMemo(() => {
    const midX = (start[0] + end[0]) / 2;
    const midY = (start[1] + end[1]) / 2 + (jagged ? 0 : 0.3);
    const midZ = (start[2] + end[2]) / 2;

    const curve = new THREE.QuadraticBezierCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(
        midX + (jagged ? (Math.random() - 0.5) * 0.5 : 0),
        midY + (jagged ? (Math.random() - 0.5) * 0.5 : 0),
        midZ
      ),
      new THREE.Vector3(...end)
    );

    return curve.getPoints(jagged ? 20 : 40).map(p => [p.x, p.y, p.z] as [number, number, number]);
  }, [start, end, jagged]);

  useFrame(() => {
    if (!particleRef.current) return;
    const t = performance.now() * 0.001;
    const frac = (Math.sin(t * 2) + 1) / 2;
    particleRef.current.position.set(
      start[0] + (end[0] - start[0]) * frac,
      start[1] + (end[1] - start[1]) * frac,
      start[2] + (end[2] - start[2]) * frac
    );
  });

  if (!active) return null;

  return (
    <group>
      <Line
        points={points}
        color={color}
        lineWidth={jagged ? 2 : 1.5}
        transparent
        opacity={jagged ? 0.9 : 0.6}
      />
      {/* Traveling particle */}
      <points ref={particleRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([0, 0, 0]), 3]}
            count={1}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={jagged ? 0.15 : 0.1}
          sizeAttenuation
          transparent
          opacity={0.9}
        />
      </points>
    </group>
  );
}
