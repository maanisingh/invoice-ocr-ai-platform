const { chromium } = require('playwright');
const fs = require('fs');

const FRONTEND_URL = process.env.FRONTEND_URL || 'https://disciplined-youth-production.up.railway.app';
const OUTPUT_DIR = './public/videos';

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
    console.log('📹 Recording: Loading homepage...');
    await page.goto(FRONTEND_URL);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);

    // Try to login if login page exists
    try {
      console.log('📹 Recording: Attempting login...');
      const emailInput = await page.locator('input[type="email"]').first();
      if (await emailInput.isVisible({ timeout: 2000 })) {
        await emailInput.fill('demo@alexandratechlab.com');
        await page.locator('input[type="password"]').first().fill('demo123');
        await page.locator('button:has-text("Login"), button:has-text("Sign in")').first().click();
        await page.waitForTimeout(4000);
      }
    } catch (e) {
      console.log('No login required or already logged in');
    }

    // Dashboard view
    console.log('📹 Recording: Dashboard...');
    await page.waitForTimeout(3000);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await page.waitForTimeout(2000);

    // Navigate through features
    const features = [
      { text: 'Invoices', wait: 3000 },
      { text: 'Upload', wait: 3000 },
      { text: 'Analytics', wait: 3000 },
      { text: 'Dashboard', wait: 3000 }
    ];

    for (const feature of features) {
      try {
        console.log(`📹 Recording: ${feature.text}...`);
        await page.click(`text=${feature.text}`);
        await page.waitForTimeout(feature.wait);
        await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
        await page.waitForTimeout(1000);
      } catch (e) {
        console.log(`Feature "${feature.text}" not found, continuing...`);
      }
    }

    // Smooth scroll demonstration
    console.log('📹 Recording: Scroll demonstration...');
    await page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 100;
        const timer = setInterval(() => {
          const scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;

          if(totalHeight >= scrollHeight / 2) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    await page.waitForTimeout(2000);

    // Scroll back to top
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
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
  console.log('1. Video saved to public/videos/demo-video.webm');
  console.log('2. Landing page will automatically use it');
  console.log('3. Optional: Convert to MP4 for better compatibility:');
  console.log('   ffmpeg -i public/videos/demo-video.webm -c:v libx264 -c:a aac public/videos/demo-video.mp4');
}

createMarketingVideo().catch(console.error);
