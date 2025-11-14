// User types
export type UserRole = 'customer' | 'driver' | 'admin'

export interface User {
  id: string
  email: string
  role: UserRole
  full_name: string
  phone: string
  created_at: string
  updated_at: string
}

export interface Customer extends User {
  role: 'customer'
  stripe_customer_id?: string
  subscription_status?: 'active' | 'inactive' | 'cancelled'
}

export interface Driver extends User {
  role: 'driver'
  status: 'online' | 'offline' | 'busy'
  vehicle_info: string
  license_number: string
  current_location?: Location
  rating?: number
  total_deliveries?: number
  is_approved: boolean
  is_active: boolean
}

export interface Admin extends User {
  role: 'admin'
}

// Location type
export interface Location {
  latitude: number
  longitude: number
  address?: string
  timestamp?: string
}

// Vehicle types
export interface Vehicle {
  id: string
  customer_id: string
  make: string
  model: string
  year: number
  color?: string
  license_plate?: string
  fuel_type: 'regular' | 'premium' | 'diesel'
  tank_capacity?: number
  is_default: boolean
  created_at: string
}

// Service Location types
export interface ServiceLocation {
  id: string
  customer_id: string
  name: string
  address: string
  location: Location
  is_default: boolean
  created_at: string
}

// Job types
export type JobStatus =
  | 'pending'
  | 'assigned'
  | 'accepted'
  | 'en_route'
  | 'arrived'
  | 'fueling'
  | 'completed'
  | 'cancelled'

export type FuelType = 'regular' | 'premium' | 'diesel'

export interface Job {
  id: string
  customer_id: string
  driver_id?: string
  vehicle_id: string
  service_location_id: string

  // Job details
  fuel_type: FuelType
  gallons_requested?: number
  gallons_delivered?: number
  status: JobStatus

  // Scheduling
  scheduled_for?: string // ISO timestamp for scheduled deliveries
  is_asap: boolean

  // Location
  delivery_location: Location

  // Pricing
  price_per_gallon: number
  service_fee: number
  total_amount: number

  // Payment
  payment_intent_id?: string
  payment_status: 'pending' | 'processing' | 'succeeded' | 'failed'

  // Tracking
  driver_location?: Location
  estimated_arrival?: string
  arrived_at?: string
  started_fueling_at?: string
  completed_at?: string
  cancelled_at?: string
  cancellation_reason?: string

  // Metadata
  notes?: string
  created_at: string
  updated_at: string
}

// Payment types
export interface PaymentMethod {
  id: string
  customer_id: string
  stripe_payment_method_id: string
  type: 'card'
  last4: string
  brand: string
  exp_month: number
  exp_year: number
  is_default: boolean
  created_at: string
}

export interface Transaction {
  id: string
  job_id: string
  customer_id: string
  amount: number
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  stripe_payment_intent_id: string
  created_at: string
}

// Notification types
export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  related_job_id?: string
  created_at: string
}

// Analytics types
export interface DriverStats {
  driver_id: string
  total_jobs: number
  completed_jobs: number
  cancelled_jobs: number
  total_gallons_delivered: number
  total_earnings: number
  average_rating: number
  online_hours: number
}

export interface SystemStats {
  total_customers: number
  total_drivers: number
  active_drivers: number
  total_jobs: number
  jobs_today: number
  jobs_this_week: number
  jobs_this_month: number
  total_revenue: number
  revenue_today: number
  revenue_this_week: number
  revenue_this_month: number
}
