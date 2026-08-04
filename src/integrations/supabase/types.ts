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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      capital_assets: {
        Row: {
          category: string | null
          created_at: string
          current_value: number
          depreciation: number
          id: string
          name: string
          purchase_date: string
          purchase_value: number
          status: string
          updated_at: string
          useful_life: number
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          current_value?: number
          depreciation?: number
          id?: string
          name: string
          purchase_date?: string
          purchase_value?: number
          status?: string
          updated_at?: string
          useful_life?: number
          user_id?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          current_value?: number
          depreciation?: number
          id?: string
          name?: string
          purchase_date?: string
          purchase_value?: number
          status?: string
          updated_at?: string
          useful_life?: number
          user_id?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          created_at: string
          email: string | null
          id: string
          last_order_at: string | null
          name: string
          notes: string | null
          orders_count: number
          phone: string | null
          segment: string | null
          status: string
          total_spent: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          last_order_at?: string | null
          name: string
          notes?: string | null
          orders_count?: number
          phone?: string | null
          segment?: string | null
          status?: string
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          last_order_at?: string | null
          name?: string
          notes?: string | null
          orders_count?: number
          phone?: string | null
          segment?: string | null
          status?: string
          total_spent?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      employees: {
        Row: {
          created_at: string
          department: string | null
          email: string | null
          hired_on: string | null
          id: string
          name: string
          phone: string | null
          role: string | null
          salary: number
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          email?: string | null
          hired_on?: string | null
          id?: string
          name: string
          phone?: string | null
          role?: string | null
          salary?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          email?: string | null
          hired_on?: string | null
          id?: string
          name?: string
          phone?: string | null
          role?: string | null
          salary?: number
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      income_tax_records: {
        Row: {
          amount: number
          created_at: string
          due_date: string
          id: string
          installment: string | null
          payment_status: string
          period: string
          profit_base: number
          status: string
          tax_rate: number
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          due_date: string
          id?: string
          installment?: string | null
          payment_status?: string
          period: string
          profit_base?: number
          status?: string
          tax_rate?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          amount?: number
          created_at?: string
          due_date?: string
          id?: string
          installment?: string | null
          payment_status?: string
          period?: string
          profit_base?: number
          status?: string
          tax_rate?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      paye_records: {
        Row: {
          created_at: string
          due_date: string
          employees: number
          gross_pay: number
          id: string
          paye_amount: number
          payment_status: string
          period: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          due_date: string
          employees?: number
          gross_pay?: number
          id?: string
          paye_amount?: number
          payment_status?: string
          period: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          due_date?: string
          employees?: number
          gross_pay?: number
          id?: string
          paye_amount?: number
          payment_status?: string
          period?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          cost: number
          created_at: string
          id: string
          name: string
          price: number
          reorder_level: number
          sku: string | null
          status: string
          stock: number
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          cost?: number
          created_at?: string
          id?: string
          name: string
          price?: number
          reorder_level?: number
          sku?: string | null
          status?: string
          stock?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          category?: string | null
          cost?: number
          created_at?: string
          id?: string
          name?: string
          price?: number
          reorder_level?: number
          sku?: string | null
          status?: string
          stock?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          business_name: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          business_name?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          business_name?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      sales_orders: {
        Row: {
          amount: number
          channel: string | null
          created_at: string
          customer_id: string | null
          customer_name: string | null
          id: string
          order_date: string
          payment_method: string | null
          reference: string
          status: string
          updated_at: string
          user_id: string
          vat: number
        }
        Insert: {
          amount?: number
          channel?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          order_date?: string
          payment_method?: string | null
          reference: string
          status?: string
          updated_at?: string
          user_id?: string
          vat?: number
        }
        Update: {
          amount?: number
          channel?: string | null
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          id?: string
          order_date?: string
          payment_method?: string | null
          reference?: string
          status?: string
          updated_at?: string
          user_id?: string
          vat?: number
        }
        Relationships: [
          {
            foreignKeyName: "sales_orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      tax_documents: {
        Row: {
          category: string | null
          created_at: string
          id: string
          name: string
          size: string | null
          status: string
          type: string | null
          updated_at: string
          uploaded_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          name: string
          size?: string | null
          status?: string
          type?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          name?: string
          size?: string | null
          status?: string
          type?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tax_expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          date: string
          deductible: boolean
          description: string
          id: string
          receipt: boolean
          status: string
          tax_period: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          category?: string | null
          created_at?: string
          date?: string
          deductible?: boolean
          description: string
          id?: string
          receipt?: boolean
          status?: string
          tax_period: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          date?: string
          deductible?: boolean
          description?: string
          id?: string
          receipt?: boolean
          status?: string
          tax_period?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tax_imports: {
        Row: {
          created_at: string
          duplicates: number
          errors: number
          id: string
          imported_at: string
          name: string
          rows_count: number
          status: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          duplicates?: number
          errors?: number
          id?: string
          imported_at?: string
          name: string
          rows_count?: number
          status?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          duplicates?: number
          errors?: number
          id?: string
          imported_at?: string
          name?: string
          rows_count?: number
          status?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tax_purchases: {
        Row: {
          amount: number
          attachment: boolean
          category: string | null
          created_at: string
          date: string
          deductible: boolean
          id: string
          status: string
          supplier: string
          tax_period: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          attachment?: boolean
          category?: string | null
          created_at?: string
          date?: string
          deductible?: boolean
          id?: string
          status?: string
          supplier: string
          tax_period: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          amount?: number
          attachment?: boolean
          category?: string | null
          created_at?: string
          date?: string
          deductible?: boolean
          id?: string
          status?: string
          supplier?: string
          tax_period?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      tax_sales: {
        Row: {
          amount: number
          created_at: string
          customer: string
          date: string
          id: string
          reference: string
          status: string
          tax_period: string
          updated_at: string
          user_id: string
          vat: number
        }
        Insert: {
          amount?: number
          created_at?: string
          customer: string
          date?: string
          id?: string
          reference: string
          status?: string
          tax_period: string
          updated_at?: string
          user_id?: string
          vat?: number
        }
        Update: {
          amount?: number
          created_at?: string
          customer?: string
          date?: string
          id?: string
          reference?: string
          status?: string
          tax_period?: string
          updated_at?: string
          user_id?: string
          vat?: number
        }
        Relationships: []
      }
      tax_settings: {
        Row: {
          created_at: string
          projected_annual_profit: number
          reminders_off: string[]
          tax_rate: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          projected_annual_profit?: number
          reminders_off?: string[]
          tax_rate?: number
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          projected_annual_profit?: number
          reminders_off?: string[]
          tax_rate?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vat_returns: {
        Row: {
          created_at: string
          due_date: string
          id: string
          input_vat: number
          output_vat: number
          payable: number
          payment_status: string
          period: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          due_date: string
          id?: string
          input_vat?: number
          output_vat?: number
          payable?: number
          payment_status?: string
          period: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          due_date?: string
          id?: string
          input_vat?: number
          output_vat?: number
          payable?: number
          payment_status?: string
          period?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      withholding_records: {
        Row: {
          amount: number
          certificate: string | null
          created_at: string
          date: string
          due_date: string
          id: string
          name: string
          payment_status: string
          period: string
          status: string
          type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          certificate?: string | null
          created_at?: string
          date?: string
          due_date: string
          id?: string
          name: string
          payment_status?: string
          period: string
          status?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          amount?: number
          certificate?: string | null
          created_at?: string
          date?: string
          due_date?: string
          id?: string
          name?: string
          payment_status?: string
          period?: string
          status?: string
          type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
