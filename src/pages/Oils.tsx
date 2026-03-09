import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";

import { SectionHeader } from "@/components/SectionHeader";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Droplets, Flower2, Search, MapPin } from "lucide-react";

export default function Oils() {
  const [filter, setFilter] = useState("");
  const { data: oils, isLoading } = useQuery({
    queryKey: ["oils"],
    queryFn: async () => {
      const { data, error } = await supabase.from("oils").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const filtered = oils?.filter(
    (o) =>
      o.name.toLowerCase().includes(filter.toLowerCase()) ||
      o.condition?.toLowerCase().includes(filter.toLowerCase()) ||
      (o as any).description?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <SectionHeader
        icon={Droplets}
        title="Essential Oils"
        subtitle={`${oils?.length ?? '…'} aromatherapy oils — origins, uses, dilution guides and application methods.`}
        accentColor="270 45% 50%"
        pattern="rings"
      />
      <DisclaimerBanner />
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search oils by name or condition…" value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-9 font-body" />
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered?.map((o) => (
            <Link key={o.id} to={`/oils/${o.id}`}>
              <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group border-border/60">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Flower2 className="h-4 w-4 shrink-0 group-hover:text-purple-500 transition-colors" style={{ color: "hsl(270 45% 50% / 0.6)" }} />
                      <CardTitle className="font-display text-lg">{o.name}</CardTitle>
                    </div>
                    <EvidenceBadge label={o.evidence_label} />
                  </div>
                  {o.condition && <CardDescription className="font-body">For: {o.condition}</CardDescription>}
                </CardHeader>
                <CardContent className="space-y-2">
                  {(o as any).description && (
                    <p className="text-sm font-body text-muted-foreground line-clamp-2">{(o as any).description}</p>
                  )}
                  {(o as any).origin && (
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground/70">
                      <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                      <span className="font-body line-clamp-1">{(o as any).origin}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
