import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Calculate distance between two coordinates using Haversine formula
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in kilometers
  return distance
}

// Calculate estimated arrival time based on distance
export function calculateETA(distanceKm: number): Date {
  const avgSpeedKmh = 50 // Average speed in km/h
  const hoursToArrive = distanceKm / avgSpeedKmh
  const minutesToArrive = hoursToArrive * 60
  const eta = new Date()
  eta.setMinutes(eta.getMinutes() + minutesToArrive)
  return eta
}

// Calculate job total amount
export function calculateJobTotal(
  gallons: number,
  pricePerGallon: number,
  serviceFee: number
): number {
  return gallons * pricePerGallon + serviceFee
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

// Format date/time
export function formatDateTime(date: string | Date | null): string {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

// Format time only
export function formatTime(date: string | Date | null): string {
  if (!date) return 'N/A'
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date))
}

// Get fuel prices (in a real app, this would come from an API)
export function getFuelPrices() {
  return {
    regular: 3.49,
    premium: 3.99,
    diesel: 3.79,
  }
}

// Validate phone number (simple validation)
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  return phoneRegex.test(phone)
}

// Validate email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Get status color class
export function getStatusColor(status: string | null): string {
  if (!status) return 'bg-gray-100 text-gray-800'
  const statusColors: Record<string, string> = {
    pending: 'status-pending',
    assigned: 'status-pending',
    accepted: 'status-active',
    en_route: 'status-active',
    arrived: 'status-active',
    fueling: 'status-active',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
    online: 'status-active',
    offline: 'bg-gray-100 text-gray-800',
    busy: 'status-pending',
  }
  return statusColors[status] || 'bg-gray-100 text-gray-800'
}

// Format status label
export function formatStatus(status: string | null): string {
  if (!status) return 'Unknown'
  return status
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
