import React, { useMemo } from "react";
import { QrCode, Ecc } from "@/lib/qrcode";

interface QRCodeSVGProps extends React.SVGProps<SVGSVGElement> {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  bgColor?: string;
  fgColor?: string;
  includeMargin?: boolean;
}

export function QRCodeSVG({
  value,
  size = 128,
  level = "M",
  bgColor = "#ffffff",
  fgColor = "#000000",
  includeMargin = true,
  className,
  ...props
}: QRCodeSVGProps) {
  const { path, viewBoxSize } = useMemo(() => {
    try {
      const eccMap = {
        L: Ecc.LOW,
        M: Ecc.MEDIUM,
        Q: Ecc.QUARTILE,
        H: Ecc.HIGH,
      };
      const ecl = eccMap[level] || Ecc.MEDIUM;
      const qr = QrCode.encodeText(value, ecl);
      const margin = includeMargin ? 2 : 0;
      const qrSize = qr.size;
      const totalSize = qrSize + margin * 2;

      let d = "";
      for (let y = 0; y < qrSize; y++) {
        for (let x = 0; x < qrSize; x++) {
          if (qr.getModule(x, y)) {
            d += `M${x + margin},${y + margin}h1v1h-1z `;
          }
        }
      }

      return { path: d, viewBoxSize: totalSize };
    } catch (e) {
      console.error("Failed to generate QR Code:", e);
      return { path: "", viewBoxSize: 25 };
    }
  }, [value, level, includeMargin]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      width={size}
      height={size}
      className={className}
      shapeRendering="crispEdges"
      {...props}
    >
      {bgColor && <rect width={viewBoxSize} height={viewBoxSize} fill={bgColor} />}
      <path d={path} fill={fgColor} />
    </svg>
  );
}
