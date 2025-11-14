import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDateTime, formatCurrency, formatStatus, getStatusColor } from '@/lib/utils'

export default async function CustomerDashboard() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get active jobs
  const { data: activeJobs } = await supabase
    .from('jobs')
    .select(`
      *,
      vehicles (make, model, year)
    `)
    .eq('customer_id', user.id)
    .in('status', ['pending', 'assigned', 'accepted', 'en_route', 'arrived', 'fueling'])
    .order('created_at', { ascending: false })

  // Get recent completed jobs
  const { data: recentJobs } = await supabase
    .from('jobs')
    .select(`
      *,
      vehicles (make, model, year)
    `)
    .eq('customer_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(3)

  // Get vehicles
  const { data: vehicles } = await supabase
    .from('vehicles')
    .select('*')
    .eq('customer_id', user.id)

  // Get service locations
  const { data: locations } = await supabase
    .from('service_locations')
    .select('*')
    .eq('customer_id', user.id)

  return (
    <div className="space-y-8">
      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Welcome back!
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Link href="/customer/request">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="text-4xl">⛽</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Request Fuel</h3>
                  <p className="text-sm text-gray-600">Get fuel delivered now</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/customer/vehicles">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🚗</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Vehicles</h3>
                  <p className="text-sm text-gray-600">
                    {vehicles?.length || 0} vehicle(s)
                  </p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/customer/settings">
            <div className="card hover:shadow-lg transition-shadow cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="text-4xl">📍</div>
                <div>
                  <h3 className="font-semibold text-gray-900">Locations</h3>
                  <p className="text-sm text-gray-600">
                    {locations?.length || 0} location(s)
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Active Deliveries */}
      {activeJobs && activeJobs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Active Deliveries
          </h2>
          <div className="space-y-4">
            {activeJobs.map((job) => (
              <Link href={`/customer/track/${job.id}`} key={job.id}>
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
                        {job.gallons_requested && (
                          <span className="text-gray-600">
                            <span className="font-medium">Amount:</span>{' '}
                            {job.gallons_requested} gal
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(job.total_amount)}
                      </p>
                      <p className="text-sm text-primary-600 font-medium mt-1">
                        Track →
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Recent Deliveries */}
      {recentJobs && recentJobs.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Deliveries
            </h2>
            <Link
              href="/customer/history"
              className="text-sm text-primary-600 font-medium hover:underline"
            >
              View all →
            </Link>
          </div>
          <div className="space-y-4">
            {recentJobs.map((job) => (
              <div key={job.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`status-badge ${getStatusColor(job.status)}`}>
                        {formatStatus(job.status)}
                      </span>
                      <span className="text-sm text-gray-600">
                        {job.completed_at && formatDateTime(job.completed_at)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {job.vehicles?.year} {job.vehicles?.make} {job.vehicles?.model}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {job.gallons_delivered || job.gallons_requested} gallons of {job.fuel_type}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(job.total_amount)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!activeJobs || activeJobs.length === 0) &&
        (!recentJobs || recentJobs.length === 0) && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">⛽</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No deliveries yet
            </h3>
            <p className="text-gray-600 mb-6">
              Request your first fuel delivery to get started
            </p>
            <Link href="/customer/request">
              <button className="btn-primary">Request Fuel Delivery</button>
            </Link>
          </div>
        )}
    </div>
  )
}
