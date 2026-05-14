# Fase 8 — QA (Detalhamento)

## Explicação para o usuário

> "Antes de publicar, testamos tudo automaticamente — links, formulário, visual no celular, velocidade. É como uma revisão final antes de imprimir um contrato: muito mais fácil corrigir agora do que depois de estar no ar com anúncios rodando."

## Camada 1 — Checklist Automático (42 verificações)

Varre o HTML sem abrir browser:

### ESTRUTURA
- [ ] DOCTYPE html presente
- [ ] lang="pt-BR" definido
- [ ] charset UTF-8
- [ ] viewport meta tag
- [ ] Arquivo único (sem dependências locais quebradas)

### META & SEO
- [ ] Title tag presente e < 60 chars
- [ ] Meta description presente e < 160 chars
- [ ] Canonical URL definida
- [ ] robots meta permite indexação
- [ ] Open Graph completo (title, desc, image, url)
- [ ] Twitter Card completo
- [ ] Favicon referenciado
- [ ] Keyword primária no title + H1

### SCHEMAS
- [ ] JSON-LD válido (parse sem erro)
- [ ] FAQPage com ≥ 10 perguntas
- [ ] Schema de negócio presente (por nicho)
- [ ] BreadcrumbList presente
- [ ] Perguntas do schema = perguntas do HTML

### LINKS & ASSETS
- [ ] Âncoras internas (#id) existem no HTML
- [ ] Imagens referenciadas existem na pasta
- [ ] Alt text em todas as imagens
- [ ] Links externos com target="_blank" rel="noopener"
- [ ] Nenhum link localhost ou caminho absoluto local
- [ ] Nomes de arquivo URL-safe (sem espaços, sem acentos)

### FUNCIONALIDADES
- [ ] GTM head snippet presente
- [ ] GTM noscript após `<body>`
- [ ] Script de UTM capture presente
- [ ] Webhook URL configurada no form
- [ ] Exit-intent popup HTML presente
- [ ] robots.txt e sitemap.xml na pasta

### ACESSIBILIDADE
- [ ] aria-label nos botões de ícone
- [ ] aria-expanded nos accordions
- [ ] aria-hidden nos ícones decorativos
- [ ] Contraste de cores suficiente
- [ ] Hierarquia de headings sem pulos

**Se encontrar erros → corrige automaticamente e relata.**

---

## Camada 2 — Design Review (`/design-review`)

Olho de designer automatizado — analisa o HTML renderizado e corrige:

| Categoria | O que verifica |
|-----------|---------------|
| Espaçamento | Padding/margin inconsistentes entre seções, gap irregular entre cards |
| Hierarquia visual | Tamanho de fontes sem contraste claro entre título/subtítulo/corpo |
| Alinhamento | Elementos desalinhados no grid, centralização quebrada |
| Cores | Contraste insuficiente, uso de cores fora da paleta MD3 definida |
| Responsividade | Elementos que quebram entre breakpoints (375px ↔ 768px ↔ 1440px) |
| AI slop | Padrões genéricos — gradientes desnecessários, sombras excessivas, ícones decorativos |
| Micro-interações | Hovers sem resposta, transições bruscas, animações sem easing |
| Tipografia | Line-height apertado, parágrafos largos demais (>75 chars por linha) |
| Imagens | Proporções distorcidas, pixeladas, falta de border-radius consistente |
| Whitespace | Seções muito comprimidas ou com espaço vazio excessivo |

**Fluxo:**
1. `/design-review` abre a página no Playwright
2. Analisa cada seção e lista problemas encontrados
3. Corrige diretamente no HTML (edita classes Tailwind, ajusta espaçamentos)
4. Re-renderiza e valida que a correção não quebrou outra coisa
5. Repete até score visual ≥ 9/10

---

## Camada 3 — QA Funcional com Playwright

### Screenshots automáticos

| Viewport | Largura | Representa |
|----------|---------|-----------|
| Mobile | 375px | iPhone SE/13 mini |
| Tablet | 768px | iPad |
| Desktop | 1440px | Monitor padrão |

### Testes de interação (18 testes)

| Componente | Testes |
|-----------|--------|
| Navbar | Hamburger abre, link ancora scrolla, menu fecha no mobile |
| FAQ | Click expande, click outro fecha anterior, todas funcionam |
| Formulário | Submit vazio bloqueado, preenchido → webhook recebe POST com UTMs |
| Exit-intent | Mouse sai → popup aparece, X/overlay/Esc fecha, não repete na sessão |
| Animações | Scroll reveal funciona, shimmer animando, progress bar avança |
| Download | PDF baixa, toasts aparecem após 3s, não repetem ordem |
| Thank-you | dataLayer.push dispara, links de cross-sell funcionam |
| UTM flow | LP com params → sessionStorage → links/form/páginas auxiliares preservam |

### Relatório de QA

```
╔══════════════════════════════════════╗
║        RELATÓRIO DE QA              ║
╠══════════════════════════════════════╣
║  Checklist automático:  42/42 ✅     ║
║  Design review:         9.5/10 ✅    ║
║  Testes Playwright:     18/18 ✅     ║
║  Screenshots: Mobile/Tablet/Desktop ║
║  Erros: 0  |  Avisos: X            ║
║  Status: APROVADO PARA DEPLOY ✅    ║
╚══════════════════════════════════════╝
```

Se encontrar erros → corrige no HTML e roda novamente.
