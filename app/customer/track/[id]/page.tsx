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
  const jobId = typeof params.id === 'string' ? params.id : ''

  useEffect(() => {
    if (!jobId) return
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
          filter: `id=eq.${jobId}`,
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
  }, [jobId])

  const loadJob = async () => {
    if (!jobId) return
    try {
      const { data: jobData, error } = await supabase
        .from('jobs')
        .select(`
          *,
          vehicles (make, model, year, color),
          service_locations (name, address)
        `)
        .eq('id', jobId)
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
        .eq('id', jobId)

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
          <div className="text-4xl mb-4 animate-pulse">⏳</div>
          <p className="text-asphalt-300 font-display font-semibold tracking-wide">LOADING DELIVERY DATA...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-asphalt-300 font-display font-semibold tracking-wide">DELIVERY NOT FOUND</p>
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
    <div className="max-w-6xl mx-auto space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-asphalt-100 tracking-tight mb-2">
            TRACK DELIVERY
          </h1>
          <p className="text-asphalt-400 font-medium">Order #{jobId.slice(0, 8).toUpperCase()}</p>
        </div>
        <span className={`status-badge text-base ${getStatusColor(job.status)}`}>
          {formatStatus(job.status)}
        </span>
      </div>

      {/* Status Timeline - Highway Road */}
      {job.status !== 'cancelled' && (
        <div className="card bg-asphalt-800/80 p-8">
          <div className="relative">
            {/* Road */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-asphalt-600"></div>
            <div className="absolute top-8 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-fuel-500/20 to-transparent"
                 style={{width: `${(currentStatusIndex / (statusSteps.length - 1)) * 100}%`}}></div>

            <div className="flex items-start justify-between relative">
              {statusSteps.map((step, index) => {
                const isActive = index <= currentStatusIndex
                const isCurrent = index === currentStatusIndex

                return (
                  <div key={step.key} className="flex flex-col items-center" style={{flex: '1 1 0'}}>
                    <div
                      className={`w-16 h-16 flex items-center justify-center text-3xl mb-3 relative z-10 transition-all duration-500 ${
                        isActive
                          ? 'bg-fuel-500 shadow-lg shadow-fuel-500/50'
                          : 'bg-asphalt-700 border-2 border-asphalt-600'
                      }`}
                      style={{
                        clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
                        transform: isCurrent ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      {step.icon}
                      {isCurrent && (
                        <div className="absolute inset-0 border-2 border-fuel-400 animate-ping"
                             style={{clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'}}></div>
                      )}
                    </div>
                    <p
                      className={`text-xs text-center font-bold tracking-wider max-w-[80px] ${
                        isActive ? 'text-asphalt-100' : 'text-asphalt-500'
                      }`}
                    >
                      {step.label.toUpperCase()}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Delivery Details */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-fuel-500"></div>
            <h2 className="font-display font-bold text-2xl text-asphalt-100 tracking-tight">DELIVERY DETAILS</h2>
          </div>
          <div className="space-y-4">
            <div className="pb-4 border-b border-asphalt-700">
              <p className="text-xs text-asphalt-500 font-bold tracking-widest mb-1">VEHICLE</p>
              <p className="font-semibold text-asphalt-100 text-lg">
                {job.vehicles?.year} {job.vehicles?.make} {job.vehicles?.model}
              </p>
            </div>
            <div className="pb-4 border-b border-asphalt-700">
              <p className="text-xs text-asphalt-500 font-bold tracking-widest mb-1">LOCATION</p>
              <p className="font-semibold text-asphalt-100">{job.service_locations?.name}</p>
              <p className="text-sm text-asphalt-400 mt-1">📍 {job.delivery_address}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-asphalt-700">
              <div>
                <p className="text-xs text-asphalt-500 font-bold tracking-widest mb-1">FUEL TYPE</p>
                <p className="font-semibold text-asphalt-100 capitalize">{job.fuel_type}</p>
              </div>
              <div>
                <p className="text-xs text-asphalt-500 font-bold tracking-widest mb-1">AMOUNT</p>
                <p className="font-semibold text-asphalt-100">
                  {job.gallons_delivered || job.gallons_requested} gal
                </p>
              </div>
            </div>
            <div className="pb-4 border-b border-asphalt-700">
              <p className="text-xs text-asphalt-500 font-bold tracking-widest mb-1">REQUESTED</p>
              <p className="font-semibold text-asphalt-100">{formatDateTime(job.created_at)}</p>
            </div>
            {job.notes && (
              <div className="bg-asphalt-800/50 p-4 border-l-2 border-caution-500">
                <p className="text-xs text-asphalt-500 font-bold tracking-widest mb-2">SPECIAL INSTRUCTIONS</p>
                <p className="text-asphalt-200">{job.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Driver Info */}
        <div className="card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-caution-500"></div>
            <h2 className="font-display font-bold text-2xl text-asphalt-100 tracking-tight">
              {driver ? 'DRIVER INFO' : 'FINDING DRIVER'}
            </h2>
          </div>
          {driver ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4 pb-4 border-b border-asphalt-700">
                <div className="w-20 h-20 bg-asphalt-700 flex items-center justify-center text-4xl border-2 border-asphalt-600"
                     style={{clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'}}>
                  👤
                </div>
                <div className="flex-1">
                  <p className="font-display font-bold text-xl text-asphalt-100">{driver.profiles?.full_name}</p>
                  <p className="text-sm text-asphalt-400">{driver.vehicle_info || 'Fuel Delivery Truck'}</p>
                  {driver.rating && (
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-caution-400">⭐</span>
                      <span className="text-sm font-semibold text-asphalt-300">{driver.rating.toFixed(1)} rating</span>
                    </div>
                  )}
                </div>
              </div>
              {job.status === 'en_route' && job.estimated_arrival && (
                <div className="bg-fuel-500/10 p-4 border border-fuel-500/30">
                  <p className="text-xs text-fuel-400 font-bold tracking-widest mb-2">ESTIMATED ARRIVAL</p>
                  <p className="font-display font-bold text-xl text-fuel-300">{formatDateTime(job.estimated_arrival)}</p>
                  <div className="mt-3 fuel-gauge">
                    <div className="fuel-gauge-fill"></div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4 animate-pulse">🔍</div>
              <p className="text-asphalt-400 font-semibold">Searching for available driver...</p>
              <div className="mt-4 max-w-xs mx-auto">
                <div className="h-1 bg-asphalt-700 rounded-full overflow-hidden">
                  <div className="h-full bg-caution-500 animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="card bg-asphalt-800/80 border-2 border-asphalt-700">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 bg-blue-500"></div>
          <h2 className="font-display font-bold text-2xl text-asphalt-100 tracking-tight">PAYMENT SUMMARY</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <span className="text-asphalt-400">
              {job.gallons_delivered || job.gallons_requested} gal × {formatCurrency(job.price_per_gallon)}
            </span>
            <span className="font-semibold text-asphalt-100">
              {formatCurrency((job.gallons_delivered || job.gallons_requested) * job.price_per_gallon)}
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-asphalt-700">
            <span className="text-asphalt-400">Service Fee</span>
            <span className="font-semibold text-asphalt-100">{formatCurrency(job.service_fee)}</span>
          </div>
          <div className="flex items-center justify-between pt-4">
            <span className="font-display font-bold text-lg text-asphalt-100 tracking-wide">TOTAL</span>
            <span className="font-display font-bold text-3xl text-fuel-400" style={{textShadow: '0 0 20px rgba(34, 197, 94, 0.3)'}}>
              {formatCurrency(job.total_amount)}
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => router.push('/customer')}
          className="btn-secondary flex-1 min-w-[200px]"
        >
          ← Back to Dashboard
        </button>
        {job.status !== 'completed' && job.status !== 'cancelled' && (
          <button
            onClick={handleCancelJob}
            className="btn-primary bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
            style={{boxShadow: '0 0 20px rgba(220, 38, 38, 0.3)'}}
          >
            Cancel Delivery
          </button>
        )}
      </div>
    </div>
  )
}
