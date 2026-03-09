import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NarrativeDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: narrative, isLoading } = useQuery({
    queryKey: ["narrative", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("narratives").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-10"><Skeleton className="h-60 w-full" /></div>;
  if (!narrative) return <div className="p-10 text-center text-muted-foreground">Narrative not found.</div>;

  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/narratives"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Narratives</Link>
      </Button>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-display font-bold">{narrative.title}</h1>
        <EvidenceBadge label={narrative.evidence_label} />
      </div>
      {narrative.related_topic && (
        <div className="flex gap-1">
          {narrative.related_topic.split(",").map((t) => (
            <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded font-body capitalize">{t.trim()}</span>
          ))}
        </div>
      )}
      <article className="prose prose-lg max-w-none font-body leading-relaxed">
        <p className="whitespace-pre-line">{narrative.content}</p>
      </article>
    </div>
  );
}
