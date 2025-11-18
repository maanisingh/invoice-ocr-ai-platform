import { test } from '@playwright/test';

test('comprehensive visual test with all screenshots', async ({ page }) => {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('🔴 ERROR:', msg.text());
      errors.push(msg.text());
    }
  });

  page.on('pageerror', (error) => {
    console.log('💥 PAGE ERROR:', error.message);
    errors.push(error.message);
  });

  // Test 1: Homepage → Login redirect
  console.log('\n📸 1. Homepage (should redirect to /login)');
  await page.goto('https://invoices.alexandratechlab.com');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/visual-01-homepage-redirected.png', fullPage: true });
  console.log('   URL:', page.url());
  console.log('   Errors so far:', errors.length);

  // Test 2: Login page direct
  console.log('\n📸 2. Login page (direct access)');
  await page.goto('https://invoices.alexandratechlab.com/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/visual-02-login-direct.png', fullPage: true });
  console.log('   URL:', page.url());
  console.log('   Errors so far:', errors.length);

  // Test 3: Register page
  console.log('\n📸 3. Register page');
  await page.goto('https://invoices.alexandratechlab.com/register');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-results/visual-03-register.png', fullPage: true });
  console.log('   URL:', page.url());
  console.log('   Errors so far:', errors.length);

  // Test 4: Admin dashboard (unauthorized - should redirect)
  console.log('\n📸 4. Admin dashboard (unauthorized access)');
  await page.goto('https://invoices.alexandratechlab.com/admin/dashboard');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/visual-04-admin-unauthorized.png', fullPage: true });
  console.log('   URL:', page.url());
  console.log('   Should have redirected to:', '/login');
  console.log('   Errors so far:', errors.length);

  // Test 5: Admin invoices (unauthorized - should redirect)
  console.log('\n📸 5. Admin invoices (unauthorized access)');
  await page.goto('https://invoices.alexandratechlab.com/admin/invoices');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/visual-05-admin-invoices-unauthorized.png', fullPage: true });
  console.log('   URL:', page.url());
  console.log('   Errors so far:', errors.length);

  // Test 6: Client dashboard (unauthorized - should redirect)
  console.log('\n📸 6. Client dashboard (unauthorized access)');
  await page.goto('https://invoices.alexandratechlab.com/client/dashboard');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/visual-06-client-unauthorized.png', fullPage: true });
  console.log('   URL:', page.url());
  console.log('   Errors so far:', errors.length);

  // Test 7: Client invoices (unauthorized - should redirect)
  console.log('\n📸 7. Client invoices (unauthorized access)');
  await page.goto('https://invoices.alexandratechlab.com/client/invoices');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/visual-07-client-invoices-unauthorized.png', fullPage: true });
  console.log('   URL:', page.url());
  console.log('   Errors so far:', errors.length);

  // Test 8: Invalid route (should redirect)
  console.log('\n📸 8. Invalid route /nonexistent');
  await page.goto('https://invoices.alexandratechlab.com/nonexistent');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'test-results/visual-08-invalid-route.png', fullPage: true });
  console.log('   URL:', page.url());
  console.log('   Errors so far:', errors.length);

  // Final summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 FINAL VISUAL TEST RESULTS');
  console.log('='.repeat(70));
  console.log('✅ All 8 screenshots captured successfully');
  console.log('📁 Screenshots saved in: test-results/visual-*.png');
  console.log('');
  console.log('Total Errors Detected:', errors.length);

  const invariantErrors = errors.filter(e => e.toLowerCase().includes('invariant'));
  console.log('Invariant Errors:', invariantErrors.length);

  if (errors.length === 0) {
    console.log('');
    console.log('🎉 SUCCESS! NO ERRORS DETECTED IN ANY PAGE!');
    console.log('✅ The React Router invariant error has been COMPLETELY FIXED!');
  } else {
    console.log('');
    console.log('❌ ERRORS FOUND:');
    errors.forEach((err, i) => {
      console.log(`   ${i + 1}. ${err}`);
    });
  }
  console.log('='.repeat(70));
});
