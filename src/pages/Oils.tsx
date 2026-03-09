import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

export default function Oils() {
  const { data: oils, isLoading } = useQuery({
    queryKey: ["oils"],
    queryFn: async () => {
      const { data, error } = await supabase.from("oils").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Essential Oils</h1>
        <p className="text-muted-foreground font-body mt-1">Aromatherapy blends and application guides.</p>
      </div>
      <DisclaimerBanner />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {oils?.map((o) => (
            <Link key={o.id} to={`/oils/${o.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-display text-lg">{o.name}</CardTitle>
                    <EvidenceBadge label={o.evidence_label} />
                  </div>
                  {o.condition && <CardDescription className="font-body">For: {o.condition}</CardDescription>}
                </CardHeader>
                {o.application_methods && (
                  <CardContent>
                    <p className="text-sm font-body text-muted-foreground line-clamp-2">{o.application_methods}</p>
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
