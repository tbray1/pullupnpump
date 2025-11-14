'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage() {
  const [locations, setLocations] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadLocations()
  }, [])

  const loadLocations = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('service_locations')
      .select('*')
      .eq('customer_id', user.id)
      .order('is_default', { ascending: false })

    if (data) setLocations(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // For MVP, use a simple geocoding approximation
      // In production, you would use Google Maps Geocoding API
      const lat = 37.7749 + (Math.random() - 0.5) * 0.1 // SF area
      const lng = -122.4194 + (Math.random() - 0.5) * 0.1

      const { error } = await supabase.from('service_locations').insert({
        customer_id: user.id,
        name: formData.name,
        address: formData.address,
        latitude: lat,
        longitude: lng,
        is_default: locations.length === 0,
      })

      if (error) throw error

      setShowForm(false)
      setFormData({ name: '', address: '', latitude: 0, longitude: 0 })
      loadLocations()
    } catch (error) {
      console.error('Error adding location:', error)
      alert('Failed to add location')
    } finally {
      setLoading(false)
    }
  }

  const handleSetDefault = async (locationId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    await supabase
      .from('service_locations')
      .update({ is_default: false })
      .eq('customer_id', user.id)

    await supabase.from('service_locations').update({ is_default: true }).eq('id', locationId)

    loadLocations()
  }

  const handleDelete = async (locationId: string) => {
    if (!confirm('Are you sure you want to delete this location?')) return

    const { error } = await supabase.from('service_locations').delete().eq('id', locationId)

    if (error) {
      alert('Failed to delete location')
    } else {
      loadLocations()
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>

        {/* Service Locations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Service Locations</h2>
            <button onClick={() => setShowForm(!showForm)} className="btn-primary">
              {showForm ? 'Cancel' : '+ Add Location'}
            </button>
          </div>

          {showForm && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Location</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="Home, Office, etc."
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="input-field"
                    placeholder="123 Main St, San Francisco, CA 94102"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Note: In production, this would use Google Maps autocomplete
                  </p>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full">
                  {loading ? 'Adding...' : 'Add Location'}
                </button>
              </form>
            </div>
          )}

          {locations.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {locations.map((location) => (
                <div key={location.id} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{location.address}</p>
                    </div>
                    {location.is_default && (
                      <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!location.is_default && (
                      <button
                        onClick={() => handleSetDefault(location.id)}
                        className="btn-secondary flex-1 text-sm"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(location.id)}
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
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No locations yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Add a service location to get started
                </p>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  + Add Location
                </button>
              </div>
            )
          )}
        </div>
      </div>

      {/* Payment Methods Section (Placeholder) */}
      <div className="card bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Methods</h2>
        <p className="text-gray-600 mb-4">
          Stripe payment integration will be configured here. This is a placeholder for the MVP.
        </p>
        <button disabled className="btn-secondary opacity-50 cursor-not-allowed">
          + Add Payment Method
        </button>
      </div>
    </div>
  )
}
