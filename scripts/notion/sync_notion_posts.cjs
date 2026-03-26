const https = require('https');

const API_KEY = process.env.NOTION_TOKEN;
const DATABASE_ID = "30f556a1-98c7-8164-a3a2-f04b8ffd0a8b";

const headers = {
    'Authorization': 'Bearer ' + API_KEY,
    'Notion-Version': '2022-06-28',
    'Content-Type': 'application/json'
};

function request(method, path, data) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'api.notion.com',
            path,
            method,
            headers
        }, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(body));
                } else {
                    reject(new Error(`HTTP ${res.statusCode}: ${body}`));
                }
            });
        });
        req.on('error', reject);
        req.write(JSON.stringify(data));
        req.end();
    });
}

const commonProps = {
    "アカウント": {
        "multi_select": [{ "name": "X: @hukuro_educator" }]
    },
    "画像•動画の有無": {
        "select": { "name": "画像なし" }
    }
};

async function updatePage(pageId) {
    await request('PATCH', '/v1/pages/' + pageId, { properties: commonProps });
    console.log('Updated page:', pageId);
}

async function createPage(title, dateStr, content) {
    const page = await request('POST', '/v1/pages', {
        parent: { database_id: DATABASE_ID },
        properties: {
            ...commonProps,
            "タイトル": { title: [{ text: { content: title } }] },
            "予約日時": { date: { start: dateStr } }
        }
    });

    await request('PATCH', '/v1/blocks/' + page.id + '/children', {
        children: [
            {
                object: "block",
                type: "paragraph",
                paragraph: { rich_text: [{ type: "text", text: { content: content } }] }
            }
        ]
    });
    console.log('Created page for:', title);
}

const postsToCreate = [
    {
        title: "「プロンプトエンジニアリング」を必死に学ぶのは、そろそろやめた方がいい。",
        date: "2026-02-26T18:00:00+09:00",
        content: "これからの主戦場は、どうプロンプトを書くかではなく「いかにAI専用の情報基盤（データベース）を設計するか」。\n\nNotionを使って、AIが自律的にプロジェクトの全体像を把握し、必要な仕様を勝手に読み込めるアーキテクチャを作る。これからの開発現場は、この環境構築ができているチームの一人勝ちになる。"
    },
    {
        title: "先月納品したクライアントから「業務指示の時間が1/5になった」と報告があった。",
        date: "2026-02-26T21:00:00+09:00",
        content: "やったことはシンプル。\n社内のバラバラなマニュアルやタスク管理をすべてNotionに集約し、AIエージェントがそれを直接読みに行ける「情報基盤」を再設計しただけ。\n\nAIの性能を引き上げる一番の近道は、AIとチャットすることではなく、AIが勝手に情報を拾える環境を作ること。"
    },
    {
        title: "NotionとAIを個別で使っているのに、連携させていないのは本当にもったいない。",
        date: "2026-02-27T08:00:00+09:00",
        content: "テキストファイルでAIのコンテキストを管理するのはすぐに限界が来る。\n正解は、日々のタスクやプロジェクト管理で使っているNotionのデータベース自体を、そのままAIの「ナレッジ」として直結させること。\n\nこの”情報を一元管理するアーキテクチャ”が組めないと、AIと人間の情報伝達コストですり減っていく。"
    },
    {
        title: "AIを導入して「逆に時間がかかるようになった」という声を聞く。",
        date: "2026-02-27T12:00:00+09:00",
        content: "原因は明白で、AIに毎回ゼロから背景を説明しているから。\n\n優秀なAIも、前提知識がなければただの汎用アシスタント。\n私がクライアントの環境を構築する時は、Notionのデータベース上に事業の全ルールを構造化し、それをAIの「常設の脳」として機能させる。\n\nこの仕組みさえ作れば、指示は「いつものこれやって」の1行で終わる。"
    },
    {
        title: "AIエージェントへの指示出しに時間をかけている人は、本質を見誤っている。",
        date: "2026-02-27T18:00:00+09:00",
        content: "優秀なエンジニアやチームは今、AIに「どう指示するか」よりも「AIがいかに動きやすい環境を作るか」に注力している。\n\nタスク管理もドキュメントもすべてNotion等のDBに集約し、AIが直接読み取れるように構造化する。\n人間は「やるべきこと」をNotionにただ積むだけ。"
    },
    {
        title: "「AIになかなか意図が伝わらない」と悩んでいたチームのスピードが劇的に変わった。",
        date: "2026-02-27T21:00:00+09:00",
        content: "彼らが変えたのはプロンプトのテクニックではなく、「情報の置き場所」。\n仕様書やコードの規約をNotionのデータベースにまとめ、AIエージェントがいつでも参照できるようにした。\n\nその結果、「この機能の実装よろしく（あとはNotion見てね）」で済むように。\nAIに教え込むのではなく、AIが自ら学ぶ環境を与える。"
    },
    {
        title: "「とりあえず話題のAIエージェントを入れてみた」だけで終わっていませんか？",
        date: "2026-02-28T08:00:00+09:00",
        content: "エージェントに自律的に動いてもらうには、必ず「情報源」が必要。\n社内のルールや過去の経緯が整理されていない状態でAIを走らせても、見当外れなコードが出力されるだけ。\n\nだからこそ、導入前にNotionで情報の構造化を行うことが必須条件になる。"
    },
    {
        title: "NotionとAIエージェントの連携は、もはや「便利ツール」ではなく「インフラ」だ。",
        date: "2026-02-28T12:00:00+09:00",
        content: "単発のタスク解決ならChatGPTで十分かもしれない。だが、チーム開発や長期プロジェクトにおいてコンテキストの共有漏れは致命傷になる。\n\nNotionにタスクや仕様を集約し、エージェントが自律的にそこから情報を引く仕組みがあれば、人間がAIに「背景を教える」時間はゼロになる。\n\n情報のハブをNotionに置き、AIの実行環境と直結させる。"
    }
];

async function main() {
    try {
        await updatePage("312556a1-98c7-8164-bd6b-f1d07f33bdf6");
        await updatePage("314556a1-98c7-817c-a4ec-e8b839c43d26");
        for (const post of postsToCreate) {
            await createPage(post.title, post.date, post.content);
        }
        console.log("All done!");
    } catch (err) {
        console.error("Error:", err);
    }
}

main();
