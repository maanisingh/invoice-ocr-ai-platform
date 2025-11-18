import { test, expect } from '@playwright/test';

test.describe('React Router Invariant Error Fix', () => {
  test('should load the app without invariant errors', async ({ page }) => {
    // Track console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Track page errors
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error);
    });

    // Navigate to the site
    await page.goto('https://invoices.alexandratechlab.com');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Wait a bit more for any deferred errors
    await page.waitForTimeout(2000);

    // Check for invariant errors
    const hasInvariantError = errors.some(err => err.includes('Invariant failed'));
    const hasPageError = pageErrors.some(err => err.message.includes('Invariant failed'));

    // Log all errors for debugging
    if (errors.length > 0) {
      console.log('Console Errors:', errors);
    }
    if (pageErrors.length > 0) {
      console.log('Page Errors:', pageErrors.map(e => e.message));
    }

    // Assert no invariant errors
    expect(hasInvariantError, 'Console should not have Invariant failed error').toBe(false);
    expect(hasPageError, 'Page should not have Invariant failed error').toBe(false);
  });

  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto('https://invoices.alexandratechlab.com');
    await page.waitForLoadState('networkidle');

    // Wait for React to render
    await page.waitForTimeout(1000);

    // Should be on login page
    await expect(page).toHaveURL(/\/login/);

    // Should see login form (Ant Design uses different input structure)
    const emailInput = page.locator('input[id*="email"], input[placeholder*="email" i], input[name*="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();

    await expect(emailInput).toBeVisible({ timeout: 10000 });
    await expect(passwordInput).toBeVisible({ timeout: 10000 });
  });

  test('should navigate admin routes without errors', async ({ page }) => {
    // Track console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('https://invoices.alexandratechlab.com/admin/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);

    // No invariant errors during redirect
    const hasInvariantError = errors.some(err => err.includes('Invariant failed'));
    expect(hasInvariantError, 'Should not have invariant errors on redirect').toBe(false);
  });

  test('should navigate client routes without errors', async ({ page }) => {
    // Track console errors
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('https://invoices.alexandratechlab.com/client/dashboard');
    await page.waitForLoadState('networkidle');

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);

    // No invariant errors during redirect
    const hasInvariantError = errors.some(err => err.includes('Invariant failed'));
    expect(hasInvariantError, 'Should not have invariant errors on redirect').toBe(false);
  });

  test('should handle multiple navigations without route tree errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    // Simulate multiple navigation attempts
    await page.goto('https://invoices.alexandratechlab.com');
    await page.waitForTimeout(500);

    await page.goto('https://invoices.alexandratechlab.com/admin/dashboard');
    await page.waitForTimeout(500);

    await page.goto('https://invoices.alexandratechlab.com/client/dashboard');
    await page.waitForTimeout(500);

    await page.goto('https://invoices.alexandratechlab.com/login');
    await page.waitForTimeout(500);

    await page.goto('https://invoices.alexandratechlab.com/register');
    await page.waitForTimeout(1000);

    // No invariant errors during any navigation
    const hasInvariantError = errors.some(err => err.includes('Invariant failed'));
    expect(hasInvariantError, 'Should not have invariant errors during multiple navigations').toBe(false);
  });
});
