// This file can be auto-generated using: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
// For now, we'll use a simplified version

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: 'customer' | 'driver' | 'admin'
          full_name: string
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role?: 'customer' | 'driver' | 'admin'
          full_name: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: 'customer' | 'driver' | 'admin'
          full_name?: string
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          stripe_customer_id: string | null
          subscription_status: 'active' | 'inactive' | 'cancelled' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'cancelled' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
          subscription_status?: 'active' | 'inactive' | 'cancelled' | null
          created_at?: string
          updated_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          status: 'online' | 'offline' | 'busy'
          vehicle_info: string | null
          license_number: string | null
          current_latitude: number | null
          current_longitude: number | null
          current_location_updated_at: string | null
          rating: number | null
          total_deliveries: number | null
          is_approved: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          status?: 'online' | 'offline' | 'busy'
          vehicle_info?: string | null
          license_number?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          current_location_updated_at?: string | null
          rating?: number | null
          total_deliveries?: number | null
          is_approved?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          status?: 'online' | 'offline' | 'busy'
          vehicle_info?: string | null
          license_number?: string | null
          current_latitude?: number | null
          current_longitude?: number | null
          current_location_updated_at?: string | null
          rating?: number | null
          total_deliveries?: number | null
          is_approved?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          customer_id: string
          make: string
          model: string
          year: number
          color: string | null
          license_plate: string | null
          fuel_type: 'regular' | 'premium' | 'diesel'
          tank_capacity: number | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          make: string
          model: string
          year: number
          color?: string | null
          license_plate?: string | null
          fuel_type: 'regular' | 'premium' | 'diesel'
          tank_capacity?: number | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          make?: string
          model?: string
          year?: number
          color?: string | null
          license_plate?: string | null
          fuel_type?: 'regular' | 'premium' | 'diesel'
          tank_capacity?: number | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      service_locations: {
        Row: {
          id: string
          customer_id: string
          name: string
          address: string
          latitude: number
          longitude: number
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          name: string
          address: string
          latitude: number
          longitude: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          name?: string
          address?: string
          latitude?: number
          longitude?: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      jobs: {
        Row: {
          id: string
          customer_id: string
          driver_id: string | null
          vehicle_id: string
          service_location_id: string
          fuel_type: 'regular' | 'premium' | 'diesel'
          gallons_requested: number | null
          gallons_delivered: number | null
          status: 'pending' | 'assigned' | 'accepted' | 'en_route' | 'arrived' | 'fueling' | 'completed' | 'cancelled'
          scheduled_for: string | null
          is_asap: boolean
          delivery_latitude: number
          delivery_longitude: number
          delivery_address: string
          price_per_gallon: number
          service_fee: number
          total_amount: number
          payment_intent_id: string | null
          payment_status: 'pending' | 'processing' | 'succeeded' | 'failed'
          driver_latitude: number | null
          driver_longitude: number | null
          driver_location_updated_at: string | null
          estimated_arrival: string | null
          arrived_at: string | null
          started_fueling_at: string | null
          completed_at: string | null
          cancelled_at: string | null
          cancellation_reason: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          driver_id?: string | null
          vehicle_id: string
          service_location_id: string
          fuel_type: 'regular' | 'premium' | 'diesel'
          gallons_requested?: number | null
          gallons_delivered?: number | null
          status?: 'pending' | 'assigned' | 'accepted' | 'en_route' | 'arrived' | 'fueling' | 'completed' | 'cancelled'
          scheduled_for?: string | null
          is_asap?: boolean
          delivery_latitude: number
          delivery_longitude: number
          delivery_address: string
          price_per_gallon: number
          service_fee: number
          total_amount: number
          payment_intent_id?: string | null
          payment_status?: 'pending' | 'processing' | 'succeeded' | 'failed'
          driver_latitude?: number | null
          driver_longitude?: number | null
          driver_location_updated_at?: string | null
          estimated_arrival?: string | null
          arrived_at?: string | null
          started_fueling_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          driver_id?: string | null
          vehicle_id?: string
          service_location_id?: string
          fuel_type?: 'regular' | 'premium' | 'diesel'
          gallons_requested?: number | null
          gallons_delivered?: number | null
          status?: 'pending' | 'assigned' | 'accepted' | 'en_route' | 'arrived' | 'fueling' | 'completed' | 'cancelled'
          scheduled_for?: string | null
          is_asap?: boolean
          delivery_latitude?: number
          delivery_longitude?: number
          delivery_address?: string
          price_per_gallon?: number
          service_fee?: number
          total_amount?: number
          payment_intent_id?: string | null
          payment_status?: 'pending' | 'processing' | 'succeeded' | 'failed'
          driver_latitude?: number | null
          driver_longitude?: number | null
          driver_location_updated_at?: string | null
          estimated_arrival?: string | null
          arrived_at?: string | null
          started_fueling_at?: string | null
          completed_at?: string | null
          cancelled_at?: string | null
          cancellation_reason?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          customer_id: string
          stripe_payment_method_id: string
          type: string
          last4: string
          brand: string
          exp_month: number
          exp_year: number
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          stripe_payment_method_id: string
          type?: string
          last4: string
          brand: string
          exp_month: number
          exp_year: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          stripe_payment_method_id?: string
          type?: string
          last4?: string
          brand?: string
          exp_month?: number
          exp_year?: number
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      transactions: {
        Row: {
          id: string
          job_id: string
          customer_id: string
          amount: number
          status: 'pending' | 'succeeded' | 'failed' | 'refunded'
          stripe_payment_intent_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          job_id: string
          customer_id: string
          amount: number
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          stripe_payment_intent_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          job_id?: string
          customer_id?: string
          amount?: number
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          stripe_payment_intent_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: string
          read: boolean
          related_job_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: string
          read?: boolean
          related_job_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: string
          read?: boolean
          related_job_id?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_nearby_drivers: {
        Args: {
          job_lat: number
          job_lng: number
          radius_km?: number
        }
        Returns: {
          driver_id: string
          driver_name: string
          distance_km: number
          rating: number
        }[]
      }
    }
    Enums: {
      user_role: 'customer' | 'driver' | 'admin'
      driver_status: 'online' | 'offline' | 'busy'
      job_status: 'pending' | 'assigned' | 'accepted' | 'en_route' | 'arrived' | 'fueling' | 'completed' | 'cancelled'
      fuel_type: 'regular' | 'premium' | 'diesel'
      payment_status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded'
      subscription_status: 'active' | 'inactive' | 'cancelled'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
