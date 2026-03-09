import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { SectionHeader } from "@/components/SectionHeader";
import { Siren, Package, Skull, Thermometer } from "lucide-react";

export default function Emergency() {
  const { data: items, isLoading: iL } = useQuery({
    queryKey: ["first_aid_items"],
    queryFn: async () => {
      const { data, error } = await supabase.from("first_aid_items").select("*").order("item_name");
      if (error) throw error;
      return data;
    },
  });

  const { data: poison } = useQuery({
    queryKey: ["poison_steps"],
    queryFn: async () => {
      const { data, error } = await supabase.from("poison_response_steps").select("*").order("poison_type").order("step_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: symptoms } = useQuery({
    queryKey: ["symptoms"],
    queryFn: async () => {
      const { data, error } = await supabase.from("symptom_differentiation").select("*");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <SectionHeader
        icon={Siren}
        title="Emergency & First Aid"
        subtitle="Quick-reference emergency guides and first aid information."
        accentColor="0 72% 51%"
        pattern="crosses"
      />
      <DisclaimerBanner />

      {iL ? <Skeleton className="h-60 w-full" /> : (
        <Tabs defaultValue="kit">
          <TabsList>
            <TabsTrigger value="kit" className="font-body">First Aid Kit</TabsTrigger>
            <TabsTrigger value="poison" className="font-body">Poisoning</TabsTrigger>
            <TabsTrigger value="symptoms" className="font-body">Symptom Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="kit" className="mt-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {items?.map((item) => (
                <Card key={item.id} className="border-border/60 hover:shadow-sm transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-red-400/70 shrink-0" />
                      <CardTitle className="font-display text-base">{item.item_name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-body text-muted-foreground">{item.purpose}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="poison" className="mt-4 space-y-6">
            {["ingested", "skin-contact"].map((type) => (
              <Card key={type} className="border-border/60">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Skull className="h-5 w-5 text-destructive/60" />
                    <CardTitle className="font-display capitalize">{type.replace("-", " ")} Poisoning</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 font-body">
                    {poison?.filter((p) => p.poison_type === type).map((p) => (
                      <li key={p.id} className="flex gap-3">
                        <span className="font-bold text-primary shrink-0">{p.step_order}.</span>
                        <span>{p.description}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="symptoms" className="mt-4">
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-primary/60" />
                  <CardTitle className="font-display">Cold vs. Flu vs. H1N1</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-display">Symptom</TableHead>
                      <TableHead className="font-display">Cold</TableHead>
                      <TableHead className="font-display">Flu</TableHead>
                      <TableHead className="font-display">H1N1</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {symptoms?.map((s) => (
                      <TableRow key={s.id}>
                        <TableCell className="font-body font-medium">{s.symptom}</TableCell>
                        <TableCell className="font-body">{s.cold_severity}</TableCell>
                        <TableCell className="font-body">{s.flu_severity}</TableCell>
                        <TableCell className="font-body">{s.h1n1_severity}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
