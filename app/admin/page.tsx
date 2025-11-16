import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatCurrency, formatStatus, getStatusColor } from '@/lib/utils'

export default async function AdminDashboard() {
  const supabase = await createClient()

  // Get stats
  const [
    { count: totalCustomers },
    { count: totalDrivers },
    { count: activeDrivers },
    { data: allJobs },
    { data: activeJobs },
  ] = await Promise.all([
    supabase.from('customers').select('*', { count: 'exact', head: true }),
    supabase.from('drivers').select('*', { count: 'exact', head: true }),
    supabase.from('drivers').select('*', { count: 'exact', head: true }).eq('status', 'online'),
    supabase.from('jobs').select('total_amount, status, created_at'),
    supabase
      .from('jobs')
      .select(`
        *,
        vehicles (make, model, year),
        drivers (id, profiles (full_name))
      `)
      .in('status', ['pending', 'assigned', 'accepted', 'en_route', 'arrived', 'fueling'])
      .order('created_at', { ascending: false }),
  ])

  // Calculate revenue
  const completedJobs = allJobs?.filter((j) => j.status === 'completed') || []
  const totalRevenue = completedJobs.reduce((sum, job) => sum + job.total_amount, 0)

  // Get today's stats
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayJobs = allJobs?.filter((j) => j.created_at && new Date(j.created_at) >= today) || []
  const todayRevenue = todayJobs
    .filter((j) => j.status === 'completed')
    .reduce((sum, job) => sum + job.total_amount, 0)

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-500/50"></div>
            <span className="text-blue-400 font-bold text-sm tracking-widest">COMMAND CENTER ONLINE</span>
          </div>
          <h1 className="font-display font-bold text-5xl text-asphalt-100 tracking-tight">
            ADMIN DASHBOARD
          </h1>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-600/20 to-blue-700/20 border-blue-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
          <p className="text-blue-300 text-xs font-bold tracking-widest mb-2 relative z-10">TOTAL CUSTOMERS</p>
          <p className="font-display font-bold text-5xl text-blue-400 mb-1 relative z-10" style={{textShadow: '0 0 20px rgba(59, 130, 246, 0.3)'}}>
            {totalCustomers || 0}
          </p>
        </div>
        <div className="card bg-gradient-to-br from-fuel-600/20 to-fuel-700/20 border-fuel-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-fuel-500/10 rounded-full blur-3xl"></div>
          <p className="text-fuel-300 text-xs font-bold tracking-widest mb-2 relative z-10">TOTAL DRIVERS</p>
          <p className="font-display font-bold text-5xl text-fuel-400 mb-1 relative z-10" style={{textShadow: '0 0 20px rgba(34, 197, 94, 0.3)'}}>
            {totalDrivers || 0}
          </p>
          <p className="text-fuel-300 text-sm font-semibold relative z-10">
            {activeDrivers || 0} online now
          </p>
        </div>
        <div className="card bg-gradient-to-br from-purple-600/20 to-purple-700/20 border-purple-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl"></div>
          <p className="text-purple-300 text-xs font-bold tracking-widest mb-2 relative z-10">TOTAL JOBS</p>
          <p className="font-display font-bold text-5xl text-purple-400 mb-1 relative z-10" style={{textShadow: '0 0 20px rgba(168, 85, 247, 0.3)'}}>
            {allJobs?.length || 0}
          </p>
          <p className="text-purple-300 text-sm font-semibold relative z-10">
            {activeJobs?.length || 0} active
          </p>
        </div>
        <div className="card bg-gradient-to-br from-caution-600/20 to-caution-700/20 border-caution-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-caution-500/10 rounded-full blur-3xl"></div>
          <p className="text-caution-300 text-xs font-bold tracking-widest mb-2 relative z-10">TOTAL REVENUE</p>
          <p className="font-display font-bold text-4xl text-caution-400 mb-1 relative z-10" style={{textShadow: '0 0 20px rgba(251, 191, 36, 0.3)'}}>
            {formatCurrency(totalRevenue)}
          </p>
          <p className="text-caution-300 text-sm font-semibold relative z-10">
            Today: {formatCurrency(todayRevenue)}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-blue-500"></div>
            <h3 className="font-display font-bold text-xl text-asphalt-100 tracking-tight">TODAY'S ACTIVITY</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-asphalt-700">
              <span className="text-asphalt-400 text-sm">Jobs Today</span>
              <span className="font-display font-bold text-2xl text-asphalt-100">{todayJobs.length}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-asphalt-700">
              <span className="text-asphalt-400 text-sm">Completed</span>
              <span className="font-display font-bold text-2xl text-fuel-400">
                {todayJobs.filter((j) => j.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-asphalt-400 text-sm">Pending</span>
              <span className="font-display font-bold text-2xl text-caution-400">
                {todayJobs.filter((j) => j.status === 'pending').length}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-fuel-500"></div>
            <h3 className="font-display font-bold text-xl text-asphalt-100 tracking-tight">DRIVER STATUS</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-asphalt-700">
              <span className="text-asphalt-400 text-sm">Online</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-fuel-500 rounded-full animate-pulse"></div>
                <span className="font-display font-bold text-2xl text-fuel-400">{activeDrivers || 0}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-asphalt-400 text-sm">Total</span>
              <span className="font-display font-bold text-2xl text-asphalt-100">{totalDrivers || 0}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-6 bg-caution-500"></div>
            <h3 className="font-display font-bold text-xl text-asphalt-100 tracking-tight">QUICK ACTIONS</h3>
          </div>
          <div className="space-y-3">
            <Link href="/admin/drivers" className="block">
              <button className="btn-secondary w-full">
                Manage Drivers
              </button>
            </Link>
            <Link href="/admin/jobs" className="block">
              <button className="btn-secondary w-full">
                View All Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Jobs */}
      {activeJobs && activeJobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="font-display font-bold text-3xl text-asphalt-100 tracking-tight">ACTIVE OPERATIONS</h2>
              <p className="text-asphalt-400 text-sm mt-1">{activeJobs.length} jobs in progress</p>
            </div>
            <Link href="/admin/jobs">
              <button className="btn-secondary flex items-center gap-2">
                <span>VIEW ALL</span>
                <span>→</span>
              </button>
            </Link>
          </div>
          <div className="space-y-4">
            {activeJobs.slice(0, 5).map((job, index) => (
              <div key={job.id} className="card" style={{animationDelay: `${index * 50}ms`}}>
                <div className="flex items-start justify-between gap-6 flex-wrap">
                  <div className="flex-1 min-w-[300px]">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className={`status-badge ${getStatusColor(job.status)}`}>
                        {formatStatus(job.status)}
                      </span>
                      <span className="text-asphalt-500 text-sm font-mono">
                        #{job.id.slice(0, 8).toUpperCase()}
                      </span>
                    </div>
                    <h3 className="font-display font-bold text-xl text-asphalt-100 mb-2">
                      {job.vehicles?.year} {job.vehicles?.make} {job.vehicles?.model}
                    </h3>
                    <p className="text-asphalt-400 text-sm mb-3 flex items-start gap-2">
                      <span className="text-caution-400">📍</span>
                      <span>{job.delivery_address}</span>
                    </p>
                    {job.drivers && (
                      <div className="inline-flex items-center gap-2 bg-asphalt-800/50 px-3 py-1 border border-asphalt-700"
                           style={{clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'}}>
                        <span className="text-asphalt-500 text-xs font-bold tracking-widest">DRIVER:</span>
                        <span className="text-asphalt-200 text-sm font-semibold">
                          {job.drivers.profiles?.full_name || 'Unassigned'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-asphalt-500 font-bold tracking-widest mb-1">TOTAL</p>
                    <p className="font-display font-bold text-3xl text-asphalt-100 mb-2">
                      {formatCurrency(job.total_amount)}
                    </p>
                    <p className="text-asphalt-400 text-sm">
                      {job.gallons_requested} gal • {job.fuel_type}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
