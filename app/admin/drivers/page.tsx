'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatStatus, getStatusColor } from '@/lib/utils'

export default function DriversManagementPage() {
  const [drivers, setDrivers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadDrivers()
  }, [])

  const loadDrivers = async () => {
    const { data, error } = await supabase
      .from('drivers')
      .select(`
        *,
        profiles (full_name, email, phone)
      `)
      .order('created_at', { ascending: false })

    if (data) {
      setDrivers(data)
    }
    setLoading(false)
  }

  const handleApproveDriver = async (driverId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('drivers')
      .update({ is_approved: !currentStatus })
      .eq('id', driverId)

    if (!error) {
      loadDrivers()
    } else {
      alert('Failed to update driver status')
    }
  }

  const handleToggleActive = async (driverId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('drivers')
      .update({ is_active: !currentStatus })
      .eq('id', driverId)

    if (!error) {
      loadDrivers()
    } else {
      alert('Failed to update driver status')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-600">Loading drivers...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Driver Management</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Drivers</p>
          <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
        </div>
      </div>

      {drivers.length > 0 ? (
        <div className="space-y-4">
          {drivers.map((driver) => (
            <div key={driver.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {driver.profiles?.full_name}
                    </h3>
                    <span className={`status-badge ${getStatusColor(driver.status)}`}>
                      {formatStatus(driver.status)}
                    </span>
                    {driver.is_approved ? (
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded">
                        ✓ Approved
                      </span>
                    ) : (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                        ⏳ Pending
                      </span>
                    )}
                    {!driver.is_active && (
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                        Suspended
                      </span>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Email:</span>{' '}
                      <span className="text-gray-900">{driver.profiles?.email}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Phone:</span>{' '}
                      <span className="text-gray-900">
                        {driver.profiles?.phone || 'N/A'}
                      </span>
                    </div>
                    {driver.vehicle_info && (
                      <div>
                        <span className="text-gray-600">Vehicle:</span>{' '}
                        <span className="text-gray-900">{driver.vehicle_info}</span>
                      </div>
                    )}
                    {driver.license_number && (
                      <div>
                        <span className="text-gray-600">License:</span>{' '}
                        <span className="text-gray-900">{driver.license_number}</span>
                      </div>
                    )}
                    <div>
                      <span className="text-gray-600">Total Deliveries:</span>{' '}
                      <span className="text-gray-900">{driver.total_deliveries || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Rating:</span>{' '}
                      <span className="text-gray-900">
                        {driver.rating ? `⭐ ${driver.rating.toFixed(1)}` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="ml-6 flex flex-col gap-2">
                  <button
                    onClick={() => handleApproveDriver(driver.id, driver.is_approved)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      driver.is_approved
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {driver.is_approved ? 'Unapprove' : 'Approve'}
                  </button>
                  <button
                    onClick={() => handleToggleActive(driver.id, driver.is_active)}
                    className={`px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      driver.is_active
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {driver.is_active ? 'Suspend' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No drivers yet</h3>
          <p className="text-gray-600">
            Drivers who sign up will appear here for approval
          </p>
        </div>
      )}
    </div>
  )
}
