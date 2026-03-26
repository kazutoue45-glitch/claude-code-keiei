const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

/**
 * Capture a screenshot of a given URL and upload it to catbox.moe.
 *
 * Usage:
 * node screenshot_url.js "<URL>" ["<CSS Selector to clip>"]
 */

async function screenshotUrl(targetUrl, selector = null) {
    console.log(`Launching headless browser to capture: ${targetUrl}`);
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 }); // High-res screenshot

    try {
        await page.goto(targetUrl, { waitUntil: 'networkidle2', timeout: 30000 });

        // Extra wait for Notion pages to render internal blocks
        await new Promise(r => setTimeout(r, 5000));

        const outputPath = path.join(__dirname, `screenshot_${Date.now()}.png`);

        if (selector) {
            console.log(`Waiting for selector: ${selector}`);
            const element = await page.waitForSelector(selector, { timeout: 10000 });
            await element.screenshot({ path: outputPath, type: 'png' });
        } else {
            console.log("Capturing viewport screenshot...");
            await page.screenshot({ path: outputPath, type: 'png', fullPage: false });
        }

        console.log(`Saved screenshot to: ${outputPath}`);
        await browser.close();

        console.log("Uploading to catbox.moe via curl...");

        const { stdout } = await execPromise(`curl -s -F "reqtype=fileupload" -F "fileToUpload=@${outputPath}" https://catbox.moe/user/api.php`);
        const catboxUrl = stdout.trim();

        if (!catboxUrl.startsWith('https://')) {
            throw new Error(`Upload returned unexpected output: ${catboxUrl}`);
        }

        console.log(`\n✅ Upload Success! URL: ${catboxUrl}`);

        // Optional: Clean up
        // fs.unlinkSync(outputPath);

        return catboxUrl;

    } catch (err) {
        console.error("Error during screenshot or upload:", err);
        await browser.close();
        return null;
    }
}

// Simple CLI wrapper
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 1) {
        console.log('Usage: node screenshot_url.js "<URL>" ["<CSS Selector>"]');
        process.exit(1);
    }

    const [url, selector] = args;
    screenshotUrl(url, selector).then(catboxUrl => {
        if (catboxUrl) {
            console.log(`[OUTPUT_URL]: ${catboxUrl}`);
        }
    }).catch(console.error);
}

module.exports = { screenshotUrl };
