/**
 * Script to create test accounts for Pull UP -N- Pump demo
 * Run with: npx tsx scripts/create-test-accounts.ts
 */

import { config } from 'dotenv'
import { resolve } from 'path'
import { createClient } from '@supabase/supabase-js'

// Load environment variables from .env.local
config({ path: resolve(__dirname, '../.env.local') })

// You'll need to use the service role key for this (not the anon key)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const TEST_ACCOUNTS = [
  {
    email: 'customer@demo.com',
    password: 'Demo123!',
    full_name: 'Demo Customer',
    phone: '(555) 123-4567',
    role: 'customer' as const,
  },
  {
    email: 'driver@demo.com',
    password: 'Demo123!',
    full_name: 'Demo Driver',
    phone: '(555) 987-6543',
    role: 'driver' as const,
  },
  {
    email: 'admin@demo.com',
    password: 'Demo123!',
    full_name: 'Demo Admin',
    phone: '(555) 555-5555',
    role: 'admin' as const,
  },
]

async function createTestAccounts() {
  console.log('🚀 Creating test accounts for Pull UP -N- Pump...\n')

  for (const account of TEST_ACCOUNTS) {
    console.log(`Creating ${account.role} account: ${account.email}`)

    try {
      // Create the auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: account.full_name,
        },
      })

      if (authError) {
        console.error(`  ❌ Error creating auth user: ${authError.message}`)
        continue
      }

      const userId = authData.user.id
      console.log(`  ✅ Auth user created: ${userId}`)

      // Update the profile with role and phone
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          role: account.role,
          phone: account.phone,
        })
        .eq('id', userId)

      if (profileError) {
        console.error(`  ❌ Error updating profile: ${profileError.message}`)
        continue
      }

      console.log(`  ✅ Profile updated with role: ${account.role}`)

      // If it's a driver, create driver record and approve them
      if (account.role === 'driver') {
        const { error: driverError } = await supabase
          .from('drivers')
          .insert({
            id: userId,
            is_approved: true,
            is_active: true,
            status: 'offline',
            vehicle_info: 'Toyota Tacoma 2020, White',
            license_number: 'D1234567',
          })

        if (driverError) {
          console.error(`  ❌ Error creating driver record: ${driverError.message}`)
          continue
        }

        console.log(`  ✅ Driver record created and approved`)
      }

      // If it's a customer or admin, create customer record
      if (account.role === 'customer' || account.role === 'admin') {
        const { error: customerError } = await supabase
          .from('customers')
          .insert({
            id: userId,
          })

        if (customerError) {
          console.error(`  ❌ Error creating customer record: ${customerError.message}`)
          continue
        }

        console.log(`  ✅ Customer record created`)
      }

      console.log(`  ✨ Successfully created ${account.role} account!\n`)

    } catch (error) {
      console.error(`  ❌ Unexpected error: ${error}`)
    }
  }

  console.log('🎉 Test account creation complete!\n')
  console.log('📋 Test Account Credentials:')
  console.log('─'.repeat(50))
  TEST_ACCOUNTS.forEach(account => {
    console.log(`${account.role.toUpperCase()}:`)
    console.log(`  Email: ${account.email}`)
    console.log(`  Password: ${account.password}`)
    console.log()
  })
  console.log('─'.repeat(50))
  console.log('\n🌐 Demo URL: https://pullupnpump-tbray1s-projects.vercel.app')
}

createTestAccounts()
  .catch(console.error)
  .finally(() => process.exit(0))
