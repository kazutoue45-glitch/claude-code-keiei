const { Client } = require("@notionhq/client");
// 環境変数 NOTION_API_KEY を使用するように変更。もし設定されていない場合はエラーを出す
const token = process.env.NOTION_API_KEY || process.env.NOTION_KEY || process.env.NOTION_TOKEN;

if (!token) {
  console.error("NOTION_TOKEN is not set in environment variables");
  process.exit(1);
}

const notion = new Client({ auth: token });

async function createPage() {
  try {
    const response = await notion.pages.create({
      parent: { database_id: "30a556a1-98c7-805b-ae7e-000bda8fd663" },
      properties: {
        "タイトル": {
          title: [
            {
              text: {
                content: "【記事下書き】Notionカスタムエージェント リリース記事"
              }
            }
          ]
        },
        "カテゴリ": {
          select: {
            name: "📕 外部コンテンツ"
          }
        }
      },
      children: [
        {
          object: "block",
          type: "heading_1",
          heading_1: {
            rich_text: [
              {
                type: "text",
                text: { content: "【警告】AIとチャットするだけの時代は今日で終わった" }
              }
            ]
          }
        },
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [
              {
                type: "text",
                text: { content: "Notionカスタムエージェント正式リリースがもたらす「圧倒的格差」の正体" }
              }
            ]
          }
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: "【悲報】ただAIにプロンプトを打ち込んでいるだけの人は、これから確実に淘汰されます。" }
              }
            ]
          }
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: "毎回同じような指示を出し、期待外れの回答を修正する「不毛なラリー」に、あなたの貴重な人生の時間を奪われていませんか？" }
              }
            ]
          }
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: "あなたが寝ている間にも、完璧に教育された「あなた専用の分身チーム」がNotion上で自律的に業務を完遂し、朝起きれば完璧な成果物が揃っている世界。" }
              }
            ]
          }
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: "私も以前は「AIを使っているつもりで、実はAIの入力係に成り下がっている」状態でしたが、「AIを個別最適化して『飼い慣らす』」ことへ視点を変え、全てのボトルネックが破壊されました。\n\n旧来の「対話型AI」は毎回指示を待つだけの新人アルバイトですが、今回リリースされた「カスタムエージェント」は、自社の文脈を完全に理解して自走する「超優秀な右腕」です。" }
              }
            ]
          }
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [
              {
                type: "text",
                text: { content: "凡人がAIマスターに変わる、最強のエージェント構築「三位一体モデル（役割・文脈・自律設計）」を公開します。\n\n❶ 役割の憑依：エージェントに人格と目的をインストールするプロンプト\n❷ 文脈の統合：Notion全体のDBを血液として循環させる設定手順\n❸ 自律の付与：人間に質問せずとも、自ら思考し自己修正させる設計\n\n来る従量課金時代を生き残る唯一の道は、最初から質の高いエージェントをストックしておくこと。今すぐNotionを開き、この記事の手順通りに「最強の右腕」を構築してください。" }
              }
            ]
          }
        }
      ]
    });
    console.log("Success! Page created:", response.url);
  } catch (error) {
    console.error("Error creating page:", error.body || error);
  }
}

createPage();
