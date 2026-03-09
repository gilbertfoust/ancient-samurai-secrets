import { useState, useCallback } from "react";
import { EmotionalMetabolism, SceneState, CycleMode } from "@/components/tcm/EmotionalMetabolism";
import { ElementType } from "@/components/tcm/ElementNode";
import { BodyClock } from "@/components/tcm/BodyClock";
import { MeridianPathways } from "@/components/tcm/MeridianPathways";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Waves,
  TreePine,
  Flame,
  Mountain,
  Gem,
  Play,
  RotateCcw,
  Hand,
  ChevronRight,
  Zap,
  Heart,
  Brain,
  Droplets,
  Wind,
  Moon,
  Sun,
  Clock,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CYCLE_MODES: { key: CycleMode; label: string; icon: any; color: string }[] = [
  { key: "generating", label: "Generating", icon: Play, color: "text-green-400" },
  { key: "controlling", label: "Controlling", icon: Zap, color: "text-amber-400" },
  { key: "overacting", label: "Overacting", icon: Flame, color: "text-red-400" },
];

const SCENE_BUTTONS: { key: SceneState; label: string; icon: any }[] = [
  { key: "healthy", label: "Healthy", icon: Play },
  { key: "crash", label: "Crash", icon: Zap },
  { key: "healing", label: "Heal", icon: Hand },
];

const CYCLE_DESCRIPTIONS: Record<CycleMode, Record<SceneState, string>> = {
  generating: {
    healthy: "The Generating Cycle (相生): Each element nourishes the next like a mother feeding her child. Water → Wood → Fire → Earth → Metal → Water. This is your system in harmony.",
    crash: "The flow is broken! A stressor disrupts the smooth generating sequence. Energy stagnates and elements can't nourish each other. The chain reaction cascades through the whole system.",
    healing: "Click and hold any element node in the 3D scene to breathe energy back into the cycle and restore the generating flow.",
    healed: "Balance restored! The harmonious generating cycle flows smoothly again.",
  },
  controlling: {
    healthy: "The Controlling Cycle (相克): Each element keeps another in check — Water controls Fire, Fire controls Metal, Metal controls Wood, Wood controls Earth, Earth controls Water. This is your body's natural checks & balances.",
    crash: "The controls have become aggressive! Instead of gentle regulation, each element is attacking its target. The star pattern of balance has turned destructive.",
    healing: "Click and hold the central element causing the most disruption to restore gentle control. Each element should check — not crush — its target.",
    healed: "The controlling cycle is balanced again. Gentle regulation, not aggression.",
  },
  overacting: {
    healthy: "The Overacting Cycle (相乘) is a pathological state where one element bullies another. Currently the system is balanced — trigger a crash to see what happens when an element becomes too strong.",
    crash: "Wood has become rigid and is bullying Earth directly — bypassing Fire. Earth (digestion) is collapsing, Metal (boundaries) is starving. Fire flares wildly. This is why stress destroys your digestion.",
    healing: "Click and hold the bullying element (Wood — green node) to soften it. Breathe flexibility back in to stop the overacting cycle.",
    healed: "The bully has been calmed. The overacting cycle is broken and normal flow resumes.",
  },
};

const ELEMENTS = [
  {
    name: "Water (水 Shuǐ)",
    role: "The Battery",
    icon: Waves,
    color: "text-blue-400",
    bg: "bg-blue-500/10 border-blue-500/20",
    organ: "Kidneys & Bladder",
    emotion: "Fear / Wisdom",
    season: "Winter",
    taste: "Salty",
    description:
      "Water is the root of all energy in your body. It governs your reserves — your adrenals, your deep vitality, your willpower. When Water is strong, you face challenges with calm courage. When depleted, you feel anxious, exhausted, and fearful.",
    signs_balanced: "Strong willpower, healthy bones and teeth, good memory, lustrous hair, courage in the face of adversity",
    signs_imbalanced: "Lower back pain, knee weakness, premature graying, frequent urination, night sweats, irrational fear, tinnitus",
    nourish: "Rest deeply, eat warming soups with bone broth, black beans, walnuts, seaweed. Avoid excess cold. Practice stillness and meditation. Go to bed early in winter.",
  },
  {
    name: "Wood (木 Mù)",
    role: "The Architect",
    icon: TreePine,
    color: "text-green-400",
    bg: "bg-green-500/10 border-green-500/20",
    organ: "Liver & Gallbladder",
    emotion: "Anger / Kindness",
    season: "Spring",
    taste: "Sour",
    description:
      "Wood is the energy of growth, vision, and planning. Your Liver is the general of the body — it ensures Qi flows smoothly everywhere. When Wood is flexible, you are creative and decisive. When rigid, anger and frustration take over.",
    signs_balanced: "Clear vision (literally and figuratively), flexible tendons, smooth menstruation, decisive action, creative thinking",
    signs_imbalanced: "Irritability, headaches (especially temporal), eye problems, tight muscles, PMS, irregular periods, bitter taste in mouth, rib-side pain",
    nourish: "Eat green leafy vegetables, sprouts, and sour foods (lemon, vinegar). Move your body — Wood needs to flow. Practice deep breathing. Express emotions constructively. Avoid excessive alcohol.",
  },
  {
    name: "Fire (火 Huǒ)",
    role: "The Amplifier",
    icon: Flame,
    color: "text-rose-400",
    bg: "bg-rose-500/10 border-rose-500/20",
    organ: "Heart & Small Intestine",
    emotion: "Joy / Mania",
    season: "Summer",
    taste: "Bitter",
    description:
      "Fire governs consciousness, connection, and communication. The Heart houses the Shen (spirit/mind). When Fire is balanced, you radiate warmth, laugh easily, and connect deeply. When excessive, you become manic or anxious.",
    signs_balanced: "Warm personality, clear speech, good sleep, rosy complexion, appropriate laughter, strong memory",
    signs_imbalanced: "Insomnia, anxiety, palpitations, excessive or nervous laughter, tongue sores, scattered thinking, poor circulation",
    nourish: "Eat bitter foods (dark chocolate, arugula, dandelion greens). Practice joy without excess. Meditate on gratitude. Protect your sleep. Limit stimulants. Connect with loved ones.",
  },
  {
    name: "Earth (土 Tǔ)",
    role: "The Processor",
    icon: Mountain,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
    organ: "Spleen & Stomach",
    emotion: "Worry / Empathy",
    season: "Late Summer",
    taste: "Sweet",
    description:
      "Earth is the center — the transformer of all nourishment. Your Spleen takes what you eat (and experience) and converts it into usable energy (Qi and Blood). When Earth is strong, you feel grounded and nourished. When weak, you overthink and worry endlessly.",
    signs_balanced: "Good digestion, strong muscles, clear thinking, healthy appetite, feeling centered and grounded",
    signs_imbalanced: "Bloating, loose stools, fatigue after eating, bruising easily, overthinking, craving sweets, prolapse, edema, poor muscle tone",
    nourish: "Eat warm, cooked foods. Avoid raw, cold foods and excessive dairy. Chew thoroughly. Eat regular meals at consistent times. Root vegetables, squash, millet, and small amounts of natural sweetness (dates, sweet potato). Avoid excessive studying or worry.",
  },
  {
    name: "Metal (金 Jīn)",
    role: "The Editor",
    icon: Gem,
    color: "text-slate-300",
    bg: "bg-slate-400/10 border-slate-400/20",
    organ: "Lungs & Large Intestine",
    emotion: "Grief / Integrity",
    season: "Autumn",
    taste: "Pungent/Spicy",
    description:
      "Metal governs boundaries, release, and refinement. The Lungs take in what is pure (oxygen, inspiration) and the Large Intestine releases what is no longer needed. When Metal is balanced, you have clear boundaries and can let go gracefully. When weak, you cling to grief.",
    signs_balanced: "Clear skin, strong immune system, healthy boundaries, ability to grieve and release, clear breathing",
    signs_imbalanced: "Frequent colds, asthma, skin problems (eczema, dryness), constipation, unresolved grief, difficulty letting go, weak voice",
    nourish: "Breathe deeply — practice pranayama or qigong. Eat pungent foods (garlic, ginger, onion, radish). Spend time in nature. Practice decluttering — physical and emotional. Allow yourself to grieve losses fully.",
  },
];

const CYCLES = [
  {
    name: "The Generating Cycle (相生 Xiāng Shēng)",
    aka: "Mother-Child / Creation Cycle",
    description:
      "Each element nourishes the next, like a mother feeding her child. This is the natural flow of energy when everything is working well.",
    flow: "Water → Wood → Fire → Earth → Metal → Water",
    details: [
      "Water nourishes Wood (rain feeds trees)",
      "Wood feeds Fire (wood fuels flames)",
      "Fire creates Earth (ash becomes soil)",
      "Earth bears Metal (minerals form in earth)",
      "Metal enriches Water (minerals enrich water, metal containers hold water)",
    ],
  },
  {
    name: "The Controlling Cycle (相克 Xiāng Kè)",
    aka: "Grandmother Cycle / Checks & Balances",
    description:
      "Each element keeps another in check, preventing any one element from becoming too dominant. This is your body's natural regulatory system.",
    flow: "Water ⊣ Fire ⊣ Metal ⊣ Wood ⊣ Earth ⊣ Water",
    details: [
      "Water controls Fire (water extinguishes flame)",
      "Fire controls Metal (fire melts metal)",
      "Metal controls Wood (axes cut trees)",
      "Wood controls Earth (roots break through soil)",
      "Earth controls Water (dams hold water)",
    ],
  },
  {
    name: "The Overacting Cycle (相乘 Xiāng Chéng)",
    aka: "Bullying Cycle — PATHOLOGY",
    description:
      "When an element is too strong, it over-controls its target, causing disease. This is what happens in the System Crash visualization above.",
    flow: "Excess Wood → crushes Earth → starves Metal",
    details: [
      "Liver Qi stagnation (stress) attacks the Spleen (digestive issues)",
      "This is why you lose your appetite or get stomach pain when angry or stressed",
      "The Spleen can't nourish Metal, so the Lungs weaken (prone to colds, skin issues)",
      "A vicious cycle begins as depleted elements can't support the next in line",
    ],
  },
];

const TCM_CONCEPTS = [
  {
    title: "Qi (氣) — Vital Energy",
    icon: Wind,
    content:
      "Qi is the fundamental force that drives all life. It flows through your body in specific pathways called meridians. There are many types of Qi: Wei Qi (defensive, like your immune system), Ying Qi (nutritive, powering your organs), Yuan Qi (original, inherited from your parents), and Zong Qi (gathering Qi, from breathing and food). When Qi flows smoothly, you are healthy. When it stagnates, rebels, or deficiency occurs — disease follows.",
  },
  {
    title: "Blood (血 Xuè)",
    icon: Heart,
    content:
      "In TCM, Blood is more than the red fluid — it's the material basis for consciousness and nourishment. The Spleen produces Blood from food, the Heart governs it, the Liver stores it, and the Kidneys provide the marrow to generate it. Blood deficiency shows as pale complexion, dizziness, poor memory, and dry skin. Blood stasis shows as sharp fixed pain, dark complexion, and masses.",
  },
  {
    title: "Yin & Yang (陰陽)",
    icon: Moon,
    content:
      "Everything exists in dynamic balance between Yin (cool, moist, still, nourishing, material) and Yang (warm, dry, active, transforming, functional). Neither is good or bad — both are essential. Your body constantly adjusts between them. Night sweats suggest Yin deficiency. Always feeling cold suggests Yang deficiency. The goal is never to eliminate one, but to harmonize both.",
  },
  {
    title: "The Three Treasures (三寶 Sān Bǎo)",
    icon: Sparkles,
    content:
      "Jing (精, Essence) is your constitutional reserve — inherited from parents, stored in Kidneys. It determines your vitality and lifespan. Qi (氣) is your daily operating energy. Shen (神, Spirit) is your consciousness, awareness, and emotional clarity housed in the Heart. These three form a hierarchy: Jing is the foundation, Qi is the engine, Shen is the light. Preserve your Jing through rest and moderation, cultivate Qi through food and breath, and refine Shen through meditation and virtue.",
  },
  {
    title: "The Six Evils (六邪 Liù Xié)",
    icon: Zap,
    content:
      "External pathogenic factors that cause disease: Wind (rapid onset, moving symptoms, head of all disease), Cold (contraction, pain, slowing), Heat/Fire (inflammation, redness, thirst), Dampness (heaviness, swelling, sluggishness), Dryness (dry skin, cracking, thirst), Summer Heat (heat stroke, exhaustion). These correspond to weather but also to internal imbalances — you can have 'internal wind' (tremors, seizures) or 'internal dampness' (phlegm, edema).",
  },
  {
    title: "Meridians (經絡 Jīng Luò)",
    icon: Droplets,
    content:
      "Twelve primary meridians form a network connecting your organs to the surface of your body. Each meridian has a 2-hour peak time in the Chinese Body Clock. Blockages in meridians cause pain and disease in the associated organ. Acupuncture, acupressure, qigong, and tai chi all work by restoring smooth flow through these channels. The Eight Extraordinary Meridians serve as reservoirs of Qi and Blood.",
  },
  {
    title: "The Body Clock (子午流注)",
    icon: Sun,
    content:
      "Qi flows through each organ in a 2-hour cycle: Lung (3-5am), Large Intestine (5-7am), Stomach (7-9am), Spleen (9-11am), Heart (11am-1pm), Small Intestine (1-3pm), Bladder (3-5pm), Kidney (5-7pm), Pericardium (7-9pm), Triple Burner (9-11pm), Gallbladder (11pm-1am), Liver (1-3am). If you always wake at 3am, your Lung energy may need attention. If you always crash at 3pm, your Bladder meridian may be weak.",
  },
  {
    title: "Tongue & Pulse Diagnosis",
    icon: Brain,
    content:
      "The tongue is a map of your internal organs. The tip reflects the Heart, sides the Liver/Gallbladder, center the Spleen/Stomach, and back the Kidneys. A pale tongue suggests Blood deficiency, red suggests Heat, purple suggests stasis, thick white coating suggests Cold/Dampness. Pulse diagnosis reads 28+ qualities at three positions on each wrist, each corresponding to different organs. Together, these give practitioners a detailed internal picture without any technology.",
  },
];

const DIETARY_THERAPY = [
  {
    title: "Food Energetics",
    content:
      "Every food has a thermal nature (hot, warm, neutral, cool, cold), a flavor (sweet, sour, bitter, pungent, salty), and enters specific organ meridians. Ginger is warm and pungent, entering Lung and Stomach — perfect for cold conditions. Watermelon is cold and sweet, entering Heart and Stomach — cooling for summer heat. Eating according to your constitution and the season is the foundation of TCM health.",
  },
  {
    title: "Congee (粥 Zhōu)",
    content:
      "Rice porridge cooked for hours is the quintessential healing food in TCM. It's easy to digest, nourishes the Spleen, and can be customized: add goji berries for Liver/Kidney Yin, ginger and scallions for expelling cold, red dates for Blood building, lotus seeds for calming the Heart. Congee is often the first food given during illness recovery.",
  },
  {
    title: "Herbal Soups & Teas",
    content:
      "TCM often delivers medicine as food. Astragalus (Huang Qi) in chicken soup boosts Wei Qi. Chrysanthemum tea clears Liver Heat (headaches, red eyes). Ginger-date tea warms the middle and tonifies Qi. Eight Treasure Soup (Ba Zhen Tang) nourishes Qi and Blood. These aren't just folk remedies — they're precise therapeutic formulations with millennia of clinical observation.",
  },
];

export default function TCMTutorial() {
  const [cycleMode, setCycleMode] = useState<CycleMode>("generating");
  const [currentScene, setCurrentScene] = useState<SceneState>("healthy");
  const [heldElement, setHeldElement] = useState<ElementType | null>(null);
  const [activeTab, setActiveTab] = useState("interactive");

  const handleElementDown = useCallback((el: ElementType) => {
    if (currentScene === "healing") setHeldElement(el);
  }, [currentScene]);

  const handleElementUp = useCallback(() => {
    if (heldElement) {
      setHeldElement(null);
      setCurrentScene("healed");
    }
  }, [heldElement]);

  const switchCycle = useCallback((mode: CycleMode) => {
    setCycleMode(mode);
    setCurrentScene("healthy");
    setHeldElement(null);
  }, []);

  const description = CYCLE_DESCRIPTIONS[cycleMode][currentScene];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-8 animate-fade-in">
      <SectionHeader
        icon={Sparkles}
        title="Traditional Chinese Medicine"
        subtitle="Explore the Five Element system through an interactive 3D visualization of your Emotional Metabolism."
        accentColor="270 60% 50%"
        pattern="rings"
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex flex-wrap gap-1 w-full max-w-4xl h-auto">
          <TabsTrigger value="interactive">3D Experience</TabsTrigger>
          <TabsTrigger value="elements">Five Elements</TabsTrigger>
          <TabsTrigger value="bodyclock">Body Clock</TabsTrigger>
          <TabsTrigger value="meridians">Meridians</TabsTrigger>
          <TabsTrigger value="concepts">Core Theory</TabsTrigger>
          <TabsTrigger value="diet">Dietary Therapy</TabsTrigger>
        </TabsList>

        {/* ─── 3D INTERACTIVE SCENE ─── */}
        <TabsContent value="interactive" className="space-y-6 mt-6">
          {/* Cycle mode selector */}
          <div className="space-y-3">
            <h3 className="text-sm font-display font-semibold uppercase tracking-wider text-muted-foreground">
              Select Cycle
            </h3>
            <div className="flex flex-wrap gap-2">
              {CYCLE_MODES.map((c) => (
                <Button
                  key={c.key}
                  variant={cycleMode === c.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => switchCycle(c.key)}
                  className="gap-1.5"
                >
                  <c.icon className={`h-4 w-4 ${cycleMode === c.key ? "" : c.color}`} />
                  {c.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Scene state controls */}
          <div className="flex flex-wrap gap-2">
            {SCENE_BUTTONS.map((s) => (
              <Button
                key={s.key}
                variant={currentScene === s.key ? "secondary" : "ghost"}
                size="sm"
                onClick={() => {
                  setCurrentScene(s.key);
                  setHeldElement(null);
                }}
                className="gap-1.5"
              >
                <s.icon className="h-4 w-4" />
                {s.label}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCurrentScene("healthy");
                setHeldElement(null);
              }}
            >
              <RotateCcw className="h-4 w-4 mr-1" /> Reset
            </Button>
          </div>

          {/* Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${cycleMode}-${currentScene}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-lg bg-accent/40 border border-border/50 p-4"
            >
              <p className="font-body text-sm text-muted-foreground">{description}</p>
            </motion.div>
          </AnimatePresence>

          {/* 3D Scene */}
          <EmotionalMetabolism
            cycleMode={cycleMode}
            scene={currentScene}
            heldElement={heldElement}
            onElementPointerDown={handleElementDown}
            onElementPointerUp={handleElementUp}
          />

          {/* Healing prompt */}
          {currentScene === "healing" && !heldElement && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center p-4 rounded-lg border border-primary/20 bg-primary/5"
            >
              <Hand className="h-6 w-6 mx-auto mb-2 text-primary animate-pulse" />
              <p className="font-body text-sm text-muted-foreground">
                Click and hold the <strong>stressed element</strong> in the 3D scene to restore balance
              </p>
            </motion.div>
          )}

          {currentScene === "healed" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20"
            >
              <Sparkles className="h-6 w-6 mx-auto mb-2 text-primary" />
              <p className="font-body text-sm">
                Balance restored. The {cycleMode} cycle is harmonized.
              </p>
            </motion.div>
          )}

          {/* Cycles reference */}
          <div className="space-y-4 pt-4">
            <h2 className="text-2xl font-display font-bold">The Three Cycles</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {CYCLES.map((cycle) => (
                <Card key={cycle.name} className="border-border/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-base">{cycle.name}</CardTitle>
                    <p className="text-xs text-muted-foreground font-body">{cycle.aka}</p>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm font-body text-muted-foreground">{cycle.description}</p>
                    <code className="text-xs text-primary block">{cycle.flow}</code>
                    <ul className="space-y-1">
                      {cycle.details.map((d, i) => (
                        <li key={i} className="text-xs font-body text-muted-foreground flex gap-1.5">
                          <ChevronRight className="h-3 w-3 mt-0.5 shrink-0 text-primary" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ─── FIVE ELEMENTS DEEP DIVE ─── */}
        <TabsContent value="elements" className="space-y-6 mt-6">
          <p className="font-body text-muted-foreground max-w-2xl">
            The Five Elements (五行 Wǔ Xíng) are not static substances — they
            are dynamic phases of transformation. Everything in the universe,
            including your body, emotions, seasons, and foods, maps to these five
            archetypes.
          </p>
          {ELEMENTS.map((el) => (
            <Card
              key={el.name}
              className={`border ${el.bg}`}
            >
              <CardHeader>
                <div className="flex items-center gap-3">
                  <el.icon className={`h-6 w-6 ${el.color}`} />
                  <div>
                    <CardTitle className="font-display text-xl">
                      {el.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground font-body">
                      {el.role} · {el.organ} · {el.season} · {el.emotion} ·
                      Taste: {el.taste}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="font-body text-sm">{el.description}</p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">
                      Signs of Balance
                    </h4>
                    <p className="text-sm font-body">{el.signs_balanced}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-destructive">
                      Signs of Imbalance
                    </h4>
                    <p className="text-sm font-body">{el.signs_imbalanced}</p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-primary">
                      How to Nourish
                    </h4>
                    <p className="text-sm font-body">{el.nourish}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* ─── BODY CLOCK ─── */}
        <TabsContent value="bodyclock" className="space-y-6 mt-6">
          <p className="font-body text-muted-foreground max-w-2xl">
            The Chinese Body Clock (子午流注 Zǐ Wǔ Liú Zhù) maps how Qi
            circulates through your 12 organ meridians in 2-hour cycles. Tap any
            segment to learn what your body is doing and how to support it.
          </p>
          <BodyClock />
        </TabsContent>

        {/* ─── MERIDIANS ─── */}
        <TabsContent value="meridians" className="space-y-6 mt-6">
          <p className="font-body text-muted-foreground max-w-2xl">
            The 12 primary meridians (經絡 Jīng Luò) form paired Yin-Yang channels
            that connect your organs to the surface of your body. Each has specific
            acupressure points used for thousands of years to restore health.
          </p>
          <MeridianPathways />
        </TabsContent>


        <TabsContent value="concepts" className="space-y-6 mt-6">
          <p className="font-body text-muted-foreground max-w-2xl">
            The theoretical foundation of Traditional Chinese Medicine spans
            thousands of years and provides a comprehensive framework for
            understanding health, disease, and the human body's relationship with
            nature.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {TCM_CONCEPTS.map((concept) => (
              <Card key={concept.title} className="border-border/60">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <concept.icon className="h-5 w-5 text-primary" />
                    <CardTitle className="font-display text-base">
                      {concept.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-body text-muted-foreground leading-relaxed">
                    {concept.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* ─── DIETARY THERAPY ─── */}
        <TabsContent value="diet" className="space-y-6 mt-6">
          <p className="font-body text-muted-foreground max-w-2xl">
            "Medicine and food share the same origin" (藥食同源) — dietary
            therapy is the first line of treatment in TCM. Food is classified by
            its thermal nature, flavor, and organ affinity.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            {DIETARY_THERAPY.map((item) => (
              <Card key={item.title} className="border-border/60">
                <CardHeader className="pb-2">
                  <CardTitle className="font-display text-base">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm font-body text-muted-foreground leading-relaxed">
                    {item.content}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Thermal Nature Table */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-display text-lg">
                Food Thermal Nature Guide
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2 text-xs font-body">
                {[
                  { label: "Hot 🔥", foods: "Chili, cinnamon, dried ginger, pepper, lamb, spirits", color: "text-red-400" },
                  { label: "Warm ☀️", foods: "Chicken, shrimp, ginger, garlic, onion, oats, cherries, peach, dates, walnut", color: "text-orange-400" },
                  { label: "Neutral ⚖️", foods: "Rice, potato, sweet potato, corn, beef, pork, eggs, carrots, cabbage, mushrooms", color: "text-yellow-400" },
                  { label: "Cool 🌙", foods: "Wheat, barley, mung bean, tofu, apple, pear, celery, lettuce, spinach, green tea", color: "text-cyan-400" },
                  { label: "Cold ❄️", foods: "Watermelon, banana, cucumber, bitter melon, seaweed, crab, clam, salt, soy sauce", color: "text-blue-400" },
                ].map((cat) => (
                  <div key={cat.label} className="space-y-1">
                    <h4 className={`font-semibold ${cat.color}`}>{cat.label}</h4>
                    <p className="text-muted-foreground">{cat.foods}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Flavor Actions */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-display text-lg">
                The Five Flavors & Their Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-2 text-xs font-body">
                {[
                  { flavor: "Sweet", action: "Tonifies, harmonizes, moistens. Nourishes Spleen. Earth element.", examples: "Rice, dates, honey, sweet potato" },
                  { flavor: "Sour", action: "Astringes, consolidates. Nourishes Liver. Wood element.", examples: "Lemon, vinegar, plum, hawthorn" },
                  { flavor: "Bitter", action: "Drains, dries, hardens. Nourishes Heart. Fire element.", examples: "Bitter melon, green tea, arugula" },
                  { flavor: "Pungent", action: "Disperses, promotes movement. Nourishes Lungs. Metal element.", examples: "Ginger, garlic, mint, scallion" },
                  { flavor: "Salty", action: "Softens hardness, purges. Nourishes Kidneys. Water element.", examples: "Seaweed, miso, soy sauce, salt" },
                ].map((f) => (
                  <div key={f.flavor} className="space-y-1">
                    <h4 className="font-semibold text-foreground">{f.flavor}</h4>
                    <p className="text-muted-foreground">{f.action}</p>
                    <p className="text-primary/80 italic">{f.examples}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
