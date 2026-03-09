import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";

export default function Narratives() {
  const { data: narratives, isLoading } = useQuery({
    queryKey: ["narratives"],
    queryFn: async () => {
      const { data, error } = await supabase.from("narratives").select("*").order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Cultural Narratives</h1>
        <p className="text-muted-foreground font-body mt-1">Stories, travel notes and comparative case studies.</p>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-lg" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {narratives?.map((n) => (
            <Link key={n.id} to={`/narratives/${n.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-display text-xl">{n.title}</CardTitle>
                    <EvidenceBadge label={n.evidence_label} />
                  </div>
                  <CardDescription className="font-body line-clamp-2">{n.content?.slice(0, 200)}…</CardDescription>
                  {n.related_topic && (
                    <div className="flex gap-1 mt-2">
                      {n.related_topic.split(",").map((t) => (
                        <span key={t} className="text-xs bg-muted px-2 py-0.5 rounded font-body capitalize">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
