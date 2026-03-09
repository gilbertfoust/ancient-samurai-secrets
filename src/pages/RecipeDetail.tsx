import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { EvidenceBadge } from "@/components/EvidenceBadge";

import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RecipeDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading } = useQuery({
    queryKey: ["recipe", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("recipes").select("*").eq("id", id!).single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) return <div className="p-10"><Skeleton className="h-60 w-full" /></div>;
  if (!recipe) return <div className="p-10 text-center text-muted-foreground">Recipe not found.</div>;

  const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients as Array<{ item: string; qty: string }> : [];

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/recipes"><ArrowLeft className="h-4 w-4 mr-1" /> Back to Recipes</Link>
      </Button>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-display font-bold">{recipe.title}</h1>
        <EvidenceBadge label={recipe.evidence_label} />
      </div>
      {recipe.purpose && <p className="text-muted-foreground font-body text-lg">{recipe.purpose}</p>}
      <DisclaimerBanner />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {ingredients.length > 0 && (
            <section>
              <h2 className="text-xl font-display font-semibold mb-3">Ingredients</h2>
              <ul className="space-y-1 font-body">
                {ingredients.map((ing, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-primary font-medium">{ing.qty}</span>
                    <span>{ing.item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {recipe.method && (
            <section>
              <h2 className="text-xl font-display font-semibold mb-3">Method</h2>
              <p className="font-body leading-relaxed whitespace-pre-line">{recipe.method}</p>
            </section>
          )}
        </div>
        <aside className="space-y-4">
          {recipe.storage && (
            <div className="bg-card border border-border rounded-lg p-4">
              <h3 className="font-display font-semibold mb-1">Storage</h3>
              <p className="text-sm font-body text-muted-foreground">{recipe.storage}</p>
            </div>
          )}
          {recipe.cautions && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
              <h3 className="font-display font-semibold mb-1 text-destructive">Cautions</h3>
              <p className="text-sm font-body">{recipe.cautions}</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
