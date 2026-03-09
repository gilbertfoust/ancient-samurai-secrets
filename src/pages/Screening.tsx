import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionHeader } from "@/components/SectionHeader";
import { ClipboardList, Calendar, Syringe } from "lucide-react";

export default function Screening() {
  const { data: exams, isLoading: eL } = useQuery({
    queryKey: ["exams"],
    queryFn: async () => {
      const { data, error } = await supabase.from("exam_schedules").select("*").order("age_range");
      if (error) throw error;
      return data;
    },
  });

  const { data: vaccines } = useQuery({
    queryKey: ["vaccines"],
    queryFn: async () => {
      const { data, error } = await supabase.from("vaccination_schedules").select("*").order("age_range");
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <SectionHeader
        icon={ClipboardList}
        title="Screening & Lifecycle Care"
        subtitle="Recommended exams and vaccinations by age and gender."
        accentColor="200 60% 40%"
        pattern="dots"
      />

      {eL ? <Skeleton className="h-60 w-full" /> : (
        <Tabs defaultValue="exams">
          <TabsList>
            <TabsTrigger value="exams" className="font-body">Exam Schedules</TabsTrigger>
            <TabsTrigger value="vaccines" className="font-body">Vaccinations</TabsTrigger>
          </TabsList>

          <TabsContent value="exams" className="mt-4">
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary/60" />
                  <CardTitle className="font-display">Recommended Exams</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-display">Age</TableHead>
                      <TableHead className="font-display">Gender</TableHead>
                      <TableHead className="font-display">Exam</TableHead>
                      <TableHead className="font-display">Frequency</TableHead>
                      <TableHead className="font-display">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exams?.map((e) => (
                      <TableRow key={e.id}>
                        <TableCell className="font-body font-medium">{e.age_range}</TableCell>
                        <TableCell className="font-body">{e.gender}</TableCell>
                        <TableCell className="font-body">{e.exam_name}</TableCell>
                        <TableCell className="font-body">{e.frequency}</TableCell>
                        <TableCell className="font-body text-muted-foreground">{e.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vaccines" className="mt-4">
            <Card className="border-border/60">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Syringe className="h-5 w-5 text-primary/60" />
                  <CardTitle className="font-display">Vaccination Schedule</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-display">Vaccine</TableHead>
                      <TableHead className="font-display">Age</TableHead>
                      <TableHead className="font-display">Schedule</TableHead>
                      <TableHead className="font-display">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vaccines?.map((v) => (
                      <TableRow key={v.id}>
                        <TableCell className="font-body font-medium">{v.vaccine_name}</TableCell>
                        <TableCell className="font-body">{v.age_range}</TableCell>
                        <TableCell className="font-body">{v.dosage_schedule}</TableCell>
                        <TableCell className="font-body text-muted-foreground">{v.notes}</TableCell>
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
