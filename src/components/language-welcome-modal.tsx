import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { PgLogo, EspLogo } from "@/components/brand-logos";
import { ArrowRight, Sparkles } from "lucide-react";

/**
 * One-time post-login language chooser. Shows on the employee portal until
 * the user has picked a language (persisted in localStorage `esp.lang`).
 */
export function LanguageWelcomeModal() {
  const { hasChosen, setLang, markChosen } = useLang();

  function choose(l: "en" | "hi" | "mr") {
    setLang(l);
    markChosen();
  }

  return (
    <Dialog open={!hasChosen}>
      <DialogContent className="max-w-md p-6 sm:p-8 [&>button.absolute]:hidden" onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogTitle className="sr-only">Choose language</DialogTitle>
        <div className="text-center space-y-5">
          {/* 1. PG Logo */}
          <div className="flex justify-center">
            <PgLogo imgClassName="h-14 sm:h-16" />
          </div>

          {/* 2. Welcome to */}
          <div>
            <h2 className="text-2xl font-extrabold text-[color:oklch(0.18_0.05_260)]">Welcome to</h2>
          </div>

          {/* 3. ESP Logo */}
          <div className="flex justify-center">
            <EspLogo imgClassName="h-14 sm:h-16" />
          </div>

          {/* 4. Share idea line */}
          <div className="py-1">
            <p className="text-sm sm:text-base text-foreground/80 font-medium">
              Share your ideas. Improve your workplace.
            </p>
          </div>

          {/* 5. Language sequence: Hindi -> Marathi -> English */}
          <div className="pt-2">
            <p className="font-semibold text-sm mb-3 text-[color:oklch(0.18_0.05_260)]">
              Choose Language / भाषा चुनें / भाषा निवडा
            </p>
            <div className="grid gap-2">
              <Button variant="outline" className="h-11 font-semibold border-primary text-primary hover:bg-primary/5" onClick={() => choose("hi")}>
                हिन्दी में जारी रखें <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="outline" className="h-11 font-semibold border-primary text-primary hover:bg-primary/5" onClick={() => choose("mr")}>
                मराठीत पुढे सुरू ठेवा <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button className="h-11 font-semibold bg-primary hover:bg-primary/90" onClick={() => choose("en")}>
                Continue in English <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
