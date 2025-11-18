const playwright = require('playwright');
const path = require('path');
const fs = require('fs');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

async function captureScreenshots() {
  console.log('🎬 Starting screenshot capture...');
  console.log(`📍 Frontend URL: ${FRONTEND_URL}`);

  // Ensure screenshots directory exists
  const screenshotsDir = path.join(__dirname, 'frontend', 'public', 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await playwright.chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    // Create context with larger viewport
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1
    });

    const page = await context.newPage();

    // Admin Dashboard Screenshots
    console.log('\n📸 Capturing Admin Dashboard...');
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Login as admin
    await page.fill('input[type="email"]', 'admin@invoiceocr.ai');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button:has-text("Admin Portal")');
    await page.waitForTimeout(3000);

    // Wait for navigation to complete
    await page.waitForURL(/\/admin\/dashboard/, { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Capture admin dashboard
    await page.screenshot({
      path: path.join(screenshotsDir, 'admin-dashboard.png'),
      fullPage: false
    });
    console.log('✅ Admin dashboard screenshot saved');

    // Capture invoices page
    await page.goto(`${FRONTEND_URL}/admin/invoices`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'admin-invoices.png'),
      fullPage: false
    });
    console.log('✅ Admin invoices screenshot saved');

    // Logout
    await page.click('[data-icon="user"]');
    await page.waitForTimeout(500);
    await page.click('text=Logout');
    await page.waitForTimeout(2000);

    // Client Dashboard Screenshots
    console.log('\n📸 Capturing Client Dashboard...');
    await page.goto(`${FRONTEND_URL}/login`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Login as client
    await page.fill('input[type="email"]', 'client@test.com');
    await page.fill('input[type="password"]', 'client123');
    await page.click('button:has-text("Client Portal")');
    await page.waitForTimeout(3000);

    // Wait for navigation to complete
    await page.waitForURL(/\/client\/dashboard/, { timeout: 10000 });
    await page.waitForTimeout(3000);

    // Capture client dashboard - Desktop
    await page.screenshot({
      path: path.join(screenshotsDir, 'client-dashboard-desktop.png'),
      fullPage: false
    });
    console.log('✅ Client dashboard (desktop) screenshot saved');

    // Switch to mobile view
    const mobileButton = await page.locator('button:has([data-icon="mobile"])');
    if (await mobileButton.count() > 0) {
      await mobileButton.click();
      await page.waitForTimeout(1000);

      // Capture mobile view
      await page.screenshot({
        path: path.join(screenshotsDir, 'client-dashboard-mobile.png'),
        fullPage: false
      });
      console.log('✅ Client dashboard (mobile) screenshot saved');
    }

    // Capture client invoices page
    await page.goto(`${FRONTEND_URL}/client/invoices`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'client-invoices.png'),
      fullPage: false
    });
    console.log('✅ Client invoices screenshot saved');

    // Capture advanced reports
    await page.goto(`${FRONTEND_URL}/client/advanced-reports`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({
      path: path.join(screenshotsDir, 'client-reports.png'),
      fullPage: false
    });
    console.log('✅ Client reports screenshot saved');

    console.log('\n✨ All screenshots captured successfully!');

  } catch (error) {
    console.error('❌ Error capturing screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

captureScreenshots().catch(console.error);
