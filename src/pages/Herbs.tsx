import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Herbs & Materia Medica</h1>
        <p className="text-muted-foreground font-body mt-1">Chinese herbal formulas and plant directory.</p>
      </div>
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
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-display text-lg">{h.common_name}</CardTitle>
                    <EvidenceBadge label={h.evidence_label} />
                  </div>
                  {h.chinese_name && <CardDescription className="font-body">{h.chinese_name} {h.latin_name && `— ${h.latin_name}`}</CardDescription>}
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
