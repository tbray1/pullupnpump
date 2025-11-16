# Create Test Accounts Script

This script automatically creates test accounts for your Pull UP -N- Pump demo.

## Quick Setup (2 minutes)

### Step 1: Get Your Supabase Service Role Key

1. Go to: https://supabase.com/dashboard/project/myxmqsgjtxxhhzaixtjo/settings/api
2. Copy the **service_role** key (NOT the anon key)
   - It's in the "Project API keys" section
   - Labeled as "service_role" with a secret key icon
   - Starts with "eyJhbGci..."

### Step 2: Add to Your .env.local File

Open `/Users/tariusbray/pullupnpump/.env.local` and add:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### Step 3: Run the Script

```bash
cd /Users/tariusbray/pullupnpump
npx tsx scripts/create-test-accounts.ts
```

## What This Creates

The script will create 3 test accounts:

1. **Customer Account**
   - Email: customer@demo.com
   - Password: Demo123!
   - Role: Customer
   - Has a customer profile ready to add vehicles

2. **Driver Account**
   - Email: driver@demo.com
   - Password: Demo123!
   - Role: Driver
   - Pre-approved and ready to go online
   - Has sample vehicle info

3. **Admin Account**
   - Email: admin@demo.com
   - Password: Demo123!
   - Role: Admin
   - Full dashboard access

## After Running

You can immediately:
- Login to any account at: https://pullupnpump-tbray1s-projects.vercel.app/auth/login
- Share these credentials with stakeholders
- Demo the full workflow without manual signup

## Troubleshooting

**Error: "Missing required environment variables"**
- Make sure you added SUPABASE_SERVICE_ROLE_KEY to .env.local

**Error: "User already exists"**
- The accounts were already created
- You can delete them in Supabase dashboard and run again
- Or just use the existing accounts with the passwords above

**Error: "Invalid service role key"**
- Double-check you copied the service_role key (not anon key)
- Make sure there are no extra spaces in the .env.local file

## Security Note

⚠️ **IMPORTANT**: The service role key bypasses Row Level Security and should:
- NEVER be committed to git
- NEVER be used in client-side code
- ONLY be used for admin scripts like this
- Be kept secure and rotated regularly

The `.env.local` file is already in `.gitignore` so it won't be committed.
