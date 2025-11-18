import { test } from '@playwright/test';

test('deep console error detection', async ({ page, browser }) => {
  console.log('\n🔍 Starting deep console error detection...');
  console.log('Browser:', browser.browserType().name());
  console.log('Browser version:', browser.version());

  const allMessages: any[] = [];
  const errors: any[] = [];

  // Capture EVERYTHING
  page.on('console', (msg) => {
    const entry = {
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
      timestamp: new Date().toISOString()
    };

    allMessages.push(entry);

    // Log everything to console immediately
    const icon = msg.type() === 'error' ? '🔴' :
                 msg.type() === 'warning' ? '⚠️' :
                 msg.type() === 'info' ? 'ℹ️' : '📝';

    console.log(`${icon} [${msg.type()}] ${msg.text()}`);

    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(entry);
    }
  });

  page.on('pageerror', (error) => {
    console.log('\n💥 PAGE ERROR (UNCAUGHT):');
    console.log('   Message:', error.message);
    console.log('   Name:', error.name);
    console.log('   Stack:', error.stack);
    errors.push({
      type: 'pageerror',
      text: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
  });

  page.on('requestfailed', (request) => {
    console.log('❌ REQUEST FAILED:', request.url());
    console.log('   Failure:', request.failure()?.errorText);
  });

  // Navigate and wait
  console.log('\n📍 Navigating to: https://invoices.alexandratechlab.com');
  await page.goto('https://invoices.alexandratechlab.com', {
    waitUntil: 'networkidle',
    timeout: 30000
  });

  console.log('✓ Page loaded, waiting 5 seconds for any deferred errors...');
  await page.waitForTimeout(5000);

  // Take screenshot
  await page.screenshot({
    path: 'test-results/deep-check-screenshot.png',
    fullPage: true
  });
  console.log('✓ Screenshot saved');

  // Check localStorage
  const localStorage = await page.evaluate(() => {
    return Object.keys(window.localStorage).map(key => ({
      key,
      value: window.localStorage.getItem(key)
    }));
  });

  console.log('\n📦 LocalStorage:');
  localStorage.forEach(item => {
    console.log(`   ${item.key}:`, item.value?.substring(0, 100));
  });

  // Check current URL
  console.log('\n🌐 Current URL:', page.url());

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 SUMMARY');
  console.log('='.repeat(60));
  console.log('Total console messages:', allMessages.length);
  console.log('Total errors/warnings:', errors.length);

  const errorMsgs = errors.filter(e => e.type === 'error' || e.type === 'pageerror');
  const warnings = errors.filter(e => e.type === 'warning');

  console.log('  - Errors:', errorMsgs.length);
  console.log('  - Warnings:', warnings.length);

  if (errorMsgs.length > 0) {
    console.log('\n🔴 ERRORS FOUND:');
    errorMsgs.forEach((err, i) => {
      console.log(`\n  [${i + 1}]`, err.text);
      if (err.location) {
        console.log(`      at ${err.location.url}:${err.location.lineNumber}`);
      }
      if (err.stack) {
        console.log('      Stack:', err.stack.substring(0, 200));
      }
    });
  }

  // Check for invariant specifically
  const invariantErrors = allMessages.filter(m =>
    m.text.toLowerCase().includes('invariant')
  );

  console.log('\n🎯 Invariant-specific errors:', invariantErrors.length);
  if (invariantErrors.length > 0) {
    console.log('INVARIANT ERRORS:');
    invariantErrors.forEach(err => {
      console.log('  -', err.text);
    });
  } else {
    console.log('✅ NO INVARIANT ERRORS FOUND!');
  }

  console.log('\n' + '='.repeat(60));
});

test('test with hard browser refresh', async ({ page }) => {
  console.log('\n🔄 Testing with hard refresh (clearing cache)...');

  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      console.log('🔴', msg.text());
      errors.push(msg.text());
    }
  });

  page.on('pageerror', (error) => {
    console.log('💥', error.message);
    errors.push(error.message);
  });

  // Navigate with no cache
  await page.goto('https://invoices.alexandratechlab.com', {
    waitUntil: 'networkidle'
  });

  // Hard reload
  console.log('🔄 Performing hard reload...');
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  await page.screenshot({ path: 'test-results/after-hard-refresh.png', fullPage: true });

  console.log('\n📊 Errors after hard refresh:', errors.length);
  const invariantCount = errors.filter(e => e.toLowerCase().includes('invariant')).length;
  console.log('   Invariant errors:', invariantCount);

  if (invariantCount > 0) {
    console.log('\n❌ INVARIANT ERRORS STILL EXIST');
  } else {
    console.log('\n✅ NO INVARIANT ERRORS');
  }
});
