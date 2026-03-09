import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

interface AcuPoint {
  name: string;
  location: string;
  indication: string;
}

interface Meridian {
  name: string;
  chinese: string;
  element: string;
  yin_yang: "Yin" | "Yang";
  paired: string;
  emoji: string;
  color: string;
  bgClass: string;
  activeClass: string;
  pathway: string;
  totalPoints: number;
  bodyClockTime: string;
  functions: string;
  commonImbalances: string;
  keyPoints: AcuPoint[];
}

const MERIDIANS: Meridian[] = [
  {
    name: "Lung",
    chinese: "手太陰肺經",
    element: "Metal",
    yin_yang: "Yin",
    paired: "Large Intestine",
    emoji: "🫁",
    color: "hsl(210 15% 70%)",
    bgClass: "bg-slate-400/10 border-slate-400/20",
    activeClass: "bg-slate-400/20 border-slate-300/40",
    pathway: "Starts in the middle burner (stomach area), descends to the Large Intestine, returns up through the diaphragm, enters the Lungs, rises to the throat, then descends along the inner arm to the thumb.",
    totalPoints: 11,
    bodyClockTime: "3–5 AM",
    functions: "Governs Qi and respiration. Controls the skin and body hair. Opens to the nose. Regulates water passages. Houses the corporeal soul (Po).",
    commonImbalances: "Cough, asthma, shortness of breath, chest tightness, sore throat, nasal congestion, skin problems, spontaneous sweating, weak voice, grief.",
    keyPoints: [
      { name: "LU-1 (Zhōng Fǔ)", location: "Below the outer end of the clavicle, 6 cun lateral to the midline", indication: "Cough, asthma, chest pain, shoulder pain. Front-Mu point of the Lung — used for diagnosis and treatment." },
      { name: "LU-5 (Chǐ Zé)", location: "At the elbow crease, on the radial side of the biceps tendon", indication: "Cough with phlegm, asthma, elbow pain. He-Sea point — clears Lung Heat and descends rebellious Qi." },
      { name: "LU-7 (Liè Quē)", location: "Above the wrist, 1.5 cun from the wrist crease on the radial side", indication: "Headache, stiff neck, cough, sore throat, facial paralysis. Luo-Connecting point — one of the Four Command Points (head & neck)." },
      { name: "LU-9 (Tài Yuān)", location: "At the wrist crease, radial side, where you feel the pulse", indication: "Cough, asthma, wrist pain, weak pulse. Shu-Stream & Yuan-Source point — tonifies Lung Qi, influences all blood vessels." },
    ],
  },
  {
    name: "Large Intestine",
    chinese: "手陽明大腸經",
    element: "Metal",
    yin_yang: "Yang",
    paired: "Lung",
    emoji: "🔄",
    color: "hsl(30 50% 55%)",
    bgClass: "bg-amber-500/10 border-amber-500/20",
    activeClass: "bg-amber-500/20 border-amber-400/40",
    pathway: "Starts at the tip of the index finger, runs along the radial side of the forearm, over the elbow and upper arm, across the shoulder, up the neck to the face, ending beside the opposite nostril.",
    totalPoints: 20,
    bodyClockTime: "5–7 AM",
    functions: "Controls elimination and letting go. Absorbs water from waste. Paired with the Lungs in Metal element — governs boundaries at all levels.",
    commonImbalances: "Constipation, diarrhea, abdominal pain, toothache, sore throat, nosebleed, shoulder pain, skin issues, difficulty letting go.",
    keyPoints: [
      { name: "LI-4 (Hé Gǔ)", location: "In the web between thumb and index finger, at the highest point of the muscle", indication: "THE most important point in acupressure. Headache, toothache, facial pain, common cold, fever, constipation, labor induction. CONTRAINDICATED in pregnancy." },
      { name: "LI-11 (Qū Chí)", location: "At the lateral end of the elbow crease when arm is flexed", indication: "Fever, sore throat, skin diseases, elbow pain, hypertension. He-Sea point — clears Heat from the whole body." },
      { name: "LI-20 (Yíng Xiāng)", location: "In the nasolabial groove, beside the midpoint of the nostril", indication: "Nasal congestion, loss of smell, facial paralysis, itchy face. Opens the nasal passages powerfully." },
    ],
  },
  {
    name: "Stomach",
    chinese: "足陽明胃經",
    element: "Earth",
    yin_yang: "Yang",
    paired: "Spleen",
    emoji: "🍲",
    color: "hsl(45 80% 55%)",
    bgClass: "bg-yellow-500/10 border-yellow-500/20",
    activeClass: "bg-yellow-500/20 border-yellow-400/40",
    pathway: "Starts beside the nose, ascends to the forehead, then descends through the face, neck, chest, and abdomen. Continues down the front of the thigh and leg to the 2nd toe.",
    totalPoints: 45,
    bodyClockTime: "7–9 AM",
    functions: "Controls 'rotting and ripening' of food. The 'Sea of Grain and Water.' Governs the descending of Qi (downward movement of digestion). The longest meridian with 45 points.",
    commonImbalances: "Poor appetite, nausea, vomiting, acid reflux, bloating, facial acne, toothache, knee pain, mania, frontal headache.",
    keyPoints: [
      { name: "ST-25 (Tiān Shū)", location: "2 cun lateral to the navel", indication: "All intestinal disorders — diarrhea, constipation, IBS, abdominal pain. Front-Mu point of the Large Intestine." },
      { name: "ST-36 (Zú Sān Lǐ)", location: "3 cun below the kneecap, one finger-width lateral to the shinbone", indication: "THE most important point for overall health. Boosts energy, strengthens immunity, aids all digestive issues, knee pain, mental clarity. One of the Four Command Points (abdomen)." },
      { name: "ST-40 (Fēng Lóng)", location: "Midway between knee and ankle, two finger-widths lateral to the shinbone", indication: "THE point for resolving phlegm — physical (cough, congestion) and mental (foggy thinking, dizziness). Luo-Connecting point." },
      { name: "ST-44 (Nèi Tíng)", location: "Between the 2nd and 3rd toes, at the web margin", indication: "Toothache, facial pain, stomach heat, acid reflux, nosebleed. Ying-Spring point — clears Stomach Heat." },
    ],
  },
  {
    name: "Spleen",
    chinese: "足太陰脾經",
    element: "Earth",
    yin_yang: "Yin",
    paired: "Stomach",
    emoji: "🧠",
    color: "hsl(40 70% 50%)",
    bgClass: "bg-amber-600/10 border-amber-600/20",
    activeClass: "bg-amber-600/20 border-amber-500/40",
    pathway: "Starts at the medial tip of the big toe, runs along the inner foot, up the inner leg and thigh, through the abdomen, and into the chest where it connects to the Heart.",
    totalPoints: 21,
    bodyClockTime: "9–11 AM",
    functions: "Transforms food into Qi and Blood. Governs muscles and limbs. Holds Blood in the vessels. Raises Qi (prevents prolapse). Houses thought and intellect.",
    commonImbalances: "Fatigue, poor appetite, bloating, loose stools, bruising, heavy limbs, edema, overthinking, obsessive worry, prolapse, menstrual flooding.",
    keyPoints: [
      { name: "SP-3 (Tài Bái)", location: "On the medial side of the foot, behind the big toe joint", indication: "Abdominal distension, stomach pain, vomiting, diarrhea. Yuan-Source point — tonifies the Spleen directly." },
      { name: "SP-6 (Sān Yīn Jiāo)", location: "3 cun above the inner ankle bone, behind the tibia", indication: "THE most important point for gynecology, blood issues, insomnia, digestive problems. Meeting point of Spleen, Liver, and Kidney. CONTRAINDICATED in pregnancy." },
      { name: "SP-9 (Yīn Líng Quán)", location: "Below the knee on the inner side, in the depression below the tibial condyle", indication: "Edema, urinary difficulty, knee pain, dampness in the body. He-Sea point — resolves Dampness powerfully." },
    ],
  },
  {
    name: "Heart",
    chinese: "手少陰心經",
    element: "Fire",
    yin_yang: "Yin",
    paired: "Small Intestine",
    emoji: "❤️",
    color: "hsl(340 80% 55%)",
    bgClass: "bg-rose-500/10 border-rose-500/20",
    activeClass: "bg-rose-500/20 border-rose-400/40",
    pathway: "Originates in the Heart, descends through the diaphragm to the Small Intestine. A branch ascends to the eye. The main meridian runs along the inner arm to the little finger.",
    totalPoints: 9,
    bodyClockTime: "11 AM–1 PM",
    functions: "Governs Blood and blood vessels. Houses the Shen (spirit/consciousness). Controls speech and sweat. Opens to the tongue. The 'Emperor' of all organs.",
    commonImbalances: "Insomnia, anxiety, palpitations, poor memory, dream-disturbed sleep, tongue sores, excessive sweating, mania, incoherent speech.",
    keyPoints: [
      { name: "HT-3 (Shào Hǎi)", location: "At the medial end of the elbow crease when arm is flexed", indication: "Elbow pain, numbness of arm, heart pain, anxiety. He-Sea point — clears Heart Fire, calms the mind." },
      { name: "HT-7 (Shén Mén)", location: "At the wrist crease, on the ulnar side, in the depression by the pisiform bone", indication: "THE primary point for insomnia, anxiety, palpitations, poor memory, emotional disturbance. Yuan-Source point — calms the Shen profoundly." },
    ],
  },
  {
    name: "Small Intestine",
    chinese: "手太陽小腸經",
    element: "Fire",
    yin_yang: "Yang",
    paired: "Heart",
    emoji: "🔬",
    color: "hsl(15 70% 55%)",
    bgClass: "bg-orange-500/10 border-orange-500/20",
    activeClass: "bg-orange-500/20 border-orange-400/40",
    pathway: "Starts at the tip of the little finger, runs along the ulnar side of the hand and forearm, behind the elbow, up the back of the arm, zigzags across the shoulder blade, ascends the neck to the cheek and ear.",
    totalPoints: 19,
    bodyClockTime: "1–3 PM",
    functions: "Separates the pure from the impure — in food (nutrients vs. waste) and in thoughts (clarity vs. confusion). 'The Official of Reception.'",
    commonImbalances: "Lower abdominal pain, shoulder blade pain, stiff neck, deafness, sore throat, jaw pain, difficulty discerning/deciding.",
    keyPoints: [
      { name: "SI-3 (Hòu Xī)", location: "On the ulnar side of the hand, in the depression behind the 5th metacarpal head", indication: "Stiff neck, back pain, headache, ear problems. Shu-Stream point — opens the Du (Governing) Vessel. Excellent for all spine issues." },
      { name: "SI-19 (Tīng Gōng)", location: "In front of the ear, in the depression when the mouth is open", indication: "Deafness, tinnitus, ear infections, TMJ pain. Meeting point with Gallbladder and Triple Burner meridians." },
    ],
  },
  {
    name: "Bladder",
    chinese: "足太陽膀胱經",
    element: "Water",
    yin_yang: "Yang",
    paired: "Kidney",
    emoji: "💧",
    color: "hsl(210 70% 50%)",
    bgClass: "bg-blue-500/10 border-blue-500/20",
    activeClass: "bg-blue-500/20 border-blue-400/40",
    pathway: "Starts at the inner eye, goes over the head, down the ENTIRE back in two parallel lines alongside the spine, through the buttocks, down the back of the leg to the little toe. The longest pathway.",
    totalPoints: 67,
    bodyClockTime: "3–5 PM",
    functions: "Stores and excretes urine. Houses the Back-Shu points — direct access to every organ. The 'Minister of the Reservoir.' Governs the entire back and spine.",
    commonImbalances: "Urinary issues, back pain (any level), sciatica, headache (occipital), stiff neck, eye problems, nasal congestion, leg pain.",
    keyPoints: [
      { name: "BL-2 (Zǎn Zhú)", location: "At the medial end of the eyebrow, in the supraorbital notch", indication: "Headache, eye pain, blurred vision, tearing, sinus pain. Key point for all eye conditions." },
      { name: "BL-13 (Fèi Shū)", location: "1.5 cun lateral to the lower border of the 3rd thoracic vertebra", indication: "All Lung conditions — cough, asthma, night sweats, skin problems. Back-Shu point of the Lung." },
      { name: "BL-23 (Shèn Shū)", location: "1.5 cun lateral to the lower border of the 2nd lumbar vertebra", indication: "Lower back pain, kidney issues, tinnitus, impotence, irregular menstruation, fatigue. Back-Shu point of the Kidney." },
      { name: "BL-40 (Wěi Zhōng)", location: "At the midpoint of the back of the knee crease", indication: "Lower back pain, sciatica, knee problems, skin diseases, heat stroke. He-Sea point — one of Four Command Points (back & lower body)." },
      { name: "BL-60 (Kūn Lún)", location: "Between the Achilles tendon and the outer ankle bone", indication: "Headache, neck stiffness, back pain, sciatica, ankle pain, difficult labor. 'Aspirin point.' CONTRAINDICATED in pregnancy." },
    ],
  },
  {
    name: "Kidney",
    chinese: "足少陰腎經",
    element: "Water",
    yin_yang: "Yin",
    paired: "Bladder",
    emoji: "🔋",
    color: "hsl(220 60% 40%)",
    bgClass: "bg-blue-700/10 border-blue-700/20",
    activeClass: "bg-blue-700/20 border-blue-600/40",
    pathway: "Starts on the sole of the foot, circles the inner ankle, ascends the inner leg, enters the spine, connects to the Kidney and Bladder, continues through the liver and diaphragm into the lungs and throat.",
    totalPoints: 27,
    bodyClockTime: "5–7 PM",
    functions: "Stores Jing (essence). Governs birth, growth, reproduction, and aging. Controls bones, marrow, and brain. Opens to the ears. Houses willpower (Zhi). Root of all Yin and Yang.",
    commonImbalances: "Low back pain, knee weakness, tinnitus, hearing loss, premature aging, infertility, impotence, frequent urination, night sweats, cold limbs, fear.",
    keyPoints: [
      { name: "KI-1 (Yǒng Quán)", location: "On the sole of the foot, in the depression when toes are curled, at the junction of the anterior 1/3", indication: "Emergency resuscitation, dizziness, hypertension, insomnia, hot flashes, anxiety. Jing-Well point — grounds excess energy, descends Yang." },
      { name: "KI-3 (Tài Xī)", location: "Between the inner ankle bone and the Achilles tendon", indication: "All Kidney deficiency conditions — low back pain, tinnitus, insomnia, sore throat, toothache, impotence. Yuan-Source point — tonifies Kidney Yin and Yang." },
      { name: "KI-7 (Fù Liū)", location: "2 cun above the inner ankle bone, on the front edge of the Achilles tendon", indication: "Night sweats, spontaneous sweating, edema, diarrhea, low back pain. Jing-River point — regulates sweating and water metabolism." },
    ],
  },
  {
    name: "Pericardium",
    chinese: "手厥陰心包經",
    element: "Fire",
    yin_yang: "Yin",
    paired: "Triple Burner",
    emoji: "🛡️",
    color: "hsl(330 60% 50%)",
    bgClass: "bg-pink-500/10 border-pink-500/20",
    activeClass: "bg-pink-500/20 border-pink-400/40",
    pathway: "Starts in the chest at the Pericardium, descends through the diaphragm to the abdomen. A branch crosses the chest and runs down the inner arm (between Lung and Heart meridians) to the tip of the middle finger.",
    totalPoints: 9,
    bodyClockTime: "7–9 PM",
    functions: "Protects the Heart from emotional shocks. Acts as the Heart's 'bodyguard.' Governs blood vessels alongside the Heart. 'The Ambassador' — handles what the Emperor cannot.",
    commonImbalances: "Chest oppression, palpitations, nausea, vomiting, elbow/arm pain, anxiety, emotional overwhelm, feeling vulnerable.",
    keyPoints: [
      { name: "PC-6 (Nèi Guān)", location: "2 cun above the wrist crease on the inner forearm, between the two tendons", indication: "THE point for nausea, vomiting, motion sickness, morning sickness, anxiety, palpitations, chest pain, insomnia. Luo-Connecting point — one of the most used points in all acupuncture." },
      { name: "PC-8 (Láo Gōng)", location: "In the center of the palm, between the 2nd and 3rd metacarpal bones", indication: "Heart pain, anxiety, mouth sores, bad breath, excessive sweating of palms, loss of consciousness. Ying-Spring point — clears Heart Fire." },
    ],
  },
  {
    name: "Triple Burner",
    chinese: "手少陽三焦經",
    element: "Fire",
    yin_yang: "Yang",
    paired: "Pericardium",
    emoji: "🌡️",
    color: "hsl(280 50% 50%)",
    bgClass: "bg-purple-500/10 border-purple-500/20",
    activeClass: "bg-purple-500/20 border-purple-400/40",
    pathway: "Starts at the tip of the ring finger, runs up the back of the hand and forearm, over the elbow, up the back of the arm, over the shoulder, around the ear, ending at the outer eyebrow.",
    totalPoints: 23,
    bodyClockTime: "9–11 PM",
    functions: "Regulates water metabolism across three body zones: Upper Burner (mist — respiration, Heart/Lung), Middle Burner (foam — digestion, Spleen/Stomach), Lower Burner (swamp — elimination, Kidney/Bladder/Intestines).",
    commonImbalances: "Edema, urinary dysfunction, deafness, tinnitus, sore throat, eye pain, cheek swelling, temporal headache, shoulder/arm pain.",
    keyPoints: [
      { name: "TB-5 (Wài Guān)", location: "2 cun above the wrist crease on the outer forearm, between radius and ulna", indication: "Common cold, fever, headache, ear problems, rib pain. Luo-Connecting point — opens the Yang Linking Vessel, expels Wind-Heat." },
      { name: "TB-17 (Yì Fēng)", location: "Behind the earlobe, in the depression between the mastoid process and jaw", indication: "Tinnitus, deafness, facial paralysis, TMJ, lockjaw, mumps. Key point for all ear disorders." },
      { name: "TB-21 (Ěr Mén)", location: "In front of the ear, in the depression above the condyloid process when mouth is open", indication: "Deafness, tinnitus, ear infections, toothache. 'Ear Gate' — opens the ear to restore hearing." },
    ],
  },
  {
    name: "Gallbladder",
    chinese: "足少陽膽經",
    element: "Wood",
    yin_yang: "Yang",
    paired: "Liver",
    emoji: "🌿",
    color: "hsl(140 50% 40%)",
    bgClass: "bg-green-600/10 border-green-600/20",
    activeClass: "bg-green-600/20 border-green-500/40",
    pathway: "Starts at the outer corner of the eye, zigzags across the head and behind the ear, down the side of the neck, over the shoulder, zigzags across the ribs, down the lateral side of the body and leg to the 4th toe.",
    totalPoints: 44,
    bodyClockTime: "11 PM–1 AM",
    functions: "Stores and secretes bile. Governs decision-making and courage. 'The Upright Official' — gives clarity and judgment. Controls the sinews (with Liver).",
    commonImbalances: "Temporal headache/migraine, dizziness, bitter taste, rib pain, sciatica, hip pain, indecisiveness, timidity, waking at midnight.",
    keyPoints: [
      { name: "GB-20 (Fēng Chí)", location: "At the base of the skull, in the depression between the trapezius and sternocleidomastoid muscles", indication: "Headache, dizziness, neck stiffness, common cold, eye problems, hypertension, insomnia. 'Wind Pool' — one of the most important points for expelling Wind." },
      { name: "GB-21 (Jiān Jǐng)", location: "At the highest point of the shoulder, midway between the spine and the acromion", indication: "Neck/shoulder pain and tension, headache, difficulty with lactation, labor induction. CONTRAINDICATED in pregnancy. The classic 'stress point.'" },
      { name: "GB-34 (Yáng Líng Quán)", location: "In the depression below and in front of the head of the fibula (outer knee)", indication: "All tendon and muscle problems, rib pain, sciatica, knee pain, bitter taste, hepatitis. He-Sea point — Influential point of tendons/sinews." },
      { name: "GB-41 (Zú Lín Qì)", location: "On the top of the foot, in the depression between the 4th and 5th metatarsal bones", indication: "Temporal headache, eye pain, breast distension, irregular menstruation, lateral foot pain. Shu-Stream point — opens the Dai (Belt) Vessel." },
    ],
  },
  {
    name: "Liver",
    chinese: "足厥陰肝經",
    element: "Wood",
    yin_yang: "Yin",
    paired: "Gallbladder",
    emoji: "🌳",
    color: "hsl(150 60% 35%)",
    bgClass: "bg-emerald-600/10 border-emerald-600/20",
    activeClass: "bg-emerald-600/20 border-emerald-500/40",
    pathway: "Starts at the big toe, runs up the inner foot and leg, circles the genitals, enters the lower abdomen, ascends through the Liver and Gallbladder, passes through the diaphragm, ribs, throat, eyes, and connects to the top of the head.",
    totalPoints: 14,
    bodyClockTime: "1–3 AM",
    functions: "Ensures smooth flow of Qi throughout the body. Stores Blood. Controls the sinews/tendons. Opens to the eyes. Houses the ethereal soul (Hun). 'The General' who plans and strategizes.",
    commonImbalances: "Irritability, anger, depression, headaches (vertex or temporal), eye problems, menstrual irregularities, rib-side pain, muscle spasms, dizziness, bitter taste.",
    keyPoints: [
      { name: "LR-3 (Tài Chōng)", location: "On the top of the foot, in the depression between the 1st and 2nd metatarsal bones, about 2 cun from the toe web", indication: "THE most important point for Liver Qi stagnation — stress, anger, headache, dizziness, eye problems, menstrual pain, hypertension, insomnia, irritability. Yuan-Source point. Combined with LI-4 = 'Four Gates' (powerful stress relief)." },
      { name: "LR-8 (Qū Quán)", location: "At the medial end of the knee crease when knee is flexed", indication: "Knee pain, genital pain, urinary issues, menstrual disorders. He-Sea point — nourishes Liver Blood and Yin." },
      { name: "LR-14 (Qī Mén)", location: "On the chest, directly below the nipple, in the 6th intercostal space", indication: "Rib pain, chest fullness, hiccups, acid reflux, mastitis. Front-Mu point of the Liver — used for Liver Qi stagnation diagnosis." },
    ],
  },
];

export function MeridianPathways() {
  const [selected, setSelected] = useState(0);
  const meridian = MERIDIANS[selected];

  return (
    <div className="space-y-6">
      {/* Meridian selector */}
      <div className="flex flex-wrap gap-1.5">
        {MERIDIANS.map((m, i) => (
          <button
            key={m.name}
            onClick={() => setSelected(i)}
            className={`
              inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-medium 
              border transition-all duration-200 cursor-pointer
              ${i === selected ? m.activeClass + " shadow-sm" : m.bgClass + " opacity-70 hover:opacity-100"}
            `}
          >
            <span>{m.emoji}</span>
            <span>{m.name}</span>
          </button>
        ))}
      </div>

      {/* Detail view */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          {/* Header card */}
          <Card className={`border ${meridian.activeClass}`}>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-3xl">{meridian.emoji}</span>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-bold">{meridian.name} Meridian</h3>
                  <p className="text-xs text-muted-foreground font-body">
                    {meridian.chinese} · {meridian.element} · {meridian.yin_yang} · Paired: {meridian.paired} · {meridian.totalPoints} points · Active: {meridian.bodyClockTime}
                  </p>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-muted-foreground">Pathway</h4>
                <p className="text-sm font-body leading-relaxed">{meridian.pathway}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-primary">Functions</h4>
                  <p className="text-sm font-body">{meridian.functions}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-display font-semibold uppercase tracking-wider text-destructive">Common Imbalances</h4>
                  <p className="text-sm font-body">{meridian.commonImbalances}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Acupressure Points */}
          <div className="space-y-2">
            <h3 className="font-display text-base font-semibold">Key Acupressure Points</h3>
            <div className="grid gap-3 md:grid-cols-2">
              {meridian.keyPoints.map((point) => (
                <Card key={point.name} className="border-border/60">
                  <CardContent className="p-4 space-y-2">
                    <h4 className="font-display text-sm font-bold flex items-center gap-1.5">
                      <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0" />
                      {point.name}
                    </h4>
                    <div className="space-y-1 pl-5">
                      <p className="text-xs font-body">
                        <span className="text-muted-foreground font-semibold">Location: </span>
                        {point.location}
                      </p>
                      <p className="text-xs font-body">
                        <span className="text-muted-foreground font-semibold">Indications: </span>
                        {point.indication}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
