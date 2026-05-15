# LP案件フォルダの行動ルール（最重要）

このフォルダ配下のいずれかのLP案件に手を入れる時、**コードを1行でも書く前**に必ず以下を実行する。

## 0. 必読スキル（毎回・例外なし）

LPに関する作業（新規制作・修正・リライト・スタイル変更すべて）の開始時に、以下を **すべて読んでから** 作業に入る：

1. `.company/スキル/claude-design/SKILL.md`
2. `.company/スキル/claude-design/references/design-principles.md` — Anti-slop / Craft / Content / Design-system thinking / Final gut check
3. `.company/スキル/claude-design/references/workflow.md` — 質問チェックリスト・visual context gathering
4. `.company/スキル/claude-design/references/design-styles.md` — 10哲学のうちこのLPはどれで行くか
5. `.company/スキル/claude-design/references/verification.md` — 完了前のセルフチェック

「微調整だから」「前回読んだから」を理由にスキップしない。**毎回開く**。これは「重複の手間」ではなく「過去セッションで合意した判断軸を毎回引き当てる」ための動作。

## 1. 作業前のセルフチェック（design-principles.md の Anti-slop を当てる）

コードを書く前に、これから作る or 修正するブロックが以下のいずれにも該当していないか確認：

- ❌ 角丸カード＋左ボーダーアクセント（最頻出AI臭パターン）
- ❌ 3カラム feature grid をデフォルト構造として採用
- ❌ アイコン付きバレットリスト（情報を運ばないアイコン）
- ❌ SVG手描きで実物（人物・建物・製品）を代用
- ❌ Inter / Roboto / Arial / system-ui の生使用
- ❌ 攻撃的グラデ背景（紫→青、サンセット）
- ❌ AI を象徴する紫→ピンクのグラデ球体
- ❌ emoji（ブランドが使ってない場合）

該当があるなら、design-principles.md の代替案リスト（背景色／フルブリード写真／ナラティブ／グリッド破り等）に切り替える。

## 2. システムを宣言してから配置（Craft rule）

LPファイルの先頭に、HTMLコメントで以下を書く（or 既存のCLAUDE.md/コメントに追記）：

```
- type scale: 例 72/48/32/20/16/13
- background colors: 例 紫(#4C1D95) / 緑(#2E8B57) / 青(#2563B8) + 白
- spacing grid: 例 4/8/12/16/24/32/48/64
- section-header pattern: eyebrow → catch → lead
```

宣言したら**最後まで守る**。28pxを「なんとなく」追加しない。

## 3. 日本のLP補完ルール（claude-design に明示されていない部分）

### モバイルファースト
- CSSは「mobile = default → @media (min-width: ...) で PC override」の順で書く
- ヒーロー写真の `aspect-ratio` と `object-position` は **モバイルでの被写体可視性を最優先で決める**
- PCはmobileの拡張として扱う

### 写真の上にテキストを重ねる（hero overlay）
- LPでは「画像と文字を別ブロックに置く」より「画像の上にテキストを重ねる」のが基本
- 写真は**画像生成された装飾**ではなく、コンテンツの一部として読者の視線を引く存在
- グラデーション tint は **テキストの読みやすさを確保する最小限の濃度** に留める（写真の中身が判別できるレベル）

### サービス／ブロック識別色
- 複数サービス・複数カテゴリを並べるLPでは、各々に **イメージカラー** を割り当て、**背景色**として全面に使う
- アクセント色（文字色だけ）では識別が立たない。背景全面で識別を効かせる

### ZERO型▼転換ブロック
- 「主張 → ▼ → 証拠／次セクション」の視線誘導は日本のLPで効く
- ディープな背景色＋下端を `clip-path: polygon(...)` で▼に切り欠く
- 主張ピーク → 落差 → 次の山 のリズム作りに使える

### 合格実績などの「証拠」セクションでAI画像生成は禁止
- 合格者・合格校・声・実績写真は **AI生成厳禁**
- 実物を取得できないなら placeholder（グレー＋ラベル）で正直に欠を示す
- 公式サイト or Wikimedia Commons CC ライセンス画像が代替の最終手段

## 4. ストーリー優先（Content rule）

各セクションは「データの羅列」ではなく「読者の心が動くナラティブ」で書く：

- ❌ dl/dt/dd の表で「対象：小3〜高3」「料金：14,300円〜」を並べる
- ✅ 「家ではどうしてもやる気が出ない」という読者の痛みから始まる物語
- メタ情報（対象/料金等）は本文の**後**に小さく添える（情報としては必要だが主役ではない）

「箇条書きで人の心は動かない」を肝に銘じる。

## 5. 完了前の verification（verification.md の通り）

ブラウザで実機ロードしてから「完了」と言う。最低限：
- スマホ幅（375px）で表示確認 — **写真が見切れていないか**
- PC幅（1280px以上）で表示確認
- 各セクション間の遷移が破綻していないか
- console error がないか（font 404・JS エラー等）

## 6. ユーザーへの報告ルール

- スマホ表示の変更内容を**先に**書く（モバイルファーストの原則）
- PC側は副次変更として末尾に1行
- 「変更されてない」と言われた時、最初に確認すべきは GH Pages のデプロイ完了状態（CDNキャッシュ時間込み）

---

## 現在管轄しているLP案件

- `yoshijuku/` — 義塾LP（寝屋川・成田町の学習塾、3サービス併走）
- `yoshijuku-lp/` — 義塾LPの別リポジトリ版
- `karma/` `brand-butsuryu/` `tankyu-presen-battle/` `tankyu-presen-battle-b2b/` `kobetsu-forest/` — 他案件
- `notion-bizbase/` `notion-bizbase-portfolio/` — Notion関連LP

各案件は **独立した世界観** を持つ。同じテンプレで作ると claude-design "Match what's there" 違反になる。
