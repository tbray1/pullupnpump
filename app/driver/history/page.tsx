import { createClient } from '@/lib/supabase/server'
import { formatDateTime, formatCurrency, formatStatus, getStatusColor } from '@/lib/utils'

export default async function DriverHistoryPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: jobs } = await supabase
    .from('jobs')
    .select(`
      *,
      vehicles (make, model, year)
    `)
    .eq('driver_id', user.id)
    .in('status', ['completed', 'cancelled'])
    .order('completed_at', { ascending: false })
    .limit(50)

  const totalEarnings = jobs?.reduce((sum, job) =>
    job.status === 'completed' ? sum + (job.total_amount * 0.7) : sum, 0
  ) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Delivery History</h1>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Earnings</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEarnings)}</p>
        </div>
      </div>

      {jobs && jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="card">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`status-badge ${getStatusColor(job.status)}`}>
                      {formatStatus(job.status)}
                    </span>
                    <span className="text-sm text-gray-600">
                      {job.completed_at ? formatDateTime(job.completed_at) : formatDateTime(job.created_at)}
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
                      <span className="font-medium">Delivered:</span>{' '}
                      {job.gallons_delivered || job.gallons_requested} gal
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Job Value</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(job.total_amount)}
                  </p>
                  {job.status === 'completed' && (
                    <p className="text-sm text-green-600 font-semibold">
                      Earned: {formatCurrency(job.total_amount * 0.7)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No delivery history
          </h3>
          <p className="text-gray-600">
            Your completed deliveries will appear here
          </p>
        </div>
      )}
    </div>
  )
}
