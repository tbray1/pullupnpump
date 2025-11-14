'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { formatCurrency, calculateJobTotal, getFuelPrices } from '@/lib/utils'
import { STRIPE_CONFIG } from '@/lib/stripe/config'

export default function RequestFuelPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [locations, setLocations] = useState<any[]>([])
  const [selectedVehicle, setSelectedVehicle] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [fuelType, setFuelType] = useState<'regular' | 'premium' | 'diesel'>('regular')
  const [gallons, setGallons] = useState(10)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const [vehiclesData, locationsData] = await Promise.all([
      supabase.from('vehicles').select('*').eq('customer_id', user.id),
      supabase.from('service_locations').select('*').eq('customer_id', user.id),
    ])

    if (vehiclesData.data) {
      setVehicles(vehiclesData.data)
      const defaultVehicle = vehiclesData.data.find((v) => v.is_default)
      if (defaultVehicle) setSelectedVehicle(defaultVehicle.id)
    }

    if (locationsData.data) {
      setLocations(locationsData.data)
      const defaultLocation = locationsData.data.find((l) => l.is_default)
      if (defaultLocation) setSelectedLocation(defaultLocation.id)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!selectedVehicle || !selectedLocation) {
        throw new Error('Please select a vehicle and location')
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const location = locations.find((l) => l.id === selectedLocation)
      if (!location) throw new Error('Location not found')

      const prices = getFuelPrices()
      const pricePerGallon = prices[fuelType]
      const totalAmount = calculateJobTotal(gallons, pricePerGallon, STRIPE_CONFIG.serviceFee)

      // Create job
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert({
          customer_id: user.id,
          vehicle_id: selectedVehicle,
          service_location_id: selectedLocation,
          fuel_type: fuelType,
          gallons_requested: gallons,
          delivery_latitude: location.latitude,
          delivery_longitude: location.longitude,
          delivery_address: location.address,
          price_per_gallon: pricePerGallon,
          service_fee: STRIPE_CONFIG.serviceFee,
          total_amount: totalAmount,
          status: 'pending',
          is_asap: true,
          notes,
        })
        .select()
        .single()

      if (jobError) throw jobError

      // Redirect to tracking page
      router.push(`/customer/track/${job.id}`)
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const prices = getFuelPrices()
  const pricePerGallon = prices[fuelType]
  const totalAmount = calculateJobTotal(gallons, pricePerGallon, STRIPE_CONFIG.serviceFee)

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Request Fuel Delivery</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Vehicle Selection */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Vehicle</h2>
          {vehicles.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No vehicles found</p>
              <a href="/customer/vehicles" className="text-primary-600 font-medium hover:underline">
                Add a vehicle →
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {vehicles.map((vehicle) => (
                <label
                  key={vehicle.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedVehicle === vehicle.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="vehicle"
                    value={vehicle.id}
                    checked={selectedVehicle === vehicle.id}
                    onChange={(e) => setSelectedVehicle(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-sm text-gray-600">{vehicle.color}</p>
                    </div>
                    {vehicle.is_default && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Location Selection */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Location</h2>
          {locations.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No locations found</p>
              <a href="/customer/settings" className="text-primary-600 font-medium hover:underline">
                Add a location →
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {locations.map((location) => (
                <label
                  key={location.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedLocation === location.id
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="location"
                    value={location.id}
                    checked={selectedLocation === location.id}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{location.name}</p>
                      <p className="text-sm text-gray-600">{location.address}</p>
                    </div>
                    {location.is_default && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Fuel Selection */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Fuel Type</h2>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setFuelType('regular')}
              className={`p-4 border-2 rounded-lg transition-colors ${
                fuelType === 'regular'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-gray-900">Regular</p>
              <p className="text-sm text-gray-600">{formatCurrency(prices.regular)}/gal</p>
            </button>
            <button
              type="button"
              onClick={() => setFuelType('premium')}
              className={`p-4 border-2 rounded-lg transition-colors ${
                fuelType === 'premium'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-gray-900">Premium</p>
              <p className="text-sm text-gray-600">{formatCurrency(prices.premium)}/gal</p>
            </button>
            <button
              type="button"
              onClick={() => setFuelType('diesel')}
              className={`p-4 border-2 rounded-lg transition-colors ${
                fuelType === 'diesel'
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-gray-900">Diesel</p>
              <p className="text-sm text-gray-600">{formatCurrency(prices.diesel)}/gal</p>
            </button>
          </div>
        </div>

        {/* Gallons */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Amount (Gallons)</h2>
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={gallons}
            onChange={(e) => setGallons(Number(e.target.value))}
            className="w-full mb-2"
          />
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-primary-600">{gallons} gallons</span>
            <span className="text-gray-600">
              {formatCurrency(gallons * pricePerGallon)} + {formatCurrency(STRIPE_CONFIG.serviceFee)} fee
            </span>
          </div>
        </div>

        {/* Notes */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Special Instructions (Optional)</h2>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field"
            rows={3}
            placeholder="e.g., Park on street, gate code is 1234..."
          />
        </div>

        {/* Total */}
        <div className="card bg-primary-50 border-2 border-primary-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(totalAmount)}</p>
            </div>
            <button
              type="submit"
              disabled={loading || vehicles.length === 0 || locations.length === 0}
              className="btn-primary text-lg px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Requesting...' : 'Request Delivery'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
