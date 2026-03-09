import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RemedyDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: remedy, isLoading } = useQuery({
    queryKey: ["remedy", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("remedies").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-10"><Skeleton className="h-60 w-full" /></div>;
  if (!remedy) return <div className="p-10 text-center text-muted-foreground">Remedy not found.</div>;

  const materials = Array.isArray(remedy.materials) ? (remedy.materials as string[]) : [];

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/remedies"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Remedies</Link>
      </Button>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-display font-bold">{remedy.condition}</h1>
        <EvidenceBadge label={remedy.evidence_label} />
      </div>
      <DisclaimerBanner />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {remedy.method && (
            <section>
              <h2 className="text-xl font-display font-semibold mb-2">Method</h2>
              <p className="font-body">{remedy.method}</p>
            </section>
          )}
          {remedy.steps && (
            <section>
              <h2 className="text-xl font-display font-semibold mb-2">Steps</h2>
              <p className="font-body whitespace-pre-line leading-relaxed">{remedy.steps}</p>
            </section>
          )}
        </div>
        <aside className="space-y-4">
          {materials.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-display font-semibold mb-2">Materials</h3>
              <ul className="space-y-1 font-body text-sm">
                {materials.map((m, i) => <li key={i} className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{m}</li>)}
              </ul>
            </div>
          )}
          {remedy.cautions && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <h3 className="font-display font-semibold mb-1 text-destructive">Cautions</h3>
              <p className="text-sm font-body">{remedy.cautions}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
