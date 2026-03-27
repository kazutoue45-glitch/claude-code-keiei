const { Client } = require("@notionhq/client");
require("dotenv").config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const blocksToFix = [
    "314556a1-98c7-8184-95e1-dfcd98683c18",
    "314556a1-98c7-81bd-b1b7-da0a9daf8262"
];

async function fixBlock(blockId) {
    try {
        const block = await notion.blocks.retrieve({ block_id: blockId });
        if (block.type === "callout") {
            let rich_text = block.callout.rich_text;
            if (rich_text.length > 0) {
                let text = rich_text[0].text.content;
                if (text.includes("\\n")) {
                    text = text.replace(/\\n/g, '\n');
                    await notion.blocks.update({
                        block_id: blockId,
                        callout: {
                            rich_text: [{ text: { content: text } }]
                        }
                    });
                    console.log(`Fixed block ${blockId}`);
                } else {
                    console.log(`Block ${blockId} is fine`);
                }
            }
        }
    } catch (e) {
        console.error(`Error fixing block ${blockId}:`, e.message);
    }
}

async function main() {
    for (const blockId of blocksToFix) {
        await fixBlock(blockId);
    }
}

main();
