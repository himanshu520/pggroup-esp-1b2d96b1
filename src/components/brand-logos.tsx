import { memo, useCallback, useState } from "react";
import pgLogo from "@/assets/pg-logo.png.asset.json";
import espLogo from "@/assets/esp-logo.png.asset.json";
import { cn } from "@/lib/utils";

/**
 * PG + ESP brand logos with normalized fade/scale-in animation.
 * - Respects prefers-reduced-motion (handled in styles.css).
 * - Reserves aspect-ratio space to prevent layout shift/flicker on refresh.
 * - Shows a subtle skeleton until each image finishes decoding.
 * - Uses a ref callback that checks `img.complete` so the animation still
 *   runs when the image was already served from cache / preload (where
 *   `onLoad` fires before React attaches the listener).
 * - Memoized: props are shallow-stable strings, so re-renders are skipped.
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
  const [pgLoaded, setPgLoaded] = useState(false);
  const [espLoaded, setEspLoaded] = useState(false);

  const pgRef = useCallback((el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth > 0) setPgLoaded(true);
  }, []);
  const espRef = useCallback((el: HTMLImageElement | null) => {
    if (el && el.complete && el.naturalWidth > 0) setEspLoaded(true);
  }, []);

  return (
    <div
      className={cn("flex items-center", gapClassName, className)}
      role="img"
      aria-label="PG Group — Employee Suggestion Portal"
    >
      <span className="relative inline-block">
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
      <span className="relative inline-block">
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
    </div>
  );
}

export const BrandLogos = memo(BrandLogosImpl);
