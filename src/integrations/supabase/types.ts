export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      beneficiaries: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string
          relationship: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone: string
          relationship: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string
          relationship?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "beneficiaries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      boxes: {
        Row: {
          created_at: string
          emplacement_actuel: string | null
          id: string
          nom: string
          qr_code_principal: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          emplacement_actuel?: string | null
          id?: string
          nom: string
          qr_code_principal?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          emplacement_actuel?: string | null
          id?: string
          nom?: string
          qr_code_principal?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          adresse: string | null
          created_at: string
          email: string | null
          id: string
          nom: string
          telephone: string | null
          updated_at: string
        }
        Insert: {
          adresse?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nom: string
          telephone?: string | null
          updated_at?: string
        }
        Update: {
          adresse?: string | null
          created_at?: string
          email?: string | null
          id?: string
          nom?: string
          telephone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      colis_marchandises: {
        Row: {
          colis_id: string | null
          created_at: string
          id: string
          marchandise_id: string | null
          quantite: number
        }
        Insert: {
          colis_id?: string | null
          created_at?: string
          id?: string
          marchandise_id?: string | null
          quantite?: number
        }
        Update: {
          colis_id?: string | null
          created_at?: string
          id?: string
          marchandise_id?: string | null
          quantite?: number
        }
        Relationships: [
          {
            foreignKeyName: "colis_marchandises_colis_id_fkey"
            columns: ["colis_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "colis_marchandises_marchandise_id_fkey"
            columns: ["marchandise_id"]
            isOneToOne: false
            referencedRelation: "marchandises"
            referencedColumns: ["id"]
          },
        ]
      }
      marchandises: {
        Row: {
          created_at: string
          dimensions: Json | null
          id: string
          nom: string
          poids: number | null
          reference: string | null
        }
        Insert: {
          created_at?: string
          dimensions?: Json | null
          id?: string
          nom: string
          poids?: number | null
          reference?: string | null
        }
        Update: {
          created_at?: string
          dimensions?: Json | null
          id?: string
          nom?: string
          poids?: number | null
          reference?: string | null
        }
        Relationships: []
      }
      parcel_tracking: {
        Row: {
          coordinates: Json | null
          created_at: string
          created_by: string | null
          description: string
          id: string
          image_url: string | null
          location: string
          parcel_id: string
          status: string
        }
        Insert: {
          coordinates?: Json | null
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          image_url?: string | null
          location: string
          parcel_id: string
          status: string
        }
        Update: {
          coordinates?: Json | null
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          image_url?: string | null
          location?: string
          parcel_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "parcel_tracking_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      parcels: {
        Row: {
          actual_delivery: string | null
          box_id: string | null
          client_id: string | null
          created_at: string
          created_by: string | null
          declared_value: number | null
          description: string | null
          dimensions: Json | null
          estimated_delivery: string | null
          id: string
          marchandises: Json | null
          notes: string | null
          priority: string | null
          qr_code_url: string | null
          recipient_address: string
          recipient_name: string
          recipient_phone: string
          sender_address: string
          sender_name: string
          sender_phone: string
          shipping_cost: number
          status: string
          tracking_number: string
          updated_at: string
          weight: number
        }
        Insert: {
          actual_delivery?: string | null
          box_id?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          declared_value?: number | null
          description?: string | null
          dimensions?: Json | null
          estimated_delivery?: string | null
          id?: string
          marchandises?: Json | null
          notes?: string | null
          priority?: string | null
          qr_code_url?: string | null
          recipient_address: string
          recipient_name: string
          recipient_phone: string
          sender_address: string
          sender_name: string
          sender_phone: string
          shipping_cost: number
          status?: string
          tracking_number: string
          updated_at?: string
          weight: number
        }
        Update: {
          actual_delivery?: string | null
          box_id?: string | null
          client_id?: string | null
          created_at?: string
          created_by?: string | null
          declared_value?: number | null
          description?: string | null
          dimensions?: Json | null
          estimated_delivery?: string | null
          id?: string
          marchandises?: Json | null
          notes?: string | null
          priority?: string | null
          qr_code_url?: string | null
          recipient_address?: string
          recipient_name?: string
          recipient_phone?: string
          sender_address?: string
          sender_name?: string
          sender_phone?: string
          shipping_cost?: number
          status?: string
          tracking_number?: string
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_parcels_box"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "boxes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcels_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
          name: string
          role: string
          updated_at: string | null
          verification_status: string
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          role: string
          updated_at?: string | null
          verification_status?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          role?: string
          updated_at?: string | null
          verification_status?: string
        }
        Relationships: []
      }
      recipients: {
        Row: {
          created_at: string
          id: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      senders: {
        Row: {
          created_at: string
          id: string
          id_number: string
          id_type: string
          name: string
          phone: string
        }
        Insert: {
          created_at?: string
          id?: string
          id_number: string
          id_type?: string
          name: string
          phone: string
        }
        Update: {
          created_at?: string
          id?: string
          id_number?: string
          id_type?: string
          name?: string
          phone?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number
          commission_amount: number | null
          commission_percentage: number | null
          created_at: string | null
          created_by: string | null
          currency: string | null
          direction: string | null
          fees: number
          id: string
          mobile_money_network: string | null
          notes: string | null
          payment_method: string
          purpose: string | null
          receiving_amount: number | null
          recipient_id: string | null
          sender_id: string | null
          status: string
          total: number
          txn_id: string
          updated_at: string | null
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          amount: number
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          direction?: string | null
          fees?: number
          id?: string
          mobile_money_network?: string | null
          notes?: string | null
          payment_method: string
          purpose?: string | null
          receiving_amount?: number | null
          recipient_id?: string | null
          sender_id?: string | null
          status: string
          total: number
          txn_id: string
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          amount?: number
          commission_amount?: number | null
          commission_percentage?: number | null
          created_at?: string | null
          created_by?: string | null
          currency?: string | null
          direction?: string | null
          fees?: number
          id?: string
          mobile_money_network?: string | null
          notes?: string | null
          payment_method?: string
          purpose?: string | null
          receiving_amount?: number | null
          recipient_id?: string | null
          sender_id?: string | null
          status?: string
          total?: number
          txn_id?: string
          updated_at?: string | null
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_transactions_recipient"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_transactions_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "senders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "senders"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          id: string
          identifier: string | null
          is_active: boolean | null
          last_login: string | null
          name: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          identifier?: string | null
          is_active?: boolean | null
          last_login?: string | null
          name: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          identifier?: string | null
          is_active?: boolean | null
          last_login?: string | null
          name?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      authenticate_with_identifier: {
        Args: { p_identifier: string; p_password: string }
        Returns: {
          user_id: string
          email: string
          role: string
        }[]
      }
      generate_tracking_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      get_current_user_role: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_role"]
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["user_role"] }
        Returns: boolean
      }
      is_admin_or_supervisor: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      promote_user_to_admin: {
        Args: { user_email: string }
        Returns: boolean
      }
    }
    Enums: {
      user_role: "admin" | "supervisor" | "operator" | "auditor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: ["admin", "supervisor", "operator", "auditor"],
    },
  },
} as const
