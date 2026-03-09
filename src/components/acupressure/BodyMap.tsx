import { useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

/** Approximate (x, y) on a 300×520 front-view silhouette. */
const POINT_POSITIONS: Record<string, { x: number; y: number; label: string; side?: "front" | "back" }> = {
  // Head & Face
  GV20:  { x: 150, y: 18,  label: "GV20 Bǎi Huì" },
  GV24:  { x: 150, y: 36,  label: "GV24 Shén Tíng" },
  GB14:  { x: 135, y: 42,  label: "GB14 Yáng Bái" },
  BL2:   { x: 139, y: 50,  label: "BL2 Zǎn Zhú" },
  GB1:   { x: 163, y: 55,  label: "GB1 Tóng Zǐ Liáo" },
  ST1:   { x: 143, y: 56,  label: "ST1 Chéng Qì" },
  ST2:   { x: 141, y: 62,  label: "ST2 Sì Bái" },
  TE23:  { x: 168, y: 50,  label: "TE23 Sī Zhú Kōng" },
  GB8:   { x: 178, y: 38,  label: "GB8 Shuài Gǔ" },
  GB20:  { x: 172, y: 62,  label: "GB20 Fēng Chí" },
  GV26:  { x: 150, y: 72,  label: "GV26 Rén Zhōng" },
  CV24:  { x: 150, y: 80,  label: "CV24 Chéng Jiāng" },
  LI20:  { x: 162, y: 68,  label: "LI20 Yíng Xiāng" },
  ST4:   { x: 160, y: 76,  label: "ST4 Dì Cāng" },
  ST6:   { x: 170, y: 72,  label: "ST6 Jiá Chē" },
  ST7:   { x: 175, y: 62,  label: "ST7 Xià Guān" },
  SI19:  { x: 182, y: 58,  label: "SI19 Tīng Gōng" },
  GB2:   { x: 184, y: 64,  label: "GB2 Tīng Huì" },
  TE21:  { x: 186, y: 55,  label: "TE21 Ěr Mén" },
  TE17:  { x: 183, y: 70,  label: "TE17 Yì Fēng" },
  // Neck & Upper Back
  GV14:  { x: 150, y: 105, label: "GV14 Dà Zhuī", side: "back" },
  GV16:  { x: 150, y: 85,  label: "GV16 Fēng Fǔ", side: "back" },
  BL10:  { x: 162, y: 90,  label: "BL10 Tiān Zhù", side: "back" },
  GB21:  { x: 120, y: 108, label: "GB21 Jiān Jǐng" },
  // Chest & Shoulder
  CV22:  { x: 150, y: 112, label: "CV22 Tiān Tū" },
  LU1:   { x: 112, y: 120, label: "LU1 Zhōng Fǔ" },
  LU2:   { x: 110, y: 114, label: "LU2 Yún Mén" },
  KI27:  { x: 140, y: 114, label: "KI27 Shū Fǔ" },
  CV17:  { x: 150, y: 145, label: "CV17 Shān Zhōng" },
  PC1:   { x: 118, y: 145, label: "PC1 Tiān Chí" },
  LI15:  { x: 96,  y: 112, label: "LI15 Jiān Yú" },
  SI11:  { x: 125, y: 140, label: "SI11 Tiān Zōng", side: "back" },
  // Arm points
  LU3:   { x: 90,  y: 150, label: "LU3 Tiān Fǔ" },
  LI14:  { x: 92,  y: 160, label: "LI14 Bì Nào" },
  HT1:   { x: 100, y: 140, label: "HT1 Jí Quán" },
  LU5:   { x: 82,  y: 192, label: "LU5 Chǐ Zé" },
  LI11:  { x: 88,  y: 188, label: "LI11 Qū Chí" },
  PC3:   { x: 85,  y: 195, label: "PC3 Qū Zé" },
  HT3:   { x: 80,  y: 198, label: "HT3 Shào Hǎi" },
  SI8:   { x: 218, y: 198, label: "SI8 Xiǎo Hǎi" },
  LI10:  { x: 84,  y: 205, label: "LI10 Shǒu Sān Lǐ" },
  LU6:   { x: 78,  y: 212, label: "LU6 Kǒng Zuì" },
  PC4:   { x: 76,  y: 218, label: "PC4 Xī Mén" },
  PC6:   { x: 74,  y: 228, label: "PC6 Nèi Guān" },
  TE5:   { x: 225, y: 232, label: "TE5 Wài Guān" },
  TE6:   { x: 224, y: 225, label: "TE6 Zhī Gōu" },
  LU7:   { x: 70,  y: 240, label: "LU7 Liè Quē" },
  PC7:   { x: 68,  y: 248, label: "PC7 Dà Líng" },
  HT7:   { x: 66,  y: 252, label: "HT7 Shén Mén" },
  LU9:   { x: 64,  y: 256, label: "LU9 Tài Yuān" },
  LI5:   { x: 232, y: 250, label: "LI5 Yáng Xī" },
  SI5:   { x: 234, y: 254, label: "SI5 Yáng Gǔ" },
  LI4:   { x: 58,  y: 278, label: "LI4 Hé Gǔ" },
  PC8:   { x: 60,  y: 270, label: "PC8 Láo Gōng" },
  LU10:  { x: 56,  y: 272, label: "LU10 Yú Jì" },
  SI3:   { x: 240, y: 275, label: "SI3 Hòu Xī" },
  TE3:   { x: 238, y: 270, label: "TE3 Zhōng Zhǔ" },
  HT5:   { x: 67,  y: 244, label: "HT5 Tōng Lǐ" },
  // Abdomen
  CV14:  { x: 150, y: 175, label: "CV14 Jù Quē" },
  CV12:  { x: 150, y: 195, label: "CV12 Zhōng Wǎn" },
  ST21:  { x: 140, y: 195, label: "ST21 Liáng Mén" },
  ST25:  { x: 138, y: 215, label: "ST25 Tiān Shū" },
  CV8:   { x: 150, y: 215, label: "CV8 Shén Quē" },
  CV6:   { x: 150, y: 228, label: "CV6 Qì Hǎi" },
  CV4:   { x: 150, y: 240, label: "CV4 Guān Yuán" },
  CV3:   { x: 150, y: 248, label: "CV3 Zhōng Jí" },
  SP15:  { x: 130, y: 215, label: "SP15 Dà Héng" },
  // Back points
  BL11:  { x: 162, y: 115, label: "BL11 Dà Zhù", side: "back" },
  BL13:  { x: 162, y: 128, label: "BL13 Fèi Shū", side: "back" },
  BL15:  { x: 162, y: 140, label: "BL15 Xīn Shū", side: "back" },
  BL17:  { x: 162, y: 155, label: "BL17 Gé Shū", side: "back" },
  BL18:  { x: 162, y: 168, label: "BL18 Gān Shū", side: "back" },
  BL20:  { x: 162, y: 182, label: "BL20 Pí Shū", side: "back" },
  BL21:  { x: 162, y: 190, label: "BL21 Wèi Shū", side: "back" },
  BL23:  { x: 162, y: 205, label: "BL23 Shèn Shū", side: "back" },
  BL25:  { x: 162, y: 220, label: "BL25 Dà Cháng Shū", side: "back" },
  GV4:   { x: 150, y: 205, label: "GV4 Mìng Mén", side: "back" },
  // Hip & Buttock
  GB30:  { x: 185, y: 270, label: "GB30 Huán Tiào", side: "back" },
  // Leg points
  ST34:  { x: 125, y: 310, label: "ST34 Liáng Qiū" },
  SP10:  { x: 135, y: 305, label: "SP10 Xuè Hǎi" },
  ST35:  { x: 122, y: 325, label: "ST35 Dú Bí" },
  GB34:  { x: 115, y: 338, label: "GB34 Yáng Líng Quán" },
  SP9:   { x: 135, y: 338, label: "SP9 Yīn Líng Quán" },
  ST36:  { x: 120, y: 350, label: "ST36 Zú Sān Lǐ" },
  ST37:  { x: 120, y: 365, label: "ST37 Shàng Jù Xū" },
  GB31:  { x: 110, y: 300, label: "GB31 Fēng Shì" },
  BL40:  { x: 185, y: 350, label: "BL40 Wěi Zhōng", side: "back" },
  ST40:  { x: 118, y: 388, label: "ST40 Fēng Lóng" },
  GB39:  { x: 112, y: 420, label: "GB39 Xuán Zhōng" },
  BL57:  { x: 180, y: 395, label: "BL57 Chéng Shān", side: "back" },
  SP6:   { x: 133, y: 418, label: "SP6 Sān Yīn Jiāo" },
  // Ankle & Foot
  ST41:  { x: 128, y: 448, label: "ST41 Jiě Xī" },
  BL60:  { x: 175, y: 448, label: "BL60 Kūn Lún" },
  KI3:   { x: 135, y: 445, label: "KI3 Tài Xī" },
  KI6:   { x: 136, y: 452, label: "KI6 Zhào Hǎi" },
  BL62:  { x: 172, y: 455, label: "BL62 Shēn Mài" },
  LR3:   { x: 128, y: 478, label: "LR3 Tài Chōng" },
  GB41:  { x: 120, y: 475, label: "GB41 Zú Lín Qì" },
  ST44:  { x: 126, y: 488, label: "ST44 Nèi Tíng" },
  KI1:   { x: 170, y: 492, label: "KI1 Yǒng Quán" },
  SP4:   { x: 138, y: 470, label: "SP4 Gōng Sūn" },
  LR2:   { x: 130, y: 485, label: "LR2 Xíng Jiān" },
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
