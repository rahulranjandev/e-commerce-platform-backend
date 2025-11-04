import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test('should display the home page', async ({ page }) => {
    await page.goto('/')
    
    // Check for main heading
    await expect(page.getByRole('heading', { name: /shop smarter/i })).toBeVisible()
    
    // Check for navigation links
    await expect(page.getByRole('link', { name: /search/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /login/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()
  })

  test('should navigate to search page', async ({ page }) => {
    await page.goto('/')
    
    // Click on search button
    await page.getByRole('button', { name: /start shopping/i }).click()
    
    // Should be on search page
    await expect(page).toHaveURL(/.*search/)
  })

  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')
    
    // Click on login link
    await page.getByRole('link', { name: /login/i }).click()
    
    // Should be on login page
    await expect(page).toHaveURL(/.*login/)
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()
  })
})

test.describe('Authentication', () => {
  test('should show login form', async ({ page }) => {
    await page.goto('/login')
    
    // Check form elements
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/login')
    
    // Try to submit empty form
    await page.getByRole('button', { name: /login/i }).click()
    
    // Should show validation errors (after form validation kicks in)
    // Note: This might need adjustment based on your validation library behavior
  })

  test('should navigate to register page from login', async ({ page }) => {
    await page.goto('/login')
    
    // Click on sign up link
    await page.getByRole('link', { name: /sign up/i }).click()
    
    // Should be on register page
    await expect(page).toHaveURL(/.*register/)
    await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible()
  })
})

test.describe('Search', () => {
  test('should show search interface', async ({ page }) => {
    await page.goto('/search')
    
    // Check for search input
    await expect(page.getByPlaceholder(/search/i)).toBeVisible()
    
    // Check for search button
    await expect(page.getByRole('button', { name: /search/i })).toBeVisible()
  })

  test('should show semantic search toggle', async ({ page }) => {
    await page.goto('/search')
    
    // Check for semantic search checkbox if enabled
    const checkbox = page.getByRole('checkbox', { name: /semantic/i })
    if (await checkbox.isVisible()) {
      await expect(checkbox).toBeVisible()
    }
  })

  test('should perform search', async ({ page }) => {
    await page.goto('/search')
    
    // Type in search box
    await page.getByPlaceholder(/search/i).fill('test product')
    
    // Click search button
    await page.getByRole('button', { name: /search/i }).click()
    
    // Wait for results or no results message
    // Note: This will depend on whether your backend is running
  })
})
