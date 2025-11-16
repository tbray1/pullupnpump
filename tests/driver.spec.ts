import { test, expect } from '@playwright/test'

const DRIVER_EMAIL = 'driver@demo.com'
const DRIVER_PASSWORD = 'Demo123!'

test.describe('Driver User Flow', () => {
  test('should login and navigate driver dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login')

    // Fill in driver credentials
    await page.fill('input[type="email"]', DRIVER_EMAIL)
    await page.fill('input[type="password"]', DRIVER_PASSWORD)

    // Click login button
    await page.click('button[type="submit"]')

    // Wait for navigation to dashboard
    await page.waitForURL(/\/driver/)

    // Verify we're on the driver dashboard
    await expect(page).toHaveURL(/\/driver/)

    // Check for driver dashboard elements
    await expect(page.locator('text=Driver Dashboard')).toBeVisible()

    console.log('✅ Driver login successful')
  })

  test('should display online/offline status toggle', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', DRIVER_EMAIL)
    await page.fill('input[type="password"]', DRIVER_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/driver/)

    // Check for online/offline toggle buttons
    const onlineButton = page.locator('button:has-text("Go Online")')
    const offlineButton = page.locator('button:has-text("Go Offline")')

    // One of these should be visible
    const isOnlineButtonVisible = await onlineButton.isVisible().catch(() => false)
    const isOfflineButtonVisible = await offlineButton.isVisible().catch(() => false)

    expect(isOnlineButtonVisible || isOfflineButtonVisible).toBeTruthy()

    console.log('✅ Driver status toggle is visible')
  })

  test('should be able to view available jobs page', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', DRIVER_EMAIL)
    await page.fill('input[type="password"]', DRIVER_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/driver/)

    // Navigate to jobs
    await page.click('text=Available Jobs')

    // Wait for jobs page
    await page.waitForURL(/\/driver\/jobs/)

    // Check for jobs page elements
    await expect(page.locator('text=Available Jobs')).toBeVisible()

    console.log('✅ Driver can view available jobs page')
  })

  test('should be able to view earnings/history', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', DRIVER_EMAIL)
    await page.fill('input[type="password"]', DRIVER_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/driver/)

    // Navigate to earnings/history
    await page.click('text=Earnings')

    // Wait for earnings page
    await page.waitForURL(/\/driver\/earnings/)

    // Check for earnings page elements
    await expect(page.locator('text=Earnings')).toBeVisible()

    console.log('✅ Driver can view earnings page')
  })

  test('should display driver stats on dashboard', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', DRIVER_EMAIL)
    await page.fill('input[type="password"]', DRIVER_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/driver/)

    // Check for stats elements
    await expect(page.locator('text=Total Deliveries')).toBeVisible()
    await expect(page.locator('text=Today\'s Earnings')).toBeVisible()

    console.log('✅ Driver dashboard shows stats')
  })

  test('should be able to logout', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', DRIVER_EMAIL)
    await page.fill('input[type="password"]', DRIVER_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/driver/)

    // Logout
    await page.click('text=Logout')

    // Should redirect to login or home
    await page.waitForURL(/\/(auth\/login|$)/)

    console.log('✅ Driver can logout successfully')
  })
})
