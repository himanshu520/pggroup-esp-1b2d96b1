// Server-only notification helpers. Uses the service-role client so we can
// insert notification rows for users other than the caller (RLS on the
// notifications table restricts each user to their own rows).

export type NotificationEventType =
  | "submit"
  | "transfer"
  | "approve"
  | "reject"
  | "evidence"
  | "verification";

type Row = {
  user_id: string;
  title: string;
  body?: string | null;
  link?: string | null;
  event_type: NotificationEventType;
  suggestion_id?: string | null;
};

async function getAdmin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

async function resolveSubmitterUserId(admin: any, suggestion_id: string): Promise<string | null> {
  const { data: sug } = await admin
    .from("suggestions")
    .select("employee_id, employees(user_id)")
    .eq("id", suggestion_id)
    .maybeSingle();
  return (sug?.employees?.user_id as string | undefined) ?? null;
}

async function resolveRoleUserIds(
  admin: any,
  role: "pe_user" | "department_admin" | "plant_admin" | "location_admin" | "corporate_admin" | "super_admin",
  scope: { plant_id?: string | null; department_id?: string | null; location_id?: string | null } = {},
): Promise<string[]> {
  const { data } = await admin.from("user_roles").select("user_id, plant_id, department_id, location_id").eq("role", role);
  const rows = (data ?? []) as Array<{ user_id: string; plant_id: string | null; department_id: string | null; location_id: string | null }>;
  return rows
    .filter((r) => {
      if (role === "department_admin" && scope.department_id) return !r.department_id || r.department_id === scope.department_id;
      if (role === "plant_admin" && scope.plant_id) return !r.plant_id || r.plant_id === scope.plant_id;
      if (role === "location_admin" && scope.location_id) return !r.location_id || r.location_id === scope.location_id;
      if (role === "pe_user" && scope.plant_id) return !r.plant_id || r.plant_id === scope.plant_id;
      return true;
    })
    .map((r) => r.user_id);
}

// Fetch per-user (in_app, email) preferences for the given event. Users with
// no explicit row are treated as fully opted-in (both channels enabled).
async function fetchPrefs(
  admin: any,
  userIds: string[],
  event_type: NotificationEventType,
): Promise<Map<string, { in_app: boolean; email: boolean }>> {
  const map = new Map<string, { in_app: boolean; email: boolean }>();
  if (userIds.length === 0) return map;
  const { data } = await admin
    .from("notification_preferences")
    .select("user_id, in_app, email")
    .eq("event_type", event_type)
    .in("user_id", userIds);
  for (const uid of userIds) map.set(uid, { in_app: true, email: true });
  for (const row of (data ?? []) as any[]) {
    map.set(row.user_id, { in_app: !!row.in_app, email: !!row.email });
  }
  return map;
}

export async function notifyForSuggestion(opts: {
  suggestion_id: string;
  title: string;
  body?: string;
  event_type: NotificationEventType;
  audience: Array<"submitter" | "pe" | "current_dept" | "target_dept" | "super_admin">;
  target_department_id?: string | null;
}) {
  const admin = await getAdmin();
  const { data: sug } = await admin
    .from("suggestions")
    .select("id, code, plant_id, current_department_id, department_id, employee_id, employees(user_id)")
    .eq("id", opts.suggestion_id)
    .maybeSingle();
  if (!sug) return;

  // Deep-link into the exact workflow screen for this record. Admins land on
  // the suggestion detail; the submitter lands on their track view.
  const adminLink = `/admin/suggestions/${sug.id}`;
  const employeeLink = `/employee?section=track&code=${sug.code}`;
  const userIds = new Set<string>();
  const submitterId = (sug as any).employees?.user_id as string | undefined;

  const staged: Row[] = [];
  const pushFor = (uid: string, useEmployeeLink = false) => {
    if (!uid || userIds.has(uid)) return;
    userIds.add(uid);
    staged.push({
      user_id: uid,
      title: opts.title,
      body: opts.body ?? null,
      link: useEmployeeLink ? employeeLink : adminLink,
      event_type: opts.event_type,
      suggestion_id: opts.suggestion_id,
    });
  };

  for (const aud of opts.audience) {
    if (aud === "submitter" && submitterId) {
      pushFor(submitterId, true);
    } else if (aud === "pe") {
      const ids = await resolveRoleUserIds(admin, "pe_user", { plant_id: sug.plant_id });
      ids.forEach((id) => pushFor(id));
    } else if (aud === "current_dept") {
      const ids = await resolveRoleUserIds(admin, "department_admin", { department_id: sug.current_department_id ?? sug.department_id });
      ids.forEach((id) => pushFor(id));
    } else if (aud === "target_dept" && opts.target_department_id) {
      const ids = await resolveRoleUserIds(admin, "department_admin", { department_id: opts.target_department_id });
      ids.forEach((id) => pushFor(id));
    } else if (aud === "super_admin") {
      const ids = await resolveRoleUserIds(admin, "super_admin");
      ids.forEach((id) => pushFor(id));
    }
  }

  if (staged.length === 0) return;

  // Fetch per-user preferences once and split channels.
  const prefs = await fetchPrefs(admin, staged.map((r) => r.user_id), opts.event_type);
  const inAppRows = staged.filter((r) => prefs.get(r.user_id)?.in_app !== false);
  if (inAppRows.length > 0) {
    await admin.from("notifications").insert(inAppRows);
  }

  // Email delivery — resolve each user's email (employees table first, then
  // auth.users) and fire the SMTP edge function. Fire-and-forget: an email
  // failure must never break workflow writes.
  const emailUserIds = staged.filter((r) => prefs.get(r.user_id)?.email !== false).map((r) => r.user_id);
  if (emailUserIds.length > 0) {
    try {
      await sendEmailsToUsers(admin, emailUserIds, {
        title: opts.title,
        body: opts.body ?? null,
        subject: `[PG Portal] ${opts.title}${(sug as any).code ? ` · ${(sug as any).code}` : ""}`,
        code: (sug as any).code ?? null,
        // Emails always deep-link the employee track view for submitters and
        // the admin detail view for everyone else. Use the submitter's link
        // only when the recipient is the submitter.
        linkFor: (uid) => (uid === submitterId ? employeeLink : adminLink),
      });
    } catch (e) {
      console.error("notifyForSuggestion: email dispatch failed", e);
    }
  }
}

async function sendEmailsToUsers(
  admin: any,
  userIds: string[],
  opts: { title: string; body: string | null; subject: string; code: string | null; linkFor: (uid: string) => string },
) {
  const unique = Array.from(new Set(userIds));

  // Prefer employees.email; fall back to auth.users email for admins without an
  // employee row.
  const { data: emps } = await admin
    .from("employees")
    .select("user_id, email")
    .in("user_id", unique);
  const emailByUser = new Map<string, string>();
  for (const e of (emps ?? []) as Array<{ user_id: string; email: string }>) {
    if (e.user_id && e.email) emailByUser.set(e.user_id, e.email);
  }
  const missing = unique.filter((u) => !emailByUser.has(u));
  for (const uid of missing) {
    try {
      const { data } = await admin.auth.admin.getUserById(uid);
      const em = data?.user?.email;
      if (em) emailByUser.set(uid, em);
    } catch {
      // ignore
    }
  }

  const nodemailer = await import("nodemailer").then((m) => m.default ?? m);

  const host = process.env.SMTP_HOST ?? "smtp.office365.com";
  const port = Number(process.env.SMTP_PORT ?? "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const appUrl = process.env.APP_URL ?? "";

  if (!user || !pass) {
    console.warn("SMTP credentials (SMTP_USER and SMTP_PASS) are not configured for notifications");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: { user, pass },
  });

  const recipients = unique.filter((uid) => emailByUser.has(uid));
  if (recipients.length === 0) return;

  await Promise.allSettled(
    recipients.map(async (uid) => {
      const email = emailByUser.get(uid)!;
      const link = opts.linkFor(uid);
      const fullLink = link ? (link.startsWith("http") ? link : `${appUrl}${link}`) : "";

      const html = `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#ffffff;color:#0f172a">
          <h2 style="color:#1e293b;margin:0 0 8px">PG Suggestion Portal</h2>
          <p style="color:#475569;margin:0 0 20px">Suggestion Management System</p>
          <h3 style="margin:0 0 12px;color:#0f172a">${opts.title}</h3>
          ${opts.body ? `<p style="color:#334155;line-height:1.5">${opts.body}</p>` : ""}
          ${opts.code ? `<p style="color:#64748b;font-size:13px">Reference: <strong>${opts.code}</strong></p>` : ""}
          ${fullLink ? `<p style="margin:20px 0"><a href="${fullLink}" style="background:#1d4ed8;color:#fff;padding:10px 18px;border-radius:6px;text-decoration:none;display:inline-block">Open in portal</a></p>` : ""}
          <p style="color:#94a3b8;font-size:12px;margin-top:24px">You are receiving this because notifications are enabled for your account. Manage preferences in the portal.</p>
        </div>`;

      return transporter.sendMail({
        from: `"PG Suggestion Portal" <${user}>`,
        to: email,
        subject: opts.subject,
        text: `${opts.title}${opts.body ? `\n\n${opts.body}` : ""}${fullLink ? `\n\n${fullLink}` : ""}`,
        html,
      });
    }),
  );
}

export { resolveSubmitterUserId };
