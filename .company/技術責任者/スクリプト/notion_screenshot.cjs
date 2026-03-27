/**
 * Notionスクリーンショット自動挿入スクリプト
 *
 * 指定URLのスクリーンショットを撮影し、Notion File Upload API経由でページに挿入する。
 *
 * Usage:
 *   node notion_screenshot.cjs <スクショ対象URL> <NotionページID>
 *   node notion_screenshot.cjs <スクショ対象URL> <NotionページID> --selector ".main-content"
 *   node notion_screenshot.cjs <スクショ対象URL> <NotionページID> --full
 *   node notion_screenshot.cjs <スクショ対象URL> <NotionページID> --after <block_id>
 *   node notion_screenshot.cjs --login  (初回のみ: Notionにログインしてセッション保存)
 *
 * 環境変数:
 *   NOTION_API_KEY — Notion Internal Integration Token (ntn_xxx)
 *
 * .env ファイルを同ディレクトリに配置するか、環境変数で直接渡す。
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// --- .env 読み込み（dotenv不要） ---
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      const value = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

loadEnv();

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_TOKEN_V2 = process.env.NOTION_TOKEN_V2;
const NOTION_VERSION = '2022-06-28'; // blocks API用
const NOTION_VERSION_FILE_UPLOAD = '2026-03-11'; // file upload API用
const NOTION_BASE = 'https://api.notion.com/v1';
const SESSION_DIR = path.join(__dirname, '.notion-session');

// --login モードのチェック（APIキー不要）
const isLoginMode = process.argv.includes('--login');

if (!isLoginMode && !NOTION_API_KEY) {
  console.error('Error: NOTION_API_KEY が設定されていません。');
  console.error('.env ファイルに NOTION_API_KEY=ntn_xxx を記載してください。');
  process.exit(1);
}

// --- ログインセッション管理 ---
async function loginToNotion() {
  console.log('Notionログインモード: ブラウザが開きます。ログインしてください。');
  console.log('ログイン完了後、ブラウザを閉じるとセッションが保存されます。\n');

  const browser = await puppeteer.launch({
    headless: false,
    userDataDir: SESSION_DIR,
    args: ['--window-size=1280,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('https://www.notion.so/login', { waitUntil: 'networkidle2' });

  // ブラウザが閉じられるまで待つ
  await new Promise(resolve => {
    browser.on('disconnected', resolve);
  });

  console.log('\nセッション保存完了! 以降はログイン不要でNotionページのスクショが撮れます。');
}

// --- CLI引数パース ---
function parseArgs(argv) {
  const args = argv.slice(2);
  const result = { url: null, pageId: null, selector: null, full: false, after: null, login: false };

  if (args.includes('--login')) {
    result.login = true;
    return result;
  }

  const positional = [];
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--selector' && i + 1 < args.length) {
      result.selector = args[++i];
    } else if (args[i] === '--full') {
      result.full = true;
    } else if (args[i] === '--after' && i + 1 < args.length) {
      result.after = args[++i];
    } else if (!args[i].startsWith('--')) {
      positional.push(args[i]);
    }
  }

  result.url = positional[0] || null;
  result.pageId = positional[1] || null;

  if (!result.url || !result.pageId) {
    console.error('Usage: node notion_screenshot.cjs <URL> <NotionページID> [options]');
    console.error('Options:');
    console.error('  --selector "CSS selector"  特定要素だけ撮影');
    console.error('  --full                     フルページスクショ');
    console.error('  --after <block_id>         特定ブロックの後に挿入');
    console.error('  --login                    Notionにログインしてセッション保存');
    process.exit(1);
  }

  // ページIDのハイフンを除去（UUID形式対応）
  result.pageId = result.pageId.replace(/-/g, '');

  return result;
}

// --- Step 1: スクリーンショット撮影 ---
async function captureScreenshot(url, { selector, full }) {
  console.log(`[1/3] スクリーンショット撮影: ${url}`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 2 });

  // Notion cookie認証
  if (NOTION_TOKEN_V2 && url.includes('notion.so')) {
    console.log('  cookie認証を使用');
    await page.setCookie({
      name: 'token_v2',
      value: NOTION_TOKEN_V2,
      domain: '.notion.so',
      path: '/',
      httpOnly: true,
      secure: true
    });
  }

  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    // Notionページのレンダリング待ち
    await new Promise(r => setTimeout(r, 5000));

    const outputPath = path.join(__dirname, `screenshot_${Date.now()}.png`);

    if (selector) {
      console.log(`  セレクタ: ${selector}`);
      const element = await page.waitForSelector(selector, { timeout: 10000 });
      await element.screenshot({ path: outputPath, type: 'png' });
    } else {
      await page.screenshot({ path: outputPath, type: 'png', fullPage: full });
    }

    await browser.close();
    console.log(`  保存先: ${outputPath}`);
    return outputPath;
  } catch (err) {
    await browser.close();
    throw err;
  }
}

// --- Step 2: Notion File Upload API ---
async function uploadToNotion(filePath) {
  console.log('[2/3] Notion File Upload API でアップロード...');

  // Step 2a: アップロードオブジェクト作成
  const createRes = await fetch(`${NOTION_BASE}/file_uploads`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': NOTION_VERSION_FILE_UPLOAD,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });

  if (!createRes.ok) {
    const errBody = await createRes.text();
    throw new Error(`File Upload 作成失敗 (${createRes.status}): ${errBody}`);
  }

  const uploadObj = await createRes.json();
  const fileUploadId = uploadObj.id;
  console.log(`  File Upload ID: ${fileUploadId}`);

  // Step 2b: ファイル送信（curl経由 — Node fetch + form-data の互換性問題を回避）
  const { execSync } = require('child_process');
  const curlCmd = [
    'curl', '-s', '--request', 'POST',
    '--url', `${NOTION_BASE}/file_uploads/${fileUploadId}/send`,
    '-H', `Authorization: Bearer ${NOTION_API_KEY}`,
    '-H', `Notion-Version: ${NOTION_VERSION_FILE_UPLOAD}`,
    '-F', `file=@${filePath}`
  ].map(a => a.includes(' ') && !a.startsWith('-') ? `"${a}"` : a).join(' ');

  let sendResult;
  try {
    const curlOutput = execSync(curlCmd, { encoding: 'utf-8', timeout: 30000 });
    sendResult = JSON.parse(curlOutput);
  } catch (err) {
    throw new Error(`ファイル送信失敗: ${err.message}`);
  }

  if (sendResult.object === 'error') {
    throw new Error(`ファイル送信失敗 (${sendResult.status}): ${sendResult.message}`);
  }

  console.log(`  アップロード完了 (status: ${sendResult.status})`);

  return fileUploadId;
}

// --- Step 3: Notionページに画像ブロック挿入 ---
async function insertImageBlock(pageId, fileUploadId, afterBlockId) {
  console.log('[3/3] Notionページに画像ブロックを挿入...');

  const body = {
    children: [
      {
        type: 'image',
        image: {
          type: 'file_upload',
          file_upload: { id: fileUploadId }
        }
      }
    ]
  };

  if (afterBlockId) {
    body.after = afterBlockId;
  }

  const res = await fetch(`${NOTION_BASE}/blocks/${pageId}/children`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${NOTION_API_KEY}`,
      'Notion-Version': NOTION_VERSION,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`画像ブロック挿入失敗 (${res.status}): ${errBody}`);
  }

  const result = await res.json();
  console.log('  挿入完了!');
  return result;
}

// --- メイン ---
async function main() {
  const opts = parseArgs(process.argv);

  if (opts.login) {
    await loginToNotion();
    return;
  }

  try {
    const screenshotPath = await captureScreenshot(opts.url, {
      selector: opts.selector,
      full: opts.full
    });

    const fileUploadId = await uploadToNotion(screenshotPath);

    await insertImageBlock(opts.pageId, fileUploadId, opts.after);

    // スクショファイルを削除
    fs.unlinkSync(screenshotPath);
    console.log('\n完了! スクリーンショットがNotionページに挿入されました。');

  } catch (err) {
    console.error('\nエラー:', err.message);
    process.exit(1);
  }
}

main();
