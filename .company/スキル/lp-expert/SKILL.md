---
name: lp-expert
description: |
  Skill orquestradora para criação de landing pages de alta conversão — do zero até o deploy.
  Replicável para qualquer cliente e qualquer nicho. Gera HTML único com Tailwind CSS,
  Material Design 3, SEO técnico (GEO/AEO), QA automatizado e deploy SFTP ou ZIP.
  Use quando o usuário pedir para criar landing page, LP, página de captura, página de vendas,
  ou qualquer variação de "criar uma página de conversão".
argument-hint: "[create|resume]"
metadata:
  author: Paulo Guedes
  version: "1.0.0"
  license: MIT
  lang: pt-BR
---

# /lp-expert — Landing Page Expert

Skill orquestradora que cria landing pages de alta conversão do zero ao deploy.
Delega para skills especializadas e guia o usuário passo a passo.

## Skills Integradas

- `/seo-plan` — Keywords e estratégia SEO
- `/seo-geo` — Generative Engine Optimization (AEO/GEO)
- `/seo-schema` — Structured Data JSON-LD
- `/seo-page` — On-page técnico
- `/copywriting` — Geração de copy estratégica
- `/stitch` — Protótipo visual no Google Stitch (opcional)
- `/design` — Logo e assets visuais
- `/brand-identity` — Paleta de cores, tipografia, tokens
- `/design-review` — QA visual automatizado

## Stack Fixa

- HTML único (sem frameworks, sem build tools)
- Tailwind CSS via CDN + config com tokens Material Design 3
- Google Fonts (headline + body por nicho)
- Material Symbols Outlined (ícones)
- Vanilla JS inline (accordion, UTM, webhook, scroll reveal, exit-intent)

## Componentes Sempre Incluídos

- UTM capture + passthrough (sessionStorage)
- Webhook POST (form com campos configuráveis)
- Scroll progress bar
- Exit-intent popup (mouseout desktop, visibilitychange mobile 30s)
- Scroll reveal animations (IntersectionObserver em todos os elementos)
- Formulário de captura (campos definidos no briefing)

## Componentes Opcionais

- Página de download de material rico + toasts de prova social
- Página de thank-you com tracking de conversão
- Botão flutuante de WhatsApp

---

## Fluxo de Execução — 11 Fases

```
/lp-expert
│
├─ Fase 0:  Setup ─────────── 5 perguntas (modo, objetivo, nicho, velocidade, hospedagem)
├─ Fase 1:  Briefing ──────── documento pronto OU questionário interativo (10 perguntas)
├─ Fase 2:  SEO Strategy ──── /seo-plan → keywords, title, description, perguntas AEO
├─ Fase 3:  Copy ──────────── /copywriting (ou valida copy existente + sugere melhorias)
├─ Fase 4:  Design ────────── inventário visual → /stitch (opcional) → tokens MD3 → fontes
├─ Fase 5:  Build ─────────── HTML único com 12 seções + 8 funcionalidades JS inline
├─ Fase 6:  SEO Técnico ───── /seo-geo + /seo-schema + /seo-page (em paralelo)
├─ Fase 7:  Págs Auxiliares ── download + thank-you (opcionais)
├─ Fase 8:  QA ────────────── checklist (42) + /design-review + Playwright (18 testes)
├─ Fase 9:  Deploy ────────── SFTP automático OU ZIP + guia personalizado + validação
└─ Fase 10: Entrega ───────── ENTREGA-TECNICA.md + PROXIMOS-PASSOS.md
```

**Modo rápido (3 checkpoints):** Fase 1, Fase 5, Fase 9
**Modo detalhado (7 checkpoints):** Fases 1, 3, 4, 5, 6, 8, 9

---

## Fase 0 — Setup

Usa `AskUserQuestion` com caixas clicáveis para 5 perguntas:

### P1 — Modo de entrada
> "Você já tem um documento de copy/briefing pronto ou prefere que eu te guie com perguntas?"
> - A) Já tenho documento pronto
> - B) Quero responder perguntas

### P2 — Objetivo da LP
> "Qual o objetivo principal da sua landing page?"
> - A) Capturar leads (nome, email, telefone)
> - B) Venda direta de produto/serviço
> - C) Agendamento de consulta/reunião
> - D) Download de material (e-book, guia, planilha)
> - E) Inscrição em evento (webinar, workshop, palestra)
>
> *Por que isso importa: o objetivo define a estrutura de conversão — onde ficam os botões, que tipo de formulário usar e como medir o sucesso.*

### P3 — Nicho
> "Qual o setor do seu negócio?"
> - A) Jurídico / Advocacia
> - B) Saúde / Clínica / Estética
> - C) SaaS / Tecnologia
> - D) Educação / Cursos
> - E) E-commerce / Produto físico
> - F) Consultoria / Serviços profissionais
> - G) Imobiliário
> - H) Outro (descreva)
>
> *Por que isso importa: cada nicho tem padrões próprios de prova social, linguagem, schemas e objeções.*

### P4 — Velocidade
> "Como prefere trabalhar?"
> - A) Modo rápido — 3 pausas para aprovação (briefing, HTML, deploy)
> - B) Modo detalhado — 7 pausas para aprovação (cada etapa)
>
> *Por que isso importa: no modo rápido, eu tomo mais decisões sozinho. No detalhado, você valida cada etapa.*

### P5 — Hospedagem
> "Onde a página será hospedada?"
> - A) Hostinger
> - B) HostGator
> - C) Outro cPanel
> - D) Vercel / Netlify
> - E) Já tenho um site WordPress (subpasta)
> - F) Ainda não sei
>
> *Por que isso importa: a hospedagem define como vamos publicar. Se tem WordPress, a LP herda a autoridade SEO do domínio.*

---

## Fase 1 — Briefing

Detalhes completos: `${CLAUDE_SKILL_DIR}/references/phases-briefing.md`

**Caminho A — Documento pronto:** busca `.md`/`.txt`/`.docx`, extrai informações, apresenta resumo, pergunta lacunas.

**Caminho B — Questionário interativo:** 10 perguntas via `AskUserQuestion`:
1. Nome da empresa e serviço
2. Público-alvo
3. Dor principal
4. Diferencial
5. Números de credibilidade
6. Depoimentos
7. Concorrentes (URLs → Playwright extrai padrões)
8. Assets visuais (logo, imagens, fotos)
9. Tracking (GTM, Pixel, WhatsApp, Webhook)
10. Campos do formulário

**Checkpoint:** modo rápido ✅ e detalhado ✅

---

## Fase 2 — SEO Strategy

Detalhes: `${CLAUDE_SKILL_DIR}/references/phases-seo.md`

1. Delega para `/seo-plan` com contexto do briefing
2. Recebe: keyword primária, 5-10 secundárias, 10+ perguntas long-tail, title + meta description
3. Apresenta para validação (modo detalhado pausa aqui)
4. Salva keywords como variáveis internas para Fases 3 e 6

---

## Fase 3 — Copy

Detalhes: `${CLAUDE_SKILL_DIR}/references/phases-copy.md`

Três caminhos:
- **A — Copy pronta:** lê, cruza com keywords, sugere melhorias
- **B — Sem copy:** delega para `/copywriting` com briefing + keywords + concorrentes
- **C — Copy parcial:** identifica lacunas, completa mantendo o tom

Estrutura de seções: Hero → Trust Bar → Problema → Prova → Como Funciona → Por que Nós → FAQ (10+) → Checklist → CTA Final → Footer

**Checkpoint:** modo detalhado ✅

---

## Fase 4 — Design

Detalhes: `${CLAUDE_SKILL_DIR}/references/phases-design.md`

1. **Inventário visual** — verifica: logo, cores, imagem hero, protótipo Stitch
2. **Stitch (opcional)** — explica importância, pergunta se quer usar
3. **Design tokens** — paleta MD3 a partir da cor da marca (ou sugestão por nicho)
4. **Fontes** — combinação Google Fonts por nicho

**Checkpoint:** modo detalhado ✅

---

## Fase 5 — Build

Detalhes: `${CLAUDE_SKILL_DIR}/references/phases-build.md`

Gera `index.html` único com 12 seções e 8 funcionalidades JS:

Seções: Navbar → Hero → Trust Bar → Problema → Prova → Como Funciona → Por que Nós → FAQ → Checklist → CTA Final → Formulário → Footer

JS inline: FAQ accordion, menu mobile, scroll reveal, progress bar, UTM capture, webhook POST, exit-intent popup, shimmer animation

**Checkpoint:** modo rápido ✅ e detalhado ✅

---

## Fase 6 — SEO Técnico

Detalhes: `${CLAUDE_SKILL_DIR}/references/phases-seo.md`

Três skills em paralelo:
- `/seo-geo` — citações, dados estatísticos, passagens autocontidas, FAQ long-tail
- `/seo-schema` — JSON-LD por nicho + objetivo (FAQPage, BreadcrumbList, schemas específicos)
- `/seo-page` — checklist on-page (title, meta, H1, alt, canonical, OG, robots)

Gera: `robots.txt` + `sitemap.xml`

**Checkpoint:** modo detalhado ✅

---

## Fase 7 — Páginas Auxiliares

Detalhes: `${CLAUDE_SKILL_DIR}/references/phases-auxiliary.md`

Pergunta ao usuário quais criar:
- **Download page:** capa do material, botão download, toasts de prova social (24 nomes, 16 estados, Fisher-Yates)
- **Thank-you page:** confirmação visual, cross-sell, dataLayer.push para conversão

---

## Fase 8 — QA

Detalhes: `${CLAUDE_SKILL_DIR}/references/phases-qa.md`

### Camada 1 — Checklist Automático (42 verificações)
Estrutura, Meta/SEO, Schemas, Links/Assets, Funcionalidades, Acessibilidade

### Camada 2 — Design Review (`/design-review`)
Espaçamento, hierarquia, alinhamento, cores, responsividade, AI slop, tipografia. Score ≥ 9/10.

### Camada 3 — QA Funcional (Playwright)
Screenshots 3 viewports (375px, 768px, 1440px) + 18 testes de interação.

**Checkpoint:** modo detalhado ✅

---

## Fase 9 — Deploy

Detalhes: `${CLAUDE_SKILL_DIR}/references/phases-deploy.md`

### Caminho A — SFTP automático
Guia para credenciais → `.env` temporário (gitignored, chmod 600) → SFTP upload → validação Playwright → limpeza credenciais

### Caminho B — ZIP + guia manual
Gera ZIP + guia passo a passo personalizado por hospedagem (cPanel, WordPress, Vercel/Netlify)

Validação em produção: SSL, imagens, links, og:image, webhook, UTMs.

**Checkpoint:** modo rápido ✅ e detalhado ✅

---

## Fase 10 — Entrega

Gera dois documentos na pasta `docs/` do projeto:

1. **`ENTREGA-TECNICA.md`** — URLs, stack, tracking, schemas, SEO, manutenção
   Template: `${CLAUDE_SKILL_DIR}/templates/ENTREGA-TECNICA.md`

2. **`PROXIMOS-PASSOS.md`** — Search Console, Google Ads, Meta Ads, conteúdo, SEO contínuo, prova social, expansão
   Template: `${CLAUDE_SKILL_DIR}/templates/PROXIMOS-PASSOS.md`

### Mensagem final
> "Projeto concluído! Quando precisar de uma nova landing page — para outro serviço, cliente ou nicho — é só usar `/lp-expert` novamente."

---

## Regras Globais

1. **Linguagem acessível**: cada passo explica "por que importa" para leigos
2. **Nunca salvar credenciais** em memória persistente — apenas `.env` temporário
3. **Sempre priorizar SFTP** (criptografado) sobre FTP
4. **FAQ mínimo 10 perguntas** — otimizadas para featured snippets e AI search
5. **Schemas JSON-LD** adaptados por nicho + objetivo
6. **Concorrentes via Playwright** — extrai padrões de URLs fornecidas
7. **Stitch sempre opcional** — explicar importância mas respeitar a decisão
8. **QA 3 camadas** — nunca pular: checklist → design review → Playwright
9. **Validação pós-deploy** — sempre verificar em produção antes de entregar
10. **Documentos de entrega** — sempre gerar, mesmo no modo rápido
