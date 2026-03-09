import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SectionHeader } from "@/components/SectionHeader";
import { ShieldCheck, BookOpen, Apple, Droplet, HeartHandshake } from "lucide-react";

const catIcons: Record<string, typeof BookOpen> = {
  nutrition: Apple,
  hydration: Droplet,
  wellness: HeartHandshake,
};

export default function Prevention() {
  const { data: guidelines, isLoading: gLoading } = useQuery({
    queryKey: ["guidelines"],
    queryFn: async () => {
      const { data, error } = await supabase.from("guidelines").select("*").order("category");
      if (error) throw error;
      return data;
    },
  });

  const { data: dailyIntake, isLoading: dLoading } = useQuery({
    queryKey: ["daily_intake"],
    queryFn: async () => {
      const { data, error } = await supabase.from("daily_intake_guidelines").select("*");
      if (error) throw error;
      return data;
    },
  });

  const { data: foodPromotions, isLoading: fLoading } = useQuery({
    queryKey: ["food_promotions"],
    queryFn: async () => {
      const { data, error } = await supabase.from("food_promotions").select("*").order("condition");
      if (error) throw error;
      return data;
    },
  });

  const { data: bloodType } = useQuery({
    queryKey: ["diet_blood_type"],
    queryFn: async () => {
      const { data, error } = await supabase.from("diet_blood_type").select("*");
      if (error) throw error;
      return data;
    },
  });

  const isLoading = gLoading || dLoading || fLoading;
  const categories = [...new Set(guidelines?.map((g) => g.category) || [])];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6 animate-fade-in">
      <SectionHeader
        icon={ShieldCheck}
        title="Prevention & Lifestyle"
        subtitle="Nutrition science, daily rhythms, food guides and wellness tips."
        accentColor="210 60% 45%"
        pattern="waves"
      />
      

      {isLoading ? (
        <Skeleton className="h-60 w-full" />
      ) : (
        <Tabs defaultValue="guidelines">
          <TabsList>
            <TabsTrigger value="guidelines" className="font-body">Guidelines</TabsTrigger>
            <TabsTrigger value="intake" className="font-body">Daily Intake</TabsTrigger>
            <TabsTrigger value="foods" className="font-body">Food Charts</TabsTrigger>
            <TabsTrigger value="blood" className="font-body">Blood Type</TabsTrigger>
          </TabsList>

          <TabsContent value="guidelines" className="space-y-6 mt-4">
            {categories.map((cat) => {
              const CatIcon = catIcons[cat] || BookOpen;
              return (
                <div key={cat}>
                  <div className="flex items-center gap-2 mb-3">
                    <CatIcon className="h-5 w-5 text-primary/70" />
                    <h2 className="text-xl font-display font-semibold capitalize">{cat}</h2>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {guidelines?.filter((g) => g.category === cat).map((g) => (
                      <Card key={g.id} className="border-border/60 hover:shadow-sm transition-shadow">
                        <CardHeader>
                          <CardTitle className="font-display text-base">{g.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm font-body text-muted-foreground">{g.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="intake" className="mt-4">
            <Card className="border-border/60">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-display">Metric</TableHead>
                      <TableHead className="font-display">Recommended</TableHead>
                      <TableHead className="font-display">Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dailyIntake?.map((d) => (
                      <TableRow key={d.id}>
                        <TableCell className="font-body font-medium">{d.metric}</TableCell>
                        <TableCell className="font-body">{d.recommended_range}</TableCell>
                        <TableCell className="font-body text-muted-foreground">{d.notes}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="foods" className="mt-4">
            <Card className="border-border/60">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-display">Condition</TableHead>
                      <TableHead className="font-display">Nutrient Focus</TableHead>
                      <TableHead className="font-display">Example Foods</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {foodPromotions?.map((f) => (
                      <TableRow key={f.id}>
                        <TableCell className="font-body font-medium">{f.condition}</TableCell>
                        <TableCell className="font-body">{f.nutrient_focus}</TableCell>
                        <TableCell className="font-body text-muted-foreground">{f.example_foods}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="blood" className="mt-4">
            <Card className="border-border/60">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-display">Type</TableHead>
                      <TableHead className="font-display">Category</TableHead>
                      <TableHead className="font-display">Allowed</TableHead>
                      <TableHead className="font-display">Limit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bloodType?.map((b) => (
                      <TableRow key={b.id}>
                        <TableCell className="font-body font-medium">{b.blood_type}</TableCell>
                        <TableCell className="font-body">{b.category}</TableCell>
                        <TableCell className="font-body text-muted-foreground">{b.foods_allowed}</TableCell>
                        <TableCell className="font-body text-muted-foreground">{b.foods_to_limit}</TableCell>
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
