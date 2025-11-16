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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      customers: {
        Row: {
          created_at: string | null
          id: string
          stripe_customer_id: string | null
          subscription_status:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          stripe_customer_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          stripe_customer_id?: string | null
          subscription_status?:
            | Database["public"]["Enums"]["subscription_status"]
            | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          created_at: string | null
          current_latitude: number | null
          current_location_updated_at: string | null
          current_longitude: number | null
          id: string
          is_active: boolean | null
          is_approved: boolean | null
          license_number: string | null
          rating: number | null
          status: Database["public"]["Enums"]["driver_status"] | null
          total_deliveries: number | null
          updated_at: string | null
          vehicle_info: string | null
        }
        Insert: {
          created_at?: string | null
          current_latitude?: number | null
          current_location_updated_at?: string | null
          current_longitude?: number | null
          id: string
          is_active?: boolean | null
          is_approved?: boolean | null
          license_number?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"] | null
          total_deliveries?: number | null
          updated_at?: string | null
          vehicle_info?: string | null
        }
        Update: {
          created_at?: string | null
          current_latitude?: number | null
          current_location_updated_at?: string | null
          current_longitude?: number | null
          id?: string
          is_active?: boolean | null
          is_approved?: boolean | null
          license_number?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"] | null
          total_deliveries?: number | null
          updated_at?: string | null
          vehicle_info?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      jobs: {
        Row: {
          arrived_at: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          completed_at: string | null
          created_at: string | null
          customer_id: string
          delivery_address: string
          delivery_latitude: number
          delivery_longitude: number
          driver_id: string | null
          driver_latitude: number | null
          driver_location_updated_at: string | null
          driver_longitude: number | null
          estimated_arrival: string | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          gallons_delivered: number | null
          gallons_requested: number | null
          id: string
          is_asap: boolean | null
          notes: string | null
          payment_intent_id: string | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          price_per_gallon: number
          scheduled_for: string | null
          service_fee: number
          service_location_id: string
          started_fueling_at: string | null
          status: Database["public"]["Enums"]["job_status"] | null
          total_amount: number
          updated_at: string | null
          vehicle_id: string
        }
        Insert: {
          arrived_at?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id: string
          delivery_address: string
          delivery_latitude: number
          delivery_longitude: number
          driver_id?: string | null
          driver_latitude?: number | null
          driver_location_updated_at?: string | null
          driver_longitude?: number | null
          estimated_arrival?: string | null
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          gallons_delivered?: number | null
          gallons_requested?: number | null
          id?: string
          is_asap?: boolean | null
          notes?: string | null
          payment_intent_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          price_per_gallon: number
          scheduled_for?: string | null
          service_fee: number
          service_location_id: string
          started_fueling_at?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          total_amount: number
          updated_at?: string | null
          vehicle_id: string
        }
        Update: {
          arrived_at?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          completed_at?: string | null
          created_at?: string | null
          customer_id?: string
          delivery_address?: string
          delivery_latitude?: number
          delivery_longitude?: number
          driver_id?: string | null
          driver_latitude?: number | null
          driver_location_updated_at?: string | null
          driver_longitude?: number | null
          estimated_arrival?: string | null
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          gallons_delivered?: number | null
          gallons_requested?: number | null
          id?: string
          is_asap?: boolean | null
          notes?: string | null
          payment_intent_id?: string | null
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          price_per_gallon?: number
          scheduled_for?: string | null
          service_fee?: number
          service_location_id?: string
          started_fueling_at?: string | null
          status?: Database["public"]["Enums"]["job_status"] | null
          total_amount?: number
          updated_at?: string | null
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "jobs_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_service_location_id_fkey"
            columns: ["service_location_id"]
            isOneToOne: false
            referencedRelation: "service_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "jobs_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read: boolean | null
          related_job_id: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read?: boolean | null
          related_job_id?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read?: boolean | null
          related_job_id?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_related_job_id_fkey"
            columns: ["related_job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          brand: string
          created_at: string | null
          customer_id: string
          exp_month: number
          exp_year: number
          id: string
          is_default: boolean | null
          last4: string
          stripe_payment_method_id: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          brand: string
          created_at?: string | null
          customer_id: string
          exp_month: number
          exp_year: number
          id?: string
          is_default?: boolean | null
          last4: string
          stripe_payment_method_id: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          brand?: string
          created_at?: string | null
          customer_id?: string
          exp_month?: number
          exp_year?: number
          id?: string
          is_default?: boolean | null
          last4?: string
          stripe_payment_method_id?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_methods_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      service_locations: {
        Row: {
          address: string
          created_at: string | null
          customer_id: string
          id: string
          is_default: boolean | null
          latitude: number
          longitude: number
          name: string
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          customer_id: string
          id?: string
          is_default?: boolean | null
          latitude: number
          longitude: number
          name: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          is_default?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_locations_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          customer_id: string
          id: string
          job_id: string
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          customer_id: string
          id?: string
          job_id: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          customer_id?: string
          id?: string
          job_id?: string
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "jobs"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          color: string | null
          created_at: string | null
          customer_id: string
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id: string
          is_default: boolean | null
          license_plate: string | null
          make: string
          model: string
          tank_capacity: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          customer_id: string
          fuel_type: Database["public"]["Enums"]["fuel_type"]
          id?: string
          is_default?: boolean | null
          license_plate?: string | null
          make: string
          model: string
          tank_capacity?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          color?: string | null
          created_at?: string | null
          customer_id?: string
          fuel_type?: Database["public"]["Enums"]["fuel_type"]
          id?: string
          is_default?: boolean | null
          license_plate?: string | null
          make?: string
          model?: string
          tank_capacity?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_nearby_drivers: {
        Args: { job_lat: number; job_lng: number; radius_km?: number }
        Returns: {
          distance_km: number
          driver_id: string
          driver_name: string
          rating: number
        }[]
      }
    }
    Enums: {
      driver_status: "online" | "offline" | "busy"
      fuel_type: "regular" | "premium" | "diesel"
      job_status:
        | "pending"
        | "assigned"
        | "accepted"
        | "en_route"
        | "arrived"
        | "fueling"
        | "completed"
        | "cancelled"
      payment_status:
        | "pending"
        | "processing"
        | "succeeded"
        | "failed"
        | "refunded"
      subscription_status: "active" | "inactive" | "cancelled"
      user_role: "customer" | "driver" | "admin"
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
