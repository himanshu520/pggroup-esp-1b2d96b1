import { memo, useCallback, useState } from "react";
import pgLogo from "@/assets/pg-logo.png.asset.json";
import espLogo from "@/assets/esp-logo.png.asset.json";
import { cn } from "@/lib/utils";

export function PgLogo({
  className,
  imgClassName,
}: {
  className?: string;
  imgClassName?: string;
}) {
  const [pgLoaded, setPgLoaded] = useState(false);
  const pgRef = useCallback((el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth > 0) setPgLoaded(true);
  }, []);

  return (
    <span className={cn("relative inline-block", className)}>
      {!pgLoaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-md bg-muted/60 animate-pulse"
        />
      )}
      <img
        ref={pgRef}
        src={pgLogo.url}
        alt="PG Group company logo"
        width={192}
        height={64}
        decoding="async"
        fetchPriority="high"
        onLoad={() => setPgLoaded(true)}
        className={cn("brand-logo w-auto", pgLoaded && "is-loaded", imgClassName)}
      />
    </span>
  );
}

export function EspLogo({
  className,
  imgClassName,
}: {
  className?: string;
  imgClassName?: string;
}) {
  const [espLoaded, setEspLoaded] = useState(false);
  const espRef = useCallback((el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth > 0) setEspLoaded(true);
  }, []);

  return (
    <span className={cn("relative inline-block", className)}>
      {!espLoaded && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-md bg-muted/60 animate-pulse"
        />
      )}
      <img
        ref={espRef}
        src={espLogo.url}
        alt="Employee Suggestion Portal logo"
        width={192}
        height={64}
        decoding="async"
        fetchPriority="high"
        onLoad={() => setEspLoaded(true)}
        className={cn(
          "brand-logo brand-logo-delay w-auto",
          espLoaded && "is-loaded",
          imgClassName,
        )}
      />
    </span>
  );
}

/**
 * PG + ESP brand logos with normalized fade/scale-in animation.
 */
function BrandLogosImpl({
  className,
  imgClassName,
  gapClassName = "gap-4",
}: {
  className?: string;
  imgClassName?: string;
  gapClassName?: string;
}) {
  return (
    <div
      className={cn("flex items-center", gapClassName, className)}
      role="img"
      aria-label="PG Group — Employee Suggestion Portal"
    >
      <PgLogo imgClassName={imgClassName} />
      <EspLogo imgClassName={imgClassName} />
    </div>
  );
}

export const BrandLogos = memo(BrandLogosImpl);
