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
          distance: driverData.current_latitude && driverData.current_longitude
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
        <div className="text-center">
          <div className="text-5xl mb-4 animate-pulse">📡</div>
          <p className="text-asphalt-300 font-display font-bold tracking-wider">SCANNING DISPATCH BOARD...</p>
        </div>
      </div>
    )
  }

  if (!driver?.is_approved) {
    return (
      <div className="card text-center py-16 max-w-2xl mx-auto">
        <div className="text-7xl mb-6">⚠️</div>
        <h3 className="font-display font-bold text-3xl text-asphalt-100 mb-3">
          ACCOUNT PENDING APPROVAL
        </h3>
        <p className="text-asphalt-400 text-lg">
          You cannot accept jobs until your account is approved
        </p>
      </div>
    )
  }

  if (driver?.status !== 'online') {
    return (
      <div className="card text-center py-16 max-w-2xl mx-auto">
        <div className="text-7xl mb-6">📴</div>
        <h3 className="font-display font-bold text-3xl text-asphalt-100 mb-3">
          YOU'RE OFFLINE
        </h3>
        <p className="text-asphalt-400 text-lg mb-8">
          Go online to see available delivery jobs
        </p>
        <a href="/driver">
          <button className="btn-primary">Go to Dashboard</button>
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-fuel-500 rounded-full animate-pulse shadow-lg shadow-fuel-500/50"></div>
            <span className="text-fuel-400 font-bold text-sm tracking-widest">ONLINE • READY FOR DISPATCH</span>
          </div>
          <h1 className="font-display font-bold text-5xl text-asphalt-100 tracking-tight">
            AVAILABLE JOBS
          </h1>
        </div>
        <button
          onClick={loadData}
          className="btn-secondary flex items-center gap-2"
        >
          <span>🔄</span>
          <span>REFRESH BOARD</span>
        </button>
      </div>

      {/* Job Count Badge */}
      {jobs.length > 0 && (
        <div className="inline-block bg-caution-500/20 border border-caution-500/40 px-4 py-2"
             style={{clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'}}>
          <span className="text-caution-300 font-display font-bold tracking-wider">
            {jobs.length} ACTIVE {jobs.length === 1 ? 'DELIVERY' : 'DELIVERIES'} AVAILABLE
          </span>
        </div>
      )}

      {jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job, index) => (
            <div key={job.id} className="card hover:border-fuel-500/30 transition-all duration-300" style={{animationDelay: `${index * 50}ms`}}>
              <div className="flex items-start justify-between gap-6 flex-wrap">
                <div className="flex-1 min-w-[300px]">
                  {/* Job Header */}
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <div className="bg-fuel-500/20 border border-fuel-500/40 px-3 py-1"
                         style={{clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'}}>
                      <span className="text-fuel-400 font-bold text-xs tracking-widest">NEW DISPATCH</span>
                    </div>
                    {job.distance !== null && (
                      <span className="text-asphalt-400 text-sm font-semibold">
                        📍 {job.distance.toFixed(1)} km
                      </span>
                    )}
                    <span className="text-asphalt-500 text-sm">
                      {formatDateTime(job.created_at)}
                    </span>
                  </div>

                  {/* Vehicle */}
                  <h3 className="font-display font-bold text-2xl text-asphalt-100 mb-3">
                    {job.vehicles?.year} {job.vehicles?.make} {job.vehicles?.model}
                  </h3>

                  {/* Location */}
                  <div className="flex items-start gap-2 mb-4 text-asphalt-300">
                    <span className="text-caution-400">📍</span>
                    <span>{job.delivery_address}</span>
                  </div>

                  {/* Job Details Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-asphalt-700">
                    <div>
                      <p className="text-xs text-asphalt-500 font-bold tracking-widest mb-1">FUEL TYPE</p>
                      <p className="text-asphalt-100 font-semibold capitalize">{job.fuel_type}</p>
                    </div>
                    <div>
                      <p className="text-xs text-asphalt-500 font-bold tracking-widest mb-1">AMOUNT</p>
                      <p className="text-asphalt-100 font-semibold">{job.gallons_requested} gal</p>
                    </div>
                  </div>

                  {/* Notes */}
                  {job.notes && (
                    <div className="bg-asphalt-800/50 p-3 border-l-2 border-caution-500">
                      <p className="text-xs text-asphalt-500 font-bold tracking-widest mb-1">SPECIAL NOTES</p>
                      <p className="text-asphalt-300 text-sm">{job.notes}</p>
                    </div>
                  )}
                </div>

                {/* Earnings & Action */}
                <div className="text-right min-w-[200px] flex flex-col items-end gap-3">
                  <div className="w-full bg-asphalt-800/60 p-4 border border-asphalt-700"
                       style={{clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'}}>
                    <p className="text-xs text-asphalt-500 font-bold tracking-widest mb-1">CUSTOMER PAYS</p>
                    <p className="font-display font-bold text-3xl text-asphalt-100 mb-3">
                      {formatCurrency(job.total_amount)}
                    </p>
                    <div className="h-1 bg-asphalt-700 mb-3"></div>
                    <p className="text-xs text-asphalt-500 font-bold tracking-widest mb-1">YOUR EARNINGS</p>
                    <p className="font-display font-bold text-2xl text-fuel-400" style={{textShadow: '0 0 15px rgba(34, 197, 94, 0.3)'}}>
                      ~{formatCurrency(job.total_amount * 0.7)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAcceptJob(job.id)}
                    className="btn-primary w-full"
                  >
                    ACCEPT DISPATCH
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-20">
          <div className="text-8xl mb-6 opacity-50">📭</div>
          <h3 className="font-display font-bold text-3xl text-asphalt-100 mb-3">
            NO ACTIVE DELIVERIES
          </h3>
          <p className="text-asphalt-400 text-lg">
            Check back soon for new dispatch requests
          </p>
          <div className="mt-8 max-w-md mx-auto">
            <div className="fuel-gauge">
              <div className="fuel-gauge-fill bg-asphalt-600 shadow-none" style={{animationDuration: '3s'}}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
