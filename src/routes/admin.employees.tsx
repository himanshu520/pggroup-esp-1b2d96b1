import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMemo, useState, useRef } from "react";
import { AppShell, PageHeader } from "@/components/app-shell";
import { ADMIN_NAV } from "@/lib/admin-nav";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";
import { useCanManage, useCanManageEmployees } from "@/lib/session";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  listEmployeesAdmin,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  restoreEmployee,
  setEmployeeActive,
  bulkCreateEmployees,
} from "@/lib/user-admin.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Search, Plus, Pencil, Trash2, Power, PowerOff, Users, Undo2, FileSpreadsheet, Download, Upload, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { ExportMenu } from "@/components/export-menu";
import * as XLSX from "xlsx";

export const Route = createFileRoute("/admin/employees")({
  beforeLoad: () => { throw redirect({ to: "/admin", search: { section: "employees" } as any }); },
  component: () => null,
});

type Gender = "male" | "female" | "other" | "prefer_not_to_say";

const GENDER_LABEL: Record<Gender, string> = {
  male: "Male",
  female: "Female",
  other: "Other",
  prefer_not_to_say: "Prefer not to say",
};

type Emp = {
  id: string;
  user_id: string | null;
  name: string;
  email: string;
  employee_code: string;
  designation: string | null;
  mobile: string | null;
  gender: Gender | null;
  active: boolean;
  deleted_at: string | null;
  location_id: string | null;
  plant_id: string | null;
  department_id: string | null;
  locations?: { location: string } | null;
  plants?: { name: string } | null;
  departments?: { name: string } | null;
};

type Form = {
  id?: string;
  name: string;
  email: string;
  employee_code: string;
  designation: string;
  mobile: string;
  gender: "" | Gender;
  location_id: string;
  plant_id: string;
  department_id: string;
  active: boolean;
};

const EMPTY: Form = {
  name: "",
  email: "",
  employee_code: "",
  designation: "",
  mobile: "",
  gender: "",
  location_id: "",
  plant_id: "",
  department_id: "",
  active: true,
};

export function EmployeesPage() {
  const qc = useQueryClient();
  const canManage = useCanManage(); // super_admin & corporate_admin ONLY (can delete & restore)
  const canManageEmployees = useCanManageEmployees(); // super_admin, corporate_admin & HR (can add, edit, upload excel)

  const listFn = useServerFn(listEmployeesAdmin);
  const createFn = useServerFn(createEmployee);
  const updateFn = useServerFn(updateEmployee);
  const deleteFn = useServerFn(deleteEmployee);
  const restoreFn = useServerFn(restoreEmployee);
  const toggleFn = useServerFn(setEmployeeActive);
  const bulkCreateFn = useServerFn(bulkCreateEmployees);

  const [showDeleted, setShowDeleted] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Emp | null>(null);

  // Excel Modal States
  const [excelModalOpen, setExcelModalOpen] = useState(false);
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [parsing, setParsing] = useState(false);
  const [importResult, setImportResult] = useState<{ successCount: number; skippedCount: number; errors: any[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: rows = [], isLoading } = useQuery({
    queryKey: ["admin-employees", showDeleted],
    queryFn: () => listFn({ data: { showDeleted } }),
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["loc-all-emp"],
    queryFn: async () => (await supabase.from("locations").select("id,location").is("deleted_at", null).order("location")).data ?? [],
  });
  const { data: plants = [] } = useQuery({
    queryKey: ["plants-all-emp"],
    queryFn: async () => (await supabase.from("plants").select("id,name,location_id").is("deleted_at", null).order("name")).data ?? [],
  });
  const { data: departments = [] } = useQuery({
    queryKey: ["depts-all-emp"],
    queryFn: async () => (await supabase.from("departments").select("id,name,plant_id").is("deleted_at", null).order("name")).data ?? [],
  });

  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const editing = !!form.id;

  const filtered = useMemo(() => {
    const list = rows as Emp[];
    if (!q) return list;
    const s = q.toLowerCase();
    return list.filter((e) =>
      `${e.name} ${e.email} ${e.employee_code} ${e.designation ?? ""}`.toLowerCase().includes(s),
    );
  }, [rows, q]);

  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin-employees"] });

  const save = useMutation({
    mutationFn: async (v: Form) => {
      const payload = {
        name: v.name,
        email: v.email,
        employee_code: v.employee_code,
        designation: v.designation || null,
        mobile: v.mobile || null,
        gender: v.gender || null,
        location_id: v.location_id || null,
        plant_id: v.plant_id || null,
        department_id: v.department_id || null,
        active: v.active,
      };
      if (v.id) return updateFn({ data: { id: v.id, ...payload } });
      return createFn({ data: payload });
    },
    onSuccess: () => {
      toast.success(editing ? "Employee updated." : "Employee added.");
      setOpen(false);
      setForm(EMPTY);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: (r) => {
      if (r?.softDeleted && r.reason) toast.warning(r.reason);
      else toast.success("Employee moved to Trash.");
      setPendingDelete(null);
      invalidate();
    },
    onError: (e: Error) => { toast.error(e.message); setPendingDelete(null); },
  });

  const restore = useMutation({
    mutationFn: (id: string) => restoreFn({ data: { id } }),
    onSuccess: () => { toast.success("Employee restored."); invalidate(); },
    onError: (e: Error) => toast.error(e.message),
  });

  const toggle = useMutation({
    mutationFn: (v: { employee_id: string; active: boolean }) => toggleFn({ data: v }),
    onSuccess: () => {
      toast.success("Status updated.");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const bulkSave = useMutation({
    mutationFn: async (employees: any[]) => bulkCreateFn({ data: { employees } }),
    onSuccess: (res) => {
      setImportResult(res);
      if (res.successCount > 0) {
        toast.success(`Successfully imported ${res.successCount} employee(s).`);
        invalidate();
      }
      if (res.skippedCount > 0) {
        toast.warning(`${res.skippedCount} employee(s) skipped due to duplicate code or email.`);
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const exportRows = filtered.map((e) => ({
    employee_code: e.employee_code,
    name: e.name,
    email: e.email,
    designation: e.designation ?? "",
    mobile: e.mobile ?? "",
    gender: e.gender ? GENDER_LABEL[e.gender] : "",
    location: e.locations?.location ?? "",
    plant: e.plants?.name ?? "",
    department: e.departments?.name ?? "",
    active: e.active ? "Yes" : "No",
    linked_user: e.user_id ? "Yes" : "No",
  }));

  function downloadExcelTemplate() {
    const templateData = [
      {
        "Employee ID": "EMP001",
        "Full Name": "Rahul Sharma",
        "Email": "rahul.sharma@example.com",
        "Designation": "Senior Engineer",
        "Mobile": "9876543210",
        "Gender": "Male",
        "Location": "Delhi",
        "Plant": "Main Plant",
        "Department": "Production",
      },
      {
        "Employee ID": "EMP002",
        "Full Name": "Priya Singh",
        "Email": "priya.singh@example.com",
        "Designation": "HR Manager",
        "Mobile": "9876543211",
        "Gender": "Female",
        "Location": "Mumbai",
        "Plant": "Unit 2",
        "Department": "HR",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    ws["!cols"] = [
      { wch: 15 },
      { wch: 22 },
      { wch: 28 },
      { wch: 20 },
      { wch: 15 },
      { wch: 12 },
      { wch: 18 },
      { wch: 18 },
      { wch: 20 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Employees Template");
    XLSX.writeFile(wb, "employee_import_template.xlsx");
    toast.success("Excel template downloaded successfully.");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setExcelFile(file);
    setParsing(true);
    setImportResult(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.SheetNames[0];
        const json: any[] = XLSX.utils.sheet_to_json(workbook.Sheets[firstSheet], { defval: "" });

        if (!json || json.length === 0) {
          toast.error("The selected Excel file is empty.");
          setParsedRows([]);
          setParsing(false);
          return;
        }

        // Map flexible header names
        const mapped = json
          .map((row: any) => {
            const findVal = (...keys: string[]) => {
              for (const k of Object.keys(row)) {
                const cleanKey = k.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
                if (keys.some((target) => cleanKey === target.toLowerCase().replace(/[^a-z0-9]/g, ""))) {
                  return String(row[k]).trim();
                }
              }
              return "";
            };

            const code = findVal("Employee ID", "Employee Code", "employee_code", "empcode", "code", "id");
            const name = findVal("Full Name", "Name", "name", "employee_name");
            const email = findVal("Email", "Email Address", "email");
            const designation = findVal("Designation", "Role", "designation", "title");
            const mobile = findVal("Mobile", "Mobile Number", "Phone", "phone", "mobile");
            const genderStr = findVal("Gender", "Sex", "gender", "sex", "Gender/Sex", "Sex/Gender").trim().toLowerCase();
            let gender: Gender | null = null;
            if (["male", "m", "man", "boy", "purush", "पुरुष"].includes(genderStr)) gender = "male";
            else if (["female", "f", "woman", "girl", "mahila", "महिला"].includes(genderStr)) gender = "female";
            else if (["other", "o", "anya"].includes(genderStr)) gender = "other";
            else if (["prefer_not_to_say", "prefer not to say", "prefer_not", "n/a", "na", "not specified"].includes(genderStr)) gender = "prefer_not_to_say";

            const location = findVal("Location", "Location Name", "location");
            const plant = findVal("Plant", "Plant Name", "plant");
            const department = findVal("Department", "Department Name", "dept", "department");

            return {
              employee_code: code,
              name: name,
              email: email,
              designation: designation || null,
              mobile: mobile || null,
              gender: gender,
              location: location || null,
              plant: plant || null,
              department: department || null,
              active: true,
            };
          })
          .filter((r) => r.employee_code || r.name || r.email);

        if (mapped.length === 0) {
          toast.error("Could not find valid employee rows in file. Please check column headers.");
        }
        setParsedRows(mapped);
      } catch (err: any) {
        toast.error("Failed to parse Excel file: " + err.message);
        setParsedRows([]);
      } finally {
        setParsing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  function openAdd() {
    setForm(EMPTY);
    setOpen(true);
  }
  function openEdit(e: Emp) {
    setForm({
      id: e.id,
      name: e.name,
      email: e.email,
      employee_code: e.employee_code,
      designation: e.designation ?? "",
      mobile: e.mobile ?? "",
      gender: e.gender ?? "",
      location_id: e.location_id ?? "",
      plant_id: e.plant_id ?? "",
      department_id: e.department_id ?? "",
      active: e.active,
    });
    setOpen(true);
  }

  const filteredPlants = form.location_id ? plants.filter((p) => p.location_id === form.location_id) : plants;
  const filteredDepts = form.plant_id ? departments.filter((d) => d.plant_id === form.plant_id) : departments;

  return (
    <AppShell navGroups={ADMIN_NAV} title="Admin Console">
      <PageHeader
        title="Employees"
        description="Add, edit, deactivate, and import employees. Employees created here can be linked to a sign-in user from Users & Roles."
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <ExportMenu
              data={exportRows}
              columns={[
                { key: "employee_code", header: "Employee ID" },
                { key: "name", header: "Name" },
                { key: "email", header: "Email" },
                { key: "designation", header: "Designation" },
                { key: "mobile", header: "Mobile" },
                { key: "location", header: "Location" },
                { key: "plant", header: "Plant" },
                { key: "department", header: "Department" },
                { key: "active", header: "Active" },
                { key: "linked_user", header: "Has user account" },
              ]}
              filename="employees"
              title="Employees"
            />
            {canManageEmployees && (
              <>
                <Button size="sm" variant="outline" onClick={downloadExcelTemplate} title="Download sample Excel template">
                  <Download className="w-4 h-4 mr-1.5" />
                  Template
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setExcelModalOpen(true);
                    setParsedRows([]);
                    setImportResult(null);
                    setExcelFile(null);
                  }}
                  title="Bulk upload employees via Excel file"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                  Upload Excel
                </Button>
                <Button size="sm" onClick={openAdd}>
                  <Plus className="w-4 h-4 mr-1.5" />
                  Add employee
                </Button>
              </>
            )}
          </div>
        }
      />

      <div className="flex items-center gap-2 mb-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-2.5 top-2.5 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, or employee ID"
            className="pl-8"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {canManage && (
          <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
            <Switch checked={showDeleted} onCheckedChange={setShowDeleted} />
            Show Trash
          </label>
        )}
        <div className="text-xs text-muted-foreground ml-auto">
          {filtered.length} employee{filtered.length === 1 ? "" : "s"}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              {["Employee", "Contact", "Scope", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                  Loading employees…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-sm text-muted-foreground">
                  No employees found.
                </td>
              </tr>
            ) : (
              filtered.map((e) => (
                <tr key={e.id} className={"hover:bg-muted/30 " + (e.deleted_at ? "opacity-50" : e.active ? "" : "opacity-60")}>
                  <td className="px-4 py-3 align-top">
                    <div className="text-sm font-medium">{e.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {e.employee_code}
                      {e.designation ? ` · ${e.designation}` : ""}
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="text-xs">{e.email}</div>
                    {e.mobile && <div className="text-xs text-muted-foreground">{e.mobile}</div>}
                  </td>
                  <td className="px-4 py-3 align-top text-xs">
                    {[e.locations?.location, e.plants?.name, e.departments?.name].filter(Boolean).join(" › ") || (
                      <span className="text-muted-foreground italic">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    {e.deleted_at ? (
                      <Badge variant="destructive" className="text-[10px]">In Trash</Badge>
                    ) : e.active ? (
                      <Badge variant="secondary" className="text-[10px]">Active</Badge>
                    ) : (
                      <Badge variant="destructive" className="text-[10px]">Inactive</Badge>
                    )}
                    {e.user_id && (
                      <Badge variant="outline" className="text-[10px] ml-1">
                        <Users className="w-3 h-3 mr-0.5" />
                        User linked
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-1">
                      {!canManageEmployees ? (
                        <span className="text-[11px] text-muted-foreground">View only</span>
                      ) : e.deleted_at ? (
                        canManage ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => restore.mutate(e.id)}
                            title="Restore"
                            disabled={restore.isPending}
                          >
                            <Undo2 className="w-3.5 h-3.5" /> Restore
                          </Button>
                        ) : (
                          <span className="text-[11px] text-muted-foreground">In Trash</span>
                        )
                      ) : (
                        <>
                          <Button size="sm" variant="ghost" onClick={() => openEdit(e)} title="Edit">
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toggle.mutate({ employee_id: e.id, active: !e.active })}
                            title={e.active ? "Deactivate" : "Reactivate"}
                            disabled={toggle.isPending}
                          >
                            {e.active ? (
                              <PowerOff className="w-3.5 h-3.5 text-destructive" />
                            ) : (
                              <Power className="w-3.5 h-3.5 text-success" />
                            )}
                          </Button>
                          {canManage && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setPendingDelete(e)}
                              title="Move to Trash"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-destructive" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(o) => !o && setPendingDelete(null)}
        title="Move employee to Trash?"
        description={
          pendingDelete
            ? `"${pendingDelete.name}" (${pendingDelete.employee_code}) will be deactivated and moved to Trash. You can restore them anytime from the Show Trash view. This action is audit-logged.`
            : ""
        }
        confirmLabel="Move to Trash"
        destructive
        loading={del.isPending}
        onConfirm={() => { if (pendingDelete) del.mutate(pendingDelete.id); }}
      />

      {/* Excel Upload Modal */}
      <Dialog
        open={excelModalOpen}
        onOpenChange={(v) => {
          if (!v) {
            setExcelModalOpen(false);
            setExcelFile(null);
            setParsedRows([]);
            setImportResult(null);
          }
        }}
      >
        <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-primary" />
              Upload Employees via Excel
            </DialogTitle>
            <DialogDescription>
              Upload an Excel (.xlsx, .xls) or CSV file containing employee records to import them into the database.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 flex-1 overflow-y-auto">
            <div className="flex items-center justify-between gap-4 p-4 border border-dashed border-border rounded-lg bg-muted/20">
              <div className="flex items-center gap-3">
                <Upload className="w-6 h-6 text-muted-foreground shrink-0" />
                <div>
                  <div className="text-sm font-medium">Select Excel File</div>
                  <div className="text-xs text-muted-foreground">Supported formats: .xlsx, .xls, .csv</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>
                  Browse File
                </Button>
                <Button size="sm" variant="ghost" onClick={downloadExcelTemplate} title="Download Template">
                  <Download className="w-4 h-4 mr-1" />
                  Template
                </Button>
              </div>
            </div>

            {excelFile && (
              <div className="text-xs text-muted-foreground flex items-center justify-between px-1">
                <span>File: <strong>{excelFile.name}</strong> ({(excelFile.size / 1024).toFixed(1)} KB)</span>
                {parsing && (
                  <span className="flex items-center gap-1 text-primary">
                    <Loader2 className="w-3 h-3 animate-spin" /> Parsing file…
                  </span>
                )}
              </div>
            )}

            {importResult && (
              <div className="space-y-2 p-3 rounded-lg border bg-card text-xs">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  Import Summary: {importResult.successCount} imported successfully, {importResult.skippedCount} skipped.
                </div>
                {importResult.errors.length > 0 && (
                  <div className="mt-2 space-y-1 max-h-32 overflow-y-auto text-destructive border-t pt-2">
                    <div className="font-semibold flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Errors / Skipped Rows:
                    </div>
                    {importResult.errors.map((err, idx) => (
                      <div key={idx} className="pl-4">
                        Row {err.index} ({err.code || err.name || "N/A"}): {err.error}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {parsedRows.length > 0 && !importResult && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground flex items-center justify-between">
                  <span>Parsed Records ({parsedRows.length})</span>
                  <span className="text-muted-foreground font-normal">Review before importing</span>
                </div>
                <div className="border rounded-md overflow-x-auto max-h-60 text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-muted sticky top-0 border-b">
                      <tr>
                        <th className="px-3 py-2">Emp ID</th>
                        <th className="px-3 py-2">Name</th>
                        <th className="px-3 py-2">Email</th>
                        <th className="px-3 py-2">Designation</th>
                        <th className="px-3 py-2">Location</th>
                        <th className="px-3 py-2">Plant</th>
                        <th className="px-3 py-2">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {parsedRows.map((r, idx) => (
                        <tr key={idx} className="hover:bg-muted/30">
                          <td className="px-3 py-1.5 font-medium">{r.employee_code || "—"}</td>
                          <td className="px-3 py-1.5">{r.name || "—"}</td>
                          <td className="px-3 py-1.5 text-muted-foreground">{r.email || "—"}</td>
                          <td className="px-3 py-1.5">{r.designation || "—"}</td>
                          <td className="px-3 py-1.5">{r.location || "—"}</td>
                          <td className="px-3 py-1.5">{r.plant || "—"}</td>
                          <td className="px-3 py-1.5">{r.department || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => {
                setExcelModalOpen(false);
                setExcelFile(null);
                setParsedRows([]);
                setImportResult(null);
              }}
              disabled={bulkSave.isPending}
            >
              Close
            </Button>
            {parsedRows.length > 0 && !importResult && (
              <Button
                onClick={() => bulkSave.mutate(parsedRows)}
                disabled={bulkSave.isPending || parsing}
              >
                {bulkSave.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing…
                  </>
                ) : (
                  `Import ${parsedRows.length} Employee(s)`
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manual Add / Edit Employee Dialog */}
      <Dialog open={open} onOpenChange={(v) => { if (!v) { setOpen(false); setForm(EMPTY); } }}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit employee" : "Add employee"}</DialogTitle>
            <DialogDescription>
              Employee records store organizational identity. To grant sign-in access, invite the user in Users & Roles using the same email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-2">
            <Field label="Employee ID *">
              <Input value={form.employee_code} onChange={(e) => setForm({ ...form, employee_code: e.target.value })} />
            </Field>
            <Field label="Full name *">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Field>
            <Field label="Email *">
              <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </Field>
            <Field label="Mobile">
              <Input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
            </Field>
            <Field label="Designation">
              <Input value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
            </Field>
            <Field label="Gender">
              <Select
                value={form.gender || undefined}
                onValueChange={(v) => setForm({ ...form, gender: v as Gender })}
              >
                <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(GENDER_LABEL) as Gender[]).map((g) => (
                    <SelectItem key={g} value={g}>{GENDER_LABEL[g]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Location">
              <Select
                value={form.location_id}
                onValueChange={(v) => setForm({ ...form, location_id: v, plant_id: "", department_id: "" })}
              >
                <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {locations.map((l) => <SelectItem key={l.id} value={l.id}>{l.location}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Plant">
              <Select
                value={form.plant_id}
                onValueChange={(v) => setForm({ ...form, plant_id: v, department_id: "" })}
              >
                <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {filteredPlants.map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Department">
              <Select
                value={form.department_id}
                onValueChange={(v) => setForm({ ...form, department_id: v })}
              >
                <SelectTrigger className="h-9"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {filteredDepts.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </Field>
            <div className="col-span-2 flex items-center gap-2 pt-1">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label className="text-xs">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setOpen(false); setForm(EMPTY); }} disabled={save.isPending}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (!form.name.trim() || !form.email.trim() || !form.employee_code.trim())
                  return toast.error("Name, email and employee ID are required.");
                save.mutate(form);
              }}
              disabled={save.isPending}
            >
              {save.isPending ? "Saving…" : editing ? "Save changes" : "Add employee"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      {children}
    </div>
  );
}
