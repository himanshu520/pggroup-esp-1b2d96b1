import { createFileRoute, redirect } from "@tanstack/react-router";
import { EmployeeShell, PageHeader } from "@/components/employee-shell";
import { useSession } from "@/lib/session";
import { useLang, useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Camera } from "lucide-react";

export const Route = createFileRoute("/employee/profile")({
  beforeLoad: () => { throw redirect({ to: "/employee", search: { section: "profile" } as any }); },
  component: () => null,
});

export function ProfilePage() {
  const { data: s } = useSession();
  const e = s?.employee;
  const t = useT();
  const { lang, setLang } = useLang();
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();

  const genderLabel = e?.gender ? t(`gender_${e.gender}`) : null;

  const handleAvatarUpload = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return toast.error("Please upload an image file only.");
    }
    if (file.size > 5 * 1024 * 1024) {
      return toast.error("Image file size must be less than 5MB.");
    }

    setUploading(true);
    try {
      const path = `${e?.id}/avatar/${crypto.randomUUID()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from("suggestion-files").upload(path, file, { contentType: file.type });
      if (upErr) throw new Error("Upload failed: " + upErr.message);

      const { data: { publicUrl } } = supabase.storage.from("suggestion-files").getPublicUrl(path);

      // Update employee row
      const { error: updErr } = await supabase
        .from("employees")
        .update({ avatar_url: publicUrl })
        .eq("id", e!.id);
      if (updErr) throw new Error("Database update failed: " + updErr.message);

      toast.success("Profile photo updated successfully!");
      // Reload session
      qc.invalidateQueries({ queryKey: ["session"] });
    } catch (err: any) {
      toast.error(err.message ?? "Failed to update profile photo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <EmployeeShell>
      <PageHeader title={t("profile_title")} description={t("profile_desc")} />
      <div className="grid gap-4 max-w-2xl">
        <div className="rounded-lg border border-border bg-card p-6 flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar Container */}
          <div className="relative group shrink-0 w-24 h-24">
            {e?.avatar_url ? (
              <img 
                src={e.avatar_url} 
                alt={e.name} 
                className="w-24 h-24 rounded-full object-cover border border-border shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-3xl border border-primary/20">
                {e?.name ? e.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "EE"}
              </div>
            )}
            
            <label className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white text-[10px] font-bold rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-center px-1">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin mb-1" />
              ) : (
                <Camera className="w-4 h-4 mb-1" />
              )}
              <span>{uploading ? "Uploading..." : "Change Photo"}</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleAvatarUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 flex-1 w-full text-left">
            <Row label={t("profile_emp_id")} value={e?.employee_code} />
            <Row label={t("profile_name")} value={e?.name} />
            <Row label={t("profile_email")} value={e?.email} />
            <Row label={t("profile_mobile")} value={e?.mobile} />
            <Row label={t("profile_designation")} value={e?.designation} />
            <Row label={t("profile_gender")} value={genderLabel} />
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-6">
          <div className="text-sm font-semibold">{t("profile_language")}</div>
          <div className="text-xs text-muted-foreground mt-0.5">{t("profile_language_desc")}</div>
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              variant={lang === "en" ? "default" : "outline"}
              onClick={() => setLang("en")}
            >
              English
            </Button>
            <Button
              size="sm"
              variant={lang === "hi" ? "default" : "outline"}
              onClick={() => setLang("hi")}
            >
              हिन्दी (Hindi)
            </Button>
          </div>
        </div>
      </div>
    </EmployeeShell>
  );
}

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="min-w-0">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm break-all sm:break-normal">{value ?? "—"}</div>
    </div>
  );
}
