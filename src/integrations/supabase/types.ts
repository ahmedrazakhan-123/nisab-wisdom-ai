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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      asset_compliance: {
        Row: {
          asset_id: string | null
          automated_check: boolean | null
          checked_by: string | null
          compliance_reasons: string[] | null
          compliance_score: number | null
          compliance_status: Database["public"]["Enums"]["compliance_status"]
          id: string
          last_checked: string | null
        }
        Insert: {
          asset_id?: string | null
          automated_check?: boolean | null
          checked_by?: string | null
          compliance_reasons?: string[] | null
          compliance_score?: number | null
          compliance_status: Database["public"]["Enums"]["compliance_status"]
          id?: string
          last_checked?: string | null
        }
        Update: {
          asset_id?: string | null
          automated_check?: boolean | null
          checked_by?: string | null
          compliance_reasons?: string[] | null
          compliance_score?: number | null
          compliance_status?: Database["public"]["Enums"]["compliance_status"]
          id?: string
          last_checked?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asset_compliance_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: true
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          created_at: string | null
          current_price: number | null
          description: string | null
          id: string
          last_updated: string | null
          market_cap: number | null
          name: string
          price_change_24h: number | null
          symbol: string
          volume_24h: number | null
          website_url: string | null
          whitepaper_content: string | null
          whitepaper_url: string | null
        }
        Insert: {
          asset_type: Database["public"]["Enums"]["asset_type"]
          created_at?: string | null
          current_price?: number | null
          description?: string | null
          id?: string
          last_updated?: string | null
          market_cap?: number | null
          name: string
          price_change_24h?: number | null
          symbol: string
          volume_24h?: number | null
          website_url?: string | null
          whitepaper_content?: string | null
          whitepaper_url?: string | null
        }
        Update: {
          asset_type?: Database["public"]["Enums"]["asset_type"]
          created_at?: string | null
          current_price?: number | null
          description?: string | null
          id?: string
          last_updated?: string | null
          market_cap?: number | null
          name?: string
          price_change_24h?: number | null
          symbol?: string
          volume_24h?: number | null
          website_url?: string | null
          whitepaper_content?: string | null
          whitepaper_url?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: Database["public"]["Enums"]["audit_action"]
          created_at: string | null
          id: string
          ip_address: unknown | null
          metadata: Json | null
          new_values: Json | null
          old_values: Json | null
          resource_id: string | null
          resource_type: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: Database["public"]["Enums"]["audit_action"]
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["audit_action"]
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          metadata?: Json | null
          new_values?: Json | null
          old_values?: Json | null
          resource_id?: string | null
          resource_type?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      compliance_rules: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          rule_category: string
          rule_criteria: Json | null
          rule_description: string
          rule_name: string
          rule_source: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          rule_category: string
          rule_criteria?: Json | null
          rule_description: string
          rule_name: string
          rule_source?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          rule_category?: string
          rule_criteria?: Json | null
          rule_description?: string
          rule_name?: string
          rule_source?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      knowledge_base: {
        Row: {
          category: string
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          is_verified: boolean | null
          keywords: string[] | null
          source: string
          source_reference: string | null
          title: string
          updated_at: string | null
          verified_by: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          is_verified?: boolean | null
          keywords?: string[] | null
          source: string
          source_reference?: string | null
          title: string
          updated_at?: string | null
          verified_by?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          is_verified?: boolean | null
          keywords?: string[] | null
          source?: string
          source_reference?: string | null
          title?: string
          updated_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      news_articles: {
        Row: {
          content: string
          created_at: string | null
          id: string
          published_at: string | null
          related_assets: string[] | null
          sentiment_label: string | null
          sentiment_score: number | null
          source: string
          tags: string[] | null
          title: string
          url: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          related_assets?: string[] | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          source: string
          tags?: string[] | null
          title: string
          url?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          published_at?: string | null
          related_assets?: string[] | null
          sentiment_label?: string | null
          sentiment_score?: number | null
          source?: string
          tags?: string[] | null
          title?: string
          url?: string | null
        }
        Relationships: []
      }
      portfolio_assets: {
        Row: {
          added_at: string | null
          asset_id: string | null
          average_price: number
          current_value: number | null
          id: string
          portfolio_id: string | null
          quantity: number
          updated_at: string | null
        }
        Insert: {
          added_at?: string | null
          asset_id?: string | null
          average_price: number
          current_value?: number | null
          id?: string
          portfolio_id?: string | null
          quantity: number
          updated_at?: string | null
        }
        Update: {
          added_at?: string | null
          asset_id?: string | null
          average_price?: number
          current_value?: number | null
          id?: string
          portfolio_id?: string | null
          quantity?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_assets_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "portfolio_assets_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          is_default: boolean | null
          name: string
          total_value: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          total_value?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          total_value?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          country: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          phone: string | null
          preferred_currency: string | null
          updated_at: string | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          phone?: string | null
          preferred_currency?: string | null
          updated_at?: string | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          preferred_currency?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      zakat_calculations: {
        Row: {
          calculated_at: string | null
          calculation_data: Json
          currency: string | null
          id: string
          nisab_threshold: number
          total_wealth: number
          user_id: string | null
          zakat_due: number
        }
        Insert: {
          calculated_at?: string | null
          calculation_data: Json
          currency?: string | null
          id?: string
          nisab_threshold: number
          total_wealth: number
          user_id?: string | null
          zakat_due: number
        }
        Update: {
          calculated_at?: string | null
          calculation_data?: Json
          currency?: string | null
          id?: string
          nisab_threshold?: number
          total_wealth?: number
          user_id?: string | null
          zakat_due?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_admin: {
        Args: { _user_id: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      log_audit_event: {
        Args: {
          p_action: Database["public"]["Enums"]["audit_action"]
          p_metadata?: Json
          p_new_values?: Json
          p_old_values?: Json
          p_resource_id?: string
          p_resource_type: string
          p_user_id: string
        }
        Returns: undefined
      }
      search_knowledge_base: {
        Args: {
          match_count?: number
          match_threshold?: number
          query_embedding: string
        }
        Returns: {
          category: string
          content: string
          id: string
          similarity: number
          source: string
          source_reference: string
          title: string
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "standard_user" | "researcher"
      asset_type:
        | "crypto"
        | "stock"
        | "halal_asset"
        | "commodity"
        | "real_estate"
      audit_action:
        | "create"
        | "update"
        | "delete"
        | "login"
        | "logout"
        | "compliance_check"
      compliance_status: "halal" | "haram" | "doubtful" | "pending_review"
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
      app_role: ["admin", "standard_user", "researcher"],
      asset_type: [
        "crypto",
        "stock",
        "halal_asset",
        "commodity",
        "real_estate",
      ],
      audit_action: [
        "create",
        "update",
        "delete",
        "login",
        "logout",
        "compliance_check",
      ],
      compliance_status: ["halal", "haram", "doubtful", "pending_review"],
    },
  },
} as const
