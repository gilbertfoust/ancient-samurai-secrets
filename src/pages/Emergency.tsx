import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

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
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Emergency & First Aid</h1>
        <p className="text-muted-foreground font-body mt-1">Quick-reference emergency guides and first aid information.</p>
      </div>
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
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <CardTitle className="font-display text-base">{item.item_name}</CardTitle>
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
              <Card key={type}>
                <CardHeader>
                  <CardTitle className="font-display capitalize">{type.replace("-", " ")} Poisoning</CardTitle>
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
            <Card>
              <CardHeader>
                <CardTitle className="font-display">Cold vs. Flu vs. H1N1</CardTitle>
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
