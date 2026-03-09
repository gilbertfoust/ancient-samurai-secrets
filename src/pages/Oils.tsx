import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { SectionHeader } from "@/components/SectionHeader";
import { Droplets, Flower2 } from "lucide-react";

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
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <SectionHeader
        icon={Droplets}
        title="Essential Oils"
        subtitle="Aromatherapy blends, dilution guides and application methods."
        accentColor="270 45% 50%"
        pattern="rings"
      />
      <DisclaimerBanner />
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {oils?.map((o) => (
            <Link key={o.id} to={`/oils/${o.id}`}>
              <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group border-border/60">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Flower2 className="h-4 w-4 shrink-0 group-hover:text-purple-500 transition-colors" style={{ color: "hsl(270 45% 50% / 0.6)" }} />
                      <CardTitle className="font-display text-lg">{o.name}</CardTitle>
                    </div>
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
