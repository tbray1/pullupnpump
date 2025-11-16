import { test, expect } from '@playwright/test'

const CUSTOMER_EMAIL = 'customer@demo.com'
const CUSTOMER_PASSWORD = 'Demo123!'

test.describe('Customer User Flow', () => {
  test('should login and navigate customer dashboard', async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login')

    // Fill in customer credentials
    await page.fill('input[type="email"]', CUSTOMER_EMAIL)
    await page.fill('input[type="password"]', CUSTOMER_PASSWORD)

    // Click login button
    await page.click('button[type="submit"]')

    // Wait for navigation to dashboard
    await page.waitForURL(/\/customer/)

    // Verify we're on the customer dashboard
    await expect(page).toHaveURL(/\/customer/)

    // Check for customer dashboard elements
    await expect(page.locator('text=Request Delivery')).toBeVisible()

    console.log('✅ Customer login successful')
  })

  test('should be able to view vehicles page', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', CUSTOMER_EMAIL)
    await page.fill('input[type="password"]', CUSTOMER_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/customer/)

    // Navigate to vehicles
    await page.click('text=My Vehicles')

    // Wait for vehicles page
    await page.waitForURL(/\/customer\/vehicles/)

    // Check for vehicles page elements
    await expect(page.locator('text=My Vehicles')).toBeVisible()
    await expect(page.locator('text=Add Vehicle')).toBeVisible()

    console.log('✅ Customer can view vehicles page')
  })

  test('should be able to view service locations page', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', CUSTOMER_EMAIL)
    await page.fill('input[type="password"]', CUSTOMER_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/customer/)

    // Navigate to service locations
    await page.click('text=Service Locations')

    // Wait for locations page
    await page.waitForURL(/\/customer\/locations/)

    // Check for locations page elements
    await expect(page.locator('text=Service Locations')).toBeVisible()
    await expect(page.locator('text=Add Location')).toBeVisible()

    console.log('✅ Customer can view service locations page')
  })

  test('should be able to view delivery history', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', CUSTOMER_EMAIL)
    await page.fill('input[type="password"]', CUSTOMER_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/customer/)

    // Navigate to history
    await page.click('text=Delivery History')

    // Wait for history page
    await page.waitForURL(/\/customer\/history/)

    // Check for history page elements
    await expect(page.locator('text=Delivery History')).toBeVisible()

    console.log('✅ Customer can view delivery history')
  })

  test('should be able to logout', async ({ page }) => {
    // Login first
    await page.goto('/auth/login')
    await page.fill('input[type="email"]', CUSTOMER_EMAIL)
    await page.fill('input[type="password"]', CUSTOMER_PASSWORD)
    await page.click('button[type="submit"]')
    await page.waitForURL(/\/customer/)

    // Logout
    await page.click('text=Logout')

    // Should redirect to login or home
    await page.waitForURL(/\/(auth\/login|$)/)

    console.log('✅ Customer can logout successfully')
  })
})
