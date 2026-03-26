const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { promisify } = require("util");

const execPromise = promisify(exec);

/**
 * Gemini API で画像を生成し、catbox.moe にアップロードして URL を返す。
 *
 * Usage:
 *   node generate_image_gemini.js --prompt "プロンプト" [--aspect 16:9] [--out filename.png]
 *
 * Options:
 *   --prompt   画像生成プロンプト（必須）
 *   --aspect   アスペクト比。16:9 | 1:1 | 3:2 | 4:3 | 9:16 | 21:9（デフォルト: 16:9）
 *   --out      出力ファイル名（デフォルト: gemini_<timestamp>.png）
 *   --no-upload  catbox.moe へのアップロードをスキップ
 *
 * Environment:
 *   GEMINI_API_KEY  Google AI Studio で発行した API キー
 *
 * Notes:
 *   - X Articles ヘッダー画像（5:2）は 21:9 で生成後にトリミングする
 *   - 記事内図解は 16:9 で生成
 */

const SUPPORTED_ASPECTS = ["1:1", "3:2", "2:3", "3:4", "4:3", "4:5", "5:4", "9:16", "16:9", "21:9"];

function parseArgs(argv) {
  const args = { prompt: null, aspect: "16:9", out: null, upload: true };
  let i = 0;
  while (i < argv.length) {
    if (argv[i] === "--prompt" && argv[i + 1]) {
      args.prompt = argv[++i];
    } else if (argv[i] === "--aspect" && argv[i + 1]) {
      args.aspect = argv[++i];
    } else if (argv[i] === "--out" && argv[i + 1]) {
      args.out = argv[++i];
    } else if (argv[i] === "--no-upload") {
      args.upload = false;
    } else if (!args.prompt) {
      args.prompt = argv[i];
    }
    i++;
  }
  return args;
}

async function uploadToCatbox(filePath) {
  const { stdout } = await execPromise(
    `curl -s -F "reqtype=fileupload" -F "fileToUpload=@${filePath}" https://catbox.moe/user/api.php`
  );
  const url = stdout.trim();
  if (!url.startsWith("https://")) {
    throw new Error(`Upload returned unexpected output: ${url}`);
  }
  return url;
}

async function trimTo5x2(inputPath) {
  // 21:9 画像を 5:2 (= 2.5:1) にトリミング
  // 21:9 ≈ 2.33:1、5:2 = 2.5:1 なので上下を少しカット
  const sharp = await loadSharp();
  if (!sharp) {
    console.warn("⚠️ sharp が未インストールのため 5:2 トリミングをスキップ。21:9 のまま出力します。");
    return inputPath;
  }
  const metadata = await sharp(inputPath).metadata();
  const targetWidth = metadata.width;
  const targetHeight = Math.round(targetWidth / 2.5);
  const top = Math.round((metadata.height - targetHeight) / 2);

  const outputPath = inputPath.replace(".png", "_5x2.png");
  await sharp(inputPath)
    .extract({ left: 0, top, width: targetWidth, height: targetHeight })
    .toFile(outputPath);
  return outputPath;
}

async function loadSharp() {
  try {
    return require("sharp");
  } catch {
    return null;
  }
}

async function generateImage({ prompt, aspect, outputPath }) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY が設定されていません。\n" +
      "export GEMINI_API_KEY=your_key_here で設定するか、\n" +
      "Google AI Studio (https://aistudio.google.com/) で API キーを発行してください。"
    );
  }

  if (!SUPPORTED_ASPECTS.includes(aspect)) {
    throw new Error(
      `サポートされていないアスペクト比: ${aspect}\n` +
      `サポート: ${SUPPORTED_ASPECTS.join(", ")}`
    );
  }

  console.log(`🎨 Gemini で画像を生成中...`);
  console.log(`   プロンプト: ${prompt.substring(0, 80)}...`);
  console.log(`   アスペクト比: ${aspect}`);

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
    config: {
      responseModalities: ["IMAGE", "TEXT"],
      imageConfig: {
        aspectRatio: aspect,
      },
    },
  });

  // レスポンスから画像を抽出
  const parts = response.candidates?.[0]?.content?.parts;
  if (!parts) {
    throw new Error("Gemini API からレスポンスが返りませんでした。");
  }

  let imageFound = false;
  for (const part of parts) {
    if (part.inlineData) {
      const buffer = Buffer.from(part.inlineData.data, "base64");
      fs.writeFileSync(outputPath, buffer);
      imageFound = true;
      console.log(`✅ 画像を保存: ${outputPath}`);
      break;
    }
    if (part.text) {
      console.log(`   Gemini テキスト応答: ${part.text}`);
    }
  }

  if (!imageFound) {
    throw new Error(
      "Gemini API が画像を返しませんでした。プロンプトを調整してください。\n" +
      "安全フィルタに引っかかった可能性があります。"
    );
  }

  return outputPath;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.prompt) {
    console.log("Usage: node generate_image_gemini.js --prompt \"プロンプト\" [--aspect 16:9] [--out filename.png]");
    console.log("");
    console.log("Examples:");
    console.log('  node generate_image_gemini.js --prompt "Notion×AIの業務基盤設計を表すフラットデザインのビジネス図解" --aspect 16:9');
    console.log('  node generate_image_gemini.js --prompt "ヘッダー画像: ネイビー背景にゴールドのアクセント" --aspect 21:9');
    process.exit(1);
  }

  const outputFilename = args.out || `gemini_${Date.now()}.png`;
  const outputPath = path.join(__dirname, outputFilename);

  // 5:2 ヘッダー画像の場合: 21:9 で生成してトリミング
  let actualAspect = args.aspect;
  let needsTrim = false;
  if (args.aspect === "5:2") {
    console.log("📐 5:2 は直接サポートされないため、21:9 で生成後にトリミングします。");
    actualAspect = "21:9";
    needsTrim = true;
  }

  await generateImage({
    prompt: args.prompt,
    aspect: actualAspect,
    outputPath,
  });

  let finalPath = outputPath;
  if (needsTrim) {
    finalPath = await trimTo5x2(outputPath);
    if (finalPath !== outputPath) {
      console.log(`✅ 5:2 にトリミング完了: ${finalPath}`);
    }
  }

  if (args.upload) {
    console.log("📤 catbox.moe にアップロード中...");
    try {
      const url = await uploadToCatbox(finalPath);
      console.log(`✅ アップロード成功!`);
      console.log(`[OUTPUT_URL]: ${url}`);
    } catch (err) {
      console.error("❌ アップロード失敗:", err.message);
      console.log(`ローカルファイル: ${finalPath}`);
    }
  } else {
    console.log(`[OUTPUT_FILE]: ${finalPath}`);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error("❌ エラー:", err.message);
    process.exit(1);
  });
}

module.exports = { generateImage, uploadToCatbox };
