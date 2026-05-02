// @ts-check
import { defineConfig } from 'astro/config';

// 提案デモ: kazutoue45-glitch.github.io/claude-code-keiei/kobetsu-forest/
export default defineConfig({
  site: 'https://kazutoue45-glitch.github.io',
  base: '/claude-code-keiei/kobetsu-forest/',
  outDir: '../../../../docs/kobetsu-forest',
  trailingSlash: 'ignore',
  server: {
    host: true,
  },
});
