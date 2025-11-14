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
  const todayJobs = allJobs?.filter((j) => new Date(j.created_at) >= today) || []
  const todayRevenue = todayJobs
    .filter((j) => j.status === 'completed')
    .reduce((sum, job) => sum + job.total_amount, 0)

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <p className="text-blue-100 text-sm mb-1">Total Customers</p>
          <p className="text-4xl font-bold">{totalCustomers || 0}</p>
        </div>
        <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
          <p className="text-green-100 text-sm mb-1">Total Drivers</p>
          <p className="text-4xl font-bold">{totalDrivers || 0}</p>
          <p className="text-green-100 text-xs mt-1">
            {activeDrivers || 0} online
          </p>
        </div>
        <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <p className="text-purple-100 text-sm mb-1">Total Jobs</p>
          <p className="text-4xl font-bold">{allJobs?.length || 0}</p>
          <p className="text-purple-100 text-xs mt-1">
            {activeJobs?.length || 0} active
          </p>
        </div>
        <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <p className="text-orange-100 text-sm mb-1">Total Revenue</p>
          <p className="text-4xl font-bold">{formatCurrency(totalRevenue)}</p>
          <p className="text-orange-100 text-xs mt-1">
            Today: {formatCurrency(todayRevenue)}
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Today's Activity</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Jobs Today</span>
              <span className="font-semibold">{todayJobs.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Completed</span>
              <span className="font-semibold">
                {todayJobs.filter((j) => j.status === 'completed').length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pending</span>
              <span className="font-semibold">
                {todayJobs.filter((j) => j.status === 'pending').length}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Driver Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Online</span>
              <span className="font-semibold text-green-600">{activeDrivers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total</span>
              <span className="font-semibold">{totalDrivers || 0}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/admin/drivers" className="block">
              <button className="btn-secondary w-full text-sm">
                Manage Drivers
              </button>
            </Link>
            <Link href="/admin/jobs" className="block">
              <button className="btn-secondary w-full text-sm">
                View All Jobs
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Active Jobs */}
      {activeJobs && activeJobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Active Jobs</h2>
            <Link
              href="/admin/jobs"
              className="text-sm text-primary-600 font-medium hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {activeJobs.slice(0, 5).map((job) => (
              <div key={job.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`status-badge ${getStatusColor(job.status)}`}>
                        {formatStatus(job.status)}
                      </span>
                      <span className="text-sm text-gray-600">
                        Job #{job.id.slice(0, 8)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {job.vehicles?.year} {job.vehicles?.make} {job.vehicles?.model}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {job.delivery_address}
                    </p>
                    {job.drivers && (
                      <p className="text-sm text-gray-600 mt-2">
                        Driver: {job.drivers.profiles?.full_name || 'Unassigned'}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(job.total_amount)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {job.gallons_requested} gal {job.fuel_type}
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
