import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";

export default function Educational() {
  const { data: mnemonics, isLoading: mL } = useQuery({
    queryKey: ["mnemonics"],
    queryFn: async () => {
      const { data, error } = await supabase.from("mnemonics").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: medications } = useQuery({
    queryKey: ["medications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("medications").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: pills } = useQuery({
    queryKey: ["pills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("pill_identification").select("*").order("drug_name");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Educational Tools</h1>
        <p className="text-muted-foreground font-body mt-1">Mnemonics, medication guides and learning aids.</p>
      </div>
      <DisclaimerBanner />

      {mL ? <Skeleton className="h-60 w-full" /> : (
        <Tabs defaultValue="mnemonics">
          <TabsList>
            <TabsTrigger value="mnemonics" className="font-body">Mnemonics</TabsTrigger>
            <TabsTrigger value="medications" className="font-body">Medications</TabsTrigger>
            <TabsTrigger value="pills" className="font-body">Pill ID</TabsTrigger>
          </TabsList>

          <TabsContent value="mnemonics" className="mt-4 space-y-4">
            {mnemonics?.map((m) => (
              <Card key={m.id}>
                <CardHeader>
                  <CardTitle className="font-display">{m.title}</CardTitle>
                  {m.topic && <p className="text-sm text-muted-foreground font-body">Topic: {m.topic}</p>}
                </CardHeader>
                <CardContent>
                  <p className="font-body whitespace-pre-line">{m.lyrics}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="medications" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-display">Name</TableHead>
                      <TableHead className="font-display">Uses</TableHead>
                      <TableHead className="font-display">Dose</TableHead>
                      <TableHead className="font-display">Cautions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {medications?.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-body font-medium">{m.name}</TableCell>
                        <TableCell className="font-body">{m.uses}</TableCell>
                        <TableCell className="font-body">{m.typical_dose}</TableCell>
                        <TableCell className="font-body text-muted-foreground">{m.cautions}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pills" className="mt-4">
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-display">Drug</TableHead>
                      <TableHead className="font-display">Color</TableHead>
                      <TableHead className="font-display">Shape</TableHead>
                      <TableHead className="font-display">Inscription</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pills?.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-body font-medium">{p.drug_name}</TableCell>
                        <TableCell className="font-body">{p.color}</TableCell>
                        <TableCell className="font-body">{p.shape}</TableCell>
                        <TableCell className="font-body text-muted-foreground">{p.inscription}</TableCell>
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
