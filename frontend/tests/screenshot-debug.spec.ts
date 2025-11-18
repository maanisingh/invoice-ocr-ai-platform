import { test, expect } from '@playwright/test';

test.describe('Screenshot Debug - Console Errors', () => {
  test('capture console errors and screenshots on homepage', async ({ page }) => {
    // Capture ALL console messages
    const consoleMessages: Array<{ type: string; text: string }> = [];
    page.on('console', (msg) => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text()
      });
    });

    // Capture page errors
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => {
      pageErrors.push(error.message);
      console.log('PAGE ERROR:', error.message);
      console.log('STACK:', error.stack);
    });

    // Navigate to homepage
    await page.goto('https://invoices.alexandratechlab.com', { waitUntil: 'networkidle' });

    // Take screenshot after initial load
    await page.screenshot({ path: 'test-results/01-homepage-initial.png', fullPage: true });
    console.log('✓ Screenshot saved: 01-homepage-initial.png');

    // Wait for any deferred errors
    await page.waitForTimeout(3000);

    // Take screenshot after wait
    await page.screenshot({ path: 'test-results/02-homepage-after-wait.png', fullPage: true });
    console.log('✓ Screenshot saved: 02-homepage-after-wait.png');

    // Print all console messages
    console.log('\n=== ALL CONSOLE MESSAGES ===');
    consoleMessages.forEach((msg, i) => {
      console.log(`[${i + 1}] [${msg.type.toUpperCase()}] ${msg.text}`);
    });

    // Print all page errors
    if (pageErrors.length > 0) {
      console.log('\n=== PAGE ERRORS ===');
      pageErrors.forEach((err, i) => {
        console.log(`[${i + 1}] ${err}`);
      });
    }

    // Filter for invariant errors
    const invariantConsoleErrors = consoleMessages.filter(msg =>
      msg.text.includes('Invariant') || msg.text.includes('invariant')
    );

    const invariantPageErrors = pageErrors.filter(err =>
      err.includes('Invariant') || err.includes('invariant')
    );

    console.log('\n=== INVARIANT ERRORS ===');
    console.log('Console invariant errors:', invariantConsoleErrors.length);
    console.log('Page invariant errors:', invariantPageErrors.length);

    if (invariantConsoleErrors.length > 0) {
      console.log('\nInvariant Console Errors:');
      invariantConsoleErrors.forEach(err => console.log(err.text));
    }

    if (invariantPageErrors.length > 0) {
      console.log('\nInvariant Page Errors:');
      invariantPageErrors.forEach(err => console.log(err));
    }
  });

  test('test navigation and capture errors', async ({ page }) => {
    const consoleMessages: Array<{ type: string; text: string; url: string }> = [];
    page.on('console', (msg) => {
      consoleMessages.push({
        type: msg.type(),
        text: msg.text(),
        url: page.url()
      });
    });

    const pageErrors: Array<{ error: string; url: string }> = [];
    page.on('pageerror', (error) => {
      pageErrors.push({
        error: error.message,
        url: page.url()
      });
      console.log('PAGE ERROR AT', page.url(), ':', error.message);
    });

    // Test 1: Homepage
    console.log('\n--- Testing Homepage ---');
    await page.goto('https://invoices.alexandratechlab.com');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/nav-01-homepage.png', fullPage: true });

    // Test 2: Login page directly
    console.log('\n--- Testing Login Page ---');
    await page.goto('https://invoices.alexandratechlab.com/login');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/nav-02-login.png', fullPage: true });

    // Test 3: Admin dashboard (should redirect)
    console.log('\n--- Testing Admin Dashboard (unauthorized) ---');
    await page.goto('https://invoices.alexandratechlab.com/admin/dashboard');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/nav-03-admin-redirect.png', fullPage: true });

    // Test 4: Client dashboard (should redirect)
    console.log('\n--- Testing Client Dashboard (unauthorized) ---');
    await page.goto('https://invoices.alexandratechlab.com/client/dashboard');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/nav-04-client-redirect.png', fullPage: true });

    // Test 5: Register page
    console.log('\n--- Testing Register Page ---');
    await page.goto('https://invoices.alexandratechlab.com/register');
    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'test-results/nav-05-register.png', fullPage: true });

    // Print summary
    console.log('\n=== NAVIGATION TEST SUMMARY ===');
    console.log('Total console messages:', consoleMessages.length);
    console.log('Total page errors:', pageErrors.length);

    const errorMessages = consoleMessages.filter(msg => msg.type === 'error');
    const invariantErrors = [...consoleMessages, ...pageErrors.map(e => ({ type: 'error', text: e.error, url: e.url }))]
      .filter(msg => msg.text?.includes('Invariant') || msg.text?.includes('invariant'));

    console.log('Error messages:', errorMessages.length);
    console.log('Invariant errors:', invariantErrors.length);

    if (invariantErrors.length > 0) {
      console.log('\n=== INVARIANT ERRORS FOUND ===');
      invariantErrors.forEach((err, i) => {
        console.log(`\n[${i + 1}] URL: ${err.url}`);
        console.log(`    ${err.text}`);
      });
    }
  });

  test('capture browser console with source maps', async ({ page }) => {
    // Enable verbose console logging
    const allLogs: any[] = [];

    page.on('console', async (msg) => {
      const msgArgs = await Promise.all(msg.args().map(arg => arg.jsonValue().catch(() => arg.toString())));
      const logEntry = {
        type: msg.type(),
        text: msg.text(),
        args: msgArgs,
        location: msg.location()
      };
      allLogs.push(logEntry);

      // Print errors immediately
      if (msg.type() === 'error') {
        console.log('\n🔴 CONSOLE ERROR:', msg.text());
        if (msg.location()) {
          console.log(`   at ${msg.location().url}:${msg.location().lineNumber}`);
        }
      }
    });

    page.on('pageerror', (error) => {
      console.log('\n!!! PAGE ERROR !!!');
      console.log('Message:', error.message);
      console.log('Stack:', error.stack);
    });

    await page.goto('https://invoices.alexandratechlab.com');
    await page.waitForTimeout(5000);

    await page.screenshot({ path: 'test-results/final-state.png', fullPage: true });

    console.log('\n=== ERRORS IN CONSOLE ===');
    const errors = allLogs.filter(log => log.type === 'error');
    errors.forEach((err, i) => {
      console.log(`\n[${i + 1}] ${err.text}`);
      if (err.location) {
        console.log(`    at ${err.location.url}:${err.location.lineNumber}:${err.location.columnNumber}`);
      }
    });

    console.log(`\nTotal errors: ${errors.length}`);
    console.log(`Total console messages: ${allLogs.length}`);
  });
});
