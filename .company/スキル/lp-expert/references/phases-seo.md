# Fases 2 e 6 — SEO (Detalhamento)

## Fase 2 — SEO Strategy

### Explicação para o usuário

> "Antes de escrever qualquer texto, precisamos saber quais palavras as pessoas usam para buscar o seu serviço no Google e em IAs como ChatGPT e Perplexity. Isso guia toda a copy, títulos e perguntas do FAQ — para que sua página apareça exatamente quando alguém procurar pelo que você oferece."

### Fluxo

1. **Delega para `/seo-plan`** com o contexto do briefing (nicho, serviço, localização, concorrentes)
2. Recebe de volta:
   - Keyword primária (ex: "restituição de consórcio")
   - 5-10 keywords secundárias (ex: "devolução consórcio cancelado", "prazo prescrição consórcio")
   - 10+ perguntas long-tail para FAQ/AEO
   - Sugestão de title tag e meta description
3. **Apresenta ao usuário** (no modo detalhado, pausa aqui):
   > "Estas são as palavras-chave que vou usar como base para toda a página. Quer ajustar alguma?"
4. Keywords ficam salvas como variáveis internas para alimentar Fases 3 e 6

### Cruzamento Objetivo + Nicho

| Objetivo | Nicho | Schema principal | Keywords típicas |
|----------|-------|-----------------|-----------------|
| Lead capture | Jurídico | LegalService + FAQPage | "[serviço] advogado [cidade]" |
| Lead capture | Saúde | MedicalBusiness + FAQPage | "[procedimento] [cidade] preço" |
| Venda | SaaS | SoftwareApplication + Product | "[produto] vs [concorrente]" |
| Download | Educação | Course + FAQPage | "[tema] guia gratuito PDF" |
| Agendamento | Estética | HealthAndBeautyBusiness | "agendar [procedimento] [cidade]" |

---

## Fase 6 — SEO Técnico

### Explicação para o usuário

> "O HTML está pronto e bonito, mas o Google e as IAs ainda não conseguem entender 100% do que sua página oferece. Agora vamos adicionar marcações invisíveis ao visitante, mas que fazem sua página aparecer com destaque no Google, ser citada pelo ChatGPT e Perplexity, e ganhar aqueles cards especiais nos resultados de busca."

### Três skills em paralelo

```
           ┌──→ /seo-geo ────→ Otimização GEO/AEO
Fase 6 ────┼──→ /seo-schema ──→ Structured Data
           └──→ /seo-page ───→ On-page técnico
```

### /seo-geo — Generative Engine Optimization

Torna o conteúdo citável por IAs (ChatGPT, Perplexity, Gemini, Copilot):

| Ação | Exemplo |
|------|---------|
| Inserir citações legais/técnicas | "conforme o art. 53 do CDC" |
| Adicionar dados estatísticos com fonte | "segundo dados da ABAC, 10M+ consorciados ativos" |
| Formatar passagens autocontidas | Frases que funcionam como resposta completa isoladamente |
| Expandir FAQ com perguntas long-tail | "qual o prazo de prescrição para restituição de consórcio?" |
| Meta tag para AI crawlers | `<meta name="robots" content="max-snippet:-1">` |

**Referências citáveis por nicho:**

| Nicho | Fontes |
|-------|--------|
| Jurídico | Artigos de lei, CDC, STJ, STF, ABAC, BACEN |
| Saúde | ANVISA, CFM, OMS, estudos PubMed |
| SaaS | Gartner, Forrester, G2, benchmarks do setor |
| Educação | MEC, INEP, dados IBGE |
| Imobiliário | SECOVI, CRECI, índice FipeZap |
| Estética | ANVISA, SBCP, estudos clínicos |

### /seo-schema — Structured Data (JSON-LD)

**Schemas obrigatórios (toda LP):**
- BreadcrumbList (navegação)
- FAQPage (perguntas do FAQ)
- WebPage (metadados da página)

**Schemas por nicho:**

| Nicho | Schema adicional | Rich result |
|-------|-----------------|-------------|
| Jurídico | LegalService + HowTo | Card de serviço + "Como fazer" |
| Saúde | MedicalBusiness + Physician | Card com endereço + médico |
| SaaS | SoftwareApplication + Product | Estrelas + preço |
| Educação | Course + Organization | Card de curso |
| Imobiliário | RealEstateAgent + Offer | Card com faixa de preço |
| Estética | HealthAndBeautyBusiness | Card com horários |
| Evento | Event + Offer | Card de evento com data |

**Schemas por objetivo:**

| Objetivo | Schema adicional |
|----------|-----------------|
| Captura de lead | ContactPoint + potentialAction |
| Download | DigitalDocument + DownloadAction |
| Agendamento | reservationAction + Schedule |
| Venda | Product + Offer + AggregateRating |

### /seo-page — On-page Técnico

Checklist automático:
- Title tag contém keyword primária (< 60 chars)
- Meta description contém keyword + CTA (< 160 chars)
- H1 único com keyword primária
- H2s contêm keywords secundárias
- Alt text em todas as imagens (descritivo + keyword)
- Canonical URL definida
- Open Graph completo (title, desc, image, url)
- Twitter Card completo
- Favicon presente
- Lang="pt-BR" no `<html>`
- robots meta permite indexação + AI snippets
- Links internos (âncoras) funcionando
- Sem conteúdo duplicado entre sections
- FAQ respostas ≠ texto das seções (evita canibalização)

### Arquivos gerados

```
deploy/
├── index.html      ← atualizado com schemas + otimizações
├── robots.txt      ← gerado
└── sitemap.xml     ← gerado
```
