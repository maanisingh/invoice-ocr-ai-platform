# Invoice OCR Platform - Demo Video Recording Script
# Uses Playwright to record desktop and mobile versions

# Install Playwright if not already installed
# npm install -D @playwright/test
# npx playwright install

# Configuration
$FRONTEND_URL = "https://your-frontend-url.up.railway.app"
$OUTPUT_DIR = "./demo-videos"

# Create output directory
New-Item -ItemType Directory -Force -Path $OUTPUT_DIR

# Desktop recording script
$desktopScript = @"
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: '$OUTPUT_DIR',
      size: { width: 1920, height: 1080 }
    }
  });
  
  const page = await context.newPage();
  
  // Navigate to your platform
  await page.goto('$FRONTEND_URL');
  await page.waitForTimeout(2000);
  
  // Login (adjust selectors based on your app)
  await page.fill('input[type="email"]', 'demo@example.com');
  await page.fill('input[type="password"]', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  
  // Navigate through features
  await page.click('text=Dashboard');
  await page.waitForTimeout(3000);
  
  await page.click('text=Invoices');
  await page.waitForTimeout(3000);
  
  await page.click('text=Upload');
  await page.waitForTimeout(3000);
  
  await page.click('text=Analytics');
  await page.waitForTimeout(3000);
  
  // Close and save
  await context.close();
  await browser.close();
  
  console.log('Desktop recording saved!');
})();
"@

# Mobile recording script
$mobileScript = @"
const { chromium, devices } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const iPhone = devices['iPhone 13 Pro'];
  
  const context = await browser.newContext({
    ...iPhone,
    recordVideo: {
      dir: '$OUTPUT_DIR',
      size: { width: 390, height: 844 }
    }
  });
  
  const page = await context.newPage();
  
  // Navigate to your platform
  await page.goto('$FRONTEND_URL');
  await page.waitForTimeout(2000);
  
  // Login
  await page.fill('input[type="email"]', 'demo@example.com');
  await page.fill('input[type="password"]', 'demo123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);
  
  // Navigate through features
  await page.click('text=Dashboard');
  await page.waitForTimeout(3000);
  
  await page.click('text=Invoices');
  await page.waitForTimeout(3000);
  
  // Close and save
  await context.close();
  await browser.close();
  
  console.log('Mobile recording saved!');
})();
"@

# Save scripts
$desktopScript | Out-File -FilePath "record-desktop.js" -Encoding UTF8
$mobileScript | Out-File -FilePath "record-mobile.js" -Encoding UTF8

Write-Host "Recording desktop version..."
node record-desktop.js

Write-Host "Recording mobile version..."
node record-mobile.js

Write-Host "Videos saved to: $OUTPUT_DIR"
Write-Host "Done!"
