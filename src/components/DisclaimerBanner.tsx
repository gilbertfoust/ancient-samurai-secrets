import { AlertTriangle } from "lucide-react";

export function DisclaimerBanner() {
  return (
    <div className="bg-accent/60 border border-border rounded-lg px-4 py-3 flex items-start gap-3 text-sm font-body">
      <AlertTriangle className="h-4 w-4 text-evidence-traditional mt-0.5 shrink-0" />
      <p className="text-muted-foreground">
        <strong className="text-foreground">Medical Disclaimer:</strong> This content is for educational purposes only and does not replace professional medical advice. Always consult a qualified healthcare provider before starting any treatment.
      </p>
    </div>
  );
}
