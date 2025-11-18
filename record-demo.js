const { chromium, devices } = require('playwright');
const fs = require('fs');
const path = require('path');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const OUTPUT_DIR = './demo-videos';

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function recordDesktop() {
  console.log('🎥 Recording Desktop Version...');

  const browser = await chromium.launch({
    headless: true,
    slowMo: 500 // Slow down actions for better viewing
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();

  try {
    // Navigate to platform
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Take screenshots at key points
    await page.screenshot({ path: `${OUTPUT_DIR}/01-homepage-desktop.png`, fullPage: true });

    // Login (adjust selectors based on your actual UI)
    try {
      await page.fill('input[type="email"]', 'admin@alexandratechlab.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button:has-text("Login")');
      await page.waitForTimeout(3000);
    } catch (e) {
      console.log('Login not required or already logged in');
    }

    // Navigate through main features
    const features = [
      'Dashboard',
      'Invoices',
      'Upload',
      'Clients',
      'Reports',
      'Settings'
    ];

    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      try {
        await page.click(`text=${feature}`);
        await page.waitForTimeout(3000);
        const filename = feature.toLowerCase();
        await page.screenshot({
          path: `${OUTPUT_DIR}/${filename}-desktop.png`,
          fullPage: true
        });
      } catch (e) {
        console.log(`Feature "${feature}" not found, skipping...`);
      }
    }

  } catch (error) {
    console.error('Error during desktop recording:', error);
  }

  await context.close();
  await browser.close();

  console.log('✅ Desktop recording completed!');
}

async function recordMobile() {
  console.log('📱 Recording Mobile Version...');

  const browser = await chromium.launch({
    headless: true,
    slowMo: 500
  });

  const iPhone = devices['iPhone 13 Pro'];

  const context = await browser.newContext({
    ...iPhone,
    recordVideo: {
      dir: OUTPUT_DIR,
      size: { width: 390, height: 844 }
    }
  });

  const page = await context.newPage();

  try {
    // Navigate to platform
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    await page.screenshot({ path: `${OUTPUT_DIR}/01-homepage-mobile.png`, fullPage: true });

    // Login
    try {
      await page.fill('input[type="email"]', 'admin@alexandratechlab.com');
      await page.fill('input[type="password"]', 'admin123');
      await page.click('button:has-text("Login")');
      await page.waitForTimeout(3000);
    } catch (e) {
      console.log('Login not required or already logged in');
    }

    // Navigate through mobile menu
    try {
      // Open mobile menu
      await page.click('[aria-label="Menu"]');
      await page.waitForTimeout(1000);
    } catch (e) {
      console.log('Mobile menu not found');
    }

    const features = ['Dashboard', 'Invoices', 'Upload', 'Settings'];

    for (let i = 0; i < features.length; i++) {
      const feature = features[i];
      try {
        await page.click(`text=${feature}`);
        await page.waitForTimeout(3000);
        const filename = feature.toLowerCase();
        await page.screenshot({
          path: `${OUTPUT_DIR}/${filename}-mobile.png`,
          fullPage: true
        });
      } catch (e) {
        console.log(`Feature "${feature}" not found, skipping...`);
      }
    }

  } catch (error) {
    console.error('Error during mobile recording:', error);
  }

  await context.close();
  await browser.close();

  console.log('✅ Mobile recording completed!');
}

async function main() {
  console.log('🎬 Invoice OCR Platform - Demo Recording');
  console.log('Frontend URL:', FRONTEND_URL);
  console.log('Output Directory:', OUTPUT_DIR);
  console.log('');

  await recordDesktop();
  console.log('');
  await recordMobile();

  console.log('');
  console.log('📹 All recordings saved to:', OUTPUT_DIR);
  console.log('Video files will be named like: video-<timestamp>.webm');
}

main().catch(console.error);
