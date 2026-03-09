import { useSearchParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";
import { Skeleton } from "@/components/ui/skeleton";

export default function SearchResults() {
  const [params] = useSearchParams();
  const q = params.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", q],
    queryFn: async () => {
      if (!q) return { recipes: [], remedies: [], herbs: [], oils: [] };
      const pattern = `%${q}%`;
      const [recipes, remedies, herbs, oils] = await Promise.all([
        supabase.from("recipes").select("id, title, purpose, evidence_label").ilike("title", pattern).limit(10),
        supabase.from("remedies").select("id, condition, method, evidence_label").ilike("condition", pattern).limit(10),
        supabase.from("herbs").select("id, common_name, chinese_name, uses, evidence_label").ilike("common_name", pattern).limit(10),
        supabase.from("oils").select("id, name, condition, evidence_label").ilike("name", pattern).limit(10),
      ]);
      return {
        recipes: recipes.data || [],
        remedies: remedies.data || [],
        herbs: herbs.data || [],
        oils: oils.data || [],
      };
    },
    enabled: !!q,
  });

  const totalResults = (data?.recipes.length || 0) + (data?.remedies.length || 0) + (data?.herbs.length || 0) + (data?.oils.length || 0);

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Search Results</h1>
        <p className="text-muted-foreground font-body mt-1">
          {isLoading ? "Searching…" : `${totalResults} result${totalResults !== 1 ? "s" : ""} for "${q}"`}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-lg" />)}</div>
      ) : (
        <div className="space-y-8">
          {data && data.recipes.length > 0 && (
            <section>
              <h2 className="text-xl font-display font-semibold mb-3">Recipes</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {data.recipes.map((r) => (
                  <Link key={r.id} to={`/recipes/${r.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex justify-between gap-2">
                          <CardTitle className="font-display text-base">{r.title}</CardTitle>
                          <EvidenceBadge label={r.evidence_label} />
                        </div>
                        {r.purpose && <CardDescription className="font-body">{r.purpose}</CardDescription>}
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {data && data.remedies.length > 0 && (
            <section>
              <h2 className="text-xl font-display font-semibold mb-3">Remedies</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {data.remedies.map((r) => (
                  <Link key={r.id} to={`/remedies/${r.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex justify-between gap-2">
                          <CardTitle className="font-display text-base">{r.condition}</CardTitle>
                          <EvidenceBadge label={r.evidence_label} />
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {data && data.herbs.length > 0 && (
            <section>
              <h2 className="text-xl font-display font-semibold mb-3">Herbs</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {data.herbs.map((h) => (
                  <Link key={h.id} to={`/herbs/${h.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex justify-between gap-2">
                          <CardTitle className="font-display text-base">{h.common_name}</CardTitle>
                          <EvidenceBadge label={h.evidence_label} />
                        </div>
                        {h.chinese_name && <CardDescription className="font-body">{h.chinese_name}</CardDescription>}
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {data && data.oils.length > 0 && (
            <section>
              <h2 className="text-xl font-display font-semibold mb-3">Oils</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {data.oils.map((o) => (
                  <Link key={o.id} to={`/oils/${o.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex justify-between gap-2">
                          <CardTitle className="font-display text-base">{o.name}</CardTitle>
                          <EvidenceBadge label={o.evidence_label} />
                        </div>
                      </CardHeader>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          )}
          {totalResults === 0 && (
            <p className="text-center text-muted-foreground font-body py-10">No results found. Try a different search term.</p>
          )}
        </div>
      )}
    </div>
  );
}
