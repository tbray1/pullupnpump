import { createClient } from '@/lib/supabase/server'
import { formatDateTime, formatCurrency, formatStatus, getStatusColor } from '@/lib/utils'

export default async function AllJobsPage() {
  const supabase = await createClient()

  const { data: jobs } = await supabase
    .from('jobs')
    .select(`
      *,
      vehicles (make, model, year),
      drivers (id, profiles (full_name)),
      customers!jobs_customer_id_fkey (
        profiles!customers_id_fkey (full_name)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(100)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">All Jobs</h1>

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
                      {formatDateTime(job.created_at)}
                    </span>
                    <span className="text-xs text-gray-500">
                      ID: {job.id.slice(0, 8)}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <span className="text-gray-600">Customer:</span>{' '}
                      <span className="font-medium text-gray-900">
                        {job.customers?.profiles?.full_name || 'N/A'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Driver:</span>{' '}
                      <span className="font-medium text-gray-900">
                        {job.drivers?.profiles?.full_name || 'Unassigned'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Vehicle:</span>{' '}
                      <span className="text-gray-900">
                        {job.vehicles?.year} {job.vehicles?.make} {job.vehicles?.model}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Location:</span>{' '}
                      <span className="text-gray-900">{job.delivery_address}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fuel:</span>{' '}
                      <span className="text-gray-900 capitalize">
                        {job.gallons_delivered || job.gallons_requested} gal {job.fuel_type}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Payment:</span>{' '}
                      <span className="text-gray-900 capitalize">
                        {formatStatus(job.payment_status)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-6">
                  <p className="text-xl font-bold text-gray-900">
                    {formatCurrency(job.total_amount)}
                  </p>
                  {job.completed_at && (
                    <p className="text-xs text-gray-600 mt-1">
                      Completed: {formatDateTime(job.completed_at)}
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs yet</h3>
          <p className="text-gray-600">Jobs will appear here as customers place orders</p>
        </div>
      )}
    </div>
  )
}
