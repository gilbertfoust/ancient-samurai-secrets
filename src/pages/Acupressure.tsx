import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

export default function Acupressure() {
  const { data: points, isLoading } = useQuery({
    queryKey: ["acupressure"],
    queryFn: async () => {
      const { data, error } = await supabase.from("acupressure_points").select("*").order("point_name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Acupressure Points</h1>
        <p className="text-muted-foreground font-body mt-1">Pressure point locations and techniques.</p>
      </div>
      <DisclaimerBanner />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {points?.map((p) => (
            <Link key={p.id} to={`/acupressure/${p.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-display text-lg">{p.point_name}</CardTitle>
                    <EvidenceBadge label={p.evidence_label} />
                  </div>
                  {p.condition && <CardDescription className="font-body">For: {p.condition}</CardDescription>}
                </CardHeader>
                {p.location_description && (
                  <CardContent>
                    <p className="text-sm font-body text-muted-foreground line-clamp-2">{p.location_description}</p>
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
