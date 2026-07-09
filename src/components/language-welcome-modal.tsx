import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLang } from "@/lib/i18n";
import { BrandLogos } from "@/components/brand-logos";
import { ArrowRight } from "lucide-react";

/**
 * One-time post-login language chooser. Shows on the employee portal until
 * the user has picked a language (persisted in localStorage `esp.lang`).
 */
export function LanguageWelcomeModal() {
  const { hasChosen, setLang, markChosen } = useLang();

  function choose(l: "en" | "hi") {
    setLang(l);
    markChosen();
  }

  return (
    <Dialog open={!hasChosen}>
      <DialogContent className="max-w-md p-8 [&>button.absolute]:hidden" onEscapeKeyDown={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogTitle className="sr-only">Choose language</DialogTitle>
        <div className="text-center space-y-6">
          <BrandLogos className="justify-center" imgClassName="h-12" />
          <div>
            <h2 className="text-xl font-bold">Welcome / स्वागत है</h2>
            <p className="text-sm text-muted-foreground mt-1">Employee Suggestion Portal / कर्मचारी सुझाव पोर्टल</p>
          </div>
          <p className="text-sm text-foreground/80">
            Share your ideas. Improve your workplace.
            <br />
            अपने विचार साझा करें। अपने कार्यस्थल को बेहतर बनाएँ।
          </p>
          <div className="pt-2">
            <p className="font-semibold mb-3">Do you want to continue? / क्या आप जारी रखना चाहते हैं?</p>
            <div className="grid gap-2">
              <Button className="h-11" onClick={() => choose("en")}>
                Continue in English <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="outline" className="h-11" onClick={() => choose("hi")}>
                हिन्दी में जारी रखें <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
