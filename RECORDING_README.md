# Demo Video Recording Guide

## ✅ Setup Complete

Playwright has been installed and configured to record demo videos of your Invoice OCR platform in both desktop and mobile views.

## 📋 Prerequisites

- Node.js installed
- Playwright installed (already done)
- Your frontend deployed and accessible

## 🎬 How to Use

### Option 1: Record Once Deployed to Railway

Once your Railway deployment is complete and you have the frontend URL:

```bash
# Set your frontend URL
export FRONTEND_URL="https://your-frontend.up.railway.app"

# Run the recording
node record-demo.js
```

### Option 2: Record Local Development

```bash
# Start your local frontend first
cd frontend
npm run dev

# In another terminal
export FRONTEND_URL="http://localhost:5173"
node record-demo.js
```

## 📹 What Gets Recorded

The script will create:

**Desktop Version (1920x1080):**
- Homepage
- Dashboard
- Invoices page
- Upload page
- Clients page
- Reports page
- Settings page

**Mobile Version (iPhone 13 Pro - 390x844):**
- Homepage
- Dashboard
- Invoices page
- Upload page
- Settings page

## 📂 Output

All recordings are saved to `./demo-videos/`:
- `video-*.webm` - Video recordings
- `*-desktop.png` - Desktop screenshots
- `*-mobile.png` - Mobile screenshots

## ⚙️ Customization

Edit `record-demo.js` to:
- Change the viewport sizes
- Add/remove features to record
- Adjust timing (waitForTimeout values)
- Change login credentials
- Modify selectors for your UI

## 🔧 Troubleshooting

**No display error:**
The script runs in headless mode (no visual browser window) which is perfect for servers.

**Login fails:**
Update the credentials in the script:
```javascript
await page.fill('input[type="email"]', 'your-email@example.com');
await page.fill('input[type="password"]', 'your-password');
```

**Features not found:**
Update the selectors to match your actual UI elements.

## 🎥 Convert to MP4 (Optional)

Playwright records in WebM format. To convert to MP4:

```bash
# Install ffmpeg
npm install -g ffmpeg

# Convert
ffmpeg -i demo-videos/video-*.webm -c:v libx264 -c:a aac demo.mp4
```

## 🚀 Alternative: Use OBS Studio

If you want manual recording with more control:

1. Install OBS Studio (open source): https://obsproject.com/
2. Set up browser source pointing to your URL
3. Record desktop (1920x1080) and mobile (390x844) separately
4. Export as MP4

## 📝 PowerShell Alternative

For Windows PowerShell, you can use:

```powershell
# Set environment variable
$env:FRONTEND_URL="https://your-frontend.up.railway.app"

# Run recording
node record-demo.js
```

## ✨ Features

- ✅ Open source (Playwright - Apache 2.0)
- ✅ Headless recording (no GUI needed)
- ✅ Desktop and mobile viewports
- ✅ Automatic screenshots
- ✅ Video recordings in WebM format
- ✅ Customizable for your specific features
- ✅ Works on Windows, Mac, Linux

---

**Need help?** Check Playwright docs: https://playwright.dev/docs/videos
