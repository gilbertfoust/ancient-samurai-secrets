import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
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

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/oils"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Oils</Link>
      </Button>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-display font-bold">{oil.name}</h1>
        <EvidenceBadge label={oil.evidence_label} />
      </div>
      {oil.condition && <p className="text-lg font-body text-muted-foreground">Condition: {oil.condition}</p>}
      <DisclaimerBanner />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {oil.application_methods && (
            <section>
              <h2 className="text-xl font-display font-semibold mb-2">Application</h2>
              <p className="font-body leading-relaxed">{oil.application_methods}</p>
            </section>
          )}
          {oil.dilutions && (
            <section>
              <h2 className="text-xl font-display font-semibold mb-2">Dilution</h2>
              <p className="font-body leading-relaxed">{oil.dilutions}</p>
            </section>
          )}
        </div>
        <aside>
          {oil.cautions && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <h3 className="font-display font-semibold mb-1 text-destructive">Cautions</h3>
              <p className="text-sm font-body">{oil.cautions}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
