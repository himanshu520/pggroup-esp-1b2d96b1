import { createFileRoute, redirect } from "@tanstack/react-router";
import { EmployeeShell, PageHeader } from "@/components/employee-shell";
import { useSession } from "@/lib/session";
import { useLang, useT } from "@/lib/i18n";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/employee/profile")({
  beforeLoad: () => { throw redirect({ to: "/employee", search: { section: "profile" } as any }); },
  component: () => null,
});

export function ProfilePage() {
  const { data: s } = useSession();
  const e = s?.employee;
  const t = useT();
  const { lang, setLang } = useLang();

  const genderLabel = e?.gender ? t(`gender_${e.gender}`) : null;

  return (
    <EmployeeShell>
      <PageHeader title={t("profile_title")} description={t("profile_desc")} />
      <div className="grid gap-4 max-w-2xl">
        <div className="rounded-lg border border-border bg-card p-6 grid md:grid-cols-2 gap-4">
          <Row label={t("profile_emp_id")} value={e?.employee_code} />
          <Row label={t("profile_name")} value={e?.name} />
          <Row label={t("profile_email")} value={e?.email} />
          <Row label={t("profile_mobile")} value={e?.mobile} />
          <Row label={t("profile_designation")} value={e?.designation} />
          <Row label={t("profile_gender")} value={genderLabel} />
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
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-sm">{value ?? "—"}</div>
    </div>
  );
}
