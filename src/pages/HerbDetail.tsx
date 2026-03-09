import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HerbDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: herb, isLoading } = useQuery({
    queryKey: ["herb", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("herbs").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-10"><Skeleton className="h-60 w-full" /></div>;
  if (!herb) return <div className="p-10 text-center text-muted-foreground">Herb not found.</div>;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/herbs"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Herbs</Link>
      </Button>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold">{herb.common_name}</h1>
          {herb.chinese_name && <p className="text-lg text-muted-foreground font-body">{herb.chinese_name}</p>}
          {herb.latin_name && <p className="text-sm italic text-muted-foreground font-body">{herb.latin_name}</p>}
        </div>
        <EvidenceBadge label={herb.evidence_label} />
      </div>
      <DisclaimerBanner />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {herb.description && (
            <section>
              <h2 className="text-xl font-display font-semibold mb-2">Description</h2>
              <p className="font-body leading-relaxed">{herb.description}</p>
            </section>
          )}
          {herb.uses && (
            <section>
              <h2 className="text-xl font-display font-semibold mb-2">Uses</h2>
              <p className="font-body leading-relaxed">{herb.uses}</p>
            </section>
          )}
        </div>
        <aside className="space-y-4">
          {herb.synonyms && herb.synonyms.length > 0 && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-display font-semibold mb-2">Synonyms</h3>
              <div className="flex flex-wrap gap-1">
                {herb.synonyms.map((s, i) => <span key={i} className="text-xs bg-muted px-2 py-1 rounded font-body">{s}</span>)}
              </div>
            </div>
          )}
          {herb.cautions && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <h3 className="font-display font-semibold mb-1 text-destructive">Cautions</h3>
              <p className="text-sm font-body">{herb.cautions}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
