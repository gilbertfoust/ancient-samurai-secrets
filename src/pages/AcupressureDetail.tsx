import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EvidenceBadge } from "@/components/EvidenceBadge";

import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AcupressureDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: point, isLoading } = useQuery({
    queryKey: ["acupressure", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("acupressure_points").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-10"><Skeleton className="h-60 w-full" /></div>;
  if (!point) return <div className="p-10 text-center text-muted-foreground">Point not found.</div>;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/acupressure"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Acupressure</Link>
      </Button>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-display font-bold">{point.point_name}</h1>
        <EvidenceBadge label={point.evidence_label} />
      </div>
      {point.condition && <p className="text-lg font-body text-muted-foreground">For: {point.condition}</p>}
      
      <div className="space-y-6">
        {point.location_description && (
          <section>
            <h2 className="text-xl font-display font-semibold mb-2">Location</h2>
            <p className="font-body leading-relaxed">{point.location_description}</p>
          </section>
        )}
        {point.steps && (
          <section>
            <h2 className="text-xl font-display font-semibold mb-2">Technique</h2>
            <p className="font-body leading-relaxed">{point.steps}</p>
          </section>
        )}
        {point.cautions && (
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 max-w-md">
            <h3 className="font-display font-semibold mb-1 text-destructive">Cautions</h3>
            <p className="text-sm font-body">{point.cautions}</p>
          </div>
        )}
      </div>
    </div>
  );
}
