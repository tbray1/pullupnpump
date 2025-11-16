import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuel-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-caution-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
          <div className="text-center mb-16">
            {/* Badge */}
            <div className="inline-block mb-8">
              <div className="flex items-center gap-4 bg-asphalt-800/60 backdrop-blur-sm px-6 py-3 border border-asphalt-700"
                   style={{clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)'}}>
                <span className="text-fuel-400 font-display font-bold text-sm tracking-widest">ON-DEMAND FUEL DELIVERY</span>
                <div className="w-2 h-2 bg-fuel-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            {/* Main headline */}
            <h1 className="font-display font-bold text-6xl md:text-8xl tracking-tight mb-8">
              <span className="text-asphalt-100">NEVER VISIT A</span>
              <br />
              <span className="text-fuel-400" style={{textShadow: '0 0 40px rgba(34, 197, 94, 0.4)'}}>GAS STATION</span>
              <br />
              <span className="text-asphalt-100">AGAIN</span>
            </h1>

            <p className="text-asphalt-300 text-xl md:text-2xl font-medium max-w-3xl mx-auto mb-12 leading-relaxed">
              Professional fuel delivery to your location. Whether you're at home, work, or stuck on the road—we come to you.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link href="/customer">
                <button className="btn-primary text-lg px-8 py-4">
                  GET FUEL NOW →
                </button>
              </Link>
              <button className="btn-secondary text-lg px-8 py-4">
                HOW IT WORKS
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-8 text-asphalt-400 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-fuel-400 text-xl">✓</span>
                <span>Licensed & Insured</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-fuel-400 text-xl">✓</span>
                <span>Real-Time Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-fuel-400 text-xl">✓</span>
                <span>Professional Drivers</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="text-asphalt-500 text-3xl">↓</div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block bg-caution-500/20 border border-caution-500/40 px-4 py-2 mb-6"
                 style={{clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'}}>
              <span className="text-caution-300 font-display font-bold text-sm tracking-widest">SIMPLE PROCESS</span>
            </div>
            <h2 className="font-display font-bold text-5xl text-asphalt-100 mb-4">
              THREE STEPS TO FUEL
            </h2>
            <p className="text-asphalt-400 text-xl">We make refueling effortless</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="card relative">
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-fuel-500 flex items-center justify-center font-display font-bold text-3xl text-black"
                   style={{clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'}}>
                01
              </div>
              <div className="text-6xl mb-6 mt-8">📱</div>
              <h3 className="font-display font-bold text-2xl text-asphalt-100 mb-3">REQUEST</h3>
              <p className="text-asphalt-400 leading-relaxed">
                Enter your location, vehicle info, and how much fuel you need. Get an instant price quote.
              </p>
            </div>

            {/* Step 2 */}
            <div className="card relative" style={{animationDelay: '100ms'}}>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-fuel-500 flex items-center justify-center font-display font-bold text-3xl text-black"
                   style={{clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'}}>
                02
              </div>
              <div className="text-6xl mb-6 mt-8">🚚</div>
              <h3 className="font-display font-bold text-2xl text-asphalt-100 mb-3">TRACK</h3>
              <p className="text-asphalt-400 leading-relaxed">
                A professional driver is dispatched to your location. Track them in real-time on the map.
              </p>
            </div>

            {/* Step 3 */}
            <div className="card relative" style={{animationDelay: '200ms'}}>
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-fuel-500 flex items-center justify-center font-display font-bold text-3xl text-black"
                   style={{clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'}}>
                03
              </div>
              <div className="text-6xl mb-6 mt-8">⛽</div>
              <h3 className="font-display font-bold text-2xl text-asphalt-100 mb-3">FUEL UP</h3>
              <p className="text-asphalt-400 leading-relaxed">
                Driver arrives and safely fills your tank. You don't even need to be present. Done!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-5xl text-asphalt-100 mb-4">
              WHY CHOOSE US
            </h2>
            <p className="text-asphalt-400 text-xl">Save time, skip the hassle</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex items-start gap-4">
                <div className="text-5xl">⏰</div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl text-asphalt-100 mb-2">SAVE TIME</h3>
                  <p className="text-asphalt-400">
                    No more detours, waiting in line, or pumping gas yourself. We deliver while you work, sleep, or relax.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="text-5xl">🛡️</div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl text-asphalt-100 mb-2">SAFE & SECURE</h3>
                  <p className="text-asphalt-400">
                    All drivers are background-checked, licensed, and insured. We follow strict safety protocols.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="text-5xl">💰</div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl text-asphalt-100 mb-2">COMPETITIVE PRICING</h3>
                  <p className="text-asphalt-400">
                    Transparent pricing with no hidden fees. Often cheaper than driving to a gas station when you factor in time.
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start gap-4">
                <div className="text-5xl">📍</div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-xl text-asphalt-100 mb-2">ANYWHERE, ANYTIME</h3>
                  <p className="text-asphalt-400">
                    Home, office, parking lot, roadside—if your car is there, we can fuel it. 24/7 availability.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-24 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="card bg-asphalt-800/80 border-2 border-asphalt-700 text-center p-12">
            <div className="inline-block bg-fuel-500/20 border border-fuel-500/40 px-4 py-2 mb-6"
                 style={{clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'}}>
              <span className="text-fuel-300 font-display font-bold text-sm tracking-widest">TRANSPARENT PRICING</span>
            </div>
            <h2 className="font-display font-bold text-4xl text-asphalt-100 mb-6">
              SIMPLE, FAIR PRICING
            </h2>
            <p className="text-asphalt-300 text-xl mb-8 max-w-2xl mx-auto">
              Current gas price + small service fee. See the exact cost before you order. No surprises.
            </p>
            <div className="flex justify-center gap-4 text-asphalt-400 text-sm mb-8">
              <div className="flex items-center gap-2">
                <span className="text-fuel-400">✓</span>
                <span>Market Rate Fuel</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-fuel-400">✓</span>
                <span>Flat Service Fee</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-fuel-400">✓</span>
                <span>No Hidden Costs</span>
              </div>
            </div>
            <Link href="/customer">
              <button className="btn-primary text-lg px-10 py-4">
                GET A QUOTE →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="font-display font-bold text-5xl md:text-6xl text-asphalt-100 mb-6">
            READY TO FUEL UP?
          </h2>
          <p className="text-asphalt-300 text-xl mb-10 max-w-2xl mx-auto">
            Join thousands of customers who've already switched to convenient mobile fuel delivery.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Link href="/customer">
              <button className="btn-primary text-lg px-10 py-4 w-64">
                ORDER NOW →
              </button>
            </Link>
            <Link href="/driver">
              <button className="btn-secondary text-lg px-10 py-4 w-64">
                BECOME A DRIVER
              </button>
            </Link>
          </div>

          {/* Footer Badge */}
          <div className="inline-block bg-asphalt-800/40 backdrop-blur-sm px-6 py-3 border border-asphalt-700/50"
               style={{clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)'}}>
            <p className="text-sm text-asphalt-400 font-medium tracking-wide">
              PULL UP -N- PUMP • FUEL DELIVERY SERVICE
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
