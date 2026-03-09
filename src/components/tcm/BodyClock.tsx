import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const BODY_CLOCK = [
  {
    time: "3–5 AM",
    organ: "Lung",
    element: "Metal",
    emoji: "🫁",
    color: "hsl(210 15% 70%)",
    bgClass: "bg-slate-400/10 border-slate-400/30",
    activeClass: "bg-slate-400/25 border-slate-300/50",
    angle: 0,
    tip: "The body is in deep cleansing mode. If you wake consistently at this time, grief or respiratory issues may need attention. Best to sleep deeply — this is peak detox for the lungs.",
    activity: "Deep sleep, lung detox, oxygen distribution",
    symptoms: "Waking at 3am, coughing, asthma attacks, night sweats",
    advice: "Sleep with window cracked for fresh air. If awake, practice slow deep breathing. Avoid cold drinks.",
  },
  {
    time: "5–7 AM",
    organ: "Large Intestine",
    element: "Metal",
    emoji: "🔄",
    color: "hsl(30 15% 65%)",
    bgClass: "bg-amber-400/10 border-amber-400/20",
    activeClass: "bg-amber-400/20 border-amber-300/40",
    angle: 30,
    tip: "Ideal time for a bowel movement. Drink warm water upon waking to activate the Large Intestine. This organ governs 'letting go' — physically and emotionally.",
    activity: "Elimination, release, waking up",
    symptoms: "Constipation, difficulty waking, skin breakouts",
    advice: "Drink warm lemon water. Have a bowel movement. Practice gentle stretching or walking.",
  },
  {
    time: "7–9 AM",
    organ: "Stomach",
    element: "Earth",
    emoji: "🍲",
    color: "hsl(45 80% 55%)",
    bgClass: "bg-yellow-500/10 border-yellow-500/20",
    activeClass: "bg-yellow-500/20 border-yellow-400/40",
    angle: 60,
    tip: "Your digestive fire is strongest now. Eat your biggest, warmest meal of the day. Skipping breakfast weakens the Spleen over time, leading to fatigue and poor concentration.",
    activity: "Peak digestion, nutrient absorption",
    symptoms: "No appetite in morning, acid reflux, bad breath",
    advice: "Eat a warm, nourishing breakfast (congee, oatmeal, eggs). Avoid cold smoothies and iced drinks.",
  },
  {
    time: "9–11 AM",
    organ: "Spleen",
    element: "Earth",
    emoji: "🧠",
    color: "hsl(40 70% 50%)",
    bgClass: "bg-amber-500/10 border-amber-500/20",
    activeClass: "bg-amber-500/20 border-amber-400/40",
    angle: 90,
    tip: "The Spleen transforms food into Qi and Blood. This is your peak mental clarity window — ideal for focused work, studying, and important decisions. Overthinking weakens the Spleen.",
    activity: "Transformation of food to energy, mental clarity",
    symptoms: "Brain fog, bloating, fatigue, sugar cravings",
    advice: "Do your most demanding intellectual work now. Avoid excessive worry. Snack on warming foods if needed.",
  },
  {
    time: "11 AM–1 PM",
    organ: "Heart",
    element: "Fire",
    emoji: "❤️",
    color: "hsl(340 80% 55%)",
    bgClass: "bg-rose-500/10 border-rose-500/20",
    activeClass: "bg-rose-500/20 border-rose-400/40",
    angle: 120,
    tip: "The Heart houses the Shen (spirit/mind). This is the peak yang time. Eat a light lunch, connect with people, and feel joy. A short nap at this time nourishes the Heart Yin.",
    activity: "Peak consciousness, social connection, joy",
    symptoms: "Palpitations at midday, insomnia, anxiety, excessive sweating",
    advice: "Take a light lunch. Connect with colleagues or friends. Consider a 20-min power nap. Avoid intense arguments.",
  },
  {
    time: "1–3 PM",
    organ: "Small Intestine",
    element: "Fire",
    emoji: "🔬",
    color: "hsl(15 70% 55%)",
    bgClass: "bg-orange-500/10 border-orange-500/20",
    activeClass: "bg-orange-500/20 border-orange-400/40",
    angle: 150,
    tip: "The Small Intestine sorts the pure from the impure — in food and in thoughts. This is a great time for organizing, sorting emails, and making decisions about what to keep and what to discard.",
    activity: "Sorting nutrients from waste, discernment",
    symptoms: "Afternoon bloating, poor nutrient absorption, indecisiveness",
    advice: "Organize your workspace. Sort through tasks. Drink water to aid absorption. Avoid heavy meals.",
  },
  {
    time: "3–5 PM",
    organ: "Bladder",
    element: "Water",
    emoji: "💧",
    color: "hsl(210 70% 50%)",
    bgClass: "bg-blue-500/10 border-blue-500/20",
    activeClass: "bg-blue-500/20 border-blue-400/40",
    angle: 180,
    tip: "The Bladder meridian is the longest in the body, running from the eyes down the back to the little toe. This is peak study/work time if well-hydrated. Salty snacks and tea help. The afternoon slump often means Bladder Qi is weak.",
    activity: "Fluid metabolism, memory consolidation, peak work energy",
    symptoms: "Afternoon fatigue, back pain, urinary issues, headache at the back of the head",
    advice: "Drink salty/mineral water or herbal tea. Stretch your back. This is actually a second peak for productive work.",
  },
  {
    time: "5–7 PM",
    organ: "Kidney",
    element: "Water",
    emoji: "🔋",
    color: "hsl(220 60% 40%)",
    bgClass: "bg-blue-700/10 border-blue-700/20",
    activeClass: "bg-blue-700/20 border-blue-600/40",
    angle: 210,
    tip: "The Kidneys store your Jing (essence) — your deepest reserves. This is the time to slow down, eat a nourishing dinner, and begin transitioning from Yang (active) to Yin (restful) energy. Bone broth soups are excellent now.",
    activity: "Replenishing reserves, storing vital essence",
    symptoms: "Low back pain at evening, fatigue, low libido, weak knees, premature aging",
    advice: "Eat a warm dinner with kidney-nourishing foods (black beans, walnuts, bone broth). Begin winding down.",
  },
  {
    time: "7–9 PM",
    organ: "Pericardium",
    element: "Fire",
    emoji: "🛡️",
    color: "hsl(330 60% 50%)",
    bgClass: "bg-pink-500/10 border-pink-500/20",
    activeClass: "bg-pink-500/20 border-pink-400/40",
    angle: 240,
    tip: "The Pericardium protects the Heart. This is the ideal time for intimacy, gentle socializing, reading, and self-care. Your emotional armor comes down — be with people who make you feel safe.",
    activity: "Emotional protection, intimacy, social bonding",
    symptoms: "Emotional vulnerability, chest tightness, difficulty relaxing",
    advice: "Spend time with loved ones. Practice gentle yoga or tai chi. Take a warm bath. Avoid screens if possible.",
  },
  {
    time: "9–11 PM",
    organ: "Triple Burner",
    element: "Fire",
    emoji: "🌡️",
    color: "hsl(280 50% 50%)",
    bgClass: "bg-purple-500/10 border-purple-500/20",
    activeClass: "bg-purple-500/20 border-purple-400/40",
    angle: 270,
    tip: "The Triple Burner (San Jiao) regulates water and heat across the upper, middle, and lower body. This is when the endocrine system recalibrates. You should be falling asleep by 11 PM to catch the Gallbladder detox window.",
    activity: "Thermoregulation, endocrine balancing, preparing for sleep",
    symptoms: "Insomnia, hot flashes, confusion, headaches",
    advice: "Dim lights, avoid screens. Practice calming meditation. Be in bed by 10:30 PM. Herbal tea (chamomile, passionflower).",
  },
  {
    time: "11 PM–1 AM",
    organ: "Gallbladder",
    element: "Wood",
    emoji: "🌿",
    color: "hsl(140 50% 40%)",
    bgClass: "bg-green-600/10 border-green-600/20",
    activeClass: "bg-green-600/20 border-green-500/40",
    angle: 300,
    tip: "The Gallbladder governs decision-making and courage. It processes bile to break down fats. You MUST be asleep by now — this is when Yang energy begins to regenerate. Night-shift workers often develop Gallbladder issues.",
    activity: "Bile secretion, cellular repair, courage regeneration",
    symptoms: "Waking at midnight, indecisiveness, bitter taste, rib pain",
    advice: "Be deeply asleep. Avoid late-night eating, especially fatty foods. If awake, practice letting go of the day's decisions.",
  },
  {
    time: "1–3 AM",
    organ: "Liver",
    element: "Wood",
    emoji: "🌳",
    color: "hsl(150 60% 35%)",
    bgClass: "bg-emerald-600/10 border-emerald-600/20",
    activeClass: "bg-emerald-600/20 border-emerald-500/40",
    angle: 330,
    tip: "The Liver cleanses the blood, plans the body's activities, and ensures smooth Qi flow. Deep sleep is essential here. If you consistently wake between 1-3 AM, suppressed anger or Liver Qi stagnation is likely. Alcohol disrupts this cycle severely.",
    activity: "Blood cleansing, detox, planning, Qi distribution",
    symptoms: "Waking 1-3am, vivid/angry dreams, eye problems, irritability, tight muscles",
    advice: "Must be asleep. Avoid alcohol. If you wake, don't look at your phone — practice deep breathing to soothe the Liver.",
  },
];

function getHourAngle(): number {
  const now = new Date();
  const hours = now.getHours() + now.getMinutes() / 60;
  return (hours / 24) * 360;
}

function getCurrentPeriodIndex(): number {
  const now = new Date();
  const hour = now.getHours();
  // 3-5=0, 5-7=1, 7-9=2, 9-11=3, 11-13=4, 13-15=5, 15-17=6, 17-19=7, 19-21=8, 21-23=9, 23-01=10, 01-03=11
  const shifted = (hour - 3 + 24) % 24;
  return Math.floor(shifted / 2);
}

export function BodyClock() {
  const [selected, setSelected] = useState<number>(getCurrentPeriodIndex());
  const currentIndex = getCurrentPeriodIndex();
  const item = BODY_CLOCK[selected];

  return (
    <div className="space-y-6">
      {/* Clock visualization */}
      <div className="relative w-full max-w-lg mx-auto aspect-square">
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {/* Background circle */}
          <circle cx="200" cy="200" r="180" fill="none" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.3" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.15" />

          {/* Segments */}
          {BODY_CLOCK.map((slot, i) => {
            const startAngle = (i * 30 - 90) * (Math.PI / 180);
            const endAngle = ((i + 1) * 30 - 90) * (Math.PI / 180);
            const midAngle = ((i * 30 + 15) - 90) * (Math.PI / 180);
            const isSelected = i === selected;
            const isCurrent = i === currentIndex;
            const r = isSelected ? 165 : 155;
            const innerR = 80;

            const x1 = 200 + r * Math.cos(startAngle);
            const y1 = 200 + r * Math.sin(startAngle);
            const x2 = 200 + r * Math.cos(endAngle);
            const y2 = 200 + r * Math.sin(endAngle);
            const ix1 = 200 + innerR * Math.cos(startAngle);
            const iy1 = 200 + innerR * Math.sin(startAngle);
            const ix2 = 200 + innerR * Math.cos(endAngle);
            const iy2 = 200 + innerR * Math.sin(endAngle);

            const labelR = (r + innerR) / 2;
            const lx = 200 + labelR * Math.cos(midAngle);
            const ly = 200 + labelR * Math.sin(midAngle);

            const emojiR = labelR + 2;
            const ex = 200 + emojiR * Math.cos(midAngle);
            const ey = 200 + emojiR * Math.sin(midAngle);

            const timeR = r + 14;
            const tx = 200 + timeR * Math.cos(midAngle);
            const ty = 200 + timeR * Math.sin(midAngle);

            const path = `M ${ix1} ${iy1} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 0 0 ${ix1} ${iy1}`;

            return (
              <g key={i} onClick={() => setSelected(i)} className="cursor-pointer">
                <path
                  d={path}
                  fill={isSelected ? slot.color : isCurrent ? `${slot.color}88` : `${slot.color}33`}
                  stroke={isSelected ? slot.color : "hsl(var(--border))"}
                  strokeWidth={isSelected ? 2 : 0.5}
                  opacity={isSelected ? 1 : 0.8}
                  className="transition-all duration-300 hover:opacity-100"
                />
                <text
                  x={ex}
                  y={ey}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="16"
                  className="pointer-events-none select-none"
                >
                  {slot.emoji}
                </text>
                <text
                  x={tx}
                  y={ty}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize="7"
                  fill="hsl(var(--muted-foreground))"
                  className="pointer-events-none select-none"
                >
                  {slot.time}
                </text>
              </g>
            );
          })}

          {/* Center label */}
          <text x="200" y="190" textAnchor="middle" dominantBaseline="central" fontSize="13" fill="hsl(var(--foreground))" fontWeight="bold">
            {item.organ}
          </text>
          <text x="200" y="208" textAnchor="middle" dominantBaseline="central" fontSize="9" fill="hsl(var(--muted-foreground))">
            {item.element} Element
          </text>

          {/* Current time indicator */}
          {(() => {
            const angle = (getHourAngle() - 90) * (Math.PI / 180);
            const nx = 200 + 170 * Math.cos(angle);
            const ny = 200 + 170 * Math.sin(angle);
            return <circle cx={nx} cy={ny} r="4" fill="hsl(var(--primary))" className="animate-pulse" />;
          })()}
        </svg>
      </div>

      {/* Detail card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Card className={`border ${item.activeClass}`}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.emoji}</span>
                <div>
                  <h3 className="font-display text-lg font-bold">{item.organ}</h3>
                  <p className="text-xs text-muted-foreground font-body">
                    {item.time} · {item.element} Element
                    {selected === currentIndex && (
                      <span className="ml-2 text-primary font-semibold">● Active Now</span>
                    )}
                  </p>
                </div>
              </div>

              <p className="text-sm font-body leading-relaxed">{item.tip}</p>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">
                    Primary Activity
                  </h4>
                  <p className="text-sm font-body">{item.activity}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-destructive">
                    Warning Signs
                  </h4>
                  <p className="text-sm font-body">{item.symptoms}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-primary">
                    Health Tips
                  </h4>
                  <p className="text-sm font-body">{item.advice}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
