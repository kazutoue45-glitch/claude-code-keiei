import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.environ.get("ANTHROPIC_API_KEY", "")
NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")

SPARKIE_DB_ID = "30f556a1-98c7-8164-a3a2-f04b8ffd0a8b"
CALLOUT_ICON_URL = "https://www.notion.so/icons/document_gray.svg"

POSTS_PER_DAY = 3
POST_CHAR_MIN = 180
POST_CHAR_MAX = 260

POST_SCHEDULE = [
    "08:00",
    "12:30",
    "19:00",
]

ACCOUNT_PROFILE = {
    "handle": "@hukuro_educator",
    "name": "ふくろう",
    "first_person": "ぼく",
    "genre": "AIエージェント・Notion",
    "tone": "実直・実践的・体温のある言葉",
    "stance": "プロフェッショナルかつプレイヤー。先生ポジションではなく泥臭い当事者",
    "target": "知識ゼロの0〜1段目の人",
    "credential": "Notion CRM設計、AIエージェント15個構築、日報自動生成",
    "positioning": "Notionを情報のハブにしてAIが自律的に動く仕組みを作る人",
    "goal_30day": "認知拡大→興味付け→リスト化の流れを構築",
    "ng_expressions": "いかがでしたでしょうか,まとめると,〜が大切です,〜ですか？,なぜなら,しかし,つまり,〜だと思います,〜すべき",
    "rules": "括弧類禁止,ダブルクォーテーション禁止,ハッシュタグ禁止,URL禁止,★●■装飾記号禁止,個人名禁止,ハルシネーション禁止",
    "category_weights": "ノウハウ・Tips:30, 実績・証拠:20, 煽り・問題提起:20, ツール紹介:15, マインドセット:15",
    "top_patterns": "唐突な感情フック→具体的事実→余韻で終わる,体験ベースの泥臭い話,数字や固有名詞で具体性を出す",
    "allowed_emoji": "❗️,‼️,🔥,😂,😅,😇,😭,😱,🤫,🤔,🦉",
    "max_emoji_per_post": 2,
}
