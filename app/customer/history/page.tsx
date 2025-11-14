import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { formatDateTime, formatCurrency, formatStatus, getStatusColor } from '@/lib/utils'

export default async function HistoryPage() {
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
    .eq('customer_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Delivery History</h1>

      {jobs && jobs.length > 0 ? (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link
              href={job.status === 'completed' || job.status === 'cancelled' ? '#' : `/customer/track/${job.id}`}
              key={job.id}
            >
              <div className="card hover:shadow-lg transition-shadow">
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
                        {job.gallons_delivered || job.gallons_requested} gal
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {formatCurrency(job.total_amount)}
                    </p>
                    {job.status !== 'completed' && job.status !== 'cancelled' && (
                      <p className="text-sm text-primary-600 font-medium mt-1">
                        Track →
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No delivery history
          </h3>
          <p className="text-gray-600 mb-6">
            Your completed deliveries will appear here
          </p>
          <Link href="/customer/request">
            <button className="btn-primary">Request Your First Delivery</button>
          </Link>
        </div>
      )}
    </div>
  )
}
