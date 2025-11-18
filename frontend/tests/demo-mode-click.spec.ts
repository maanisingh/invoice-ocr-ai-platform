import { test, expect } from '@playwright/test';

test('clicking demo mode after login should not cause invariant error', async ({ page }) => {
  const errors: string[] = [];
  const invariantErrors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      console.log('🔴 ERROR:', text);
      errors.push(text);

      if (text.toLowerCase().includes('invariant')) {
        invariantErrors.push(text);
      }
    }
  });

  page.on('pageerror', (error) => {
    console.log('💥 PAGE ERROR:', error.message);
    errors.push(error.message);

    if (error.message.toLowerCase().includes('invariant')) {
      invariantErrors.push(error.message);
    }
  });

  // Step 1: Go to login page
  console.log('\n📍 Step 1: Navigate to login page');
  await page.goto('https://invoices.alexandratechlab.com/login');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'test-results/demo-click-01-login.png', fullPage: true });
  console.log('   ✓ On login page');
  console.log('   Errors so far:', errors.length);

  // Step 2: Click "Admin Dashboard" to login
  console.log('\n📍 Step 2: Click Admin Dashboard button to login');
  await page.click('button:has-text("Admin Dashboard")');
  await page.waitForTimeout(2000);
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'test-results/demo-click-02-after-login.png', fullPage: true });
  console.log('   Current URL:', page.url());
  console.log('   Errors so far:', errors.length);

  if (invariantErrors.length > 0) {
    console.log('   ❌ INVARIANT ERROR DURING LOGIN!');
    invariantErrors.forEach(err => console.log('      -', err));
  }

  // Step 3: Find and click the demo mode toggle
  console.log('\n📍 Step 3: Looking for demo mode toggle...');

  // Wait for the layout to be fully rendered
  await page.waitForTimeout(1000);

  // Try to find the demo mode toggle (Switch component)
  const demoToggle = page.locator('.ant-switch').first();
  const toggleExists = await demoToggle.count() > 0;

  if (toggleExists) {
    console.log('   ✓ Found demo mode toggle');

    // Take screenshot before clicking
    await page.screenshot({ path: 'test-results/demo-click-03-before-toggle.png', fullPage: true });

    console.log('   🖱️  Clicking demo mode toggle...');
    await demoToggle.click();

    // Wait for any state changes
    await page.waitForTimeout(2000);

    // Take screenshot after clicking
    await page.screenshot({ path: 'test-results/demo-click-04-after-toggle.png', fullPage: true });

    console.log('   ✓ Clicked demo mode toggle');
    console.log('   Errors after toggle:', errors.length);

    if (invariantErrors.length > 0) {
      console.log('   ❌ INVARIANT ERROR AFTER CLICKING DEMO MODE!');
    } else {
      console.log('   ✅ No invariant errors after clicking demo mode');
    }
  } else {
    console.log('   ⚠️  Demo mode toggle not found');

    // Try alternate selectors
    const altToggle = page.locator('button:has-text("Demo"), button:has-text("Live")').first();
    if (await altToggle.count() > 0) {
      console.log('   Found alternate demo toggle');
      await altToggle.click();
      await page.waitForTimeout(2000);
    }
  }

  // Final summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 TEST RESULTS - Demo Mode Click');
  console.log('='.repeat(70));
  console.log('Total errors:', errors.length);
  console.log('Invariant errors:', invariantErrors.length);

  if (invariantErrors.length > 0) {
    console.log('\n❌ INVARIANT ERRORS DETECTED:');
    invariantErrors.forEach((err, i) => {
      console.log(`\n[${i + 1}]`, err);
    });
  } else {
    console.log('\n✅ NO INVARIANT ERRORS!');
  }
  console.log('='.repeat(70));

  // Assert no invariant errors
  expect(invariantErrors.length, 'Should have no invariant errors after clicking demo mode').toBe(0);
});
