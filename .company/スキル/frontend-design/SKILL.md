---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (animation-delay) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.

---

## LP制作の鉄則（義塾LPセッションでの学習）

### 1. 参考LPの「本質」を見抜く
参考LP（例：ZERO LP）を渡されたとき、表面装飾（マーカー、強調色、絵文字）だけを真似ても近づかない。本質は以下のレイヤーにある：
- **配色設計**：黒地に白＋オレンジ／白地に黒＋紫など、コントラストと支配色の選択
- **密度**：1画面に何項目入るか、項目間の余白、アイコンサイズ
- **カードの有無**：白カードを並べるか、リスト形式（カードなし）か
- **アイコンの形態区別**：悩み＝？／解決＝✓のように形そのものを変えて区別する（同じ色の別記号は区別にならない）
- **イラストの役割**：装飾ではなく「左右にシルエットを配置してリストと並行表示」など意味のある配置
- **ストーリーの流れ**：項目を並べるのではなく、悩み→出会い→解決の物語性

「表面だけ真似て近づかない」と言われたら、上記レイヤーまで降りる。

### 2. 「余白を詰めろ」の正しい解釈
ユーザーが「余白がデカい」「詰めろ」と指摘した時、**全部を圧縮するのは間違い**。
- **詰めるべき**：リスト項目間（同じグループ要素の間）、アイコン高さによるli膨らみ
- **保つべき**：セクション周辺の padding、見出し下マージン、橋渡し前後、グループ間の境界
- 「全部ギチギチ」にすると逆に見にくい。**部分密／周辺ゆとり**が原則

### 3. CSS 上書きの罠（旧 media query を残さない）
新しい余白指定を上に追加するだけで、**ファイル末尾の旧 media query を削除し忘れる**と、CSS は後勝ち＆同等特異度なら後者が勝つため、最新値が完全に無効化される。
- 設計を変えた時は **古いブロックを必ず grep して削除**
- 残骸ルールを置くのは即「上書き地獄」の原因

### 4. CSS filter で色変換は危険
`filter: brightness(0) saturate(...) hue-rotate(...)` で白→任意色に変換する手法は計算が複雑で、実際のレンダリング結果が想定外（紫を狙ったらピンクになる等）になりやすい。
- **代わりに**：Python PIL で画像の可視ピクセルを直接 hex 色に置換して保存する方が確実
- どうしても CSS で変える必要があるなら、`mask-image: url(...)` + `background-color: <色>` で意図通りの色になる

### 5. 装飾線は独断で追加しない（AIっぽさの根源）
- **NG**：カードの一辺だけ細い色帯（border-top/left/right/bottom）、項目間の破線、見出し脇の縦罫
- **OK**：背景色、シャドウ、書体サイズ、写真／イラスト
- 参考LPに「装飾線が見える」と思っても、その装飾は「**どの粒度で使われているか**」を必ず確認する。例：ZERO LP の破線は「Before大ブロック」と「After大ブロック」の境界線で、項目間ではない。粒度を取り違えると意味のない装飾を量産する

### 6. 画像生成は Codex 経由（ChatGPT Image 2.0）が必須
- インライン SVG を手書きで装飾する（月桂冠・sparkle・グラデ等）と必ずチープになる
- 必要な画像（バッジ、ピクトグラム、人物イラスト、シルエット）は `codex exec` で生成して `<img>` で配置
- Codex プロンプトでは「OpenAI image API（gpt-image-1）を使え」と書くと Python+API_KEY ルートに行くので失敗する。**「画像生成ツールを使って〜」とシンプルに頼む** → 組み込みツールが動く
- 過去生成は `~/.codex/generated_images/<session>/` に残る

### 7. 絶対配置の `<img>` を歪ませない
- `position: absolute; top: 0; bottom: 0; height: 100%; width: auto;` は親の高さに img が伸縮する → アスペクト比が崩れる
- 代わりに：`top: 50%; transform: translateY(-50%); width: <固定px>; height: auto;` で画像の縦横比を保つ

### 8. テキスト揃えはセクション内で統一
- Notion 構成案や原稿で「基本左揃え」と指定されているなら、SectionHeader / lead / 本文 / 注釈すべて左揃え
- 例外（中央揃え）は CTA ボタン本体、画像／QR、テーブルセル、フッター著作権表記など機能的に必要な場面のみ

### 9. 質問は推測より具体的なフィードバック要求
「どこがどう違うか具体的に教えてください」「スクショあれば送ってください」と聞く方が、自分の推測で根本リライトを提案するより早い。**ユーザーの見えている景色を先に揃える**。

> **デザイン判断の詳細は `.company/スキル/claude-design/` を参照**：Anti-slop / Craft / Content / 10のデザイン哲学 / Core Asset Protocol が体系的にまとまっています。

