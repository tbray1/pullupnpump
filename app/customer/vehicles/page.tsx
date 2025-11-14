'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    license_plate: '',
    fuel_type: 'regular' as 'regular' | 'premium' | 'diesel',
    tank_capacity: 15,
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadVehicles()
  }, [])

  const loadVehicles = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('vehicles')
      .select('*')
      .eq('customer_id', user.id)
      .order('is_default', { ascending: false })

    if (data) setVehicles(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('vehicles').insert({
        customer_id: user.id,
        ...formData,
        is_default: vehicles.length === 0,
      })

      if (error) throw error

      setShowForm(false)
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        color: '',
        license_plate: '',
        fuel_type: 'regular',
        tank_capacity: 15,
      })
      loadVehicles()
    } catch (error) {
      console.error('Error adding vehicle:', error)
      alert('Failed to add vehicle')
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async (vehicleId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Remove default from all vehicles
    await supabase
      .from('vehicles')
      .update({ is_default: false })
      .eq('customer_id', user.id)

    // Set new default
    await supabase.from('vehicles').update({ is_default: true }).eq('id', vehicleId)

    loadVehicles()
  }

  const handleDelete = async (vehicleId: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return

    const { error } = await supabase.from('vehicles').delete().eq('id', vehicleId)

    if (error) {
      alert('Failed to delete vehicle')
    } else {
      loadVehicles()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Vehicles</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Cancel' : '+ Add Vehicle'}
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Vehicle</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make
                </label>
                <input
                  type="text"
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  className="input-field"
                  placeholder="Toyota"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="input-field"
                  placeholder="Camry"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="input-field"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="input-field"
                  placeholder="Silver"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Plate (Optional)
                </label>
                <input
                  type="text"
                  value={formData.license_plate}
                  onChange={(e) => setFormData({ ...formData, license_plate: e.target.value })}
                  className="input-field"
                  placeholder="ABC-1234"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  value={formData.fuel_type}
                  onChange={(e) =>
                    setFormData({ ...formData, fuel_type: e.target.value as any })
                  }
                  className="input-field"
                  required
                >
                  <option value="regular">Regular</option>
                  <option value="premium">Premium</option>
                  <option value="diesel">Diesel</option>
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Adding...' : 'Add Vehicle'}
            </button>
          </form>
        </div>
      )}

      {vehicles.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="card">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h3>
                  {vehicle.color && (
                    <p className="text-sm text-gray-600">{vehicle.color}</p>
                  )}
                  {vehicle.license_plate && (
                    <p className="text-sm text-gray-600">
                      License: {vehicle.license_plate}
                    </p>
                  )}
                  <p className="text-sm text-gray-600 mt-2">
                    Fuel: <span className="font-medium capitalize">{vehicle.fuel_type}</span>
                  </p>
                </div>
                {vehicle.is_default && (
                  <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded">
                    Default
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                {!vehicle.is_default && (
                  <button
                    onClick={() => handleSetDefault(vehicle.id)}
                    className="btn-secondary flex-1 text-sm"
                  >
                    Set as Default
                  </button>
                )}
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-semibold rounded-lg transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        !showForm && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🚗</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No vehicles yet</h3>
            <p className="text-gray-600 mb-6">Add your first vehicle to get started</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              + Add Vehicle
            </button>
          </div>
        )
      )}
    </div>
  )
}
