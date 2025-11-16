'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useParams, useRouter } from 'next/navigation'
import { formatDateTime, formatCurrency, formatStatus, getStatusColor } from '@/lib/utils'

export default function DriverJobPage() {
  const [job, setJob] = useState<any>(null)
  const [gallonsDelivered, setGallonsDelivered] = useState('')
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const router = useRouter()
  const supabase = createClient()
  const jobId = typeof params.id === 'string' ? params.id : ''

  useEffect(() => {
    if (!jobId) return
    loadJob()
  }, [jobId])

  const loadJob = async () => {
    if (!jobId) return
    const { data, error } = await supabase
      .from('jobs')
      .select(`
        *,
        vehicles (make, model, year, color),
        service_locations (name, address),
        customers!jobs_customer_id_fkey (
          id,
          profiles!customers_id_fkey (full_name, phone)
        )
      `)
      .eq('id', jobId)
      .single()

    if (data) {
      setJob(data)
      if (data.gallons_requested) {
        setGallonsDelivered(data.gallons_requested.toString())
      }
    }
  }

  const updateJobStatus = async (newStatus: string, additionalData = {}) => {
    setLoading(true)

    try {
      const updates: any = {
        status: newStatus,
        ...additionalData,
      }

      // Add timestamps based on status
      if (newStatus === 'en_route') {
        // Update driver location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
              await supabase
                .from('drivers')
                .update({
                  current_latitude: position.coords.latitude,
                  current_longitude: position.coords.longitude,
                  current_location_updated_at: new Date().toISOString(),
                })
                .eq('id', user.id)
            }
          })
        }
      } else if (newStatus === 'arrived') {
        updates.arrived_at = new Date().toISOString()
      } else if (newStatus === 'fueling') {
        updates.started_fueling_at = new Date().toISOString()
      } else if (newStatus === 'completed') {
        updates.completed_at = new Date().toISOString()
        updates.gallons_delivered = parseFloat(gallonsDelivered) || job.gallons_requested

        // Update driver stats
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: driver } = await supabase
            .from('drivers')
            .select('total_deliveries')
            .eq('id', user.id)
            .single()

          await supabase
            .from('drivers')
            .update({
              total_deliveries: (driver?.total_deliveries || 0) + 1,
              status: 'online',
            })
            .eq('id', user.id)
        }
      }

      const { error } = await supabase
        .from('jobs')
        .update(updates)
        .eq('id', jobId)

      if (error) throw error

      if (newStatus === 'completed') {
        router.push('/driver')
      } else {
        loadJob()
      }
    } catch (error) {
      console.error('Error updating job:', error)
      alert('Failed to update job status')
    } finally {
      setLoading(false)
    }
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-600">Loading job details...</p>
      </div>
    )
  }

  const customerInfo = job.customers?.profiles

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Delivery Job</h1>
        <span className={`status-badge text-lg ${getStatusColor(job.status)}`}>
          {formatStatus(job.status)}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer Info */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium text-gray-900">{customerInfo?.full_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium text-gray-900">
                <a href={`tel:${customerInfo?.phone}`} className="text-primary-600 hover:underline">
                  {customerInfo?.phone || 'N/A'}
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Details */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Vehicle</p>
              <p className="font-medium text-gray-900">
                {job.vehicles?.year} {job.vehicles?.make} {job.vehicles?.model}
              </p>
              {job.vehicles?.color && (
                <p className="text-sm text-gray-600">{job.vehicles.color}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-600">Fuel Type</p>
              <p className="font-medium text-gray-900 capitalize">{job.fuel_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Requested Amount</p>
              <p className="font-medium text-gray-900">{job.gallons_requested} gallons</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Location */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Delivery Location</h2>
        <div className="space-y-2">
          <p className="font-medium text-gray-900">{job.service_locations?.name}</p>
          <p className="text-gray-600">{job.delivery_address}</p>
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${job.delivery_latitude},${job.delivery_longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 text-primary-600 hover:underline font-medium"
          >
            🗺️ Open in Google Maps →
          </a>
        </div>
        {job.notes && (
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm font-medium text-gray-900 mb-1">Special Instructions</p>
            <p className="text-sm text-gray-700">{job.notes}</p>
          </div>
        )}
      </div>

      {/* Payment Info */}
      <div className="card bg-gray-50">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Total Job Value</span>
            <span className="font-bold text-gray-900">{formatCurrency(job.total_amount)}</span>
          </div>
          <div className="flex items-center justify-between text-green-600">
            <span>Your Estimated Earnings (70%)</span>
            <span className="font-bold text-xl">
              {formatCurrency(job.total_amount * 0.7)}
            </span>
          </div>
        </div>
      </div>

      {/* Status Update Actions */}
      <div className="card bg-primary-50 border-2 border-primary-600">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Job Status</h2>

        {job.status === 'accepted' && (
          <button
            onClick={() => updateJobStatus('en_route')}
            disabled={loading}
            className="btn-primary w-full text-lg py-4"
          >
            {loading ? 'Updating...' : '🚚 I\'m On My Way'}
          </button>
        )}

        {job.status === 'en_route' && (
          <button
            onClick={() => updateJobStatus('arrived')}
            disabled={loading}
            className="btn-primary w-full text-lg py-4"
          >
            {loading ? 'Updating...' : '📍 I\'ve Arrived'}
          </button>
        )}

        {job.status === 'arrived' && (
          <button
            onClick={() => updateJobStatus('fueling')}
            disabled={loading}
            className="btn-primary w-full text-lg py-4"
          >
            {loading ? 'Updating...' : '⛽ Start Fueling'}
          </button>
        )}

        {job.status === 'fueling' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gallons Delivered
              </label>
              <input
                type="number"
                step="0.1"
                value={gallonsDelivered}
                onChange={(e) => setGallonsDelivered(e.target.value)}
                className="input-field"
                placeholder="Enter gallons delivered"
              />
            </div>
            <button
              onClick={() => updateJobStatus('completed')}
              disabled={loading || !gallonsDelivered}
              className="btn-primary w-full text-lg py-4"
            >
              {loading ? 'Completing...' : '✅ Complete Delivery'}
            </button>
          </div>
        )}

        {job.status === 'completed' && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Delivery Completed!
            </h3>
            <p className="text-gray-600 mb-6">
              Great job! Your earnings will be processed shortly.
            </p>
            <a href="/driver">
              <button className="btn-primary">Back to Dashboard</button>
            </a>
          </div>
        )}
      </div>

      {/* Back Button */}
      {job.status !== 'completed' && (
        <button onClick={() => router.push('/driver')} className="btn-secondary w-full">
          Back to Dashboard
        </button>
      )}
    </div>
  )
}
