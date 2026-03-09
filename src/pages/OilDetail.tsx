import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EvidenceBadge } from "@/components/EvidenceBadge";

import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Droplets, AlertTriangle, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OilDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: oil, isLoading } = useQuery({
    queryKey: ["oil", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("oils").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-10"><Skeleton className="h-60 w-full" /></div>;
  if (!oil) return <div className="p-10 text-center text-muted-foreground">Oil not found.</div>;

  const oilAny = oil as any;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/oils"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Oils</Link>
      </Button>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">{oil.name}</h1>
          {oil.condition && (
            <p className="text-lg font-body text-muted-foreground mt-1">For: {oil.condition}</p>
          )}
        </div>
        <EvidenceBadge label={oil.evidence_label} />
      </div>

      {oilAny.origin && (
        <div className="flex items-start gap-2 bg-muted/50 rounded-lg p-3 border border-border/40">
          <MapPin className="h-4 w-4 text-primary/60 shrink-0 mt-0.5" />
          <p className="text-sm font-body text-muted-foreground">{oilAny.origin}</p>
        </div>
      )}

      <DisclaimerBanner />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {oilAny.description && (
            <section>
              <h2 className="text-xl font-display font-semibold mb-2">About</h2>
              <p className="font-body leading-relaxed">{oilAny.description}</p>
            </section>
          )}
          {oil.application_methods && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-5 w-5 text-primary/60" />
                <h2 className="text-xl font-display font-semibold">How to Apply</h2>
              </div>
              <p className="font-body leading-relaxed">{oil.application_methods}</p>
            </section>
          )}
          {oil.dilutions && (
            <section>
              <div className="flex items-center gap-2 mb-2">
                <FlaskConical className="h-5 w-5 text-primary/60" />
                <h2 className="text-xl font-display font-semibold">Dilution Guide</h2>
              </div>
              <p className="font-body leading-relaxed">{oil.dilutions}</p>
            </section>
          )}
        </div>
        <aside className="space-y-4">
          {oil.cautions && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <h3 className="font-display font-semibold text-destructive">Cautions</h3>
              </div>
              <p className="text-sm font-body">{oil.cautions}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
