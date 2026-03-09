import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { SectionHeader } from "@/components/SectionHeader";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, HeartPulse, Stethoscope } from "lucide-react";

export default function Remedies() {
  const [filter, setFilter] = useState("");
  const { data: remedies, isLoading } = useQuery({
    queryKey: ["remedies"],
    queryFn: async () => {
      const { data, error } = await supabase.from("remedies").select("*").order("condition");
      if (error) throw error;
      return data;
    },
  });

  const filtered = remedies?.filter((r) => r.condition.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <SectionHeader
        icon={HeartPulse}
        title="Remedy Lookup"
        subtitle="Browse conditions and their recommended natural treatments."
        accentColor="0 55% 45%"
        pattern="crosses"
      />
      <DisclaimerBanner />
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Filter by condition…" value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-9 font-body" />
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered?.map((r) => (
            <Link key={r.id} to={`/remedies/${r.id}`}>
              <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group border-border/60">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4 text-destructive/50 group-hover:text-destructive transition-colors shrink-0" />
                      <CardTitle className="font-display text-lg">{r.condition}</CardTitle>
                    </div>
                    <EvidenceBadge label={r.evidence_label} />
                  </div>
                  <CardDescription className="font-body line-clamp-2">{r.method}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
