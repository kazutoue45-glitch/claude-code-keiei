# Resumo Técnico — {{NOME_PROJETO}}

> Gerado automaticamente por `/lp-expert` em {{DATA}}

## URLs

- LP principal: {{URL_LP}}
- Página de download: {{URL_DOWNLOAD}} *(se aplicável)*
- Thank-you page: {{URL_THANKYOU}} *(se aplicável)*

## Arquivos no servidor

```
deploy/
├── index.html
├── download/index.html          ← se aplicável
├── obrigado/index.html          ← se aplicável
├── {{LOGO_FILENAME}}
├── {{HERO_FILENAME}}
├── robots.txt
└── sitemap.xml
```

## Stack

- HTML único + Tailwind CDN 3.x + Material Design 3 tokens
- Fontes: {{FONT_HEADLINE}} + {{FONT_BODY}} (Google Fonts)
- Ícones: Material Symbols Outlined

## Tracking

- GTM ID: {{GTM_ID}}
- Webhook: {{WEBHOOK_URL}}
- UTM capture: sessionStorage (prefixo `gr_`)
  - `gr_utm_source`, `gr_utm_medium`, `gr_utm_campaign`, `gr_utm_term`, `gr_utm_content`
  - `gr_gclid`, `gr_fbclid`
- Conversão: `dataLayer.push({ event: 'lead_form_submit' })` na thank-you page

## Schemas JSON-LD

- {{SCHEMA_NEGOCIO}} — schema principal do nicho
- FAQPage — {{FAQ_COUNT}} perguntas
- BreadcrumbList — navegação
- {{SCHEMAS_EXTRAS}} — schemas adicionais por objetivo

## SEO

- **Keyword primária:** {{KEYWORD_PRIMARIA}}
- **Keywords secundárias:** {{KEYWORDS_SECUNDARIAS}}
- **Title tag:** {{TITLE_TAG}}
- **Meta description:** {{META_DESCRIPTION}}
- **Sitemap:** incluído e submetido
- **robots.txt:** configurado para indexação

## Funcionalidades

| Funcionalidade | Status |
|---------------|--------|
| FAQ accordion ({{FAQ_COUNT}} perguntas) | ✅ |
| Menu mobile (hamburger) | ✅ |
| Scroll reveal animations | ✅ |
| Scroll progress bar | ✅ |
| UTM capture + passthrough | ✅ |
| Webhook POST (form submit) | ✅ |
| Exit-intent popup | ✅ |
| CTA shimmer animation | ✅ |
| Toasts prova social (download) | {{TOAST_STATUS}} |
| Conversão tracking (thank-you) | {{CONVERSION_STATUS}} |

## Manutenção

### Editar textos
Abra `index.html` em qualquer editor de texto, localize o trecho e altere. Reenvie o arquivo para o servidor.

### Adicionar perguntas ao FAQ
1. Duplique um bloco `faq-item` no HTML
2. Altere a pergunta e resposta
3. Adicione a mesma pergunta no schema JSON-LD (bloco `FAQPage`)

### Alterar webhook
Busque `webhook` no HTML e troque a URL.

### Adicionar tags no GTM
Configure diretamente no painel do Google Tag Manager — não é necessário alterar o código.

### Atualizar sitemap
Se adicionar novas páginas, edite `sitemap.xml` e adicione as novas URLs.
