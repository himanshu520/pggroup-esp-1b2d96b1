import type { Database } from "@/integrations/supabase/types";

export type SuggestionStatus = Database["public"]["Enums"]["suggestion_status"];

export type AppRole = Database["public"]["Enums"]["app_role"];

export const STATUS_LABEL: Record<SuggestionStatus, string> = {
  submitted: "Submitted",
  pe_review: "PE Review",
  transferred: "Transferred",
  dept_review: "Department Review",
  approved: "Approved",
  evaluation: "Evaluation",
  implementation: "Implementation",
  evidence_pending: "Evidence Pending",
  evidence_submitted: "Evidence Submitted",
  pe_verification: "PE Verification",
  implemented: "Implemented",
  rejected: "Rejected",
  fake_closure: "Fake Closure",
  reopened: "Reopened",
  closed: "Closed",
};

// Tailwind classes mapped to semantic tokens (no raw colors)
export const STATUS_STYLES: Record<SuggestionStatus, string> = {
  submitted: "bg-muted text-muted-foreground border-border",
  pe_review: "bg-info/10 text-info border-info/30",
  transferred: "bg-info/10 text-info border-info/30",
  dept_review: "bg-info/10 text-info border-info/30",
  approved: "bg-success/10 text-success border-success/30",
  evaluation: "bg-warning/10 text-warning border-warning/30",
  implementation: "bg-warning/10 text-warning border-warning/30",
  evidence_pending: "bg-warning/10 text-warning border-warning/30",
  evidence_submitted: "bg-info/10 text-info border-info/30",
  pe_verification: "bg-info/10 text-info border-info/30",
  implemented: "bg-success/10 text-success border-success/30",
  rejected: "bg-destructive/10 text-destructive border-destructive/30",
  fake_closure: "bg-destructive/10 text-destructive border-destructive/30",
  reopened: "bg-warning/10 text-warning border-warning/30",
  closed: "bg-success/10 text-success border-success/30",
};

export function getRowColorForStatus(status: SuggestionStatus): string {
  switch (status) {
    case "implemented":
    case "approved":
    case "closed":
      return "bg-success/10 hover:bg-success/20";
    case "rejected":
    case "fake_closure":
      return "bg-destructive/10 hover:bg-destructive/20";
    case "evaluation":
    case "implementation":
    case "evidence_pending":
    case "reopened":
      return "bg-warning/10 hover:bg-warning/20";
    case "pe_review":
    case "dept_review":
    case "transferred":
    case "evidence_submitted":
    case "pe_verification":
      return "bg-info/10 hover:bg-info/20";
    default:
      return "hover:bg-muted/30"; // default for submitted etc.
  }
}



export const ROLE_LABEL: Record<AppRole, string> = {
  super_admin: "Super Admin",
  corporate_admin: "Corporate Admin",
  location_admin: "Location Admin",
  plant_admin: "Plant Admin",
  department_admin: "Department Admin",
  pe_user: "PE Department",
  dept_user: "Department User",
  mgmt_viewer: "Management (Viewer)",
  employee: "Employee",
};

export const ADMIN_ROLES: AppRole[] = [
  "super_admin","corporate_admin","location_admin","plant_admin",
  "department_admin","pe_user","dept_user","mgmt_viewer",
];

export function isAdminRole(r: AppRole) {
  return ADMIN_ROLES.includes(r);
}
