import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { EvidenceBadge } from "@/components/EvidenceBadge";

interface AcuPoint {
  id: string;
  point_name: string;
  alphanumeric_code: string | null;
  meridian: string | null;
  condition: string | null;
  location_description: string | null;
  evidence_label: string;
}

interface SymptomSearchProps {
  points: AcuPoint[];
}

/** Split a condition string into individual symptom tokens, lowercased & trimmed. */
function extractSymptoms(condition: string): string[] {
  return condition
    .split(/,|;/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

/** Score a point against a query. Higher = better match. Returns 0 if no match. */
function scorePoint(point: AcuPoint, query: string): number {
  if (!point.condition) return 0;
  const q = query.toLowerCase().trim();
  if (!q) return 0;

  const symptoms = extractSymptoms(point.condition);
  let score = 0;

  for (const symptom of symptoms) {
    if (symptom === q) {
      score += 10; // exact match
    } else if (symptom.startsWith(q)) {
      score += 7;
    } else if (symptom.includes(q)) {
      score += 4;
    }
  }

  // Also check the full condition string
  if (score === 0 && point.condition.toLowerCase().includes(q)) {
    score += 2;
  }

  return score;
}

const COMMON_SYMPTOMS = [
  "headache",
  "insomnia",
  "nausea",
  "back pain",
  "anxiety",
  "cough",
  "constipation",
  "dizziness",
  "knee pain",
  "sore throat",
];

export function SymptomSearch({ points }: SymptomSearchProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (query.trim().length < 2) return [];
    return points
      .map((p) => ({ point: p, score: scorePoint(p, query) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  }, [points, query]);

  return (
    <Card className="p-4 space-y-3 border-primary/20 bg-primary/[0.03]">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-primary shrink-0" />
        <h3 className="text-sm font-display font-semibold">Symptom → Point Lookup</h3>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Type a symptom (e.g. headache, nausea, back pain)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick symptom chips */}
      {!query && (
        <div className="flex flex-wrap gap-1.5">
          {COMMON_SYMPTOMS.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className="px-2.5 py-1 text-xs rounded-full border border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors capitalize"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Results */}
      {query.trim().length >= 2 && (
        <div className="space-y-1.5">
          {results.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">
              No matching points found. Try a different symptom.
            </p>
          ) : (
            <>
              <p className="text-xs text-muted-foreground">
                {results.length} point{results.length !== 1 ? "s" : ""} found for "{query}"
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {results.map(({ point, score }) => (
                  <Link
                    key={point.id}
                    to={`/acupressure/${point.id}`}
                    className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/50 hover:shadow-sm transition-all group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-semibold text-sm truncate">
                          {point.alphanumeric_code || point.point_name}
                        </span>
                        <EvidenceBadge label={point.evidence_label as any} />
                      </div>
                      {point.meridian && (
                        <Badge variant="outline" className="text-[10px] mt-1 h-5">
                          {point.meridian}
                        </Badge>
                      )}
                      {point.condition && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {point.condition}
                        </p>
                      )}
                    </div>
                    {score >= 7 && (
                      <Badge className="shrink-0 text-[10px] bg-primary/10 text-primary border-primary/20 hover:bg-primary/10">
                        Strong match
                      </Badge>
                    )}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
