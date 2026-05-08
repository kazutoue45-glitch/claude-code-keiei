// @ts-check
import { defineConfig } from 'astro/config';

// 義塾LP（寝屋川市成田町）
// 公開URL: https://kazutoue45-glitch.github.io/claude-code-keiei/yoshijuku/
export default defineConfig({
  site: 'https://kazutoue45-glitch.github.io',
  base: '/claude-code-keiei/yoshijuku/',
  outDir: '../../../../docs/yoshijuku',
  trailingSlash: 'ignore',
  server: {
    host: true,
  },
});
