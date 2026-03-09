import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/SectionHeader";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, Leaf, Sprout } from "lucide-react";

export default function Herbs() {
  const [filter, setFilter] = useState("");
  const { data: herbs, isLoading } = useQuery({
    queryKey: ["herbs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("herbs").select("*").order("common_name");
      if (error) throw error;
      return data;
    },
  });

  const filtered = herbs?.filter(
    (h) =>
      h.common_name.toLowerCase().includes(filter.toLowerCase()) ||
      h.chinese_name?.toLowerCase().includes(filter.toLowerCase()) ||
      h.latin_name?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <SectionHeader
        icon={Leaf}
        title="Herbs & Materia Medica"
        subtitle="Chinese herbal formulas and plant directory — 129 herbs catalogued."
        accentColor="120 40% 35%"
        pattern="herbs"
      />
      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search herbs…" value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-9 font-body" />
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered?.map((h) => (
            <Link key={h.id} to={`/herbs/${h.id}`}>
              <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group border-border/60">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sprout className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors shrink-0" />
                      <CardTitle className="font-display text-lg">{h.common_name}</CardTitle>
                    </div>
                    <EvidenceBadge label={h.evidence_label} />
                  </div>
                  {h.chinese_name && (
                    <CardDescription className="font-body">
                      <span className="text-base mr-1.5">{h.chinese_name}</span>
                      {h.latin_name && <span className="italic text-muted-foreground/70">— {h.latin_name}</span>}
                    </CardDescription>
                  )}
                </CardHeader>
                {h.uses && (
                  <CardContent>
                    <p className="text-sm font-body text-muted-foreground line-clamp-2">{h.uses}</p>
                  </CardContent>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
