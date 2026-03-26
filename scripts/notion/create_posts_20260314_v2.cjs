const https = require('https');

const API_KEY = process.env.NOTION_TOKEN;
if (!API_KEY) { console.error('NOTION_TOKEN required.'); process.exit(1); }

const DATABASE_ID = "30f556a1-98c7-8164-a3a2-f04b8ffd0a8b";
const CALLOUT_ICON_URL = "https://www.notion.so/icons/document_gray.svg";
const headers = {
    'Authorization': 'Bearer ' + API_KEY,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
};

function request(method, path, data) {
    return new Promise((resolve, reject) => {
        const req = https.request({ hostname: 'api.notion.com', path, method, headers }, res => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(body));
                else reject(new Error('HTTP ' + res.statusCode + ': ' + body.substring(0, 200)));
            });
        });
        req.on('error', reject);
        req.write(JSON.stringify(data));
        req.end();
    });
}

async function archivePage(id) {
    await request('PATCH', '/v1/pages/' + id, { archived: true });
    console.log('  Archived:', id.substring(0, 12));
}

async function createPost(post) {
    const page = await request('POST', '/v1/pages', {
        parent: { database_id: DATABASE_ID },
        properties: {
            "1\u6587\u76ee\u30d5\u30c3\u30af": { title: [{ text: { content: post.title } }] },
            "\u4e88\u7d04\u65e5\u6642": { date: { start: post.date } },
            "\u30a2\u30ab\u30a6\u30f3\u30c8": { multi_select: [{ name: "X: @hukuro_educator" }] },
            "\u753b\u50cf\u2022\u52d5\u753b\u306e\u6709\u7121": { select: { name: "\u30c6\u30ad\u30b9\u30c8\u306e\u307f" } },
            "\u6e96\u5099\u5b8c\u4e86": { checkbox: false },
            "\u6295\u7a3f\u30bf\u30a4\u30d7": { select: { name: post.type } },
            "\u30bf\u30fc\u30b2\u30c3\u30c8\u5c64": { select: { name: post.target } },
            "\u6559\u80b2\u8981\u7d20": { multi_select: post.education.map(e => ({ name: e })) },
            "\u671f\u5f85\u30a2\u30af\u30b7\u30e7\u30f3": { select: { name: post.action } },
            "\u6295\u7a3f\u76ee\u7684": { multi_select: post.purpose.map(p => ({ name: p })) },
            "\u30d5\u30c3\u30af\u7a2e\u985e": { multi_select: post.hooks.map(h => ({ name: h })) }
        }
    });
    await request('PATCH', '/v1/blocks/' + page.id + '/children', {
        children: [{
            object: "block", type: "callout",
            callout: {
                icon: { type: "external", external: { url: CALLOUT_ICON_URL } },
                rich_text: [{ type: "text", text: { content: post.content } }]
            }
        }]
    });
    console.log('  [OK]', post.title.substring(0, 30));
}

const archiveIds = [
    "322556a1-98c7-8131-b083-e4d8282545d7",
    "322556a1-98c7-81c9-990a-ed1ead93d4c6",
    "322556a1-98c7-8189-b13c-e380b80b4b51",
    "322556a1-98c7-81bc-bc63-f831e9d92b8e",
    "322556a1-98c7-8103-9780-c5e737300cfa",
    "322556a1-98c7-814a-85a7-cd60543a76a5",
    "322556a1-98c7-81c5-a192-ea7583e7c307",
    "322556a1-98c7-8150-8e90-ff4695f4de56",
    "322556a1-98c7-8167-bd6d-f547e7a21469",
    "322556a1-98c7-8185-a0f0-f4e0c3dbe9aa"
];

const posts = [
    {
        title: "\u30de\u30b8\u3067\u982d\u304c\u6574\u7406\u3055\u308c\u305f\u3002",
        date: "2026-03-14T08:00:00+09:00",
        type: "\u65e5\u5e38\u30a2\u30a6\u30c8\u30d7\u30c3\u30c8",
        target: "1\u6bb5\u76ee\uff08\u521d\u5fc3\u8005\uff09",
        education: ["\u601d\u8003\u306e\u6559\u80b2"],
        action: "\u3044\u3044\u306d",
        purpose: ["\u8208\u5473\u4ed8\u3051", "\u65e5\u5e38\u30a2\u30a6\u30c8\u30d7\u30c3\u30c8"],
        hooks: ["\u30b9\u30c8\u30fc\u30ea\u30fc"],
        content:
"マジで頭が整理された。\n\nぼくの発信、\nずっと軸がブレてた。\n\nAIすごい、じゃなくて\nNotionを中心にしたエコシステム。\n\nAI、Dify、公式LINE。\n全部Notionから繋がってる。\n\nNotionが情報のハブで\nそこにAIが乗る構造。\n\nこの軸に据えたら\n発信の方向が一気にクリアになった。\n\nブレてた時間がもったいなかった 😭"
    },
    {
        title: "Notion\u306e\u4e2d\u306b\u307c\u304f\u5c02\u7528\u306e\u30de\u30b9\u30bf\u30fcAI\u3092\u4f5c\u3063\u305f\u3002",
        date: "2026-03-14T09:30:00+09:00",
        type: "\u3061\u3087\u3044\u81ea\u6162",
        target: "1\u6bb5\u76ee\uff08\u521d\u5fc3\u8005\uff09",
        education: ["\u30ce\u30a6\u30cf\u30a6\u30fb\u77e5\u8b58", "\u601d\u8003\u306e\u6559\u80b2"],
        action: "\u4fdd\u5b58",
        purpose: ["\u8208\u5473\u4ed8\u3051", "\u3061\u3087\u3044\u81ea\u6162"],
        hooks: ["\u5b9f\u7e3e\u30fb\u6570\u5b57"],
        content:
"Notionの中に\nぼく専用のマスターAIを作った。\n\nタスク整理、\n提案書作成、\nMTG事前準備、\nLINE文面作成。\n\n全部このAIが\nNotionのDBを直接読んで自動でやる。\n\n今15個以上のスキルが動いてる 🔥\n\nこれをぼく1人で使うんじゃなくて\nチームで使える設計に作り直してる最中。\n\nここが商品の核になる予感がしてる。"
    },
    {
        title: "\u8b1b\u7fa9\u3092\u898b\u3066\u3001\u901f\u653b\u3067\u81ea\u5206\u306e\u30b5\u30fc\u30d3\u30b9\u306b\u5f53\u3066\u306f\u3081\u305f\u3002",
        date: "2026-03-14T11:00:00+09:00",
        type: "\u65e5\u5e38\u30a2\u30a6\u30c8\u30d7\u30c3\u30c8",
        target: "0\u6bb5\u76ee\uff08\u672a\u7d4c\u9a13\uff09",
        education: ["\u884c\u52d5\u306e\u6559\u80b2"],
        action: "\u3044\u3044\u306d",
        purpose: ["\u8208\u5473\u4ed8\u3051", "\u65e5\u5e38\u30a2\u30a6\u30c8\u30d7\u30c3\u30c8"],
        hooks: ["\u30b9\u30c8\u30fc\u30ea\u30fc", "\u5373\u6548\u6027"],
        content:
"講義を見て、\n速攻で自分のサービスに当てはめた。\n\n悩みの3層構造\n→ ゴール3つの柱\n→ 魅力要素4分類\n\nこのフレームワークで\nNotion構築代行のコンセプトを整理したら\n\n自分でも驚くくらい\nサービスの輪郭がクリアになった。\n\n学んで終わりにせず\nその日のうちに事業に落とし込む。\n\nこのスピード感だけは\n絶対に落とさない 🔥"
    },
    {
        title: "\u30dd\u30fc\u30c8\u30d5\u30a9\u30ea\u30aa\u3001\u3084\u3063\u3068\u5f62\u306b\u306a\u3063\u305f\u3002",
        date: "2026-03-14T12:30:00+09:00",
        type: "\u6210\u679c\u5831\u544a",
        target: "\u5168\u30bb\u30b0\u30e1\u30f3\u30c8",
        education: ["\u601d\u8003\u306e\u6559\u80b2"],
        action: "\u3044\u3044\u306d",
        purpose: ["\u65e5\u5e38\u30a2\u30a6\u30c8\u30d7\u30c3\u30c8", "\u3061\u3087\u3044\u81ea\u6162"],
        hooks: ["\u30b9\u30c8\u30fc\u30ea\u30fc"],
        content:
"ポートフォリオ、やっと形になった。\n\n正直、\n想像以上に時間がかかった。\n\n何を載せるか、より\n何を伝えたいか。\n\nここで迷い続けた結果\n業務フロー整理から\nナレッジベースの設計まで\n全部見直すことになった。\n\n遠回りに見えたけど\nこの過程で自分のサービスの強みが\n言語化できた。\n\nポートフォリオは自分の棚卸し。"
    },
    {
        title: "\u3076\u3063\u3061\u3083\u3051\u308b\u3068\u3001\u307e\u3060\u53d7\u6ce8\u30bc\u30ed\u3002",
        date: "2026-03-14T14:00:00+09:00",
        type: "\u30b9\u30c8\u30fc\u30ea\u30fc\u578b",
        target: "0\u6bb5\u76ee\uff08\u672a\u7d4c\u9a13\uff09",
        education: ["\u4fe1\u983c\u69cb\u7bc9", "\u884c\u52d5\u306e\u6559\u80b2"],
        action: "\u30d5\u30a9\u30ed\u30fc",
        purpose: ["\u95a2\u4fc2\u69cb\u7bc9", "\u8208\u5473\u4ed8\u3051"],
        hooks: ["\u30b9\u30c8\u30fc\u30ea\u30fc", "\u6570\u5b57\u30fb\u5b9f\u7e3e"],
        content:
"ぶっちゃけると、\nまだ受注ゼロ。\n\nNotion CRMの設計も\nAIエージェントの構築も\n全部自分用に作ったものを磨いてる段階。\n\n初回受注前のフェーズで\n何をやるかの優先順位が\n全然見えてなかった。\n\n今はデモ用の実物CRMを\n作り込んでる。\n\nまだ何も結果出てない。\nでもここからが本番。"
    },
    {
        title: "3\u301c15\u540d\u306e\u5c0f\u898f\u6a21\u30c1\u30fc\u30e0\u5411\u3051\u306bNotion CRM\u3092\u8a2d\u8a08\u3057\u3066\u308b\u3002",
        date: "2026-03-14T15:30:00+09:00",
        type: "\u901a\u5e38\u30dd\u30b9\u30c8",
        target: "1\u6bb5\u76ee\uff08\u521d\u5fc3\u8005\uff09",
        education: ["\u30ce\u30a6\u30cf\u30a6\u30fb\u77e5\u8b58"],
        action: "\u4fdd\u5b58",
        purpose: ["\u6559\u80b2", "\u8208\u5473\u4ed8\u3051"],
        hooks: ["\u6570\u5b57\u30fb\u5b9f\u7e3e", "\u518d\u73fe\u6027"],
        content:
"3〜15名の小規模チーム向けに\nNotion CRMを設計してる。\n\n・営業パイプライン\n・活動ログ\n・プロジェクト管理\n・タスク管理\n・ナレッジ\n\n全部1つのNotionに集約して\nAIが横断的にデータを引ける構造。\n\nさらにゴール管理と\n日報の自動生成まで乗せてる。\n\n社長がボトルネックになる組織を\n仕組みで解消する設計。\n\nこれがぼくの商品。"
    },
    {
        title: "\u65e5\u5831\u306e\u81ea\u52d5\u751f\u6210\u30a8\u30fc\u30b8\u30a7\u30f3\u30c8\u3092\u4f5c\u3063\u305f\u3002",
        date: "2026-03-14T17:00:00+09:00",
        type: "\u3061\u3087\u3044\u81ea\u6162",
        target: "1\u6bb5\u76ee\uff08\u521d\u5fc3\u8005\uff09",
        education: ["\u30ce\u30a6\u30cf\u30a6\u30fb\u77e5\u8b58"],
        action: "\u3044\u3044\u306d",
        purpose: ["\u3061\u3087\u3044\u81ea\u6162", "\u65e5\u5e38\u30a2\u30a6\u30c8\u30d7\u30c3\u30c8"],
        hooks: ["\u5b9f\u7e3e\u30fb\u6570\u5b57"],
        content:
"日報の自動生成エージェントを作った。\n\nNotionのタスクDBと会話ログDBを\nAIが読んで\n\nその日のハイライト、\n明日のフォーカス。\n全部自動でまとめる仕組み。\n\n日報って毎日のことだから\nここの手間を仕組みで消せたのはデカい。\n\nNotionにデータが溜まってるからこそ\nできる自動化。\n\n散らばったツール使ってたら\nこうはいかない。"
    },
    {
        title: "AI\u30c4\u30fc\u30eb\u306f\u6bce\u9031\u65b0\u3057\u3044\u306e\u304c\u51fa\u3066\u304f\u308b\u3002",
        date: "2026-03-14T18:30:00+09:00",
        type: "\u901a\u5e38\u30dd\u30b9\u30c8",
        target: "1\u6bb5\u76ee\uff08\u521d\u5fc3\u8005\uff09",
        education: ["\u624b\u6bb5\u306e\u7d5e\u308a\u8fbc\u307f", "\u601d\u8003\u306e\u6559\u80b2"],
        action: "\u4fdd\u5b58",
        purpose: ["\u6559\u80b2", "\u8a8d\u77e5\u7372\u5f97"],
        hooks: ["\u5e38\u8b58\u7834\u58ca", "\u30c8\u30ec\u30f3\u30c9"],
        content:
"AIツールは\n毎週新しいのが出てくる。\n\nでもぼくは\nツールを追いかけるのをやめた。\n\nNotionを情報のハブにして\nそこにAIやLINEを繋げる。\n\nツールが変わっても\n中心のNotionが変わらなければ\n全体は壊れない。\n\nこの考え方に切り替えてから\nやるべきことが\n一気にシンプルになった。\n\n追いかけるんじゃなくて\n中心を決める。"
    },
    {
        title: "X\u306e\u6295\u7a3f\u306e\u578b\u3092\u898b\u76f4\u3057\u3066\u305f\u3002",
        date: "2026-03-14T20:00:00+09:00",
        type: "\u65e5\u5e38\u30a2\u30a6\u30c8\u30d7\u30c3\u30c8",
        target: "\u5168\u30bb\u30b0\u30e1\u30f3\u30c8",
        education: ["\u30ce\u30a6\u30cf\u30a6\u30fb\u77e5\u8b58"],
        action: "\u3044\u3044\u306d",
        purpose: ["\u65e5\u5e38\u30a2\u30a6\u30c8\u30d7\u30c3\u30c8"],
        hooks: ["\u30b9\u30c8\u30fc\u30ea\u30fc"],
        content:
"Xの投稿の型を見直してた。\n\n抽象的なフックで引きつけて\n具体で落とす。\n\nこの構成を\n再現性のあるパターンにしたくて\n過去のポストを全部分析した。\n\n伸びたやつと伸びなかったやつの違い、\n結局フックの解像度だった。\n\n抽象度が高すぎると刺さらない。\n具体から入ると読まれない。\n\nこのバランスを\nやっと掴みかけてる 🤔"
    },
    {
        title: "\u6df1\u591c\u3084\u304b\u3089\u3076\u3063\u3061\u3083\u3051\u308b\u3051\u3069",
        date: "2026-03-14T21:30:00+09:00",
        type: "\u30b9\u30c8\u30fc\u30ea\u30fc\u578b",
        target: "0\u6bb5\u76ee\uff08\u672a\u7d4c\u9a13\uff09",
        education: ["\u884c\u52d5\u306e\u6559\u80b2", "\u4fe1\u983c\u69cb\u7bc9"],
        action: "\u30d5\u30a9\u30ed\u30fc",
        purpose: ["\u95a2\u4fc2\u69cb\u7bc9", "\u8208\u5473\u4ed8\u3051"],
        hooks: ["\u30b9\u30c8\u30fc\u30ea\u30fc", "\u6570\u5b57\u30fb\u5b9f\u7e3e"],
        content:
"深夜やからぶっちゃけるけど\n\nぼくのXアカウント、\nまだ全然見られてない。\n\nインプ200とかの世界 😅\n\nでもその中で\nNotionのCRM設計して\nAIエージェント15個作って\nポートフォリオ作って\n日報の自動化まで組んだ。\n\n見られてない時期に\nどれだけ仕込めるかで\n後の爆発力が変わる。\n\n今は静かに弾を込めてるだけ。"
    }
];

async function main() {
    console.log('=== Archiving previous 10 posts ===');
    for (const id of archiveIds) {
        try { await archivePage(id); }
        catch (e) { console.log('  Skip:', id.substring(0,12), e.message.substring(0,60)); }
    }
    console.log('');
    console.log('=== Creating 10 new posts (v2 format) ===');
    for (let i = 0; i < posts.length; i++) {
        try { await createPost(posts[i]); console.log('  [' + (i+1) + '/10]'); }
        catch (e) { console.error('  FAIL [' + (i+1) + ']:', e.message.substring(0,150)); }
    }
    console.log('\nDone!');
}
main();
