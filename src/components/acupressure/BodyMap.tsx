import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/** Approximate (x, y) on a 300×520 front-view silhouette. */
const POINT_POSITIONS: Record<string, { x: number; y: number; label: string; side?: "front" | "back" }> = {
  GV20:  { x: 150, y: 18,  label: "GV20 Bǎi Huì" },
  GB20:  { x: 172, y: 62,  label: "GB20 Fēng Chí" },
  GV26:  { x: 150, y: 72,  label: "GV26 Rénzhōng" },
  LI20:  { x: 162, y: 68,  label: "LI20 Yíng Xiāng" },
  GV14:  { x: 150, y: 105, label: "GV14 Dà Zhuī", side: "back" },
  LU1:   { x: 112, y: 118, label: "LU1 Zhōng Fǔ" },
  CV12:  { x: 150, y: 195, label: "CV12 Zhōng Wǎn" },
  CV6:   { x: 150, y: 225, label: "CV6 Qì Hǎi" },
  CV4:   { x: 150, y: 240, label: "CV4 Guān Yuán" },
  BL23:  { x: 135, y: 210, label: "BL23 Shèn Shū", side: "back" },
  PC6:   { x: 75,  y: 230, label: "PC6 Nèi Guān" },
  HT7:   { x: 68,  y: 250, label: "HT7 Shén Mén" },
  LI4:   { x: 58,  y: 280, label: "LI4 Hé Gǔ" },
  LU5:   { x: 82,  y: 195, label: "LU5 Chǐ Zé" },
  LI11:  { x: 88,  y: 190, label: "LI11 Qū Chí" },
  TE5:   { x: 225, y: 235, label: "TE5 Wài Guān" },
  ST36:  { x: 118, y: 345, label: "ST36 Zú Sān Lǐ" },
  GB34:  { x: 115, y: 335, label: "GB34 Yáng Líng Quán" },
  SP6:   { x: 130, y: 415, label: "SP6 Sān Yīn Jiāo" },
  BL40:  { x: 185, y: 350, label: "BL40 Wěi Zhōng", side: "back" },
  KI3:   { x: 132, y: 440, label: "KI3 Tài Xī" },
  LR3:   { x: 125, y: 475, label: "LR3 Tài Chōng" },
  KI1:   { x: 175, y: 490, label: "KI1 Yǒng Quán" },
};

const MERIDIAN_COLORS: Record<string, string> = {
  Lung: "hsl(200 60% 50%)",
  "Large Intestine": "hsl(30 60% 50%)",
  Stomach: "hsl(45 70% 50%)",
  Spleen: "hsl(350 60% 50%)",
  Heart: "hsl(0 70% 50%)",
  Bladder: "hsl(210 70% 50%)",
  Kidney: "hsl(220 50% 40%)",
  Pericardium: "hsl(280 50% 50%)",
  "Triple Energizer": "hsl(20 60% 55%)",
  Gallbladder: "hsl(140 50% 40%)",
  Liver: "hsl(160 50% 35%)",
  "Governor Vessel": "hsl(50 70% 50%)",
  "Conception Vessel": "hsl(260 40% 50%)",
};

interface AcuPoint {
  id: string;
  alphanumeric_code: string | null;
  point_name: string;
  meridian: string | null;
  condition: string | null;
}

interface BodyMapProps {
  points: AcuPoint[];
  selectedMeridian?: string;
}

export function BodyMap({ points, selectedMeridian = "All" }: BodyMapProps) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  // Group DB points by their alphanumeric code prefix (e.g. "LI4") → pick first match
  const mappedPoints = useMemo(() => {
    const result: { code: string; pos: typeof POINT_POSITIONS[string]; point: AcuPoint }[] = [];
    const used = new Set<string>();

    for (const p of points) {
      const code = p.alphanumeric_code?.replace(/\s.*/, "") || "";
      if (!code || used.has(code)) continue;
      const pos = POINT_POSITIONS[code];
      if (!pos) continue;
      if (selectedMeridian !== "All" && p.meridian !== selectedMeridian) continue;
      used.add(code);
      result.push({ code, pos, point: p });
    }
    return result;
  }, [points, selectedMeridian]);

  return (
    <TooltipProvider delayDuration={100}>
      <div className="relative flex justify-center">
        <svg
          viewBox="0 0 300 520"
          className="w-full max-w-[320px] h-auto"
          role="img"
          aria-label="Human body acupressure point map"
        >
          {/* Body silhouette */}
          <path
            d={`
              M150 12 C138 12 132 20 130 32 C128 42 128 50 130 58
              C126 60 120 62 118 66 C116 72 118 78 120 82
              C114 84 108 88 104 96 C98 106 96 112 96 120
              C94 124 88 128 80 136 C72 144 64 156 58 168
              C52 180 48 192 46 200 C44 208 44 216 46 224
              C48 232 52 240 54 248 C56 256 56 264 54 272
              C52 280 50 288 50 296
              L50 296 C52 298 56 300 60 298
              C64 294 66 286 66 278 C66 270 68 262 70 254
              C72 246 76 240 80 236
              C84 236 88 240 92 248
              C96 260 100 276 104 292
              C106 308 108 324 112 340
              C114 352 116 364 118 376
              C120 392 122 408 124 420
              C126 436 128 448 128 460
              C128 472 126 484 124 492
              C122 498 120 504 122 510
              C124 514 130 516 136 514
              C140 510 142 504 142 496
              C142 488 140 480 140 472
              C140 464 142 456 144 448
              C146 440 148 432 148 424
              L150 424
              L152 424
              C152 432 154 440 156 448
              C158 456 160 464 160 472
              C160 480 158 488 158 496
              C158 504 160 510 164 514
              C170 516 176 514 178 510
              C180 504 178 498 176 492
              C172 484 172 472 172 460
              C172 448 174 436 176 420
              C178 408 180 392 182 376
              C184 364 186 352 188 340
              C192 324 194 308 196 292
              C200 276 204 260 208 248
              C212 240 216 236 220 236
              C224 240 228 246 230 254
              C232 262 234 270 234 278
              C234 286 236 294 240 298
              C244 300 248 298 250 296
              L250 296 C250 288 248 280 246 272
              C244 264 244 256 246 248
              C248 240 252 232 254 224
              C256 216 256 208 254 200
              C252 192 248 180 242 168
              C236 156 228 144 220 136
              C212 128 206 124 204 120
              C204 112 202 106 196 96
              C192 88 186 84 180 82
              C182 78 184 72 182 66
              C180 62 174 60 170 58
              C172 50 172 42 170 32
              C168 20 162 12 150 12Z
            `}
            fill="hsl(var(--muted) / 0.3)"
            stroke="hsl(var(--muted-foreground) / 0.4)"
            strokeWidth="1.5"
            className="transition-colors"
          />

          {/* Center line */}
          <line x1="150" y1="12" x2="150" y2="424" stroke="hsl(var(--muted-foreground) / 0.15)" strokeWidth="0.5" strokeDasharray="4 4" />

          {/* Points */}
          {mappedPoints.map(({ code, pos, point }) => {
            const color = MERIDIAN_COLORS[point.meridian || ""] || "hsl(var(--primary))";
            const isHovered = hovered === code;
            const isBack = pos.side === "back";

            return (
              <Tooltip key={code}>
                <TooltipTrigger asChild>
                  <g
                    className="cursor-pointer"
                    onClick={() => navigate(`/acupressure/${point.id}`)}
                    onMouseEnter={() => setHovered(code)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Pulse ring */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isHovered ? 10 : 6}
                      fill={`${color}`}
                      opacity={isHovered ? 0.2 : 0.1}
                      className="transition-all duration-200"
                    />
                    {/* Dot */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={isHovered ? 5 : 3.5}
                      fill={color}
                      stroke="hsl(var(--background))"
                      strokeWidth="1.2"
                      className="transition-all duration-200"
                      opacity={isBack ? 0.6 : 1}
                    />
                    {/* Label on hover */}
                    {isHovered && (
                      <text
                        x={pos.x + 8}
                        y={pos.y + 4}
                        fontSize="8"
                        fill="hsl(var(--foreground))"
                        fontWeight="600"
                        className="pointer-events-none select-none"
                      >
                        {code}
                      </text>
                    )}
                  </g>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[200px]">
                  <p className="font-semibold text-sm">{pos.label}</p>
                  {point.condition && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{point.condition}</p>
                  )}
                  {isBack && (
                    <p className="text-[10px] text-muted-foreground mt-1 italic">Posterior point</p>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 text-[10px] text-muted-foreground space-y-0.5">
          <div className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-primary opacity-100" />
            <span>Front</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-primary opacity-50" />
            <span>Back</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
