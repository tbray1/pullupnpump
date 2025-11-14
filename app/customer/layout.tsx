import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'customer') {
    redirect(`/${profile?.role || 'auth/login'}`)
  }

  const handleSignOut = async () => {
    'use server'
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/customer">
              <h1 className="text-2xl font-bold text-gray-900">
                Pull UP <span className="text-primary-600">-N-</span> Pump
              </h1>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {profile.full_name}
              </span>
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-6">
            <Link
              href="/customer"
              className="py-3 px-2 border-b-2 border-primary-600 text-primary-600 font-medium text-sm"
            >
              Dashboard
            </Link>
            <Link
              href="/customer/request"
              className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              Request Fuel
            </Link>
            <Link
              href="/customer/history"
              className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              History
            </Link>
            <Link
              href="/customer/vehicles"
              className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              Vehicles
            </Link>
            <Link
              href="/customer/settings"
              className="py-3 px-2 border-b-2 border-transparent text-gray-600 hover:text-gray-900 font-medium text-sm"
            >
              Settings
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
