-- Pull UP -N- Pump Database Schema
-- This SQL file should be run in your Supabase SQL editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create enum types
CREATE TYPE user_role AS ENUM ('customer', 'driver', 'admin');
CREATE TYPE driver_status AS ENUM ('online', 'offline', 'busy');
CREATE TYPE job_status AS ENUM ('pending', 'assigned', 'accepted', 'en_route', 'arrived', 'fueling', 'completed', 'cancelled');
CREATE TYPE fuel_type AS ENUM ('regular', 'premium', 'diesel');
CREATE TYPE payment_status AS ENUM ('pending', 'processing', 'succeeded', 'failed', 'refunded');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'cancelled');

-- Users table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  full_name TEXT NOT NULL,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customer-specific data
CREATE TABLE customers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  subscription_status subscription_status DEFAULT 'inactive',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Driver-specific data
CREATE TABLE drivers (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  status driver_status DEFAULT 'offline',
  vehicle_info TEXT,
  license_number TEXT,
  current_latitude DOUBLE PRECISION,
  current_longitude DOUBLE PRECISION,
  current_location_updated_at TIMESTAMP WITH TIME ZONE,
  rating DECIMAL(3,2) DEFAULT 0,
  total_deliveries INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  color TEXT,
  license_plate TEXT,
  fuel_type fuel_type NOT NULL,
  tank_capacity INTEGER,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Service locations table
CREATE TABLE service_locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Jobs table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES drivers(id) ON DELETE SET NULL,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  service_location_id UUID NOT NULL REFERENCES service_locations(id) ON DELETE CASCADE,

  -- Job details
  fuel_type fuel_type NOT NULL,
  gallons_requested DECIMAL(6,2),
  gallons_delivered DECIMAL(6,2),
  status job_status DEFAULT 'pending',

  -- Scheduling
  scheduled_for TIMESTAMP WITH TIME ZONE,
  is_asap BOOLEAN DEFAULT TRUE,

  -- Location
  delivery_latitude DOUBLE PRECISION NOT NULL,
  delivery_longitude DOUBLE PRECISION NOT NULL,
  delivery_address TEXT NOT NULL,

  -- Pricing
  price_per_gallon DECIMAL(6,2) NOT NULL,
  service_fee DECIMAL(6,2) NOT NULL,
  total_amount DECIMAL(8,2) NOT NULL,

  -- Payment
  payment_intent_id TEXT,
  payment_status payment_status DEFAULT 'pending',

  -- Tracking
  driver_latitude DOUBLE PRECISION,
  driver_longitude DOUBLE PRECISION,
  driver_location_updated_at TIMESTAMP WITH TIME ZONE,
  estimated_arrival TIMESTAMP WITH TIME ZONE,
  arrived_at TIMESTAMP WITH TIME ZONE,
  started_fueling_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,

  -- Metadata
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment methods table
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  stripe_payment_method_id TEXT UNIQUE NOT NULL,
  type TEXT DEFAULT 'card',
  last4 TEXT NOT NULL,
  brand TEXT NOT NULL,
  exp_month INTEGER NOT NULL,
  exp_year INTEGER NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  amount DECIMAL(8,2) NOT NULL,
  status payment_status DEFAULT 'pending',
  stripe_payment_intent_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info',
  read BOOLEAN DEFAULT FALSE,
  related_job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_jobs_customer ON jobs(customer_id);
CREATE INDEX idx_jobs_driver ON jobs(driver_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_vehicles_customer ON vehicles(customer_id);
CREATE INDEX idx_service_locations_customer ON service_locations(customer_id);
CREATE INDEX idx_payment_methods_customer ON payment_methods(customer_id);
CREATE INDEX idx_transactions_customer ON transactions(customer_id);
CREATE INDEX idx_transactions_job ON transactions(job_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_locations_updated_at BEFORE UPDATE ON service_locations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for customers
CREATE POLICY "Customers can view their own data" ON customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Customers can update their own data" ON customers
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for drivers
CREATE POLICY "Drivers can view their own data" ON drivers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Drivers can update their own data" ON drivers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Customers can view assigned drivers" ON drivers
  FOR SELECT USING (
    id IN (
      SELECT driver_id FROM jobs WHERE customer_id = auth.uid()
    )
  );

-- RLS Policies for vehicles
CREATE POLICY "Customers can manage their own vehicles" ON vehicles
  FOR ALL USING (customer_id = auth.uid());

-- RLS Policies for service_locations
CREATE POLICY "Customers can manage their own locations" ON service_locations
  FOR ALL USING (customer_id = auth.uid());

-- RLS Policies for jobs
CREATE POLICY "Customers can view their own jobs" ON jobs
  FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Drivers can view their assigned jobs" ON jobs
  FOR SELECT USING (driver_id = auth.uid());

CREATE POLICY "Customers can create jobs" ON jobs
  FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Customers can update their own jobs" ON jobs
  FOR UPDATE USING (customer_id = auth.uid());

CREATE POLICY "Drivers can update their assigned jobs" ON jobs
  FOR UPDATE USING (driver_id = auth.uid());

-- RLS Policies for payment_methods
CREATE POLICY "Customers can manage their own payment methods" ON payment_methods
  FOR ALL USING (customer_id = auth.uid());

-- RLS Policies for transactions
CREATE POLICY "Customers can view their own transactions" ON transactions
  FOR SELECT USING (customer_id = auth.uid());

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Function to automatically create profile after user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get nearby available drivers
CREATE OR REPLACE FUNCTION get_nearby_drivers(
  job_lat DOUBLE PRECISION,
  job_lng DOUBLE PRECISION,
  radius_km DOUBLE PRECISION DEFAULT 50
)
RETURNS TABLE (
  driver_id UUID,
  driver_name TEXT,
  distance_km DOUBLE PRECISION,
  rating DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    p.full_name,
    (
      6371 * acos(
        cos(radians(job_lat)) * cos(radians(d.current_latitude)) *
        cos(radians(d.current_longitude) - radians(job_lng)) +
        sin(radians(job_lat)) * sin(radians(d.current_latitude))
      )
    ) as distance,
    d.rating
  FROM drivers d
  JOIN profiles p ON d.id = p.id
  WHERE d.status = 'online'
    AND d.is_approved = TRUE
    AND d.is_active = TRUE
    AND d.current_latitude IS NOT NULL
    AND d.current_longitude IS NOT NULL
  HAVING distance <= radius_km
  ORDER BY distance ASC;
END;
$$ LANGUAGE plpgsql;
