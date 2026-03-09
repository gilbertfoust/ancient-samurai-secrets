import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  UtensilsCrossed, Stethoscope, Leaf, Droplets, Hand,
  HeartPulse, ShieldAlert, CalendarCheck, GraduationCap, BookOpen,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

const sections = [
  { title: "Recipe Library", desc: "Kitchen formulary — broths, drinks and home‑made products", path: "/recipes", icon: UtensilsCrossed, color: "text-evidence-traditional" },
  { title: "Remedy Lookup", desc: "Conditions index with recommended treatments", path: "/remedies", icon: Stethoscope, color: "text-evidence-observed" },
  { title: "Herbs & Materia Medica", desc: "Chinese herbal formulas and plant directory", path: "/herbs", icon: Leaf, color: "text-primary" },
  { title: "Essential Oils", desc: "Aromatherapy blends and application guides", path: "/oils", icon: Droplets, color: "text-evidence-observed" },
  { title: "Acupressure Points", desc: "Pressure point locations and techniques", path: "/acupressure", icon: Hand, color: "text-evidence-supported" },
  { title: "Prevention & Lifestyle", desc: "Nutrition science, daily rhythms and food guides", path: "/prevention", icon: HeartPulse, color: "text-destructive" },
  { title: "Emergency & First Aid", desc: "Quick‑reference emergency guides", path: "/emergency", icon: ShieldAlert, color: "text-destructive" },
  { title: "Screening & Lifecycle", desc: "Exam schedules and vaccination tables", path: "/screening", icon: CalendarCheck, color: "text-evidence-observed" },
  { title: "Educational Tools", desc: "Mnemonics and learning aids", path: "/educational", icon: GraduationCap, color: "text-evidence-supported" },
  { title: "Cultural Narratives", desc: "Stories and comparative case studies", path: "/narratives", icon: BookOpen, color: "text-evidence-traditional" },
];

export default function Index() {
  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-10">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-3">
          Health & Wellness Bible
        </h1>
        <p className="text-lg text-muted-foreground font-body max-w-2xl leading-relaxed">
          A modern reference blending narrative essays with searchable charts, recipes, remedies, herbal formulas, essential oils, acupressure points and preventive care schedules.
        </p>
      </motion.div>

      <DisclaimerBanner />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s, i) => (
          <motion.div
            key={s.path}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.05 }}
          >
            <Link to={s.path}>
              <Card className="h-full hover:shadow-md transition-shadow group cursor-pointer border-border">
                <CardHeader>
                  <s.icon className={`h-8 w-8 mb-2 ${s.color} group-hover:scale-110 transition-transform`} />
                  <CardTitle className="font-display text-lg">{s.title}</CardTitle>
                  <CardDescription className="font-body">{s.desc}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
