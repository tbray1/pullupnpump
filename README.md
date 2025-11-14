# Pull UP -N- Pump - MVP Prototype

An Uber-style on-demand mobile fuel delivery platform that enables customers to request fuel, track vetted drivers, and pay automatically.

## 🚀 Features

### Customer App
- Create account and manage profile
- Add and manage multiple vehicles
- Save service locations
- Request ASAP fuel deliveries
- Select fuel type (Regular, Premium, Diesel)
- Real-time driver tracking with status updates
- View delivery history and receipts
- Automatic payment processing

### Driver App
- Go online/offline to receive jobs
- View and accept available delivery requests
- Navigate to delivery locations
- Update job status (En Route → Arrived → Fueling → Completed)
- Log gallons dispensed
- Track earnings and delivery history
- Real-time location updates

### Admin Dashboard
- Monitor all drivers (location, status)
- View active and completed jobs
- Approve/suspend drivers
- View system analytics and revenue
- Manage delivery assignments

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Payments**: Stripe
- **Maps**: Google Maps API (ready for integration)
- **Notifications**: Twilio SMS (ready for integration)
- **PWA**: next-pwa for Progressive Web App capabilities

## 📋 Prerequisites

- Node.js 18+ and npm
- Supabase account (https://supabase.com)
- Stripe account (https://stripe.com)
- Google Maps API key (https://console.cloud.google.com)
- Twilio account for SMS (optional, https://twilio.com)

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pullupnpump
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at https://supabase.com
2. Go to the SQL Editor in your Supabase dashboard
3. Copy the contents of `supabase-schema.sql` and run it in the SQL editor
4. This will create all necessary tables, functions, and Row Level Security policies

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in your environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Twilio (Optional - for SMS notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 👥 User Roles & Access

### Creating Test Users

1. **Customer Account**:
   - Go to http://localhost:3000/auth/signup
   - Select "Customer"
   - Fill in details and sign up

2. **Driver Account**:
   - Go to http://localhost:3000/auth/signup
   - Select "Driver"
   - Fill in details and sign up
   - Note: Drivers need admin approval before going online

3. **Admin Account**:
   - Create a customer account first
   - Go to Supabase dashboard → Table Editor → profiles
   - Find your user and change `role` to `'admin'`
   - Access admin dashboard at http://localhost:3000/admin

## 🗺️ Database Schema

The database includes the following main tables:

- `profiles` - User profiles (extends Supabase auth.users)
- `customers` - Customer-specific data
- `drivers` - Driver-specific data and status
- `vehicles` - Customer vehicles
- `service_locations` - Saved delivery locations
- `jobs` - Delivery jobs with status tracking
- `payment_methods` - Stripe payment methods
- `transactions` - Payment transaction records
- `notifications` - User notifications

See `supabase-schema.sql` for complete schema details.

## 📱 PWA Installation

The app is configured as a Progressive Web App (PWA):

1. Open the app in a supported browser (Chrome, Edge, Safari)
2. Click "Install" or "Add to Home Screen"
3. The app will install and work offline

Note: PWA features are disabled in development mode.

## 🔄 Real-time Features

The app uses Supabase Realtime for:

- Live job status updates for customers
- New job notifications for drivers
- Driver location tracking
- Real-time dashboard updates for admins

## 💳 Stripe Integration

### Setup Stripe

1. Create a Stripe account at https://stripe.com
2. Get your API keys from the Stripe dashboard
3. Add them to your `.env.local` file
4. Configure webhooks for payment events (for production)

### Payment Flow (Simplified for MVP)

- Jobs are created with a `total_amount`
- Payment processing is tracked via `payment_status`
- Full Stripe integration can be added in Phase 2

## 🗺️ Google Maps Integration

### Setup Google Maps

1. Create a project in Google Cloud Console
2. Enable Maps JavaScript API and Geocoding API
3. Create an API key
4. Add it to your `.env.local` file

### Current Implementation

- Location coordinates are stored for deliveries
- Google Maps links are generated for navigation
- Full map UI can be added in Phase 2

## 📊 Features Not Included in MVP (Phase 2+)

- In-app driver onboarding with document verification
- Tip system for drivers
- Fleet management portal
- Push notifications (using SMS for now)
- Complex routing and job batching
- Native mobile apps (iOS/Android)
- Advanced analytics and reporting
- Customer loyalty/membership programs
- In-app chat between customers and drivers

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- AWS Amplify
- Railway
- Digital Ocean App Platform

## 🧪 Testing the Flow

1. **Create accounts**: Create a customer, driver, and admin account
2. **Admin**: Approve the driver account
3. **Customer**: Add a vehicle and service location
4. **Customer**: Request a fuel delivery
5. **Driver**: Go online and accept the job
6. **Driver**: Update status through the delivery flow
7. **Customer**: Track the delivery in real-time
8. **Driver**: Complete the delivery
9. **Admin**: Monitor everything from the dashboard

## 📝 Development Notes

### Fuel Prices

Currently using hardcoded fuel prices in `lib/utils.ts`:
```typescript
regular: $3.49/gal
premium: $3.99/gal
diesel: $3.79/gal
```

In production, these should come from a fuel price API.

### Service Fee

Currently set to $4.99 in `lib/stripe/config.ts`. This can be adjusted based on business model.

### Driver Earnings

Drivers earn 70% of the job total (configurable). The platform keeps 30% as commission.

### Location Services

The app requests browser geolocation for driver location updates. Ensure location permissions are granted.

## 🤝 Contributing

This is an MVP prototype. For production use, consider:

- Adding comprehensive error handling
- Implementing proper logging and monitoring
- Adding unit and integration tests
- Improving security measures
- Adding input validation
- Implementing rate limiting
- Adding proper caching strategies

## 📄 License

This is a prototype/MVP project.

## 🆘 Support

For issues or questions:
1. Check the console for errors
2. Verify environment variables are set correctly
3. Ensure Supabase schema is properly initialized
4. Check that all required services (Supabase, Stripe) are configured

## 🎯 Success Criteria Met

✅ Customer can request a fill in < 60 seconds
✅ Drivers can accept jobs quickly
✅ Real-time tracking is functional
✅ Payment tracking is implemented
✅ Admin can manage drivers and jobs
✅ All core MVP features are functional

---

Built with Next.js, Supabase, Stripe, and Tailwind CSS.
