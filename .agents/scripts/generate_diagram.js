const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
// Native fetch might be available in newer Node.js, otherwise we will need node-fetch.
const fetch = global.fetch || require('node-fetch');

/**
 * Generate a beautifully styled diagram image and upload it to catbox.moe.
 *
 * Usage:
 * node generate_diagram.js "Title" "Step 1 text" "Step 2 text" "Step 3 text" "Highlight text"
 */

async function generateDiagram(title, step1, step2, step3, highlight) {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
        <meta charset="UTF-8">
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@500;700;900&display=swap');
            
            body {
                margin: 0;
                padding: 0;
                width: 1080px;
                height: 1080px;
                background-color: #0f172a; /* Slate 900 for premium dark mode */
                color: #f8fafc;
                font-family: 'Noto Sans JP', sans-serif;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                box-sizing: border-box;
                padding: 80px;
                position: relative;
                overflow: hidden;
            }

            /* Subtle background flair */
            .bg-glow {
                position: absolute;
                top: -100px;
                right: -100px;
                width: 600px;
                height: 600px;
                background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0) 70%);
                border-radius: 50%;
                z-index: 0;
            }

            .content {
                z-index: 1;
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }

            .header {
                text-align: left;
                margin-bottom: 40px;
            }

            .title {
                font-size: 64px;
                font-weight: 900;
                line-height: 1.3;
                background: linear-gradient(135deg, #38bdf8, #e0f2fe);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                margin: 0;
                letter-spacing: -0.02em;
            }

            .steps-container {
                display: flex;
                flex-direction: column;
                gap: 30px;
                flex-grow: 1;
                justify-content: center;
            }

            .step {
                display: flex;
                align-items: center;
                background: rgba(30, 41, 59, 0.7);
                border: 1px solid rgba(51, 65, 85, 0.6);
                border-radius: 20px;
                padding: 30px 40px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            }

            .step-number {
                font-size: 48px;
                font-weight: 900;
                color: #cbd5e1;
                margin-right: 40px;
                min-width: 60px;
                text-align: center;
                font-style: italic;
                opacity: 0.5;
            }

            .step-text {
                font-size: 44px;
                font-weight: 700;
                color: #f1f5f9;
                line-height: 1.5;
            }

            .highlight-box {
                margin-top: 40px;
                background: linear-gradient(135deg, rgba(14, 165, 233, 0.2), rgba(2, 132, 199, 0.1));
                border-left: 8px solid #38bdf8;
                padding: 40px;
                border-radius: 0 20px 20px 0;
            }

            .highlight-label {
                font-size: 28px;
                color: #7dd3fc;
                font-weight: 700;
                margin-bottom: 15px;
                letter-spacing: 0.05em;
            }

            .highlight-text {
                font-size: 52px;
                font-weight: 900;
                color: #ffffff;
                line-height: 1.4;
            }

            .watermark {
                position: absolute;
                bottom: 40px;
                right: 50px;
                font-size: 24px;
                color: rgba(148, 163, 184, 0.5);
                font-weight: 500;
                letter-spacing: 0.1em;
            }
        </style>
    </head>
    <body>
        <div class="bg-glow"></div>
        <div class="content">
            <div class="header">
                <h1 class="title">${title}</h1>
            </div>
            
            <div class="steps-container">
                <div class="step">
                    <div class="step-number">01</div>
                    <div class="step-text">${step1}</div>
                </div>
                <div class="step">
                    <div class="step-number">02</div>
                    <div class="step-text">${step2}</div>
                </div>
                <div class="step">
                    <div class="step-number">03</div>
                    <div class="step-text">${step3}</div>
                </div>
            </div>

            ${highlight ? `
            <div class="highlight-box">
                <div class="highlight-label">RESULT</div>
                <div class="highlight-text">${highlight}</div>
            </div>
            ` : ''}
        </div>
        <div class="watermark">Created by System</div>
    </body>
    </html>
    `;

    console.log("Launching headless browser to render diagram...");
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=medium']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 2 }); // Setup for high-res 1:1 image
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    const outputPath = path.join(__dirname, `diagram_${Date.now()}.png`);
    await page.screenshot({ path: outputPath, type: 'png' });
    console.log(`Saved screenshot to: ${outputPath}`);

    await browser.close();

    console.log("Uploading to catbox.moe...");
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    try {
        const { stdout } = await execPromise(`curl -s -F "reqtype=fileupload" -F "fileToUpload=@${outputPath}" https://catbox.moe/user/api.php`);
        const url = stdout.trim();
        if (!url.startsWith('https://')) {
            throw new Error(`Upload returned unexpected output: ${url}`);
        }
        console.log(`\n✅ Upload Success! URL: ${url}`);

        // Optional: clean up local file
        // fs.unlinkSync(outputPath);

        return url;
    } catch (err) {
        console.error("Failed to upload image via curl:", err);
        return null; // Return null so the calling script knows it failed, but we still have local file
    }
}

// Simple CLI wrapper
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.length < 4) {
        console.log('Usage: node generate_diagram.js "Title" "Step 1" "Step 2" "Step 3" ["Highlight Text"]');
        process.exit(1);
    }

    const [title, s1, s2, s3, highlight] = args;
    generateDiagram(title, s1, s2, s3, highlight).then(url => {
        if (url) {
            // For easily grep'ing the output in agent workflows
            console.log(`[OUTPUT_URL]: ${url}`);
        }
    }).catch(console.error);
}

module.exports = { generateDiagram };
