'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { formatDateTime, formatCurrency, formatStatus, getStatusColor } from '@/lib/utils'

export default function TrackJobPage() {
  const [job, setJob] = useState<any>(null)
  const [driver, setDriver] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadJob()

    // Subscribe to real-time updates
    const channel = supabase
      .channel('job-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'jobs',
          filter: `id=eq.${params.id}`,
        },
        (payload) => {
          setJob(payload.new)
          if (payload.new.driver_id) {
            loadDriver(payload.new.driver_id)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [params.id])

  const loadJob = async () => {
    try {
      const { data: jobData, error } = await supabase
        .from('jobs')
        .select(`
          *,
          vehicles (make, model, year, color),
          service_locations (name, address)
        `)
        .eq('id', params.id)
        .single()

      if (error) throw error

      setJob(jobData)

      if (jobData.driver_id) {
        loadDriver(jobData.driver_id)
      }
    } catch (error) {
      console.error('Error loading job:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadDriver = async (driverId: string) => {
    const { data: driverData } = await supabase
      .from('drivers')
      .select('*, profiles (full_name, phone)')
      .eq('id', driverId)
      .single()

    if (driverData) {
      setDriver(driverData)
    }
  }

  const handleCancelJob = async () => {
    if (!confirm('Are you sure you want to cancel this delivery?')) return

    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString(),
          cancellation_reason: 'Cancelled by customer',
        })
        .eq('id', params.id)

      if (error) throw error

      router.push('/customer')
    } catch (error) {
      console.error('Error cancelling job:', error)
      alert('Failed to cancel job')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Loading delivery details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-gray-600">Delivery not found</p>
        </div>
      </div>
    )
  }

  const statusSteps = [
    { key: 'pending', label: 'Order Placed', icon: '📋' },
    { key: 'assigned', label: 'Driver Assigned', icon: '👤' },
    { key: 'en_route', label: 'En Route', icon: '🚚' },
    { key: 'arrived', label: 'Arrived', icon: '📍' },
    { key: 'fueling', label: 'Fueling', icon: '⛽' },
    { key: 'completed', label: 'Completed', icon: '✅' },
  ]

  const currentStatusIndex = statusSteps.findIndex((s) => s.key === job.status)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Track Delivery</h1>
        <span className={`status-badge text-lg ${getStatusColor(job.status)}`}>
          {formatStatus(job.status)}
        </span>
      </div>

      {/* Status Timeline */}
      {job.status !== 'cancelled' && (
        <div className="card">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => (
              <div key={step.key} className="flex-1 flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${
                      index <= currentStatusIndex
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <p
                    className={`text-xs text-center ${
                      index <= currentStatusIndex
                        ? 'text-gray-900 font-semibold'
                        : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    className={`h-1 flex-1 ${
                      index < currentStatusIndex ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Delivery Details */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Vehicle</p>
              <p className="font-medium text-gray-900">
                {job.vehicles?.year} {job.vehicles?.make} {job.vehicles?.model}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="font-medium text-gray-900">{job.service_locations?.name}</p>
              <p className="text-sm text-gray-600">{job.delivery_address}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Fuel Type</p>
              <p className="font-medium text-gray-900 capitalize">{job.fuel_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-medium text-gray-900">
                {job.gallons_delivered || job.gallons_requested} gallons
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Requested</p>
              <p className="font-medium text-gray-900">{formatDateTime(job.created_at)}</p>
            </div>
            {job.notes && (
              <div>
                <p className="text-sm text-gray-600">Special Instructions</p>
                <p className="font-medium text-gray-900">{job.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Driver Info */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {driver ? 'Driver Information' : 'Finding Driver'}
          </h2>
          {driver ? (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                  👤
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{driver.profiles?.full_name}</p>
                  <p className="text-sm text-gray-600">{driver.vehicle_info || 'Fuel Delivery Truck'}</p>
                  {driver.rating && (
                    <p className="text-sm text-gray-600">⭐ {driver.rating.toFixed(1)} rating</p>
                  )}
                </div>
              </div>
              {job.status === 'en_route' && job.estimated_arrival && (
                <div className="bg-primary-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">Estimated Arrival</p>
                  <p className="font-semibold text-primary-700">{formatDateTime(job.estimated_arrival)}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-gray-600">Searching for available driver...</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="card bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">
              {job.gallons_delivered || job.gallons_requested} gallons × {formatCurrency(job.price_per_gallon)}
            </span>
            <span className="text-gray-900">
              {formatCurrency((job.gallons_delivered || job.gallons_requested) * job.price_per_gallon)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Service Fee</span>
            <span className="text-gray-900">{formatCurrency(job.service_fee)}</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="font-bold text-xl text-gray-900">{formatCurrency(job.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          onClick={() => router.push('/customer')}
          className="btn-secondary flex-1"
        >
          Back to Dashboard
        </button>
        {job.status !== 'completed' && job.status !== 'cancelled' && (
          <button
            onClick={handleCancelJob}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
          >
            Cancel Delivery
          </button>
        )}
      </div>
    </div>
  )
}
