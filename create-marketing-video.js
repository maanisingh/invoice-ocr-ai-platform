const { chromium } = require('playwright');
const fs = require('fs');

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://disciplined-youth-production.up.railway.app';
const OUTPUT_DIR = './frontend/public/videos';

// Create output directory
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function createMarketingVideo() {
  console.log('🎬 Creating Professional Marketing Video...');
  console.log('Frontend URL:', FRONTEND_URL);

  const browser = await chromium.launch({
    headless: true,
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
    // Load landing page
    console.log('📹 Recording: Loading landing page...');
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Scroll through landing page
    console.log('📹 Recording: Landing page scroll...');
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' }));
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    // Navigate to login
    console.log('📹 Recording: Navigating to login...');
    try {
      await page.click('button:has-text("Sign In"), a:has-text("Sign In")');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('Navigating to /login directly');
      await page.goto(FRONTEND_URL + '/login');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }

    // Click Admin button
    console.log('📹 Recording: Clicking Admin login...');
    try {
      const adminButton = page.locator('button:has-text("Admin"), button:has-text("admin")').first();
      await adminButton.click();
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('Admin button not found, trying direct credentials...');
    }

    // Fill admin credentials (if needed)
    console.log('📹 Recording: Admin dashboard...');
    await page.waitForTimeout(3000);

    // Navigate through admin features
    const adminFeatures = [
      { selector: 'text=Dashboard', wait: 3000 },
      { selector: 'text=Invoices', wait: 3000 },
      { selector: 'text=Upload', wait: 2000 },
      { selector: 'text=Clients', wait: 2000 },
      { selector: 'text=Reports', wait: 2000 },
    ];

    for (const feature of adminFeatures) {
      try {
        console.log(`📹 Recording: ${feature.selector}...`);
        await page.click(feature.selector);
        await page.waitForTimeout(feature.wait);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log(`Feature "${feature.selector}" not found, continuing...`);
      }
    }

    // Smooth scroll demonstration
    console.log('📹 Recording: Admin dashboard scroll...');
    await page.evaluate(async () => {
      window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    // Logout
    console.log('📹 Recording: Logging out...');
    try {
      await page.click('[aria-label="Logout"], button:has-text("Logout"), button:has-text("Sign out")');
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('Logout button not found, going to login page directly');
      await page.goto(FRONTEND_URL + '/login');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(2000);
    }

    // Click Client button
    console.log('📹 Recording: Clicking Client login...');
    try {
      const clientButton = page.locator('button:has-text("Client"), button:has-text("client")').first();
      await clientButton.click();
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log('Client button not found...');
    }

    // Navigate through client features
    console.log('📹 Recording: Client dashboard...');
    await page.waitForTimeout(3000);

    const clientFeatures = [
      { selector: 'text=Dashboard', wait: 3000 },
      { selector: 'text=Invoices', wait: 3000 },
      { selector: 'text=Upload', wait: 2000 },
      { selector: 'text=Reports', wait: 2000 },
    ];

    for (const feature of clientFeatures) {
      try {
        console.log(`📹 Recording: Client ${feature.selector}...`);
        await page.click(feature.selector);
        await page.waitForTimeout(feature.wait);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log(`Feature "${feature.selector}" not found, continuing...`);
      }
    }

    // Final scroll
    console.log('📹 Recording: Client dashboard scroll...');
    await page.evaluate(async () => {
      window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
    });
    await page.waitForTimeout(2000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    // Back to landing page
    console.log('📹 Recording: Return to landing page...');
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    console.log('✅ Recording complete!');

  } catch (error) {
    console.error('❌ Error during recording:', error);
  }

  await context.close();

  // Get the video file path
  const videoPath = await new Promise((resolve) => {
    setTimeout(() => {
      const files = fs.readdirSync(OUTPUT_DIR);
      const videoFile = files.find(f => f.endsWith('.webm'));
      if (videoFile) {
        const oldPath = `${OUTPUT_DIR}/${videoFile}`;
        const newPath = `${OUTPUT_DIR}/demo-video.webm`;
        if (fs.existsSync(newPath)) {
          fs.unlinkSync(newPath);
        }
        fs.renameSync(oldPath, newPath);
        resolve(newPath);
      }
    }, 2000);
  });

  await browser.close();

  console.log('');
  console.log('🎉 Marketing video created successfully!');
  console.log('📁 Location:', videoPath);
  console.log('');
  console.log('Next steps:');
  console.log('1. Video saved to frontend/public/videos/demo-video.webm');
  console.log('2. Landing page will automatically use it');
  console.log('3. Commit and push: git add . && git commit -m "Update demo video" && git push');
}

createMarketingVideo().catch(console.error);
