import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { SectionHeader } from "@/components/SectionHeader";
import { Hand, CircleDot } from "lucide-react";

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
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <SectionHeader
        icon={Hand}
        title="Acupressure Points"
        subtitle="Pressure point locations, techniques and therapeutic applications."
        accentColor="0 50% 42%"
        pattern="dots"
      />
      <DisclaimerBanner />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {points?.map((p) => (
            <Link key={p.id} to={`/acupressure/${p.id}`}>
              <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group border-border/60">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <CircleDot className="h-4 w-4 text-red-400/60 group-hover:text-red-500 transition-colors shrink-0" />
                      <CardTitle className="font-display text-lg">{p.point_name}</CardTitle>
                    </div>
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
