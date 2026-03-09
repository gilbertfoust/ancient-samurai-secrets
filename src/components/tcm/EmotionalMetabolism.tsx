import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { ElementNode, ElementType } from "./ElementNode";
import { EnergyBeam } from "./EnergyBeam";
import { Suspense } from "react";

export type CycleMode = "generating" | "controlling" | "overacting";
export type SceneState = "healthy" | "crash" | "healing" | "healed";

interface Props {
  cycleMode: CycleMode;
  scene: SceneState;
  heldElement: ElementType | null;
  onElementPointerDown: (el: ElementType) => void;
  onElementPointerUp: () => void;
}

const RADIUS = 2.2;
const POSITIONS: Record<ElementType, [number, number, number]> = {
  water: [
    Math.sin((2 * Math.PI * 0) / 5) * RADIUS, 0,
    Math.cos((2 * Math.PI * 0) / 5) * RADIUS,
  ],
  wood: [
    Math.sin((2 * Math.PI * 1) / 5) * RADIUS, 0,
    Math.cos((2 * Math.PI * 1) / 5) * RADIUS,
  ],
  fire: [
    Math.sin((2 * Math.PI * 2) / 5) * RADIUS, 0,
    Math.cos((2 * Math.PI * 2) / 5) * RADIUS,
  ],
  earth: [
    Math.sin((2 * Math.PI * 3) / 5) * RADIUS, 0,
    Math.cos((2 * Math.PI * 3) / 5) * RADIUS,
  ],
  metal: [
    Math.sin((2 * Math.PI * 4) / 5) * RADIUS, 0,
    Math.cos((2 * Math.PI * 4) / 5) * RADIUS,
  ],
};

// Generating: Water→Wood→Fire→Earth→Metal→Water
const GENERATING_FLOW: [ElementType, ElementType, string][] = [
  ["water", "wood", "#3b82f6"],
  ["wood", "fire", "#22c55e"],
  ["fire", "earth", "#f43f5e"],
  ["earth", "metal", "#eab308"],
  ["metal", "water", "#e2e8f0"],
];

// Controlling: Water⊣Fire, Fire⊣Metal, Metal⊣Wood, Wood⊣Earth, Earth⊣Water
const CONTROLLING_FLOW: [ElementType, ElementType, string][] = [
  ["water", "fire", "#3b82f6"],
  ["fire", "metal", "#f43f5e"],
  ["metal", "wood", "#e2e8f0"],
  ["wood", "earth", "#22c55e"],
  ["earth", "water", "#eab308"],
];

// Overacting crash scenarios — which element bullies which, and what gets starved
interface OveractScenario {
  bully: ElementType;
  victim: ElementType;
  starved: ElementType;
  secondaryAttacker: ElementType;
  secondaryVictim: ElementType;
  healTarget: ElementType;
  bullyColor: string;
  description: string;
}

const OVERACT_SCENARIOS: Record<ElementType, OveractScenario> = {
  wood: {
    bully: "wood", victim: "earth", starved: "metal",
    secondaryAttacker: "fire", secondaryVictim: "water",
    healTarget: "wood",
    bullyColor: "#dc2626",
    description: "Wood bullies Earth → digestion collapses, Metal starves. Soften Wood to restore flow.",
  },
  fire: {
    bully: "fire", victim: "metal", starved: "water",
    secondaryAttacker: "earth", secondaryVictim: "wood",
    healTarget: "fire",
    bullyColor: "#ff4500",
    description: "Fire overwhelms Metal → boundaries dissolve, Water depletes. Cool the Fire to restore balance.",
  },
  earth: {
    bully: "earth", victim: "water", starved: "wood",
    secondaryAttacker: "metal", secondaryVictim: "fire",
    healTarget: "earth",
    bullyColor: "#b8860b",
    description: "Earth dams Water → reserves drain, Wood can't grow. Loosen Earth to free the flow.",
  },
  metal: {
    bully: "metal", victim: "wood", starved: "fire",
    secondaryAttacker: "water", secondaryVictim: "earth",
    healTarget: "metal",
    bullyColor: "#6b7280",
    description: "Metal over-cuts Wood → creativity dies, Fire can't ignite. Soften Metal to restore growth.",
  },
  water: {
    bully: "water", victim: "fire", starved: "earth",
    secondaryAttacker: "wood", secondaryVictim: "metal",
    healTarget: "water",
    bullyColor: "#1e3a5f",
    description: "Water drowns Fire → joy extinguished, Earth can't process. Calm Water to let Fire breathe.",
  },
};

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
  cycleMode: CycleMode,
  heldElement: ElementType | null,
  overactBully?: ElementType,
): "healthy" | "stressed" | "healing" | "healed" {
  if (scene === "healthy" || scene === "healed") return "healthy";

  if (cycleMode === "overacting" && overactBully) {
    const scenario = OVERACT_SCENARIOS[overactBully];
    if (scene === "healing" && heldElement === scenario.healTarget) {
      return "healing";
    }
    if (scene === "crash") {
      if (element === scenario.bully || element === scenario.secondaryAttacker) return "stressed";
      if (element === scenario.victim || element === scenario.starved || element === scenario.secondaryVictim) return "stressed";
    }
    if (scene === "healing") return "stressed";
  }

  if (cycleMode === "controlling") {
    if (scene === "crash") return "stressed";
    if (scene === "healing" && heldElement) return "healing";
    return "stressed";
  }

  // generating crash
  if (scene === "crash") return "stressed";
  if (scene === "healing") {
    if (heldElement && element === heldElement) return "healing";
    if (heldElement) return "healing";
    return "stressed";
  }
  return "stressed";
}

function Scene({ cycleMode, scene, heldElement, onElementPointerDown, onElementPointerUp }: Props) {
  const isHealthy = scene === "healthy" || scene === "healed";
  const isCrash = scene === "crash";
  const isHealing = scene === "healing" && heldElement !== null;

  // For overacting, default bully is wood
  const overactBully: ElementType = "wood";

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
            state={getNodeState(el, scene, cycleMode, heldElement, overactBully)}
            onPointerDown={() => onElementPointerDown(el)}
            onPointerUp={onElementPointerUp}
            isHeld={el === heldElement}
          />
          <Text
            position={[POSITIONS[el][0], POSITIONS[el][1] - 1, POSITIONS[el][2]]}
            fontSize={0.18}
            color="#94a3b8"
            anchorX="center"
            anchorY="top"
          >
            {LABELS[el].name}
          </Text>
          <Text
            position={[POSITIONS[el][0], POSITIONS[el][1] - 1.25, POSITIONS[el][2]]}
            fontSize={0.12}
            color="#64748b"
            anchorX="center"
            anchorY="top"
          >
            {LABELS[el].role}
          </Text>
        </group>
      ))}

      {/* ── GENERATING CYCLE BEAMS ── */}
      {cycleMode === "generating" && GENERATING_FLOW.map(([from, to, color]) => (
        <EnergyBeam
          key={`gen-${from}-${to}`}
          start={POSITIONS[from]}
          end={POSITIONS[to]}
          color={isHealthy || isHealing ? color : "#1e293b"}
          active={isHealthy || isHealing}
        />
      ))}

      {/* Generating crash: break in the chain */}
      {cycleMode === "generating" && isCrash && (
        <>
          <EnergyBeam start={POSITIONS.wood} end={POSITIONS.earth} color="#dc2626" active jagged />
          <EnergyBeam start={POSITIONS.fire} end={POSITIONS.water} color="#ff4500" active jagged />
        </>
      )}

      {/* ── CONTROLLING CYCLE BEAMS ── */}
      {cycleMode === "controlling" && CONTROLLING_FLOW.map(([from, to, color]) => (
        <EnergyBeam
          key={`ctrl-${from}-${to}`}
          start={POSITIONS[from]}
          end={POSITIONS[to]}
          color={isHealthy || isHealing ? color : "#1e293b"}
          active={isHealthy || isHealing}
        />
      ))}

      {/* Controlling crash: all controls become aggressive */}
      {cycleMode === "controlling" && isCrash && CONTROLLING_FLOW.map(([from, to]) => (
        <EnergyBeam
          key={`ctrl-crash-${from}-${to}`}
          start={POSITIONS[from]}
          end={POSITIONS[to]}
          color="#dc2626"
          active
          jagged
        />
      ))}

      {/* ── OVERACTING CYCLE BEAMS ── */}
      {cycleMode === "overacting" && (isHealthy || isHealing) && GENERATING_FLOW.map(([from, to, color]) => (
        <EnergyBeam
          key={`over-healthy-${from}-${to}`}
          start={POSITIONS[from]}
          end={POSITIONS[to]}
          color={color}
          active
        />
      ))}

      {cycleMode === "overacting" && isCrash && (() => {
        const s = OVERACT_SCENARIOS[overactBully];
        return (
          <>
            <EnergyBeam
              start={POSITIONS[s.bully]}
              end={POSITIONS[s.victim]}
              color={s.bullyColor}
              active
              jagged
            />
            <EnergyBeam
              start={POSITIONS[s.secondaryAttacker]}
              end={POSITIONS[s.secondaryVictim]}
              color="#ff4500"
              active
              jagged
            />
          </>
        );
      })()}

      <OrbitControls
        enableZoom
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
