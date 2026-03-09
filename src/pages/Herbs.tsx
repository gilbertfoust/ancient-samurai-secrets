import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/SectionHeader";
import { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Leaf, Sprout, ImagePlus, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function Herbs() {
  const [filter, setFilter] = useState("");
  const queryClient = useQueryClient();
  const [generating, setGenerating] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const abortRef = useRef(false);

  const { data: herbs, isLoading } = useQuery({
    queryKey: ["herbs"],
    queryFn: async () => {
      const { data, error } = await supabase.from("herbs").select("*").order("common_name");
      if (error) throw error;
      return data;
    },
  });

  const filtered = herbs?.filter(
    (h) =>
      h.common_name.toLowerCase().includes(filter.toLowerCase()) ||
      h.chinese_name?.toLowerCase().includes(filter.toLowerCase()) ||
      h.latin_name?.toLowerCase().includes(filter.toLowerCase())
  );

  const herbsWithoutImages = herbs?.filter((h) => !h.image_url).length ?? 0;

  const generateImages = async () => {
    setGenerating(true);
    abortRef.current = false;
    try {
      let totalRemaining = herbsWithoutImages;
      while (totalRemaining > 0 && !abortRef.current) {
        const resp = await supabase.functions.invoke("generate-herb-images");
        if (resp.error) {
          toast.error("Image generation failed: " + resp.error.message);
          break;
        }
        const data = resp.data;
        const successes = data.results?.filter((r: any) => r.success).length ?? 0;
        if (successes > 0) {
          toast.success(`Generated ${successes} herb images`);
          queryClient.invalidateQueries({ queryKey: ["herbs"] });
        }
        totalRemaining = data.remaining ?? 0;
        setRemaining(totalRemaining);
        if (totalRemaining === 0) {
          toast.success("All herb images generated!");
          break;
        }
        await new Promise((r) => setTimeout(r, 1000));
      }
    } catch (e) {
      toast.error("Error generating images");
    } finally {
      setGenerating(false);
      setRemaining(null);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <SectionHeader
        icon={Leaf}
        title="Herbs & Materia Medica"
        subtitle="Chinese herbal formulas and plant directory — 129 herbs catalogued."
        accentColor="120 40% 35%"
        pattern="herbs"
      />
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search herbs…" value={filter} onChange={(e) => setFilter(e.target.value)} className="pl-9 font-body" />
        </div>
        {herbsWithoutImages > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={generating ? () => { abortRef.current = true; } : generateImages}
            className="font-body gap-2"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {remaining !== null ? `${remaining} remaining…` : "Generating…"}
              </>
            ) : (
              <>
                <ImagePlus className="h-4 w-4" />
                Generate {herbsWithoutImages} images
              </>
            )}
          </Button>
        )}
      </div>
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-lg" />)}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered?.map((h) => (
            <Link key={h.id} to={`/herbs/${h.id}`}>
              <Card className="h-full hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group border-border/60 overflow-hidden">
                {h.image_url && (
                  <div className="h-32 overflow-hidden bg-muted/30">
                    <img
                      src={h.image_url}
                      alt={h.common_name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                )}
                <CardHeader className={h.image_url ? "pt-3" : ""}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Sprout className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors shrink-0" />
                      <CardTitle className="font-display text-lg">{h.common_name}</CardTitle>
                    </div>
                    <EvidenceBadge label={h.evidence_label} />
                  </div>
                  {h.chinese_name && (
                    <CardDescription className="font-body">
                      <span className="text-base mr-1.5">{h.chinese_name}</span>
                      {h.latin_name && <span className="italic text-muted-foreground/70">— {h.latin_name}</span>}
                    </CardDescription>
                  )}
                </CardHeader>
                {h.uses && (
                  <CardContent>
                    <p className="text-sm font-body text-muted-foreground line-clamp-2">{h.uses}</p>
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
