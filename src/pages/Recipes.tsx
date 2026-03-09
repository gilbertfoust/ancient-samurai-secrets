import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";

import { SectionHeader } from "@/components/SectionHeader";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, CookingPot, FlaskConical, UtensilsCrossed } from "lucide-react";

const categoryIcons: Record<string, typeof CookingPot> = {
  food: UtensilsCrossed,
  product: FlaskConical,
};

export default function Recipes() {
  const [filter, setFilter] = useState("");
  const { data: recipes, isLoading } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("recipes").select("*").order("title");
      if (error) throw error;
      return data;
    },
  });

  const filtered = recipes?.filter(
    (r) =>
      r.title.toLowerCase().includes(filter.toLowerCase()) ||
      r.purpose?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <SectionHeader
        icon={CookingPot}
        title="Recipe Library"
        subtitle="Kitchen formulary — broths, drinks, home‑made products and more."
        accentColor="25 70% 45%"
        pattern="dots"
      />
      
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Filter recipes…" value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-9 font-body" />
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered?.map((r) => {
            const CatIcon = categoryIcons[r.category || "food"] || CookingPot;
            return (
              <Link key={r.id} to={`/recipes/${r.id}`}>
                <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group border-border/60">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <CatIcon className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors shrink-0" />
                        <CardTitle className="font-display text-lg">{r.title}</CardTitle>
                      </div>
                      <EvidenceBadge label={r.evidence_label} />
                    </div>
                    <CardDescription className="font-body">{r.purpose}</CardDescription>
                  </CardHeader>
                  {r.category && (
                    <CardContent>
                      <span className="text-xs font-body text-muted-foreground capitalize bg-muted px-2 py-1 rounded">
                        {r.category}
                      </span>
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
