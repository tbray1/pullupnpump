import { test, expect } from '@playwright/test'

const ADMIN_EMAIL = 'admin@demo.com'
const ADMIN_PASSWORD = 'Demo123!'

test.describe('Admin User Flow', () => {
  test('should login and navigate admin dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login')

    // Fill in admin credentials
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)

    // Click login button
    await page.click('button[type="submit"]')

    // Wait for navigation to admin dashboard
    await page.waitForURL(/\/admin/)

    // Verify we're on the admin dashboard
    await expect(page).toHaveURL(/\/admin/)

    // Check for admin dashboard elements (updated for new design)
    await expect(page.locator('text=ADMIN DASHBOARD')).toBeVisible()

    console.log('✅ Admin login successful')
  })

  test('should display system statistics', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin/)

    // Check for key statistics (updated for new design)
    await expect(page.locator('text=TOTAL CUSTOMERS')).toBeVisible()
    await expect(page.locator('text=TOTAL DRIVERS')).toBeVisible()

    console.log('✅ Admin dashboard displays statistics')
  })

  test('should be able to view drivers management page', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin/)

    // Navigate to drivers management
    await page.click('text=Drivers')

    // Wait for drivers page
    await page.waitForURL(/\/admin\/drivers/)

    // Check for drivers page elements (updated for new design)
    const driversHeading = page.locator('h1:has-text("Driver"), h1:has-text("DRIVER")')
    await expect(driversHeading).toBeVisible()

    console.log('✅ Admin can view drivers management page')
  })

  test('should be able to view jobs management page', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin/)

    // Navigate to jobs management
    await page.click('text=Jobs')

    // Wait for jobs page
    await page.waitForURL(/\/admin\/jobs/)

    // Check for jobs page elements (updated for new design)
    const jobsHeading = page.locator('h1:has-text("Job"), h1:has-text("JOB")')
    await expect(jobsHeading).toBeVisible()

    console.log('✅ Admin can view jobs management page')
  })

  test('should display revenue metrics', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin/)

    // Check for revenue metrics (updated for new design)
    await expect(page.locator('text=TOTAL REVENUE')).toBeVisible()

    console.log('✅ Admin dashboard displays revenue metrics')
  })

  test('should display active jobs section', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin/)

    // Check for active jobs section (updated for new design)
    const activeJobsSection = page.locator('text=ACTIVE OPERATIONS, text=Active Jobs, text=NO ACTIVE')
    await expect(activeJobsSection.first()).toBeVisible()

    console.log('✅ Admin dashboard displays active jobs')
  })

  test('should be able to logout', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', ADMIN_EMAIL)
    await page.fill('input[type="password"]', ADMIN_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/admin/)

    // Logout
    await page.click('text=Logout')

    // Should redirect to login or home
    await page.waitForURL(/\/(auth\/login|$)/)

    console.log('✅ Admin can logout successfully')
  })
})
