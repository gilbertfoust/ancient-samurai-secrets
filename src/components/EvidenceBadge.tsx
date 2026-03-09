import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const labelStyles: Record<string, string> = {
  Supported: "bg-evidence-supported/15 text-evidence-supported border-evidence-supported/30",
  Observed: "bg-evidence-observed/15 text-evidence-observed border-evidence-observed/30",
  Traditional: "bg-evidence-traditional/15 text-evidence-traditional border-evidence-traditional/30",
  Speculative: "bg-evidence-speculative/15 text-evidence-speculative border-evidence-speculative/30",
};

export function EvidenceBadge({ label }: { label: string }) {
  return (
    <Badge variant="outline" className={cn("text-xs font-body font-medium", labelStyles[label])}>
      {label}
    </Badge>
  );
}
