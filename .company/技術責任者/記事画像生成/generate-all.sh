#!/bin/bash
# チームNotion記事用の画像を一括生成
# 実行: ./generate-all.sh
# APIキー: 環境変数 GEMINI_API_KEY または .env に GEMINI_API_KEY=xxx を記載

set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"
GEN_SCRIPT="$ROOT_DIR/.agents/scripts/generate_image_gemini.js"
OUT_DIR="$SCRIPT_DIR"

# .env から読み込み（存在する場合）
if [ -f "$SCRIPT_DIR/.env" ]; then
  set -a
  source "$SCRIPT_DIR/.env"
  set +a
fi
if [ -f "$ROOT_DIR/.env" ] && [ -z "$GEMINI_API_KEY" ]; then
  set -a
  source "$ROOT_DIR/.env"
  set +a
fi

if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ GEMINI_API_KEY が未設定です。"
  echo "   export GEMINI_API_KEY=your_key または"
  echo "   $SCRIPT_DIR/.env に GEMINI_API_KEY=xxx を記載してください。"
  exit 1
fi

cd "$ROOT_DIR"

echo "📷 図解①: 個人利用 vs チーム利用..."
node "$GEN_SCRIPT" --prompt "フラットデザインのビジネス図解を1枚作成してください。左右対比図。左側は個人利用：自分のため、覚えておけばいい、自由に。右側はチーム利用：全員のため、見ればわかる、ルールありき。配色はネイビー背景、白テキスト、ゴールドのアクセント。余白多め、文字は太めで可読性最優先。横長16:9。ミニマルで洗練されたスタイル。日本語テキストのみ。" --aspect 16:9 --out "$OUT_DIR/fig1-personal-vs-team.png"

echo ""
echo "📷 図解②: チームNotion設計の3ステップ..."
node "$GEN_SCRIPT" --prompt "フラットデザインのビジネス図解を1枚作成してください。上から下へのフロー図。3ステップ：1.誰が何を見るか（アクセス設計）2.何をいつ入力するか（運用ルール）3.どうつなぐか（リレーション設計）。矢印で流れを示す。配色はネイビー背景、白テキスト、ゴールドのアクセント。余白多め、ミニマル。横長16:9。日本語テキストのみ。" --aspect 16:9 --out "$OUT_DIR/fig2-3steps.png"

echo ""
echo "📷 図解③: 日報・タスク・AI作業ログのリレーション..."
node "$GEN_SCRIPT" --prompt "フラットデザインのビジネス図解を1枚作成してください。3つのデータベースのリレーション構造図：日報DB、タスクDB、AI作業ログDB。日報とタスク、日報とAI作業ログが矢印でつながっている。配色はネイビー背景、白テキスト、ゴールドのアクセント。余白多め、ミニマル。横長16:9。日本語テキストのみ。" --aspect 16:9 --out "$OUT_DIR/fig3-relation.png"

echo ""
echo "📷 ヘッダー画像（5:2）..."
node "$GEN_SCRIPT" --prompt "X記事のヘッダー画像。ネイビー背景、白テキスト、ゴールドのアクセント。中央に大きく日本語タイトルを2行で配置：1行目「【チームNotion】「使われない」を防ぐ設計の順番」2行目「個人利用とチーム利用で変えるべき3つの前提」。フラットデザイン、ミニマル、ビジネス向け。余白多め、文字は太めで可読性最優先。" --aspect 5:2 --out "$OUT_DIR/header.png"

echo ""
echo "✅ 全4枚の画像生成が完了しました。"
echo "   出力先: $OUT_DIR"
ls -la "$OUT_DIR"/*.png 2>/dev/null || true
