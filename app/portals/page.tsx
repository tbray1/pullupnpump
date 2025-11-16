import Link from 'next/link'

export default function PortalsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuel-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-caution-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-6xl w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-16 space-y-6">
          <div className="inline-block mb-4">
            <div className="flex items-center gap-4 bg-asphalt-800/60 backdrop-blur-sm px-6 py-3 border border-asphalt-700"
                 style={{clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'}}>
              <span className="text-fuel-400 font-display font-bold text-sm tracking-widest">SYSTEM ACCESS</span>
              <div className="w-2 h-2 bg-fuel-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <h1 className="font-display font-bold text-7xl md:text-8xl tracking-tight mb-6">
            <span className="text-asphalt-100">PULL UP</span>
            <br />
            <span className="text-fuel-400" style={{textShadow: '0 0 40px rgba(34, 197, 94, 0.4)'}}>-N-</span>
            <span className="text-asphalt-100"> PUMP</span>
          </h1>

          <p className="text-asphalt-300 text-xl font-medium tracking-wide max-w-2xl mx-auto">
            Select your portal to access the system
          </p>

          {/* Fuel gauge decoration */}
          <div className="max-w-md mx-auto mt-8">
            <div className="fuel-gauge">
              <div className="fuel-gauge-fill"></div>
            </div>
          </div>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Customer Portal */}
          <Link href="/customer" className="group">
            <div className="card h-full flex flex-col" style={{animationDelay: '0ms'}}>
              <div className="flex items-center justify-between mb-6">
                <div className="text-6xl">⛽</div>
                <div className="w-12 h-12 border-2 border-fuel-500/30 flex items-center justify-center font-display font-bold text-fuel-400 text-xl"
                     style={{clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'}}>
                  01
                </div>
              </div>
              <h2 className="font-display font-bold text-3xl text-asphalt-100 mb-3 tracking-tight">
                CUSTOMER
              </h2>
              <p className="text-asphalt-300 mb-6 flex-grow leading-relaxed">
                Request fuel delivery and track your order in real-time
              </p>
              <div className="flex items-center gap-2 text-fuel-400 font-bold group-hover:gap-4 transition-all">
                <span className="tracking-wide">GET STARTED</span>
                <span className="text-xl">→</span>
              </div>
            </div>
          </Link>

          {/* Driver Portal */}
          <Link href="/driver" className="group">
            <div className="card h-full flex flex-col" style={{animationDelay: '100ms'}}>
              <div className="flex items-center justify-between mb-6">
                <div className="text-6xl">🚚</div>
                <div className="w-12 h-12 border-2 border-caution-500/30 flex items-center justify-center font-display font-bold text-caution-400 text-xl"
                     style={{clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'}}>
                  02
                </div>
              </div>
              <h2 className="font-display font-bold text-3xl text-asphalt-100 mb-3 tracking-tight">
                DRIVER
              </h2>
              <p className="text-asphalt-300 mb-6 flex-grow leading-relaxed">
                Accept deliveries and manage your fuel delivery jobs
              </p>
              <div className="flex items-center gap-2 text-caution-400 font-bold group-hover:gap-4 transition-all">
                <span className="tracking-wide">GO ONLINE</span>
                <span className="text-xl">→</span>
              </div>
            </div>
          </Link>

          {/* Admin Portal */}
          <Link href="/admin" className="group">
            <div className="card h-full flex flex-col" style={{animationDelay: '200ms'}}>
              <div className="flex items-center justify-between mb-6">
                <div className="text-6xl">📊</div>
                <div className="w-12 h-12 border-2 border-blue-500/30 flex items-center justify-center font-display font-bold text-blue-400 text-xl"
                     style={{clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)'}}>
                  03
                </div>
              </div>
              <h2 className="font-display font-bold text-3xl text-asphalt-100 mb-3 tracking-tight">
                ADMIN
              </h2>
              <p className="text-asphalt-300 mb-6 flex-grow leading-relaxed">
                Manage drivers, monitor jobs, and view analytics
              </p>
              <div className="flex items-center gap-2 text-blue-400 font-bold group-hover:gap-4 transition-all">
                <span className="tracking-wide">DASHBOARD</span>
                <span className="text-xl">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Footer Badge */}
        <div className="text-center">
          <div className="inline-block bg-asphalt-800/40 backdrop-blur-sm px-6 py-3 border border-asphalt-700/50"
               style={{clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'}}>
            <p className="text-sm text-asphalt-400 font-medium tracking-wide">
              MVP PROTOTYPE SYSTEM // v1.0.0
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
