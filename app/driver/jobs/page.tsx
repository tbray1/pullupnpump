'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatDateTime, formatCurrency, calculateDistance } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function AvailableJobsPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [driver, setDriver] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    loadData()

    // Subscribe to new jobs
    const channel = supabase
      .channel('new-jobs')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'jobs',
        },
        () => {
          loadData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      // Get driver info
      const { data: driverData } = await supabase
        .from('drivers')
        .select('*')
        .eq('id', user.id)
        .single()

      setDriver(driverData)

      // Get available jobs (pending or unassigned)
      const { data: jobsData } = await supabase
        .from('jobs')
        .select(`
          *,
          vehicles (make, model, year),
          service_locations (name, address)
        `)
        .eq('status', 'pending')
        .is('driver_id', null)
        .order('created_at', { ascending: false })
        .limit(20)

      if (jobsData && driverData) {
        // Calculate distances
        const jobsWithDistance = jobsData.map((job) => ({
          ...job,
          distance: driverData.current_latitude
            ? calculateDistance(
                driverData.current_latitude,
                driverData.current_longitude,
                job.delivery_latitude,
                job.delivery_longitude
              )
            : null,
        }))

        // Sort by distance
        jobsWithDistance.sort((a, b) => {
          if (a.distance === null) return 1
          if (b.distance === null) return -1
          return a.distance - b.distance
        })

        setJobs(jobsWithDistance)
      }
    } catch (error) {
      console.error('Error loading jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptJob = async (jobId: string) => {
    if (!driver) return

    try {
      const { error } = await supabase
        .from('jobs')
        .update({
          driver_id: driver.id,
          status: 'accepted',
        })
        .eq('id', jobId)

      if (error) throw error

      // Update driver status
      await supabase
        .from('drivers')
        .update({ status: 'busy' })
        .eq('id', driver.id)

      router.push(`/driver/job/${jobId}`)
    } catch (error) {
      console.error('Error accepting job:', error)
      alert('Failed to accept job')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-gray-600">Loading available jobs...</p>
      </div>
    )
  }

  if (!driver?.is_approved) {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Account Pending Approval
        </h3>
        <p className="text-gray-600">
          You cannot accept jobs until your account is approved
        </p>
      </div>
    )
  }

  if (driver?.status !== 'online') {
    return (
      <div className="card text-center py-12">
        <div className="text-6xl mb-4">📴</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          You're Offline
        </h3>
        <p className="text-gray-600 mb-6">
          Go online to see available delivery jobs
        </p>
        <a href="/driver">
          <button className="btn-primary">Go to Dashboard</button>
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Available Jobs</h1>
        <button
          onClick={loadData}
          className="btn-secondary"
        >
          🔄 Refresh
        </button>
      </div>

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="card hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-semibold text-primary-600">
                      NEW JOB
                    </span>
                    {job.distance !== null && (
                      <span className="text-sm text-gray-600">
                        📍 {job.distance.toFixed(1)} km away
                      </span>
                    )}
                    <span className="text-sm text-gray-600">
                      {formatDateTime(job.created_at)}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {job.vehicles?.year} {job.vehicles?.make} {job.vehicles?.model}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    📍 {job.delivery_address}
                  </p>
                  <div className="flex items-center gap-4 text-sm mb-4">
                    <span className="text-gray-600">
                      <span className="font-medium">Fuel:</span> {job.fuel_type}
                    </span>
                    <span className="text-gray-600">
                      <span className="font-medium">Amount:</span>{' '}
                      {job.gallons_requested} gal
                    </span>
                  </div>
                  {job.notes && (
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <span className="font-medium">Notes:</span> {job.notes}
                    </p>
                  )}
                </div>
                <div className="text-right ml-6">
                  <p className="text-sm text-gray-600 mb-1">Customer Pays</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {formatCurrency(job.total_amount)}
                  </p>
                  <p className="text-sm text-green-600 font-semibold mb-4">
                    You earn ~{formatCurrency(job.total_amount * 0.7)}
                  </p>
                  <button
                    onClick={() => handleAcceptJob(job.id)}
                    className="btn-primary px-6"
                  >
                    Accept Job
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📭</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Available Jobs
          </h3>
          <p className="text-gray-600">
            Check back soon for new delivery requests
          </p>
        </div>
      )}
    </div>
  )
}
