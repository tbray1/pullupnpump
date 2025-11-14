import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-4xl w-full text-center space-y-8">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Pull UP <span className="text-primary-600">-N-</span> Pump
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          On-Demand Mobile Fuel Delivery
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Customer Portal */}
          <Link href="/customer" className="group">
            <div className="card hover:shadow-xl transition-shadow duration-300 transform group-hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">⛽</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Customer
              </h2>
              <p className="text-gray-600">
                Request fuel delivery and track your order in real-time
              </p>
              <div className="mt-4 text-primary-600 font-semibold">
                Get Started →
              </div>
            </div>
          </Link>

          {/* Driver Portal */}
          <Link href="/driver" className="group">
            <div className="card hover:shadow-xl transition-shadow duration-300 transform group-hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">🚚</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Driver
              </h2>
              <p className="text-gray-600">
                Accept deliveries and manage your fuel delivery jobs
              </p>
              <div className="mt-4 text-primary-600 font-semibold">
                Go Online →
              </div>
            </div>
          </Link>

          {/* Admin Portal */}
          <Link href="/admin" className="group">
            <div className="card hover:shadow-xl transition-shadow duration-300 transform group-hover:scale-105 transition-transform">
              <div className="text-5xl mb-4">📊</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Admin
              </h2>
              <p className="text-gray-600">
                Manage drivers, monitor jobs, and view analytics
              </p>
              <div className="mt-4 text-primary-600 font-semibold">
                Dashboard →
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            MVP Prototype - Pull UP -N- Pump Fuel Delivery Platform
          </p>
        </div>
      </div>
    </main>
  )
}
