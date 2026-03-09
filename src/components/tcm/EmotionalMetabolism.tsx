import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { ElementNode, ElementType } from "./ElementNode";
import { EnergyBeam } from "./EnergyBeam";
import { Suspense } from "react";

export type SceneState = "healthy" | "crash" | "healing" | "healed";

interface Props {
  scene: SceneState;
  isHoldingWood: boolean;
  onWoodPointerDown: () => void;
  onWoodPointerUp: () => void;
}

// Positions in a pentagon layout
const RADIUS = 2.2;
const POSITIONS: Record<ElementType, [number, number, number]> = {
  water: [
    Math.sin((2 * Math.PI * 0) / 5) * RADIUS,
    0,
    Math.cos((2 * Math.PI * 0) / 5) * RADIUS,
  ],
  wood: [
    Math.sin((2 * Math.PI * 1) / 5) * RADIUS,
    0,
    Math.cos((2 * Math.PI * 1) / 5) * RADIUS,
  ],
  fire: [
    Math.sin((2 * Math.PI * 2) / 5) * RADIUS,
    0,
    Math.cos((2 * Math.PI * 2) / 5) * RADIUS,
  ],
  earth: [
    Math.sin((2 * Math.PI * 3) / 5) * RADIUS,
    0,
    Math.cos((2 * Math.PI * 3) / 5) * RADIUS,
  ],
  metal: [
    Math.sin((2 * Math.PI * 4) / 5) * RADIUS,
    0,
    Math.cos((2 * Math.PI * 4) / 5) * RADIUS,
  ],
};

const GENERATING_FLOW: [ElementType, ElementType, string][] = [
  ["water", "wood", "#3b82f6"],
  ["wood", "fire", "#22c55e"],
  ["fire", "earth", "#f43f5e"],
  ["earth", "metal", "#eab308"],
  ["metal", "water", "#e2e8f0"],
];

const LABELS: Record<ElementType, { name: string; role: string }> = {
  water: { name: "Water", role: "The Battery" },
  wood: { name: "Wood", role: "The Architect" },
  fire: { name: "Fire", role: "The Amplifier" },
  earth: { name: "Earth", role: "The Processor" },
  metal: { name: "Metal", role: "The Editor" },
};

function getNodeState(
  element: ElementType,
  scene: SceneState,
  isHolding: boolean
): "healthy" | "stressed" | "healing" | "healed" {
  if (scene === "healthy" || scene === "healed") return "healthy";
  if (scene === "healing") {
    if (element === "wood" && isHolding) return "healing";
    if (isHolding) return "healing";
    return "stressed";
  }
  return "stressed";
}

function Scene({ scene, isHoldingWood, onWoodPointerDown, onWoodPointerUp }: Props) {
  const isHealthy = scene === "healthy" || scene === "healed";
  const isCrash = scene === "crash";
  const isHealing = scene === "healing" && isHoldingWood;

  return (
    <>
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 5, 0]} intensity={0.8} color="#8b5cf6" />
      <pointLight position={[3, -2, 3]} intensity={0.4} color="#3b82f6" />
      <pointLight position={[-3, -2, -3]} intensity={0.4} color="#f43f5e" />

      <Stars radius={20} depth={50} count={1000} factor={2} fade speed={0.5} />

      {/* Element Nodes */}
      {(Object.keys(POSITIONS) as ElementType[]).map((el) => (
        <group key={el}>
          <ElementNode
            element={el}
            position={POSITIONS[el]}
            state={getNodeState(el, scene, isHoldingWood)}
            onPointerDown={el === "wood" ? onWoodPointerDown : undefined}
            onPointerUp={el === "wood" ? onWoodPointerUp : undefined}
            isHeld={el === "wood" && isHoldingWood}
          />
          {/* Labels */}
          <Text
            position={[
              POSITIONS[el][0],
              POSITIONS[el][1] - 1,
              POSITIONS[el][2],
            ]}
            fontSize={0.18}
            color="#94a3b8"
            anchorX="center"
            anchorY="top"
          >
            {LABELS[el].name}
          </Text>
          <Text
            position={[
              POSITIONS[el][0],
              POSITIONS[el][1] - 1.25,
              POSITIONS[el][2],
            ]}
            fontSize={0.12}
            color="#64748b"
            anchorX="center"
            anchorY="top"
          >
            {LABELS[el].role}
          </Text>
        </group>
      ))}

      {/* Energy Beams — healthy generating cycle */}
      {GENERATING_FLOW.map(([from, to, color]) => (
        <EnergyBeam
          key={`${from}-${to}`}
          start={POSITIONS[from]}
          end={POSITIONS[to]}
          color={isHealthy || isHealing ? color : "#1e293b"}
          active={isHealthy || isHealing}
        />
      ))}

      {/* Crash beams — Wood attacks Earth directly */}
      {isCrash && (
        <>
          <EnergyBeam
            start={POSITIONS.wood}
            end={POSITIONS.earth}
            color="#dc2626"
            active={true}
            jagged
          />
          <EnergyBeam
            start={POSITIONS.fire}
            end={POSITIONS.water}
            color="#ff4500"
            active={true}
            jagged
          />
        </>
      )}

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={4}
        maxDistance={12}
        autoRotate={isHealthy}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export function EmotionalMetabolism(props: Props) {
  return (
    <div className="w-full h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-border/40 bg-black/90">
      <Canvas camera={{ position: [0, 5, 6], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene {...props} />
        </Suspense>
      </Canvas>
    </div>
  );
}
