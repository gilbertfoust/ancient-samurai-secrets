import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, MapPin, Stethoscope, Hand, AlertTriangle, BookOpen, Locate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function AcupressureDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: point, isLoading } = useQuery({
    queryKey: ["acupressure", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("acupressure_points")
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading)
    return (
      <div className="p-10 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  if (!point)
    return (
      <div className="p-10 text-center text-muted-foreground">
        Point not found.
      </div>
    );

  const p = point as any;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6 animate-fade-in">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/acupressure">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Acupressure
        </Link>
      </Button>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-display font-bold">
              {p.alphanumeric_code || point.point_name}
            </h1>
            {p.chinese_name && (
              <p className="text-lg text-muted-foreground font-body mt-1">
                {p.chinese_name}
              </p>
            )}
          </div>
          <EvidenceBadge label={point.evidence_label} />
        </div>
        <div className="flex flex-wrap gap-2">
          {p.meridian && (
            <Badge variant="outline" className="text-sm">
              {p.meridian} Meridian
            </Badge>
          )}
        </div>
        {point.condition && (
          <p className="text-base font-body text-muted-foreground">
            <Stethoscope className="inline h-4 w-4 mr-1" />
            <span className="font-medium">Indications:</span> {point.condition}
          </p>
        )}
      </div>

      <Separator />

      {/* Content Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* WHO Anatomical Location */}
        {p.anatomical_location && (
          <Card className="md:col-span-2 border-primary/20 bg-primary/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Locate className="h-4 w-4 text-primary" />
                WHO Standard Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-sm leading-relaxed italic">
                {p.anatomical_location}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Practical Location */}
        {point.location_description && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                How to Find It
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-sm leading-relaxed">
                {point.location_description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Technique */}
        {point.steps && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <Hand className="h-4 w-4 text-primary" />
                Technique
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-sm leading-relaxed">{point.steps}</p>
            </CardContent>
          </Card>
        )}

        {/* Clinical Notes */}
        {p.notes && (
          <Card className="border-accent/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-display flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-accent-foreground" />
                Clinical Notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-body text-sm leading-relaxed">{p.notes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Cautions */}
      {point.cautions && (
        <Card className="bg-destructive/5 border-destructive/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-display flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Cautions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-body">{point.cautions}</p>
          </CardContent>
        </Card>
      )}

      {/* Source Attribution */}
      <p className="text-xs text-muted-foreground font-body pt-4">
        Location data based on WHO Standard Acupuncture Point Locations in the
        Western Pacific Region (WHO, 2008).
      </p>
    </div>
  );
}
