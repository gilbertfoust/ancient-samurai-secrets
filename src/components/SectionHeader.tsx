import { type LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accentColor: string; // HSL values like "152 44% 28%"
  pattern?: "herbs" | "waves" | "dots" | "crosses" | "rings";
}

function PatternSVG({ pattern, color }: { pattern: string; color: string }) {
  const opacity = "0.06";
  switch (pattern) {
    case "herbs":
      return (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="herbs-pat" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M30 5 C30 5, 20 20, 30 30 C40 20, 30 5, 30 5Z" fill={`hsl(${color})`} opacity={opacity} />
              <path d="M10 35 C10 35, 5 45, 10 50 C15 45, 10 35, 10 35Z" fill={`hsl(${color})`} opacity={opacity} />
              <path d="M50 40 C50 40, 45 50, 50 55 C55 50, 50 40, 50 40Z" fill={`hsl(${color})`} opacity={opacity} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#herbs-pat)" />
        </svg>
      );
    case "waves":
      return (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="waves-pat" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10 Q25 0, 50 10 T100 10" fill="none" stroke={`hsl(${color})`} strokeWidth="1" opacity={opacity} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#waves-pat)" />
        </svg>
      );
    case "dots":
      return (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots-pat" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1.5" fill={`hsl(${color})`} opacity={opacity} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots-pat)" />
        </svg>
      );
    case "crosses":
      return (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="cross-pat" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M15 10 V20 M10 15 H20" stroke={`hsl(${color})`} strokeWidth="1" opacity={opacity} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cross-pat)" />
        </svg>
      );
    case "rings":
      return (
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="rings-pat" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="8" fill="none" stroke={`hsl(${color})`} strokeWidth="0.8" opacity={opacity} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#rings-pat)" />
        </svg>
      );
    default:
      return null;
  }
}

export function SectionHeader({ icon: Icon, title, subtitle, accentColor, pattern = "dots" }: SectionHeaderProps) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border border-border p-6 md:p-8"
      style={{
        background: `linear-gradient(135deg, hsl(${accentColor} / 0.08) 0%, hsl(${accentColor} / 0.02) 50%, transparent 100%)`,
      }}
    >
      <PatternSVG pattern={pattern} color={accentColor} />

      {/* Decorative circle */}
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-[0.05]"
        style={{ background: `hsl(${accentColor})` }}
      />
      <div
        className="absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-[0.08]"
        style={{ background: `hsl(${accentColor})` }}
      />

      <div className="relative flex items-start gap-4">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl shadow-sm"
          style={{
            background: `linear-gradient(135deg, hsl(${accentColor} / 0.15), hsl(${accentColor} / 0.08))`,
            border: `1px solid hsl(${accentColor} / 0.2)`,
          }}
        >
          <Icon className="h-7 w-7" style={{ color: `hsl(${accentColor})` }} />
        </div>
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-display font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground font-body text-sm md:text-base max-w-xl">{subtitle}</p>
        </div>
      </div>

      {/* Bottom decorative line */}
      <div
        className="absolute bottom-0 left-6 right-6 h-[2px] rounded-full opacity-20"
        style={{ background: `linear-gradient(90deg, hsl(${accentColor}), transparent)` }}
      />
    </div>
  );
}
