'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { formatDateTime, formatCurrency, formatStatus, getStatusColor } from '@/lib/utils'

export default function DriverDashboard() {
  const [driver, setDriver] = useState<any>(null)
  const [activeJobs, setActiveJobs] = useState<any[]>([])
  const [stats, setStats] = useState({
    today_jobs: 0,
    today_earnings: 0,
    week_jobs: 0,
    week_earnings: 0,
  })
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    // Load driver data
    const { data: driverData } = await supabase
      .from('drivers')
      .select('*')
      .eq('id', user.id)
      .single()

    if (driverData) setDriver(driverData)

    // Load active jobs
    const { data: jobsData } = await supabase
      .from('jobs')
      .select(`
        *,
        vehicles (make, model, year),
        service_locations (name, address)
      `)
      .eq('driver_id', user.id)
      .in('status', ['accepted', 'en_route', 'arrived', 'fueling'])
      .order('created_at', { ascending: false })

    if (jobsData) setActiveJobs(jobsData)

    // Calculate stats (simplified for MVP)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: completedToday } = await supabase
      .from('jobs')
      .select('total_amount')
      .eq('driver_id', user.id)
      .eq('status', 'completed')
      .gte('completed_at', today.toISOString())

    const todayEarnings = completedToday?.reduce((sum, job) => sum + (job.total_amount * 0.7), 0) || 0

    setStats({
      today_jobs: completedToday?.length || 0,
      today_earnings: todayEarnings,
      week_jobs: 0,
      week_earnings: 0,
    })
  }

  const handleToggleOnline = async () => {
    if (!driver) return
    setLoading(true)

    try {
      const newStatus = driver.status === 'online' ? 'offline' : 'online'

      // Get current location (simplified for MVP)
      if (navigator.geolocation && newStatus === 'online') {
        navigator.geolocation.getCurrentPosition(async (position) => {
          const { error } = await supabase
            .from('drivers')
            .update({
              status: newStatus,
              current_latitude: position.coords.latitude,
              current_longitude: position.coords.longitude,
              current_location_updated_at: new Date().toISOString(),
            })
            .eq('id', driver.id)

          if (!error) {
            setDriver({ ...driver, status: newStatus })
          }
        })
      } else {
        const { error } = await supabase
          .from('drivers')
          .update({ status: newStatus })
          .eq('id', driver.id)

        if (!error) {
          setDriver({ ...driver, status: newStatus })
        }
      }
    } catch (error) {
      console.error('Error toggling status:', error)
      alert('Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  if (!driver) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Status Card */}
      <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {driver.status === 'online' ? 'You\'re Online' : 'You\'re Offline'}
            </h2>
            <p className="text-primary-100">
              {driver.status === 'online'
                ? 'Ready to accept delivery jobs'
                : 'Go online to start receiving jobs'}
            </p>
          </div>
          <button
            onClick={handleToggleOnline}
            disabled={loading || !driver.is_approved}
            className={`px-8 py-3 rounded-lg font-semibold transition-colors ${
              driver.status === 'online'
                ? 'bg-white text-primary-600 hover:bg-gray-100'
                : 'bg-primary-700 text-white hover:bg-primary-800'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {loading ? 'Updating...' : driver.status === 'online' ? 'Go Offline' : 'Go Online'}
          </button>
        </div>
      </div>

      {!driver.is_approved && (
        <div className="card bg-yellow-50 border-2 border-yellow-200">
          <div className="flex items-start gap-4">
            <div className="text-4xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-yellow-900 mb-1">
                Account Pending Approval
              </h3>
              <p className="text-yellow-800">
                Your driver account is under review. You'll be able to go online once approved by an administrator.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Today's Jobs</p>
          <p className="text-3xl font-bold text-gray-900">{stats.today_jobs}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Today's Earnings</p>
          <p className="text-3xl font-bold text-gray-900">
            {formatCurrency(stats.today_earnings)}
          </p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Total Deliveries</p>
          <p className="text-3xl font-bold text-gray-900">{driver.total_deliveries || 0}</p>
        </div>
        <div className="card">
          <p className="text-sm text-gray-600 mb-1">Rating</p>
          <p className="text-3xl font-bold text-gray-900">
            {driver.rating ? `⭐ ${driver.rating.toFixed(1)}` : 'N/A'}
          </p>
        </div>
      </div>

      {/* Active Jobs */}
      {activeJobs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Active Deliveries</h2>
          <div className="space-y-4">
            {activeJobs.map((job) => (
              <Link href={`/driver/job/${job.id}`} key={job.id}>
                <div className="card hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`status-badge ${getStatusColor(job.status)}`}>
                          {formatStatus(job.status)}
                        </span>
                        <span className="text-sm text-gray-600">
                          {formatDateTime(job.created_at)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {job.vehicles?.year} {job.vehicles?.make} {job.vehicles?.model}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {job.delivery_address}
                      </p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-600">
                          <span className="font-medium">Fuel:</span> {job.fuel_type}
                        </span>
                        <span className="text-gray-600">
                          <span className="font-medium">Amount:</span>{' '}
                          {job.gallons_requested} gal
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(job.total_amount)}
                      </p>
                      <p className="text-sm text-gray-600">
                        Est. earn: {formatCurrency(job.total_amount * 0.7)}
                      </p>
                      <p className="text-sm text-primary-600 font-medium mt-1">
                        Manage →
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {driver.is_approved && driver.status === 'online' && activeJobs.length === 0 && (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">👀</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Looking for deliveries...
          </h3>
          <p className="text-gray-600 mb-6">
            New delivery requests will appear here
          </p>
          <Link href="/driver/jobs">
            <button className="btn-primary">View Available Jobs</button>
          </Link>
        </div>
      )}
    </div>
  )
}
