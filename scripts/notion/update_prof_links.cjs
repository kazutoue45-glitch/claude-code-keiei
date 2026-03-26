require('dotenv').config();
const { Client } = require('@notionhq/client');
const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function main() {
    const sparkieDbId = '30f556a1-98c7-8164-a3a2-f04b8ffd0a8b';

    let hasMore = true;
    let cursor = undefined;
    let count = 0;

    while (hasMore) {
        const res = await notion.databases.query({
            database_id: sparkieDbId,
            start_cursor: cursor,
        });

        for (const page of res.results) {
            // Fetch blocks for the page
            let blockHasMore = true;
            let blockCursor = undefined;
            while (blockHasMore) {
                const blocks = await notion.blocks.children.list({
                    block_id: page.id,
                    start_cursor: blockCursor
                });

                for (const block of blocks.results) {
                    if (block.type === 'callout') {
                        const textArr = block.callout.rich_text;
                        const fullText = textArr.map(t => t.plain_text).join('');
                        if (fullText.includes('プロフ')) {
                            console.log('Found "プロフ" in callout on page:', page.url);
                            const newText = fullText.split('\n').filter(line => !line.includes('プロフ')).join('\n');
                            await notion.blocks.update({
                                block_id: block.id,
                                callout: {
                                    rich_text: [{ type: 'text', text: { content: newText } }]
                                }
                            });
                            console.log('Updated callout block successfully.');
                            count++;
                        }
                    } else if (block.type === 'paragraph') {
                        const textArr = block.paragraph.rich_text;
                        const fullText = textArr.map(t => t.plain_text).join('');
                        if (fullText.includes('プロフ')) {
                            console.log('Found "プロフ" in paragraph on page:', page.url);
                            const newText = fullText.split('\n').filter(line => !line.includes('プロフ')).join('\n');
                            await notion.blocks.update({
                                block_id: block.id,
                                paragraph: {
                                    rich_text: [{ type: 'text', text: { content: newText } }]
                                }
                            });
                            console.log('Updated paragraph block successfully.');
                            count++;
                        }
                    }
                }
                blockHasMore = blocks.has_more;
                blockCursor = blocks.next_cursor;
            }
        }
        hasMore = res.has_more;
        cursor = res.next_cursor;
    }
    console.log(`Finished checking pages. Updated ${count} blocks.`);
}

main().catch(console.error);
