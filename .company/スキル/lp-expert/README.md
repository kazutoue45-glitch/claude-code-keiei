# /lp-expert

Skill para [Claude Code](https://claude.com/claude-code) que cria landing pages de alta conversão do zero ao deploy.

Orquestra 10 skills especializadas para entregar uma LP completa: briefing, SEO, copy, design, build, QA e deploy — tudo guiado por perguntas interativas.

## Funcionalidades

- **11 fases automatizadas** — do setup ao relatório de entrega
- **Multi-nicho** — jurídico, saúde, SaaS, educação, imobiliário, estética e mais
- **Multi-objetivo** — captura de leads, venda, agendamento, download, evento
- **SEO completo** — keywords, GEO/AEO (otimizado para IAs), schemas JSON-LD, on-page
- **QA em 3 camadas** — checklist automático (42 checks), design review visual, testes Playwright
- **Deploy integrado** — SFTP automático ou ZIP com guia personalizado
- **Dois modos** — rápido (3 checkpoints) ou detalhado (7 checkpoints)

## Pré-requisitos

- [Claude Code](https://claude.com/claude-code) instalado
- Skills de SEO do ecossistema (opcionais, mas recomendadas):
  - `/seo-plan`, `/seo-geo`, `/seo-schema`, `/seo-page`
- Skills de conteúdo/design (opcionais):
  - `/copywriting`, `/brand-identity`, `/design`, `/design-review`
- `/stitch` (opcional — para prototipagem visual no Google Stitch)
- Playwright MCP configurado (para análise de concorrentes e QA funcional)

## Instalacao

### Opcao 1 — Clone direto (recomendado)

```bash
git clone https://github.com/SEU_USUARIO/lp-expert.git ~/.claude/skills/lp-expert
```

### Opcao 2 — Download manual

1. Baixe o ZIP deste repositório
2. Extraia para `~/.claude/skills/lp-expert/`
3. Verifique que o arquivo `SKILL.md` está em `~/.claude/skills/lp-expert/SKILL.md`

### Verificacao

Abra o Claude Code e digite `/lp-expert`. Se a skill aparecer no autocomplete, a instalação foi bem-sucedida.

## Uso

### Comando basico

```
/lp-expert
```

Inicia o fluxo completo com perguntas interativas.

### Resumir sessao anterior

```
/lp-expert resume
```

Retoma de onde parou (se houver projeto em andamento).

## Fluxo de Fases

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

## Stack Tecnica

Toda LP gerada usa:

| Tecnologia | Versão | Propósito |
|-----------|--------|-----------|
| HTML5 | - | Estrutura (arquivo único) |
| Tailwind CSS | 3.x (CDN) | Estilização utility-first |
| Material Design 3 | Tokens | Sistema de cores |
| Google Fonts | - | Tipografia (par por nicho) |
| Material Symbols | Outlined | Iconografia |
| Vanilla JS | ES6+ | Interatividade (inline) |

**Zero dependências de build.** Abre em qualquer navegador, roda em qualquer hospedagem.

## Estrutura do Repositorio

```
lp-expert/
├── SKILL.md                        ← Arquivo principal da skill
├── README.md                       ← Este arquivo
├── LICENSE                         ← Licença MIT
├── CHANGELOG.md                    ← Histórico de versões
├── .gitignore
├── references/                     ← Documentação detalhada por fase
│   ├── phases-briefing.md          ← Fase 1: questionário completo
│   ├── phases-copy.md              ← Fase 3: estrutura de seções
│   ├── phases-design.md            ← Fase 4: tokens, fontes, Stitch
│   ├── phases-build.md             ← Fase 5: engine de montagem HTML
│   ├── phases-seo.md               ← Fases 2+6: estratégia + técnico
│   ├── phases-auxiliary.md         ← Fase 7: download + thank-you
│   ├── phases-qa.md                ← Fase 8: 3 camadas de QA
│   └── phases-deploy.md            ← Fase 9: SFTP + ZIP
├── templates/                      ← Templates de entrega
│   ├── ENTREGA-TECNICA.md          ← Resumo técnico do projeto
│   └── PROXIMOS-PASSOS.md          ← Relatório de marketing
└── examples/                       ← Exemplos de projetos reais
    └── juridico-consorcio/
        └── README.md               ← Case: restituição de consórcio
```

## Nichos Suportados

| Nicho | Cores sugeridas | Fontes | Schemas |
|-------|----------------|--------|---------|
| Jurídico | Azul marinho + Dourado | Plus Jakarta Sans + Inter | LegalService, HowTo |
| Saúde | Verde/Teal + Azul | DM Sans + Inter | MedicalBusiness, Physician |
| SaaS | Roxo/Índigo + Verde | Space Grotesk + Inter | SoftwareApplication, Product |
| Educação | Azul royal + Laranja | Nunito + Source Sans 3 | Course, Organization |
| Imobiliário | Verde escuro + Dourado | Plus Jakarta Sans + Inter | RealEstateAgent, Offer |
| Estética | Rosa/Nude + Dourado | Playfair Display + Lato | HealthAndBeautyBusiness |

## Exemplos

### Case: Restituição de Consórcio (Jurídico)

LP criada para escritório de advocacia especializado em restituição de consórcio. Detalhes em [examples/juridico-consorcio/](examples/juridico-consorcio/).

**Resultado:**
- LP principal com 12 seções + exit-intent popup
- Página de download com toasts de prova social (24 nomes, 16 estados)
- FAQ com 11 perguntas otimizadas para AEO
- 4 schemas JSON-LD (LegalService, FAQPage, BreadcrumbList, HowTo)
- GEO: citações legais (art. 53 CDC, Lei 11.795/2008, ABAC)
- Deploy em subpasta WordPress (herda autoridade do domínio)

## Contribuindo

Contribuições são bem-vindas! Veja [CONTRIBUTING.md](CONTRIBUTING.md) para detalhes.

### Como contribuir

1. Fork este repositório
2. Crie uma branch (`git checkout -b feature/novo-nicho`)
3. Faça suas alterações
4. Teste com `/lp-expert` no Claude Code
5. Commit (`git commit -m 'Add: suporte para nicho X'`)
6. Push (`git push origin feature/novo-nicho`)
7. Abra um Pull Request

### Ideias para contribuição

- Novos nichos (financeiro, fitness, alimentação, etc.)
- Novos objetivos de LP (quiz funnel, waitlist, etc.)
- Templates de copy por nicho
- Integrações com outras plataformas de hospedagem
- Traduções (EN, ES)

## Licenca

[MIT](LICENSE)

---

Feito com Claude Code.
