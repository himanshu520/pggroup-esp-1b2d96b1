export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      attachments: {
        Row: {
          content_type: string | null
          created_at: string
          evidence_id: string | null
          file_name: string
          file_path: string
          id: string
          kind: string
          suggestion_id: string
          uploaded_by: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string
          evidence_id?: string | null
          file_name: string
          file_path: string
          id?: string
          kind?: string
          suggestion_id: string
          uploaded_by?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string
          evidence_id?: string | null
          file_name?: string
          file_path?: string
          id?: string
          kind?: string
          suggestion_id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attachments_evidence_id_fkey"
            columns: ["evidence_id"]
            isOneToOne: false
            referencedRelation: "evidence"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string
          entity_id: string | null
          entity_type: string | null
          id: string
          meta: Json | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          meta?: Json | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          meta?: Json | null
        }
        Relationships: []
      }
      categories: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          sort_order?: number
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      departments: {
        Row: {
          active: boolean
          code: string
          created_at: string
          deleted_at: string | null
          id: string
          is_pe: boolean
          name: string
          plant_id: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_pe?: boolean
          name: string
          plant_id: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          is_pe?: boolean
          name?: string
          plant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          active: boolean
          created_at: string
          date_of_joining: string | null
          deleted_at: string | null
          department_id: string | null
          designation: string | null
          email: string
          employee_code: string
          gender: string | null
          id: string
          location_id: string | null
          mobile: string | null
          name: string
          plant_id: string | null
          reporting_manager: string | null
          user_id: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          date_of_joining?: string | null
          deleted_at?: string | null
          department_id?: string | null
          designation?: string | null
          email: string
          employee_code: string
          gender?: string | null
          id?: string
          location_id?: string | null
          mobile?: string | null
          name: string
          plant_id?: string | null
          reporting_manager?: string | null
          user_id?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          date_of_joining?: string | null
          deleted_at?: string | null
          department_id?: string | null
          designation?: string | null
          email?: string
          employee_code?: string
          gender?: string | null
          id?: string
          location_id?: string | null
          mobile?: string | null
          name?: string
          plant_id?: string | null
          reporting_manager?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          actual_cost: number | null
          benefits_achieved: string | null
          completion_date: string | null
          created_at: string
          id: string
          remarks: string | null
          submitted_by: string | null
          suggestion_id: string
          version: number
        }
        Insert: {
          actual_cost?: number | null
          benefits_achieved?: string | null
          completion_date?: string | null
          created_at?: string
          id?: string
          remarks?: string | null
          submitted_by?: string | null
          suggestion_id: string
          version?: number
        }
        Update: {
          actual_cost?: number | null
          benefits_achieved?: string | null
          completion_date?: string | null
          created_at?: string
          id?: string
          remarks?: string | null
          submitted_by?: string | null
          suggestion_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "evidence_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          active: boolean
          created_at: string
          deleted_at: string | null
          id: string
          location: string
          state: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          deleted_at?: string | null
          id?: string
          location: string
          state: string
        }
        Update: {
          active?: boolean
          created_at?: string
          deleted_at?: string | null
          id?: string
          location?: string
          state?: string
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          created_at: string
          email: boolean
          event_type: string
          id: string
          in_app: boolean
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: boolean
          event_type: string
          id?: string
          in_app?: boolean
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: boolean
          event_type?: string
          id?: string
          in_app?: boolean
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          event_type: string | null
          id: string
          link: string | null
          read: boolean
          suggestion_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          event_type?: string | null
          id?: string
          link?: string | null
          read?: boolean
          suggestion_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          event_type?: string | null
          id?: string
          link?: string | null
          read?: boolean
          suggestion_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      plants: {
        Row: {
          active: boolean
          code: string
          created_at: string
          deleted_at: string | null
          id: string
          location_id: string
          name: string
        }
        Insert: {
          active?: boolean
          code: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          location_id: string
          name: string
        }
        Update: {
          active?: boolean
          code?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          location_id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "plants_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestion_history: {
        Row: {
          actor_id: string | null
          created_at: string
          from_department_id: string | null
          from_status: Database["public"]["Enums"]["suggestion_status"] | null
          id: string
          remarks: string | null
          suggestion_id: string
          to_department_id: string | null
          to_status: Database["public"]["Enums"]["suggestion_status"]
        }
        Insert: {
          actor_id?: string | null
          created_at?: string
          from_department_id?: string | null
          from_status?: Database["public"]["Enums"]["suggestion_status"] | null
          id?: string
          remarks?: string | null
          suggestion_id: string
          to_department_id?: string | null
          to_status: Database["public"]["Enums"]["suggestion_status"]
        }
        Update: {
          actor_id?: string | null
          created_at?: string
          from_department_id?: string | null
          from_status?: Database["public"]["Enums"]["suggestion_status"] | null
          id?: string
          remarks?: string | null
          suggestion_id?: string
          to_department_id?: string | null
          to_status?: Database["public"]["Enums"]["suggestion_status"]
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_history_from_department_id_fkey"
            columns: ["from_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestion_history_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestion_history_to_department_id_fkey"
            columns: ["to_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          actual_benefits: string | null
          actual_cost: number | null
          category_id: string | null
          code: string | null
          completed_at: string | null
          created_at: string
          current_department_id: string | null
          current_method: string | null
          department_id: string
          employee_id: string
          expected_benefits: string | null
          expected_saving: number | null
          id: string
          deleted_at: string | null
          budget_tier: string | null
          implementation_cost: number | null
          location_id: string
          plant_id: string
          priority: Database["public"]["Enums"]["priority_level"]
          problem: string | null
          status: Database["public"]["Enums"]["suggestion_status"]
          suggested_method: string | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_benefits?: string | null
          actual_cost?: number | null
          category_id?: string | null
          code?: string | null
          completed_at?: string | null
          created_at?: string
          current_department_id?: string | null
          current_method?: string | null
          department_id: string
          employee_id: string
          expected_benefits?: string | null
          expected_saving?: number | null
          id?: string
          deleted_at?: string | null
          budget_tier?: string | null
          implementation_cost?: number | null
          location_id: string
          plant_id: string
          priority?: Database["public"]["Enums"]["priority_level"]
          problem?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          suggested_method?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_benefits?: string | null
          actual_cost?: number | null
          category_id?: string | null
          code?: string | null
          completed_at?: string | null
          created_at?: string
          current_department_id?: string | null
          current_method?: string | null
          department_id?: string
          employee_id?: string
          expected_benefits?: string | null
          expected_saving?: number | null
          id?: string
          deleted_at?: string | null
          budget_tier?: string | null
          implementation_cost?: number | null
          location_id?: string
          plant_id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          problem?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          suggested_method?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_current_department_id_fkey"
            columns: ["current_department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "suggestions_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          department_id: string | null
          id: string
          location_id: string | null
          plant_id: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          department_id?: string | null
          id?: string
          location_id?: string | null
          plant_id?: string | null
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          department_id?: string | null
          id?: string
          location_id?: string | null
          plant_id?: string | null
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_roles_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role:
        | "super_admin"
        | "corporate_admin"
        | "admin"
        | "location_admin"
        | "plant_admin"
        | "department_admin"
        | "pe_user"
        | "dept_user"
        | "mgmt_viewer"
        | "employee"
      priority_level: "low" | "medium" | "high" | "critical"
      suggestion_status:
        | "submitted"
        | "pe_review"
        | "transferred"
        | "dept_review"
        | "approved"
        | "evaluation"
        | "implementation"
        | "evidence_pending"
        | "evidence_submitted"
        | "pe_verification"
        | "implemented"
        | "rejected"
        | "fake_closure"
        | "reopened"
        | "closed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: [
        "super_admin",
        "corporate_admin",
        "admin",
        "location_admin",
        "plant_admin",
        "department_admin",
        "pe_user",
        "dept_user",
        "mgmt_viewer",
        "employee",
      ],
      priority_level: ["low", "medium", "high", "critical"],
      suggestion_status: [
        "submitted",
        "pe_review",
        "transferred",
        "dept_review",
        "approved",
        "evaluation",
        "implementation",
        "evidence_pending",
        "evidence_submitted",
        "pe_verification",
        "implemented",
        "rejected",
        "fake_closure",
        "reopened",
        "closed",
      ],
    },
  },
} as const
