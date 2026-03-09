import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/SectionHeader";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Hand, CircleDot, Search, Map } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { BodyMap } from "@/components/acupressure/BodyMap";

const MERIDIAN_META: Record<string, { emoji: string; color: string }> = {
  Lung: { emoji: "🫁", color: "hsl(200 60% 50%)" },
  "Large Intestine": { emoji: "🌀", color: "hsl(30 60% 50%)" },
  Stomach: { emoji: "🍽️", color: "hsl(45 70% 50%)" },
  Spleen: { emoji: "🩸", color: "hsl(350 60% 50%)" },
  Heart: { emoji: "❤️", color: "hsl(0 70% 50%)" },
  "Small Intestine": { emoji: "🔥", color: "hsl(15 70% 50%)" },
  Bladder: { emoji: "💧", color: "hsl(210 70% 50%)" },
  Kidney: { emoji: "🌊", color: "hsl(220 50% 40%)" },
  Pericardium: { emoji: "💜", color: "hsl(280 50% 50%)" },
  "Triple Energizer": { emoji: "🔺", color: "hsl(20 60% 55%)" },
  Gallbladder: { emoji: "🌿", color: "hsl(140 50% 40%)" },
  Liver: { emoji: "🌳", color: "hsl(160 50% 35%)" },
  "Governor Vessel": { emoji: "⚡", color: "hsl(50 70% 50%)" },
  "Conception Vessel": { emoji: "🌙", color: "hsl(260 40% 50%)" },
};

const MERIDIAN_ORDER = [
  "All",
  "Lung",
  "Large Intestine",
  "Stomach",
  "Spleen",
  "Heart",
  "Bladder",
  "Kidney",
  "Pericardium",
  "Triple Energizer",
  "Gallbladder",
  "Liver",
  "Governor Vessel",
  "Conception Vessel",
];

export default function Acupressure() {
  const [selectedMeridian, setSelectedMeridian] = useState("All");
  const [search, setSearch] = useState("");

  const { data: points, isLoading } = useQuery({
    queryKey: ["acupressure"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("acupressure_points")
        .select("*")
        .order("point_name");
      if (error) throw error;
      return data;
    },
  });

  const filtered = points?.filter((p) => {
    const matchesMeridian =
      selectedMeridian === "All" || (p as any).meridian === selectedMeridian;
    const matchesSearch =
      !search ||
      p.point_name.toLowerCase().includes(search.toLowerCase()) ||
      p.condition?.toLowerCase().includes(search.toLowerCase()) ||
      (p as any).alphanumeric_code?.toLowerCase().includes(search.toLowerCase());
    return matchesMeridian && matchesSearch;
  });

  const meridianCounts = points?.reduce(
    (acc, p) => {
      const m = (p as any).meridian || "Other";
      acc[m] = (acc[m] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <SectionHeader
        icon={Hand}
        title="Acupressure Points"
        subtitle="WHO Standard acupuncture point locations — 14 meridians with key therapeutic points."
        accentColor="0 50% 42%"
        pattern="dots"
      />

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search points by name, code, or condition..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Meridian Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {MERIDIAN_ORDER.map((m) => {
          const count = m === "All" ? points?.length : meridianCounts?.[m];
          if (m !== "All" && !count) return null;
          const meta = MERIDIAN_META[m];
          const isActive = selectedMeridian === m;
          return (
            <button
              key={m}
              onClick={() => setSelectedMeridian(m)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                isActive
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              {meta?.emoji && <span>{meta.emoji}</span>}
              <span>{m}</span>
              {count != null && (
                <Badge variant="secondary" className="ml-1 text-xs px-1.5 py-0">
                  {count}
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Points Grid */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-44 rounded-lg" />
          ))}
        </div>
      ) : filtered?.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">
          No points found. Try a different filter or search term.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered?.map((p) => {
            const meta = MERIDIAN_META[(p as any).meridian || ""] || {
              emoji: "📍",
              color: "hsl(var(--muted-foreground))",
            };
            return (
              <Link key={p.id} to={`/acupressure/${p.id}`}>
                <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group border-border/60">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-lg shrink-0">{meta.emoji}</span>
                        <div className="min-w-0">
                          <CardTitle className="font-display text-base leading-tight truncate">
                            {(p as any).alphanumeric_code
                              ? `${(p as any).alphanumeric_code}`
                              : p.point_name}
                          </CardTitle>
                          {(p as any).chinese_name && (
                            <p className="text-xs text-muted-foreground mt-0.5 font-body">
                              {(p as any).chinese_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <EvidenceBadge label={p.evidence_label} />
                    </div>
                    {(p as any).meridian && (
                      <Badge
                        variant="outline"
                        className="w-fit text-xs mt-1"
                        style={{ borderColor: meta.color, color: meta.color }}
                      >
                        {(p as any).meridian} Meridian
                      </Badge>
                    )}
                    {p.condition && (
                      <CardDescription className="font-body text-sm mt-1 line-clamp-2">
                        {p.condition}
                      </CardDescription>
                    )}
                  </CardHeader>
                  {p.location_description && (
                    <CardContent className="pt-0">
                      <p className="text-xs font-body text-muted-foreground line-clamp-2">
                        📍 {p.location_description}
                      </p>
                    </CardContent>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
