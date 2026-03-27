# スキルレジストリ

`.company/スキル/` 配下のスキル一覧と、各部署からの利用関係。

## スキル一覧

| スキル | パス | 概要 | 主な利用部署 |
|---|---|---|---|
| human-like-writing | `.company/スキル/human-like-writing/SKILL.md` | AIっぽさを消す前提ルール | CMO, CPO, 営業（全文章生成の土台） |
| x-post-creator | `.company/スキル/x-post-creator/SKILL.md` | Xポスト作成の統合ルール | CMO |
| x-article-creator | `.company/スキル/x-article-creator/SKILL.md` | 長文記事作成 | CMO |
| content-creator | `.company/スキル/content-creator/SKILL.md` | コンテンツ作成フレームワーク | CMO, 営業 |
| content-design | `.company/スキル/content-design/SKILL.md` | LP・UIコピー設計 | CPO |
| frontend-design | `.company/スキル/frontend-design/SKILL.md` | フロントエンドデザイン | CPO |
| notion-crud | `.company/スキル/notion-crud/SKILL.md` | Notion DB操作 | CPO, CTO, 財務, 営業 |

## スキルの階層構造

```
human-like-writing（基礎層・最優先）
    ├── content-creator（SNS・ブログ向け）
    ├── content-design（LP・UI向け）
    ├── x-post-creator（Xポスト向け）
    └── x-article-creator（長文記事向け）

notion-crud（独立・DB操作時に全部署から参照）
frontend-design（独立・フロントエンド制作時）
```

## ワークフロー

| ワークフロー | パス | 概要 | 利用部署 |
|---|---|---|---|
| x-post-creation | `.company/マーケティング責任者/ワークフロー/x-post-creation.md` | Xポスト作成手順 | CMO |
| x-post-persona-hukuro | `.company/マーケティング責任者/ワークフロー/x-post-persona-hukuro.md` | ふくろうペルソナ定義 | CMO |

## スクリプト

| スクリプト | パス | 概要 | 管理部署 |
|---|---|---|---|
| generate_image_gemini.js | `.company/技術責任者/スクリプト/generate_image_gemini.js` | Gemini画像生成 | CTO |
| generate_diagram.js | `.company/技術責任者/スクリプト/generate_diagram.js` | 図解生成 | CTO |
| screenshot_url.js | `.company/技術責任者/スクリプト/screenshot_url.js` | URLスクリーンショット | CTO |
