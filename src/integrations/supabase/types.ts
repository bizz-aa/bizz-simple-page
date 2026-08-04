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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: []
      }
      customer_channels: {
        Row: {
          active: boolean
          created_at: string
          id: string
          name: string
          notes: string | null
          type: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          type?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          channel_id: string | null
          created_at: string
          customer_type: string
          email: string | null
          id: string
          location: string | null
          name: string
          notes: string | null
          phone: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          address?: string | null
          channel_id?: string | null
          created_at?: string
          customer_type?: string
          email?: string | null
          id?: string
          location?: string | null
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          address?: string | null
          channel_id?: string | null
          created_at?: string
          customer_type?: string
          email?: string | null
          id?: string
          location?: string | null
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "customer_channels"
            referencedColumns: ["id"]
          },
        ]
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: []
      }
      expenses: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          description: string
          expense_date: string
          id: string
          notes: string | null
          payment_method: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: number
          category?: string | null
          created_at?: string
          description: string
          expense_date?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          notes?: string | null
          payment_method?: string | null
          updated_at?: string
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: []
      }
      marketing_campaigns: {
        Row: {
          budget: number
          channel: string
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          budget?: number
          channel?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          budget?: number
          channel?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          active: boolean
          barcode: string | null
          category: string | null
          cost_price: number
          created_at: string
          id: string
          name: string
          reorder_level: number
          selling_price: number
          sku: string | null
          stock_quantity: number
          tax_rate: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          barcode?: string | null
          category?: string | null
          cost_price?: number
          created_at?: string
          id?: string
          name: string
          reorder_level?: number
          selling_price?: number
          sku?: string | null
          stock_quantity?: number
          tax_rate?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          barcode?: string | null
          category?: string | null
          cost_price?: number
          created_at?: string
          id?: string
          name?: string
          reorder_level?: number
          selling_price?: number
          sku?: string | null
          stock_quantity?: number
          tax_rate?: number
          updated_at?: string
          user_id?: string | null
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
      sale_items: {
        Row: {
          created_at: string
          id: string
          line_total: number
          product_id: string | null
          product_name: string
          quantity: number
          sale_id: string
          tax_amount: number
          unit_price: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          line_total?: number
          product_id?: string | null
          product_name: string
          quantity?: number
          sale_id: string
          tax_amount?: number
          unit_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          line_total?: number
          product_id?: string | null
          product_name?: string
          quantity?: number
          sale_id?: string
          tax_amount?: number
          unit_price?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sale_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sale_items_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "sales"
            referencedColumns: ["id"]
          },
        ]
      }
      sales: {
        Row: {
          amount_paid: number
          created_at: string
          customer_id: string | null
          customer_name: string | null
          discount_amount: number
          id: string
          invoice_number: string
          payment_method: string
          status: string
          subtotal: number
          tax_amount: number
          total: number
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount_paid?: number
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number
          id?: string
          invoice_number: string
          payment_method?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount_paid?: number
          created_at?: string
          customer_id?: string | null
          customer_name?: string | null
          discount_amount?: number
          id?: string
          invoice_number?: string
          payment_method?: string
          status?: string
          subtotal?: number
          tax_amount?: number
          total?: number
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sales_customer_id_fkey"
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
          file_path: string | null
          file_size: number | null
          file_url: string | null
          id: string
          name: string
          sale_id: string | null
          size: string | null
          status: string
          type: string | null
          updated_at: string
          uploaded_at: string
          user_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          file_path?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          name: string
          sale_id?: string | null
          size?: string | null
          status?: string
          type?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          file_path?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          name?: string
          sale_id?: string | null
          size?: string | null
          status?: string
          type?: string | null
          updated_at?: string
          uploaded_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tax_documents_sale_id_fkey"
            columns: ["sale_id"]
            isOneToOne: false
            referencedRelation: "tax_sales"
            referencedColumns: ["id"]
          },
        ]
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
          user_id: string | null
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
          user_id?: string | null
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
          user_id?: string | null
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
