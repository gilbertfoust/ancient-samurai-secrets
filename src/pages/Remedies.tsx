import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Remedy Lookup</h1>
        <p className="text-muted-foreground font-body mt-1">Browse conditions and their recommended natural treatments.</p>
      </div>
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
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-display text-lg">{r.condition}</CardTitle>
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
