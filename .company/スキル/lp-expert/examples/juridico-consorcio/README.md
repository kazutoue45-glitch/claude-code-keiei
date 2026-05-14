# Case: Restituição de Consórcio — Guedes & Ramos Advogados

## Resumo

Landing page criada para escritório de advocacia especializado em restituição de valores de consórcio (cancelado, desistência ou não contemplado).

## Dados do projeto

| Campo | Valor |
|-------|-------|
| **Nicho** | Jurídico / Advocacia |
| **Objetivo** | Captura de leads (nome + telefone) + Download de e-book |
| **Keyword primária** | restituição de consórcio |
| **Hospedagem** | WordPress (subpasta `/consorcio/`) |
| **Modo** | Detalhado |

## O que foi entregue

### LP principal (`index.html`)
- ~960 linhas, arquivo único
- 12 seções: navbar, hero, trust bar, problema, prova legal, como funciona, diferenciais + depoimentos, FAQ (11 perguntas), checklist de qualificação, CTA final, formulário, footer
- Exit-intent popup com oferta de e-book
- Webhook POST com dados do form + UTMs + gclid/fbclid
- GTM-KNPCVGJT instalado

### Página de download (`download/index.html`)
- ~480 linhas
- Botão de download do PDF
- Toasts de prova social: 24 nomes fictícios de 16+ estados brasileiros
- Fisher-Yates shuffle, 3s delay inicial, 5s intervalo, 4s duração

### Arquivos de suporte
- `robots.txt` — permite indexação
- `sitemap.xml` — 2 URLs
- `LOGO-1.svg` — logo dark
- `hero-consorcio.jpg` — imagem hero
- `ebook-capa.jpg` — capa do e-book
- `ebook-restituicao-consorcio.pdf` — material para download

## Stack

- HTML5 + Tailwind CSS 3.x CDN
- Material Design 3 tokens (azul marinho + dourado)
- Plus Jakarta Sans (800) + Inter (400/500)
- Material Symbols Outlined
- Vanilla JS inline

## SEO

### Keywords
- Primária: "restituição de consórcio"
- Secundárias: cancelamento de consórcio, devolução de parcelas, prazo prescrição consórcio, direitos do consorciado, restituição imediata consórcio

### GEO/AEO
- Citações legais: art. 53 CDC, Lei 11.795/2008, STJ
- Dados: ABAC (10M+ consorciados ativos)
- FAQ: 11 perguntas long-tail otimizadas para AI search

### Schemas JSON-LD
- LegalService (serviço jurídico)
- FAQPage (11 perguntas)
- BreadcrumbList (navegação)
- HowTo (processo de restituição)

## Resultado

- Deploy em `guedeseramos.com/consorcio/` (subpasta WordPress)
- Herda autoridade SEO do domínio principal
- GTM configurado para tracking independente
- Pronto para campanhas Google Ads e Meta Ads

## Aprendizados

1. **Subpasta WordPress > página WordPress** — HTML estático em subpasta herda autoridade do domínio sem peso do PHP/MySQL
2. **Exit-intent + material rico** — popup oferecendo e-book captura quem ia sair sem converter
3. **Toasts de prova social** — geram urgência na página de download (efeito FOMO)
4. **GEO com citações legais** — artigos de lei e jurisprudência tornam o conteúdo citável por IAs
5. **FAQ 10+** — fundamental para featured snippets e AI Overviews
